
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pdf from 'pdf-parse';

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use Service Role for Admin Access
const SOURCE_DIR = 'G:\\BALOTARIO 2026\\BALOTARIOS 2025_2026';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Environment Variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function calculateChecksum(filePath: string): Promise<string> {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

async function extractTextFromPdf(filePath: string): Promise<{ text: string; pageCount: number }> {
    const dataBuffer = fs.readFileSync(filePath);
    try {
        const data = await pdf(dataBuffer);
        return {
            text: data.text,
            pageCount: data.numpages
        };
    } catch (error: any) {
        console.error(`Error parsing PDF ${filePath}:`, error);
        throw error;
    }
}

async function processFiles() {
    console.log(`🚀 Starting PDF Import from: ${SOURCE_DIR}`);

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(file => file.toLowerCase().endsWith('.pdf'));
    console.log(`Found ${files.length} PDF files.`);

    for (const file of files) {
        const filePath = path.join(SOURCE_DIR, file);
        console.log(`\nProcessing: ${file}`);

        try {
            // 1. Calculate Checksum
            const checksum = await calculateChecksum(filePath);

            // 2. Check if exists
            const { data: existing } = await supabase
                .from('source_documents')
                .select('id, filename')
                .eq('sha256', checksum)
                .single();

            if (existing) {
                console.log(`   ✅ Already exists (Skipping): ${existing.filename}`);
                continue;
            }

            // 3. Extract Text
            console.log('   🔍 Extracting text...');
            const { text, pageCount } = await extractTextFromPdf(filePath);

            // 4. Upload to Supabase (Metadata + Text)
            console.log('   ☁️ Uploading metadata and text to Supabase...');
            const { error } = await supabase.from('source_documents').insert({
                filename: file,
                storage_path: filePath, // Storing local path for reference
                sha256: checksum,
                extracted_text: text, // Storing extracted text for Q&A generation
                page_count: pageCount,
                import_status: 'completed',
                imported_at: new Date().toISOString()
            });

            if (error) {
                console.error(`   ❌ Supabase Insert Error: ${error.message}`);
            } else {
                console.log(`   ✨ Success! Imported ${file}`);
            }

        } catch (err: any) {
            console.error(`   ❌ Failed to process ${file}:`, err.message);
        }
    }

    console.log('\n🏁 Import Process Completed.');
}

processFiles();

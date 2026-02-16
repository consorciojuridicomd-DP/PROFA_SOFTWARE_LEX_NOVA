
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import crypto from 'crypto';

const require = createRequire(import.meta.url);
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Robust pdf-parse import
let PDFParse;
try {
    const pdfLib = require('pdf-parse');
    PDFParse = pdfLib.PDFParse || pdfLib;
} catch (e) {
    console.error('Error loading pdf-parse:', e);
}

const SOURCE_DIR = 'G:\\BALOTARIO 2026\\BALOTARIOS 2025_2026';
const OUTPUT_FILE = 'extracted_data.json';

async function calculateChecksum(filePath: string): Promise<string> {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

async function extractTextFromPdf(filePath: string): Promise<{ text: string; pageCount: number }> {
    const dataBuffer = fs.readFileSync(filePath);
    try {
        // PDFParse class usage based on v2.x analysis
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        const info = await parser.getInfo();
        const pageCount = info.total || 0;

        return {
            text: data.text,
            pageCount: pageCount
        };
    } catch (error: any) {
        console.error(`Error parsing PDF ${filePath}:`, error);
        return { text: '', pageCount: 0 };
    }
}

async function processFiles() {
    console.log(`🚀 Starting PDF Extraction (Offline Mode) from: ${SOURCE_DIR}`);

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(file => file.toLowerCase().endsWith('.pdf'));
    console.log(`Found ${files.length} PDF files.`);

    const extractedData = [];

    for (const file of files) {
        const filePath = path.join(SOURCE_DIR, file);
        console.log(`\nProcessing: ${file}`);

        try {
            const checksum = await calculateChecksum(filePath);
            console.log('   🔍 Extracting text...');
            const { text, pageCount } = await extractTextFromPdf(filePath);

            if (text) {
                extractedData.push({
                    filename: file,
                    storage_path: filePath,
                    sha256: checksum,
                    extracted_text: text,
                    page_count: pageCount,
                    imported_at: new Date().toISOString()
                });
                console.log(`   ✨ Extracted ${pageCount} pages.`);
            } else {
                console.warn(`   ⚠️ No text extracted from ${file}`);
            }

        } catch (err: any) {
            console.error(`   ❌ Failed to process ${file}:`, err.message);
        }
    }

    console.log(`\n📦 Saving ${extractedData.length} records to ${OUTPUT_FILE}...`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(extractedData, null, 2));
    console.log('🏁 Extraction Process Completed. Ready for Agent Ingestion.');
}

processFiles();

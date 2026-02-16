
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase URL or Anon Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const inputFile = process.argv[2];
if (!inputFile) {
    console.error('Usage: node scripts/upload_with_auth.ts <input_file>');
    process.exit(1);
}

async function upload() {
    console.log(`🚀 Starting Authenticated Upload for ${inputFile}...`);

    // 1. Authenticate as Admin
    console.log('🔑 Authenticating as Admin (20068708@lexnova.app)...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: '20068708@lexnova.app',
        password: 'Admin123!'
    });

    if (authError) {
        console.error('❌ Authentication Failed:', authError.message);
        process.exit(1);
    }
    console.log('✅ Authentication Successful!');

    // 2. Read File
    console.log('📂 Reading input file...');
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const record = JSON.parse(rawData);

    // 3. Insert Record
    console.log(`📤 Uploading '${record.filename}' (${record.page_count} pages, ${record.extracted_text.length} chars)...`);

    // Check if exists first (optional, but good for idempotency)
    const { data: existing, error: searchError } = await supabase
        .from('source_documents')
        .select('id')
        .eq('sha256', record.sha256)
        .maybeSingle();

    if (existing) {
        console.log(`⚠️ Record already exists (ID: ${existing.id}). Skipping insert.`);
        return;
    }

    const payload = {
        filename: record.filename,
        storage_path: record.storage_path,
        sha256: record.sha256,
        extracted_text: record.extracted_text, // Full text
        page_count: record.page_count,
        imported_at: record.imported_at,
        import_status: 'completed' // Mark as completed
    };

    const { data: insertData, error: insertError } = await supabase
        .from('source_documents')
        .insert(payload)
        .select();

    if (insertError) {
        console.error('❌ Insert Failed:', insertError.message);
        process.exit(1);
    }

    console.log(`✅ Successfully inserted record! ID: ${insertData[0].id}`);
}

upload();


const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2];
const outputDir = 'sql_jobs';
const CHUNK_SIZE = 500000; // 500KB chunks

if (!inputFile) {
    console.error('Usage: node scripts/split_json_to_sql.js <input_json_file>');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const text = data.extracted_text || '';
const filename = data.filename;
const sha256 = data.sha256;
const pageCount = data.page_count;
const importedAt = data.imported_at;
const storagePath = data.storage_path.replace(/\\/g, '\\\\'); // Escape backslashes for SQL string if needed, or use E string

// Verify if exists first (Agent handles this via SELECT check, but we assume we want to insert)
// We will generate:
// 1. INSERT with first chunk.
// 2. UPDATES with subsequent chunks.

const chunks = [];
for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
}

console.log(`Splitting '${filename}' (${text.length} chars) into ${chunks.length} chunks.`);

chunks.forEach((chunk, index) => {
    let sql = '';
    const safeChunk = chunk.replace(/'/g, "''"); // Escape single quotes

    if (index === 0) {
        // First chunk: INSERT
        sql = `INSERT INTO source_documents (filename, storage_path, sha256, extracted_text, page_count, imported_at, import_status)
VALUES (
    '${filename.replace(/'/g, "''")}',
    E'${storagePath}',
    '${sha256}',
    '${safeChunk}',
    ${pageCount},
    '${importedAt}',
    'inserted_partial'
) ON CONFLICT (id) DO NOTHING;`;
    } else {
        // Subsequent chunks: UPDATE
        // We identify by SHA256 since we don't have ID returned easily in this offline script
        sql = `UPDATE source_documents SET extracted_text = extracted_text || '${safeChunk}' WHERE sha256 = '${sha256}';`;
    }

    if (index === chunks.length - 1) {
        // Last chunk: Update status to completed
        sql += `\nUPDATE source_documents SET import_status = 'completed' WHERE sha256 = '${sha256}';`;
    }

    const outPath = path.join(outputDir, `insert_${sha256.substring(0, 8)}_part_${index}.sql`);
    fs.writeFileSync(outPath, sql);
});

console.log(`Generated ${chunks.length} SQL files in ${outputDir}`);

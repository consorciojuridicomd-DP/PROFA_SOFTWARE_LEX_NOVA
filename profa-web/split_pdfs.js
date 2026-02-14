const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

// Configuration
const SOURCE_DIR = path.resolve(__dirname, '../basedeconocimiento');
const MAX_SIZE_MB = 90; // Leave buffer for git overhead (limit is 100MB)
const MAX_BYTES = MAX_SIZE_MB * 1024 * 1024;

console.log(`🚀 Starting PDF Splitter`);
console.log(`📂 Source Directory: ${SOURCE_DIR}`);
console.log(`📏 Max Chunk Size: ${MAX_SIZE_MB} MB`);

async function getPdfPageCount(filePath) {
    const buffer = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
}

async function splitPdf(filePath) {
    const fileName = path.basename(filePath);
    const fileStats = fs.statSync(filePath);
    const fileSizeMB = fileStats.size / (1024 * 1024);

    if (fileSizeMB < MAX_SIZE_MB) {
        console.log(`✅ [SKIP] ${fileName} is ${fileSizeMB.toFixed(2)} MB (Under limit)`);
        return;
    }

    console.log(`✂️ [SPLIT] ${fileName} is ${fileSizeMB.toFixed(2)} MB. Splitting...`);

    try {
        const buffer = fs.readFileSync(filePath);
        const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const totalPages = srcDoc.getPageCount();

        // Estimate pages per chunk (rough heuristic: assumes uniform page size)
        // We target 80% of max size to be safe
        const estimatedParts = Math.ceil(fileSizeMB / (MAX_SIZE_MB * 0.8));
        const pagesPerPart = Math.ceil(totalPages / estimatedParts);

        console.log(`   -> Total Pages: ${totalPages}`);
        console.log(`   -> Estimated Parts: ${estimatedParts}`);
        console.log(`   -> Pages per Part: ~${pagesPerPart}`);

        for (let i = 0; i < estimatedParts; i++) {
            const startPage = i * pagesPerPart;
            const endPage = Math.min((i + 1) * pagesPerPart, totalPages);

            if (startPage >= totalPages) break;

            // Create new PDF
            const newDoc = await PDFDocument.create();
            // Copy pages
            const pageIndices = Array.from({ length: endPage - startPage }, (_, k) => k + startPage);
            const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
            copiedPages.forEach(page => newDoc.addPage(page));

            // Save
            const partBytes = await newDoc.save();
            const partName = `${fileName.replace('.pdf', '')}_part${i + 1}.pdf`;
            const partPath = path.join(SOURCE_DIR, partName);

            fs.writeFileSync(partPath, partBytes);
            const partSizeMB = partBytes.length / (1024 * 1024);
            console.log(`   💾 Saved ${partName} (${partSizeMB.toFixed(2)} MB) [Pages ${startPage + 1}-${endPage}]`);
        }
        console.log(`✨ Done with ${fileName}`);

    } catch (error) {
        console.error(`❌ Error splitting ${fileName}:`, error.message);
    }
}

async function main() {
    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.toLowerCase().endsWith('.pdf') && !f.includes('_part'));

    for (const file of files) {
        await splitPdf(path.join(SOURCE_DIR, file));
    }
}

main().catch(console.error);

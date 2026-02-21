/**
 * Lab Exercise 3: File Synchronization Tool
 * Compares two directories and synchronizes files between them.
 * Copies missing/outdated files from source → destination.
 * Handles errors gracefully.
 *
 * Usage: node fileSync.js <sourceDir> <destDir>
 */

const fs = require('fs');
const path = require('path');

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getFilesRecursively(dir, baseDir = dir) {
    const results = [];
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
        console.error(`❌  Cannot read directory "${dir}": ${err.message}`);
        return results;
    }

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (entry.isDirectory()) {
            results.push(...getFilesRecursively(fullPath, baseDir));
        } else if (entry.isFile()) {
            results.push(relativePath);
        }
    }
    return results;
}

function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// ─── Sync Logic ────────────────────────────────────────────────────────────────

function syncDirectories(srcDir, destDir) {
    console.log('\n🔄  File Synchronization Tool');
    console.log('─'.repeat(55));
    console.log(`  Source      : ${srcDir}`);
    console.log(`  Destination : ${destDir}`);
    console.log('─'.repeat(55) + '\n');

    // Validate source directory
    if (!fs.existsSync(srcDir)) {
        console.error(`❌  Source directory does not exist: "${srcDir}"`);
        process.exit(1);
    }

    if (!fs.statSync(srcDir).isDirectory()) {
        console.error(`❌  Source path is not a directory: "${srcDir}"`);
        process.exit(1);
    }

    // Ensure destination exists
    try {
        ensureDirExists(destDir);
    } catch (err) {
        console.error(`❌  Cannot create destination directory: ${err.message}`);
        process.exit(1);
    }

    const srcFiles = getFilesRecursively(srcDir);
    const destFiles = new Set(getFilesRecursively(destDir));

    const stats = {
        copied: 0,
        updated: 0,
        skipped: 0,
        errors: 0,
    };

    if (srcFiles.length === 0) {
        console.log('ℹ️   Source directory is empty. Nothing to sync.\n');
        return stats;
    }

    console.log(`📋  Found ${srcFiles.length} file(s) in source. Starting sync...\n`);

    for (const relFile of srcFiles) {
        const srcFilePath = path.join(srcDir, relFile);
        const destFilePath = path.join(destDir, relFile);

        try {
            const srcStats = fs.statSync(srcFilePath);

            if (destFiles.has(relFile)) {
                // File exists in dest — check if source is newer
                const destStats = fs.statSync(destFilePath);
                if (srcStats.mtimeMs > destStats.mtimeMs) {
                    // Source is newer → update
                    ensureDirExists(path.dirname(destFilePath));
                    fs.copyFileSync(srcFilePath, destFilePath);
                    console.log(`🔄  UPDATED  : ${relFile}`);
                    stats.updated++;
                } else {
                    // Dest is same or newer → skip
                    console.log(`⏭️   SKIPPED  : ${relFile} (already up to date)`);
                    stats.skipped++;
                }
            } else {
                // File missing in dest → copy
                ensureDirExists(path.dirname(destFilePath));
                fs.copyFileSync(srcFilePath, destFilePath);
                console.log(`✅  COPIED   : ${relFile}`);
                stats.copied++;
            }
        } catch (err) {
            console.error(`❌  ERROR    : ${relFile} → ${err.message}`);
            stats.errors++;
        }
    }

    // ─── Summary ───────────────────────────────────────────────────────────────
    console.log('\n' + '─'.repeat(55));
    console.log('📊  Sync Summary');
    console.log('─'.repeat(55));
    console.log(`  ✅  Files copied   : ${stats.copied}`);
    console.log(`  🔄  Files updated  : ${stats.updated}`);
    console.log(`  ⏭️   Files skipped  : ${stats.skipped}`);
    console.log(`  ❌  Errors         : ${stats.errors}`);
    console.log('─'.repeat(55));
    console.log(`  Total processed  : ${srcFiles.length}`);
    console.log('─'.repeat(55) + '\n');

    if (stats.errors === 0) {
        console.log('🎉  Synchronization completed successfully!\n');
    } else {
        console.log(`⚠️   Synchronization completed with ${stats.errors} error(s). Check above for details.\n`);
    }

    return stats;
}

// ─── Entry Point ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('\nUsage: node fileSync.js <sourceDir> <destDir>\n');
    console.log('Example:');
    console.log('  node fileSync.js ./source ./backup\n');
    process.exit(1);
}

const [sourceDir, destDir] = args;
syncDirectories(path.resolve(sourceDir), path.resolve(destDir));

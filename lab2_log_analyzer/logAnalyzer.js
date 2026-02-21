/**
 * Lab Exercise 2: Log File Analyzer
 * Reads log files using streams, parses them, and generates
 * a summary report with error counts and statistics.
 *
 * Usage: node logAnalyzer.js <logfile>
 * Example: node logAnalyzer.js sampleLogs.log
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Parse a single log line ───────────────────────────────────────────────────
// Format: [YYYY-MM-DD HH:MM:SS] LEVEL  Message

function parseLine(line) {
    const regex = /^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]\s+(\w+)\s+(.+)$/;
    const match = line.match(regex);
    if (!match) return null;
    return {
        timestamp: match[1],
        level: match[2].toUpperCase(),
        message: match[3].trim(),
    };
}

// ─── Main analyzer function ────────────────────────────────────────────────────

function analyzeLogFile(logFilePath) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(logFilePath)) {
            return reject(new Error(`Log file not found: "${logFilePath}"`));
        }

        const stats = {
            totalLines: 0,
            parsedLines: 0,
            unparsedLines: 0,
            levels: {},          // e.g. { INFO: 10, ERROR: 3, WARN: 2, DEBUG: 5 }
            errors: [],          // error messages
            warnings: [],        // warning messages
            firstTimestamp: null,
            lastTimestamp: null,
        };

        const fileStream = fs.createReadStream(logFilePath, { encoding: 'utf8' });

        fileStream.on('error', (err) => {
            reject(new Error(`Failed to read log file: ${err.message}`));
        });

        const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

        rl.on('line', (line) => {
            stats.totalLines++;

            const trimmed = line.trim();
            if (!trimmed) return; // skip blank lines

            const parsed = parseLine(trimmed);
            if (!parsed) {
                stats.unparsedLines++;
                return;
            }

            stats.parsedLines++;

            // Count levels
            stats.levels[parsed.level] = (stats.levels[parsed.level] || 0) + 1;

            // Track time range
            if (!stats.firstTimestamp) stats.firstTimestamp = parsed.timestamp;
            stats.lastTimestamp = parsed.timestamp;

            // Collect errors and warnings
            if (parsed.level === 'ERROR') {
                stats.errors.push({ timestamp: parsed.timestamp, message: parsed.message });
            }
            if (parsed.level === 'WARN') {
                stats.warnings.push({ timestamp: parsed.timestamp, message: parsed.message });
            }
        });

        rl.on('close', () => resolve(stats));
        rl.on('error', reject);
    });
}

// ─── Report Printer ────────────────────────────────────────────────────────────

function printReport(logFilePath, stats) {
    const border = '═'.repeat(60);
    const thin = '─'.repeat(60);

    console.log(`\n╔${border}╗`);
    console.log(`║${'  📊  LOG FILE ANALYSIS REPORT'.padEnd(60)}║`);
    console.log(`╚${border}╝`);

    console.log(`\n📁  File    : ${path.resolve(logFilePath)}`);
    console.log(`🕐  From    : ${stats.firstTimestamp || 'N/A'}`);
    console.log(`🕐  To      : ${stats.lastTimestamp || 'N/A'}`);

    console.log(`\n${thin}`);
    console.log('📈  LINE STATISTICS');
    console.log(thin);
    console.log(`  Total Lines    : ${stats.totalLines}`);
    console.log(`  Parsed Lines   : ${stats.parsedLines}`);
    console.log(`  Unparsed Lines : ${stats.unparsedLines}`);

    console.log(`\n${thin}`);
    console.log('📊  LOG LEVEL BREAKDOWN');
    console.log(thin);

    const levels = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
    const icons = { ERROR: '❌', WARN: '⚠️ ', INFO: 'ℹ️ ', DEBUG: '🐛' };

    for (const level of levels) {
        const count = stats.levels[level] || 0;
        const icon = icons[level] || '  ';
        const bar = '█'.repeat(Math.min(count * 2, 30));
        console.log(`  ${icon}  ${level.padEnd(7)}: ${String(count).padStart(4)}  ${bar}`);
    }

    // Print any other levels not in the default list
    for (const [level, count] of Object.entries(stats.levels)) {
        if (!levels.includes(level)) {
            console.log(`  📌  ${level.padEnd(7)}: ${String(count).padStart(4)}`);
        }
    }

    // ─── Error Details ─────────────────────────────────────────────────────────
    console.log(`\n${thin}`);
    console.log(`❌  ERROR DETAILS (${stats.errors.length} total)`);
    console.log(thin);

    if (stats.errors.length === 0) {
        console.log('  ✅  No errors found!\n');
    } else {
        stats.errors.forEach((err, i) => {
            console.log(`  ${i + 1}. [${err.timestamp}]`);
            console.log(`     ${err.message}`);
        });
        console.log('');
    }

    // ─── Warning Details ───────────────────────────────────────────────────────
    console.log(thin);
    console.log(`⚠️   WARNING DETAILS (${stats.warnings.length} total)`);
    console.log(thin);

    if (stats.warnings.length === 0) {
        console.log('  ✅  No warnings found!\n');
    } else {
        stats.warnings.forEach((warn, i) => {
            console.log(`  ${i + 1}. [${warn.timestamp}]`);
            console.log(`     ${warn.message}`);
        });
        console.log('');
    }

    // ─── Health Score ──────────────────────────────────────────────────────────
    console.log(thin);
    const errorRate = stats.parsedLines > 0
        ? ((stats.errors.length / stats.parsedLines) * 100).toFixed(1)
        : 0;
    const warnRate = stats.parsedLines > 0
        ? ((stats.warnings.length / stats.parsedLines) * 100).toFixed(1)
        : 0;

    console.log('🏥  HEALTH SUMMARY');
    console.log(thin);
    console.log(`  Error Rate   : ${errorRate}%`);
    console.log(`  Warning Rate : ${warnRate}%`);

    let health;
    if (stats.errors.length === 0 && stats.warnings.length === 0) {
        health = '🟢  Excellent - No issues detected';
    } else if (stats.errors.length === 0) {
        health = '🟡  Good - Warnings present but no errors';
    } else if (parseFloat(errorRate) < 10) {
        health = '🟠  Fair - Some errors detected';
    } else {
        health = '🔴  Poor - High error rate, investigation needed';
    }

    console.log(`  Status       : ${health}`);
    console.log(thin + '\n');
}

// ─── Entry Point ───────────────────────────────────────────────────────────────

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('\nUsage: node logAnalyzer.js <logfile>\n');
        console.log('Example:');
        console.log('  node logAnalyzer.js sampleLogs.log\n');
        process.exit(1);
    }

    const logFilePath = args[0];

    try {
        console.log(`\n⏳  Analyzing log file: "${logFilePath}"...`);
        const stats = await analyzeLogFile(logFilePath);
        printReport(logFilePath, stats);
    } catch (err) {
        console.error(`\n❌  Error: ${err.message}\n`);
        process.exit(1);
    }
}

main();

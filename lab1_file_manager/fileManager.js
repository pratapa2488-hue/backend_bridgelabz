/**
 * Lab Exercise 1: File Manager Application
 * A command-line application for basic file operations:
 * read, write, copy, delete, and list directory contents.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// ─── Operations ────────────────────────────────────────────────────────────────

/**
 * List directory contents
 */
function listDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    console.log(`\n📂  Contents of "${dirPath}":`);
    if (items.length === 0) {
      console.log('  (empty directory)');
    } else {
      items.forEach((item) => {
        const type = item.isDirectory() ? '📁' : '📄';
        const filePath = path.join(dirPath, item.name);
        const stats = fs.statSync(filePath);
        const size = item.isFile() ? ` (${stats.size} bytes)` : '';
        console.log(`  ${type}  ${item.name}${size}`);
      });
    }
    console.log(`\n  Total: ${items.length} item(s)\n`);
  } catch (err) {
    console.error(`❌  Error listing directory: ${err.message}`);
  }
}

/**
 * Read a file and print its contents
 */
function readFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n📄  Contents of "${filePath}":\n`);
    console.log('─'.repeat(50));
    console.log(content);
    console.log('─'.repeat(50) + '\n');
  } catch (err) {
    console.error(`❌  Error reading file: ${err.message}`);
  }
}

/**
 * Write content to a file (creates file if it doesn't exist)
 */
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅  File written successfully: "${filePath}"\n`);
  } catch (err) {
    console.error(`❌  Error writing file: ${err.message}`);
  }
}

/**
 * Copy a file from source to destination
 */
function copyFile(src, dest) {
  try {
    if (!fs.existsSync(src)) {
      console.error(`❌  Source file not found: "${src}"`);
      return;
    }
    fs.copyFileSync(src, dest);
    const stats = fs.statSync(dest);
    console.log(`✅  File copied successfully!`);
    console.log(`   Source      : ${src}`);
    console.log(`   Destination : ${dest}`);
    console.log(`   Size        : ${stats.size} bytes\n`);
  } catch (err) {
    console.error(`❌  Error copying file: ${err.message}`);
  }
}

/**
 * Delete a file
 */
function deleteFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌  File not found: "${filePath}"`);
      return;
    }
    const stats = fs.statSync(filePath);
    fs.unlinkSync(filePath);
    console.log(`✅  File deleted: "${filePath}" (was ${stats.size} bytes)\n`);
  } catch (err) {
    console.error(`❌  Error deleting file: ${err.message}`);
  }
}

// ─── Menu ──────────────────────────────────────────────────────────────────────

function showMenu() {
  console.log('\n╔══════════════════════════════════╗');
  console.log('║       📁  File Manager CLI       ║');
  console.log('╠══════════════════════════════════╣');
  console.log('║  1. List Directory Contents      ║');
  console.log('║  2. Read a File                  ║');
  console.log('║  3. Write to a File              ║');
  console.log('║  4. Copy a File                  ║');
  console.log('║  5. Delete a File                ║');
  console.log('║  6. Exit                         ║');
  console.log('╚══════════════════════════════════╝');
}

async function main() {
  console.log('\n🚀  Welcome to File Manager CLI');

  while (true) {
    showMenu();
    const choice = (await prompt('👉  Enter your choice (1-6): ')).trim();

    switch (choice) {
      case '1': {
        const dir = (await prompt('   Enter directory path (or . for current): ')).trim() || '.';
        listDirectory(dir);
        break;
      }
      case '2': {
        const file = (await prompt('   Enter file path to read: ')).trim();
        readFile(file);
        break;
      }
      case '3': {
        const file = (await prompt('   Enter file path to write: ')).trim();
        const content = (await prompt('   Enter content to write: ')).trim();
        writeFile(file, content);
        break;
      }
      case '4': {
        const src = (await prompt('   Enter source file path: ')).trim();
        const dest = (await prompt('   Enter destination file path: ')).trim();
        copyFile(src, dest);
        break;
      }
      case '5': {
        const file = (await prompt('   Enter file path to delete: ')).trim();
        const confirm = (await prompt(`   Are you sure you want to delete "${file}"? (yes/no): `)).trim().toLowerCase();
        if (confirm === 'yes' || confirm === 'y') {
          deleteFile(file);
        } else {
          console.log('   ⚠️  Deletion cancelled.\n');
        }
        break;
      }
      case '6': {
        console.log('\n👋  Goodbye!\n');
        rl.close();
        process.exit(0);
      }
      default:
        console.log('\n⚠️  Invalid choice. Please enter a number between 1 and 6.\n');
    }
  }
}

main();

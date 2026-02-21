# File System Operations — Lab Exercises

Three Node.js command-line lab exercises demonstrating core file system operations.

---

## Lab 1: File Manager Application

A CLI app for basic file operations.

### Features
- 📂 List directory contents
- 📖 Read file contents
- ✏️  Write content to a file
- 📋 Copy a file
- 🗑️  Delete a file (with confirmation)

### Run
```bash
cd lab1_file_manager
node fileManager.js
```

---

## Lab 2: Log File Analyzer

Reads log files using **Node.js streams**, parses each line, and generates a summary report.

### Features
- Stream-based reading (memory efficient)
- Counts per log level (INFO, WARN, ERROR, DEBUG)
- Lists all errors and warnings with timestamps
- Health score with error/warning rate

### Run
```bash
cd lab2_log_analyzer
node logAnalyzer.js sampleLogs.log
```

---

## Lab 3: File Synchronization Tool

Compares two directories and synchronizes files from source → destination.

### Features
- Recursively scans source directory
- Copies missing files to destination
- Updates files that are newer in source
- Skips already up-to-date files
- Graceful error handling per file
- Sync summary report

### Run
```bash
cd lab3_file_sync
node fileSync.js <sourceDir> <destDir>

# Example:
node fileSync.js ./source ./backup
```

---

## Technologies Used
- **Node.js** built-in modules: `fs`, `path`, `readline`
- No external dependencies required
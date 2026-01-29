const os = require("os");
const fs = require("fs");

function logSystemInfo() {
    const cpuInfo = os.cpus()[0].model;
    const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2); // MB
    const freeMemory = (os.freemem() / 1024 / 1024).toFixed(2);   // MB
    const platform = os.platform();
    const uptime = (os.uptime() / 60).toFixed(2); // minutes

    const logData = `
Time: ${new Date().toLocaleString()}
Platform: ${platform}
CPU: ${cpuInfo}
Total Memory: ${totalMemory} MB
Free Memory: ${freeMemory} MB
Uptime: ${uptime} minutes
----------------------------
`;

    fs.appendFile("system-info.log", logData, (err) => {
        if (err) {
            console.error("Error writing system info:", err);
        }
    });
}

// Log every 5 seconds
setInterval(logSystemInfo, 5000);

console.log("System information logger started...");


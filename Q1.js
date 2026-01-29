const fs = require("fs");

// Read input file
fs.readFile("input.txt", "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    // Count words
    const words = data.trim().split(/\s+/);
    const wordCount = words.filter(word => word.length > 0).length;

    // Write result to output file
    fs.writeFile("output.txt", `Word count: ${wordCount}`, (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return;
        }
        console.log("Word count written to output.txt");
    });
});

// Capitalize the first letter of a string
function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Reverse a string
function reverseString(str) {
    return str.split("").reverse().join("");
}

// Count vowels in a string
function countVowels(str) {
    const matches = str.match(/[aeiou]/gi);
    return matches ? matches.length : 0;
}

// Export functions
module.exports = {
    capitalize,
    reverseString,
    countVowels
};

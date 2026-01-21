export function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export function reverseString(str) {
    if (typeof str !== 'string') return '';
    return str.split('').reverse().join('');
}


export function countVowels(str) {
    if (typeof str !== 'string') return 0;
    const matches = str.match(/[aeiouAEIOU]/g);
    return matches ? matches.length : 0;
} 

const fs = require('fs');
const buf = fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_full_list.json');

// Search for "https://utfs.io/f/" in both UTF-8 and UTF-16
const searchUtf8 = Buffer.from('https://utfs.io/f/');
const searchUtf16le = Buffer.from('h\0t\0t\0p\0s\0:\0/\0/\0u\0t\0f\0s\0.\0i\0o\0/\0f\0/\0', 'binary'); // simplified

function findOccurrences(buffer, search) {
    const indices = [];
    let index = buffer.indexOf(search);
    while (index !== -1) {
        indices.push(index);
        index = buffer.indexOf(search, index + 1);
    }
    return indices;
}

const utf8Indices = findOccurrences(buf, searchUtf8);
const utf16Indices = findOccurrences(buf, searchUtf16le);

console.log(`Found ${utf8Indices.length} UTF-8 occurrences.`);
console.log(`Found ${utf16Indices.length} UTF-16LE occurrences.`);

// Extract surrounding text for first 10 UTF-16LE occurrences
utf16Indices.slice(0, 10).forEach(idx => {
    const start = Math.max(0, idx - 100);
    const end = Math.min(buf.length, idx + 200);
    console.log(`--- INDEX ${idx} ---`);
    console.log(buf.slice(start, end).toString('utf16le'));
});

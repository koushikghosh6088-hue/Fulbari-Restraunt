const fs = require('fs');

const file = 'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_full_list.json';
const buf = fs.readFileSync(file);
let content = buf.toString('utf16le'); // Try UTF-16LE first
if (!content.includes('{"id":')) content = buf.toString('utf8'); // Fallback to UTF-8

// Regex to find all name/key pairs
const regex = /"name"\s*:\s*"([^"]+)"\s*,\s*"key"\s*:\s*"([^"]+)"/g;
const mapping = {};
let match;
while ((match = regex.exec(content)) !== null) {
    mapping[match[1]] = match[2];
}

console.log(`Extracted ${Object.keys(mapping).length} unique files.`);
Object.keys(mapping).slice(0, 50).forEach(k => {
    console.log(`${k} -> ${mapping[k]}`);
});

fs.writeFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/all-ut-files.json', JSON.stringify(mapping, null, 2));

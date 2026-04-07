const fs = require('fs');

const file = 'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_full_list.json';
const content = fs.readFileSync(file, 'utf16le');

// Regex for any utfs.io URL
const urlRegex = /https:\/\/utfs\.io\/f\/[a-zA-Z0-9_-]+/g;
const urls = content.match(urlRegex) || [];
console.log(`Found ${urls.length} URLs.`);

// Regex for "name":"..." and then URL
const nameUrlRegex = /"name"\s*:\s*"([^"]+)"[^}]+"key"\s*:\s*"([^"]+)"/g;
const mapping = {};
let match;
while ((match = nameUrlRegex.exec(content)) !== null) {
    mapping[match[1]] = `https://utfs.io/f/${match[2]}`;
}

console.log(`Found ${Object.keys(mapping).length} named mappings.`);
const keys = Object.keys(mapping);
keys.slice(0, 20).forEach(k => console.log(`${k} -> ${mapping[k]}`));

// Write to file
fs.writeFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/final-map.json', JSON.stringify(mapping, null, 2));

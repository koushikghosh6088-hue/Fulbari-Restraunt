const fs = require('fs');

const file = 'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_utf8.json';
const content = fs.readFileSync(file, 'utf8');

// Regex to find all name and url fields
const regex = /"name"\s*:\s*"([^"]+)"[^}]+"url"\s*:\s*"(https:\/\/utfs\.io\/f\/[^"]+)"/g;
const mapping = {};
let match;
while ((match = regex.exec(content)) !== null) {
    mapping[match[1]] = match[2];
}

console.log(`Extracted ${Object.keys(mapping).length} unique named mappings.`);
const keys = Object.keys(mapping);
keys.slice(0, 20).forEach(k => console.log(`${k} -> ${mapping[k]}`));

fs.writeFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/final-map.json', JSON.stringify(mapping, null, 2));

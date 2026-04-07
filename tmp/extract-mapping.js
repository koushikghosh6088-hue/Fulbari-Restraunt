const fs = require('fs');

const files = [
    'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_full_list.json',
    'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_v2.json',
    'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files.json'
];

const mapping = {};

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const buf = fs.readFileSync(file);
    let content = buf.toString('utf8');
    if (content.includes('')) content = buf.toString('utf16le');
    
    console.log(`Searching in ${file}...`);
    
    // Look for any string that looks like a filename (ending in .jpg, .png, etc.) 
    // and then the next occurring utfs.io URL.
    // Or look for "name":"..." and then the URL.
    
    const entries = content.split(/[{},]/);
    let lastKey = null;
    entries.forEach(e => {
        const nameMatch = e.match(/"name"\s*:\s*"([^"]+)"/);
        if (nameMatch) lastKey = nameMatch[1];
        
        const urlMatch = e.match(/"url"\s*:\s*"(https:\/\/utfs\.io\/f\/[^"]+)"/);
        if (urlMatch && lastKey) {
            mapping[lastKey] = urlMatch[1];
        }
    });

    // Fallback regex for keys and urls if they are on same entry or slightly different format
    const fullRegex = /"name"\s*:\s*"([^"]+)"[^}]+"url"\s*:\s*"(https:\/\/utfs\.io\/f\/[^"]+)"/g;
    let fallbackMatch;
    while ((fallbackMatch = fullRegex.exec(content)) !== null) {
        mapping[fallbackMatch[1]] = fallbackMatch[2];
    }
});

console.log(`Found ${Object.keys(mapping).length} unique image mappings.`);
const keys = Object.keys(mapping).sort();
console.log('--- SAMPLE MAPPINGS ---');
keys.slice(0, 10).forEach(k => console.log(`${k} -> ${mapping[k]}`));

fs.writeFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/extracted-mapping.json', JSON.stringify(mapping, null, 2));

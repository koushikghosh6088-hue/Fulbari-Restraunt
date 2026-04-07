const fs = require('fs');
const files = JSON.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_cleaned.json', 'utf8'));

const names = Array.from(new Set(files.map(f => f.name))).sort();
console.log('Unique filenames:');
names.forEach(n => console.log(`- ${n}`));

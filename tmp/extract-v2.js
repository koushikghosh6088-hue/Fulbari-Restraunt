const fs = require('fs');
const file = 'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_v2.json';
const utData = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const utFiles = utData.files || [];
console.log(`Found ${utFiles.length} files.`);
utFiles.forEach(f => {
    console.log(`MATCH CANDIDATE: ${f.name} -> https://utfs.io/f/${f.key}`);
});
fs.writeFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_v2_extracted.json', JSON.stringify(utFiles, null, 2));

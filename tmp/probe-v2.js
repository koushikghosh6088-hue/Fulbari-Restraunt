const fs = require('fs');
const file = 'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_v2.json';
const buf = fs.readFileSync(file);
console.log('Hex prefix:', buf.slice(0, 16).toString('hex'));
console.log('UTF-16LE start:', buf.toString('utf16le').substring(0, 500));
console.log('UTF-8 start:', buf.toString('utf8').substring(0, 500));

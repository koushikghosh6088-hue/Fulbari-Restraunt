const fs = require('fs');
const buf = fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_full_list.json');
console.log(buf.slice(0, 50).toString('hex'));
console.log(buf.slice(0, 100).toString('utf8'));
console.log(buf.slice(0, 100).toString('utf16le'));

const fs = require('fs');
const buf = fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_v2.json');
console.log(buf.slice(0, 1000).toString('base64'));

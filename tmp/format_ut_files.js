const fs = require('fs');
const data = JSON.parse(fs.readFileSync('tmp/ut_files.json', 'utf8'));
if (data.files) {
    data.files.forEach(f => {
        console.log(`${f.name} | https://utfs.io/f/${f.key}`);
    });
}

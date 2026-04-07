const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

const matches = [];
walk('c:/Users/Koushik/Downloads/Fulbari Restraunt', (file) => {
    if (file.includes('node_modules') || file.includes('.git') || file.includes('.next')) return;
    const content = fs.readFileSync(file, 'utf8');
    const regex = /https:\/\/utfs\.io\/f\/[a-zA-Z0-9_-]+/g;
    const m = content.match(regex);
    if (m) {
        m.forEach(url => {
            matches.push({ file, url });
        });
    }
});

console.log(`Found ${matches.length} UploadThing URLs in project.`);
matches.forEach(m => console.log(`${m.file}: ${m.url}`));

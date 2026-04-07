const fs = require('fs');
const file = process.argv[2] || 'out/menu/index.html';
if (!fs.existsSync(file)) {
    console.error(`File ${file} not found`);
    process.exit(1);
}
const content = fs.readFileSync(file, 'utf8');
const urls = content.match(/https?:\/\/[^\s"'>]+/g);
if (urls) {
    const uniqueUrls = [...new Set(urls)];
    console.log(uniqueUrls.join('\n'));
}

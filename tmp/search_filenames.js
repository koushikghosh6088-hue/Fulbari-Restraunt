const fs = require('fs');
const path = require('path');

const filenames = fs.readFileSync('tmp/ut_filenames.txt', 'utf8').split('\r\n').filter(f => f.trim().length > 5);

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else {
            const content = fs.readFileSync(fullPath, 'utf8');
            filenames.forEach(f => {
                if (content.includes(f.trim())) {
                    console.log(`Found ${f} in ${fullPath}`);
                }
            });
        }
    });
}

walk('src');

const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('tmp/ut_files_v2.json', 'utf8').replace(/^\uFEFF/, ''));
const keys = data.files ? data.files.map(f => f.key) : [];

function walk(dir) {
    if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.next')) return;
    
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        try {
            if (fs.lstatSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else {
                const content = fs.readFileSync(fullPath, 'utf8');
                keys.forEach(key => {
                    if (content.includes(key)) {
                        console.log(`Found ${key} in ${fullPath}`);
                    }
                });
            }
        } catch(e) {}
    });
}

['src', 'tmp', 'out'].forEach(d => walk(d));

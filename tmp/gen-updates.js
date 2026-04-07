const fs = require('fs');

const utFiles = JSON.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_cleaned.json', 'utf8'));
const menuItems = JSON.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/full-list.json', 'utf8'));

function normalize(s) {
    if (!s) return '';
    return s.toLowerCase()
        .replace(/\d+pc\b/g, '')
        .replace(/\(.*\)/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

const matches = [];
const usedKeys = new Set();

for (const item of menuItems) {
    const normMenu = normalize(item.name);
    if (normMenu.length < 3) continue;

    let bestMatch = null;
    for (const file of utFiles) {
        const normFile = normalize(file.name.split('.')[0]);
        if (normFile === normMenu) {
            bestMatch = file;
            break;
        }
    }

    if (!bestMatch) {
        for (const file of utFiles) {
            const normFile = normalize(file.name.split('.')[0]);
            if (normFile.length < 5) continue;
            if (normMenu.includes(normFile) || normFile.includes(normMenu)) {
                bestMatch = file;
                break;
            }
        }
    }

    if (bestMatch && !usedKeys.has(bestMatch.key)) {
        matches.push({ id: item.id, name: item.name, key: bestMatch.key });
        usedKeys.add(bestMatch.key);
    }
}

let script = '';
matches.forEach(m => {
    const body = JSON.stringify({ action: "UPDATE", item: { id: m.id, image: `https://utfs.io/f/${m.key}` } });
    const fileName = `tmp/up_${m.id.substring(0,8)}.json`;
    fs.writeFileSync(`c:/Users/Koushik/Downloads/Fulbari Restraunt/${fileName}`, body, 'utf8');
    script += `curl.exe -X POST -H "Content-Type: application/json" -d "@${fileName}" http://localhost:3000/api/menu\n`;
});

fs.writeFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/run-updates.ps1', script, 'utf8');
console.log(`Found ${matches.length} matches and wrote tmp/run-updates.ps1`);

const fs = require('fs');

function probe(file) {
    console.log(`--- PROBING ${file} ---`);
    try {
        let content = fs.readFileSync(file, 'utf16le');
        const start = content.lastIndexOf('[');
        if (start !== -1) {
            const jsonPart = content.substring(start);
            try {
                const data = JSON.parse(jsonPart);
                console.log(`Parsed ${data.length} items from ${file}`);
                console.log(JSON.stringify(data.slice(0, 3), null, 2));
                return true;
            } catch (e) {
                console.log(`JSON parse error at last [: ${e.message}`);
                // Try from first [
                const first = content.indexOf('[');
                if (first !== -1) {
                    try {
                        const data2 = JSON.parse(content.substring(first));
                        console.log(`Parsed ${data2.length} items from first [`);
                         console.log(JSON.stringify(data2.slice(0, 3), null, 2));
                        return true;
                    } catch (e2) {
                        console.log(`JSON parse error at first [: ${e2.message}`);
                    }
                }
            }
        }
    } catch (e) {
        console.log(`Read error: ${e.message}`);
    }
    return false;
}

probe('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_full_list.json');
probe('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_v2.json');
probe('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files.json');

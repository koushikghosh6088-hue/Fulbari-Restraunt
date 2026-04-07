const fs = require('fs');

const file = 'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_v2.json';
const output = 'c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_cleaned.json';

try {
    // Read as buffer first to handle potential encoding issues
    let buf = fs.readFileSync(file);
    
    // Check for UTF-8 BOM (0xEF 0xBB 0xBF)
    if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        buf = buf.slice(3);
    }
    
    let content = buf.toString('utf-8');
    
    // Find the first '[' and last ']'
    const first = content.indexOf('[');
    const last = content.lastIndexOf(']');
    
    if (first !== -1 && last !== -1) {
        let jsonStr = content.substring(first, last + 1);
        
        // Try to parse it to verify
        const data = JSON.parse(jsonStr);
        console.log(`Successfully parsed ${data.length} files.`);
        
        // Write cleaned version
        fs.writeFileSync(output, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Cleaned file saved to: ${output}`);
    } else {
        console.error('Could not find JSON array boundaries');
        // Let's print the first 100 chars to debug
        console.log('START:', content.substring(0, 100));
    }
} catch (error) {
    console.error('Error cleaning file:', error.message);
}

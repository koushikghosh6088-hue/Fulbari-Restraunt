const fs = require('fs');

const utFiles = JSON.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_cleaned.json', 'utf8'));
// I'll use a mocked list of menu items from my previous queries for matching
// In a real script I'd fetch from DB but for a "preview" I'll use the ones I know.
const menuNames = [
    "Clear Soup", "Sweet Corn Soup", "Hot & Sour Soup", "Manchow Soup", "Noodles Soup",
    "French Fry", "Honey Chilli Potato", "Paneer Pakora (6pc)", "Dry Chilli Paneer (8pc)",
    "Crispy Chilli Babycorn", "Chilli Mushroom Dry", "Mushroom Salt And Pepper",
    "Chicken Drums of Heaven (6pc)", "BBQ Chicken (6pc)", "Crispy Chicken",
    "Honey Garlic Chicken (8pc)", "Dragon Chicken (8pc)", "Chicken 65 (8pc)",
    "Dry Chilli Chicken (8pc)", "Chicken Salt and Pepper", "Chicken Pakora (8pc)",
    "Veg Fried Rice", "Egg Fried Rice", "Chicken Fried Rice", "Mixed Fried Rice",
    "Veg Soft Noodles", "Egg Soft Noodles", "Chicken Soft Noodles", "Mixed Soft Noodles",
    "Chilli Chicken (G)", "Garlic Chicken (G)", "Ginger Chicken (G)", "Schezwan Chicken (G)",
    "Chicken Manchurian (G)", "Lemon Chicken (G)", "Hong Kong Chicken (B/L) (G)",
    "Chicken Do Pyaza", "Chicken Korma", "Chicken Bharta", "Kadai Chicken", "Chicken Masala",
    "Mutton Curry", "Mutton Kosha", "Mutton Do Pyaza", "Handi Mutton", "Mutton Rogan Josh",
    "Fish Curry", "Fish Finger", "Lemon Butter Fish", "Chilli Fish"
];

function normalize(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const mapping = [];
const usedKeys = new Set();

utFiles.forEach(file => {
    if (usedKeys.has(file.key)) return;
    
    const fileNameBase = normalize(file.name.split('.')[0]);
    if (fileNameBase.length < 3) return; // Skip too short

    menuNames.forEach(menuName => {
        const normMenu = normalize(menuName);
        // Fuzzy match: if file base is in menu name or vice versa
        if (normMenu.includes(fileNameBase) || fileNameBase.includes(normMenu)) {
            mapping.push({ file: file.name, menu: menuName, url: `https://utfs.io/f/${file.key}` });
            usedKeys.add(file.key);
        }
    });
});

console.log(`Proposed ${mapping.length} mappings:`);
mapping.forEach(m => console.log(`- ${m.file} => ${m.menu}`));

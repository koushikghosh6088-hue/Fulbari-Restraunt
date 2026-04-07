const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY; // Need service role for updates

const utFiles = JSON.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_cleaned.json', 'utf8'));

function normalize(s) {
    if (!s) return '';
    return s.toLowerCase()
        .replace(/\d+pc\b/g, '') // remove "8pc", "6pc"
        .replace(/\(.*\)/g, '')   // remove anything in parentheses
        .replace(/[^a-z0-9]/g, '') // remove special chars
        .trim();
}

async function restore() {
    try {
        console.log(`Connecting to ${URL}...`);
        
        // 1. Fetch menu items
        const response = await fetch(`${URL}/rest/v1/menu_items?select=id,name,image,category`, {
            headers: {
                'apikey': KEY,
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const menuItems = await response.json();
        if (!Array.isArray(menuItems)) {
            console.error('Failed to fetch menu items:', menuItems);
            return;
        }

        console.log(`Analyzing ${menuItems.length} menu items against ${utFiles.length} UploadThing files...`);

        const updates = [];
        const matchedKeys = new Set();

        for (const item of menuItems) {
            const normMenu = normalize(item.name);
            if (normMenu.length < 3) continue;

            // Find best match in UT files
            let bestMatch = null;
            
            // Priority 1: Exact name match (normalized)
            for (const file of utFiles) {
                const normFile = normalize(file.name.split('.')[0]);
                if (normFile === normMenu) {
                    bestMatch = file;
                    break;
                }
            }

            // Priority 2: Fuzzy include match
            if (!bestMatch) {
                for (const file of utFiles) {
                    const normFile = normalize(file.name.split('.')[0]);
                    if (normFile.length < 4) continue;
                    if (normMenu.includes(normFile) || normFile.includes(normMenu)) {
                        bestMatch = file;
                        break;
                    }
                }
            }

            if (bestMatch) {
                const newUrl = `https://utfs.io/f/${bestMatch.key}`;
                if (item.image !== newUrl) {
                    updates.push({ id: item.id, name: item.name, old: item.image, new: newUrl });
                }
            }
        }

        console.log(`Found ${updates.length} items to update.`);

        // 2. Perform updates sequentially to avoid rate limits
        for (const up of updates) {
            console.log(`Updating [${up.name}]: ${up.new.substring(0, 40)}...`);
            const updateRes = await fetch(`${URL}/rest/v1/menu_items?id=eq.${up.id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': KEY,
                    'Authorization': `Bearer ${KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ image: up.new })
            });

            if (!updateRes.ok) {
                const err = await updateRes.text();
                console.error(`Failed to update ${up.name}:`, err);
            }
        }

        console.log('Restoration complete.');
    } catch (err) {
        console.error('Restoration error:', err);
    }
}

restore();

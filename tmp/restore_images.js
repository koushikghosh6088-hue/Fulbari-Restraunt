const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
const envData = fs.readFileSync(envPath, 'utf-8');
const envConfig = dotenv.parse(envData);
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function restoreImages() {
    console.log('Reading menu_items.json for original images...');
    const originalData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/menu_items.json'), 'utf8'));
    
    // Helper to normalize names for fuzzy matching
    const normalize = (name) => name.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim();

    // Create a map of normalized name -> image
    const imageMap = {};
    originalData.forEach(item => {
        const normName = normalize(item.name);
        // Map both exact and normalized to ensure best chance
        imageMap[item.name.toLowerCase().trim()] = item.image;
        if (!imageMap[normName]) {
            imageMap[normName] = item.image;
        }
    });

    console.log(`Prepared image mappings.`);

    // Fetch current items from DB
    const { data: currentItems, error: fetchErr } = await supabase.from('menu_items').select('id, name, image');
    if (fetchErr) {
        console.error('Error fetching current items:', fetchErr);
        return;
    }

    console.log(`Checking ${currentItems.length} items in DB...`);
    let updatedCount = 0;

    for (const item of currentItems) {
        const exactMatch = imageMap[item.name.toLowerCase().trim()];
        const fuzzyMatch = imageMap[normalize(item.name)];
        
        const originalImage = exactMatch || fuzzyMatch;

        if (originalImage && originalImage !== item.image) {
            console.log(`Updating image for: ${item.name} -> ${originalImage.substring(0, 50)}...`);
            const { error: updateErr } = await supabase
                .from('menu_items')
                .update({ image: originalImage })
                .eq('id', item.id);
            
            if (updateErr) {
                console.error(`Failed to update ${item.name}:`, updateErr.message);
            } else {
                updatedCount++;
            }
        }
    }

    console.log(`Successfully restored ${updatedCount} images!`);
}

restoreImages();

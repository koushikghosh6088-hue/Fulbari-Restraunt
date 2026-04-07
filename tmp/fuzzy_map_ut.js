const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
const envData = fs.readFileSync(envPath, 'utf-8');
const envConfig = dotenv.parse(envData);
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fuzzyMapItems() {
    const utData = JSON.parse(fs.readFileSync('tmp/ut_files_v2.json', 'utf8').replace(/^\uFEFF/, ''));
    const files = utData.files || [];

    console.log(`Loaded ${files.length} files from UploadThing.`);

    const { data: currentItems } = await supabase.from('menu_items').select('id, name, image');
    
    // Helper to normalize names
    const normalize = (name) => name.toLowerCase()
        .replace(/\.[a-z]+$/i, '') // remove extension
        .replace(/[^a-z0-9]/g, '')
        .trim();

    let updatedCount = 0;

    for (const item of currentItems) {
        const normItemName = normalize(item.name);
        
        // Find best UT file match
        let bestFile = null;
        for (const file of files) {
            const normFileName = normalize(file.name);
            
            // Check for exact normalized match OR substring match
            if (normFileName && normItemName && 
               (normFileName === normItemName || 
                normFileName.includes(normItemName) || 
                normItemName.includes(normFileName))) {
                
                // If it's a numeric filename, skip it unless it's a very short match
                if (/^\d+$/.test(normFileName) && normFileName.length > 5) continue;
                
                bestFile = file;
                break;
            }
        }

        if (bestFile) {
            const utUrl = `https://utfs.io/f/${bestFile.key}`;
            if (item.image !== utUrl) {
                console.log(`Fuzzy match: ${item.name} <-> ${bestFile.name} -> ${utUrl}`);
                const { error } = await supabase
                    .from('menu_items')
                    .update({ image: utUrl })
                    .eq('id', item.id);
                
                if (!error) updatedCount++;
            }
        }
    }

    console.log(`Successfully restored ${updatedCount} original images via fuzzy matching!`);
}

fuzzyMapItems();

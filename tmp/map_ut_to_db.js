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

async function mapImages() {
    const utData = JSON.parse(fs.readFileSync('tmp/ut_files_v2.json', 'utf8').replace(/^\uFEFF/, ''));
    const files = utData.files || [];

    console.log(`Loaded ${files.length} files from UploadThing.`);

    // Helper to normalize names
    const normalize = (name) => name.toLowerCase()
        .replace(/\.[a-z]+$/i, '') // remove extension
        .replace(/\s*\([^)]*\)/g, '') // remove parentheticals
        .replace(/veg|non-veg|nonveg/g, '')
        .replace(/6pc|8pc|1pc/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();

    const imageMap = {};
    files.forEach(f => {
        const normName = normalize(f.name);
        imageMap[normName] = `https://utfs.io/f/${f.key}`;
    });

    console.log(`Created mapping for ${Object.keys(imageMap).length} unique normalized names.`);

    const { data: currentItems } = await supabase.from('menu_items').select('id, name, image');
    
    let updatedCount = 0;
    for (const item of currentItems) {
        const normName = normalize(item.name);
        const originalImage = imageMap[normName];

        if (originalImage && originalImage !== item.image) {
            console.log(`Mapping ${item.name} -> ${originalImage}`);
            const { error } = await supabase
                .from('menu_items')
                .update({ image: originalImage })
                .eq('id', item.id);
            
            if (!error) updatedCount++;
        }
    }

    console.log(`Successfully mapped ${updatedCount} original images!`);
}

mapImages();

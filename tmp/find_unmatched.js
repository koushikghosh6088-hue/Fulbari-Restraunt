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

async function findUnmatched() {
    const originalData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/menu_items.json'), 'utf8'));
    const normalize = (name) => name.toLowerCase().replace(/\s*\([^)]*\)/g, '').replace(/veg|non-veg|nonveg/g, '').replace(/6pc|8pc|1pc/g, '').replace(/[^a-z0-9]/g, '').trim();

    const imageMap = {};
    originalData.forEach(item => {
        imageMap[normalize(item.name)] = item.image;
    });

    const { data: currentItems } = await supabase.from('menu_items').select('id, name, image');
    
    console.log('--- Unmatched Items (No Image Found) ---');
    currentItems.forEach(item => {
        const normName = normalize(item.name);
        if (!imageMap[normName]) {
            console.log(`- ${item.name} (${normName})`);
        }
    });
}

findUnmatched();

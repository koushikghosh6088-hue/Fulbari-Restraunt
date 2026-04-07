const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function run() {
    const envPath = path.resolve('c:/Users/Koushik/Downloads/Fulbari Restraunt', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length > 0) env[key.trim()] = rest.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
    });

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const utData = JSON.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/ut_files_v2.json', 'utf8').replace(/^\uFEFF/, ''));
    const utFiles = utData.files || [];

    const normalize = (name) => name.toLowerCase()
        .replace(/\.[a-z]+$/i, '')
        .replace(/\s*\([^)]*\)/g, '')
        .replace(/veg|non-veg|nonveg/g, '')
        .replace(/6pc|8pc|1pc/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();

    console.log('--- UT FILES (NORMALIZED) ---');
    utFiles.slice(0, 20).forEach(f => {
        console.log(`${f.name} -> ${normalize(f.name)}`);
    });

    const { data: menuItems } = await supabase.from('menu_items').select('name').limit(20);
    console.log('--- DB ITEMS (NORMALIZED) ---');
    menuItems.forEach(item => {
        console.log(`${item.name} -> ${normalize(item.name)}`);
    });
}

run().catch(console.error);

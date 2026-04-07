const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function run() {
    const envPath = path.resolve('c:/Users/Koushik/Downloads/Fulbari Restraunt', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length > 0) env[key.trim()] = rest.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
    });

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data, error } = await supabase.from('gallery_items').select('*').limit(1);
    if (error) console.error('Error:', error);
    else {
        console.log('--- ALL COLUMNS IN gallery_items ---');
        console.log(Object.keys(data[0]));
        
        console.log('\n--- SAMPLES OF FOOD CATEGORY ---');
        const { data: food, error: foodError } = await supabase.from('gallery_items').select('*').eq('category', 'Food').limit(20);
        if (foodError) console.error(foodError);
        else console.log(JSON.stringify(food, null, 2));
    }
}

run().catch(console.error);

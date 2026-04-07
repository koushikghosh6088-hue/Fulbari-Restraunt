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

    const { count, error } = await supabase.from('menu_items').select('*', { count: 'exact', head: true });
    if (error) console.error('Error:', error);
    else console.log('Total Menu Items:', count);

    const { data: samples, error: sampleError } = await supabase.from('menu_items').select('name, image').limit(50);
    if (sampleError) console.error('Sample Error:', sampleError);
    else {
        console.log('--- SAMPLE MENU DATA ---');
        samples.forEach(s => {
            if (s.image && !s.image.includes('unsplash.com')) {
                console.log(`FOUND ACTUAL IMAGE for ${s.name}: ${s.image}`);
            }
        });
    }
}

run().catch(console.error);

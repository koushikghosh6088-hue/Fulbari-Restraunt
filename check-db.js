const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function run() {
    const envPath = path.resolve(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
        const [key, ...rest] = line.split('=');
        if (key && rest.length > 0) env[key.trim()] = rest.join('=').trim().replace(/^"(.*)"$/, '$1');
    });

    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    console.log('--- GALLERY ITEMS ---');
    const { data: gallery, error: galleryError } = await supabase.from('gallery_items').select('*').limit(5);
    if (galleryError) console.error('Gallery Error:', galleryError);
    else console.log(JSON.stringify(gallery, null, 2));

    console.log('\n--- EVENTS ---');
    const { data: events, error: eventsError } = await supabase.from('events').select('*').limit(5);
    if (eventsError) console.error('Events Error:', eventsError);
    else console.log(JSON.stringify(events, null, 2));
}

run().catch(console.error);

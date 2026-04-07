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

    const buckets = ['menu-items', 'menu-images', 'gallery', 'events'];
    for (const b of buckets) {
        console.log(`Listing bucket: ${b}`);
        const { data, error } = await supabase.storage.from(b).list('', { limit: 100 });
        if (error) console.error(`Error ${b}:`, error.message);
        else console.log(`Bucket ${b} has ${data.length} files.`, JSON.stringify(data.slice(0, 5), null, 2));
    }
}

run().catch(console.error);

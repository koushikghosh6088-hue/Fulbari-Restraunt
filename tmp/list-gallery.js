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

    console.log('Listing gallery bucket...');
    const { data: files, error } = await supabase.storage.from('gallery').list('', { limit: 100 });

    if (error) {
        console.error('Error listing gallery:', error);
    } else {
        console.log('Files:', JSON.stringify(files.slice(0, 10), null, 2));
    }
}

run().catch(console.error);

const fs = require('fs');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function listAllFiles() {
    const buckets = ["gallery", "events", "menu-images"];
    for (const b of buckets) {
        console.log(`--- Bucket: ${b} ---`);
        const { data, error } = await supabase.storage.from(b).list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'desc' },
        });

        if (error) {
            console.error(`Error listing ${b}:`, error.message);
        } else if (data) {
            data.forEach(f => console.log(`- ${f.name} (${f.metadata?.size || 'unknown size'})`));
            if (data.length === 0) console.log('Empty');
        }
    }
}

listAllFiles();

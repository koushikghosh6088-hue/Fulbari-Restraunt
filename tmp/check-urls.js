const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('menu_items').select('id, name, image');
    if (error) {
        console.error(error);
        return;
    }
    
    const valid = data.filter(item => item.image && item.image.includes('utfs.io'));
    console.log(`Found ${valid.length} items with utfs.io URLs out of ${data.length} total.`);
    if (valid.length > 0) {
        console.log('JSON_START');
        console.log(JSON.stringify(valid));
        console.log('JSON_END');
    }
}

check();

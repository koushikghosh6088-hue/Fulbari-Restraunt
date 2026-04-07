const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
    // Get one row to see all keys
    const { data, error } = await supabase.from('menu_items').select('*').limit(1);
    if (error) {
        console.error(error);
        return;
    }
    
    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]).join(', '));
    } else {
        console.log('No data in menu_items');
    }
}

check();

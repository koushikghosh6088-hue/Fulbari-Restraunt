const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const KEY = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function listIds() {
    try {
        const response = await fetch(`${URL}/rest/v1/menu_items?select=id,name`, {
            headers: {
                'apikey': KEY,
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        fs.writeFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/tmp/full-list.json', JSON.stringify(data, null, 2), 'utf8');
        console.log('Successfully wrote tmp/full-list.json as UTF-8');
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

listIds();

const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY;

async function checkColumns() {
    try {
        const response = await fetch(`${URL}/rest/v1/menu_items?limit=1`, {
            headers: {
                'apikey': KEY,
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'plurality=singular'
            }
        });
        
        const data = await response.json();
        console.log('Columns:', Object.keys(data));
        console.log('Sample Data:', data);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

checkColumns();

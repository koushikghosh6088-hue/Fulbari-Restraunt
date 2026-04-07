const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const KEY = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkGallery() {
    try {
        const response = await fetch(`${URL}/rest/v1/gallery_items?select=*`, {
            headers: {
                'apikey': KEY,
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        console.log('Gallery Items:', data);
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

checkGallery();

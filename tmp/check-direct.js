const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const URL = envConfig.NEXT_PUBLIC_SUPABASE_URL; // 'https://nccxjzbpkrzincwsxpsu.supabase.co'
const KEY = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY; 

async function checkDirect() {
    try {
        console.log('Using URL:', URL);
        const response = await fetch(`${URL}/rest/v1/menu_items?select=name,image,category`, {
            headers: {
                'apikey': KEY,
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        if (!Array.isArray(data)) {
            console.error('Unexpected response:', data);
            return;
        }

        const nonUnsplash = data.filter(item => 
            item.image && 
            !item.image.includes('unsplash.com') && 
            !item.image.includes('images.unsplash.com') &&
            item.image.trim() !== ''
        );

        console.log(`Found ${nonUnsplash.length} items with non-Unsplash URLs out of ${data.length} total.`);
        console.log('--- List ---');
        nonUnsplash.forEach(item => {
            console.log(`[${item.category}] ${item.name}: ${item.image}`);
        });
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

checkDirect();

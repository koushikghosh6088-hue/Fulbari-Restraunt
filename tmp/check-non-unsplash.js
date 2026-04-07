const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function checkNonUnsplash() {
    const { data, error } = await supabase
        .from('menu_items')
        .select('name, image, category');
        
    if (error) {
        console.error('Error fetching menu items:', error);
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
}

checkNonUnsplash();

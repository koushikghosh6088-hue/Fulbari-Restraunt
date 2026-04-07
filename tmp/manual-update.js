const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const KEY = envConfig.SUPABASE_SERVICE_ROLE_KEY;

async function manualUpdate() {
    const updates = [
        { 
            id: '17829bec-3a2e-4ab6-9fb5-e3fa2826175b', 
            name: 'BBQ Chicken (6pc)', 
            imageUrl: 'https://utfs.io/f/KAr3IBxenJxmZXB5u4wRXz4IHAnmcxQ2PVg507fhs1LlNqbT' 
        },
        { 
            id: 'f758fbe5-1f92-45e5-abae-31518af2b6e1', 
            name: 'Baby Corn Manchurian', 
            imageUrl: 'https://utfs.io/f/KAr3IBxenJxmhROD0spQkuInHFaZ4DXfLs0UrgOSYAwBPey1.jpg' 
        }
    ];

    for (const up of updates) {
        console.log(`Updating ${up.name}...`);
        const response = await fetch(`${URL}/rest/v1/menu_items?id=eq.${up.id}`, {
            method: 'PATCH',
            headers: {
                'apikey': KEY,
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ image: up.imageUrl })
        });

        if (response.ok) {
            console.log(`Successfully updated ${up.name}`);
        } else {
            const err = await response.text();
            console.error(`Failed to update ${up.name}:`, err);
        }
    }
}

manualUpdate();

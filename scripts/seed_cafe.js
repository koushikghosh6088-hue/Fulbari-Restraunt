const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
const envData = fs.readFileSync(envPath, 'utf-8');
const envConfig = dotenv.parse(envData);
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const cafeMenuData = {
    "breakfast": [
        { "name": "Bread Omelette", "price": 60, "isVeg": false },
        { "name": "Bread Butter Toast", "price": 50, "isVeg": true },
        { "name": "Cheese Omelette", "price": 50, "isVeg": false },
        { "name": "Double Egg Omelette", "price": 40, "isVeg": false },
        { "name": "Boiled Egg", "price": 35, "isVeg": false },
        { "name": "Puri Sabji", "price": 50, "isVeg": true },
        { "name": "Aloo Paratha with Curd", "price": 80, "isVeg": true },
        { "name": "Plain Dosa", "price": 50, "isVeg": true },
        { "name": "Masala Dosa", "price": 80, "isVeg": true }
    ],
    "Tea & Coffee": [
        { "name": "Tea", "price": 15, "price_options": [15, 20, 25], "isVeg": true },
        { "name": "Black Tea", "price": 20, "isVeg": true },
        { "name": "Green Tea", "price": 25, "isVeg": true },
        { "name": "Black Coffee", "price": 20, "isVeg": true },
        { "name": "Coffee", "price": 40, "isVeg": true }
    ],
    "Maggi & Pasta": [
        { "name": "White Sauce Pasta", "price": 210, "variant_prices": { "veg": 210, "egg": 230, "chicken": 260 }, "isVeg": false },
        { "name": "Red Sauce Pasta", "price": 200, "variant_prices": { "veg": 200, "egg": 220, "chicken": 250 }, "isVeg": false },
        { "name": "Mixed Sauce Pasta", "price": 230, "variant_prices": { "veg": 230, "egg": 240, "chicken": 260 }, "isVeg": false },
        { "name": "Sofi Maggi", "price": 70, "variant_prices": { "veg": 70, "egg": 90, "chicken": 110 }, "isVeg": false },
        { "name": "Fried Maggi", "price": 100, "variant_prices": { "veg": 100, "egg": 120, "chicken": 150 }, "isVeg": false }
    ],
    "Burgers & Sandwiches": [
        { "name": "Burger", "price": 100, "variant_prices": { "veg": 100, "chicken": 150 }, "isVeg": false },
        { "name": "Grilled Sandwich", "price": 120, "variant_prices": { "veg": 120, "chicken": 150 }, "isVeg": false },
        { "name": "Club Sandwich", "price": 150, "variant_prices": { "veg": 150, "chicken": 200 }, "isVeg": false }
    ],
    "Momo": [
        { "name": "Steam Momo", "price": 100, "variant_prices": { "veg": 100, "chicken": 150 }, "isVeg": false },
        { "name": "Fried Momo", "price": 120, "variant_prices": { "veg": 120, "chicken": 160 }, "isVeg": false }
    ],
    "Snacks": [
        { "name": "Chicken Cheese Ball", "price": 60, "isVeg": false },
        { "name": "Chicken Finger", "price": 60, "isVeg": false },
        { "name": "Fish Ball", "price": 60, "isVeg": false },
        { "name": "Veg Corn Ball", "price": 60, "isVeg": true }
    ],
    "Beverages": [
        { "name": "Fresh Lime Soda", "price": 60, "isVeg": true },
        { "name": "Masala Cola", "price": 60, "isVeg": true },
        { "name": "Virgin Mojito", "price": 80, "isVeg": true },
        { "name": "Black Currant", "price": 80, "isVeg": true },
        { "name": "Milk Shake", "price": 100, "isVeg": true },
        { "name": "Cold Coffee", "price": 120, "isVeg": true },
        { "name": "Dahi Lassi", "price": 60, "isVeg": true }
    ]
};

async function seed() {
    console.log('🚀 Starting Seeding...');

    // 1. Update existing items to RESTAURANT
    console.log('📝 Marking existing items as RESTAURANT...');
    const { error: updateErr } = await supabase
        .from('menu_items')
        .update({ menu_type: 'RESTAURANT' })
        .is('menu_type', null);

    if (updateErr) console.warn('⚠️ Update current items warning:', updateErr.message);

    // 2. Insert Cafe items
    console.log('☕ Inserting Cafe items...');
    for (const [category, items] of Object.entries(cafeMenuData)) {
        for (const item of items) {
            const { error: insertErr } = await supabase
                .from('menu_items')
                .insert([{
                    ...item,
                    category,
                    menu_type: 'CAFE',
                    available: true,
                    description: `Crispy and delicious ${item.name} from Fulbari Cafe.`,
                    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop' // Placeholder
                }]);

            if (insertErr) {
                console.error(`❌ Error inserting ${item.name}:`, insertErr.message);
            } else {
                console.log(`✅ Inserted ${item.name}`);
            }
        }
    }

    console.log('✨ Seeding Finished!');
}

seed();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Extract env vars manually from .env.local
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length > 0) env[key.trim()] = rest.join('=').trim().replace(/^['"](.*)['"]$/, '$1');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const categoryImages = {
    "breakfast": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
    "dosa": "https://images.unsplash.com/photo-1589301760014-d929f3979dbf?q=80&w=800",
    "omelette": "https://images.unsplash.com/photo-1510629954389-c1e0da47d4ec?q=80&w=800",
    "tea": "https://images.unsplash.com/photo-1544787210-28272d3d9402?q=80&w=800",
    "coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800",
    "pasta": "https://images.unsplash.com/photo-1645112481355-6db2430481ff?q=80&w=800",
    "maggi": "https://images.unsplash.com/photo-1612927335702-582178e584d4?q=80&w=800",
    "burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
    "sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800",
    "momo": "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=800",
    "snacks": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800",
    "beverages": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    "shake": "https://images.unsplash.com/photo-1579954115545-a95591f28be0?q=80&w=800"
};

const cafeMenuData = {
    "breakfast": [
        { "name": "Bread Omelette", "price": 60, "img": categoryImages.omelette },
        { "name": "Bread Butter Toast", "price": 50, "img": "https://images.unsplash.com/photo-1525811902-f23426213fd0?q=80&w=800" },
        { "name": "Cheese Omelette", "price": 50, "img": categoryImages.omelette },
        { "name": "Double Egg Omelette", "price": 40, "img": categoryImages.omelette },
        { "name": "Boiled Egg", "price": 35, "img": "https://images.unsplash.com/photo-1587486916761-42ec33026815?q=80&w=800" },
        { "name": "Puri Sabji", "price": 50, "img": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800" },
        { "name": "Aloo Paratha with Curd", "price": 80, "img": "https://images.unsplash.com/photo-1626450919821-36f98751f7d5?q=80&w=800" },
        { "name": "Plain Dosa", "price": 50, "img": categoryImages.dosa },
        { "name": "Masala Dosa", "price": 80, "img": categoryImages.dosa }
    ],
    "tea_coffee": [
        { "name": "Tea", "price_options": [15, 20, 25], "img": categoryImages.tea },
        { "name": "Black Tea", "price": 20, "img": categoryImages.tea },
        { "name": "Green Tea", "price": 25, "img": "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=800" },
        { "name": "Black Coffee", "price": 20, "img": categoryImages.coffee },
        { "name": "Coffee", "price": 40, "img": categoryImages.coffee }
    ],
    "maggi_pasta": [
        { "name": "White Sauce Pasta", "variant_prices": { "veg": 210, "egg": 230, "chicken": 260 }, "img": categoryImages.pasta },
        { "name": "Red Sauce Pasta", "variant_prices": { "veg": 200, "egg": 220, "chicken": 250 }, "img": categoryImages.pasta }
    ],
    "burger_sandwich": [
        { "name": "Burger", "variant_prices": { "veg": 100, "chicken": 150 }, "img": categoryImages.burger },
        { "name": "Grilled Sandwich", "variant_prices": { "veg": 120, "chicken": 150 }, "img": categoryImages.sandwich }
    ],
    "momo": [
        { "name": "Steam Momo", "variant_prices": { "veg": 100, "chicken": 150 }, "img": categoryImages.momo },
        { "name": "Fried Momo", "variant_prices": { "veg": 120, "chicken": 160 }, "img": categoryImages.momo }
    ],
    "snacks": [
        { "name": "Chicken Cheese Ball", "price": 60, "img": categoryImages.snacks },
        { "name": "Chicken Finger", "price": 60, "img": categoryImages.snacks },
        { "name": "Fish Ball", "price": 60, "img": categoryImages.snacks },
        { "name": "Veg Corn Ball", "price": 60, "img": categoryImages.snacks }
    ],
    "mocktail_beverages": [
        { "name": "Fresh Lime Soda", "price": 60, "img": categoryImages.beverages },
        { "name": "Masala Cola", "price": 60, "img": categoryImages.beverages },
        { "name": "Virgin Mojito", "price": 80, "img": categoryImages.beverages },
        { "name": "Black Currant", "price": 80, "img": categoryImages.beverages },
        { "name": "Milk Shake", "price": 100, "img": categoryImages.shake },
        { "name": "Cold Coffee", "price": 120, "img": categoryImages.coffee },
        { "name": "Dahi Lassi", "price": 60, "img": categoryImages.beverages }
    ]
};

const categoryMap = {
    "breakfast": "Breakfast",
    "tea_coffee": "Tea & Coffee",
    "maggi_pasta": "Maggi & Pasta",
    "burger_sandwich": "Burgers & Sandwiches",
    "momo": "Momos",
    "snacks": "Snacks",
    "mocktail_beverages": "Beverages"
};

async function migrate() {
    console.log("Starting final FINAL migration...");
    const itemsToUpsert = [];

    for (const [key, items] of Object.entries(cafeMenuData)) {
        const categoryName = categoryMap[key];
        for (const rawItem of items) {
            const mappedItem = {
                name: rawItem.name,
                description: `${rawItem.name} - Freshly prepared at Fulbari Cafe.`,
                price: rawItem.price || 0,
                category: categoryName,
                image: rawItem.img,
                isVeg: !rawItem.name.toLowerCase().includes("chicken") && !rawItem.name.toLowerCase().includes("egg") && !rawItem.name.toLowerCase().includes("fish"),
                available: true,
                menu_type: "CAFE",
                variant_prices: rawItem.variant_prices || null,
                price_options: rawItem.price_options || null
            };
            itemsToUpsert.push(mappedItem);
        }
    }

    await supabase.from('menu_items').delete().eq('menu_type', 'CAFE');
    const { error } = await supabase.from('menu_items').insert(itemsToUpsert);

    if (error) console.error("Migration failed:", error);
    else console.log("Final FINAL migration successful!");
}

migrate();

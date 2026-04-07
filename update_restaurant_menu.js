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
    "soups": "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800",
    "appetizers_veg": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=800",
    "appetizers_non_veg": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800",
    "noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800",
    "chinese_main_course_veg": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800",
    "chinese_main_course_non_veg": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800",
    "indian_main_course_veg": "https://images.unsplash.com/photo-1546833999-b9f58160280b?q=80&w=800",
    "indian_main_course_non_veg": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800",
    "mutton": "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=800",
    "fish_prawns": "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=800",
    "rice": "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800",
    "biryani": "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800",
    "tandoori": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800",
    "bread": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800",
    "mocktails": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    "ice_cream": "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?q=80&w=800",
    "salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    "raita": "https://images.unsplash.com/photo-1546833999-b9f58160280b?q=80&w=800",
    "egg": "https://images.unsplash.com/photo-1510629954389-c1e0da47d4ec?q=80&w=800"
};

const restaurantMenuData = {
    "soups": {
        "chinese_soup": [
            { "name": "Clear Soup", "variant_prices": { "veg": 130, "nonVeg": 160 }, "img": categoryImages.soups, "isVeg": true },
            { "name": "Sweet Corn Soup", "variant_prices": { "veg": 140, "nonVeg": 170 }, "img": categoryImages.soups, "isVeg": true },
            { "name": "Hot & Sour Soup", "variant_prices": { "veg": 140, "nonVeg": 170 }, "img": categoryImages.soups, "isVeg": true },
            { "name": "Manchow Soup", "variant_prices": { "veg": 150, "nonVeg": 180 }, "img": categoryImages.soups, "isVeg": true },
            { "name": "Noodles Soup", "variant_prices": { "veg": 140, "nonVeg": 170 }, "img": categoryImages.soups, "isVeg": true }
        ]
    },
    "appetizers": {
        "veg": [
            { "name": "French Fry", "price": 119, "img": categoryImages.appetizers_veg, "isVeg": true },
            { "name": "Honey Chilli Potato", "price": 129, "img": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=800", "isVeg": true },
            { "name": "Paneer Pakora (6pc)", "price": 209, "img": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800", "isVeg": true },
            { "name": "Dry Chilli Paneer (8pc)", "price": 259, "img": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800", "isVeg": true },
            { "name": "Crispy Chilli Babycorn", "price": 209, "img": categoryImages.appetizers_veg, "isVeg": true },
            { "name": "Chilli Mushroom Dry", "price": 209, "img": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800", "isVeg": true },
            { "name": "Mushroom Salt And Pepper", "price": 219, "img": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800", "isVeg": true }
        ],
        "nonVeg": [
            { "name": "Chicken Drums of Heaven (6pc)", "price": 239, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "BBQ Chicken (6pc)", "price": 249, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "Crispy Chicken", "price": 219, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "Honey Garlic Chicken (8pc)", "price": 249, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "Dragon Chicken (8pc)", "price": 259, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "Chicken 65 (8pc)", "price": 249, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "Dry Chilli Chicken (8pc)", "price": 249, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "Chicken Salt and Pepper", "price": 239, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "Chicken Pakora (8pc)", "price": 229, "img": categoryImages.appetizers_non_veg, "isVeg": false },
            { "name": "Chilli Fish (6pc)", "price": 319, "img": categoryImages.fish_prawns, "isVeg": false },
            { "name": "Fish Finger (6pc)", "price": 319, "img": categoryImages.fish_prawns, "isVeg": false },
            { "name": "Dry Chilli Prawns (6pc)", "price": 249, "img": categoryImages.fish_prawns, "isVeg": false },
            { "name": "Golden Fried Prawns (6pc)", "price": 349, "img": categoryImages.fish_prawns, "isVeg": false }
        ]
    },
    "noodles": [
        { "name": "Hakka Noodles", "variant_prices": { "veg": 139, "egg": 159, "chicken": 189, "mixed": 219 }, "img": categoryImages.noodles, "isVeg": true },
        { "name": "Lo Mein Noodles", "variant_prices": { "veg": 149, "egg": 169, "chicken": 199, "mixed": 229 }, "img": categoryImages.noodles, "isVeg": true },
        { "name": "Shanghai Noodles", "variant_prices": { "veg": 159, "egg": 179, "chicken": 209, "mixed": 239 }, "img": categoryImages.noodles, "isVeg": true },
        { "name": "Hong Kong Noodles", "variant_prices": { "veg": 159, "egg": 179, "chicken": 209, "mixed": 239 }, "img": categoryImages.noodles, "isVeg": true },
        { "name": "Kimchi Noodles", "variant_prices": { "veg": 159, "egg": 179, "chicken": 209, "mixed": 239 }, "img": categoryImages.noodles, "isVeg": true },
        { "name": "Schezwan Noodles", "variant_prices": { "veg": 149, "egg": 169, "chicken": 199, "mixed": 229 }, "img": categoryImages.noodles, "isVeg": true }
    ],
    "chinese_main_course": {
        "veg": [
            { "name": "Chilli Paneer", "price": 239, "img": categoryImages.chinese_main_course_veg, "isVeg": true },
            { "name": "Paneer Manchurian", "price": 239, "img": categoryImages.chinese_main_course_veg, "isVeg": true },
            { "name": "Schezwan Paneer", "price": 249, "img": categoryImages.chinese_main_course_veg, "isVeg": true },
            { "name": "Veg Manchurian", "price": 199, "img": categoryImages.chinese_main_course_veg, "isVeg": true },
            { "name": "Baby Corn Manchurian", "price": 199, "img": categoryImages.chinese_main_course_veg, "isVeg": true },
            { "name": "Chilli Mushroom", "price": 199, "img": categoryImages.chinese_main_course_veg, "isVeg": true }
        ],
        "chicken": [
            { "name": "Chilli Chicken", "price": 239, "img": categoryImages.chinese_main_course_non_veg, "isVeg": false },
            { "name": "Chicken Manchurian", "price": 239, "img": categoryImages.chinese_main_course_non_veg, "isVeg": false },
            { "name": "Shanghai Chicken", "price": 259, "img": categoryImages.chinese_main_course_non_veg, "isVeg": false },
            { "name": "Hong Kong Chicken", "price": 249, "img": categoryImages.chinese_main_course_non_veg, "isVeg": false },
            { "name": "Hot Garlic Chicken", "price": 249, "img": categoryImages.chinese_main_course_non_veg, "isVeg": false },
            { "name": "Butter Garlic Chicken", "price": 259, "img": categoryImages.chinese_main_course_non_veg, "isVeg": false }
        ]
    },
    "indian_main_course_veg": [
        { "name": "Dal Makhani", "price": 159, "img": categoryImages.indian_main_course_veg, "isVeg": true },
        { "name": "Veg Kolhapuri", "price": 189, "img": categoryImages.indian_main_course_veg, "isVeg": true },
        { "name": "Chana Masala", "price": 169, "img": categoryImages.indian_main_course_veg, "isVeg": true },
        { "name": "Palak Paneer", "price": 249, "img": categoryImages.indian_main_course_veg, "isVeg": true },
        { "name": "Paneer Butter Masala", "price": 259, "img": categoryImages.indian_main_course_veg, "isVeg": true },
        { "name": "Kadhai Paneer", "price": 249, "img": categoryImages.indian_main_course_veg, "isVeg": true }
    ],
    "indian_main_course_chicken": [
        { "name": "Chicken Curry (4pc)", "price": 219, "img": categoryImages.indian_main_course_non_veg, "isVeg": false },
        { "name": "Chicken Handi", "price": 259, "img": categoryImages.indian_main_course_non_veg, "isVeg": false },
        { "name": "Chicken Tikka Butter Masala", "price": 299, "img": categoryImages.indian_main_course_non_veg, "isVeg": false },
        { "name": "Hyderabadi Chicken", "price": 279, "img": categoryImages.indian_main_course_non_veg, "isVeg": false },
        { "name": "Fulbari Special Murg Musallam", "price": 459, "img": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800", "isVeg": false }
    ],
    "mutton": [
        { "name": "Mutton Curry", "price": 419, "img": categoryImages.mutton, "isVeg": false },
        { "name": "Mutton Rezala", "price": 429, "img": categoryImages.mutton, "isVeg": false },
        { "name": "Rara Mutton", "price": 559, "img": categoryImages.mutton, "isVeg": false }
    ],
    "fish_prawns": [
        { "name": "Katla Kaliya", "price": 220, "img": categoryImages.fish_prawns, "isVeg": false },
        { "name": "Ilish Bhapa", "price": 350, "img": categoryImages.fish_prawns, "isVeg": false },
        { "name": "Chingri Malaikari", "price": 350, "img": categoryImages.fish_prawns, "isVeg": false },
        { "name": "Prawn Masala", "price": 350, "img": categoryImages.fish_prawns, "isVeg": false }
    ],
    "salad": [
        { "name": "Green Salad", "price": 79, "img": categoryImages.salad, "isVeg": true },
        { "name": "Onion Salad", "price": 59, "img": categoryImages.salad, "isVeg": true },
        { "name": "Cucumber Salad", "price": 59, "img": categoryImages.salad, "isVeg": true },
        { "name": "Chinese Vegetables Salad", "price": 149, "img": categoryImages.salad, "isVeg": true },
        { "name": "Chinese Chicken Salad", "price": 219, "img": categoryImages.salad, "isVeg": false }
    ],
    "raita": [
        { "name": "Plain Curd", "price": 59, "img": categoryImages.raita, "isVeg": true },
        { "name": "Plain Raita", "price": 79, "img": categoryImages.raita, "isVeg": true },
        { "name": "Mixed Raita", "price": 99, "img": categoryImages.raita, "isVeg": true },
        { "name": "Pineapple Raita", "price": 119, "img": categoryImages.raita, "isVeg": true }
    ],
    "egg": [
        { "name": "Egg Curry (2pc)", "price": 60, "img": categoryImages.egg, "isVeg": false },
        { "name": "Omelette (Double)", "price": 50, "img": categoryImages.egg, "isVeg": false }
    ],
    "rice": [
        { "name": "Steam Rice", "price": 79, "img": categoryImages.rice, "isVeg": true },
        { "name": "Jeera Rice", "price": 119, "img": categoryImages.rice, "isVeg": true },
        { "name": "Veg Pulao", "price": 149, "img": categoryImages.rice, "isVeg": true },
        { "name": "Kashmiri Pulao", "price": 169, "img": categoryImages.rice, "isVeg": true }
    ],
    "biryani": [
        { "name": "Chicken Kacchi Biryani", "price": 179, "img": categoryImages.biryani, "isVeg": false },
        { "name": "Mutton Kacchi Biryani", "price": 219, "img": categoryImages.biryani, "isVeg": false }
    ],
    "tandoori": [
        { "name": "Paneer Tikka", "price": 299, "img": categoryImages.tandoori, "isVeg": true },
        { "name": "Tandoor Chicken", "variant_prices": { "full": 449, "half": 259 }, "img": categoryImages.tandoori, "isVeg": false },
        { "name": "Chicken Tangdi Kabab", "variant_prices": { "full": 419, "half": 219 }, "img": categoryImages.tandoori, "isVeg": false }
    ],
    "bread": [
        { "name": "Plain Roti", "price": 10, "img": categoryImages.bread, "isVeg": true },
        { "name": "Butter Naan", "price": 55, "img": categoryImages.bread, "isVeg": true },
        { "name": "Garlic Naan", "price": 59, "img": categoryImages.bread, "isVeg": true },
        { "name": "Masala Kulcha", "price": 69, "img": categoryImages.bread, "isVeg": true }
    ],
    "beverages": {
        "mocktails": [
            { "name": "Cold Drink", "price": 39, "img": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800", "isVeg": true },
            { "name": "Dahi Lassi", "price": 59, "img": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=800", "isVeg": true },
            { "name": "Milk Shake", "price": 129, "img": "https://images.unsplash.com/photo-1579954115545-a95591f28be0?q=80&w=800", "isVeg": true },
            { "name": "Milk Shake Flavours", "variant_prices": { "mango": 139, "oreo": 149, "strawberry": 149 }, "img": "https://images.unsplash.com/photo-1579954115545-a95591f28be0?q=80&w=800", "isVeg": true },
            { "name": "Fresh Lime Soda", "price": 79, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Masala Cola", "price": 79, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Blue Lagoon", "price": 99, "img": "https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=800", "isVeg": true },
            { "name": "Virgin Mojito", "price": 119, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Black Currant", "price": 119, "img": "https://images.unsplash.com/photo-1516743618441-df07a014a460?q=80&w=800", "isVeg": true },
            { "name": "Mango Delight", "price": 129, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "American Sign", "price": 129, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Rainbow", "price": 139, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Sunrise", "price": 129, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Green Ice Land", "price": 129, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "German Passion", "price": 139, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Indian Passion", "price": 139, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Blue Sky", "price": 129, "img": categoryImages.mocktails, "isVeg": true },
            { "name": "Cold Coffee", "price": 149, "img": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800", "isVeg": true },
            { "name": "Pina Colada", "price": 129, "img": "https://images.unsplash.com/photo-1517959105821-eaf2591934cd?q=80&w=800", "isVeg": true }
        ]
    },
    "desserts": [
        { "name": "Vanilla Ice cream", "price": 59, "img": categoryImages.ice_cream, "isVeg": true },
        { "name": "Chocolate Ice cream", "price": 69, "img": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800", "isVeg": true },
        { "name": "Mango Ice cream", "price": 69, "img": "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?q=80&w=800", "isVeg": true },
        { "name": "Butterscotch Ice cream", "price": 69, "img": "https://images.unsplash.com/photo-1542124948-cd3d29b1f230?q=80&w=800", "isVeg": true }
    ]
};

const categoryMap = {
    "soups": "Soups",
    "appetizers": "Appetizers",
    "noodles": "Noodles",
    "chinese_main_course": "Chinese Main Course",
    "indian_main_course_veg": "Indian main course Veg",
    "indian_main_course_chicken": "Indian Main course Chicken",
    "mutton": "Mutton",
    "fish_prawns": "Fish & Prawns",
    "rice": "Rice",
    "biryani": "Biryani",
    "tandoori": "Tandoori",
    "bread": "Bread",
    "beverages": "Beverages",
    "desserts": "Desserts",
    "salad": "Salad",
    "raita": "Raita",
    "egg": "Egg"
};

async function migrate() {
    console.log("Starting Restaurant Menu migration...");
    const itemsToUpsert = [];

    for (const [key, section] of Object.entries(restaurantMenuData)) {
        const categoryName = categoryMap[key];

        // Handle array sections (Noodles, Rice, Biryani, Tandoori, Bread)
        if (Array.isArray(section)) {
            for (const rawItem of section) {
                itemsToUpsert.push({
                    name: rawItem.name,
                    description: `${rawItem.name} - Exquisitely prepared at Fulbari Restaurant.`,
                    price: rawItem.price || 0,
                    category: categoryName,
                    image: rawItem.img,
                    isVeg: rawItem.isVeg,
                    available: true,
                    menu_type: "RESTAURANT",
                    variant_prices: rawItem.variant_prices || null
                });
            }
        }
        // Handle object sections (Soups, Appetizers, Main Course, Beverages)
        else {
            for (const [subKey, items] of Object.entries(section)) {
                for (const rawItem of items) {
                    itemsToUpsert.push({
                        name: rawItem.name,
                        description: `${rawItem.name} - Exquisitely prepared at Fulbari Restaurant.`,
                        price: rawItem.price || 0,
                        category: categoryName,
                        image: rawItem.img,
                        isVeg: rawItem.isVeg,
                        available: true,
                        menu_type: "RESTAURANT",
                        variant_prices: rawItem.variant_prices || null
                    });
                }
            }
        }
    }

    console.log(`Prepared ${itemsToUpsert.length} items. Deleting old RESTAURANT items first...`);
    await supabase.from('menu_items').delete().eq('menu_type', 'RESTAURANT');

    console.log("Upserting new RESTAURANT items...");
    const { error } = await supabase.from('menu_items').insert(itemsToUpsert);

    if (error) console.error("Migration failed:", error);
    else console.log("Restaurant Menu migration successful!");
}

migrate();

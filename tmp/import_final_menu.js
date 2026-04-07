const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categoryImages = {
    "Soups": "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800",
    "Appetizers": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800",
    "Noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800",
    "Chinese Main Course": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800",
    "Indian Main Course": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800",
    "Fish & Prawns": "https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?q=80&w=800",
    "Mutton": "https://images.unsplash.com/photo-1545247181-516773cae754?q=80&w=800",
    "Biryani": "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800",
    "Rice": "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=800",
    "Bread": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800",
    "Tandoori": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800",
    "Beverages": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800",
    "Desserts": "https://images.unsplash.com/photo-1501443762994-82bd5dabb892?q=80&w=800",
    "Breakfast": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
    "Snacks": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800",
    "Momos": "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?q=80&w=800",
    "Burgers & Sandwiches": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800",
    "Maggi & Pasta": "https://images.unsplash.com/photo-1612927335702-582178e584d4?q=80&w=800"
};

const categoryMapping = {
    "Chinese Soup": "Soups",
    "Appetizer (Veg)": "Appetizers",
    "Appetizer (Non-Veg)": "Appetizers",
    "Chinese Noodles": "Noodles",
    "Indian Main Course (Veg)": "Indian Main Course",
    "Chinese Rice": "Rice",
    "Indian Main Course (Non-Veg - Chicken)": "Indian Main Course",
    "Mutton": "Mutton",
    "Fish & Prawns (Indian)": "Fish & Prawns",
    "Egg": "Indian Main Course",
    "Indian Rice": "Rice",
    "Biryani": "Biryani",
    "Salads": "Appetizers",
    "Raita": "Appetizers",
    "Tandoori Starter": "Tandoori",
    "Chinese Main Course (Veg)": "Chinese Main Course",
    "Chinese Main Course (Non-Veg - Chicken)": "Chinese Main Course",
    "Chinese Main Course (Fish & Prawns)": "Fish & Prawns",
    "Bread": "Bread",
    "Mocktail": "Beverages",
    "Ice Cream": "Desserts"
};

async function importMenu() {
    console.log("Reading restaurant_new_menu.json...");
    const menuData = JSON.parse(fs.readFileSync('src/data/restaurant_new_menu.json', 'utf8'));
    
    const itemsToInsert = [];

    menuData.menu.forEach(catSection => {
        const rawCategory = catSection.category;
        const normalizedCategory = categoryMapping[rawCategory] || rawCategory;
        
        catSection.items.forEach(item => {
            let iv = item.name.toLowerCase();
            const isVeg = !(iv.includes('chicken') || iv.includes('fish') || iv.includes('prawn') || iv.includes('mutton') || iv.includes('egg') || rawCategory.includes('Non-Veg'));
            
            let price = item.price || 0;
            let variant_prices = null;
            
            // Handle variants
            if (item.veg || item.nonVeg) {
                variant_prices = { veg: item.veg || 0, nonVeg: item.nonVeg || 0 };
                price = item.veg || item.nonVeg || 0;
            } else if (item.basa || item.bhetki) {
                variant_prices = { basa: item.basa, bhetki: item.bhetki };
                price = item.basa || item.bhetki;
            } else if (item.egg || item.chicken || item.mixed) {
                variant_prices = { veg: item.veg || 0, egg: item.egg || 0, chicken: item.chicken || item.eggChicken || 0, mixed: item.mixed || 0 };
                price = item.veg || item.egg || item.chicken || 0;
            }

            itemsToInsert.push({
                name: item.name,
                description: `${item.name} - Authentically prepared at Fulbari Restaurant.`,
                price: price,
                variant_prices: variant_prices,
                category: normalizedCategory,
                image: categoryImages[normalizedCategory] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
                isVeg: isVeg,
                available: true,
                menu_type: "RESTAURANT"
            });
        });
    });

    // Add Cafe items to ensure they stay
    console.log("Adding Cafe items from legacy script data...");
    // (Simplified cafe items from update_cafe_menu.js)
    const cafeCategories = {
        "Breakfast": [
            { name: "Bread Omelette", price: 60, isVeg: false },
            { name: "Bread Butter Toast", price: 50, isVeg: true },
            { name: "Cheese Omelette", price: 50, isVeg: false },
            { name: "Puri Sabji", price: 50, isVeg: true },
            { name: "Masala Dosa", price: 80, isVeg: true }
        ],
        "Tea & Coffee": [
            { name: "Tea", price: 15, isVeg: true },
            { name: "Coffee", price: 40, isVeg: true }
        ],
        "Snacks": [
            { name: "Fish cutlet", price: 60, isVeg: false },
            { name: "Chicken finger", price: 60, isVeg: false }
        ]
    };

    Object.entries(cafeCategories).forEach(([cat, items]) => {
        items.forEach(item => {
            itemsToInsert.push({
                name: item.name,
                description: `${item.name} - Freshly prepared at Fulbari Cafe.`,
                price: item.price,
                category: cat,
                image: categoryImages[cat] || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
                isVeg: item.isVeg,
                available: true,
                menu_type: "CAFE"
            });
        });
    });

    console.log(`Prepared ${itemsToInsert.length} items. Syncing with Supabase...`);
    
    // Delete existing to avoid duplicates if ID isn't used
    const { error: delError } = await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (delError) {
        console.error("Delete failed:", delError);
        return;
    }

    const { error: insError } = await supabase.from('menu_items').insert(itemsToInsert);
    if (insError) {
        console.error("Insert failed:", insError);
    } else {
        console.log("Full Menu Sync Successful!");
    }
}

importMenu();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMissingItems() {
    console.log("Checking for 'Fish', 'Prawns', and 'Dessert' items...");
    
    // Check all items to see what categories exist
    const { data: allItems, error: allError } = await supabase
        .from('menu_items')
        .select('category, name, available, menu_type, isVeg');

    if (allError) {
        console.error("Error fetching items:", allError);
        return;
    }

    const categories = [...new Set(allItems.map(item => item.category))];
    console.log("Available Categories in DB:", categories);

    const fishItems = allItems.filter(item => 
        item.category?.toLowerCase().includes('fish') || 
        item.category?.toLowerCase().includes('prawn')
    );
    
    console.log("\n--- Fish & Prawn Items ---");
    if (fishItems.length === 0) {
        console.log("No items found related to Fish or Prawns.");
    } else {
        fishItems.forEach(item => {
            console.log(`- ${item.name} (${item.category}) | Available: ${item.available} | Type: ${item.menu_type} | Veg: ${item.isVeg}`);
        });
    }

    const dessertItems = allItems.filter(item => 
        item.category?.toLowerCase().includes('dessert') || 
        item.category?.toLowerCase().includes('sweet') ||
        item.category?.toLowerCase().includes('ice cream')
    );
    
    console.log("\n--- Dessert Items ---");
    if (dessertItems.length === 0) {
        console.log("No items found related to Desserts.");
    } else {
        dessertItems.forEach(item => {
            console.log(`- ${item.name} (${item.category}) | Available: ${item.available} | Type: ${item.menu_type} | Veg: ${item.isVeg}`);
        });
    }
}

checkMissingItems();

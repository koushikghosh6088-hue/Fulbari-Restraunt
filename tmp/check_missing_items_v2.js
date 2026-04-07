const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const logFile = 'tmp/diagnostic_log.txt';
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

if (fs.existsSync(logFile)) fs.unlinkSync(logFile);

if (!supabaseUrl || !supabaseAnonKey) {
    log("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMissingItems() {
    log("Checking for 'Fish', 'Prawns', and 'Dessert' items...");
    
    // Check all items to see what categories exist
    const { data: allItems, error: allError } = await supabase
        .from('menu_items')
        .select('category, name, available, menu_type, isVeg');

    if (allError) {
        log("Error fetching items: " + JSON.stringify(allError));
        return;
    }

    const categories = [...new Set(allItems.map(item => item.category))];
    log("Available Categories in DB: " + categories.join(', '));

    const fishItems = allItems.filter(item => 
        item.category?.toLowerCase().includes('fish') || 
        item.category?.toLowerCase().includes('prawn')
    );
    
    log("\n--- Fish & Prawn Items ---");
    if (fishItems.length === 0) {
        log("No items found related to Fish or Prawns.");
    } else {
        fishItems.forEach(item => {
            log(`- ${item.name} (${item.category}) | Available: ${item.available} | Type: ${item.menu_type} | Veg: ${item.isVeg}`);
        });
    }

    const dessertItems = allItems.filter(item => 
        item.category?.toLowerCase().includes('dessert') || 
        item.category?.toLowerCase().includes('sweet') ||
        item.category?.toLowerCase().includes('ice cream')
    );
    
    log("\n--- Dessert Items ---");
    if (dessertItems.length === 0) {
        log("No items found related to Desserts.");
    } else {
        dessertItems.forEach(item => {
            log(`- ${item.name} (${item.category}) | Available: ${item.available} | Type: ${item.menu_type} | Veg: ${item.isVeg}`);
        });
    }
}

checkMissingItems();

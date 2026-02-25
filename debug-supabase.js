const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debug() {
    console.log("Checking Supabase Connection...");
    console.log("URL:", supabaseUrl);

    // 1. Check Gallery Items
    const { data: gallery, error: galleryError } = await supabase
        .from('gallery_items')
        .select('*');

    if (galleryError) console.error("Gallery Error:", galleryError);
    else console.log("Gallery Items Count:", gallery?.length || 0);

    // 2. Check Events
    const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*');

    if (eventsError) console.error("Events Error:", eventsError);
    else console.log("Events Count:", events?.length || 0);

    // 3. Check Menu
    const { data: menu, error: menuError } = await supabase
        .from('menu_items')
        .select('*');

    if (menuError) console.error("Menu Error:", menuError);
    else console.log("Menu Items Count:", menu?.length || 0);

    if (gallery && gallery.length > 0) {
        console.log("First Gallery Item URL:", gallery[0].url);
    }
}

debug();

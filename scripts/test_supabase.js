const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envData = fs.readFileSync(envPath, 'utf-8');
const envConfig = dotenv.parse(envData);
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('🔍 Testing Supabase Connection...');

    // Test 1: Connection & Table access
    const { data: tableData, error: tableError } = await supabase
        .from('menu_items')
        .select('count', { count: 'exact', head: true });

    if (tableError) {
        console.error('❌ Database Access Failed:', tableError.message);
    } else {
        console.log('✅ Database Connection Successful!');
    }

    // Test 2: Storage Bucket access
    console.log('🔍 Testing Storage Bucket (menu-images)...');
    const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('menu-images');

    if (bucketError) {
        console.error('❌ Bucket Access Failed:', bucketError.message);
        console.log('👉 Tip: Ensure you created a bucket named "menu-images" in Supabase Storage.');
    } else {
        console.log('✅ Bucket "menu-images" found!');
        if (!bucketData.public) {
            console.warn('⚠️ Warning: Bucket is NOT set to Public. Images will not show on the site.');
        } else {
            console.log('✅ Bucket is Public!');
        }
    }
}

testConnection();

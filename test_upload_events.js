const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    const buf = Buffer.from("test image data 12345");

    console.log("Testing EVENTS bucket...");
    const { data: eData, error: eError } = await supabase.storage.from('events').upload('test.jpeg', buf, {
        contentType: 'image/jpeg',
        upsert: true
    });
    console.log("EVENTS upload result:", JSON.stringify({ eData, eError }, null, 2));

    console.log("Testing MENU-IMAGES bucket...");
    const { data: mData, error: mError } = await supabase.storage.from('menu-images').upload('test.jpeg', buf, {
        contentType: 'image/jpeg',
        upsert: true
    });
    console.log("MENU-IMAGES upload result:", JSON.stringify({ mData, mError }, null, 2));
}
test();

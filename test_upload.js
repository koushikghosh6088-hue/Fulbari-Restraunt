const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    const buf = Buffer.from("test image data 12345");
    const { data, error } = await supabase.storage.from('events').upload('test.jpeg', buf, {
        contentType: 'image/jpeg',
        upsert: true
    });
    console.log("Upload result:", JSON.stringify({ data, error }, null, 2));
}
test();

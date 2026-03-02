const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function testSupabase() {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/events/test_direct.jpg`;

    const content = Buffer.from("test image data 12345");

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                'Content-Type': 'image/jpeg'
            },
            body: content
        });

        console.log("Status:", res.status);
        console.log("Response:", await res.text());
    } catch (e) {
        console.error(e);
    }
}

testSupabase();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function listStorage() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    console.log("Listing buckets...");
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error("Bucket error:", bucketError);
        return;
    }
    
    for (const bucket of buckets) {
        console.log(`\nBucket: ${bucket.name}`);
        const { data: files, error: fileError } = await supabase.storage.from(bucket.name).list();
        if (fileError) {
            console.error(`File error in bucket ${bucket.name}:`, fileError);
            continue;
        }
        files.forEach(file => {
            console.log(` - ${file.name} (size: ${file.metadata?.size || 'unknown'})`);
        });
    }
}

listStorage();

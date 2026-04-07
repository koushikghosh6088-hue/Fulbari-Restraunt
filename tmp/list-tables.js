const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Load env
const envConfig = dotenv.parse(fs.readFileSync('c:/Users/Koushik/Downloads/Fulbari Restraunt/.env.local'));
const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.SUPABASE_SERVICE_ROLE_KEY);

async function listTables() {
    const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
    if (error) {
        console.error('Error listing tables:', error);
        // Try a direct query if information_schema is restricted
        const { data: data2, error: error2 } = await supabase.rpc('get_tables');
        if (error2) console.error('RPC get_tables failed:', error2);
        else console.log('Tables (via RPC):', data2);
    } else {
        console.log('Tables:', data.map(t => t.table_name));
    }
}

listTables();

require('dotenv').config();
const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');

async function testMongoDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MongoDB: MONGODB_URI is not defined in environment variables');
        return false;
    }

    try {
        const client = new MongoClient(uri);
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log('✅ MongoDB: Connection successful');
        await client.close();
        return true;
    } catch (error) {
        console.error('❌ MongoDB: Connection failed -', error.message);
        return false;
    }
}

async function testSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase: URL or Key is not defined in environment variables');
        return false;
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        console.log('✅ Supabase: Connection successful');
        return true;
    } catch (error) {
        console.error('❌ Supabase: Connection failed -', error.message);
        return false;
    }
}

async function main() {
    console.log('Testing database connections...\n');
    
    const mongoResult = await testMongoDB();
    console.log(''); // Empty line for readability
    const supabaseResult = await testSupabase();
    
    console.log('\nSummary:');
    console.log('--------');
    console.log(`MongoDB: ${mongoResult ? 'PASS' : 'FAIL'}`);
    console.log(`Supabase: ${supabaseResult ? 'PASS' : 'FAIL'}`);
    
    if (!mongoResult || !supabaseResult) {
        process.exit(1);
    }
}

main().catch(console.error);

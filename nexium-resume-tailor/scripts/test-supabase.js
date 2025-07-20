// Supabase connection test for n8n workflow
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from your .env
const SUPABASE_URL = 'https://ceqcfnrwofzsjmqwyqpl.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcWNmbnJ3b2Z6c2ptcXd5cXBsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjcyNzg0NSwiZXhwIjoyMDY4MzAzODQ1fQ.-ecDPuTYqA4O1mO6EZuDLWB8PM7oP20X_7-ojQFcbgs';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  try {
    // Initialize Supabase client
    console.log('📡 Connecting to Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log('✅ Supabase client initialized');
    
    // Test connection by checking tables
    console.log('📋 Checking database tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('resume_analyses')
      .select('count', { count: 'exact', head: true });
    
    if (tablesError) {
      console.error('❌ Table check failed:', tablesError.message);
      return;
    }
    
    console.log('✅ Successfully connected to resume_analyses table');
    
    // Test inserting sample data
    console.log('\n📝 Testing data insertion...');
    const sampleAnalysis = {
      analysis_id: "test_analysis_" + Date.now(),
      user_id: "test_user",
      job_title: "Test Engineer",
      company: "Test Company",
      job_description: "Sample job description for testing",
      resume_text: "Sample extracted resume text for testing",
      results: {
        overallScore: {
          matchPercentage: "85",
          strengths: ["Test strength 1", "Test strength 2"],
          improvementAreas: ["Test improvement 1"]
        },
        keywordAnalysis: {
          missingKeywords: ["test_keyword"],
          matchingKeywords: ["react", "javascript"],
          keywordScore: "75"
        }
      },
      metadata: {
        fileInfo: {
          fileName: "test_resume.pdf",
          mimeType: "application/pdf"
        }
      }
    };
    
    const { data: insertedData, error: insertError } = await supabase
      .from('resume_analyses')
      .insert([sampleAnalysis])
      .select();
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      return;
    }
    
    console.log(`✅ Inserted test document with ID: ${insertedData[0].id}`);
    
    // Test reading the data back
    console.log('\n🔍 Verifying data retrieval...');
    const { data: retrievedData, error: selectError } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('analysis_id', sampleAnalysis.analysis_id);
    
    if (selectError) {
      console.error('❌ Select failed:', selectError.message);
      return;
    }
    
    if (retrievedData && retrievedData.length > 0) {
      console.log('✅ Successfully retrieved test document');
      console.log(`   Analysis ID: ${retrievedData[0].analysis_id}`);
      console.log(`   Score: ${retrievedData[0].results.overallScore.matchPercentage}%`);
    }
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('resume_analyses')
      .delete()
      .eq('analysis_id', sampleAnalysis.analysis_id);
    
    if (deleteError) {
      console.error('❌ Delete failed:', deleteError.message);
      return;
    }
    
    console.log('✅ Test data cleaned up');
    
    // Get table stats
    console.log('\n📈 Table Statistics:');
    const { count } = await supabase
      .from('resume_analyses')
      .select('*', { count: 'exact', head: true });
    
    console.log(`   resume_analyses: ${count} records`);
    
    console.log('\n🎯 Supabase Test Results:');
    console.log('✅ Connection successful');
    console.log('✅ Database access confirmed');
    console.log('✅ Table exists and accessible');
    console.log('✅ Insert operations working');
    console.log('✅ Query operations working');
    console.log('✅ Delete operations working');
    console.log('\n🚀 Supabase is ready for n8n workflow!');
    
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('\n💡 API Key Error Solutions:');
      console.log('1. Check if service role key is correct');
      console.log('2. Verify Supabase project URL');
      console.log('3. Ensure service role key has proper permissions');
    } else if (error.message.includes('relation') || error.message.includes('table')) {
      console.log('\n💡 Table Error Solutions:');
      console.log('1. Run the SQL script to create tables');
      console.log('2. Check table name spelling');
      console.log('3. Verify table permissions');
    }
  }
}

// Run the test
testSupabaseConnection().catch(console.error);

// MongoDB connection test for n8n workflow
const { MongoClient } = require('mongodb');

// MongoDB connection string from your .env
const MONGODB_URI = "mongodb+srv://nasirhuzaifa95:1234@cluster0.okbji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function testMongoDBConnection() {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  let client;
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Test database access
    const db = client.db('resume_analyzer');
    console.log('✅ Connected to database: resume_analyzer');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} existing collections:`);
    collections.forEach(col => {
      console.log(`   - ${col.name}`);
    });
    
    // Test inserting sample data to resume_extractions
    console.log('\n📝 Testing resume_extractions collection...');
    const extractionsCollection = db.collection('resume_extractions');
    
    const sampleExtraction = {
      analysisId: "test_analysis_" + Date.now(),
      userId: "test_user",
      extractedAt: new Date().toISOString(),
      resumeText: "Sample extracted resume text for testing",
      jobDescription: "Sample job description for testing",
      jobTitle: "Test Engineer",
      company: "Test Company",
      fileInfo: {
        fileName: "test_resume.pdf",
        mimeType: "application/pdf"
      }
    };
    
    const extractionResult = await extractionsCollection.insertOne(sampleExtraction);
    console.log(`✅ Inserted test document with ID: ${extractionResult.insertedId}`);
    
    // Test inserting sample data to resume_analyses
    console.log('\n📊 Testing resume_analyses collection...');
    const analysesCollection = db.collection('resume_analyses');
    
    const sampleAnalysis = {
      analysisId: sampleExtraction.analysisId,
      userId: "test_user",
      jobTitle: "Test Engineer",
      company: "Test Company",
      analysisDate: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      jobDescription: "Sample job description for testing",
      resumeText: "Sample extracted resume text for testing",
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
    
    const analysisResult = await analysesCollection.insertOne(sampleAnalysis);
    console.log(`✅ Inserted test analysis with ID: ${analysisResult.insertedId}`);
    
    // Test reading the data back
    console.log('\n🔍 Verifying data retrieval...');
    const retrievedExtraction = await extractionsCollection.findOne({ analysisId: sampleExtraction.analysisId });
    const retrievedAnalysis = await analysesCollection.findOne({ analysisId: sampleExtraction.analysisId });
    
    if (retrievedExtraction && retrievedAnalysis) {
      console.log('✅ Successfully retrieved test documents');
      console.log(`   Extraction: ${retrievedExtraction.resumeText.substring(0, 50)}...`);
      console.log(`   Analysis Score: ${retrievedAnalysis.results.overallScore.matchPercentage}%`);
    }
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await extractionsCollection.deleteOne({ analysisId: sampleExtraction.analysisId });
    await analysesCollection.deleteOne({ analysisId: sampleExtraction.analysisId });
    console.log('✅ Test data cleaned up');
    
    // Get collection stats
    console.log('\n📈 Collection Statistics:');
    const extractionStats = await extractionsCollection.estimatedDocumentCount();
    const analysisStats = await analysesCollection.estimatedDocumentCount();
    console.log(`   resume_extractions: ${extractionStats} documents`);
    console.log(`   resume_analyses: ${analysisStats} documents`);
    
    console.log('\n🎯 MongoDB Test Results:');
    console.log('✅ Connection successful');
    console.log('✅ Database access confirmed');
    console.log('✅ Collections can be created/accessed');
    console.log('✅ Insert operations working');
    console.log('✅ Query operations working');
    console.log('✅ Delete operations working');
    console.log('\n🚀 MongoDB is ready for n8n workflow!');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Authentication Error Solutions:');
      console.log('1. Check if username/password are correct');
      console.log('2. Ensure user has proper permissions');
      console.log('3. Verify network access to MongoDB Atlas');
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      console.log('\n💡 Network Error Solutions:');
      console.log('1. Check internet connection');
      console.log('2. Verify MongoDB Atlas cluster is running');
      console.log('3. Check firewall settings');
    }
  } finally {
    // Close connection
    if (client) {
      await client.close();
      console.log('\n🔒 MongoDB connection closed');
    }
  }
}

// Run the test
testMongoDBConnection().catch(console.error);

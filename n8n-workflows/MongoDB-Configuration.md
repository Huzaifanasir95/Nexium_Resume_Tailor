# MongoDB Configuration for n8n Resume Tailor

## MongoDB Connection Setup

### 1. Connection String
Use your existing MongoDB Atlas connection string:
```
mongodb+srv://nasirhuzaifa95:1234@cluster0.okbji.mongodb.net
```

### 2. Database Name
```
resume_tailor
```

### 3. Collection Name
```
resume_analyses
```

### 4. n8n Credential Setup
1. In n8n, go to Settings > Credentials
2. Click "Add Credential" 
3. Select "MongoDB"
4. Name it: `MongoDB Resume Tailor`
5. Enter the connection details:
   - **Connection String**: `mongodb+srv://nasirhuzaifa95:1234@cluster0.okbji.mongodb.net`
   - **Database Name**: `resume_tailor`

### 5. Document Structure
The workflow will store documents with this structure:
```json
{
  "_id": "ObjectId (auto-generated)",
  "analysisId": "user123_1234567890",
  "userId": "user123", 
  "jobTitle": "Software Engineer",
  "company": "Tech Company",
  "jobDescription": "Full job description text...",
  "analysisText": "Complete LLM analysis text...",
  "analysisDate": "2024-01-15 10:30:45",
  "completedAt": "2024-01-15 10:30:45", 
  "createdAt": "2024-01-15 10:30:45",
  "updatedAt": "2024-01-15 10:30:45"
}
```

### 6. Workflow Flow
1. **Webhook** → Receives resume upload
2. **Process Input** → Prepares data for LLM
3. **Basic LLM Chain** → AI analysis (text output)
4. **MongoDB** → Stores analysis in database
5. **Respond to Webhook** → Returns success confirmation

### 7. Frontend Response
The frontend will now receive:
```json
{
  "success": true,
  "message": "Resume analysis completed and stored successfully",
  "analysisId": "65a1b2c3d4e5f6789012345",
  "timestamp": "2024-01-15 10:30:45"
}
```

### 8. Benefits of This Approach
- ✅ All analysis data stored in MongoDB
- ✅ Simple text-based LLM output (no JSON parsing issues)
- ✅ Unique analysis IDs for tracking
- ✅ Complete audit trail with timestamps
- ✅ Can retrieve analysis later using analysisId

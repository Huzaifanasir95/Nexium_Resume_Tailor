# Resume Tailor - n8n Workflow Setup Guide

## Overview
This guide will walk you through creating a complete n8n workflow for the Resume Tailor application. The workflow processes resume files and job descriptions using Google Gemini AI to provide detailed analysis and recommendations.

## Prerequisites
- n8n instance (cloud or self-hosted)
- Google Gemini API key
- MongoDB database
- Basic understanding of n8n workflow creation

## Workflow Architecture
The workflow consists of 5 main nodes in this simplified flow:
1. **Webhook** - Receive resume file and job description
2. **Gemini Extract Content** - Extract text from resume using Gemini AI
3. **Store Extracted Content** - Save extracted resume text to MongoDB
4. **Gemini Analysis** - Analyze job description + extracted resume content together
5. **Store Final Results** - Save complete analysis to MongoDB and respond

---

## Node-by-Node Setup Instructions

### 1. Webhook Trigger Node

**Node Type:** `Webhook`
**Position:** Start of workflow

#### Configuration:
- **HTTP Method:** `POST`
- **Path:** `resume-analysis`
- **Authentication:** `None` (handle in your frontend)
- **Response Mode:** `Respond to Webhook`
- **Response Code:** `200`

#### Expected Input Format:
```json
{
  "userId": "user123",
  "jobTitle": "Software Engineer",
  "company": "Tech Corp",
  "jobDescription": "Full job posting text...",
  "resumeFile": {
    "name": "resume.pdf",
    "mimeType": "application/pdf",
    "data": "base64_encoded_file_content"
  }
}
```

#### Notes:
- This webhook will receive data from your Next.js application
- The resume file should be base64 encoded in the request
- Job description should be the complete job posting text

---

### 2. Gemini Text Extraction Node

**Node Type:** `HTTP Request`
**Position:** After Webhook

#### Purpose:
Extract text content from PDF/DOCX files using Google Gemini

#### Configuration:
- **Method:** `POST`
- **URL:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Authentication:** `Generic Credential Type`
  - **Credential Type:** `API Key`
  - **API Key:** `YOUR_GEMINI_API_KEY`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```

#### Request Body:
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Extract all text content from this document. Return only the raw text without any formatting, headers, or metadata. Focus on preserving the actual content that would be visible when reading the document."
        },
        {
          "inline_data": {
            "mime_type": "{{ $json.resumeFile.mimeType }}",
            "data": "{{ $json.resumeFile.data }}"
          }
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.1,
    "topK": 1,
    "topP": 1,
    "maxOutputTokens": 4096
  }
}
```

#### Post-Processing (Add Code Node after HTTP Request):
```javascript
const response = $input.first().json;
const extractedText = response.candidates[0].content.parts[0].text;

// Clean up the extracted text
const cleanText = extractedText
  .replace(/\n\s*\n/g, '\n')  // Remove excessive line breaks
  .replace(/\s+/g, ' ')        // Normalize spaces
  .trim();

// Generate analysis ID for tracking
const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

return {
  userId: $input.all()[0].json.userId,
  jobTitle: $input.all()[0].json.jobTitle || 'Not specified',
  company: $input.all()[0].json.company || 'Not specified',
  jobDescription: $input.all()[0].json.jobDescription,
  resumeFile: $input.all()[0].json.resumeFile,
  resumeText: cleanText,
  analysisId: analysisId,
  timestamp: new Date().toISOString()
};
```

---

### 3. Store Extracted Content in MongoDB

**Node Type:** `MongoDB`
**Position:** After Gemini Text Extraction

#### Purpose:
Store the extracted resume text in MongoDB for tracking

#### Configuration:
- **Operation:** `Insert Documents`
- **Collection:** `resume_extractions`
- **Connection String:** Your MongoDB URI from .env file

#### Document Structure:
```json
{
  "analysisId": "{{ $json.analysisId }}",
  "userId": "{{ $json.userId }}",
  "extractedAt": "{{ $json.timestamp }}",
  "resumeText": "{{ $json.resumeText }}",
  "jobDescription": "{{ $json.jobDescription }}",
  "jobTitle": "{{ $json.jobTitle }}",
  "company": "{{ $json.company }}",
  "fileInfo": {
    "fileName": "{{ $json.resumeFile.name }}",
    "mimeType": "{{ $json.resumeFile.mimeType }}"
  }
}
```

---

### 4. Gemini Complete Analysis Node

**Node Type:** `HTTP Request`
**Position:** After MongoDB Storage

#### Purpose:
Analyze job description and extracted resume content together for comprehensive results

#### Configuration:
- **Method:** `POST`
- **URL:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Authentication:** Use same Gemini API key
- **Headers:** Same as previous

#### Request Body:
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Analyze this resume against the job description and provide a comprehensive analysis in JSON format.\n\nRESUME CONTENT:\n{{ $json.resumeText }}\n\nJOB DESCRIPTION:\n{{ $json.jobDescription }}\n\nJOB TITLE: {{ $json.jobTitle }}\nCOMPANY: {{ $json.company }}\n\nProvide a detailed analysis in this exact JSON structure:\n{\n  \"overallScore\": {\n    \"matchPercentage\": \"75\",\n    \"strengths\": [\"strength1\", \"strength2\", \"strength3\"],\n    \"improvementAreas\": [\"area1\", \"area2\", \"area3\"]\n  },\n  \"keywordAnalysis\": {\n    \"missingKeywords\": [\"keyword1\", \"keyword2\"],\n    \"matchingKeywords\": [\"keyword3\", \"keyword4\"],\n    \"keywordScore\": \"65\"\n  },\n  \"skillsGapAnalysis\": {\n    \"missingSkills\": [\"skill1\", \"skill2\"],\n    \"matchingSkills\": [\"skill3\", \"skill4\"],\n    \"recommendedSkills\": [\"skill5\", \"skill6\"]\n  },\n  \"contentSuggestions\": {\n    \"summaryRewrite\": \"Improved professional summary text that aligns with the job requirements...\",\n    \"experienceBullets\": [\"Enhanced bullet point 1\", \"Enhanced bullet point 2\"],\n    \"achievementHighlights\": [\"Achievement 1\", \"Achievement 2\"]\n  },\n  \"atsOptimization\": {\n    \"formatSuggestions\": [\"suggestion1\", \"suggestion2\"],\n    \"keywordPlacement\": [\"placement1\", \"placement2\"],\n    \"sectionOptimization\": [\"optimization1\", \"optimization2\"]\n  },\n  \"jobRequirements\": {\n    \"requiredSkills\": [\"skill1\", \"skill2\"],\n    \"preferredQualifications\": [\"qual1\", \"qual2\"],\n    \"experienceLevel\": \"Junior/Mid/Senior\",\n    \"educationRequirements\": [\"req1\", \"req2\"]\n  }\n}"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.3,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 4096
  }
}
```

#### Post-Processing Code:
```javascript
const response = $input.first().json;
const analysisText = response.candidates[0].content.parts[0].text;

// Parse the analysis results
let analysisResults;
try {
  // Extract JSON from the response (remove any markdown formatting)
  const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    analysisResults = JSON.parse(jsonMatch[0]);
  } else {
    throw new Error('No valid JSON found in analysis response');
  }
} catch (error) {
  console.error('Failed to parse analysis results:', error);
  // Provide fallback analysis structure
  analysisResults = {
    overallScore: {
      matchPercentage: "0",
      strengths: ["Analysis failed - please try again"],
      improvementAreas: ["Unable to process resume content"]
    },
    keywordAnalysis: {
      missingKeywords: [],
      matchingKeywords: [],
      keywordScore: "0"
    },
    skillsGapAnalysis: {
      missingSkills: [],
      matchingSkills: [],
      recommendedSkills: []
    },
    contentSuggestions: {
      summaryRewrite: "Analysis failed - please resubmit your resume",
      experienceBullets: [],
      achievementHighlights: []
    },
    atsOptimization: {
      formatSuggestions: [],
      keywordPlacement: [],
      sectionOptimization: []
    },
    jobRequirements: {
      requiredSkills: [],
      preferredQualifications: [],
      experienceLevel: "Not specified",
      educationRequirements: []
    }
  };
}

return {
  ...input.all()[0].json,
  analysisResults: analysisResults,
  completedAt: new Date().toISOString()
};
```

---

### 5. Store Final Results and Respond

**Node Type:** `MongoDB`
**Position:** After Gemini Analysis

#### Purpose:
Store the complete analysis results in MongoDB and prepare response

#### Configuration:
- **Operation:** `Insert Documents`
- **Collection:** `resume_analyses`
- **Connection String:** Your MongoDB URI from .env file

#### Document Structure:
```json
{
  "analysisId": "{{ $json.analysisId }}",
  "userId": "{{ $json.userId }}",
  "jobTitle": "{{ $json.jobTitle }}",
  "company": "{{ $json.company }}",
  "analysisDate": "{{ $json.timestamp }}",
  "completedAt": "{{ $json.completedAt }}",
  "jobDescription": "{{ $json.jobDescription }}",
  "resumeText": "{{ $json.resumeText }}",
  "results": "{{ $json.analysisResults }}",
  "metadata": {
    "fileInfo": {
      "fileName": "{{ $json.resumeFile.name }}",
      "mimeType": "{{ $json.resumeFile.mimeType }}"
    }
  }
}
```

#### Add Success Response Node After MongoDB:

**Node Type:** `Respond to Webhook`
**Position:** After MongoDB Storage

#### Configuration:
- **Response Code:** `200`
- **Response Headers:**
  ```json
  {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
  ```

#### Response Body:
```json
{
  "success": true,
  "message": "Resume analysis completed successfully",
  "data": {
    "analysisId": "{{ $json.analysisId }}",
    "userId": "{{ $json.userId }}",
    "analysisDate": "{{ $json.timestamp }}",
    "results": "{{ $json.analysisResults }}"
  }
}
```

---

### 6. Error Handling Nodes

#### Error Catch Node
**Node Type:** `Error Trigger`
**Position:** Connected to all nodes that might fail

#### Error Response Node
**Node Type:** `Respond to Webhook`
**Position:** After Error Catch

#### Configuration:
- **Response Code:** `500`
- **Response Body:**
```json
{
  "success": false,
  "message": "{{ $json.error.message }}",
  "error": "Analysis failed - please check your input and try again",
  "analysisId": "{{ $json.analysisId || 'unknown' }}"
}
```

---

## Simplified Workflow Connections

Connect the nodes in this exact order:
1. **Webhook** → **Gemini Extract Content**
2. **Gemini Extract Content** → **Store Extracted Content**
3. **Store Extracted Content** → **Gemini Complete Analysis**
4. **Gemini Complete Analysis** → **Store Final Results**
5. **Store Final Results** → **Success Response**
6. **All Nodes** → **Error Catch** (for error handling)
7. **Error Catch** → **Error Response**

---

## Environment Variables Setup

In your n8n environment, set these variables:

```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
```

---

## Testing the Workflow

### Test Data Format:
```json
{
  "userId": "test_user_123",
  "jobTitle": "Software Engineer",
  "company": "Tech Corp",
  "jobDescription": "We are looking for a skilled Software Engineer with experience in React, Node.js, and MongoDB. The ideal candidate should have 3+ years of experience in full-stack development...",
  "resumeFile": {
    "name": "test_resume.pdf",
    "mimeType": "application/pdf",
    "data": "JVBERi0xLjQKJcOkw7zDtsO..."
  }
}
```

### Expected Response:
```json
{
  "success": true,
  "message": "Resume analysis completed successfully",
  "data": {
    "analysisId": "analysis_1642567890123_abc123def",
    "userId": "test_user_123",
    "analysisDate": "2025-01-19T12:30:45.123Z",
    "results": {
      "overallScore": {
        "matchPercentage": "75",
        "strengths": ["Strong technical skills", "Relevant experience"],
        "improvementAreas": ["Add more keywords", "Quantify achievements"]
      }
      // ... rest of analysis results
    }
  }
}
```

---

## Integration with Next.js Frontend

To integrate with your frontend, update the API endpoint in `ResumeAnalyzer.tsx`:

```typescript
// Change from demo endpoint:
const response = await fetch('/api/demo-analyze', {

// To your n8n webhook:
const response = await fetch('https://your-n8n-instance.com/webhook/resume-analysis', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: userId,
    jobTitle: jobTitle,
    company: company,
    jobDescription: jobDescription,
    resumeFile: {
      name: file.name,
      mimeType: file.type,
      data: base64FileData
    }
  })
});
```

---

## Monitoring and Troubleshooting

### Common Issues:
1. **File Size Errors**: Ensure files are under 10MB
2. **API Rate Limits**: Implement proper error handling for Gemini API limits
3. **JSON Parsing Errors**: Add robust error handling for AI responses
4. **MongoDB Connection**: Verify connection string and network access

### Monitoring Points:
- Webhook response times
- Gemini API usage and costs
- MongoDB storage usage
- Error rates and types

### Logs to Monitor:
- Failed file extractions
- Invalid JSON responses from Gemini
- MongoDB write failures
- Authentication errors

---

## Security Considerations

1. **API Key Security**: Store Gemini API key securely in n8n credentials
2. **File Validation**: Always validate file types and sizes
3. **Rate Limiting**: Implement rate limiting on webhook endpoint
4. **Data Privacy**: Consider data retention policies for stored analyses
5. **Access Control**: Restrict n8n workflow access appropriately

---

## Performance Optimization

1. **Caching**: Consider caching job analysis results for similar job descriptions
2. **Batch Processing**: For high volume, implement queuing system
3. **Response Time**: Monitor and optimize each node's execution time
4. **Resource Usage**: Monitor memory usage for large file processing

---

## Deployment Checklist

- [ ] n8n instance is running and accessible
- [ ] Gemini API key is configured in n8n credentials
- [ ] MongoDB connection is tested and working
- [ ] Webhook endpoint is publicly accessible
- [ ] Error handling is properly implemented
- [ ] All nodes are connected correctly
- [ ] Test workflow with sample data
- [ ] Frontend is updated with correct webhook URL
- [ ] Monitoring and logging are configured

---

This comprehensive setup will give you a fully functional Resume Tailor workflow that can process resumes, analyze them against job descriptions, and provide detailed feedback to help users optimize their applications.

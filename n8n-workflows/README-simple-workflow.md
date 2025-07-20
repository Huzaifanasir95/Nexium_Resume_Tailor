# Resume Analysis Simple Workflow Setup Guide

## Overview
This is a simplified 3-node n8n workflow that processes resume content and returns text-based analysis instead of complex JSON parsing.

## Workflow Architecture
1. **Webhook Node** - Receives POST requests at `/webhook/resume-analysis-simple`
2. **Basic LLM Chain** - Processes resume content with AI analysis
3. **Respond to Webhook** - Returns structured text response

## Setup Instructions

### 1. Import the Workflow
1. Open n8n in your browser (http://localhost:5678)
2. Click "Import from file" 
3. Select `resume-analysis-simple-workflow.json`
4. The workflow will be imported with 3 pre-configured nodes

### 2. Configure the LLM Node
1. Click on the "Basic LLM Chain" node
2. Set your OpenAI API key in the credentials
3. Verify the model is set to "gpt-3.5-turbo"
4. Temperature should be 0.7 for balanced creativity
5. Max tokens set to 2000 for comprehensive analysis

### 3. Test the Workflow
1. Click "Test workflow" button
2. The webhook should be active at: `http://localhost:5678/webhook/resume-analysis-simple`

## Input Format
The workflow expects a POST request with this JSON structure:
```json
{
  "userId": "user123",
  "jobTitle": "Software Engineer", 
  "company": "Tech Company",
  "jobDescription": "Job requirements and description...",
  "resumeText": "Resume content extracted from uploaded file..."
}
```

## Output Format
The workflow returns a simple JSON response:
```json
{
  "success": true,
  "analysis": "Formatted text analysis from LLM...",
  "userId": "user123",
  "jobTitle": "Software Engineer",
  "company": "Tech Company", 
  "timestamp": "2024-01-15 10:30:45"
}
```

## Key Benefits
- ✅ No complex field mapping
- ✅ No JSON parsing issues  
- ✅ Simple text-based output
- ✅ Frontend handles parsing
- ✅ Reliable and maintainable

## Frontend Integration
The ResumeAnalyzer component has been updated to:
- Send requests to `/webhook/resume-analysis-simple`
- Handle the new response format
- Extract analysis text for display
- Parse text structure in frontend instead of n8n

## Troubleshooting
- Ensure OpenAI API key is configured
- Verify webhook is active and receiving requests
- Check n8n logs for any execution errors
- Test with sample data first before frontend integration

## Migration from Previous Workflow
This workflow replaces the complex MongoDB/Supabase JSON parsing approach with a simple text-based system that's much more reliable and easier to maintain.

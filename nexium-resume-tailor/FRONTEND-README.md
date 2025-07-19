# Resume Tailor - Frontend Setup

## Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd nexium-resume-tailor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Go to [http://localhost:3000](http://localhost:3000) to see the application.

## Features

### Current Implementation
- ✅ **File Upload Interface**: Drag & drop or browse for PDF/DOCX files
- ✅ **Job Description Input**: Large text area for job posting
- ✅ **Demo Analysis**: Mock AI analysis with realistic results
- ✅ **Results Display**: Comprehensive analysis results visualization
- ✅ **Responsive Design**: Works on desktop and mobile devices

### Demo Mode
The application currently runs in demo mode with mock data. When you upload a resume and job description:
- Files are validated (PDF/DOCX, max 10MB)
- A 3-second processing simulation occurs
- Mock analysis results are displayed including:
  - Overall match score
  - Keyword analysis
  - Skills gap identification
  - Content suggestions
  - ATS optimization tips

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main application page
│   ├── globals.css           # Global styles
│   └── api/
│       └── demo-analyze/     # Demo analysis endpoint
│           └── route.ts
├── components/
│   ├── ResumeAnalyzer.tsx    # File upload and form component
│   └── AnalysisResults.tsx   # Results display component
└── utils/
    └── db.ts                 # Database utilities (for future use)
```

## Switching to Production Mode

To connect to the actual n8n workflow:

1. **Update the API endpoint** in `src/components/ResumeAnalyzer.tsx`:
   ```typescript
   // Change this line:
   const response = await fetch('/api/demo-analyze', {
   
   // To this:
   const response = await fetch('/api/analyze-resume', {
   ```

2. **Set up environment variables** (copy from `.env.example`):
   ```bash
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
   MONGODB_URI=your-mongodb-connection-string
   # ... other variables
   ```

3. **Configure n8n workflow** using the provided workflow JSON file

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **File Processing**: Native browser File API
- **State Management**: React useState hooks

## Demo Features Included

The demo analysis includes:
- **Match Score**: Percentage match with improvement areas
- **Keyword Analysis**: Missing and matching keywords
- **Skills Gap**: Skills comparison and recommendations
- **Content Suggestions**: Enhanced resume content
- **ATS Optimization**: Formatting and structure tips

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## File Upload Limits

- **Supported formats**: PDF, DOCX
- **Maximum file size**: 10MB
- **Processing time**: ~3 seconds (demo mode)

## Next Steps

1. **Test the demo interface** with sample resumes
2. **Set up n8n workflow** using provided configuration
3. **Configure environment variables** for production
4. **Switch to production API endpoint**
5. **Deploy to Vercel or your preferred platform**

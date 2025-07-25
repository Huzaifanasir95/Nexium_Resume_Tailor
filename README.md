# 🎯 Nexium Resume Tailor

**AI-Powered Resume Optimization Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Authentication-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![n8n](https://img.shields.io/badge/n8n-Workflow-red?style=for-the-badge&logo=n8n)](https://n8n.io/)

---

## 📖 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [🛠️ Development](#-development)
- [📊 Analytics](#-analytics)
- [🚀 Deployment](#-deployment)
- [🔍 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

Resume Tailor is an intelligent web application that helps job seekers optimize their resumes for specific job applications using AI-powered analysis. The platform analyzes job descriptions, extracts relevant keywords, identifies skills gaps, and provides tailored suggestions to improve ATS (Applicant Tracking System) compatibility.

### 🎯 Problem We Solve

- **Time-consuming manual resume customization** for each job application
- **Poor ATS keyword matching** leading to automatic rejections
- **Inconsistent formatting** across different applications
- **Lack of data-driven insights** on resume effectiveness

### 💡 Our Solution

An intelligent platform that provides:
- **AI-powered job description analysis**
- **Automated keyword optimization**
- **ATS compatibility scoring**
- **Real-time improvement suggestions**
- **Version control for multiple resume variants**

---

## ✨ Features

### 🔐 Authentication & User Management
- **Magic Link Authentication** via Supabase
- **Secure session management**
- **User profile customization**
- **Password-less login experience**

### 📄 Resume Management
- **Multi-format support** (PDF, DOCX)
- **Resume version control**
- **Template selection**
- **Bulk export capabilities**

### 🤖 AI-Powered Analysis
- **Job description parsing**
- **Keyword extraction and matching**
- **Skills gap identification**
- **Content optimization suggestions**
- **ATS scoring and recommendations**

### 📊 Analytics & Insights
- **Application success tracking**
- **Resume performance metrics**
- **Keyword effectiveness analysis**
- **Industry-specific insights**

### 🔗 Integration Capabilities
- **n8n workflow automation**
- **Google Gemini AI integration**
- **RESTful API architecture**
- **Webhook support**

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Next.js Frontend] --> B[API Routes]
    B --> C[Supabase Auth]
    B --> D[MongoDB Database]
    B --> E[n8n Workflows]
    E --> F[Google Gemini AI]
    E --> G[Document Parser]
    
    H[User] --> A
    A --> I[Vercel Deployment]
    
    subgraph "Backend Services"
        C
        D
        E
        F
        G
    end
```

### 🧩 Technology Stack

| **Category** | **Technology** | **Purpose** |
|-------------|---------------|-------------|
| **Frontend** | Next.js 15.4.1, React 19.1, TypeScript | Modern web application |
| **Styling** | Tailwind CSS | Responsive design system |
| **Authentication** | Supabase Auth | Secure user management |
| **Database** | MongoDB, Supabase | Data storage and file handling |
| **AI/ML** | Google Gemini API | Content analysis and generation |
| **Automation** | n8n | Workflow orchestration |
| **Deployment** | Vercel | Serverless hosting |
| **CI/CD** | GitHub Actions | Automated deployments |

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **n8n instance** (local or cloud)
- **MongoDB database**
- **Supabase project**
- **Google Gemini API key**

### ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Huzaifanasir95/Nexium_Resume_Tailor.git
   cd Nexium_Resume_Tailor
   ```

2. **Navigate to the application directory**
   ```bash
   cd nexium-resume-tailor
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # MongoDB
   MONGODB_URI=mongodb+srv://your-connection-string
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   
   # n8n Integration
   N8N_WEBHOOK_URL=http://localhost:5678/webhook
   
   # AI Integration
   GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔧 n8n Workflow Setup

1. **Import the workflow**
   ```bash
   # Import the workflow JSON file located in n8n-workflows/
   ```

2. **Configure webhooks**
   - Set webhook URL in n8n: `http://localhost:5678/webhook/resume-analysis`
   - Enable webhook in workflow

3. **Configure AI integration**
   - Add Google Gemini API key to n8n credentials
   - Test the workflow connection

---

## 📁 Project Structure

```
Nexium_Resume_Tailor/
│
├── 📁 .github/                     # GitHub Actions workflows
│   └── workflows/
│       ├── ci-cd-pipeline.yml      # Main CI/CD pipeline
│       ├── manual-deploy.yml       # Manual deployment
│       ├── deploy-vercel.yml       # Vercel deployment
│       ├── preview-deploy.yml      # Preview deployments
│       └── security-scan.yml       # Security scanning
│
├── 📁 docs/                        # Project documentation
│   ├── PRD.md                      # Product Requirements Document
│   └── wireframes.md               # UI/UX wireframes
│
├── 📁 n8n-workflows/               # n8n automation workflows
│   ├── resume-tailor-workflow.json # Main workflow definition
│   ├── setup-guide.md              # n8n setup instructions
│   ├── workflow-documentation.md   # Workflow documentation
│   └── MongoDB-Configuration.md    # Database setup guide
│
├── 📁 nexium-resume-tailor/        # Main Next.js application
│   ├── 📁 public/                  # Static assets
│   │   ├── favicon.svg
│   │   ├── pdf.worker.min.js       # PDF processing worker
│   │   └── ...
│   │
│   ├── 📁 scripts/                 # Utility scripts
│   │   ├── test-connections.js     # Database connection tests
│   │   ├── test-mongodb.js         # MongoDB connection test
│   │   ├── test-supabase.js        # Supabase connection test
│   │   ├── test-n8n-workflow.js    # n8n workflow test
│   │   └── validate-workflow.js    # Workflow validation
│   │
│   ├── 📁 src/
│   │   ├── 📁 app/                 # Next.js app router
│   │   │   ├── 📁 api/             # API routes
│   │   │   │   ├── analyze-resume/ # Resume analysis endpoint
│   │   │   │   ├── demo-analyze/   # Demo analysis endpoint
│   │   │   │   ├── get-analysis/   # Get analysis results
│   │   │   │   ├── resume-analysis/ # Main analysis route
│   │   │   │   ├── test-connection/ # Connection testing
│   │   │   │   └── upload-resume/  # Resume upload handler
│   │   │   │
│   │   │   ├── 📁 analysis/        # Analysis results page
│   │   │   ├── 📁 auth/            # Authentication routes
│   │   │   │   └── callback/       # Auth callback handler
│   │   │   ├── layout.tsx          # Root layout component
│   │   │   ├── page.tsx            # Home page
│   │   │   └── globals.css         # Global styles
│   │   │
│   │   ├── 📁 components/          # React components
│   │   │   ├── AnalysisResults.tsx    # Analysis display component
│   │   │   ├── AuthProvider.tsx       # Authentication context
│   │   │   ├── CleanAnalysisDisplay.tsx # Clean analysis view
│   │   │   ├── EnhancedAnalysisDisplay.tsx # Enhanced analysis view
│   │   │   ├── LoginForm.tsx          # Login form component
│   │   │   ├── ResumeAnalyzer.tsx     # Main analysis component
│   │   │   ├── SimpleAnalysisDisplay.tsx # Simple analysis view
│   │   │   ├── SimpleAnalysisResults.tsx # Basic results display
│   │   │   └── UserProfile.tsx        # User profile component
│   │   │
│   │   ├── 📁 lib/                 # Utility libraries
│   │   │   └── supabase.ts         # Supabase client configuration
│   │   │
│   │   └── 📁 utils/               # Utility functions
│   │       ├── db.ts               # Database utilities
│   │       └── fileParser.ts       # File parsing utilities
│   │
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   ├── .gitignore                  # Git ignore rules
│   ├── next.config.ts              # Next.js configuration
│   ├── package.json                # Dependencies and scripts
│   ├── postcss.config.mjs          # PostCSS configuration
│   ├── tailwind.config.ts          # Tailwind CSS configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── FRONTEND-README.md          # Frontend-specific documentation
│   └── README.md                   # Frontend setup guide
│
├── N8N_WORKFLOW_SETUP.md           # n8n setup instructions
├── WORKFLOW_TEST_REPORT.md         # Testing documentation
├── package.json                    # Root package.json
└── README.md                       # This file
```

---

## 🔧 Configuration

### 🌍 Environment Variables

| **Variable** | **Description** | **Required** | **Example** |
|-------------|----------------|-------------|-------------|
| `MONGODB_URI` | MongoDB connection string | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `N8N_WEBHOOK_URL` | n8n webhook endpoint | ✅ | `http://localhost:5678/webhook` |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ | `AIzaSyB...` |
| `NEXT_PUBLIC_SITE_URL` | Application base URL | ✅ | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth secret key | ✅ | `your-secret-key` |

### 🔐 Supabase Setup

1. **Create a Supabase project**
2. **Configure authentication**
   - Enable email authentication
   - Set site URL: `http://localhost:3000` (development)
   - Add redirect URLs: `http://localhost:3000/auth/callback`
3. **Set up storage buckets** for resume files
4. **Configure RLS policies** for data security

### 🗄️ MongoDB Setup

1. **Create MongoDB Atlas cluster**
2. **Set up database collections**:
   - `users` - User profiles
   - `resumes` - Resume documents
   - `analyses` - Analysis results
   - `jobs` - Job descriptions
3. **Configure connection string**
4. **Set up indexes** for performance

---

## 🛠️ Development

### 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm run test:connections    # Test all service connections
npm run test:mongodb       # Test MongoDB connection
npm run test:supabase      # Test Supabase connection
npm run test:n8n          # Test n8n workflow
npm run validate:workflow  # Validate n8n workflow configuration
```

### 🏗️ Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature-name
   # Make your changes
   npm run lint
   npm run build
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

2. **Testing**
   ```bash
   npm run test:connections  # Verify all services
   npm run validate:workflow # Check n8n configuration
   ```

3. **Code Quality**
   - TypeScript strict mode enabled
   - ESLint for code linting
   - Prettier for code formatting
   - Pre-commit hooks for quality checks

### 🔍 Debugging

1. **Check service connections**
   ```bash
   npm run test:connections
   ```

2. **Monitor n8n workflows**
   - Access n8n UI: `http://localhost:5678`
   - Check execution logs
   - Verify webhook endpoints

3. **Database debugging**
   ```bash
   npm run test:mongodb    # Test MongoDB connection
   npm run test:supabase   # Test Supabase connection
   ```

---

## 📊 Analytics

### 📈 Performance Metrics

- **Resume analysis completion rate**
- **Average processing time**
- **User engagement metrics**
- **API response times**
- **Error rates and patterns**

### 📋 Data Collection

- **User interactions** (anonymized)
- **Feature usage patterns**
- **Performance benchmarks**
- **Error tracking and reporting**

---

## 🚀 Deployment

### ☁️ Vercel Deployment (Recommended)

1. **Connect GitHub repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Set build settings**:
   - Build Command: `npm run build`
   - Root Directory: `nexium-resume-tailor`
4. **Deploy** automatically on push to main branch

### 🔧 Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### 🔄 CI/CD Pipeline

The project includes automated GitHub Actions workflows:

- **CI/CD Pipeline** (`ci-cd-pipeline.yml`)
  - Runs tests and linting
  - Builds the application
  - Deploys to Vercel on successful tests

- **Manual Deploy** (`manual-deploy.yml`)
  - Manual deployment trigger
  - Useful for hotfixes

- **Preview Deploy** (`preview-deploy.yml`)
  - Preview deployments for pull requests
  - Testing environment setup

- **Security Scan** (`security-scan.yml`)
  - Dependency vulnerability scanning
  - Code security analysis

---

## 🔍 API Documentation

### 📡 Endpoints

| **Endpoint** | **Method** | **Description** | **Auth Required** |
|-------------|-----------|----------------|------------------|
| `/api/analyze-resume` | POST | Analyze resume against job description | ✅ |
| `/api/demo-analyze` | POST | Demo analysis (no auth required) | ❌ |
| `/api/resume-analysis` | POST | Full resume analysis workflow | ✅ |
| `/api/get-analysis` | GET | Retrieve analysis results | ✅ |
| `/api/upload-resume` | POST | Upload resume file | ✅ |
| `/api/test-connection` | GET | Test service connections | ❌ |

### 📝 Request/Response Examples

#### Analyze Resume
```http
POST /api/analyze-resume
Content-Type: multipart/form-data

{
  "file": <resume-file>,
  "jobDescription": "Software Engineer position...",
  "jobTitle": "Software Engineer",
  "company": "Tech Corp"
}
```

```json
{
  "success": true,
  "data": {
    "matchScore": 85,
    "keywordAnalysis": {
      "matched": ["JavaScript", "React", "Node.js"],
      "missing": ["Python", "AWS", "Docker"]
    },
    "suggestions": [
      "Add AWS experience to skills section",
      "Include Docker in technical skills"
    ]
  }
}
```

---

## 🤝 Contributing

### 🌟 How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run test:connections
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### 📋 Contribution Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all checks pass before submitting PR

### 🐛 Bug Reports

Please use the GitHub issue tracker to report bugs. Include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

### 💡 Feature Requests

We welcome feature requests! Please open an issue with:
- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Huzaifanasir95/Nexium_Resume_Tailor/issues)
- **Documentation**: Check the `/docs` folder for detailed guides
- **n8n Workflows**: See `/n8n-workflows` for automation setup

---

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Supabase** for authentication and storage
- **n8n community** for workflow automation
- **Google** for Gemini AI API
- **Vercel** for seamless deployment
- **MongoDB** for reliable data storage

---

**Built with ❤️ by the Nexium Team**

*Empowering job seekers with AI-driven resume optimization*

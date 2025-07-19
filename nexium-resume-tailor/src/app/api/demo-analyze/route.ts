import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const jobDescription = formData.get('jobDescription') as string
    const jobTitle = formData.get('jobTitle') as string
    const company = formData.get('company') as string

    // Validate required fields
    if (!userId || !file || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, file, jobDescription' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are supported.' },
        { status: 400 }
      )
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock analysis result
    const mockAnalysisResult = {
      success: true,
      message: 'Resume analysis completed successfully',
      data: {
        analysisId: `analysis_${Date.now()}`,
        userId: userId,
        analysisDate: new Date().toISOString(),
        results: {
          overallScore: {
            matchPercentage: "75%",
            improvementAreas: [
              "Add more relevant keywords from the job description",
              "Quantify achievements with specific metrics",
              "Include more technical skills mentioned in the job posting"
            ],
            strengths: [
              "Strong work experience in relevant field",
              "Good educational background",
              "Professional summary is well-written"
            ]
          },
          keywordAnalysis: {
            missingKeywords: [
              "React", "Node.js", "AWS", "Docker", "Kubernetes", "TypeScript", "GraphQL"
            ],
            matchingKeywords: [
              "JavaScript", "Python", "SQL", "Git", "Agile", "REST API"
            ],
            keywordScore: "65%"
          },
          skillsGapAnalysis: {
            missingSkills: [
              "Cloud computing (AWS/Azure)",
              "Container orchestration",
              "Frontend frameworks (React/Vue)",
              "DevOps practices"
            ],
            matchingSkills: [
              "Backend development",
              "Database management",
              "API development",
              "Version control"
            ],
            recommendedSkills: [
              "React.js for frontend development",
              "AWS for cloud infrastructure",
              "Docker for containerization",
              "Jest for testing"
            ]
          },
          contentSuggestions: {
            summaryRewrite: "Results-driven Software Engineer with 5+ years of experience developing scalable web applications using React, Node.js, and AWS. Proven track record of delivering high-quality software solutions that improve user experience and drive business growth. Expertise in full-stack development, cloud architecture, and agile methodologies.",
            experienceBullets: [
              "• Developed and maintained 15+ React-based web applications serving 100K+ users",
              "• Architected microservices using Node.js and Docker, reducing deployment time by 40%",
              "• Collaborated with cross-functional teams to deliver features 25% faster using Agile methodology",
              "• Implemented automated testing with Jest, increasing code coverage from 60% to 95%"
            ],
            achievementHighlights: [
              "Led migration to cloud infrastructure, reducing hosting costs by 30%",
              "Optimized database queries resulting in 50% faster page load times",
              "Mentored 3 junior developers, improving team productivity by 20%"
            ]
          },
          atsOptimization: {
            formatSuggestions: [
              "Use standard section headers (Experience, Education, Skills)",
              "Include keywords in context rather than in lists",
              "Use bullet points for achievements",
              "Keep formatting simple and ATS-friendly"
            ],
            keywordPlacement: [
              "Include 'React' in your experience descriptions",
              "Add 'AWS' to your technical skills section",
              "Mention 'Agile' in project management context",
              "Use 'Node.js' when describing backend work"
            ],
            sectionOptimization: [
              "Move technical skills section higher on resume",
              "Add a 'Projects' section highlighting relevant work",
              "Include certifications section if applicable",
              "Consider adding a 'Technical Expertise' summary"
            ]
          }
        }
      }
    }

    return NextResponse.json(mockAnalysisResult)

  } catch (error: any) {
    console.error('Demo analysis API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to analyze resumes.' },
    { status: 405 }
  )
}

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

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Determine file type
    const fileType = file.type.includes('pdf') ? 'pdf' : 'docx'

    // Convert file to base64 for n8n workflow
    const fileBuffer = await file.arrayBuffer()
    const fileBase64 = Buffer.from(fileBuffer).toString('base64')

    // Prepare payload for n8n workflow
    const workflowPayload = {
      userId,
      fileName: file.name,
      fileType,
      fileData: fileBase64,
      fileMimeType: file.type,
      fileSize: file.size,
      jobDescription,
      jobTitle: jobTitle || 'Unknown Position',
      company: company || 'Unknown Company',
      timestamp: new Date().toISOString()
    }

    // Get n8n webhook URL from environment variables
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL not configured')
      return NextResponse.json(
        { error: 'Workflow service not configured' },
        { status: 500 }
      )
    }

    // Trigger n8n workflow
    const workflowResponse = await fetch(`${n8nWebhookUrl}/resume-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowPayload),
    })

    if (!workflowResponse.ok) {
      const errorText = await workflowResponse.text()
      console.error('n8n workflow failed:', errorText)
      return NextResponse.json(
        { error: 'Resume analysis workflow failed', details: errorText },
        { status: 500 }
      )
    }

    const analysisResult = await workflowResponse.json()

    // Return successful response
    return NextResponse.json({
      success: true,
      message: 'Resume analysis completed successfully',
      data: analysisResult
    })

  } catch (error: any) {
    console.error('Resume analysis API error:', error)
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

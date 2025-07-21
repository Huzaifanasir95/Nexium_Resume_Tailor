import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the FormData from the request
    const formData = await request.formData()
    
    console.log('Sending request to n8n webhook...')
    
    // Forward the FormData directly to n8n webhook and wait for completion
    const n8nResponse = await fetch('http://localhost:5678/webhook/resume-analysis-simple', {
      method: 'POST',
      body: formData,
      // Increase timeout to handle long-running workflow
      signal: AbortSignal.timeout(300000) // 5 minutes timeout
    })

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.status}`)
    }

    // Get the complete result from n8n (after workflow completes)
    const result = await n8nResponse.json()
    
    console.log('n8n workflow completed with result:', result)

    // Return the analysis result directly
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error: any) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

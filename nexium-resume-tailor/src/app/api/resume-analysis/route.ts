import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the FormData from the request
    const formData = await request.formData()
    
    // Forward the FormData directly to n8n webhook
    const n8nResponse = await fetch('http://localhost:5678/webhook/resume-analysis-simple', {
      method: 'POST',
      body: formData, // Send FormData directly to n8n
    })

    // Get the response from n8n
    const result = await n8nResponse.json()

    // Debug logging
    console.log('n8n response status:', n8nResponse.status)
    console.log('n8n response data:', result)
    console.log('Response type:', typeof result)
    console.log('Is array:', Array.isArray(result))

    // Return the response with proper CORS headers
    return NextResponse.json(result, {
      status: n8nResponse.status,
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

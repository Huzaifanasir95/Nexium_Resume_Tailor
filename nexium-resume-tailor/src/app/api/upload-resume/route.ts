import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/utils/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
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

    // Create unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${userId}_${timestamp}.${fileExtension}`
    const filePath = `resumes/${userId}/${uniqueFileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      )
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(uploadData.path)

    if (!urlData.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to generate file URL' },
        { status: 500 }
      )
    }

    // Determine file type
    const fileType = file.type.includes('pdf') ? 'pdf' : 'docx'

    // Return file information
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileName: file.name,
        uniqueFileName,
        fileType,
        fileUrl: urlData.publicUrl,
        filePath: uploadData.path,
        fileSize: file.size,
        uploadTimestamp: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message || 'An unexpected error occurred during file upload'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to upload files.' },
    { status: 405 }
  )
}

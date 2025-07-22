import { NextResponse, NextRequest } from 'next/server'
import { testMongoDBConnection, testSupabaseConnection } from '@/utils/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const analysisId = searchParams.get('analysisId')

  // If analysisId is provided, query Supabase for the analysis
  if (analysisId) {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('analysis_id', analysisId)
        .single()

      if (error) {
        console.error('Supabase query error:', error)
        return NextResponse.json({ 
          error: 'Analysis not found',
          details: error.message 
        }, { status: 404 })
      }

      return NextResponse.json(data)
    } catch (error: any) {
      console.error('Database query failed:', error)
      return NextResponse.json({ 
        error: 'Database query failed',
        details: error.message 
      }, { status: 500 })
    }
  }

  // Original connection test logic
  const results = {
    mongodb: { status: 'pending', error: null },
    supabase: { status: 'pending', error: null }
  }

  try {
    // Test MongoDB connection
    try {
      await testMongoDBConnection()
      results.mongodb = { status: 'success', error: null }
    } catch (error: any) {
      results.mongodb = { status: 'error', error: error.message }
    }

    // Test Supabase connection
    try {
      await testSupabaseConnection()
      results.supabase = { status: 'success', error: null }
    } catch (error: any) {
      results.supabase = { status: 'error', error: error.message }
    }

    const hasErrors = results.mongodb.status === 'error' || results.supabase.status === 'error'
    const statusCode = hasErrors ? 500 : 200

    return NextResponse.json({
      status: hasErrors ? 'error' : 'success',
      message: hasErrors ? 'One or more connections failed' : 'All connections successful',
      details: results
    }, { status: statusCode })
  } catch (error: any) {
    console.error('Connection test failed:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Connection test failed',
      error: error.message,
      details: results
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get('id')

    if (!analysisId || analysisId === 'unknown') {
      return NextResponse.json({ error: 'Valid Analysis ID is required' }, { status: 400 })
    }

    console.log('Fetching analysis for ID:', analysisId)

    // Handle special "latest" case
    if (analysisId === 'latest') {
      const { data: recentData, error: recentError } = await supabase
        .from('resume_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (recentError) {
        console.error('Error getting recent analysis:', recentError)
        return NextResponse.json({ 
          error: 'No analyses found',
          details: recentError.message 
        }, { status: 404 })
      }
      
      if (recentData) {
        console.log('Returning most recent analysis:', recentData.analysis_id)
        return NextResponse.json({
          ...recentData,
          _note: 'This is the most recent analysis'
        })
      }
    }

    // Simply fetch everything from Supabase for this analysis ID
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('analysis_id', analysisId)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      
      // If no rows found, try to get the most recent analysis instead
      if (error.code === 'PGRST116') {
        console.log('No analysis found with that ID, getting most recent analysis...')
        const { data: recentData, error: recentError } = await supabase
          .from('resume_analyses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        
        if (recentError) {
          console.error('Error getting recent analysis:', recentError)
          return NextResponse.json({ 
            error: 'Analysis not found and failed to get recent analysis',
            details: error.message 
          }, { status: 404 })
        }
        
        if (recentData) {
          console.log('Returning most recent analysis:', recentData.analysis_id)
          return NextResponse.json({
            ...recentData,
            _note: 'This is the most recent analysis (original ID not found)'
          })
        }
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch analysis',
        details: error.message 
      }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 })
    }

    console.log('Found analysis:', data.analysis_id)
    // Return everything as-is
    return NextResponse.json(data)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { connectToMongoDB, testSupabaseConnection } from '@/utils/db'

export async function GET() {
  const results = {
    mongodb: { status: 'pending', error: null },
    supabase: { status: 'pending', error: null }
  }

  try {
    // Test MongoDB connection
    try {
      const mongoClient = await connectToMongoDB()
      await mongoClient.close()
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

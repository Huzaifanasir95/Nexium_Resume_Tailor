import { createClient } from '@supabase/supabase-js'
import { MongoClient, Db } from 'mongodb'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nasirhuzaifa95:1234@cluster0.okbji.mongodb.net'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export const connectToMongoDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }
    
    // Return cached connection if available
    if (cachedClient && cachedDb) {
      return { client: cachedClient, db: cachedDb }
    }
    
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    
    await client.connect()
    const db = client.db('resume_tailor')
    
    // Test the connection
    await db.command({ ping: 1 })
    console.log('Successfully connected to MongoDB')
    
    // Cache the connection
    cachedClient = client
    cachedDb = db
    
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

export const insertResumeAnalysis = async (analysisData: any) => {
  try {
    const { db } = await connectToMongoDB()
    
    const document = {
      ...analysisData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('resume_analyses').insertOne(document)
    console.log('Resume analysis stored with ID:', result.insertedId)
    
    return {
      success: true,
      analysisId: result.insertedId.toString(),
      message: 'Resume analysis stored successfully'
    }
  } catch (error) {
    console.error('Failed to store resume analysis:', error)
    throw error
  }
}

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export const testSupabaseConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is not defined in environment variables')
    }

    // Test connection by getting the current user session
    // This is a lightweight way to verify the connection
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      throw error
    }
    console.log('Successfully connected to Supabase')
    return true
  } catch (error) {
    console.error('Failed to connect to Supabase:', error)
    throw error
  }
}

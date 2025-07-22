import { createClient } from '@supabase/supabase-js'
import { MongoClient } from 'mongodb'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || ''

export const connectToMongoDB = async (): Promise<MongoClient> => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }
    
    const client = new MongoClient(MONGODB_URI, {
      // Add connection options if needed
    })
    
    // Test the connection by accessing the admin database
    await client.db("admin").command({ ping: 1 })
    console.log('Successfully connected to MongoDB')
    return client
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

// Test MongoDB connection function for health checks
export const testMongoDBConnection = async (): Promise<boolean> => {
  let client: MongoClient | null = null
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }
    
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    // Test the connection by pinging the database
    await client.db("admin").command({ ping: 1 })
    console.log('Successfully connected to MongoDB')
    
    return true
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  } finally {
    if (client) {
      await client.close()
    }
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

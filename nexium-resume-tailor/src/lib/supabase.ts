import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if valid credentials are provided
export const supabase = (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Auth helper functions
export const signInWithEmail = async (email: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

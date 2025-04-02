
import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
    'https://hixnsofhbuzwdyjmnhvy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpeG5zb2ZoYnV6d2R5am1uaHZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDAwODUsImV4cCI6MjA1ODU3NjA4NX0.Kxheh26idrNPiryd6--uVDQ4BHAnoId_Rv1Ue36_TBw',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

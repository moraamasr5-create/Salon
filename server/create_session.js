import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY in environment')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function createSession(data = {}, ttlSeconds = 300, route = '/form') {
  const session_code = crypto.randomBytes(6).toString('hex')
  const expires_at = new Date(Date.now() + ttlSeconds * 1000).toISOString()

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({ session_code, data, expires_at })
    .select('*')
    .maybeSingle()

  if (error) throw error

  return {
    session_code: session.session_code,
    expires_at: session.expires_at,
    link: `${BASE_URL}${route}?session=${session.session_code}`
  }
}

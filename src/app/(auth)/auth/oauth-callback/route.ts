// app/auth/oauth-callback/route.ts
import { createClient } from '@/src/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const role = requestUrl.searchParams.get('role')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/signup?error=${encodeURIComponent(errorDescription || error)}`
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Session exchange error:', exchangeError)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/signup?error=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // Get the user session to verify authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('User fetch error:', userError)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/signup?error=Authentication failed`
      )
    }

    // Update the user profile with the correct role
    if (role === 'expert') {
      await supabase
        .from('user_profiles')
        .update({ is_expert: true })
        .eq('user_id', user.id)
    }

    // Redirect based on role
    if (role === 'expert') {
      return NextResponse.redirect(`${requestUrl.origin}/auth/expert-verification`)
    } else {
      // For enthusiasts, redirect to dashboard since they're already authenticated
      return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
    }
  }

  // No code provided, redirect to signup
  return NextResponse.redirect(`${requestUrl.origin}/auth/signup`)
}
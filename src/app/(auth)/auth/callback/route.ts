import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // OAuth returns a "code"
  const code = searchParams.get('code')
  const role = searchParams.get('role')
  const next = searchParams.get('next') ?? '/dashboard'

  const origin = request.nextUrl.origin
  const redirectTo = new URL(next, origin)

  console.log('[OAuth Callback] Starting callback with code:', !!code, 'role:', role)

  if (code) {
    const supabase = await createClient()

    // Exchange OAuth code for session
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[OAuth Callback] Session exchange error:', error)
      return NextResponse.redirect(new URL('/error', origin))
    }

    console.log('[OAuth Callback] Session exchanged successfully')

    // Get the user to check profile
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('[OAuth Callback] User fetch error:', userError)
      return NextResponse.redirect(new URL('/error', origin))
    }

    console.log('[OAuth Callback] User authenticated:', user.id, 'email:', user.email)

    // Update the user profile with the correct role (for sign-ups)
    if (role === 'expert') {
      await supabase
        .from('user_profiles')
        .update({ is_expert: true })
        .eq('user_id', user.id)
    }

    // Redirect based on role (for sign-ups)
    if (role === 'expert') {
      return NextResponse.redirect(new URL('/auth/expert-verification', origin))
    } else if (role === 'enthusiast') {
      return NextResponse.redirect(new URL('/initial-setup', origin))
    }

    // For sign-ins, check user profile
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('username, is_expert')
        .eq('user_id', user.id)
        .single()

      console.log('[OAuth Callback] Profile check:', { 
        hasProfile: !!profile, 
        hasUsername: !!profile?.username,
        isExpert: profile?.is_expert,
        error: profileError?.code 
      })

      // If profile doesn't exist or username is null, redirect to initial setup
      if (profileError?.code === 'PGRST116' || !profile || !profile.username) {
        console.log('[OAuth Callback] Redirecting to initial-setup (no profile/username)')
        return NextResponse.redirect(new URL('/initial-setup', origin))
      }

      // If user is an expert, check if they're verified
      if (profile.is_expert) {
        const { data: expert } = await supabase
          .from('experts')
          .select('is_verified')
          .eq('user_id', user.id)
          .single()

        // If expert exists but not verified, redirect to expert verification
        if (expert && !expert.is_verified) {
          console.log('[OAuth Callback] Redirecting to expert-verification (not verified)')
          return NextResponse.redirect(new URL('/auth/expert-verification', origin))
        }
      }

      // User has complete profile, redirect to dashboard
      console.log('[OAuth Callback] Redirecting to dashboard:', redirectTo.toString())
      
      // Get the response with proper cookie handling
      const response = NextResponse.redirect(redirectTo)
      
      // Ensure we're using the same supabase instance that has the session
      // The cookies should already be set by exchangeCodeForSession
      const { data: { session } } = await supabase.auth.getSession()
      console.log('[OAuth Callback] Final session check:', { 
        hasSession: !!session, 
        userId: session?.user?.id 
      })
      
      return response
    } catch (error) {
      console.error('[OAuth Callback] Error checking user profile:', error)
      // On error, redirect to initial setup as fallback
      return NextResponse.redirect(new URL('/initial-setup', origin))
    }
  }

  // fallback: must be absolute URL
  return NextResponse.redirect(new URL('/error', origin))
}


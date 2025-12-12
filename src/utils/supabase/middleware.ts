import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check admin access for admin routes
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0)
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isAdmin = user?.email && adminEmails.length > 0 && 
    adminEmails.includes(user.email.toLowerCase().trim())

  // If trying to access admin routes but not an admin, redirect to dashboard
  if (user && isAdminPath && !isAdmin) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Public paths that don't require authentication
  const publicPaths = ['/', '/landing', '/auth', '/upload', '/error']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(`${path}/`)
  )

  if (!user && !isPublicPath) {
    // no user, redirect to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    // Preserve the original path as a query parameter so we can redirect back after login
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }


  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
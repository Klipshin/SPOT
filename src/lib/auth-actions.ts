'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '../utils/supabase/server'
import { createAdminClient } from '../utils/supabase/admin'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Check if credentials match admin credentials (from env vars only, not database)
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0)
  const adminPassword = process.env.ADMIN_PASSWORD
  
  // Debug logging (remove in production)
  console.log('Admin check:', {
    email: email.toLowerCase().trim(),
    adminEmails,
    hasPassword: !!adminPassword,
    emailMatch: adminEmails.includes(email.toLowerCase().trim()),
    passwordMatch: password === adminPassword
  })
  
  const isAdmin = adminEmails.length > 0 && adminPassword && 
    adminEmails.includes(email.toLowerCase().trim()) && 
    password === adminPassword

  // If admin credentials match env vars, create admin session without storing env password in DB
  if (isAdmin) {
    console.log('Admin credentials matched, creating session...')
    const adminClient = createAdminClient()
    
    // Check if user exists (for session purposes only)
    // List users and find by email since getUserByEmail doesn't exist
    const { data: usersList, error: listError } = await adminClient.auth.admin.listUsers()
    const existingUser = usersList?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    let userId: string
    
    // Create a minimal user record if needed (just for session, uses random password not env password)
    if (!existingUser) {
      // Generate a random secure password for the database (not the env password)
      const randomPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16) + 'A1!'
      
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password: randomPassword, // Store random password, not the env password
        email_confirm: true,
      })
      
      if (createError || !newUser.user) {
        throw new Error(`Failed to create admin session: ${createError?.message || 'Unknown error'}`)
      }
      
      userId = newUser.user.id
    } else {
      userId = existingUser.id
    }
    
    // Create session by temporarily setting a known password, signing in, then changing it back
    // This way the env password is never stored in the database
    const tempPassword = 'temp_' + Math.random().toString(36).slice(-12) + 'A1!'
    
    // Set temporary password
    await adminClient.auth.admin.updateUserById(userId, {
      password: tempPassword,
    })
    
    // Sign in with temp password to get session
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: tempPassword,
    })
    
    if (signInError) {
      console.error('Admin sign in error:', signInError)
      throw new Error(`Failed to create admin session: ${signInError.message}`)
    }
    
    if (!session) {
      console.error('No session created for admin')
      throw new Error('Failed to create admin session: No session returned')
    }
    
    console.log('Admin session created successfully')
    
    // Immediately change password back to random (not env password)
    const randomPassword = Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16) + 'A1!'
    await adminClient.auth.admin.updateUserById(userId, {
      password: randomPassword,
    })
    
    // Check if admin user is suspended (admins should not be suspended, but check anyway)
    const { data: profile } = await adminClient
      .from('user_profiles')
      .select('is_suspended')
      .eq('user_id', userId)
      .single()

    // If admin is suspended, sign them out (shouldn't happen, but handle it)
    if (profile && profile.is_suspended === true) {
      await supabase.auth.signOut()
      throw new Error('Your account has been suspended. Please contact support for assistance.')
    }
    
    return {
      userId: userId,
      isAdmin: true,
      email: email
    }
  }

  // Regular user login (credentials stored in database)
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!authData.user?.id) {
    throw new Error('Failed to authenticate user')
  }

  // Check if user is suspended
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('is_suspended')
    .eq('user_id', authData.user.id)
    .single()

  // If profile exists and user is suspended, sign them out and prevent login
  if (profile && profile.is_suspended === true) {
    // Sign out the user immediately
    await supabase.auth.signOut()
    throw new Error('Your account has been suspended. Please contact support for assistance.')
  }

  // If profile doesn't exist yet, that's okay (they'll set it up)
  // Only throw error if there was an actual database error
  if (profileError && profileError.code !== 'PGRST116') {
    console.error('Error checking user suspension status:', profileError)
    // Don't block login if we can't check, but log the error
  }

  return { 
    userId: authData.user.id,
    isAdmin: false,
    email: authData.user.email
  }
}


export async function signup(formData: FormData) {
  const supabase = await createClient()

  const isExpert = (formData.get('is_expert') as string) === 'true'

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        is_expert: isExpert,
        role: isExpert ? 'expert' : 'enthusiast',
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    throw new Error(error.message)
  }
  
  revalidatePath('/', 'layout')
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
}

export async function sendResetPasswordEmail(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.log(error);
    redirect("/error");
  }

  return {
    success: "Please check your email.",
    error: '',
  }
}

export async function updatePassword(password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.updateUser({password: password})

  if (error) {
    console.log(error);
    redirect("/error");
  }

  return {
    success: "Password updated.",
    error: '',
  }
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      }
    }
  });

  console.log("OAuth URL: ", data.url)

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function signInWithFacebook() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.log(error)
    redirect('/error')
  }
  return data.url
}

export async function signUpWithGoogle(role: 'enthusiast' | 'expert') {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: { access_type: "offline", prompt: "consent" },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?role=${role}`,
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }
  return data.url;
}

export async function signUpWithFacebook(role: 'enthusiast' | 'expert') {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?role=${role}`,
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }
  return data.url;
}
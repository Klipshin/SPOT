import { createClient } from '@/src/utils/supabase/server'
import ExpertVerification from '@/src/components/auth/ExpertVerificationForm'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function ExpertVerificationPage() {
  const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      redirect('/auth/signup')
      return 
    }
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#9FFEC9] via-[#EAFEDB] to-[#E8FECC] overflow-hidden">
        <div className="absolute top-0 right-0 w-200 h-200 bg-[#DDFEE9] rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-200 h-200 bg-[##D0E690] rounded-full filter blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <ExpertVerification />
    </div>
  )
}

import UsernameCreation from '@/src/components/initial-setup/UsernameCreation'
import React from 'react'

export default function InitialSetupPage() {
  return (
    <div className="relative min-h-screen flex justify-start overflow-hidden
        bg-gradient-to-tr from-[#ABCBE0] via-white to-[#ABCBE0]"
    >
        <div className="absolute left-0 h-full w-2/3 rounded-full filter blur-3xl bg-[#ACC563] -translate-x-1/5 translate-y-1/7" />
        <div className="absolute left-0 h-full w-1/2 rounded-full opacity-70 filter blur-3xl bg-[#305A32] -translate-x-1/2 translate-y-1/5" />
        <div className="absolute top-0 right-0 w-200 h-200 bg-[#ACC563] rounded-full filter blur-3xl translate-x-2/3 -translate-y-1/2" />
        <div className="absolute top-0 left-0 h-full w-1/2 rounded-full opacity-80 filter blur-3xl bg-[#305A32] -translate-x-3/5 -translate-y-1/2" />

        <UsernameCreation />
    </div>
  )
}

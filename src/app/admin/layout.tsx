import AdminProvider from '@/src/components/admin/DashboardProvider'
import React from 'react'

export default function AdminLayout({ children } : { children: React.ReactNode } ) {

    return (
        <AdminProvider>{children}</AdminProvider>
    )
}

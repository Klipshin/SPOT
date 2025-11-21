import AdminProvider from '@/src/components/admin/AdminProvider'
import React from 'react'

export default function AdminLayout({ children } : { children: React.ReactNode } ) {

    return (
        <AdminProvider>
            {children}
        </AdminProvider>
    )
}

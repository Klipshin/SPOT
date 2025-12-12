'use client';

import AdminProvider from '@/src/components/admin/AdminProvider'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import React from 'react'

export default function AdminLayout({ children } : { children: React.ReactNode } ) {

    return (
        <ProtectedRoute>
            <AdminProvider>
                {children}
            </AdminProvider>
        </ProtectedRoute>
    )
}

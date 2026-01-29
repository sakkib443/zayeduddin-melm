'use client';

import React from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import DashboardHeader from '@/components/Admin/DashboardHeader';
import ProtectedRoute from '@/app/providers/protectedRoutes';
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider';

// Import dashboard-specific CSS (separate from frontend)
import '@/app/dashboard.css';

const AdminLayoutContent = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`dashboard-container min-h-screen transition-colors duration-300 dashboard-fonts ${isDark
      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800'
      : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="lg:ml-72 transition-all duration-300">
        {/* Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className={`p-4 lg:p-6 transition-colors duration-300 ${isDark ? 'text-slate-200' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <ProtectedRoute role="admin">
      <ThemeProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </ThemeProvider>
    </ProtectedRoute>
  );
};

export default AdminLayout;

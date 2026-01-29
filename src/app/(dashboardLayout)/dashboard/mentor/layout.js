'use client';

import React from 'react';
import MentorSidebar from '@/components/Mentor/MentorSidebar';
import DashboardHeader from '@/components/Admin/DashboardHeader';
import ProtectedRoute from '@/app/providers/protectedRoutes';
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider';

// Import dashboard-specific CSS (same as admin)
import '@/app/dashboard.css';

const MentorLayoutContent = ({ children }) => {
    const { isDark } = useTheme();

    return (
        <div className={`dashboard-container min-h-screen transition-colors duration-300 dashboard-fonts ${isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800'
            : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
            }`}>
            {/* Sidebar */}
            <MentorSidebar />

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

const MentorLayout = ({ children }) => {
    return (
        <ProtectedRoute role="mentor">
            <ThemeProvider>
                <MentorLayoutContent>{children}</MentorLayoutContent>
            </ThemeProvider>
        </ProtectedRoute>
    );
};

export default MentorLayout;

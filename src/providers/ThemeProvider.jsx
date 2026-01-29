'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { },
    isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        setMounted(true);
        try {
            if (typeof window !== 'undefined') {
                const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
                setTheme(savedTheme);

                // Apply theme to document
                if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('dashboard-theme', newTheme);

                // Apply theme to document
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const isDark = theme === 'dark';

    // Prevent flash of wrong theme
    if (!mounted) {
        return <div style={{ visibility: 'hidden' }}>{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;

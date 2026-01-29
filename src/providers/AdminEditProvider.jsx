'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { API_BASE_URL } from '@/config/api';

const BASE_URL = API_BASE_URL;

// Context for admin edit mode
const AdminEditContext = createContext({
    isAdmin: false,
    isEditMode: false,
    toggleEditMode: () => { },
    contents: {},
    updateContent: async (key, value, valueBn) => { },
    getContent: (key, fallback) => fallback,
    loading: false,
});

export const useAdminEdit = () => useContext(AdminEditContext);

export const AdminEditProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [contents, setContents] = useState({});
    const [loading, setLoading] = useState(false);

    // Check if user is admin
    useEffect(() => {
        const checkAdmin = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    setIsAdmin(user.role === 'admin');
                } else {
                    setIsAdmin(false);
                }
            } catch (e) {
                setIsAdmin(false);
            }
        };

        checkAdmin();
        // Listen for storage changes
        window.addEventListener('storage', checkAdmin);
        return () => window.removeEventListener('storage', checkAdmin);
    }, []);

    // Fetch all content on mount
    useEffect(() => {
        fetchAllContent();
    }, []);

    const fetchAllContent = async () => {
        try {
            const res = await fetch(`${BASE_URL}/site-content`);
            const data = await res.json();
            if (data.success && data.data) {
                const contentMap = {};
                data.data.forEach(item => {
                    contentMap[item.key] = item;
                });
                setContents(contentMap);
            }
        } catch (err) {
            console.error('Failed to fetch site content:', err);
        }
    };

    const toggleEditMode = () => {
        if (isAdmin) {
            setIsEditMode(prev => !prev);
        }
    };

    const updateContent = useCallback(async (key, value, valueBn) => {
        if (!isAdmin) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BASE_URL}/site-content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ key, value, valueBn }),
            });

            const data = await res.json();
            if (data.success) {
                setContents(prev => ({
                    ...prev,
                    [key]: data.data,
                }));
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to update content:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    const getContent = useCallback((key, fallback = '') => {
        const content = contents[key];
        if (content) {
            return content.value || fallback;
        }
        return fallback;
    }, [contents]);

    return (
        <AdminEditContext.Provider value={{
            isAdmin,
            isEditMode,
            toggleEditMode,
            contents,
            updateContent,
            getContent,
            loading,
        }}>
            {children}
        </AdminEditContext.Provider>
    );
};

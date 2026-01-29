'use client';

import React from 'react';
import { FiEdit3, FiX } from 'react-icons/fi';
import { useAdminEdit } from '@/providers/AdminEditProvider';

/**
 * Floating button that appears for admins to toggle edit mode
 * Shows in bottom-right corner of screen
 */
export default function AdminEditToggle() {
    const { isAdmin, isEditMode, toggleEditMode } = useAdminEdit();

    // Only show for admins
    if (!isAdmin) return null;

    return (
        <button
            onClick={toggleEditMode}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 ${isEditMode
                    ? 'bg-[#F79952] text-white hover:bg-orange-500'
                    : 'bg-[#E62D26] text-white hover:bg-[#c41e18]'
                }`}
            title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        >
            {isEditMode ? (
                <>
                    <FiX size={20} />
                    <span className="font-medium">Exit Edit Mode</span>
                </>
            ) : (
                <>
                    <FiEdit3 size={20} />
                    <span className="font-medium">Edit Page</span>
                </>
            )}
        </button>
    );
}

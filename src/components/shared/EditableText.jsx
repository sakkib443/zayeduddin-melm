'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { useAdminEdit } from '@/providers/AdminEditProvider';
import toast from 'react-hot-toast';

/**
 * EditableText Component
 * Allows inline editing of text content when admin is in edit mode
 * 
 * @param {string} contentKey - Unique key for this content (e.g., "hero.title")
 * @param {string} fallback - Default/fallback text if no saved content
 * @param {string} as - HTML element to render (p, h1, h2, span, etc.)
 * @param {string} className - Additional CSS classes
 * @param {boolean} html - If true, renders as HTML (dangerouslySetInnerHTML)
 */
export default function EditableText({
    contentKey,
    fallback = '',
    as: Component = 'p',
    className = '',
    html = false,
    ...props
}) {
    const { isAdmin, isEditMode, getContent, updateContent, contents, loading } = useAdminEdit();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef(null);

    // Get current content
    const currentValue = getContent(contentKey, fallback);

    // When editing starts, set the edit value
    useEffect(() => {
        if (isEditing) {
            setEditValue(currentValue);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isEditing, currentValue]);

    const handleSave = async () => {
        if (editValue !== currentValue) {
            const success = await updateContent(contentKey, editValue);
            if (success) {
                toast.success('Content saved!');
            } else {
                toast.error('Failed to save');
            }
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(currentValue);
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            handleCancel();
        }
    };

    // If not admin or not in edit mode, just render the text
    if (!isAdmin || !isEditMode) {
        if (html) {
            return <Component className={className} dangerouslySetInnerHTML={{ __html: currentValue }} {...props} />;
        }
        return <Component className={className} {...props}>{currentValue}</Component>;
    }

    // Edit mode - show edit icon
    if (!isEditing) {
        return (
            <div className="group relative inline-block">
                {html ? (
                    <Component className={className} dangerouslySetInnerHTML={{ __html: currentValue }} {...props} />
                ) : (
                    <Component className={className} {...props}>{currentValue}</Component>
                )}
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-[#E62D26] text-white rounded-lg shadow-lg hover:bg-[#c41e18] z-50"
                    title="Edit this text"
                >
                    <FiEdit2 size={14} />
                </button>
                {/* Highlight border on hover */}
                <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-[#E62D26]/50 rounded pointer-events-none -m-1" />
            </div>
        );
    }

    // Active editing
    const isMultiLine = currentValue.length > 100 || currentValue.includes('\n');

    return (
        <div className="relative">
            {isMultiLine ? (
                <textarea
                    ref={inputRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full p-2 border-2 border-[#E62D26] rounded-lg outline-none bg-white text-gray-800 resize-none ${className}`}
                    rows={4}
                    disabled={loading}
                />
            ) : (
                <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full p-2 border-2 border-[#E62D26] rounded-lg outline-none bg-white text-gray-800 ${className}`}
                    disabled={loading}
                />
            )}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="p-1.5 bg-[#E62D26] text-white rounded-lg shadow-lg hover:bg-[#c41e18] disabled:opacity-50"
                    title="Save"
                >
                    <FiCheck size={14} />
                </button>
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="p-1.5 bg-gray-500 text-white rounded-lg shadow-lg hover:bg-gray-600 disabled:opacity-50"
                    title="Cancel"
                >
                    <FiX size={14} />
                </button>
            </div>
        </div>
    );
}

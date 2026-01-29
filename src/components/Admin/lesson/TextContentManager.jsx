'use client';

import React, { useState } from 'react';
import {
    FiPlus, FiTrash2, FiEdit3, FiCheck, FiX, FiType,
    FiAlignLeft, FiChevronDown, FiChevronUp
} from 'react-icons/fi';

/**
 * Text Content Manager Component
 * Rich text blocks ??? ??? manage ???? ????
 */
export default function TextContentManager({ textBlocks = [], mainContent = '', mainContentBn = '', onChangeBlocks, onChangeMain }) {
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        content: '',
        contentBn: '',
        order: textBlocks.length + 1,
    });

    const resetForm = () => {
        setFormData({
            title: '',
            titleBn: '',
            content: '',
            contentBn: '',
            order: textBlocks.length + 1,
        });
        setEditingIndex(null);
        setShowForm(false);
    };

    const handleSaveBlock = () => {
        if (!formData.content.trim()) {
            alert('Please enter content');
            return;
        }

        const newBlock = {
            ...formData,
            order: editingIndex !== null ? formData.order : textBlocks.length + 1
        };

        if (editingIndex !== null) {
            const updated = [...textBlocks];
            updated[editingIndex] = newBlock;
            onChangeBlocks(updated);
        } else {
            onChangeBlocks([...textBlocks, newBlock]);
        }

        resetForm();
    };

    const handleEdit = (index) => {
        setFormData(textBlocks[index]);
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleDelete = (index) => {
        if (confirm('Are you sure you want to delete this text block?')) {
            onChangeBlocks(textBlocks.filter((_, i) => i !== index));
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition-all bg-white text-slate-700";

    return (
        <div className="space-y-4">
            {/* Main Text Content */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FiAlignLeft className="text-amber-600" />
                    Main Lesson Text Content
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Content (English)</label>
                        <textarea
                            value={mainContent}
                            onChange={(e) => onChangeMain('textContent', e.target.value)}
                            placeholder="Write lesson content in English... (Supports HTML)"
                            rows={6}
                            className={`${inputClass} resize-none font-mono text-xs`}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Content (?????)</label>
                        <textarea
                            value={mainContentBn}
                            onChange={(e) => onChangeMain('textContentBn', e.target.value)}
                            placeholder="??????? ???? ???????? ?????... (HTML ??????? ???)"
                            rows={6}
                            className={`${inputClass} resize-none font-mono text-xs`}
                        />
                    </div>
                </div>
                <p className="text-[10px] text-slate-500">?? Tip: You can use HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;code&gt; for formatting</p>
            </div>

            {/* Additional Text Blocks */}
            <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FiType className="text-amber-600" />
                    Additional Text Sections
                    <span className="text-xs font-normal text-slate-500">({textBlocks.length} sections)</span>
                </h4>

                {textBlocks.length > 0 && (
                    <div className="space-y-2">
                        {textBlocks.map((block, index) => (
                            <div
                                key={index}
                                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                            >
                                <div
                                    className="flex items-center justify-between p-3 cursor-pointer"
                                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">
                                                {block.title || `Section ${index + 1}`}
                                            </p>
                                            <p className="text-xs text-slate-500 line-clamp-1">
                                                {block.content?.substring(0, 50)}...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleEdit(index); }}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-amber-600 transition-colors"
                                        >
                                            <FiEdit3 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(index); }}
                                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                        {expandedIndex === index ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                                    </div>
                                </div>

                                {expandedIndex === index && (
                                    <div className="px-3 pb-3 border-t border-slate-100 pt-2">
                                        <div className="prose prose-sm max-w-none p-3 bg-slate-50 rounded-lg text-slate-700"
                                            dangerouslySetInnerHTML={{ __html: block.content }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Text Block Form */}
            {showForm ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <FiType className="text-amber-600" />
                            {editingIndex !== null ? 'Edit Text Section' : 'Add New Text Section'}
                        </h4>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    {/* Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Section Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Key Concepts"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Title (?????)</label>
                            <input
                                type="text"
                                value={formData.titleBn}
                                onChange={(e) => setFormData(prev => ({ ...prev, titleBn: e.target.value }))}
                                placeholder="??? ?????????"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Content (English) *</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Write content here... (HTML supported)"
                                rows={8}
                                className={`${inputClass} resize-none font-mono text-xs`}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Content (?????)</label>
                            <textarea
                                value={formData.contentBn}
                                onChange={(e) => setFormData(prev => ({ ...prev, contentBn: e.target.value }))}
                                placeholder="??????? ???????? ?????..."
                                rows={8}
                                className={`${inputClass} resize-none font-mono text-xs`}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveBlock}
                            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm flex items-center gap-2"
                        >
                            <FiCheck size={16} />
                            {editingIndex !== null ? 'Update Section' : 'Add Section'}
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="w-full p-3 border-2 border-dashed border-amber-200 rounded-xl text-amber-600 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
                >
                    <FiPlus size={18} />
                    Add Text Section
                </button>
            )}
        </div>
    );
}

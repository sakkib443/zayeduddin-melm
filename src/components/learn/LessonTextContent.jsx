'use client';

import React, { useState } from 'react';
import { FiFileText, FiChevronDown, FiChevronUp, FiBookOpen } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Text Content Viewer Component for Students
 * Shows rich text content and text blocks from a lesson
 */
export default function LessonTextContent({ textContent = '', textContentBn = '', textBlocks = [] }) {
    const [expandedBlocks, setExpandedBlocks] = useState({});
    const [language, setLanguage] = useState('en'); // 'en' or 'bn'

    const toggleBlock = (index) => {
        setExpandedBlocks(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const hasMainContent = textContent?.trim() || textContentBn?.trim();
    const hasBlocks = textBlocks && textBlocks.length > 0;

    if (!hasMainContent && !hasBlocks) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiFileText size={28} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No text content available for this lesson</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Language Toggle */}
            {(textContentBn || textBlocks?.some(b => b.contentBn)) && (
                <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-slate-500 font-medium">Language:</span>
                    <div className="inline-flex rounded-lg bg-slate-100 p-1">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${language === 'en'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('bn')}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${language === 'bn'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            ?????
                        </button>
                    </div>
                </div>
            )}

            {/* Main Text Content */}
            {hasMainContent && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                                <FiBookOpen size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Lesson Content</h3>
                                <p className="text-xs text-slate-500">Read through the material below</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div
                            className="prose prose-slate max-w-none prose-headings:font-outfit prose-p:leading-relaxed prose-a:text-indigo-600 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100"
                            dangerouslySetInnerHTML={{
                                __html: language === 'bn' && textContentBn ? textContentBn : textContent
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Text Blocks */}
            {hasBlocks && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <FiFileText className="text-amber-500" />
                        Additional Sections ({textBlocks.length})
                    </h4>

                    {textBlocks
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((block, index) => {
                            const isExpanded = expandedBlocks[index] !== false; // Default expanded
                            const content = language === 'bn' && block.contentBn ? block.contentBn : block.content;
                            const title = language === 'bn' && block.titleBn ? block.titleBn : block.title;

                            return (
                                <div
                                    key={block._id || index}
                                    className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                                >
                                    <button
                                        onClick={() => toggleBlock(index)}
                                        className="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-semibold text-slate-800 truncate">
                                                {title || `Section ${index + 1}`}
                                            </h5>
                                        </div>
                                        <div className="text-slate-400">
                                            {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4 pt-0">
                                                    <div className="p-4 bg-slate-50 rounded-xl">
                                                        <div
                                                            className="prose prose-sm prose-slate max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: content }}
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

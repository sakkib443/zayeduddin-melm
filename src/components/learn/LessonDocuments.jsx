'use client';

import React, { useState } from 'react';
import { FiDownload, FiFile, FiFileText, FiImage, FiVideo, FiArchive, FiExternalLink } from 'react-icons/fi';

/**
 * Document Viewer Component for Students
 * Shows downloadable documents attached to a lesson
 */
export default function LessonDocuments({ documents = [] }) {
    if (!documents || documents.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiFile size={28} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No documents available for this lesson</p>
            </div>
        );
    }

    const fileTypeConfig = {
        pdf: { icon: FiFileText, color: 'text-red-500 bg-red-50 border-red-100' },
        doc: { icon: FiFileText, color: 'text-blue-500 bg-blue-50 border-blue-100' },
        docx: { icon: FiFileText, color: 'text-blue-500 bg-blue-50 border-blue-100' },
        ppt: { icon: FiFile, color: 'text-orange-500 bg-orange-50 border-orange-100' },
        pptx: { icon: FiFile, color: 'text-orange-500 bg-orange-50 border-orange-100' },
        xls: { icon: FiFile, color: 'text-green-500 bg-green-50 border-green-100' },
        xlsx: { icon: FiFile, color: 'text-green-500 bg-green-50 border-green-100' },
        zip: { icon: FiArchive, color: 'text-amber-500 bg-amber-50 border-amber-100' },
        image: { icon: FiImage, color: 'text-purple-500 bg-purple-50 border-purple-100' },
        video: { icon: FiVideo, color: 'text-pink-500 bg-pink-50 border-pink-100' },
        other: { icon: FiFile, color: 'text-slate-500 bg-slate-50 border-slate-100' },
    };

    const getFileConfig = (type) => fileTypeConfig[type] || fileTypeConfig.other;

    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                <FiFile className="text-indigo-500" />
                Lesson Resources ({documents.length})
            </h4>

            <div className="grid gap-3">
                {documents.map((doc, index) => {
                    const config = getFileConfig(doc.fileType);
                    const IconComponent = config.icon;

                    return (
                        <div
                            key={doc._id || index}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${config.color} hover:shadow-md transition-all group`}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                                <IconComponent size={24} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-slate-800 truncate">{doc.title}</h5>
                                {doc.description && (
                                    <p className="text-sm text-slate-500 line-clamp-1">{doc.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                    <span className="uppercase font-bold">{doc.fileType}</span>
                                    {doc.fileSize && <span>� {doc.fileSize}</span>}
                                </div>
                            </div>

                            {doc.downloadable && doc.fileUrl && (
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all opacity-80 group-hover:opacity-100"
                                >
                                    <FiDownload size={16} />
                                    Download
                                </a>
                            )}

                            {!doc.downloadable && doc.fileUrl && (
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                                >
                                    <FiExternalLink size={16} />
                                    View
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

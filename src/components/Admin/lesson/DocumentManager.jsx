'use client';

import React, { useState } from 'react';
import {
    FiPlus, FiTrash2, FiEdit3, FiCheck, FiX, FiFile, FiDownload,
    FiFileText, FiImage, FiVideo, FiArchive, FiUpload
} from 'react-icons/fi';

/**
 * Professional Document Manager Component
 * Documents/Attachments ??? ??? manage ???? ????
 */
export default function DocumentManager({ documents = [], onChange }) {
    const [showForm, setShowForm] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        titleBn: '',
        description: '',
        descriptionBn: '',
        fileUrl: '',
        fileType: 'pdf',
        fileSize: '',
        downloadable: true,
        order: documents.length + 1,
    });

    const fileTypeOptions = [
        { value: 'pdf', label: 'PDF', icon: FiFileText, color: 'text-red-500 bg-red-50' },
        { value: 'doc', label: 'Word Doc', icon: FiFileText, color: 'text-blue-500 bg-blue-50' },
        { value: 'docx', label: 'Word Docx', icon: FiFileText, color: 'text-blue-500 bg-blue-50' },
        { value: 'ppt', label: 'PowerPoint', icon: FiFile, color: 'text-orange-500 bg-orange-50' },
        { value: 'pptx', label: 'PowerPoint', icon: FiFile, color: 'text-orange-500 bg-orange-50' },
        { value: 'xls', label: 'Excel', icon: FiFile, color: 'text-green-500 bg-green-50' },
        { value: 'xlsx', label: 'Excel', icon: FiFile, color: 'text-green-500 bg-green-50' },
        { value: 'zip', label: 'Archive', icon: FiArchive, color: 'text-amber-500 bg-amber-50' },
        { value: 'image', label: 'Image', icon: FiImage, color: 'text-purple-500 bg-purple-50' },
        { value: 'video', label: 'Video', icon: FiVideo, color: 'text-pink-500 bg-pink-50' },
        { value: 'other', label: 'Other', icon: FiFile, color: 'text-slate-500 bg-slate-50' },
    ];

    const getFileTypeInfo = (type) => {
        return fileTypeOptions.find(f => f.value === type) || fileTypeOptions[fileTypeOptions.length - 1];
    };

    const resetForm = () => {
        setFormData({
            title: '',
            titleBn: '',
            description: '',
            descriptionBn: '',
            fileUrl: '',
            fileType: 'pdf',
            fileSize: '',
            downloadable: true,
            order: documents.length + 1,
        });
        setEditingIndex(null);
        setShowForm(false);
    };

    const handleSaveDocument = () => {
        if (!formData.title.trim() || !formData.fileUrl.trim()) {
            alert('Please enter document title and file URL');
            return;
        }

        const newDoc = {
            ...formData,
            order: editingIndex !== null ? formData.order : documents.length + 1
        };

        if (editingIndex !== null) {
            const updated = [...documents];
            updated[editingIndex] = newDoc;
            onChange(updated);
        } else {
            onChange([...documents, newDoc]);
        }

        resetForm();
    };

    const handleEdit = (index) => {
        setFormData(documents[index]);
        setEditingIndex(index);
        setShowForm(true);
    };

    const handleDelete = (index) => {
        if (confirm('Are you sure you want to delete this document?')) {
            onChange(documents.filter((_, i) => i !== index));
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all bg-white text-slate-700";

    return (
        <div className="space-y-4">
            {/* Documents List */}
            {documents.length > 0 && (
                <div className="space-y-2">
                    {documents.map((doc, index) => {
                        const typeInfo = getFileTypeInfo(doc.fileType);
                        const IconComponent = typeInfo.icon;

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeInfo.color}`}>
                                        <IconComponent size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{doc.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="uppercase font-bold">{doc.fileType}</span>
                                            {doc.fileSize && <span>� {doc.fileSize}</span>}
                                            {doc.downloadable && (
                                                <span className="flex items-center gap-1 text-emerald-600">
                                                    <FiDownload size={12} /> Downloadable
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        <FiFile size={16} />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(index)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors"
                                    >
                                        <FiEdit3 size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(index)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600 transition-colors"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Document Form */}
            {showForm ? (
                <div className="bg-gradient-to-br from-emerald-50 to-red-50 p-5 rounded-2xl border border-emerald-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            <FiFile className="text-emerald-600" />
                            {editingIndex !== null ? 'Edit Document' : 'Add New Document'}
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
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Title (English) *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Course PDF Notes"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Title (?????)</label>
                            <input
                                type="text"
                                value={formData.titleBn}
                                onChange={(e) => setFormData(prev => ({ ...prev, titleBn: e.target.value }))}
                                placeholder="????? ?????? ????"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* File URL */}
                    <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">File URL *</label>
                        <div className="relative">
                            <FiUpload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="url"
                                value={formData.fileUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                                placeholder="https://drive.google.com/file/..."
                                className={`${inputClass} pl-11`}
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">Paste a link to Google Drive, Dropbox, or any file hosting service</p>
                    </div>

                    {/* File Type & Size */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="col-span-2">
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">File Type</label>
                            <select
                                value={formData.fileType}
                                onChange={(e) => setFormData(prev => ({ ...prev, fileType: e.target.value }))}
                                className={inputClass}
                            >
                                {fileTypeOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">File Size</label>
                            <input
                                type="text"
                                value={formData.fileSize}
                                onChange={(e) => setFormData(prev => ({ ...prev, fileSize: e.target.value }))}
                                placeholder="e.g. 2.5 MB"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Downloadable</label>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, downloadable: !prev.downloadable }))}
                                className={`w-full py-2.5 rounded-xl border-2 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${formData.downloadable
                                        ? 'border-emerald-500 bg-emerald-500 text-white'
                                        : 'border-slate-200 bg-white text-slate-500'
                                    }`}
                            >
                                {formData.downloadable ? <FiCheck size={16} /> : null}
                                {formData.downloadable ? 'Yes' : 'No'}
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Brief description..."
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-600 mb-1 block">Description (?????)</label>
                            <input
                                type="text"
                                value={formData.descriptionBn}
                                onChange={(e) => setFormData(prev => ({ ...prev, descriptionBn: e.target.value }))}
                                placeholder="????????? ??????..."
                                className={inputClass}
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
                            onClick={handleSaveDocument}
                            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center gap-2"
                        >
                            <FiCheck size={16} />
                            {editingIndex !== null ? 'Update Document' : 'Add Document'}
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="w-full p-4 border-2 border-dashed border-emerald-200 rounded-2xl text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 font-semibold"
                >
                    <FiPlus size={20} />
                    Add Document
                </button>
            )}
        </div>
    );
}

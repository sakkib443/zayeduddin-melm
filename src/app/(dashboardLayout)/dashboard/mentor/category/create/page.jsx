'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave, FiLoader, FiImage, FiGlobe, FiInfo, FiBook, FiCode, FiLayout, FiCheck, FiFolder, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

const MentorCreateCategory = () => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image: '',
        status: 'active',
        type: 'course',
        isParent: false,
        parentCategory: null
    });
    const [parentCategories, setParentCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchParents = async () => {
            
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${BASE_URL}/categories/admin/parents`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setParentCategories(data.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchParents();
    }, []);

    useEffect(() => {
        if (formData.name) {
            const slugified = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug: slugified }));
        }
    }, [formData.name]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const token = localStorage.getItem('token');

        const payload = {
            ...formData,
            parentCategory: formData.isParent ? null : formData.parentCategory
        };

        try {
            const response = await fetch(`${BASE_URL}/categories/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Category created successfully! ?');
                router.push('/dashboard/mentor/category');
            } else {
                alert(result.message || 'Failed to create category');
            }
        } catch (error) {
            alert('Network error - check backend connectivity');
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'course': return 'from-indigo-500 to-purple-500';
            case 'website': return 'from-emerald-500 to-red-500';
            case 'software': return 'from-violet-500 to-purple-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const typeOptions = [
        { value: 'course', label: 'Course', icon: FiBook, desc: 'LMS & Education', color: 'indigo' },
        { value: 'website', label: 'Website', icon: FiLayout, desc: 'Templates & Themes', color: 'emerald' },
        { value: 'software', label: 'Software', icon: FiCode, desc: 'Plugins & Scripts', color: 'violet' },
    ];

    const filteredParents = parentCategories.filter(p => p.type === formData.type);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-12">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/mentor/category" className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                            <FiArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-800 outfit tracking-tight">Create Category</h1>
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">Mentor</span>
                            </div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-0.5">New Classification Segment</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Parent/Child Toggle */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Category Level</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" onClick={() => setFormData({ ...formData, isParent: true, parentCategory: null })} className={`p-5 rounded-2xl border-2 transition-all text-left ${formData.isParent ? 'border-slate-800 bg-slate-800 text-white shadow-xl' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${formData.isParent ? 'bg-white/20' : 'bg-slate-100'}`}>
                                    <FiFolder size={22} className={formData.isParent ? 'text-white' : 'text-slate-500'} />
                                </div>
                                <p className={`text-sm font-black ${formData.isParent ? 'text-white' : 'text-slate-800'}`}>Parent Category</p>
                                <p className={`text-[10px] font-medium mt-0.5 ${formData.isParent ? 'text-white/80' : 'text-slate-400'}`}>Main folder (e.g., Web Development)</p>
                            </button>

                            <button type="button" onClick={() => setFormData({ ...formData, isParent: false })} className={`p-5 rounded-2xl border-2 transition-all text-left ${!formData.isParent ? 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${!formData.isParent ? 'bg-white/20' : 'bg-slate-100'}`}>
                                    <FiChevronRight size={22} className={!formData.isParent ? 'text-white' : 'text-slate-500'} />
                                </div>
                                <p className={`text-sm font-black ${!formData.isParent ? 'text-white' : 'text-slate-800'}`}>Sub-Category</p>
                                <p className={`text-[10px] font-medium mt-0.5 ${!formData.isParent ? 'text-white/80' : 'text-slate-400'}`}>Under a parent (e.g., React, WordPress)</p>
                            </button>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100 space-y-8">

                        {/* Type Selection */}
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Category Type *</label>
                            <div className="grid grid-cols-3 gap-4">
                                {typeOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = formData.type === option.value;
                                    return (
                                        <button key={option.value} type="button" onClick={() => setFormData({ ...formData, type: option.value, parentCategory: null })} className={`p-5 rounded-2xl border-2 transition-all text-center ${isSelected ? `border-transparent bg-gradient-to-br ${getTypeColor(option.value)} text-white shadow-xl` : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                                                <Icon size={22} className={isSelected ? 'text-white' : 'text-slate-500'} />
                                            </div>
                                            <p className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>{option.label}</p>
                                            <p className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{option.desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Parent Category Selector */}
                        {!formData.isParent && (
                            <div className="pt-6 border-t border-slate-100">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Select Parent Category *</label>
                                {filteredParents.length === 0 ? (
                                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                                        <FiFolder className="text-amber-500 mx-auto mb-2" size={24} />
                                        <p className="text-sm font-bold text-amber-700">No parent categories found</p>
                                        <p className="text-xs text-amber-500 mt-1">Create a parent category first for "{formData.type}"</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {filteredParents.map(parent => (
                                            <button key={parent._id} type="button" onClick={() => setFormData({ ...formData, parentCategory: parent._id })} className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${formData.parentCategory === parent._id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.parentCategory === parent._id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    <FiFolder size={18} />
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold ${formData.parentCategory === parent._id ? 'text-indigo-700' : 'text-slate-700'}`}>{parent.name}</p>
                                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest">{parent.type}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Name & Slug */}
                        <div className="space-y-5 pt-6 border-t border-slate-100">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Category Name *</label>
                                <input type="text" required placeholder={formData.isParent ? "e.g. Web Development, Motion Graphics..." : "e.g. React, WordPress, After Effects..."} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:border-indigo-400 outline-none transition-all" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">URL Slug</label>
                                    <div className="relative">
                                        <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" readOnly value={formData.slug} className="w-full pl-11 pr-4 py-4 bg-slate-100 border border-transparent rounded-2xl text-sm font-mono text-slate-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Status</label>
                                    <button type="button" onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })} className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formData.status === 'active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-200 text-slate-500'}`}>
                                        {formData.status === 'active' ? <><FiCheck size={16} /> Active</> : 'Draft'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image & Description */}
                        <div className="space-y-5 pt-6 border-t border-slate-100">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Icon / Image URL</label>
                                <div className="relative">
                                    <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" placeholder="https://example.com/icon.png" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:border-indigo-400 outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Description</label>
                                <textarea rows={3} placeholder="Briefly describe what content belongs in this category..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder:text-slate-300 focus:bg-white focus:border-indigo-400 outline-none transition-all resize-none leading-relaxed"></textarea>
                            </div>
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={loading || (!formData.isParent && !formData.parentCategory)} className={`w-full py-5 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl relative overflow-hidden ${loading || (!formData.isParent && !formData.parentCategory) ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30 active:scale-[0.98]'}`}>
                            {loading ? (
                                <FiLoader className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <FiSave size={20} />
                                    <span className="uppercase tracking-widest">Create {formData.isParent ? 'Parent' : 'Sub'} Category</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="flex gap-4 p-6 bg-slate-800 text-white rounded-2xl shadow-xl">
                        <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                            <FiInfo className="text-slate-400" size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Category Types</h4>
                            <p className="text-sm font-medium leading-relaxed mt-1 text-slate-400">
                                <strong className="text-indigo-400">Course:</strong> For LMS courses & tutorials<br />
                                <strong className="text-emerald-400">Website:</strong> For website templates & themes<br />
                                <strong className="text-violet-400">Software:</strong> For plugins, scripts & tools
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MentorCreateCategory;


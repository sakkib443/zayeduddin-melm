'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    FiArrowLeft, FiSave, FiLoader, FiGlobe, FiZap,
    FiLayers, FiTag, FiDollarSign, FiPlus, FiTrash2, FiLink,
    FiImage, FiMonitor, FiCpu, FiCheck, FiInfo, FiCode
} from 'react-icons/fi';
import Link from 'next/link';

const websiteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    platform: z.string().min(1, "Platform is required"),
    category: z.string().min(1, "Category is required"),
    accessType: z.enum(['free', 'paid']),
    price: z.coerce.number().min(0),
    offerPrice: z.coerce.number().min(0).optional().nullable(),
    description: z.string().min(1, "Description is required").max(1000),
    longDescription: z.string().optional(),
    images: z.array(z.string()).min(1, "At least one image URL required"),
    previewUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    downloadFile: z.string().min(1, "Download file URL/Path is required"),
    features: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'draft']),
    isFeatured: z.boolean(),
});

// Platform Options
const PLATFORM_OPTIONS = [
    'WordPress', 'React', 'Next.js', 'PHP', 'HTML/CSS', 'Vue.js', 'Angular', 'Laravel',
    'Framer', 'Webflow', 'Tailwind CSS', 'Shopify', 'MERN Stack', 'Other'
];

export default function CreateWebsitePage() {
    const [loading, setLoading] = useState(false);
    const [fetchingCategories, setFetchingCategories] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(websiteSchema),
        defaultValues: {
            status: 'approved',
            accessType: 'paid',
            isFeatured: false,
            images: [''],
            features: [''],
            technologies: [''],
            platform: 'WordPress',
            price: 0,
            offerPrice: 0,
        }
    });

    const imageFields = useFieldArray({ control, name: 'images' });
    const featureFields = useFieldArray({ control, name: 'features' });
    const techFields = useFieldArray({ control, name: 'technologies' });

    useEffect(() => {
        const fetchCategories = async () => {
            setFetchingCategories(true);
            
            const token = localStorage.getItem('token');
            try {
                // Fetch using admin endpoint to see all categories (active/inactive)
                const res = await fetch(`${BASE_URL}/categories/admin/all?type=website`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCategories(data.data || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setFetchingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const onSubmit = async (values) => {
        setLoading(true);
        
        const token = localStorage.getItem('token');

        // Clean up empty strings from arrays
        const cleanArray = (arr) => arr?.filter(item => item && item.trim() !== '') || [];

        const payload = {
            ...values,
            features: cleanArray(values.features),
            technologies: cleanArray(values.technologies),
            images: cleanArray(values.images),
            // Ensure offerPrice is null if it's 0 or empty for cleaner data
            offerPrice: (values.offerPrice === 0 || !values.offerPrice) ? null : values.offerPrice
        };

        try {
            const response = await fetch(`${BASE_URL}/websites/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Website template published successfully! 🚀');
                router.push('/dashboard/admin/website');
            } else {
                alert(`Error: ${result.message || 'Something went wrong'}`);
            }
        } catch (error) {
            alert('Network error - please check your connection');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-sm transition-all placeholder:text-slate-400";
    const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";
    const cardClass = "bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm";

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4 transition-all">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/website" className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-sm">
                        <FiArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <FiGlobe className="text-emerald-500" />
                            Create Website
                        </h1>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Add a new premium website template to your marketplace</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/dashboard/admin/website')}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 active:scale-95"
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave size={16} />}
                        {loading ? 'Publishing...' : 'Publish Template'}
                    </button>
                </div>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Side: 8 Columns */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Basic Info */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <FiInfo size={18} />
                            <h2 className="font-bold uppercase tracking-wider text-xs">Essential Information</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className={labelClass}>Template Title</label>
                                <input
                                    {...register('title')}
                                    placeholder="e.g. AgencyPro - Responsive Business Next.js Template"
                                    className={inputClass}
                                />
                                {errors.title && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.title.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>
                                        Target Platform
                                        {fetchingCategories && <FiLoader className="ml-2 animate-spin inline text-emerald-500" size={12} />}
                                    </label>
                                    <div className="relative">
                                        <FiMonitor className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                        <select {...register('platform')} className={`${inputClass} pl-10 appearance-none`}>
                                            {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                    {errors.platform && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.platform.message}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Category</label>
                                    <div className="relative">
                                        <FiTag className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                        <select {...register('category')} className={`${inputClass} pl-10 appearance-none text-slate-700 dark:text-slate-300`}>
                                            <option value="">Select a category...</option>
                                            {categories.map(c => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name} {c.isParent ? '(Parent)' : ''} {c.status !== 'active' ? `(${c.status})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.category && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.category.message}</p>}
                                    {!fetchingCategories && categories.length === 0 && (
                                        <p className="text-amber-500 text-[10px] mt-1 italic font-medium">No website categories found. Create some in Category Settings.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extended Content */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <FiCheck size={18} />
                            <h2 className="font-bold uppercase tracking-wider text-xs">Features & Tech Stack</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Tech Stack Dynamic Fields */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className={labelClass}>Technologies Used</label>
                                    <button
                                        type="button"
                                        onClick={() => techFields.append('')}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 transition-all self-end"
                                    >
                                        <FiPlus size={12} /> Add Tech
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {techFields.fields.map((field, idx) => (
                                        <div key={field.id} className="group relative animate-in fade-in zoom-in duration-200">
                                            <input
                                                {...register(`technologies.${idx}`)}
                                                className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-emerald-300 dark:focus:border-emerald-500 w-36 transition-all"
                                                placeholder="e.g. React"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => techFields.remove(idx)}
                                                className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110"
                                            >
                                                <FiTrash2 size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    {techFields.fields.length === 0 && <p className="text-slate-400 text-xs italic">No items added yet...</p>}
                                </div>
                            </div>

                            {/* Features Dynamic Fields */}
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <label className={labelClass}>Key Features</label>
                                    <button
                                        type="button"
                                        onClick={() => featureFields.append('')}
                                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 transition-all self-end"
                                    >
                                        <FiPlus size={12} /> Add Feature
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {featureFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                                            <div className="relative flex-1">
                                                <FiZap className="absolute left-3 top-3.5 text-emerald-400" size={14} />
                                                <input {...register(`features.${idx}`)} className={`${inputClass} pl-10`} placeholder="e.g. SEO Optimized Code" />
                                            </div>
                                            <button type="button" onClick={() => featureFields.remove(idx)} className="text-rose-400 hover:text-rose-500 p-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"><FiTrash2 size={18} /></button>
                                        </div>
                                    ))}
                                    {featureFields.fields.length === 0 && <p className="text-slate-400 text-xs italic col-span-full">No features listed yet...</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Assets */}
                    <div className={cardClass}>
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <FiImage size={18} />
                            <h2 className="font-bold uppercase tracking-wider text-xs">Media & Content</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className={labelClass}>Gallery Showcase Images</label>
                                    <button
                                        type="button"
                                        onClick={() => imageFields.append('')}
                                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                                    >
                                        <FiPlus size={14} /> Add Image Link
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {imageFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex items-center gap-3 relative animate-in fade-in duration-300">
                                            <div className="relative flex-1">
                                                <FiLink className="absolute left-3 w-4 h-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input {...register(`images.${idx}`)} className={`${inputClass} pl-10`} placeholder="https://example.com/screenshot-1.jpg" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => imageFields.remove(idx)}
                                                className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {errors.images && <p className="text-rose-500 text-xs font-medium">{errors.images.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <label className={labelClass}>Live Preview URL</label>
                                    <div className="relative">
                                        <FiGlobe className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                        <input {...register('previewUrl')} className={`${inputClass} pl-10`} placeholder="https://demo.example.com" />
                                    </div>
                                    {errors.previewUrl && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.previewUrl.message}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Static Source/Download Path</label>
                                    <div className="relative">
                                        <FiLink className="absolute left-3 top-3.5 text-slate-400" size={16} />
                                        <input {...register('downloadFile')} className={`${inputClass} pl-10`} placeholder="Path or external link..." />
                                    </div>
                                    {errors.downloadFile && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.downloadFile.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Areas */}
                    <div className="space-y-6">
                        <div className={cardClass}>
                            <label className={labelClass}>Brief Summary Description</label>
                            <textarea {...register('description')} rows={4} className={`${inputClass} resize-none`} placeholder="Describe the template's purpose and highlights..."></textarea>
                            <div className="flex justify-between mt-1.5 px-1">
                                {errors.description && <p className="text-rose-500 text-xs font-medium">{errors.description.message}</p>}
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">Max 1000 characters</p>
                            </div>
                        </div>

                        <div className={cardClass}>
                            <label className={labelClass}>Full Details (Optional)</label>
                            <textarea {...register('longDescription')} rows={8} className={`${inputClass} resize-none`} placeholder="Provide a detailed overview of what users get..."></textarea>
                        </div>
                    </div>
                </div >

                {/* Right Side: 4 Columns - Pricing & Status */}
                < div className="lg:col-span-4 space-y-8 sticky top-24" >

                    {/* Pricing Card */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FiDollarSign size={120} />
                        </div>

                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-8 flex items-center gap-2">
                            <span className="w-8 h-px bg-emerald-400 mr-2"></span>
                            Commercials
                        </h2>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-2 block tracking-widest">Base Price (৳)</label>
                                <div className="relative">
                                    <span className="absolute left-0 top-3 text-2xl font-black text-slate-500">৳</span>
                                    <input
                                        type="number"
                                        {...register('price')}
                                        className="w-full bg-transparent border-b-2 border-slate-700 py-2 pl-8 pr-2 text-3xl font-black text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                                        placeholder="0"
                                    />
                                </div>
                                {errors.price && <p className="text-rose-400 text-xs mt-2 font-medium">{errors.price.message}</p>}
                            </div>

                            <div>
                                <label className="text-[10px] uppercase font-bold text-slate-400 mb-2 block tracking-widest">Discounted Price (৳)</label>
                                <div className="relative">
                                    <span className="absolute left-0 top-3 text-2xl font-black text-slate-500">৳</span>
                                    <input
                                        type="number"
                                        {...register('offerPrice')}
                                        className="w-full bg-transparent border-b-2 border-slate-700 py-2 pl-8 pr-2 text-3xl font-black text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                                        placeholder="0"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 italic font-medium">Leave 0 if no discount is active.</p>
                            </div>

                            <div className="pt-4 space-y-4">
                                <label className="flex items-center gap-3 p-4 bg-slate-800/40 border border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all active:scale-[0.98]">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded-md accent-emerald-500 opacity-0 absolute z-10 cursor-pointer" />
                                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${watch('isFeatured') ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                            {watch('isFeatured') && <FiCheck className="text-white" size={12} />}
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-300">Boost to Featured</span>
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-3 rounded-2xl border transition-all cursor-pointer ${watch('accessType') === 'paid' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/40 border-slate-800'}`} onClick={() => setValue('accessType', 'paid')}>
                                        <div className="flex flex-col items-center gap-1.5">
                                            <FiDollarSign className={watch('accessType') === 'paid' ? 'text-emerald-500' : 'text-slate-500'} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Premium</span>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-2xl border transition-all cursor-pointer ${watch('accessType') === 'free' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/40 border-slate-800'}`} onClick={() => setValue('accessType', 'free')}>
                                        <div className="flex flex-col items-center gap-1.5">
                                            <FiGlobe className={watch('accessType') === 'free' ? 'text-emerald-500' : 'text-slate-500'} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Free</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className={cardClass}>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Post Controls</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Visibility Status</label>
                                <select {...register('status')} className={inputClass}>
                                    <option value="approved">✅ Live / Approved</option>
                                    <option value="pending">⏳ Pending Review</option>
                                    <option value="draft">📁 Draft Only</option>
                                    <option value="rejected">❌ Rejected</option>
                                </select>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dotted border-slate-200 dark:border-slate-700">
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    Approved websites will appear in the marketplace search and catalog. Featured assets will be displayed on the homepage slider.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                        <FiZap className="text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400 leading-normal">
                            Pro Tip: High-quality thumbnails and a clear tech stack lead to 70% higher conversion rates in the marketplace.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}

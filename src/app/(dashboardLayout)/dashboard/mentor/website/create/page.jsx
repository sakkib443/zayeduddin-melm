'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    FiArrowLeft, FiSave, FiLoader, FiImage, FiGlobe,
    FiLayers, FiTag, FiDollarSign, FiPlus, FiTrash2, FiLink
} from 'react-icons/fi';
import Link from 'next/link';

const websiteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    platform: z.string().min(1, "Platform is required"),
    category: z.string().min(1, "Category is required"),
    accessType: z.enum(['free', 'paid']),
    price: z.coerce.number().min(0),
    offerPrice: z.coerce.number().min(0).optional(),
    description: z.string().min(1, "Description is required").max(1000),
    longDescription: z.string().optional(),
    images: z.array(z.string()).min(1, "At least one image URL required"),
    previewUrl: z.string().optional().or(z.literal('')),
    downloadFile: z.string().min(1, "Download file URL/Path is required"),
    features: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'draft']),
    isFeatured: z.boolean(),
});

// Hardcoded Platform Options
const PLATFORM_OPTIONS = [
    'WordPress', 'React', 'Next.js', 'PHP', 'HTML/CSS', 'Vue.js', 'Angular', 'Laravel', 'Other'
];

export default function MentorCreateWebsitePage() {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(websiteSchema),
        defaultValues: {
            status: 'approved',
            accessType: 'paid',
            isFeatured: false,
            images: [''],
            features: [''],
            technologies: [''],
            platform: 'WordPress'
        }
    });

    const imageFields = useFieldArray({ control, name: 'images' });
    const featureFields = useFieldArray({ control, name: 'features' });
    const techFields = useFieldArray({ control, name: 'technologies' });

    useEffect(() => {
        const fetchData = async () => {
            
            try {
                const catRes = await fetch(`${BASE_URL}/categories?type=website`);
                const catData = await catRes.json();
                setCategories(catData.data || []);
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const onSubmit = async (values) => {
        setLoading(true);
        
        const token = localStorage.getItem('token');

        // Clean up empty arrays
        const cleanArray = (arr) => arr?.filter(item => item && item.trim() !== '') || [];
        const payload = {
            ...values,
            features: cleanArray(values.features),
            technologies: cleanArray(values.technologies),
            images: cleanArray(values.images),
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

            if (response.ok) {
                alert('Website asset added to marketplace! ?');
                router.push('/dashboard/mentor/website');
            } else {
                const err = await response.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) { alert('Network error'); }
        finally { setLoading(false); }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all bg-white text-slate-700 placeholder:text-slate-400";
    const labelClass = "block text-sm font-medium text-slate-700 mb-2";
    const cardClass = "bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5";

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/mentor/website" className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
                        <FiArrowLeft size={18} />
                    </Link>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <FiGlobe className="text-white text-lg" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-slate-800">Add New Website</h1>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                                Mentor
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">Create a premium website template</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-red-500 hover:from-emerald-600 hover:to-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                >
                    {loading ? 'Publishing...' : <><FiSave size={16} /> Publish Website</>}
                </button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left: General Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className={cardClass}>
                        <h2 className="text-sm font-semibold text-slate-700 border-b pb-3 mb-2">Basic Metadata</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Asset Title</label>
                                <input {...register('title')} placeholder="e.g. Agency Pro - Next.js Business Template" className={inputClass} />
                                {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Platform *</label>
                                    <select {...register('platform')} className={inputClass}>
                                        {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    {errors.platform && <p className="text-rose-500 text-xs mt-1">{errors.platform.message}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Category *</label>
                                    <select {...register('category')} className={inputClass}>
                                        <option value="">Select category...</option>
                                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                    {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select {...register('status')} className={inputClass}>
                                        <option value="approved">Approved</option>
                                        <option value="pending">Pending</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Access Type</label>
                                    <select {...register('accessType')} className={inputClass}>
                                        <option value="paid">Paid</option>
                                        <option value="free">Free</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cardClass}>
                        <h2 className="text-sm font-semibold text-slate-700 border-b pb-3 mb-4">Dynamic Properties</h2>

                        {/* Technologies */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className={labelClass}>Tech Stack</label>
                                <button type="button" onClick={() => techFields.append('')} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">+ Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {techFields.fields.map((field, idx) => (
                                    <div key={field.id} className="group relative">
                                        <input {...register(`technologies.${idx}`)} className="px-3 py-2 bg-slate-50 rounded-lg text-sm border border-slate-200 outline-none focus:bg-white focus:border-emerald-300 w-28" placeholder="React" />
                                        <button type="button" onClick={() => techFields.remove(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={10} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                                <label className={labelClass}>Key Features</label>
                                <button type="button" onClick={() => featureFields.append('')} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">+ Add</button>
                            </div>
                            <div className="space-y-2">
                                {featureFields.fields.map((field, idx) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input {...register(`features.${idx}`)} className={inputClass} placeholder="e.g. Responsive design" />
                                        <button type="button" onClick={() => featureFields.remove(idx)} className="text-rose-400 p-2"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={cardClass}>
                        <h2 className="text-sm font-semibold text-slate-700 border-b pb-3 mb-4">Media & Catalog</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className={labelClass}>Gallery Images</label>
                                    <button type="button" onClick={() => imageFields.append('')} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">+ Add</button>
                                </div>
                                <div className="space-y-2">
                                    {imageFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2 relative">
                                            <FiImage className="absolute left-3 top-3 text-slate-400" />
                                            <input {...register(`images.${idx}`)} className={`${inputClass} pl-10`} placeholder="https://example.com/image.jpg" />
                                            <button type="button" onClick={() => imageFields.remove(idx)} className="text-rose-400 p-2 hover:text-rose-500"><FiTrash2 size={16} /></button>
                                        </div>
                                    ))}
                                    {errors.images && <p className="text-rose-500 text-xs">{errors.images.message || errors.images[0]?.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <label className={labelClass}>Preview URL</label>
                                    <input {...register('previewUrl')} className={inputClass} placeholder="https://demo.example.com" />
                                </div>
                                <div>
                                    <label className={labelClass}>Download Link</label>
                                    <input {...register('downloadFile')} className={inputClass} placeholder="https://drive.google.com/..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Pricing & Meta */}
                <div className="space-y-6">
                    <div className="bg-slate-800 p-6 rounded-2xl text-white shadow-lg space-y-5">
                        <h2 className="text-sm font-semibold text-white border-b border-slate-700 pb-3">Pricing</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">Regular Price (?)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-400">?</span>
                                    <input type="number" {...register('price')} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="0" />
                                </div>
                                {errors.price && <p className="text-rose-400 text-xs mt-1">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 block mb-2">Offer Price (?)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-400">?</span>
                                    <input type="number" {...register('offerPrice')} className="w-full bg-slate-700 border border-slate-600 rounded-xl py-3 pl-10 pr-4 text-white text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="0" />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
                                <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded accent-emerald-500" />
                                <span className="text-sm text-slate-300">Mark as Featured</span>
                            </label>
                        </div>
                    </div>

                    <div className={cardClass}>
                        <h2 className="text-sm font-semibold text-slate-700 border-b pb-3 mb-4">Description</h2>
                        <textarea {...register('description')} rows={5} className={`${inputClass} resize-none`} placeholder="Write a brief description of your website template..."></textarea>
                        {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}


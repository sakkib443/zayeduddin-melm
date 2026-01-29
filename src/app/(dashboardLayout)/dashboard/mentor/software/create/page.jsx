'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    FiArrowLeft, FiSave, FiLoader, FiTerminal, FiZap, FiGlobe, FiStar,
    FiPackage, FiSettings, FiTag, FiPlus, FiTrash2, FiFileText, FiCpu,
    FiDollarSign, FiImage, FiLink, FiCheck, FiLayers, FiCode, FiMonitor, FiEdit3
} from 'react-icons/fi';
import Link from 'next/link';

// Platform Options (matching backend)
const PLATFORM_OPTIONS = [
    'WordPress', 'PHP', 'JavaScript', 'Python', 'React', 'Next.js', 'Vue.js',
    'Angular', 'Node.js', 'Laravel', 'Django', 'Flutter', 'React Native',
    'Android', 'iOS', 'Unity', 'HTML/CSS', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Other'
];

// Software Type Options (matching backend)
const SOFTWARE_TYPE_OPTIONS = [
    'Plugin', 'Script', 'Application', 'Tool', 'Library', 'Framework',
    'Extension', 'Theme', 'Template', 'Component', 'API', 'SDK',
    'CLI Tool', 'Desktop App', 'Mobile App', 'Other'
];

const softwareSchema = z.object({
    title: z.string().min(1, "Title is required"),
    platform: z.string().min(1, "Platform is required"),
    category: z.string().min(1, "Category is required"),
    softwareType: z.string().min(1, "Software type is required"),
    accessType: z.enum(['free', 'paid']),
    version: z.string().min(1, "Version is required"),
    price: z.coerce.number().min(0),
    offerPrice: z.coerce.number().min(0).optional().nullable(),
    licenseType: z.enum(['regular', 'extended']),
    regularLicensePrice: z.coerce.number().min(0),
    extendedLicensePrice: z.coerce.number().min(0).optional().nullable(),
    description: z.string().min(1, "Description is required"),
    longDescription: z.string().optional(),
    changelog: z.string().optional(),
    features: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    browserCompatibility: z.array(z.string()).optional(),
    softwareCompatibility: z.array(z.string()).optional(),
    images: z.array(z.string()).min(1),
    previewUrl: z.string().optional(),
    downloadFile: z.string().min(1, "Download file is required"),
    documentationUrl: z.string().optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'draft']),
    isFeatured: z.boolean().optional(),
});

export default function CreateSoftwarePage() {
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check if we're in edit mode
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(softwareSchema),
        defaultValues: {
            status: 'approved',
            accessType: 'paid',
            licenseType: 'regular',
            version: '1.0.0',
            softwareType: 'Plugin',
            platform: 'WordPress',
            isFeatured: false,
            images: [''],
            features: [''],
            requirements: [''],
            technologies: [''],
            browserCompatibility: [''],
            softwareCompatibility: [''],
            price: 0,
            regularLicensePrice: 0,
        }
    });

    const imageFields = useFieldArray({ control, name: 'images' });
    const featureFields = useFieldArray({ control, name: 'features' });
    const requirementFields = useFieldArray({ control, name: 'requirements' });
    const techFields = useFieldArray({ control, name: 'technologies' });
    const browserFields = useFieldArray({ control, name: 'browserCompatibility' });
    const softwareCompatFields = useFieldArray({ control, name: 'softwareCompatibility' });

    useEffect(() => {
        const fetchCategories = async () => {
            
            try {
                const res = await fetch(`${BASE_URL}/categories?type=software`);
                const data = await res.json();
                setCategories(data.data || []);
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []);

    // Fetch existing software data if in edit mode
    useEffect(() => {
        if (isEditMode && editId) {
            
            const token = localStorage.getItem('token');

            const fetchSoftware = async () => {
                setFetchingData(true);
                try {
                    const res = await fetch(`${BASE_URL}/software/${editId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.data) {
                        const sw = data.data;
                        reset({
                            title: sw.title || '',
                            platform: sw.platform || 'WordPress',
                            category: sw.category?._id || sw.category || '',
                            softwareType: sw.softwareType || 'Plugin',
                            accessType: sw.accessType || 'paid',
                            version: sw.version || '1.0.0',
                            price: sw.price || 0,
                            offerPrice: sw.offerPrice || null,
                            licenseType: sw.licenseType || 'regular',
                            regularLicensePrice: sw.regularLicensePrice || 0,
                            extendedLicensePrice: sw.extendedLicensePrice || null,
                            description: sw.description || '',
                            longDescription: sw.longDescription || '',
                            changelog: sw.changelog || '',
                            features: sw.features?.length ? sw.features : [''],
                            requirements: sw.requirements?.length ? sw.requirements : [''],
                            technologies: sw.technologies?.length ? sw.technologies : [''],
                            browserCompatibility: sw.browserCompatibility?.length ? sw.browserCompatibility : [''],
                            softwareCompatibility: sw.softwareCompatibility?.length ? sw.softwareCompatibility : [''],
                            images: sw.images?.length ? sw.images : [''],
                            previewUrl: sw.previewUrl || '',
                            downloadFile: sw.downloadFile || '',
                            documentationUrl: sw.documentationUrl || '',
                            status: sw.status || 'approved',
                            isFeatured: sw.isFeatured || false,
                        });
                    }
                } catch (err) {
                    console.error(err);
                    alert('Failed to fetch software data');
                } finally {
                    setFetchingData(false);
                }
            };
            fetchSoftware();
        }
    }, [isEditMode, editId, reset]);

    const onSubmit = async (values) => {
        setLoading(true);
        
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const cleanArray = (arr) => arr?.filter(item => item && item.trim() !== '') || [];

        const payload = {
            ...values,
            author: user._id,
            features: cleanArray(values.features),
            requirements: cleanArray(values.requirements),
            technologies: cleanArray(values.technologies),
            browserCompatibility: cleanArray(values.browserCompatibility),
            softwareCompatibility: cleanArray(values.softwareCompatibility),
            images: cleanArray(values.images),
            offerPrice: values.offerPrice || undefined,
            extendedLicensePrice: values.extendedLicensePrice || undefined,
        };

        try {
            const url = isEditMode
                ? `${BASE_URL}/software/admin/managed/${editId}`
                : `${BASE_URL}/software/admin`;

            const method = isEditMode ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert(isEditMode ? 'Software updated successfully! ?' : 'Software successfully published! ??');
                router.push('/dashboard/mentor/software');
            } else {
                const err = await response.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) { alert('Network error'); }
        finally { setLoading(false); }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all bg-white text-slate-700 placeholder:text-slate-400";
    const labelClass = "block text-sm font-medium text-slate-700 mb-2";
    const cardClass = "bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm";
    const sectionTitle = "text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2";

    if (fetchingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FiLoader className="animate-spin text-violet-600 mx-auto mb-4" size={48} />
                    <p className="text-sm font-bold text-slate-600">Loading software data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/mentor/software" className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-800 hover:shadow-lg transition-all shadow-sm">
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-800">
                                {isEditMode ? 'Update Software' : 'Create New Software'}
                            </h1>
                            {isEditMode && (
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
                                    ?? Edit Mode
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm">
                            {isEditMode ? 'Update the software product details' : 'Add a new software product'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className={`flex items-center gap-2 ${isEditMode ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-violet-600 to-purple-600'} text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all disabled:opacity-50 hover:scale-105`}
                >
                    {loading ? <FiLoader className="animate-spin" /> : isEditMode ? <FiEdit3 size={18} /> : <FiZap size={18} />}
                    {loading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Software' : 'Publish Software')}
                </button>
            </div>

            {/* Main Content - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Information */}
                    <div className={cardClass}>
                        <h2 className={sectionTitle}><FiPackage className="text-violet-600" /> Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Software Title *</label>
                                <input {...register('title')} className={inputClass} placeholder="e.g. Advanced Form Builder" />
                                {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Platform *</label>
                                <select {...register('platform')} className={inputClass}>
                                    {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Software Type *</label>
                                <select {...register('softwareType')} className={inputClass}>
                                    {SOFTWARE_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Category *</label>
                                <select {...register('category')} className={inputClass}>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Version *</label>
                                <input {...register('version')} className={inputClass} placeholder="1.0.0" />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className={cardClass}>
                        <h2 className={sectionTitle}><FiFileText className="text-violet-600" /> Description</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Short Description *</label>
                                <textarea {...register('description')} rows={3} className={inputClass} placeholder="Brief description of the software..." />
                                {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Long Description</label>
                                <textarea {...register('longDescription')} rows={6} className={inputClass} placeholder="Detailed description, features, use cases..." />
                            </div>
                            <div>
                                <label className={labelClass}>Changelog (Optional)</label>
                                <textarea {...register('changelog')} rows={3} className={inputClass} placeholder="v1.0.0 - Initial release..." />
                            </div>
                        </div>
                    </div>

                    {/* Features & Requirements */}
                    <div className={cardClass}>
                        <h2 className={sectionTitle}><FiStar className="text-violet-600" /> Features & Requirements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Features */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className={labelClass}>Features</label>
                                    <button type="button" onClick={() => featureFields.append('')} className="text-violet-600 text-xs font-bold flex items-center gap-1">
                                        <FiPlus size={12} /> Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {featureFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input {...register(`features.${idx}`)} className={inputClass} placeholder="Feature point" />
                                            {featureFields.fields.length > 1 && (
                                                <button type="button" onClick={() => featureFields.remove(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Requirements */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className={labelClass}>Requirements</label>
                                    <button type="button" onClick={() => requirementFields.append('')} className="text-violet-600 text-xs font-bold flex items-center gap-1">
                                        <FiPlus size={12} /> Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {requirementFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input {...register(`requirements.${idx}`)} className={inputClass} placeholder="Requirement" />
                                            {requirementFields.fields.length > 1 && (
                                                <button type="button" onClick={() => requirementFields.remove(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technologies */}
                    <div className={cardClass}>
                        <h2 className={sectionTitle}><FiCode className="text-violet-600" /> Technologies</h2>
                        <div className="flex items-center justify-between mb-3">
                            <label className={labelClass}>Tech Stack Used</label>
                            <button type="button" onClick={() => techFields.append('')} className="text-violet-600 text-xs font-bold flex items-center gap-1">
                                <FiPlus size={12} /> Add
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {techFields.fields.map((field, idx) => (
                                <div key={field.id} className="flex gap-2">
                                    <input {...register(`technologies.${idx}`)} className={inputClass} placeholder="React, Node.js etc" />
                                    {techFields.fields.length > 1 && (
                                        <button type="button" onClick={() => techFields.remove(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                            <FiTrash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compatibility */}
                    <div className={cardClass}>
                        <h2 className={sectionTitle}><FiMonitor className="text-violet-600" /> Compatibility</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Browser Compatibility */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className={labelClass}>Browser Compatibility</label>
                                    <button type="button" onClick={() => browserFields.append('')} className="text-violet-600 text-xs font-bold flex items-center gap-1">
                                        <FiPlus size={12} /> Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {browserFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input {...register(`browserCompatibility.${idx}`)} className={inputClass} placeholder="Chrome, Firefox..." />
                                            {browserFields.fields.length > 1 && (
                                                <button type="button" onClick={() => browserFields.remove(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Software Compatibility */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className={labelClass}>Software Compatibility</label>
                                    <button type="button" onClick={() => softwareCompatFields.append('')} className="text-violet-600 text-xs font-bold flex items-center gap-1">
                                        <FiPlus size={12} /> Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {softwareCompatFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input {...register(`softwareCompatibility.${idx}`)} className={inputClass} placeholder="WordPress 6.0+..." />
                                            {softwareCompatFields.fields.length > 1 && (
                                                <button type="button" onClick={() => softwareCompatFields.remove(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">

                    {/* Pricing */}
                    <div className={cardClass}>
                        <h2 className={sectionTitle}><FiDollarSign className="text-emerald-600" /> Pricing</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Access Type</label>
                                <select {...register('accessType')} className={inputClass}>
                                    <option value="paid">Paid</option>
                                    <option value="free">Free</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Price (?) *</label>
                                <input type="number" {...register('price')} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Offer Price (?)</label>
                                <input type="number" {...register('offerPrice')} className={inputClass} placeholder="Sale price" />
                            </div>
                            <div>
                                <label className={labelClass}>License Type</label>
                                <select {...register('licenseType')} className={inputClass}>
                                    <option value="regular">Regular License</option>
                                    <option value="extended">Extended License</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Regular License Price (?)</label>
                                <input type="number" {...register('regularLicensePrice')} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Extended License Price (?)</label>
                                <input type="number" {...register('extendedLicensePrice')} className={inputClass} placeholder="Optional" />
                            </div>
                        </div>
                    </div>

                    {/* Status & Featured */}
                    <div className={cardClass}>
                        <h2 className={sectionTitle}><FiSettings className="text-slate-600" /> Status</h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Status</label>
                                <select {...register('status')} className={inputClass}>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="draft">Draft</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded accent-violet-600" />
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Featured Product</p>
                                    <p className="text-xs text-slate-500">Show in featured section</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Media & Links */}
                    <div className={cardClass}>
                        <h2 className={sectionTitle}><FiImage className="text-violet-600" /> Media & Links</h2>
                        <div className="space-y-4">
                            {/* Images */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className={labelClass}>Image URLs *</label>
                                    <button type="button" onClick={() => imageFields.append('')} className="text-violet-600 text-xs font-bold flex items-center gap-1">
                                        <FiPlus size={12} /> Add
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {imageFields.fields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input {...register(`images.${idx}`)} className={inputClass} placeholder="https://..." />
                                            {imageFields.fields.length > 1 && (
                                                <button type="button" onClick={() => imageFields.remove(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                    <FiTrash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {errors.images && <p className="text-rose-500 text-xs mt-1">{errors.images.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Preview URL</label>
                                <input {...register('previewUrl')} className={inputClass} placeholder="https://demo.example.com" />
                            </div>
                            <div>
                                <label className={labelClass}>Download File URL *</label>
                                <input {...register('downloadFile')} className={inputClass} placeholder="https://..." />
                                {errors.downloadFile && <p className="text-rose-500 text-xs mt-1">{errors.downloadFile.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Documentation URL</label>
                                <input {...register('documentationUrl')} className={inputClass} placeholder="https://docs.example.com" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


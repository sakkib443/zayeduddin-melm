'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import {
    FiPlus, FiTrash2, FiSave, FiImage, FiVideo,
    FiBookOpen, FiDollarSign, FiLayers, FiCheck,
    FiTarget, FiList, FiTag, FiSearch, FiArrowRight,
    FiUpload, FiLink, FiLoader, FiX
} from 'react-icons/fi';

// Style constants
const inputBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/10 outline-none transition-all";
const selectBase = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm text-slate-800 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/10 outline-none transition-all appearance-none cursor-pointer";

// FormField component
const FormField = ({ label, icon: Icon, error, children, required, optional }) => (
    <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            {Icon && <Icon size={14} className="text-slate-400" />}
            {label}
            {required && <span className="text-[#021E14]">*</span>}
            {optional && <span className="text-xs text-slate-400 font-normal">(Optional)</span>}
        </label>
        {children}
        {error && <p className="text-[#021E14] text-xs">{error.message}</p>}
    </div>
);

// SectionHeader component
const SectionHeader = ({ title, icon: Icon }) => (
    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
        <h2 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-[#021E14]" />}
            {title}
        </h2>
    </div>
);

// Zod Schema
const courseValidationSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    titleBn: z.string().min(3, "Bengali title must be at least 3 characters").optional().or(z.literal('')),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(50, "Description must be at least 50 characters"),
    descriptionBn: z.string().min(50, "Bengali description must be at least 50 characters").optional().or(z.literal('')),
    shortDescription: z.string().max(500).optional().or(z.literal('')),
    shortDescriptionBn: z.string().max(500).optional().or(z.literal('')),
    thumbnail: z.string().url("Must be a valid URL"),
    category: z.string().min(1, "Category is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    discountPrice: z.coerce.number().min(0).optional(),
    courseType: z.enum(['online', 'offline', 'recorded']),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    language: z.enum(['bangla', 'english', 'both']),
    tags: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    whatYouWillLearn: z.array(z.string()).optional(),
    targetAudience: z.array(z.string()).optional(),
    previewVideo: z.string().url().optional().or(z.literal('')),
    totalDuration: z.coerce.number().min(0).optional(),
    totalLessons: z.coerce.number().min(0).optional(),
    totalModules: z.coerce.number().min(0).optional(),
    metaTitle: z.string().max(100).optional().or(z.literal('')),
    metaDescription: z.string().max(300).optional().or(z.literal('')),
    status: z.enum(['draft', 'published', 'archived']),
    isFeatured: z.boolean().optional(),
    isPopular: z.boolean().optional(),
});

const CourseCreateTab = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [thumbnailMode, setThumbnailMode] = useState('link'); // 'link' or 'upload'
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const fileInputRef = useRef(null);
    const router = useRouter();

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(courseValidationSchema),
        defaultValues: {
            courseType: 'online',
            level: 'beginner',
            language: 'bangla',
            status: 'draft',
            features: [''],
            requirements: [''],
            whatYouWillLearn: [''],
            targetAudience: [''],
            tags: [''],
            price: 0,
            currency: 'BDT',
            totalDuration: 0,
            totalLessons: 0,
            totalModules: 0,
            isFeatured: false,
            isPopular: false,
        }
    });

    const featuresFields = useFieldArray({ control, name: 'features' });
    const requirementsFields = useFieldArray({ control, name: 'requirements' });
    const learningFields = useFieldArray({ control, name: 'whatYouWillLearn' });
    const audienceFields = useFieldArray({ control, name: 'targetAudience' });
    const tagsFields = useFieldArray({ control, name: 'tags' });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`);
                const data = await res.json();
                setCategories(data.data || []);
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []);

    const title = watch('title');
    const thumbnailUrl = watch('thumbnail');

    useEffect(() => {
        if (title) {
            const slugified = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setValue('slug', slugified);
        }
    }, [title, setValue]);

    // Update thumbnail preview when URL changes
    useEffect(() => {
        if (thumbnailUrl && thumbnailUrl.startsWith('http')) {
            setThumbnailPreview(thumbnailUrl);
        }
    }, [thumbnailUrl]);

    // Handle thumbnail upload to Cloudinary
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('image', file);

        try {
            setUploadingThumbnail(true);
            const response = await fetch(`${API_BASE_URL}/upload/single`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.data?.url) {
                setValue('thumbnail', result.data.url);
                setThumbnailPreview(result.data.url);
            } else {
                alert('Image upload failed: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed. Please try again.');
        } finally {
            setUploadingThumbnail(false);
        }
    };

    const removeThumbnail = () => {
        setValue('thumbnail', '');
        setThumbnailPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSubmit = async (data) => {
        setLoading(true);
        const BASE_URL = API_BASE_URL;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${BASE_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Course Created Successfully! Now add modules to this course.');
                if (result.data?._id) {
                    localStorage.setItem('lastCreatedCourseId', result.data._id);
                    localStorage.setItem('lastCreatedCourseTitle', result.data.title);
                }
                if (onSuccess) onSuccess();
            } else {
                const errorMsg = result.errorMessages
                    ? result.errorMessages.map(err => `${err.path.split('.').pop()}: ${err.message}`).join('\n')
                    : result.message;
                alert(`Validation Error:\n\n${errorMsg}`);
            }
        } catch (error) {
            alert('Network error!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Action Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#021E14] hover:bg-[#01140D] text-white font-medium text-sm rounded-md shadow-sm transition-all disabled:opacity-50"
                >
                    {loading ? <><FiLoader className="animate-spin" /> Creating...</> : <><FiSave /> Create Course & Continue <FiArrowRight className="ml-1" /></>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* Left Column - 8 Cols */}
                <div className="lg:col-span-8 space-y-5">

                    {/* Basic Info */}
                    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                        <SectionHeader title="Basic Information" icon={FiBookOpen} />
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Course Title (English)" error={errors.title} required>
                                    <input {...register('title')} autoComplete="off" className={inputBase} placeholder="e.g. Complete Video Editing Masterclass" />
                                </FormField>
                                <FormField label="Course Title (বাংলা)" error={errors.titleBn} optional>
                                    <input {...register('titleBn')} className={inputBase} placeholder="যেমন: ভিডিও এডিটিং মাস্টারক্লাস" />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Short Description (English)" error={errors.shortDescription}>
                                    <textarea {...register('shortDescription')} rows={2} className={inputBase} placeholder="A brief one-liner summary..." />
                                </FormField>
                                <FormField label="Short Description (বাংলা)" error={errors.shortDescriptionBn} optional>
                                    <textarea {...register('shortDescriptionBn')} rows={2} className={inputBase} placeholder="সংক্ষিপ্ত বিবরণ লিখুন..." />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Full Description (English)" error={errors.description} required>
                                    <textarea {...register('description')} rows={5} className={inputBase} placeholder="Write detailed course description..." />
                                </FormField>
                                <FormField label="Full Description (বাংলা)" error={errors.descriptionBn} optional>
                                    <textarea {...register('descriptionBn')} rows={5} className={inputBase} placeholder="বিস্তারিত বিবরণ লিখুন..." />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                        <SectionHeader title="Media & Video" icon={FiImage} />
                        <div className="p-5 space-y-4">
                            {/* Thumbnail Image - Upload + Link */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                    <FiImage size={14} className="text-slate-400" />
                                    Thumbnail Image
                                    <span className="text-[#021E14]">*</span>
                                </label>

                                {/* Toggle between Upload and Link */}
                                <div className="flex gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => setThumbnailMode('upload')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${thumbnailMode === 'upload'
                                            ? 'bg-[#021E14] border-[#021E14] text-[#01140D]'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        <FiUpload size={12} /> Upload Image
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setThumbnailMode('link')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${thumbnailMode === 'link'
                                            ? 'bg-[#021E14] border-[#021E14] text-[#01140D]'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        <FiLink size={12} /> Paste URL
                                    </button>
                                </div>

                                {thumbnailMode === 'upload' ? (
                                    <div>
                                        {thumbnailPreview ? (
                                            <div className="relative inline-block">
                                                <img src={thumbnailPreview} alt="Thumbnail" className="w-48 h-28 object-cover rounded-md border border-slate-200" />
                                                <button
                                                    type="button"
                                                    onClick={removeThumbnail}
                                                    className="absolute -top-2 -right-2 p-1 bg-[#021E14] text-white rounded-full shadow-sm hover:bg-[#021E14]"
                                                >
                                                    <FiX size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-slate-300 rounded-md p-6 text-center cursor-pointer hover:border-[#021E14] transition-all"
                                            >
                                                {uploadingThumbnail ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FiLoader className="animate-spin text-[#021E14]" size={24} />
                                                        <span className="text-sm text-slate-500">Uploading...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FiUpload className="text-slate-400" size={24} />
                                                        <p className="text-sm text-slate-500">
                                                            <span className="text-[#021E14] font-medium">Click to upload</span> thumbnail image
                                                        </p>
                                                        <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            {...register('thumbnail')}
                                            className={inputBase}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {thumbnailPreview && (
                                            <div className="mt-2 relative inline-block">
                                                <img src={thumbnailPreview} alt="Preview" className="w-48 h-28 object-cover rounded-md border border-slate-200" />
                                                <button
                                                    type="button"
                                                    onClick={removeThumbnail}
                                                    className="absolute -top-2 -right-2 p-1 bg-[#021E14] text-white rounded-full shadow-sm hover:bg-[#021E14]"
                                                >
                                                    <FiX size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {errors.thumbnail && <p className="text-[#021E14] text-xs">{errors.thumbnail.message}</p>}
                            </div>

                            <FormField label="Preview Video URL (YouTube/Vimeo)" icon={FiVideo} error={errors.previewVideo}>
                                <input {...register('previewVideo')} className={inputBase} placeholder="https://youtube.com/watch?v=..." />
                            </FormField>
                        </div>
                    </div>

                    {/* Dynamic Content Lists */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Features */}
                        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><FiCheck className="text-[#021E14]" size={14} /> Features</h3>
                                <button type="button" onClick={() => featuresFields.append('')} className="p-1 bg-[#021E14] text-white rounded-md hover:bg-emerald-700"><FiPlus size={14} /></button>
                            </div>
                            <div className="p-4 space-y-2">
                                {featuresFields.fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input {...register(`features.${index}`)} className={`${inputBase} py-2`} placeholder="Feature..." />
                                        <button type="button" onClick={() => featuresFields.remove(index)} className="text-[#021E14] hover:text-[#021E14]"><FiTrash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What You'll Learn */}
                        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><FiTarget className="text-[#021E14]" size={14} /> What You Will Learn</h3>
                                <button type="button" onClick={() => learningFields.append('')} className="p-1 bg-[#021E14] text-white rounded-md hover:bg-[#01140D]"><FiPlus size={14} /></button>
                            </div>
                            <div className="p-4 space-y-2">
                                {learningFields.fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input {...register(`whatYouWillLearn.${index}`)} className={`${inputBase} py-2`} placeholder="Outcome..." />
                                        <button type="button" onClick={() => learningFields.remove(index)} className="text-[#021E14] hover:text-[#021E14]"><FiTrash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Requirements / Roadmap */}
                        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><FiList className="text-[#021E14]" size={14} /> Roadmap</h3>
                                <button type="button" onClick={() => requirementsFields.append('')} className="p-1 bg-[#021E14] text-white rounded-md hover:bg-[#021E14]"><FiPlus size={14} /></button>
                            </div>
                            <div className="p-4 space-y-2">
                                {requirementsFields.fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input {...register(`requirements.${index}`)} className={`${inputBase} py-2`} placeholder="Requirement..." />
                                        <button type="button" onClick={() => requirementsFields.remove(index)} className="text-[#021E14] hover:text-[#021E14]"><FiTrash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tags & Audience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Tags */}
                        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><FiTag className="text-[#021E14]" size={14} /> Search Tags</h3>
                                <button type="button" onClick={() => tagsFields.append('')} className="p-1 bg-[#021E14] text-white rounded-md hover:bg-[#021E14]"><FiPlus size={14} /></button>
                            </div>
                            <div className="p-4 space-y-2">
                                {tagsFields.fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input {...register(`tags.${index}`)} className={`${inputBase} py-2`} placeholder="Tag..." />
                                        <button type="button" onClick={() => tagsFields.remove(index)} className="text-[#021E14] hover:text-[#021E14]"><FiTrash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><FiTarget className="text-[#021E14]" size={14} /> Target Audience</h3>
                                <button type="button" onClick={() => audienceFields.append('')} className="p-1 bg-[#021E14] text-white rounded-md hover:bg-[#021E14]"><FiPlus size={14} /></button>
                            </div>
                            <div className="p-4 space-y-2">
                                {audienceFields.fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <input {...register(`targetAudience.${index}`)} className={`${inputBase} py-2`} placeholder="Audience..." />
                                        <button type="button" onClick={() => audienceFields.remove(index)} className="text-[#021E14] hover:text-[#021E14]"><FiTrash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - 4 Cols */}
                <div className="lg:col-span-4 space-y-5">

                    {/* Pricing */}
                    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                        <SectionHeader title="Financial Settings" icon={FiDollarSign} />
                        <div className="p-5 space-y-4">
                            <FormField label="Regular Price (BDT)" required>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">৳</span>
                                    <input type="number" {...register('price')} className={`${inputBase} pl-8`} />
                                </div>
                            </FormField>
                            <FormField label="Discount Price" optional>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">৳</span>
                                    <input type="number" {...register('discountPrice')} className={`${inputBase} pl-8`} />
                                </div>
                            </FormField>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                        <SectionHeader title="Classification" icon={FiLayers} />
                        <div className="p-5 space-y-4">
                            <FormField label="Category" required error={errors.category}>
                                <select {...register('category')} className={selectBase}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Total Lessons (Auto)">
                                <input type="number" {...register('totalLessons')} className={`${inputBase} bg-slate-50 text-slate-500 cursor-not-allowed`} readOnly />
                                <p className="text-xs text-slate-400 mt-1">Auto-calculated from lessons</p>
                            </FormField>
                            <FormField label="Total Modules (Auto)">
                                <input type="number" {...register('totalModules')} className={`${inputBase} bg-slate-50 text-slate-500 cursor-not-allowed`} readOnly />
                                <p className="text-xs text-slate-400 mt-1">Auto-calculated from modules</p>
                            </FormField>
                            <FormField label="Course Type">
                                <select {...register('courseType')} className={selectBase}>
                                    <option value="recorded">Pre-recorded</option>
                                    <option value="online">Online Live</option>
                                    <option value="offline">Offline</option>
                                </select>
                            </FormField>
                            <FormField label="Difficulty Level">
                                <select {...register('level')} className={selectBase}>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </FormField>
                            <FormField label="Language">
                                <select {...register('language')} className={selectBase}>
                                    <option value="bangla">Bangla</option>
                                    <option value="english">English</option>
                                    <option value="both">Both</option>
                                </select>
                            </FormField>
                        </div>
                    </div>

                    {/* Status & SEO */}
                    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                        <SectionHeader title="Visibility & SEO" icon={FiSearch} />
                        <div className="p-5 space-y-4">
                            <FormField label="Slug (Auto)">
                                <input {...register('slug')} className={`${inputBase} bg-slate-50 text-slate-400`} readOnly />
                            </FormField>
                            <FormField label="Status">
                                <select {...register('status')} className={selectBase}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published (Live)</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </FormField>
                            <div className="flex flex-wrap gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded text-[#021E14]" />
                                    <span className="text-xs font-medium text-slate-600">Featured Course</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" {...register('isPopular')} className="w-4 h-4 rounded text-[#021E14]" />
                                    <span className="text-xs font-medium text-slate-600">Popular Course</span>
                                </label>
                            </div>
                            <hr className="my-2 border-slate-100" />
                            <FormField label="Meta Title">
                                <input {...register('metaTitle')} className={inputBase} maxLength={100} placeholder="SEO title..." />
                            </FormField>
                            <FormField label="Meta Description">
                                <textarea {...register('metaDescription')} rows={3} className={inputBase} maxLength={300} placeholder="SEO description..." />
                            </FormField>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseCreateTab;

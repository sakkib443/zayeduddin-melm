'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiArrowLeft, FiSave, FiLoader, FiTag, FiPlus, FiTrash2, 
  FiFileText, FiDollarSign, FiImage, FiCheck, FiLayers, 
  FiMonitor, FiEdit3, FiInfo, FiSettings, FiAlertCircle
} from 'react-icons/fi';
import Link from 'next/link';
import { API_URL } from '@/config/api';
import { useTheme } from '@/providers/ThemeProvider';

// Platform Options
const PLATFORM_OPTIONS = [
  'Figma', 'Photoshop', 'Illustrator', 'Adobe XD', 'Sketch', 'Canva',
  'HTML/CSS', 'React', 'Next.js', 'Tailwind CSS', 'WordPress',
  'Elementor', 'Bootstrap', 'InDesign', 'After Effects', 'Premiere Pro', 'Other'
];

// Design Template Type Options
const DESIGN_TYPE_OPTIONS = [
  'UI Kit', 'Website Template', 'Landing Page', 'Mobile App Design',
  'Social Media Graphic', 'Presentation', 'Logo', 'Vector Graphic',
  'Illustration', 'Print Template', 'Email Template', 'Icon Set',
  'Font', 'Mockup', 'Business Card', 'Flyer', 'Other'
];

const designTemplateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  platform: z.string().min(1, "Platform is required"),
  category: z.string().min(1, "Category is required"),
  templateType: z.string().min(1, "Template type is required"),
  accessType: z.enum(['free', 'paid']),
  version: z.string().min(1, "Version is required"),
  price: z.coerce.number().min(0),
  offerPrice: z.coerce.number().min(0).optional().nullable(),
  licenseType: z.enum(['regular', 'extended']),
  regularLicensePrice: z.coerce.number().min(0),
  extendedLicensePrice: z.coerce.number().min(0).optional().nullable(),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().optional(),
  features: z.array(z.string()).optional(),
  filesIncluded: z.array(z.string()).optional(),
  compatibility: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  previewUrl: z.string().optional(),
  downloadFile: z.string().min(1, "Download file URL is required"),
  documentationUrl: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'draft']),
  isFeatured: z.boolean().optional(),
});

export default function CreateDesignTemplatePage() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [serverErrors, setServerErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(designTemplateSchema),
    defaultValues: {
      status: 'approved',
      accessType: 'paid',
      licenseType: 'regular',
      version: '1.0.0',
      templateType: 'Website Template',
      platform: 'Figma',
      isFeatured: false,
      images: [''],
      features: [''],
      filesIncluded: [''],
      compatibility: [''],
      price: 0,
      regularLicensePrice: 0,
    }
  });

  const imageFields = useFieldArray({ control, name: 'images' });
  const featureFields = useFieldArray({ control, name: 'features' });
  const fileIncludedFields = useFieldArray({ control, name: 'filesIncluded' });
  const compatibilityFields = useFieldArray({ control, name: 'compatibility' });

  // Check if field has error (from zod or server)
  const hasError = (fieldName) => {
    return !!errors[fieldName] || !!serverErrors[fieldName];
  };

  // Get error message
  const getError = (fieldName) => {
    return errors[fieldName]?.message || serverErrors[fieldName] || '';
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      try {
        // First try with design-template type
        let res = await fetch(`${API_URL}/categories/admin/all?type=design-template`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        let data = await res.json();
        
        // If no design-template categories, try fetching all categories
        if (!data.data || data.data.length === 0) {
          res = await fetch(`${API_URL}/categories/admin/all`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          data = await res.json();
        }
        
        console.log('Categories loaded:', data.data);
        setCategories(data.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode && editId) {
      const token = localStorage.getItem('token');
      const fetchTemplate = async () => {
        setFetchingData(true);
        try {
          const res = await fetch(`${API_URL}/design-templates/${editId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.data) {
            const sw = data.data;
            reset({
              title: sw.title || '',
              platform: sw.platform || 'Figma',
              category: sw.category?._id || sw.category || '',
              templateType: sw.templateType || 'Website Template',
              accessType: sw.accessType || 'paid',
              version: sw.version || '1.0.0',
              price: sw.price || 0,
              offerPrice: sw.offerPrice || null,
              licenseType: sw.licenseType || 'regular',
              regularLicensePrice: sw.regularLicensePrice || 0,
              extendedLicensePrice: sw.extendedLicensePrice || null,
              description: sw.description || '',
              longDescription: sw.longDescription || '',
              features: sw.features?.length ? sw.features : [''],
              filesIncluded: sw.filesIncluded?.length ? sw.filesIncluded : [''],
              compatibility: sw.compatibility?.length ? sw.compatibility : [''],
              images: sw.images?.length ? sw.images : [''],
              previewUrl: sw.previewUrl || '',
              downloadFile: sw.downloadFile || '',
              documentationUrl: sw.documentationUrl || '',
              status: sw.status || 'approved',
              isFeatured: sw.isFeatured || false,
            });
          }
        } catch (err) {
          console.error('Failed to fetch template:', err);
        } finally {
          setFetchingData(false);
        }
      };
      fetchTemplate();
    }
  }, [isEditMode, editId, reset]);

  const onSubmit = async (values) => {
    setLoading(true);
    setServerErrors({});
    setGeneralError('');

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const cleanArray = (arr) => arr?.filter(item => item && item.trim() !== '') || [];

    const payload = {
      ...values,
      author: user._id,
      features: cleanArray(values.features),
      filesIncluded: cleanArray(values.filesIncluded),
      compatibility: cleanArray(values.compatibility),
      images: cleanArray(values.images),
      offerPrice: (values.offerPrice === 0 || !values.offerPrice) ? null : values.offerPrice,
      extendedLicensePrice: (values.extendedLicensePrice === 0 || !values.extendedLicensePrice) ? null : values.extendedLicensePrice,
    };

    try {
      const url = isEditMode
        ? `${API_URL}/design-templates/admin/managed/${editId}`
        : `${API_URL}/design-templates/admin`;

      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(isEditMode ? 'Template updated successfully!' : 'Template created successfully!');
        router.push('/dashboard/admin/design-template');
      } else {
        // Parse server validation errors
        if (result.errorSources && Array.isArray(result.errorSources)) {
          const newErrors = {};
          result.errorSources.forEach(err => {
            if (err.path) {
              newErrors[err.path] = err.message;
            }
          });
          setServerErrors(newErrors);
          setGeneralError(`Validation Error: Please fix the highlighted fields below`);
        } else if (result.message) {
          setGeneralError(result.message);
        } else {
          setGeneralError('An unknown error occurred');
        }
        console.error('Server error:', result);
      }
    } catch (error) {
      setGeneralError('Network error - please check your connection');
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Style functions with error state
  const inputStyle = (fieldName) => {
    const error = hasError(fieldName);
    return `w-full px-3 py-2 rounded-md border ${error 
      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-500' 
      : isDark 
        ? 'border-slate-700 bg-slate-900 text-white' 
        : 'border-gray-200 bg-white text-gray-800'
    } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-colors`;
  };

  const labelStyle = (fieldName) => {
    const error = hasError(fieldName);
    return `block text-xs font-medium ${error ? 'text-red-500' : isDark ? 'text-slate-400' : 'text-gray-600'} mb-1.5`;
  };

  const cardClass = `${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-5 rounded-md border`;

  if (fetchingData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-blue-500 mx-auto mb-3" size={32} />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading template data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardClass}`}>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/design-template" className={`p-2 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-colors`}>
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
              {isEditMode ? <FiEdit3 className="text-blue-500" size={18} /> : <FiLayers className="text-blue-500" size={18} />}
              {isEditMode ? 'Edit Template' : 'Create Template'}
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {isEditMode ? `Editing: ${editId}` : 'Add a new design template'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/admin/design-template')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />}
            {loading ? 'Saving...' : isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {generalError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-start gap-3">
          <FiAlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{generalError}</p>
            {Object.keys(serverErrors).length > 0 && (
              <ul className="mt-2 text-xs text-red-600 dark:text-red-300 space-y-1">
                {Object.entries(serverErrors).map(([field, message]) => (
                  <li key={field}>• <strong>{field}:</strong> {message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiInfo size={16} className="text-blue-500" /> Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelStyle('title')}>Template Title *</label>
                <input
                  {...register('title')}
                  placeholder="e.g. Modern E-commerce UI Kit"
                  className={inputStyle('title')}
                />
                {(errors.title || serverErrors.title) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('title')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle('platform')}>Platform *</label>
                  <select {...register('platform')} className={inputStyle('platform')}>
                    {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {(errors.platform || serverErrors.platform) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('platform')}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelStyle('category')}>Category *</label>
                  <select {...register('category')} className={inputStyle('category')}>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  {(errors.category || serverErrors.category) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('category')}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle('templateType')}>Template Type *</label>
                  <select {...register('templateType')} className={inputStyle('templateType')}>
                    {DESIGN_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {(errors.templateType || serverErrors.templateType) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('templateType')}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelStyle('version')}>Version *</label>
                  <input {...register('version')} className={inputStyle('version')} placeholder="1.0.0" />
                  {(errors.version || serverErrors.version) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('version')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiFileText size={16} className="text-blue-500" /> Description
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelStyle('description')}>Short Description *</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={`${inputStyle('description')} resize-none`}
                  placeholder="Brief description of the template..."
                />
                {(errors.description || serverErrors.description) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('description')}
                  </p>
                )}
              </div>
              <div>
                <label className={labelStyle('longDescription')}>Long Description</label>
                <textarea
                  {...register('longDescription')}
                  rows={6}
                  className={`${inputStyle('longDescription')} resize-none`}
                  placeholder="Detailed overview..."
                />
              </div>
            </div>
          </div>

          {/* Features & Files */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features */}
            <div className={cardClass}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
                  <FiCheck size={16} className="text-emerald-500" /> Features
                </h2>
                <button type="button" onClick={() => featureFields.append('')} className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  <FiPlus size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {featureFields.fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2">
                    <input {...register(`features.${idx}`)} className={inputStyle('features')} placeholder="Feature item" />
                    <button type="button" onClick={() => featureFields.remove(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Files Included */}
            <div className={cardClass}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
                  <FiLayers size={16} className="text-violet-500" /> Files Included
                </h2>
                <button type="button" onClick={() => fileIncludedFields.append('')} className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  <FiPlus size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {fileIncludedFields.fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2">
                    <input {...register(`filesIncluded.${idx}`)} className={inputStyle('filesIncluded')} placeholder=".fig, .psd, etc." />
                    <button type="button" onClick={() => fileIncludedFields.remove(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
                <FiMonitor size={16} className="text-cyan-500" /> Compatibility
              </h2>
              <button type="button" onClick={() => compatibilityFields.append('')} className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                <FiPlus size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {compatibilityFields.fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2">
                  <input {...register(`compatibility.${idx}`)} className={inputStyle('compatibility')} placeholder="Figma 2024+" />
                  <button type="button" onClick={() => compatibilityFields.remove(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Pricing & Media */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiDollarSign size={16} className="text-emerald-500" /> Pricing
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelStyle('accessType')}>Access Type</label>
                <select
                  {...register('accessType', {
                    onChange: (e) => {
                      if (e.target.value === 'free') {
                        setValue('price', 0);
                        setValue('offerPrice', null);
                      }
                    }
                  })}
                  className={inputStyle('accessType')}
                >
                  <option value="paid">Paid</option>
                  <option value="free">Free</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle('price')}>Price (৳) *</label>
                  <input
                    type="number"
                    {...register('price')}
                    disabled={watch('accessType') === 'free'}
                    className={inputStyle('price')}
                    placeholder="0"
                  />
                  {(errors.price || serverErrors.price) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('price')}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelStyle('offerPrice')}>Offer Price (৳)</label>
                  <input
                    type="number"
                    {...register('offerPrice')}
                    disabled={watch('accessType') === 'free'}
                    className={inputStyle('offerPrice')}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-200'} pt-4`}>
                <label className={labelStyle('licenseType')}>License Type</label>
                <select {...register('licenseType')} className={inputStyle('licenseType')}>
                  <option value="regular">Regular License</option>
                  <option value="extended">Extended License</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle('regularLicensePrice')}>Regular (৳) *</label>
                  <input type="number" {...register('regularLicensePrice')} className={inputStyle('regularLicensePrice')} placeholder="0" />
                  {(errors.regularLicensePrice || serverErrors.regularLicensePrice) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('regularLicensePrice')}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelStyle('extendedLicensePrice')}>Extended (৳)</label>
                  <input type="number" {...register('extendedLicensePrice')} className={inputStyle('extendedLicensePrice')} placeholder="0" />
                </div>
              </div>

              <label className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${isDark ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}>
                <input type="checkbox" {...register('isFeatured')} className="hidden" />
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${watch('isFeatured') ? 'bg-blue-500 border-blue-500' : isDark ? 'border-slate-600' : 'border-gray-300'}`}>
                  {watch('isFeatured') && <FiCheck className="text-white" size={12} />}
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Featured Template</span>
              </label>
            </div>
          </div>

          {/* Media */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiImage size={16} className="text-rose-500" /> Media & Links
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={labelStyle('images')}>Image URLs *</label>
                  <button type="button" onClick={() => imageFields.append('')} className="text-xs text-blue-500 hover:underline">
                    <FiPlus className="inline mr-1" size={12} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {imageFields.fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2">
                      <input {...register(`images.${idx}`)} className={inputStyle('images')} placeholder="https://..." />
                      {imageFields.fields.length > 1 && (
                        <button type="button" onClick={() => imageFields.remove(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {(errors.images || serverErrors.images) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('images')}
                  </p>
                )}
              </div>

              <div>
                <label className={labelStyle('previewUrl')}>Preview URL</label>
                <input {...register('previewUrl')} className={inputStyle('previewUrl')} placeholder="https://..." />
              </div>

              <div>
                <label className={labelStyle('downloadFile')}>Download File *</label>
                <input {...register('downloadFile')} className={inputStyle('downloadFile')} placeholder="Cloud storage link..." />
                {(errors.downloadFile || serverErrors.downloadFile) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('downloadFile')}
                  </p>
                )}
              </div>

              <div>
                <label className={labelStyle('documentationUrl')}>Documentation URL</label>
                <input {...register('documentationUrl')} className={inputStyle('documentationUrl')} placeholder="Docs link..." />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiSettings size={16} className="text-amber-500" /> Status
            </h2>
            <div>
              <label className={labelStyle('status')}>Listing Status</label>
              <select {...register('status')} className={inputStyle('status')}>
                <option value="approved">Live / Approved</option>
                <option value="pending">Pending Review</option>
                <option value="draft">Draft</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-3`}>
              Templates marked as Live will be visible to customers.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

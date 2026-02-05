'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiArrowLeft, FiSave, FiLoader, FiTag, FiPlus, FiTrash2,
  FiFileText, FiDollarSign, FiImage, FiCheck, FiLayers,
  FiMonitor, FiEdit3, FiInfo, FiSettings, FiAlertCircle,
  FiBold, FiItalic, FiList, FiLink, FiCode, FiAlignLeft,
  FiAlignCenter, FiAlignRight, FiType, FiEye
} from 'react-icons/fi';
import Link from 'next/link';
import { API_URL } from '@/config/api';
import { useTheme } from '@/providers/ThemeProvider';

// Design Tools Options (Multi-selection)
const DESIGN_TOOLS_OPTIONS = [
  'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe XD', 'Sketch', 'Canva',
  'Adobe InDesign', 'CorelDRAW', 'Affinity Designer', 'GIMP', 'Procreate',
  'Blender', 'Cinema 4D', 'After Effects', 'Premiere Pro', 'Other'
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
  category: z.string().optional().nullable(),
  designTools: z.array(z.string()).optional(),
  templateType: z.string().optional().nullable(),
  accessType: z.enum(['free', 'paid']).optional(),
  price: z.coerce.number().min(0).optional().nullable(),
  offerPrice: z.coerce.number().min(0).optional().nullable(),
  licenseType: z.enum(['regular', 'extended']).optional(),
  regularLicensePrice: z.coerce.number().min(0).optional().nullable(),
  extendedLicensePrice: z.coerce.number().min(0).optional().nullable(),
  description: z.string().optional().nullable(),
  longDescription: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
  previewUrl: z.string().optional().nullable(),
  downloadFile: z.string().optional().nullable(),
  documentationUrl: z.string().optional().nullable(),
  status: z.enum(['pending', 'approved', 'rejected', 'draft']).optional(),
  isFeatured: z.boolean().optional(),
});

function CreateDesignTemplateContent() {
  const { isDark } = useTheme();
  const contentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [categories, setCategories] = useState([]);
  const [serverErrors, setServerErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
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
      templateType: 'Website Template',
      designTools: [],
      isFeatured: false,
      images: [''],
      price: 0,
      regularLicensePrice: 0,
    }
  });

  const imageFields = useFieldArray({ control, name: 'images' });
  const [selectedTools, setSelectedTools] = useState([]);

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
            setSelectedTools(sw.designTools || []);
            reset({
              title: sw.title || '',
              category: sw.category?._id || sw.category || '',
              designTools: sw.designTools || [],
              templateType: sw.templateType || 'Website Template',
              accessType: sw.accessType || 'paid',
              price: sw.price || 0,
              offerPrice: sw.offerPrice || null,
              licenseType: sw.licenseType || 'regular',
              regularLicensePrice: sw.regularLicensePrice || 0,
              extendedLicensePrice: sw.extendedLicensePrice || null,
              description: sw.description || '',
              longDescription: sw.longDescription || '',
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

  // Sync longDescription to contentRef when data changes or preview mode ends
  const longDescValue = watch('longDescription');

  useEffect(() => {
    // Only update contentRef when NOT in preview mode and when the element exists
    if (!previewMode && contentRef.current) {
      // Only update if the values differ to avoid cursor jump issues
      if (contentRef.current.innerHTML !== longDescValue) {
        contentRef.current.innerHTML = longDescValue || '';
      }
    }
  }, [longDescValue, previewMode]);

  // Editor formatting functions
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    // Small delay to ensure DOM is updated
    setTimeout(() => {
      if (contentRef.current) {
        setValue('longDescription', contentRef.current.innerHTML);
      }
    }, 0);
  };

  const insertHeading = (level) => {
    document.execCommand('formatBlock', false, `h${level}`);
    setTimeout(() => {
      if (contentRef.current) {
        setValue('longDescription', contentRef.current.innerHTML);
      }
    }, 0);
  };


  const onSubmit = async (values) => {
    setLoading(true);
    setServerErrors({});
    setGeneralError('');

    const token = localStorage.getItem('token');

    const cleanArray = (arr) => arr?.filter(item => item && item.trim() !== '') || [];

    // Form data cleaning - remove empty/null values to let backend defaults take over
    const payload = {
      ...values,
      designTools: selectedTools,
      images: cleanArray(values.images),
    };

    // Remove empty strings, nulls, and undefined from payload
    Object.keys(payload).forEach(key => {
      if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    // Handle specific cases for prices
    if (values.offerPrice === 0 || !values.offerPrice) delete payload.offerPrice;
    if (values.extendedLicensePrice === 0 || !values.extendedLicensePrice) delete payload.extendedLicensePrice;

    console.log('Final Prepared Payload:', payload);


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
        console.error('Submission failed:', result);

        if (result.errorSources && Array.isArray(result.errorSources)) {
          const newErrors = {};
          result.errorSources.forEach(err => {
            if (err.path) {
              const path = err.path.split('.').pop(); // Handle body.title etc.
              newErrors[path] = err.message;
            }
          });
          setServerErrors(newErrors);
          setGeneralError(`Validation Error: Please fix the fields below`);
        } else if (result.message) {
          setGeneralError(result.message);
        } else {
          setGeneralError(JSON.stringify(result));
        }
      }
    } catch (error) {
      console.error('Request failed:', error);
      setGeneralError(`Connection Error: ${error.message}`);
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
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${loading ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'}`}
          >
            {loading ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />}
            {isEditMode ? 'Update Template' : 'Publish Template'}
          </button>
        </div>
      </div>

      {generalError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-md flex items-center gap-3 text-red-600 dark:text-red-400 shadow-sm">
          <FiAlertCircle size={20} className="shrink-0" />
          <div>
            <p className="text-sm font-medium">{generalError}</p>
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
                <label className={labelStyle('title')} style={{ fontSize: '11px' }}>Template Title *</label>
                <input
                  {...register('title')}
                  placeholder="e.g. Modern E-commerce UI Kit"
                  className={`${inputStyle('title')} placeholder:text-gray-300 dark:placeholder:text-slate-600`}
                />
                {(errors.title || serverErrors.title) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('title')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle('category')} style={{ fontSize: '11px' }}>Category *</label>
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
                <div>
                  <label className={labelStyle('templateType')} style={{ fontSize: '11px' }}>Template Type *</label>
                  <select {...register('templateType')} className={inputStyle('templateType')}>
                    {DESIGN_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {(errors.templateType || serverErrors.templateType) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('templateType')}
                    </p>
                  )}
                </div>
              </div>

              {/* Design Tools Multi-Selection */}
              <div>
                <label className={`${labelStyle('designTools')}`} style={{ fontSize: '11px' }}>Design Tools</label>
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 p-3 rounded-md border ${isDark ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-gray-50'}`}>
                  {DESIGN_TOOLS_OPTIONS.map(tool => (
                    <label key={tool} className={`flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded ${selectedTools.includes(tool) ? (isDark ? 'bg-blue-500/20' : 'bg-blue-50') : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedTools.includes(tool)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTools([...selectedTools, tool]);
                          } else {
                            setSelectedTools(selectedTools.filter(t => t !== tool));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className={isDark ? 'text-slate-300' : 'text-gray-700'}>{tool}</span>
                    </label>
                  ))}
                </div>
                {(errors.designTools || serverErrors.designTools) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('designTools')}
                  </p>
                )}
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
                <label className={labelStyle('description')} style={{ fontSize: '11px' }}>Short Description *</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className={`${inputStyle('description')} resize-none placeholder:text-gray-300 dark:placeholder:text-slate-600`}
                  placeholder="Brief description of the template..."
                />
                {(errors.description || serverErrors.description) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('description')}
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelStyle('longDescription')} style={{ fontSize: '11px' }}>Long Description (Rich Text)</label>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${previewMode
                      ? 'bg-blue-500 text-white'
                      : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {previewMode ? <FiEdit3 size={12} /> : <FiEye size={12} />}
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                </div>

                <div className={`rounded-md border overflow-hidden ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>
                  {/* Toolbar */}
                  <div className={`px-2 py-1.5 border-b flex flex-wrap gap-0.5 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-100 bg-gray-50'}`}>
                    <button type="button" onClick={() => formatText('bold')} className={`p-1.5 rounded hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`} title="Bold"><FiBold size={14} /></button>
                    <button type="button" onClick={() => formatText('italic')} className={`p-1.5 rounded hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`} title="Italic"><FiItalic size={14} /></button>
                    <div className={`w-px h-4 mx-1.5 self-center ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    <button type="button" onClick={() => insertHeading(2)} className={`px-1.5 py-1 rounded text-[10px] font-bold hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>H2</button>
                    <button type="button" onClick={() => insertHeading(3)} className={`px-1.5 py-1 rounded text-[10px] font-bold hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>H3</button>
                    <div className={`w-px h-4 mx-1.5 self-center ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    <button type="button" onClick={() => formatText('insertUnorderedList')} className={`p-1.5 rounded hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`} title="Bullet List"><FiList size={14} /></button>
                    <button type="button" onClick={() => formatText('justifyLeft')} className={`p-1.5 rounded hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`} title="Align Left"><FiAlignLeft size={14} /></button>
                    <button type="button" onClick={() => formatText('justifyCenter')} className={`p-1.5 rounded hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`} title="Align Center"><FiAlignCenter size={14} /></button>
                    <button type="button" onClick={() => {
                      const url = prompt('Enter link URL:');
                      if (url) formatText('createLink', url);
                    }} className={`p-1.5 rounded hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`} title="Insert Link"><FiLink size={14} /></button>
                    <div className={`w-px h-4 mx-1.5 self-center ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    <button type="button" onClick={() => {
                      const imageUrl = prompt('Enter image URL:');
                      if (imageUrl) {
                        document.execCommand('insertHTML', false, `<img src="${imageUrl}" alt="Content Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`);
                        if (contentRef.current) {
                          setValue('longDescription', contentRef.current.innerHTML);
                        }
                      }
                    }} className={`p-1.5 rounded hover:bg-blue-500 hover:text-white transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`} title="Insert Image"><FiImage size={14} /></button>
                  </div>

                  {previewMode ? (
                    <div
                      className={`p-4 min-h-[250px] prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}
                      dangerouslySetInnerHTML={{ __html: watch('longDescription') }}
                    />
                  ) : (
                    <div
                      ref={contentRef}
                      contentEditable
                      onInput={(e) => setValue('longDescription', e.currentTarget.innerHTML)}
                      className={`p-4 min-h-[250px] focus:outline-none text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}
                      style={{ lineHeight: 1.6 }}
                    />
                  )}
                </div>
              </div>
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
                <label className={labelStyle('accessType')} style={{ fontSize: '11px' }}>Access Type</label>
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
                {(errors.accessType || serverErrors.accessType) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('accessType')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle('price')} style={{ fontSize: '11px' }}>Price (৳) *</label>
                  <input
                    type="number"
                    {...register('price')}
                    disabled={watch('accessType') === 'free'}
                    className={`${inputStyle('price')} placeholder:text-gray-300 dark:placeholder:text-slate-600`}
                    placeholder="0"
                  />
                  {(errors.price || serverErrors.price) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('price')}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelStyle('offerPrice')} style={{ fontSize: '11px' }}>Offer Price (৳)</label>
                  <input
                    type="number"
                    {...register('offerPrice')}
                    disabled={watch('accessType') === 'free'}
                    className={`${inputStyle('offerPrice')} placeholder:text-gray-300 dark:placeholder:text-slate-600`}
                    placeholder="0"
                  />
                  {(errors.offerPrice || serverErrors.offerPrice) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('offerPrice')}
                    </p>
                  )}
                </div>
              </div>

              <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-200'} pt-4`}>
                <label className={labelStyle('licenseType')} style={{ fontSize: '11px' }}>License Type</label>
                <select {...register('licenseType')} className={inputStyle('licenseType')}>
                  <option value="regular">Regular License</option>
                  <option value="extended">Extended License</option>
                </select>
                {(errors.licenseType || serverErrors.licenseType) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('licenseType')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle('regularLicensePrice')} style={{ fontSize: '11px' }}>Regular (৳) *</label>
                  <input type="number" {...register('regularLicensePrice')} className={`${inputStyle('regularLicensePrice')} placeholder:text-gray-300 dark:placeholder:text-slate-600`} placeholder="0" />
                  {(errors.regularLicensePrice || serverErrors.regularLicensePrice) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('regularLicensePrice')}
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelStyle('extendedLicensePrice')} style={{ fontSize: '11px' }}>Extended (৳)</label>
                  <input type="number" {...register('extendedLicensePrice')} className={`${inputStyle('extendedLicensePrice')} placeholder:text-gray-300 dark:placeholder:text-slate-600`} placeholder="0" />
                  {(errors.extendedLicensePrice || serverErrors.extendedLicensePrice) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle size={12} /> {getError('extendedLicensePrice')}
                    </p>
                  )}
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
                  <label className={labelStyle('images')} style={{ fontSize: '11px' }}>Image URLs *</label>
                  <button type="button" onClick={() => imageFields.append('')} className="text-xs text-blue-500 hover:underline">
                    <FiPlus className="inline mr-1" size={12} /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {imageFields.fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2">
                      <input {...register(`images.${idx}`)} className={`${inputStyle('images')} placeholder:text-gray-300 dark:placeholder:text-slate-600`} placeholder="https://..." />
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
                <label className={labelStyle('previewUrl')} style={{ fontSize: '11px' }}>Preview URL</label>
                <input {...register('previewUrl')} className={`${inputStyle('previewUrl')} placeholder:text-gray-300 dark:placeholder:text-slate-600`} placeholder="https://..." />
                {(errors.previewUrl || serverErrors.previewUrl) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('previewUrl')}
                  </p>
                )}
              </div>

              <div>
                <label className={labelStyle('downloadFile')} style={{ fontSize: '11px' }}>Download File *</label>
                <input {...register('downloadFile')} className={`${inputStyle('downloadFile')} placeholder:text-gray-300 dark:placeholder:text-slate-600`} placeholder="Cloud storage link..." />
                {(errors.downloadFile || serverErrors.downloadFile) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('downloadFile')}
                  </p>
                )}
              </div>

              <div>
                <label className={labelStyle('documentationUrl')} style={{ fontSize: '11px' }}>Documentation URL</label>
                <input {...register('documentationUrl')} className={`${inputStyle('documentationUrl')} placeholder:text-gray-300 dark:placeholder:text-slate-600`} placeholder="Docs link..." />
                {(errors.documentationUrl || serverErrors.documentationUrl) && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} /> {getError('documentationUrl')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiSettings size={16} className="text-amber-500" /> Status
            </h2>
            <div>
              <label className={labelStyle('status')} style={{ fontSize: '11px' }}>Listing Status</label>
              <select {...register('status')} className={inputStyle('status')}>
                <option value="approved">Live / Approved</option>
                <option value="pending">Pending Review</option>
                <option value="draft">Draft</option>
                <option value="rejected">Rejected</option>
              </select>
              {(errors.status || serverErrors.status) && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {getError('status')}
                </p>
              )}
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

export default function CreateDesignTemplatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="animate-spin text-blue-600" size={32} />
          <p className="text-gray-500 font-medium animate-pulse">Loading Editor...</p>
        </div>
      </div>
    }>
      <CreateDesignTemplateContent />
    </Suspense>
  );
}

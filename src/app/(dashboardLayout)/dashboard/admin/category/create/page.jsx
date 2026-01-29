'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiSave, FiLoader, FiImage, FiGlobe, FiInfo, FiBook, FiLayout, FiCheck, FiFolder, FiChevronRight, FiLayers, FiAlertCircle } from 'react-icons/fi';
import Link from 'next/link';
import { API_URL } from '@/config/api';
import { useTheme } from '@/providers/ThemeProvider';

const CreateCategory = () => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    status: 'active',
    type: 'course',
    isParent: true,
    parentCategory: null
  });
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch parent categories
  useEffect(() => {
    const fetchParents = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/categories/admin/parents`, {
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

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      const slugified = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: slugified }));
    }
  }, [formData.name]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    // Prepare payload
    const payload = {
      ...formData,
      parentCategory: formData.isParent ? null : formData.parentCategory
    };

    try {
      const response = await fetch(`${API_URL}/categories/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Category created successfully!');
        router.push('/dashboard/admin/category');
      } else {
        setError(result.message || 'Failed to create category');
      }
    } catch (error) {
      setError('Network error - check backend connectivity');
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'course', label: 'Course', icon: FiBook, color: 'blue' },
    { value: 'website', label: 'Website', icon: FiLayout, color: 'emerald' },
    { value: 'design-template', label: 'Design Template', icon: FiLayers, color: 'violet' },
  ];

  // Filter parent categories by selected type
  const filteredParents = parentCategories.filter(p => p.type === formData.type);

  const inputClass = `w-full px-3 py-2.5 rounded-md border ${isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-gray-200 bg-white text-gray-800'} focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-colors`;
  const labelClass = `block text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1.5`;
  const cardClass = `${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} p-5 rounded-md border`;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardClass}`}>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/admin/category" className={`p-2 rounded-md ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-colors`}>
            <FiArrowLeft size={18} />
          </Link>
          <div>
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
              <FiFolder className="text-blue-500" size={18} />
              Create Category
            </h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Add a new category to organize your products
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/admin/category')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || (!formData.isParent && !formData.parentCategory) || !formData.name}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FiLoader className="animate-spin" size={16} /> : <FiSave size={16} />}
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-start gap-3">
          <FiAlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Level */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiInfo size={16} className="text-blue-500" /> Category Level
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isParent: true, parentCategory: null })}
                className={`p-4 rounded-md border-2 transition-all flex flex-col items-center gap-2 ${formData.isParent
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                  : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${formData.isParent ? 'bg-blue-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                  <FiFolder size={20} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${formData.isParent ? 'text-blue-600 dark:text-blue-400' : isDark ? 'text-slate-300' : 'text-gray-700'}`}>Root Category</p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Main parent category</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, isParent: false })}
                className={`p-4 rounded-md border-2 transition-all flex flex-col items-center gap-2 ${!formData.isParent
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${!formData.isParent ? 'bg-emerald-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                  <FiChevronRight size={20} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${!formData.isParent ? 'text-emerald-600 dark:text-emerald-400' : isDark ? 'text-slate-300' : 'text-gray-700'}`}>Sub Category</p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Child of a parent</p>
                </div>
              </button>
            </div>
          </div>

          {/* Category Type */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Category Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: option.value, parentCategory: null })}
                  className={`p-3 rounded-md border-2 transition-all flex flex-col items-center gap-2 ${formData.type === option.value
                    ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-500/10`
                    : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <option.icon size={20} className={formData.type === option.value ? `text-${option.color}-500` : isDark ? 'text-slate-400' : 'text-gray-500'} />
                  <span className={`text-xs font-medium ${formData.type === option.value ? `text-${option.color}-600 dark:text-${option.color}-400` : isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Parent Category Selection (for sub-categories) */}
          {!formData.isParent && (
            <div className={cardClass}>
              <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                <FiLayers size={16} className="text-violet-500" /> Select Parent Category
              </h2>
              {filteredParents.length === 0 ? (
                <div className={`p-4 rounded-md ${isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border flex items-center gap-3`}>
                  <FiInfo className="text-amber-500" size={18} />
                  <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                    No parent categories found for "{formData.type}". Create a root category first.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredParents.map(parent => (
                    <button
                      key={parent._id}
                      type="button"
                      onClick={() => setFormData({ ...formData, parentCategory: parent._id })}
                      className={`p-3 rounded-md border-2 transition-all flex items-center gap-3 text-left ${formData.parentCategory === parent._id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                        : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center overflow-hidden ${formData.parentCategory === parent._id ? 'bg-blue-500 text-white' : isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
                        {parent.image ? <img src={parent.image} className="w-full h-full object-cover" alt="" /> : <FiFolder size={18} />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${formData.parentCategory === parent._id ? 'text-blue-600 dark:text-blue-400' : isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                          {parent.name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>/{parent.slug}</p>
                      </div>
                      {formData.parentCategory === parent._id && (
                        <FiCheck className="ml-auto text-blue-500" size={18} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Basic Info */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Web Development"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>URL Slug (Auto-generated)</label>
                  <div className="relative">
                    <FiGlobe className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} size={14} />
                    <input
                      type="text"
                      readOnly
                      value={formData.slug}
                      className={`${inputClass} pl-9 bg-gray-50 dark:bg-slate-950`}
                      placeholder="auto-generated"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Status */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>Status</h2>
            <div className={`p-1 rounded-md ${isDark ? 'bg-slate-900' : 'bg-gray-100'} flex gap-1`}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'active' })}
                className={`flex-1 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${formData.status === 'active' 
                  ? 'bg-emerald-500 text-white' 
                  : isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {formData.status === 'active' && <FiCheck size={12} />} Active
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'inactive' })}
                className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${formData.status === 'inactive' 
                  ? isDark ? 'bg-slate-700 text-white' : 'bg-gray-600 text-white'
                  : isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Inactive
              </button>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'} mt-2`}>
              Active categories are visible to users.
            </p>
          </div>

          {/* Image */}
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
              <FiImage size={16} className="text-rose-500" /> Image
            </h2>
            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className={inputClass}
              />
            </div>
            {formData.image && (
              <div className="mt-3">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-slate-700"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          {/* Summary */}
          <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'} p-4 rounded-md border`}>
            <h3 className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-3`}>Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-500' : 'text-gray-500'}>Level:</span>
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{formData.isParent ? 'Root' : 'Sub-category'}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-500' : 'text-gray-500'}>Type:</span>
                <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{formData.type}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-500' : 'text-gray-500'}>Status:</span>
                <span className={`font-medium ${formData.status === 'active' ? 'text-emerald-500' : isDark ? 'text-slate-400' : 'text-gray-500'}`}>{formData.status}</span>
              </div>
              {!formData.isParent && formData.parentCategory && (
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-500' : 'text-gray-500'}>Parent:</span>
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    {filteredParents.find(p => p._id === formData.parentCategory)?.name || '-'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;

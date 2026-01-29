'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiArrowLeft, FiSave, FiLoader, FiImage, FiBookOpen,
  FiPlus, FiTrash2, FiDollarSign, FiVideo, FiTag
} from 'react-icons/fi';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

const courseValidationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  titleBn: z.string().min(3, "Bengali title must be at least 3 characters").optional().or(z.literal('')),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  descriptionBn: z.string().min(50, "Bengali description must be at least 50 characters").optional().or(z.literal('')),
  shortDescription: z.string().max(500).optional().or(z.literal('')),
  shortDescriptionBn: z.string().max(500).optional().or(z.literal('')),
  thumbnail: z.string().url("Must be a valid URL"),
  bannerImage: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  discountPrice: z.coerce.number().min(0).optional().nullable(),
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

export default function EditCoursePage() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(courseValidationSchema),
    defaultValues: {
      courseType: 'recorded',
      level: 'beginner',
      language: 'bangla',
      status: 'draft',
      features: [''],
      requirements: [''],
      whatYouWillLearn: [''],
      targetAudience: [''],
      tags: [''],
      isFeatured: false,
      isPopular: false,
    }
  });

  const featuresFields = useFieldArray({ control, name: 'features' });
  const requirementsFields = useFieldArray({ control, name: 'requirements' });
  const learningFields = useFieldArray({ control, name: 'whatYouWillLearn' });
  const audienceFields = useFieldArray({ control, name: 'targetAudience' });
  const tagsFields = useFieldArray({ control, name: 'tags' });

  const fetchData = useCallback(async () => {
    const BASE_URL = API_BASE_URL;
    const token = localStorage.getItem('token');
    try {
      setFetching(true);
      const [catRes, courseRes] = await Promise.all([
        fetch(`${BASE_URL}/categories`),
        fetch(`${BASE_URL}/courses/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      const catData = await catRes.json();
      const courseResult = await courseRes.json();

      setCategories(catData.data || []);
      const course = courseResult.data;

      if (course) {
        setCourseData(course);
        reset({
          ...course,
          category: course.category?._id || course.category,
          features: course.features?.length ? course.features : [''],
          requirements: course.requirements?.length ? course.requirements : [''],
          whatYouWillLearn: course.whatYouWillLearn?.length ? course.whatYouWillLearn : [''],
          targetAudience: course.targetAudience?.length ? course.targetAudience : [''],
          tags: course.tags?.length ? course.tags : [''],
          previewVideo: course.previewVideo || '',
          bannerImage: course.bannerImage || '',
          shortDescription: course.shortDescription || '',
          shortDescriptionBn: course.shortDescriptionBn || '',
          metaTitle: course.metaTitle || '',
          metaDescription: course.metaDescription || '',
        });
      }
    } catch (err) { console.error(err); }
    finally { setFetching(false); }
  }, [id, reset]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onSubmit = async (values) => {
    setLoading(true);
    const BASE_URL = API_BASE_URL;
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${BASE_URL}/courses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...values,
          category: values.category?._id || values.category
        }),
      });

      if (response.ok) {
        alert('Course updated successfully! ✅');
        router.push('/dashboard/admin/course');
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) { alert('Network error'); }
    finally { setLoading(false); }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${isDark
    ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-emerald-500 placeholder:text-slate-600'
    : 'bg-white border-slate-200 text-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 placeholder:text-slate-400'
    }`;
  const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;
  const cardClass = `p-6 rounded-2xl border ${isDark ? 'bg-black/40 border-slate-800 shadow-none' : 'bg-white border-slate-200/60 shadow-sm'} space-y-5`;

  if (fetching) return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <FiLoader className="animate-spin text-emerald-500" size={40} />
        <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading course data...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header - Identical to Website Edit */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border ${isDark ? 'bg-black/40 border-slate-800 shadow-none' : 'bg-white border-slate-200/60 shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/course" className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}>
            <FiArrowLeft size={18} />
          </Link>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-red-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <FiBookOpen className="text-white text-lg" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Edit Course</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{courseData?.title || 'Loading...'}</p>
          </div>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-red-500 hover:from-emerald-600 hover:to-red-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
        >
          {loading ? <FiLoader className="animate-spin" /> : <FiSave size={16} />}
          {loading ? 'Updating...' : 'Update Course'}
        </button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: General Info */}
        <div className="md:col-span-2 space-y-6">
          <div className={cardClass}>
            <h2 className={`text-sm font-semibold border-b pb-3 mb-2 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-100'}`}>Basic Metadata</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Course Title (English)</label>
                  <input {...register('title')} placeholder="e.g. Video Editing Masterclass" className={inputClass} />
                  {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Course Title (বাংলা)</label>
                  <input {...register('titleBn')} placeholder="যেমনঃ ভিডিও এডিটিং কোর্স" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Course Type *</label>
                  <select {...register('courseType')} className={inputClass}>
                    <option value="recorded">Recorded</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Level *</label>
                  <select {...register('level')} className={inputClass}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
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
                  <label className={labelClass}>Language</label>
                  <select {...register('language')} className={inputClass}>
                    <option value="bangla">Bangla</option>
                    <option value="english">English</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <select {...register('status')} className={inputClass}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`text-sm font-semibold border-b pb-3 mb-4 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-100'}`}>Course Features & Learning</h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className={labelClass}>What You Will Learn</label>
                  <button type="button" onClick={() => learningFields.append('')} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">+ Add</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {learningFields.fields.map((field, idx) => (
                    <div key={field.id} className="group relative">
                      <input {...register(`whatYouWillLearn.${idx}`)} className={inputClass} placeholder="Topic name" />
                      <button type="button" onClick={() => learningFields.remove(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className={labelClass}>Key Features</label>
                  <button type="button" onClick={() => featuresFields.append('')} className="text-xs font-medium text-emerald-600 hover:text-emerald-700">+ Add</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {featuresFields.fields.map((field, idx) => (
                    <div key={field.id} className="group relative">
                      <input {...register(`features.${idx}`)} className={inputClass} placeholder="Feature name" />
                      <button type="button" onClick={() => featuresFields.remove(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`text-sm font-semibold border-b pb-3 mb-4 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-100'}`}>Media & Meta</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Thumbnail URL</label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input {...register('thumbnail')} className={`${inputClass} pl-10`} placeholder="https://..." />
                  </div>
                  {errors.thumbnail && <p className="text-rose-500 text-xs mt-1">{errors.thumbnail.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Banner Image URL</label>
                  <div className="relative">
                    <FiImage className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input {...register('bannerImage')} className={`${inputClass} pl-10`} placeholder="https://..." />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preview Video URL</label>
                  <div className="relative">
                    <FiVideo className="absolute left-3 top-3.5 text-slate-400" size={16} />
                    <input {...register('previewVideo')} className={`${inputClass} pl-10`} placeholder="YouTube/Vimeo" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className={labelClass}>Search Tags</label>
                    <button type="button" onClick={() => tagsFields.append('')} className="text-[10px] font-bold text-emerald-600">+ Add Tag</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tagsFields.fields.map((field, idx) => (
                      <div key={field.id} className="group relative">
                        <input {...register(`tags.${idx}`)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs border border-slate-200 dark:border-slate-800 outline-none focus:border-emerald-300 w-24" placeholder="tag" />
                        <button type="button" onClick={() => tagsFields.remove(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"><FiTrash2 size={10} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`text-sm font-semibold border-b pb-3 mb-4 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-100'}`}>Description</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Short Description (English)</label>
                <textarea {...register('shortDescription')} rows={2} className={`${inputClass} resize-none`} placeholder="Brief wrap-up..."></textarea>
              </div>
              <div>
                <label className={labelClass}>Full Description (English)</label>
                <textarea {...register('description')} rows={5} className={`${inputClass} resize-none`} placeholder="Detailed course content..."></textarea>
                {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pricing */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl text-white shadow-lg space-y-6 relative overflow-hidden ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-800'}`}>
            <div className="absolute top-0 right-0 p-3 opacity-10"><FiDollarSign size={60} /></div>
            <h2 className="text-sm font-semibold text-slate-300 border-b border-slate-700 pb-3 relative z-10">Pricing</h2>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">Regular Price (৳)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 font-semibold text-slate-500">৳</span>
                  <input type="number" {...register('price')} placeholder="0" className={`w-full border border-slate-600 rounded-xl py-3 pl-10 px-4 text-white text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${isDark ? 'bg-black/40' : 'bg-slate-700/50'}`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2">Offer Price (৳)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 font-semibold text-slate-500">৳</span>
                  <input type="number" {...register('discountPrice')} placeholder="0" className={`w-full border border-slate-600 rounded-xl py-3 pl-10 px-4 text-white text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${isDark ? 'bg-black/40' : 'bg-slate-700/50'}`} />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${isDark ? 'bg-black/40 hover:bg-black/60' : 'bg-slate-700/50 hover:bg-slate-700'}`}>
                  <input type="checkbox" {...register('isFeatured')} className="w-5 h-5 rounded accent-emerald-500" />
                  <span className="text-sm text-slate-300">Mark as Featured</span>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${isDark ? 'bg-black/40 hover:bg-black/60' : 'bg-slate-700/50 hover:bg-slate-700'}`}>
                  <input type="checkbox" {...register('isPopular')} className="w-5 h-5 rounded accent-emerald-500" />
                  <span className="text-sm text-slate-300">Popular Course</span>
                </label>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`text-sm font-semibold border-b pb-3 mb-2 ${isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-100'}`}>Engagement Summary</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] uppercase font-bold text-slate-500">Modules</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{courseData?.totalModules || 0}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] uppercase font-bold text-slate-500">Lessons</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{courseData?.totalLessons || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
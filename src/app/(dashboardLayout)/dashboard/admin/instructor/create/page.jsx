'use client';
import { API_URL, API_BASE_URL } from '@/config/api';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FiUser, FiArrowLeft, FiSave, FiMail, FiPhone, FiLock, FiAward, FiGlobe, FiFacebook, FiLinkedin, FiTwitter, FiYoutube, FiInstagram, FiGithub, FiPlus, FiX, FiCheck
} from 'react-icons/fi';

const InstructorForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [expertiseInput, setExpertiseInput] = useState('');

    const initialFormData = {
        // User account fields
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',

        // Instructor profile fields
        title: '',
        titleBn: '',
        bio: '',
        bioBn: '',
        longBio: '',
        longBioBn: '',
        expertise: [],
        experience: 0,
        education: '',
        avatar: '',
        coverImage: '',
        isPublished: true,
        status: 'active',
        order: 0,
        socialLinks: {
            facebook: '',
            linkedin: '',
            twitter: '',
            youtube: '',
            instagram: '',
            github: '',
            website: ''
        }
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (isEditMode && editId) {
            const fetchInstructor = async () => {
                setFetching(true);
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch(`${API_URL}/instructors/${editId}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success && data.data) {
                        const ins = data.data;
                        setFormData({
                            ...initialFormData,
                            ...ins,
                            firstName: ins.userId?.firstName || '',
                            lastName: ins.userId?.lastName || '',
                            email: ins.userId?.email || '',
                            phone: ins.userId?.phone || '',
                            password: '', // Password will be empty on edit
                            confirmPassword: '',
                            socialLinks: {
                                ...initialFormData.socialLinks,
                                ...(ins.socialLinks || {})
                            }
                        });
                    }
                } catch (err) {
                    console.error('Fetch instructor error:', err);
                } finally {
                    setFetching(false);
                }
            };
            fetchInstructor();
        }
    }, [isEditMode, editId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleAddExpertise = (e) => {
        e.preventDefault();
        if (expertiseInput.trim() && !formData.expertise.includes(expertiseInput.trim())) {
            setFormData(prev => ({
                ...prev,
                expertise: [...prev.expertise, expertiseInput.trim()]
            }));
            setExpertiseInput('');
        }
    };

    const removeExpertise = (tag) => {
        setFormData(prev => ({
            ...prev,
            expertise: prev.expertise.filter(t => t !== tag)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEditMode) {
            if (!formData.password) return alert('Password is required for new accounts');
            if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const url = isEditMode ? `${API_URL}/instructors/${editId}` : `${API_URL}/instructors`;
            const method = isEditMode ? 'PATCH' : 'POST';

            const payload = { ...formData };
            if (isEditMode && !payload.password) {
                delete payload.password;
                delete payload.confirmPassword;
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                router.push('/dashboard/admin/instructor');
            } else {
                alert(data.message || 'Something went wrong');
            }
        } catch (err) {
            alert('Error submitting form');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex items-center justify-center p-20"><FiLoader className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                    <FiArrowLeft size={18} className="text-slate-600 dark:text-slate-300" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                        {isEditMode ? 'Edit Instructor Profile' : 'Create New Instructor'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {isEditMode ? 'Update professional information' : 'Create user account and instructor profile together'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Info Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiUser className="text-indigo-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Account Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">First Name *</label>
                            <input
                                type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Last Name *</label>
                            <input
                                type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Email Address *</label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange} required
                                disabled={isEditMode}
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Phone Number *</label>
                            <input
                                type="text" name="phone" value={formData.phone} onChange={handleChange} required
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Password {isEditMode ? '(Optional)' : '*'}</label>
                            <input
                                type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditMode}
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm"
                                placeholder={isEditMode ? '••••••••' : 'Enter strong password'}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Confirm Password {isEditMode ? '' : '*'}</label>
                            <input
                                type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required={!isEditMode}
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm"
                                placeholder={isEditMode ? '••••••••' : 'Confirm password'}
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Profile Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiAward className="text-indigo-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Professional Profile</h3>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Professional Title *</label>
                        <input
                            type="text" name="title" value={formData.title} onChange={handleChange} required
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Short Biography *</label>
                        <textarea
                            name="bio" value={formData.bio} onChange={handleChange} required rows={3}
                            placeholder="Brief description for the instructor card..."
                            className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Experience (Years)</label>
                            <input
                                type="number" name="experience" value={formData.experience} onChange={handleChange} min={0}
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Expertise Area</label>
                            <div className="flex gap-2">
                                <input
                                    type="text" value={expertiseInput} onChange={(e) => setExpertiseInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise(e)}
                                    placeholder="e.g. React.js"
                                    className="flex-1 px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 transition-all text-sm"
                                />
                                <button type="button" onClick={handleAddExpertise} className="px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all">
                                    <FiPlus />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.expertise.map(tag => (
                                    <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded text-xs font-medium border border-indigo-100 dark:border-indigo-500/30">
                                        {tag}
                                        <FiX size={12} className="cursor-pointer hover:text-rose-500" onClick={() => removeExpertise(tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiGlobe className="text-indigo-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Social Presence</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="relative">
                            <FiFacebook className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange}
                                placeholder="Facebook URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiLinkedin className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange}
                                placeholder="LinkedIn URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiTwitter className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange}
                                placeholder="Twitter URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiYoutube className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.youtube" value={formData.socialLinks.youtube} onChange={handleChange}
                                placeholder="YouTube URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiInstagram className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange}
                                placeholder="Instagram URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiGithub className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.github" value={formData.socialLinks.github} onChange={handleChange}
                                placeholder="GitHub URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Visibility Controls */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange}
                            id="isPublished" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="isPublished" className="text-sm font-medium text-slate-700 dark:text-slate-300">Show on Website</label>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 uppercase italic">Status</label>
                        <select
                            name="status" value={formData.status} onChange={handleChange}
                            className="px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-sm"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 uppercase italic">Display Order</label>
                        <input
                            type="number" name="order" value={formData.order} onChange={handleChange}
                            className="w-20 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6">
                    <button
                        type="button" onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-md border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" disabled={loading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-bold transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50"
                    >
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                        {isEditMode ? 'Update Instructor' : 'Save Instructor'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InstructorForm />
        </Suspense>
    );
}

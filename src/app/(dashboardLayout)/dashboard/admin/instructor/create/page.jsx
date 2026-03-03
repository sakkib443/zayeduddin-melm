'use client';
import { API_URL, API_BASE_URL } from '@/config/api';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FiUser, FiArrowLeft, FiSave, FiMail, FiPhone, FiLock, FiAward, FiGlobe, FiFacebook, FiLinkedin, FiTwitter, FiYoutube, FiInstagram, FiGithub, FiPlus, FiX, FiCheck, FiBookOpen, FiBriefcase, FiMessageCircle, FiLoader, FiAlertCircle, FiUpload, FiImage, FiLink
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const InstructorForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [expertiseInput, setExpertiseInput] = useState('');
    const [educationInput, setEducationInput] = useState('');
    const [workExpInput, setWorkExpInput] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [avatarMode, setAvatarMode] = useState('upload');
    const [coverMode, setCoverMode] = useState('upload');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

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
        specializations: 0,
        education: [],
        workExperience: [],
        whatsAppNumber: '',
        avatar: '',
        coverImage: '',
        isPublished: true,
        status: 'active',
        order: 0,
        totalStudents: 0,
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

        // Clear field-level error when user starts typing
        if (formErrors[name] || formErrors[name?.split('.')?.pop()]) {
            setFormErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                delete updated[name?.split('.')?.pop()];
                return updated;
            });
        }

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

    // Education handlers
    const handleAddEducation = (e) => {
        e.preventDefault();
        if (educationInput.trim() && !formData.education.includes(educationInput.trim())) {
            setFormData(prev => ({
                ...prev,
                education: [...prev.education, educationInput.trim()]
            }));
            setEducationInput('');
        }
    };

    const removeEducation = (item) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter(t => t !== item)
        }));
    };

    // Work Experience handlers
    const handleAddWorkExp = (e) => {
        e.preventDefault();
        if (workExpInput.trim() && !formData.workExperience.includes(workExpInput.trim())) {
            setFormData(prev => ({
                ...prev,
                workExperience: [...prev.workExperience, workExpInput.trim()]
            }));
            setWorkExpInput('');
        }
    };

    const removeWorkExp = (item) => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience.filter(t => t !== item)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        setSubmitError('');

        // Client-side validation
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email';

        if (!isEditMode) {
            if (!formData.password) errors.password = 'Password is required';
            else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
            if (formData.password && formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        }

        if (formData.phone && formData.phone.length > 0 && formData.phone.length < 11) {
            errors.phone = 'Phone number must be at least 11 digits';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setSubmitError('Please fix the highlighted fields below');
            // Scroll to top to see error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const url = isEditMode ? `${API_URL}/instructors/${editId}` : `${API_URL}/instructors`;
            const method = isEditMode ? 'PATCH' : 'POST';

            const payload = { ...formData };
            delete payload.confirmPassword;
            if (isEditMode && !payload.password) {
                delete payload.password;
            }

            // Convert numeric fields from string to number
            payload.experience = Number(payload.experience) || 0;
            payload.specializations = Number(payload.specializations) || 0;
            payload.totalStudents = Number(payload.totalStudents) || 0;
            payload.order = Number(payload.order) || 0;

            // Remove fields that shouldn't be sent
            delete payload.status;

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
                // Parse backend validation errors
                if (data.errorMessages && Array.isArray(data.errorMessages)) {
                    const backendErrors = {};
                    data.errorMessages.forEach(err => {
                        // Handle paths like 'body.email', 'body.firstName', 'email', etc.
                        let field = err.path || 'unknown';
                        // Extract the last part of the dotted path
                        if (field.includes('.')) {
                            const parts = field.split('.');
                            field = parts[parts.length - 1];
                        }
                        backendErrors[field] = err.message;
                    });
                    setFormErrors(backendErrors);

                    // Build a readable summary of errors
                    const errorCount = Object.keys(backendErrors).length;
                    setSubmitError(`Validation failed — ${errorCount} error${errorCount > 1 ? 's' : ''} found. Please check the highlighted fields.`);
                } else {
                    setSubmitError(data.message || 'Something went wrong');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            setSubmitError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="flex items-center justify-center p-20"><FiLoader className="animate-spin text-emerald-600" size={40} /></div>;

    return (
        <div className="w-full space-y-6 pb-20">
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
                {/* Error Banner */}
                {submitError && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <p className="text-sm text-red-700 dark:text-red-400 font-semibold">{submitError}</p>
                            {Object.keys(formErrors).length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {Object.entries(formErrors).map(([field, msg]) => (
                                        <li key={field} className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                            <span className="w-1 h-1 bg-red-400 rounded-full flex-shrink-0"></span>
                                            <span className="font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}:</span> {msg}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button type="button" onClick={() => { setSubmitError(''); setFormErrors({}); }} className="ml-auto text-red-400 hover:text-red-600 flex-shrink-0">
                            <FiX size={16} />
                        </button>
                    </div>
                )}

                {/* Account Info Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiUser className="text-emerald-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Account Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">First Name *</label>
                            <input
                                type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border outline-none focus:border-emerald-500 transition-all text-sm ${formErrors.firstName ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'}`}
                            />
                            {formErrors.firstName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><FiAlertCircle size={12} />{formErrors.firstName}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Last Name *</label>
                            <input
                                type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border outline-none focus:border-emerald-500 transition-all text-sm ${formErrors.lastName ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'}`}
                            />
                            {formErrors.lastName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><FiAlertCircle size={12} />{formErrors.lastName}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Email Address *</label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                disabled={isEditMode}
                                className={`w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border outline-none focus:border-emerald-500 transition-all text-sm disabled:opacity-50 ${formErrors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'}`}
                            />
                            {formErrors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><FiAlertCircle size={12} />{formErrors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Phone Number</label>
                            <input
                                type="text" name="phone" value={formData.phone} onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border outline-none focus:border-emerald-500 transition-all text-sm ${formErrors.phone ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'}`}
                            />
                            {formErrors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><FiAlertCircle size={12} />{formErrors.phone}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Password {isEditMode ? '(Optional)' : '*'}</label>
                            <input
                                type="password" name="password" value={formData.password} onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border outline-none focus:border-emerald-500 transition-all text-sm ${formErrors.password ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'}`}
                                placeholder={isEditMode ? '••••••••' : 'Enter strong password'}
                            />
                            {formErrors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><FiAlertCircle size={12} />{formErrors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Confirm Password {isEditMode ? '' : '*'}</label>
                            <input
                                type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border outline-none focus:border-emerald-500 transition-all text-sm ${formErrors.confirmPassword ? 'border-red-400 bg-red-50/50' : 'border-slate-200 dark:border-slate-700'}`}
                                placeholder={isEditMode ? '••••••••' : 'Confirm password'}
                            />
                            {formErrors.confirmPassword && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><FiAlertCircle size={12} />{formErrors.confirmPassword}</p>}
                        </div>
                    </div>
                </div>

                {/* Professional Profile Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiAward className="text-emerald-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Professional Profile</h3>
                    </div>

                    {/* Avatar Image */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 uppercase italic">
                            <FiImage size={12} className="text-slate-400" />
                            Profile Photo (Avatar)
                        </label>
                        <p className="text-[10px] text-slate-400">Recommended: 400×400px, Square, JPG/PNG/WEBP</p>
                        <div className="flex gap-2 mb-2">
                            <button type="button" onClick={() => setAvatarMode('upload')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${avatarMode === 'upload' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}>
                                <FiUpload size={11} /> Upload Image
                            </button>
                            <button type="button" onClick={() => setAvatarMode('link')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${avatarMode === 'link' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}>
                                <FiLink size={11} /> Paste URL
                            </button>
                        </div>
                        {avatarMode === 'upload' ? (
                            <div>
                                {formData.avatar ? (
                                    <div className="relative inline-block">
                                        <img src={formData.avatar} alt="Avatar" className="w-28 h-28 object-cover rounded-lg border-2 border-slate-200" />
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600"><FiX size={12} /></button>
                                    </div>
                                ) : (
                                    <div onClick={() => avatarInputRef.current?.click()} className="w-28 h-28 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-all">
                                        {uploadingAvatar ? (
                                            <><FiLoader className="animate-spin text-emerald-600" size={20} /><span className="text-[10px] text-slate-400 mt-1">Uploading...</span></>
                                        ) : (
                                            <><FiUpload className="text-slate-400" size={20} /><span className="text-[10px] text-slate-400 mt-1">400×400</span></>
                                        )}
                                    </div>
                                )}
                                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0]; if (!file) return;
                                    const token = localStorage.getItem('token');
                                    const fd = new FormData(); fd.append('image', file);
                                    try {
                                        setUploadingAvatar(true);
                                        const res = await fetch(`${API_BASE_URL}/upload/single`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
                                        const result = await res.json();
                                        if (res.ok && result.data?.url) setFormData(prev => ({ ...prev, avatar: result.data.url }));
                                        else alert('Upload failed: ' + (result.message || 'Error'));
                                    } catch { alert('Upload failed'); } finally { setUploadingAvatar(false); }
                                }} />
                            </div>
                        ) : (
                            <input type="text" name="avatar" value={formData.avatar} onChange={handleChange}
                                placeholder="https://res.cloudinary.com/..."
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                            />
                        )}
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 uppercase italic">
                            <FiImage size={12} className="text-slate-400" />
                            Cover Image (Banner)
                        </label>
                        <p className="text-[10px] text-slate-400">Recommended: 1200×400px, Landscape, JPG/PNG/WEBP</p>
                        <div className="flex gap-2 mb-2">
                            <button type="button" onClick={() => setCoverMode('upload')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${coverMode === 'upload' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}>
                                <FiUpload size={11} /> Upload Image
                            </button>
                            <button type="button" onClick={() => setCoverMode('link')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${coverMode === 'link' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}>
                                <FiLink size={11} /> Paste URL
                            </button>
                        </div>
                        {coverMode === 'upload' ? (
                            <div>
                                {formData.coverImage ? (
                                    <div className="relative inline-block">
                                        <img src={formData.coverImage} alt="Cover" className="w-60 h-20 object-cover rounded-lg border-2 border-slate-200" />
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600"><FiX size={12} /></button>
                                    </div>
                                ) : (
                                    <div onClick={() => coverInputRef.current?.click()} className="w-60 h-20 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-all">
                                        {uploadingCover ? (
                                            <><FiLoader className="animate-spin text-emerald-600" size={20} /><span className="text-[10px] text-slate-400 mt-1">Uploading...</span></>
                                        ) : (
                                            <><FiUpload className="text-slate-400" size={18} /><span className="text-[10px] text-slate-400 mt-1">1200×400</span></>
                                        )}
                                    </div>
                                )}
                                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                    const file = e.target.files?.[0]; if (!file) return;
                                    const token = localStorage.getItem('token');
                                    const fd = new FormData(); fd.append('image', file);
                                    try {
                                        setUploadingCover(true);
                                        const res = await fetch(`${API_BASE_URL}/upload/single`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
                                        const result = await res.json();
                                        if (res.ok && result.data?.url) setFormData(prev => ({ ...prev, coverImage: result.data.url }));
                                        else alert('Upload failed: ' + (result.message || 'Error'));
                                    } catch { alert('Upload failed'); } finally { setUploadingCover(false); }
                                }} />
                            </div>
                        ) : (
                            <input type="text" name="coverImage" value={formData.coverImage} onChange={handleChange}
                                placeholder="https://res.cloudinary.com/..."
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Professional Title</label>
                        <input
                            type="text" name="title" value={formData.title} onChange={handleChange}
                            placeholder="e.g. Senior Software Engineer"
                            className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Short Biography</label>
                        <textarea
                            name="bio" value={formData.bio} onChange={handleChange} rows={3}
                            placeholder="Brief description for the instructor card..."
                            className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Expertise Area</label>
                            <div className="flex gap-2">
                                <input
                                    type="text" value={expertiseInput} onChange={(e) => setExpertiseInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise(e)}
                                    placeholder="e.g. User Experience Design"
                                    className="flex-1 px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                                />
                                <button type="button" onClick={handleAddExpertise} className="px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all">
                                    <FiPlus />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.expertise.map(tag => (
                                    <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium border border-emerald-200 dark:border-emerald-500/30">
                                        {tag}
                                        <FiX size={12} className="cursor-pointer hover:text-emerald-900" onClick={() => removeExpertise(tag)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experience & Stats Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiBriefcase className="text-emerald-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Experience & Stats</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Experience (Years)</label>
                            <input
                                type="number" name="experience" value={formData.experience} onChange={handleChange} min={0}
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Total Students Trained</label>
                            <input
                                type="number" name="totalStudents" value={formData.totalStudents} onChange={handleChange} min={0}
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">Specializations</label>
                            <input
                                type="number" name="specializations" value={formData.specializations} onChange={handleChange} min={0}
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase italic">WhatsApp Number</label>
                            <input
                                type="text" name="whatsAppNumber" value={formData.whatsAppNumber} onChange={handleChange}
                                placeholder="e.g. 01XXXXXXXXX"
                                className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Life Journey / Long Bio */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiMessageCircle className="text-emerald-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Life Journey (Detailed Bio)</h3>
                    </div>
                    <textarea
                        name="longBio" value={formData.longBio} onChange={handleChange} rows={6}
                        placeholder="Write the instructor's full life journey / detailed biography here..."
                        className="w-full px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm resize-none"
                    />
                </div>

                {/* Education Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiBookOpen className="text-emerald-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Education</h3>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text" value={educationInput} onChange={(e) => setEducationInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddEducation(e)}
                            placeholder="e.g. BSc in Computer Science"
                            className="flex-1 px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                        />
                        <button type="button" onClick={handleAddEducation} className="px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all">
                            <FiPlus />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.education.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700">
                                <span className="text-sm text-slate-700 dark:text-slate-300">📚 {item}</span>
                                <FiX size={14} className="cursor-pointer text-slate-400 hover:text-emerald-600" onClick={() => removeEducation(item)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Work Experience Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiBriefcase className="text-emerald-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Work Experience</h3>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text" value={workExpInput} onChange={(e) => setWorkExpInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddWorkExp(e)}
                            placeholder="e.g. Lead UX Designer at Creative IT"
                            className="flex-1 px-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 transition-all text-sm"
                        />
                        <button type="button" onClick={handleAddWorkExp} className="px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-all">
                            <FiPlus />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.workExperience.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700">
                                <span className="text-sm text-slate-700 dark:text-slate-300">💼 {item}</span>
                                <FiX size={14} className="cursor-pointer text-slate-400 hover:text-emerald-600" onClick={() => removeWorkExp(item)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <FiGlobe className="text-emerald-600" />
                        <h3 className="font-semibold text-slate-800 dark:text-white">Social Presence</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="relative">
                            <FiFacebook className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange}
                                placeholder="Facebook URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiLinkedin className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange}
                                placeholder="LinkedIn URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiTwitter className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange}
                                placeholder="Twitter URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiYoutube className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.youtube" value={formData.socialLinks.youtube} onChange={handleChange}
                                placeholder="YouTube URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiInstagram className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange}
                                placeholder="Instagram URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 text-sm transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FiGithub className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="url" name="socialLinks.github" value={formData.socialLinks.github} onChange={handleChange}
                                placeholder="GitHub URL"
                                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 text-sm transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Visibility Controls */}
                <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange}
                            id="isPublished" className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
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
                        className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
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

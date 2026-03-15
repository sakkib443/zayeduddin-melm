'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit3, FiSave, FiCamera,
    FiShield, FiLock, FiAward, FiBook, FiStar, FiHeart, FiCheckCircle, FiX,
    FiClock, FiTrendingUp, FiLoader, FiUpload
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/context/LanguageContext';
import { API_URL } from '@/config/api';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
    const { isDark } = useTheme();
    const { t } = useLanguage();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
    });

    // Fetch profile from API
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setFetchingProfile(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success && data.data) {
                const userData = data.data;
                setUser(userData);
                // Update localStorage too
                localStorage.setItem('user', JSON.stringify(userData));
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || userData.phone || '',
                    address: userData.address || '',
                    dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
                });
            } else {
                // Fallback to localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setFormData({
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        email: userData.email || '',
                        phoneNumber: userData.phoneNumber || userData.phone || '',
                        address: userData.address || '',
                        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || userData.phone || '',
                    address: userData.address || '',
                    dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
                });
            }
        } finally {
            setFetchingProfile(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Save profile via API
    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {};
            if (formData.firstName) payload.firstName = formData.firstName;
            if (formData.lastName) payload.lastName = formData.lastName;
            if (formData.phoneNumber) payload.phoneNumber = formData.phoneNumber;
            if (formData.address !== undefined) payload.address = formData.address;
            if (formData.dateOfBirth) payload.dateOfBirth = formData.dateOfBirth;

            const res = await fetch(`${API_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (data.success) {
                const updatedUser = data.data;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Handle avatar upload
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setUploadingAvatar(true);
        try {
            const token = localStorage.getItem('token');

            // Step 1: Upload to Cloudinary via API
            const formDataUpload = new FormData();
            formDataUpload.append('avatar', file);

            const uploadRes = await fetch(`${API_URL}/upload/avatar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formDataUpload,
            });
            const uploadData = await uploadRes.json();

            if (!uploadData.success) {
                toast.error(uploadData.message || 'Failed to upload image');
                return;
            }

            const avatarUrl = uploadData.data.url;

            // Step 2: Update profile with the new avatar URL
            const updateRes = await fetch(`${API_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ avatar: avatarUrl }),
            });
            const updateData = await updateRes.json();

            if (updateData.success) {
                setUser(updateData.data);
                localStorage.setItem('user', JSON.stringify(updateData.data));
                toast.success('Profile photo updated!');
            } else {
                toast.error('Failed to save avatar');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            toast.error('Failed to upload photo');
        } finally {
            setUploadingAvatar(false);
            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const inputClass = `w-full px-4 py-3.5 rounded-2xl border-2 outline-none transition-all text-sm font-medium ${isDark
        ? 'bg-slate-800/50 border-slate-700/50 text-white focus:border-[#021E14] focus:bg-slate-800'
        : 'bg-white border-slate-200 text-slate-800 focus:border-[#021E14] focus:shadow-lg focus:shadow-[#021E14]/10'
        } disabled:opacity-50 disabled:cursor-not-allowed`;

    const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`;

    if (fetchingProfile) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex items-center gap-3">
                    <FiLoader className="animate-spin text-[#021E14]" size={24} />
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Loading profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hidden file input for avatar upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
            />

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Gradient - Brand Colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#021E14] via-[#3aa8a1] to-[#021E14]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#021E14]/20 rounded-full blur-3xl" />

                <div className="relative px-6 py-12 md:py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar with Ring */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#021E14] to-[#021E14] rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 p-1 backdrop-blur-xl border border-white/20">
                                    <div className="w-full h-full rounded-[20px] overflow-hidden bg-white/10 backdrop-blur-xl flex items-center justify-center">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.firstName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-5xl font-black text-white">
                                                {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'S'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleAvatarClick}
                                    disabled={uploadingAvatar}
                                    className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white text-[#021E14] flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-4 border-[#021E14] disabled:opacity-50"
                                >
                                    {uploadingAvatar ? (
                                        <FiLoader className="animate-spin" size={20} />
                                    ) : (
                                        <FiCamera size={20} />
                                    )}
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="text-center md:text-left text-white">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                                        {user?.firstName || 'Student'} {user?.lastName || 'User'}
                                    </h1>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
                                        {user?.role || t('userDashboard.profile.student')}
                                    </span>
                                </div>
                                <p className="text-white/70 text-sm font-medium mb-4">{user?.email || 'email@example.com'}</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                                        <FiCheckCircle className="text-emerald-400" size={16} />
                                        <span className="text-sm font-semibold">{t('userDashboard.profile.verified')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                                        <FiClock className="text-[#D4AF37]" size={16} />
                                        <span className="text-sm font-semibold">{t('userDashboard.profile.active')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-6xl mx-auto px-6 -mt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: FiBook, label: t('userDashboard.profile.enrolledCourses'), value: '0', color: 'from-[#021E14] to-[#3aa8a1]' },
                        { icon: FiAward, label: t('userDashboard.profile.certificates'), value: '0', color: 'from-[#021E14] to-[#e88a43]' },
                        { icon: FiHeart, label: t('userDashboard.profile.wishlistItems'), value: '0', color: 'from-[#021E14] to-[#01140D]' },
                        { icon: FiTrendingUp, label: t('userDashboard.profile.completedPct'), value: '0%', color: 'from-[#021E14] to-[#01140D]' },
                    ].map((stat, idx) => (
                        <div key={idx} className={`relative group ${isDark ? 'bg-slate-800/80' : 'bg-white'} rounded-2xl p-5 shadow-xl border ${isDark ? 'border-slate-700/50' : 'border-slate-100'} hover:shadow-2xl transition-all`}>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg mb-3`}>
                                <stat.icon size={22} />
                            </div>
                            <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{stat.value}</p>
                            <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Account Info */}
                    <div className="space-y-6">
                        {/* Account Status Card */}
                        <div className={`rounded-3xl overflow-hidden ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-xl'}`}>
                            <div className="p-6 bg-gradient-to-br from-[#021E14] to-[#3aa8a1]">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                                        <FiShield className="text-white" size={28} />
                                    </div>
                                    <div className="text-white">
                                        <h3 className="font-bold text-lg">{t('userDashboard.profile.accountProtected')}</h3>
                                        <p className="text-emerald-100 text-sm">{t('userDashboard.profile.allSecurityEnabled')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { label: t('userDashboard.profile.emailVerified'), status: true },
                                    { label: t('userDashboard.profile.phoneVerified'), status: !!user?.phoneNumber || !!user?.phone },
                                    { label: t('userDashboard.profile.twoFactorAuth'), status: false },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
                                        {item.status ? (
                                            <span className="flex items-center gap-1.5 text-[#021E14] text-xs font-bold">
                                                <FiCheckCircle size={14} /> {t('userDashboard.profile.enabled')}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                                <FiX size={14} /> {t('userDashboard.profile.disabled')}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Avatar Upload Card */}
                        <div className={`rounded-3xl p-6 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-xl'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Profile Photo</h3>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiUser size={32} className={isDark ? 'text-slate-500' : 'text-slate-300'} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleAvatarClick}
                                    disabled={uploadingAvatar}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${uploadingAvatar
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                        } ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-[#021E14] text-white hover:bg-[#01140D]'}`}
                                >
                                    {uploadingAvatar ? (
                                        <><FiLoader className="animate-spin" size={16} /> Uploading...</>
                                    ) : (
                                        <><FiUpload size={16} /> Upload Photo</>
                                    )}
                                </button>
                                <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    JPG, PNG or WebP. Max 5MB.
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={`rounded-3xl p-6 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-xl'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.profile.quickActions')}</h3>
                            <div className="space-y-3">
                                <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                                    <FiLock size={18} className="text-[#021E14]" />
                                    <span className="font-semibold text-sm">{t('userDashboard.profile.changePassword')}</span>
                                </button>
                                <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                                    <FiShield size={18} className="text-[#021E14]" />
                                    <span className="font-semibold text-sm">{t('userDashboard.profile.securitySettings')}</span>
                                </button>
                                <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                                    <FiAward size={18} className="text-[#021E14]" />
                                    <span className="font-semibold text-sm">{t('userDashboard.profile.viewCertificates')}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Form */}
                    <div className={`lg:col-span-2 rounded-3xl ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-xl'}`}>
                        {/* Form Header */}
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#021E14] to-[#021E14] flex items-center justify-center text-white">
                                    <FiUser size={22} />
                                </div>
                                <div>
                                    <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('userDashboard.profile.personalInfo')}</h2>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('userDashboard.profile.updateDetails')}</p>
                                </div>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#021E14] hover:bg-[#3aa8a1] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#021E14]/25"
                                >
                                    <FiEdit3 size={16} />
                                    {t('userDashboard.profile.editProfile')}
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            // Reset form data to original
                                            setFormData({
                                                firstName: user?.firstName || '',
                                                lastName: user?.lastName || '',
                                                email: user?.email || '',
                                                phoneNumber: user?.phoneNumber || user?.phone || '',
                                                address: user?.address || '',
                                                dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
                                            });
                                        }}
                                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                    >
                                        {t('userDashboard.profile.cancel')}
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#021E14] to-[#021E14] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#021E14]/25 disabled:opacity-50"
                                    >
                                        <FiSave size={16} />
                                        {loading ? t('userDashboard.profile.saving') : t('userDashboard.profile.saveChanges')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Form Body */}
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>{t('userDashboard.profile.firstName')}</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder={t('userDashboard.profile.enterFirstName')}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('userDashboard.profile.lastName')}</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder={t('userDashboard.profile.enterLastName')}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>{t('userDashboard.profile.emailAddress')}</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className={`${inputClass} pr-20`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-emerald-100 text-[#021E14] text-[10px] font-bold rounded-md uppercase">
                                            {t('userDashboard.profile.verified')}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>{t('userDashboard.profile.phoneNumber')}</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="+880 1XXX XXXXXX"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>{t('userDashboard.profile.address')}</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder={t('userDashboard.profile.enterAddress')}
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCamera, FiShield, FiKey, FiLoader, FiUpload } from 'react-icons/fi';
import { API_URL } from '@/config/api';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });

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
                localStorage.setItem('user', JSON.stringify(userData));
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || userData.phoneNumber || '',
                    address: userData.address || '',
                });
            } else {
                const stored = localStorage.getItem('user');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setUser(parsed);
                    setFormData({
                        firstName: parsed.firstName || '',
                        lastName: parsed.lastName || '',
                        email: parsed.email || '',
                        phone: parsed.phone || parsed.phoneNumber || '',
                        address: parsed.address || '',
                    });
                }
            }
        } catch (error) {
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                setUser(parsed);
                setFormData({
                    firstName: parsed.firstName || '',
                    lastName: parsed.lastName || '',
                    email: parsed.email || '',
                    phone: parsed.phone || parsed.phoneNumber || '',
                    address: parsed.address || '',
                });
            }
        } finally {
            setFetchingProfile(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {};
            if (formData.firstName) payload.firstName = formData.firstName;
            if (formData.lastName) payload.lastName = formData.lastName;
            if (formData.phone) payload.phoneNumber = formData.phone;
            if (formData.address !== undefined) payload.address = formData.address;

            const response = await fetch(`${API_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.data);
                localStorage.setItem('user', JSON.stringify(data.data));
                toast.success('Profile updated successfully!');
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB'); return; }

        setUploadingAvatar(true);
        try {
            const token = localStorage.getItem('token');
            const fd = new FormData();
            fd.append('avatar', file);

            const uploadRes = await fetch(`${API_URL}/upload/avatar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const uploadData = await uploadRes.json();
            if (!uploadData.success) { toast.error(uploadData.message || 'Upload failed'); return; }

            const updateRes = await fetch(`${API_URL}/users/me`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ avatar: uploadData.data.url }),
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
            toast.error('Failed to upload photo');
        } finally {
            setUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (fetchingProfile) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <FiLoader className="animate-spin text-[#021E14]" size={24} />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />

            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-[#021E14] flex items-center justify-center text-white">
                        <FiUser size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">My Profile</h1>
                        <p className="text-xs text-gray-500 dark:text-slate-400">Manage your account settings</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Profile Photo Card */}
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-5 shadow-sm">
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-md overflow-hidden bg-[#021E14] flex items-center justify-center text-white text-3xl font-semibold">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    user?.firstName?.[0] || 'A'
                                )}
                            </div>
                            <button
                                onClick={handleAvatarClick}
                                disabled={uploadingAvatar}
                                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-md bg-[#021E14] text-white flex items-center justify-center shadow-sm hover:bg-[#e8893f] transition-colors disabled:opacity-50"
                            >
                                {uploadingAvatar ? <FiLoader className="animate-spin" size={14} /> : <FiCamera size={14} />}
                            </button>
                        </div>
                        <h3 className="text-base font-semibold mt-4 text-gray-800 dark:text-white">
                            {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{user?.role || 'Super Admin'}</p>

                        <div className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-slate-700">
                            <div className="flex items-center justify-center gap-2 text-[#021E14]">
                                <FiShield size={14} />
                                <span className="text-xs font-medium">Verified Account</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAvatarClick}
                            disabled={uploadingAvatar}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#021E14] text-white text-xs font-medium rounded-md hover:bg-[#01140D] transition-colors disabled:opacity-50"
                        >
                            {uploadingAvatar ? <><FiLoader className="animate-spin" size={12} /> Uploading...</> : <><FiUpload size={12} /> Upload Photo</>}
                        </button>
                        <p className="text-[10px] text-gray-400 mt-2">JPG, PNG or WebP. Max 5MB.</p>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-5 shadow-sm">
                    <h3 className="text-sm font-semibold mb-5 text-gray-800 dark:text-white">Personal Information</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium mb-1.5 text-gray-600 dark:text-slate-300">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none focus:border-[#021E14] dark:focus:border-[#021E14] transition-colors"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1.5 text-gray-600 dark:text-slate-300">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none focus:border-[#021E14] dark:focus:border-[#021E14] transition-colors"
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-600 dark:text-slate-300">
                                <FiMail className="inline mr-1.5" size={12} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-slate-400 cursor-not-allowed"
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-600 dark:text-slate-300">
                                <FiPhone className="inline mr-1.5" size={12} />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none focus:border-[#021E14] dark:focus:border-[#021E14] transition-colors"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-1.5 text-gray-600 dark:text-slate-300">
                                <FiMapPin className="inline mr-1.5" size={12} />
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none focus:border-[#021E14] dark:focus:border-[#021E14] transition-colors resize-none"
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-[#021E14] text-white text-sm font-medium rounded-md hover:bg-[#021E14] transition-colors disabled:opacity-50"
                            >
                                <FiSave size={14} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            >
                                <FiKey size={14} />
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit3, FiSave, FiCamera,
    FiShield, FiLock, FiAward, FiBook, FiStar, FiHeart, FiCheckCircle, FiX,
    FiClock, FiTrendingUp
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
    const { isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phoneNumber: userData.phoneNumber || '',
                    address: userData.address || '',
                    dateOfBirth: userData.dateOfBirth || '',
                });
            } catch (e) { }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulated API call
        setTimeout(() => {
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setLoading(false);
        }, 1000);
    };

    const inputClass = `w-full px-4 py-3.5 rounded-2xl border-2 outline-none transition-all text-sm font-medium ${isDark
        ? 'bg-slate-800/50 border-slate-700/50 text-white focus:border-[#E62D26] focus:bg-slate-800'
        : 'bg-white border-slate-200 text-slate-800 focus:border-[#E62D26] focus:shadow-lg focus:shadow-[#E62D26]/10'
        } disabled:opacity-50 disabled:cursor-not-allowed`;

    const labelClass = `block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Gradient - Brand Colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E62D26] via-[#3aa8a1] to-[#f79952]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f79952]/20 rounded-full blur-3xl" />

                <div className="relative px-6 py-12 md:py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Avatar with Ring */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f79952] to-[#E62D26] rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 p-1 backdrop-blur-xl border border-white/20">
                                    <div className="w-full h-full rounded-[20px] bg-white/10 backdrop-blur-xl flex items-center justify-center">
                                        <span className="text-5xl font-black text-white">
                                            {user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'S'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toast.info('Avatar upload coming soon!')}
                                    className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white text-[#E62D26] flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-4 border-[#E62D26]"
                                >
                                    <FiCamera size={20} />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="text-center md:text-left text-white">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                                        {user?.firstName || 'Student'} {user?.lastName || 'User'}
                                    </h1>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
                                        {user?.role || 'Student'}
                                    </span>
                                </div>
                                <p className="text-white/70 text-sm font-medium mb-4">{user?.email || 'email@example.com'}</p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                                        <FiCheckCircle className="text-emerald-400" size={16} />
                                        <span className="text-sm font-semibold">Verified</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                                        <FiClock className="text-amber-400" size={16} />
                                        <span className="text-sm font-semibold">Active</span>
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
                        { icon: FiBook, label: 'Enrolled Courses', value: '0', color: 'from-[#E62D26] to-[#3aa8a1]' },
                        { icon: FiAward, label: 'Certificates', value: '0', color: 'from-[#f79952] to-[#e88a43]' },
                        { icon: FiHeart, label: 'Wishlist Items', value: '0', color: 'from-rose-500 to-pink-500' },
                        { icon: FiTrendingUp, label: 'Completed', value: '0%', color: 'from-emerald-500 to-red-500' },
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
                            <div className="p-6 bg-gradient-to-br from-[#E62D26] to-[#3aa8a1]">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                                        <FiShield className="text-white" size={28} />
                                    </div>
                                    <div className="text-white">
                                        <h3 className="font-bold text-lg">Account Protected</h3>
                                        <p className="text-emerald-100 text-sm">All security features enabled</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { label: 'Email Verified', status: true },
                                    { label: 'Phone Verified', status: !!user?.phoneNumber },
                                    { label: 'Two-Factor Auth', status: false },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
                                        {item.status ? (
                                            <span className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                                                <FiCheckCircle size={14} /> Enabled
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                                                <FiX size={14} /> Disabled
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={`rounded-3xl p-6 ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-xl'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Quick Actions</h3>
                            <div className="space-y-3">
                                <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                                    <FiLock size={18} className="text-[#E62D26]" />
                                    <span className="font-semibold text-sm">Change Password</span>
                                </button>
                                <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                                    <FiShield size={18} className="text-emerald-500" />
                                    <span className="font-semibold text-sm">Security Settings</span>
                                </button>
                                <button className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'}`}>
                                    <FiAward size={18} className="text-[#f79952]" />
                                    <span className="font-semibold text-sm">View Certificates</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Profile Form */}
                    <div className={`lg:col-span-2 rounded-3xl ${isDark ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-xl'}`}>
                        {/* Form Header */}
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E62D26] to-[#f79952] flex items-center justify-center text-white">
                                    <FiUser size={22} />
                                </div>
                                <div>
                                    <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>Personal Information</h2>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Update your personal details</p>
                                </div>
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#E62D26] hover:bg-[#3aa8a1] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#E62D26]/25"
                                >
                                    <FiEdit3 size={16} />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E62D26] to-[#f79952] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#E62D26]/25 disabled:opacity-50"
                                    >
                                        <FiSave size={16} />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Form Body */}
                        <div className="p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter first name"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter last name"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className={`${inputClass} pr-20`}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-md uppercase">
                                            Verified
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Phone Number</label>
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
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder="Enter your full address"
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

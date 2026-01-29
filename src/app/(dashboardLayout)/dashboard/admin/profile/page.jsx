'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCamera, FiShield, FiKey } from 'react-icons/fi';
import { API_URL } from '@/config/api';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setFormData({
                firstName: parsed.firstName || '',
                lastName: parsed.lastName || '',
                email: parsed.email || '',
                phone: parsed.phone || '',
                address: parsed.address || '',
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/update-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                toast.success('Profile updated successfully!');
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-5 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-[#E62D26] flex items-center justify-center text-white">
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
                            <div className="w-24 h-24 rounded-md bg-[#E62D26] flex items-center justify-center text-white text-3xl font-semibold">
                                {user?.firstName?.[0] || 'A'}
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-md bg-[#F79952] text-white flex items-center justify-center shadow-sm hover:bg-[#e8893f] transition-colors">
                                <FiCamera size={14} />
                            </button>
                        </div>
                        <h3 className="text-base font-semibold mt-4 text-gray-800 dark:text-white">
                            {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{user?.role || 'Super Admin'}</p>

                        <div className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-slate-700">
                            <div className="flex items-center justify-center gap-2 text-[#E62D26]">
                                <FiShield size={14} />
                                <span className="text-xs font-medium">Verified Account</span>
                            </div>
                        </div>
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
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none focus:border-[#E62D26] dark:focus:border-[#E62D26] transition-colors"
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
                                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none focus:border-[#E62D26] dark:focus:border-[#E62D26] transition-colors"
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
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none focus:border-[#E62D26] dark:focus:border-[#E62D26] transition-colors"
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
                                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white outline-none focus:border-[#E62D26] dark:focus:border-[#E62D26] transition-colors resize-none"
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-[#E62D26] text-white text-sm font-medium rounded-md hover:bg-[#c41e18] transition-colors disabled:opacity-50"
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

'use client';
import { API_URL, API_BASE_URL, API_URL as BASE_URL } from '@/config/api';


import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FiUser, FiArrowLeft, FiSave, FiMail, FiPhone, FiLock, FiUserCheck, FiMapPin, FiGlobe
} from 'react-icons/fi';

const countryCodes = [
    { code: '+880', country: 'BD' },
    { code: '+1', country: 'US' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'IN' },
    { code: '+971', country: 'AE' },
    { code: '+966', country: 'SA' },
    { code: '+65', country: 'SG' },
    { code: '+60', country: 'MY' },
    { code: '+61', country: 'AU' },
    { code: '+81', country: 'JP' },
    { code: '+86', country: 'CN' },
];

const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+880',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    status: 'active',
    address: '',
    postalCode: '',
    country: 'Bangladesh',
    state: '',
    city: '',
    gender: '',
    aboutStudent: '',
};

export default function CreateUserPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    // Fetch user data if in edit mode
    React.useEffect(() => {
        if (isEditMode && editId) {
            const fetchUser = async () => {
                setFetching(true);
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch(`${BASE_URL}/users/admin/all`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    if (data.success && data.data) {
                        const user = data.data.find(u => u._id === editId);
                        if (user) {
                            setFormData({
                                ...initialFormData,
                                ...user,
                                password: '', // Keep password empty by default on edit
                                confirmPassword: '',
                                status: user.status || 'active',
                                role: user.role || 'student'
                            });
                        }
                    }
                } catch (err) {
                    console.error('Fetch user error:', err);
                } finally {
                    setFetching(false);
                }
            };
            fetchUser();
        }
    }, [isEditMode, editId]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for creation
        if (!isEditMode) {
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(formData.password)) {
                alert('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)');
                return;
            }
        } else {
            // Password logic for edit: only validate if user starts typing a new password
            if (formData.password) {
                if (formData.password !== formData.confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(formData.password)) {
                    alert('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)');
                    return;
                }
            }
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = isEditMode
                ? `${BASE_URL}/users/admin/${editId}`
                : `${BASE_URL}/auth/register`;

            const method = isEditMode ? 'PATCH' : 'POST';

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                countryCode: formData.countryCode,
                phone: formData.phone,
                role: formData.role,
                status: formData.status,
                address: formData.address,
                postalCode: formData.postalCode,
                country: formData.country,
                state: formData.state,
                city: formData.city,
                gender: formData.gender,
                aboutStudent: formData.aboutStudent,
            };

            // Only send password if it's being set/changed
            if (formData.password) {
                payload.password = formData.password;
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/dashboard/admin/user');
            } else {
                const error = await res.json();
                alert(error.message || `Failed to ${isEditMode ? 'update' : 'create'} user`);
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert(`Error ${isEditMode ? 'updating' : 'creating'} user`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 p-4">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <FiArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {isEditMode ? 'Edit User' : 'Create New User'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {isEditMode ? `Updating information for user ${editId}` : 'Add a new user to the platform'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                {/* Basic Info Section */}
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <FiUser className="text-[#021E14]" /> Basic Information
                    </h3>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="John"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Doe"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
                    <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="user@example.com"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Phone with Country Code */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                    <div className="flex gap-2">
                        <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="w-28 px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] outline-none transition-all"
                        >
                            {countryCodes.map(c => (
                                <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                            ))}
                        </select>
                        <div className="relative flex-1">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="1XXX-XXXXXX"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Role, Status & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">User Role *</label>
                        <div className="relative">
                            <FiUserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] outline-none transition-all appearance-none"
                            >
                                <option value="student">Student</option>
                                <option value="instructor">Instructor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account Status *</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] outline-none transition-all"
                        >
                            <option value="active">Active</option>
                            <option value="blocked">Blocked</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] outline-none transition-all"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Address Section */}
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-4 pt-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <FiMapPin className="text-[#021E14]" /> Address Information
                    </h3>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Street Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition-all"
                    />
                </div>

                {/* City, State, Postal */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Dhaka"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">State/Division</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Dhaka"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Postal Code</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="1205"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Country */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Country</label>
                    <div className="relative">
                        <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Bangladesh"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] outline-none transition-all"
                        />
                    </div>
                </div>

                {/* About */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">About User</label>
                    <textarea
                        name="aboutStudent"
                        value={formData.aboutStudent}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Brief description about the user..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition-all resize-none"
                    />
                </div>

                {/* Password Section */}
                <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-4 pt-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                        <FiLock className="text-[#021E14]" /> Security
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Password must be 8+ characters with uppercase, lowercase, number, and special character</p>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password *</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={isEditMode ? "Leave blank to keep current" : "Strong password"}
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition-all ${isEditMode ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password {isEditMode ? '' : '*'}</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required={!isEditMode}
                                placeholder={isEditMode ? "Leave blank to keep current" : "Re-enter password"}
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition-all ${isEditMode ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || fetching}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#021E14] to-[#01140D] text-white font-medium hover:shadow-lg hover:shadow-[#021E14]/30 transition-all disabled:opacity-50"
                    >
                        <FiSave size={18} />
                        {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update User' : 'Create User')}
                    </button>
                </div>
            </form>
        </div>
    );
}


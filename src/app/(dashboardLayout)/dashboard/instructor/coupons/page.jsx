"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { LuSearch, LuTag, LuPercent, LuCalendar, LuUsers, LuCopy, LuRefreshCw } from 'react-icons/lu';
import { FiAlertCircle } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';



const MentorCouponsPage = () => {
    const { isDark } = useTheme();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/coupons`);
            const data = await res.json();
            if (data.success) {
                setCoupons(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        alert('Code copied!');
    };

    const filteredCoupons = coupons.filter(c =>
        c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isExpired = (endDate) => new Date(endDate) < new Date();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Coupon Management
                        </h1>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">Mentor</span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        View discount coupons (Read Only)
                    </p>
                </div>
                <button
                    onClick={fetchCoupons}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                >
                    <LuRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Mentor Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <FiAlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-800">
                    <span className="font-semibold">Note:</span> As a Mentor, you can view coupons but cannot create, edit, or delete them. Contact an Administrator for coupon management.
                </p>
            </div>

            {/* Search */}
            <div className={`relative max-w-md ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search coupons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-red-500`}
                />
            </div>

            {/* Coupons Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                </div>
            ) : filteredCoupons.length === 0 ? (
                <div className={`text-center py-20 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <LuTag size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No coupons found</p>
                    <p className="text-sm">No active coupons available</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCoupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className={`relative p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-all`}
                        >
                            {/* Status Badge */}
                            <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold ${!coupon.isActive
                                ? 'bg-gray-100 text-gray-500'
                                : isExpired(coupon.endDate)
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-green-100 text-green-600'
                                }`}>
                                {!coupon.isActive ? 'Inactive' : isExpired(coupon.endDate) ? 'Expired' : 'Active'}
                            </div>

                            {/* Code */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-emerald-500 flex items-center justify-center text-white">
                                    {coupon.discountType === 'percentage' ? <LuPercent size={22} /> : <LuTag size={22} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {coupon.code}
                                        </span>
                                        <button onClick={() => copyCode(coupon.code)} className="text-gray-400 hover:text-red-500">
                                            <LuCopy size={14} />
                                        </button>
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{coupon.name}</p>
                                </div>
                            </div>

                            {/* Discount Value */}
                            <div className={`text-2xl font-bold mb-3 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `?${coupon.discountValue} OFF`}
                            </div>

                            {/* Details */}
                            <div className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {coupon.minPurchase > 0 && (
                                    <p>Min. Purchase: ?{coupon.minPurchase}</p>
                                )}
                                {coupon.maxDiscount && (
                                    <p>Max Discount: ?{coupon.maxDiscount}</p>
                                )}
                                <div className="flex items-center gap-2">
                                    <LuCalendar size={14} />
                                    <span>Valid till: {new Date(coupon.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <LuUsers size={14} />
                                    <span>Used: {coupon.usedCount || 0}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MentorCouponsPage;


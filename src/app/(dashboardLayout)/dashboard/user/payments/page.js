'use client';

import React, { useState } from 'react';
import {
    FiCreditCard, FiDollarSign, FiClock, FiCheckCircle,
    FiAlertCircle, FiDownload, FiLoader, FiFilter,
    FiSearch, FiArrowRight, FiFileText, FiGlobe, FiCode, FiShoppingBag
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

export default function UserPaymentsPage() {
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('all');

    // Sample payment history including Softwares and Websites
    const payments = [
        {
            id: 'TRX-98231',
            item: 'Ultimate Admin Dashboard Template',
            category: 'website',
            date: 'Dec 28, 2024',
            amount: 5500,
            status: 'completed',
            method: 'bKash'
        },
        {
            id: 'TRX-77120',
            item: 'Video Editing Master Pipeline',
            category: 'software',
            date: 'Dec 25, 2024',
            amount: 3200,
            status: 'completed',
            method: 'Nagad'
        },
        {
            id: 'TRX-66102',
            item: 'Full Stack React & Next.js Pro',
            category: 'course',
            date: 'Dec 20, 2024',
            amount: 4500,
            status: 'completed',
            method: 'Card'
        },
        {
            id: 'TRX-55091',
            item: '3D Motion Assets Pack',
            category: 'software',
            date: 'Dec 15, 2024',
            amount: 1500,
            status: 'pending',
            method: 'bKash'
        }
    ];

    const stats = {
        totalSpent: payments.filter(p => p.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0),
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        completedPayments: payments.filter(p => p.status === 'completed').length,
    };

    const filteredPayments = activeTab === 'all'
        ? payments
        : payments.filter(p => p.category === activeTab);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600';
            case 'pending': return isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600';
            case 'failed': return isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'website': return <FiGlobe className="text-blue-500" />;
            case 'software': return <FiCode className="text-purple-500" />;
            case 'course': return <FiFileText className="text-indigo-500" />;
            default: return <FiShoppingBag />;
        }
    };

    const cardClass = `rounded-2xl border transition-all duration-300 ${isDark ? 'bg-slate-800/50 border-white/5 shadow-xl' : 'bg-white border-slate-200/60 shadow-sm'}`;

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-black outfit tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Billing & Invoices
                    </h1>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Manage your purchase history and download invoices
                    </p>
                </div>
            </div>

            {/* Stats Overiew */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className={`${cardClass} p-6 relative overflow-hidden group`}>
                    <div className="relative z-10">
                        <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Cumulative Spent</p>
                        <h3 className={`text-3xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>?{stats.totalSpent.toLocaleString()}</h3>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                <FiCheckCircle /> Secured
                            </span>
                        </div>
                    </div>
                </div>
                <div className={`${cardClass} p-6`}>
                    <p className={`text-[10px] font-black uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Pending Approval</p>
                    <h3 className={`text-3xl font-black outfit ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.pendingPayments}</h3>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-amber-500 font-bold flex items-center gap-1">
                            <FiClock /> Verification in progress
                        </span>
                    </div>
                </div>
                <div className={`${cardClass} p-6 bg-gradient-to-br from-indigo-500 to-purple-600 border-none shadow-lg shadow-indigo-500/20`}>
                    <p className="text-[10px] font-black uppercase tracking-wider mb-2 text-indigo-50/80">Active Subscriptions</p>
                    <h3 className="text-3xl font-black outfit text-white">0</h3>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-white/80 font-bold">Standard Account</span>
                    </div>
                </div>
            </div>

            {/* Transactions Table Section */}
            <div className={`${cardClass} overflow-hidden`}>
                <div className="p-6 border-b border-white/5 dark:border-white/5 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-black outfit uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>History</span>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl ml-4">
                            {['all', 'course', 'software', 'website'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                        : 'text-slate-500 hover:text-indigo-500'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search ID..."
                                className={`pl-10 pr-4 py-2 rounded-xl text-xs font-bold w-48 border-none ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-slate-50 text-slate-700 shadow-inner'
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type/ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 dark:divide-white/5">
                            {filteredPayments.map((p) => (
                                <tr key={p.id} className={`group hover:bg-slate-500/5 transition-colors`}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                {getCategoryIcon(p.category)}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{p.item}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{p.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${p.category === 'website' ? 'bg-blue-500/10 text-blue-500' :
                                            p.category === 'software' ? 'bg-purple-500/10 text-purple-500' :
                                                'bg-indigo-500/10 text-indigo-500'
                                            }`}>
                                            {p.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-xs font-bold text-slate-500">
                                            <p>{p.id}</p>
                                            <p className="text-[10px] font-medium opacity-60">via {p.method}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <p className={`text-sm font-black outfit ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>?{p.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <button className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                            <FiDownload size={16} title="Download Invoice" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="py-20 text-center">
                        <FiShoppingBag size={48} className="mx-auto text-slate-300 mb-4 opacity-20" />
                        <h3 className={`text-lg font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No results found</h3>
                        <p className="text-sm text-slate-500">No transactions match your criteria.</p>
                    </div>
                )}
            </div>

            {/* Note Section */}
            <div className={`p-6 rounded-[2rem] border border-dashed text-center ${isDark ? 'border-slate-700 bg-slate-800/10' : 'border-slate-200 bg-slate-50/50'}`}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-medium">
                    <FiAlertCircle className="text-indigo-500" size={20} />
                    <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        Don't see a recent transaction? It might be pending manual verification (usually takes <span className="text-indigo-500 font-bold underline">1-6 hours</span>).
                    </p>
                    <button className="text-indigo-500 font-bold hover:underline">Contact Support</button>
                </div>
            </div>
        </div>
    );
}

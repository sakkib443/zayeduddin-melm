'use client';

import React, { useState, useEffect } from 'react';
import { API_URL } from '@/config/api';
import { useLanguage } from '@/context/LanguageContext';
import { FiShield, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function PrivacyPage() {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();

    useEffect(() => {
        fetchPage();
    }, []);

    const fetchPage = async () => {
        try {
            const res = await fetch(`${API_URL}/legal-pages/privacy`);
            const data = await res.json();
            if (data.success) setPage(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const title = language === 'bn' ? (page?.titleBn || page?.title) : page?.title;
    const content = language === 'bn' ? (page?.contentBn || page?.content) : page?.content;

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#021E14] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 py-16 overflow-hidden border-b border-emerald-100 dark:border-slate-700">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(2,30,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(2,30,20,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                <div className="container mx-auto px-4 lg:px-16 relative z-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-[#021E14] text-sm mb-6 transition-colors">
                        <FiArrowLeft size={16} /> {language === 'bn' ? 'হোমে ফিরুন' : 'Back to Home'}
                    </Link>
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                            <FiShield className="text-emerald-600 dark:text-emerald-400" size={24} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[#021E14] dark:text-white">{title || 'Privacy Policy'}</h1>
                    </div>
                    {page?.updatedAt && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center gap-2 mt-3">
                            <FiCalendar size={14} />
                            {language === 'bn' ? 'সর্বশেষ আপডেট: ' : 'Last Updated: '}
                            {new Date(page.updatedAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>
            </div>
            {/* Content */}
            <div className="container mx-auto px-4 lg:px-16 py-12">
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 lg:p-12 shadow-sm">
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none
              prose-headings:text-[#021E14] dark:prose-headings:text-white prose-headings:font-bold
              prose-h2:text-2xl prose-h2:border-b prose-h2:border-slate-200 prose-h2:dark:border-slate-700 prose-h2:pb-3 prose-h2:mb-6
              prose-h3:text-lg prose-h3:mt-8
              prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
              prose-li:text-slate-600 dark:prose-li:text-slate-300
              prose-strong:text-[#021E14] dark:prose-strong:text-[#D4AF37]
              prose-a:text-[#021E14] prose-a:underline hover:prose-a:text-[#D4AF37]
              prose-ul:list-disc prose-ul:pl-5"
                        dangerouslySetInnerHTML={{ __html: content || '<p>Content not available.</p>' }}
                    />
                </div>
            </div>
        </div>
    );
}

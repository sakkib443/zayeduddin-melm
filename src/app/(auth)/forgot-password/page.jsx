'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft, FiCheckCircle, FiLoader, FiShield } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/config/api';
import Logo from '@/components/sheard/Logo';

export default function ForgotPasswordPage() {
    const { language } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const bengaliClass = language === 'bn' ? 'hind-siliguri' : '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.message || (language === 'bn' ? 'ইমেইল পাঠাতে সমস্যা হয়েছে।' : 'Failed to send reset email.'));
            }
        } catch (err) {
            setError(language === 'bn' ? 'সার্ভারের সাথে যোগাযোগ করতে সমস্যা হচ্ছে।' : 'Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#e8f9f9] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 lg:p-10 relative">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E62D26]/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#38a89d]/5 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <div className="mb-8 flex justify-center">
                        <Logo color="#E62D26" align="center" size="large" />
                    </div>

                    {!success ? (
                        <>
                            <div className="mb-8 text-center">
                                <h2 className={`text-2xl font-bold text-gray-800 mb-2 outfit ${bengaliClass}`}>
                                    {language === 'bn' ? 'পাসওয়ার্ড উদ্ধার' : 'Forgot Password?'}
                                </h2>
                                <p className={`text-gray-500 text-sm ${bengaliClass}`}>
                                    {language === 'bn'
                                        ? 'চিন্তা করবেন না! আপনার ইমেইল দিন এবং আমরা আপনাকে একটি পাসওয়ার্ড রিসেট লিংক পাঠাব।'
                                        : 'No worries! Enter your email and we\'ll send you a password reset link.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${bengaliClass}`}>
                                        {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder={language === 'bn' ? 'আপনার ইমেইল' : 'you@example.com'}
                                            className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none transition ${bengaliClass}`}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className={`p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center ${bengaliClass}`}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E62D26] to-[#38a89d] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition ${bengaliClass}`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <FiLoader className="animate-spin" />
                                            {language === 'bn' ? 'লিংক পাঠানো হচ্ছে...' : 'Sending Link...'}
                                        </span>
                                    ) : (
                                        language === 'bn' ? 'রিসেট লিংক পাঠান' : 'Send Reset Link'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                    <FiCheckCircle className="text-green-500" size={45} />
                                </div>
                            </div>
                            <h2 className={`text-2xl font-bold text-gray-800 mb-3 ${bengaliClass}`}>
                                {language === 'bn' ? 'ইমেইল পাঠানো হয়েছে!' : 'Check Your Box!'}
                            </h2>
                            <p className={`text-gray-600 mb-8 leading-relaxed ${bengaliClass}`}>
                                {language === 'bn'
                                    ? `আমরা ${email} ঠিকানায় একটি পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি। অনুগ্রহ করে আপনার ইনবক্স চেক করুন।`
                                    : `We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.`}
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className={`text-[#E62D26] font-semibold hover:underline text-sm ${bengaliClass}`}
                            >
                                {language === 'bn' ? 'অন্য ইমেইল ব্যবহার করুন' : 'Try another email address'}
                            </button>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <Link href="/login" className={`inline-flex items-center gap-2 text-gray-500 hover:text-[#E62D26] transition font-medium ${bengaliClass}`}>
                            <FiArrowLeft size={16} />
                            {language === 'bn' ? 'লগইন পেজে ফিরে যান' : 'Back to Login'}
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <FiShield />
                        <span>{language === 'bn' ? 'নিরাপদ অ্যাকাউন্ট রিকভারি' : 'Secure Account Recovery'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

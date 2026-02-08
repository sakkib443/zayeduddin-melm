'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiCheckCircle, FiXCircle, FiLoader, FiMail, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/config/api';
import Logo from '@/components/sheard/Logo';

const VerifyEmailContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language } = useLanguage();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [resending, setResending] = useState(false);

    const token = searchParams.get('token');
    const bengaliClass = language === 'bn' ? 'hind-siliguri' : '';

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage(language === 'bn' ? 'ভেরিফিকেশন টোকেন পাওয়া যায়নি।' : 'Verification token is missing.');
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage(data.message || (language === 'bn' ? 'আপনার ইমেইল সফলভাবে ভেরিফাই করা হয়েছে!' : 'Your email has been successfully verified!'));
                } else {
                    setStatus('error');
                    setMessage(data.message || (language === 'bn' ? 'ভেরিফিকেশন টোকেনটি ভুল বা মেয়াদ শেষ হয়ে গেছে।' : 'Invalid or expired verification token.'));
                }
            } catch (err) {
                setStatus('error');
                setMessage(language === 'bn' ? 'সার্ভারের সাথে যোগাযোগ করতে সমস্যা হচ্ছে।' : 'Failed to connect to the server.');
            }
        };

        verifyToken();
    }, [token, language]);

    const handleResend = async (e) => {
        e.preventDefault();
        if (!email) {
            alert(language === 'bn' ? 'অনুগ্রহ করে আপনার ইমেইল লিখুন।' : 'Please enter your email.');
            return;
        }

        setResending(true);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(language === 'bn' ? 'ভেরিফিকেশন ইমেইল পুনরায় পাঠানো হয়েছে।' : 'Verification email has been resent.');
            } else {
                alert(data.message || (language === 'bn' ? 'ইমেইল পাঠাতে সমস্যা হয়েছে।' : 'Failed to resend email.'));
            }
        } catch (err) {
            alert(language === 'bn' ? 'ভুল হয়েছে।' : 'Something went wrong.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#e8f9f9] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 lg:p-10 text-center">
                <div className="mb-8 flex justify-center">
                    <Logo color="#E62D26" align="center" size="large" />
                </div>

                {status === 'verifying' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <FiLoader className="text-[#38a89d] animate-spin" size={60} />
                        </div>
                        <h2 className={`text-2xl font-bold text-gray-800 ${bengaliClass}`}>
                            {language === 'bn' ? 'ভেরিফাই করা হচ্ছে...' : 'Verifying Your Email...'}
                        </h2>
                        <p className={`text-gray-500 ${bengaliClass}`}>
                            {language === 'bn' ? 'অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।' : 'Please wait a moment while we verify your account.'}
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <FiCheckCircle className="text-green-500" size={45} />
                            </div>
                        </div>
                        <h2 className={`text-2xl font-bold text-gray-800 ${bengaliClass}`}>
                            {language === 'bn' ? 'সফল হয়েছে!' : 'Verification Success!'}
                        </h2>
                        <p className={`text-gray-600 ${bengaliClass}`}>
                            {message}
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/login"
                                className={`block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E62D26] to-[#38a89d] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition ${bengaliClass}`}
                            >
                                {language === 'bn' ? 'লগইন করুন' : 'Go to Login'}
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <FiXCircle className="text-red-500" size={45} />
                            </div>
                        </div>
                        <h2 className={`text-2xl font-bold text-gray-800 ${bengaliClass}`}>
                            {language === 'bn' ? 'দুঃখিত!' : 'Verification Failed'}
                        </h2>
                        <p className={`text-red-500 text-sm font-medium ${bengaliClass}`}>
                            {message}
                        </p>

                        <div className="pt-6 border-t border-gray-100 text-left">
                            <p className={`text-xs text-gray-500 mb-4 ${bengaliClass}`}>
                                {language === 'bn' ? 'লিংক কাজ না করলে আপনার ইমেইল লিখে পুনরায় পাঠান:' : 'If the link doesn\'t work, enter your email to resend:'}
                            </p>
                            <form onSubmit={handleResend} className="space-y-3">
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        placeholder={language === 'bn' ? 'আপনার ইমেইল' : 'Your email'}
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#E62D26] focus:ring-2 focus:ring-[#E62D26]/20 outline-none transition text-sm ${bengaliClass}`}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={resending}
                                    className={`w-full py-2.5 rounded-xl border-2 border-[#E62D26] text-[#E62D26] font-semibold hover:bg-[#E62D26] hover:text-white transition disabled:opacity-50 text-sm ${bengaliClass}`}
                                >
                                    {resending ? (language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Resending...') : (language === 'bn' ? 'ইমেইল পুনরায় পাঠান' : 'Resend Verification Email')}
                                </button>
                            </form>
                        </div>

                        <div className="pt-4">
                            <Link href="/" className={`inline-flex items-center gap-2 text-gray-500 hover:text-[#E62D26] transition text-sm ${bengaliClass}`}>
                                <FiArrowLeft size={16} />
                                {language === 'bn' ? 'হোমপেজে ফিরে যান' : 'Back to Home'}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <FiLoader className="text-[#E62D26] animate-spin" size={40} />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}

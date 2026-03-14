'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiLock, FiCheckCircle, FiLoader, FiEye, FiEyeOff, FiCheck, FiShield } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/config/api';
import Logo from '@/components/sheard/Logo';

const ResetPasswordContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { language } = useLanguage();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error
    const [error, setError] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    const bengaliClass = language === 'bn' ? 'hind-siliguri' : '';

    useEffect(() => {
        const pass = formData.password;
        setPasswordRequirements({
            length: pass.length >= 8,
            uppercase: /[A-Z]/.test(pass),
            lowercase: /[a-z]/.test(pass),
            number: /\d/.test(pass),
            special: /[@$!%*?&]/.test(pass)
        });
    }, [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Object.values(passwordRequirements).every(Boolean)) {
            return setError(language === 'bn' ? 'পাসওয়ার্ড সব শর্ত পূরণ করেনি।' : 'Password does not meet all requirements.');
        }

        if (formData.password !== formData.confirmPassword) {
            return setError(language === 'bn' ? 'পাসওয়ার্ড মিলছে না।' : 'Passwords do not match.');
        }

        if (!token || !email) {
            return setError(language === 'bn' ? 'টোকেন বা ইমেইল পাওয়া যায়নি।' : 'Token or email is missing.');
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setError(data.message || (language === 'bn' ? 'পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে।' : 'Failed to reset password.'));
            }
        } catch (err) {
            setError(language === 'bn' ? 'সার্ভার ত্রুটি।' : 'Server error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const RequirementItem = ({ met, text }) => (
        <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-green-500' : 'text-gray-400'}`}>
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${met ? 'bg-green-500 border-green-500' : 'border-gray-200'}`}>
                {met && <FiCheck className="text-white" size={10} />}
            </div>
            <span>{text}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#e8f9f9] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-8 lg:p-10">
                <div className="mb-8 flex justify-center">
                    <Logo color="#021E14" align="center" size="large" />
                </div>

                {status === 'success' ? (
                    <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                <FiCheckCircle className="text-green-500" size={45} />
                            </div>
                        </div>
                        <h2 className={`text-2xl font-bold text-gray-800 mb-3 ${bengaliClass}`}>
                            {language === 'bn' ? 'পাসওয়ার্ড রিসেট সফল!' : 'Password Updated!'}
                        </h2>
                        <p className={`text-gray-600 mb-4 ${bengaliClass}`}>
                            {language === 'bn' ? 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে। আপনাকে লগইন পেজে নিয়ে যাওয়া হচ্ছে...' : 'Your password has been reset successfully. Redirecting you to login...'}
                        </p>
                        <div className="flex justify-center pt-2">
                            <FiLoader className="text-[#38a89d] animate-spin" size={24} />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 text-center">
                            <h2 className={`text-2xl font-bold text-gray-800 mb-2 outfit ${bengaliClass}`}>
                                {language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'Reset Password'}
                            </h2>
                            <p className={`text-gray-500 text-sm ${bengaliClass}`}>
                                {language === 'bn' ? 'অনুগ্রহ করে আপনার অ্যাকাউন্টের জন্য একটি নতুন শক্তিশালী পাসওয়ার্ড তৈরি করুন।' : 'Please create a new strong password for your account.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${bengaliClass}`}>
                                    {language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className={`w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-gray-400 hover:text-[#021E14] transition"
                                    >
                                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                {/* Requirements Grid */}
                                <div className="mt-3 grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <RequirementItem met={passwordRequirements.length} text={language === 'bn' ? '৮+ অক্ষর' : '8+ characters'} />
                                    <RequirementItem met={passwordRequirements.uppercase} text={language === 'bn' ? 'বড় হাতের অক্ষর' : 'Uppercase'} />
                                    <RequirementItem met={passwordRequirements.lowercase} text={language === 'bn' ? 'ছোট হাতের অক্ষর' : 'Lowercase'} />
                                    <RequirementItem met={passwordRequirements.number} text={language === 'bn' ? 'সংখ্যা' : 'Number'} />
                                    <RequirementItem met={passwordRequirements.special} text={language === 'bn' ? 'বিশেষ চিহ্ন (@$!%)' : 'Special symbol'} />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium text-gray-700 mb-2 ${bengaliClass}`}>
                                    {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="••••••••"
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#021E14] focus:ring-2 focus:ring-[#021E14]/20 outline-none transition ${bengaliClass}`}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className={`p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium ${bengaliClass}`}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-[#021E14] to-[#38a89d] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition ${bengaliClass}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <FiLoader className="animate-spin" />
                                        {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন হচ্ছে...' : 'Updating Password...'}
                                    </span>
                                ) : (
                                    language === 'bn' ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Password'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <FiShield />
                            <span>{language === 'bn' ? 'পাসওয়ার্ড এখন এনক্রিপ্টেড' : 'Secure Encrypted Connection'}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <FiLoader className="text-[#021E14] animate-spin" size={40} />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}

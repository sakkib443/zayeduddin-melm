"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@/redux/cartSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    LuShieldCheck, LuPackage, LuCreditCard, LuChevronLeft,
    LuBadgeCheck, LuSmartphone, LuLoader, LuArrowRight,
    LuTag, LuCheck, LuX, LuLock, LuUser, LuMail, LuPhone,
    LuMapPin, LuShoppingBag
} from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';



const CheckoutContent = () => {
    const { items: cartItems, totalAmount: cartTotal } = useSelector((state) => state.cart || { items: [], totalAmount: 0 });
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const dispatch = useDispatch();
    const router = useRouter();
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(!!courseId);

    // Payment States
    const [paymentMethod, setPaymentMethod] = useState('manual');
    const [manualMethod, setManualMethod] = useState('bkash');
    const [paymentDetails, setPaymentDetails] = useState({
        senderNumber: '',
        transactionId: '',
        time: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [checkoutItems, setCheckoutItems] = useState([]);
    const [totalValue, setTotalValue] = useState(0);

    // Coupon states
    const [couponCode, setCouponCode] = useState('');
    const [couponApplying, setCouponApplying] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Auth Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to proceed with payment");
            router.push(`/login?redirect=/checkout${courseId ? `?courseId=${courseId}` : ''}`);
        }
    }, [router, courseId]);

    // Handle single course or cart items
    useEffect(() => {
        if (courseId) {
            setPageLoading(true);
            const fetchCourse = async () => {
                try {
                    const res = await fetch(`${API_URL}/courses/${courseId}`);
                    const result = await res.json();
                    if (res.ok && result.data) {
                        const course = result.data;
                        const item = {
                            id: course._id || course.id,
                            title: course.title,
                            type: 'course',
                            price: course.price || (parseInt(course.fee?.replace(/[^\d]/g, '') || 0)),
                            image: course.thumbnail || course.image
                        };
                        setCheckoutItems([item]);
                        setTotalValue(item.price);
                    } else {
                        toast.error("Failed to load course details");
                        router.push('/courses');
                    }
                } catch (error) {
                    console.error("Error fetching course:", error);
                } finally {
                    setPageLoading(false);
                }
            };
            fetchCourse();
        } else {
            setCheckoutItems(cartItems);
            setTotalValue(cartTotal);
            setPageLoading(false);
        }
    }, [courseId, cartItems, cartTotal, router]);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user) {
            setFormData({
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePaymentDetailChange = (e) => {
        setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    };

    // Apply Coupon Handler
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setCouponApplying(true);
        try {
            const res = await fetch(`${API_URL}/coupons/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode.trim(),
                    cartTotal: totalValue,
                    productType: checkoutItems[0]?.type || 'all'
                })
            });

            const data = await res.json();

            if (data.success && data.data?.valid) {
                setAppliedCoupon({
                    code: data.data.couponCode,
                    discountType: data.data.discountType,
                    discountValue: data.data.discountValue
                });
                setDiscountAmount(data.data.discount);
                toast.success(`Coupon applied! You save ৳${data.data.discount}`);
            } else {
                toast.error(data.message || 'Invalid coupon code');
            }
        } catch (error) {
            console.error('Coupon error:', error);
            toast.error('Failed to apply coupon');
        } finally {
            setCouponApplying(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode('');
        toast.success('Coupon removed');
    };

    const finalAmount = totalValue - discountAmount;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        const BASE_URL = API_URL;

        try {
            // Step 1: Create Order
            const orderData = {
                items: checkoutItems.map(item => ({
                    productId: item.id,
                    productType: item.type,
                    title: item.title,
                    price: item.price,
                    image: item.image
                })),
                paymentMethod: paymentMethod === 'manual' ? 'manual' : 'direct',
                paymentStatus: 'pending'
            };

            const orderRes = await fetch(`${BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const orderResult = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderResult.message || 'Failed to create order');
            }

            const orderId = orderResult.data._id;

            if (paymentMethod === 'manual') {
                const manualPaymentData = {
                    method: manualMethod,
                    ...paymentDetails
                };

                const manualRes = await fetch(`${BASE_URL}/orders/${orderId}/manual-payment`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(manualPaymentData)
                });

                if (!manualRes.ok) {
                    const errorData = await manualRes.json();
                    throw new Error(errorData.message || 'Failed to submit manual payment details');
                }

                toast.success('Payment submitted for verification! 🚀');
                setIsSuccess(true);
                if (!courseId) dispatch(clearCart());

                setTimeout(() => {
                    router.push('/dashboard/user/courses');
                }, 3000);

            } else {
                toast.success('Order placed! Redirecting...');
                setIsSuccess(true);
                if (!courseId) dispatch(clearCart());

                setTimeout(() => {
                    router.push('/dashboard/user/courses');
                }, 3000);
            }

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <LuLoader className="animate-spin text-[#E62D26]" size={40} />
                    <p className="text-slate-500 font-normal uppercase tracking-widest text-[10px]">Preparing Secure Checkout...</p>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-md flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-500/20">
                    <LuBadgeCheck className="text-emerald-500 text-4xl" />
                </div>
                <h1 className={`text-2xl font-bold text-slate-800 dark:text-white mb-3 ${bengaliClass}`}>
                    {language === 'bn' ? 'আদেশ সফল হয়েছে!' : 'Payment Successful!'}
                </h1>
                <p className={`text-slate-500 dark:text-slate-400 text-sm font-normal text-center max-w-sm mb-8 leading-relaxed ${bengaliClass}`}>
                    {language === 'bn'
                        ? 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। ভেরিফিকেশনের পর কোর্সটি সক্রিয় হবে।'
                        : 'Your purchase is successful. Access will be granted shortly after verification.'}
                </p>
                <button
                    onClick={() => router.push('/dashboard/user/courses')}
                    className={`px-8 py-3 bg-[#E62D26] text-white rounded-md font-normal text-sm uppercase tracking-widest hover:bg-[#c41e18] transition-all flex items-center gap-3 ${bengaliClass}`}
                >
                    {language === 'bn' ? 'আমার কোর্সগুলো দেখুন' : 'Go to My Courses'} <LuArrowRight />
                </button>
            </div>
        );
    }

    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-md flex items-center justify-center mb-6 border border-slate-100 dark:border-white/10">
                    <LuPackage className="text-slate-400 text-2xl" />
                </div>
                <h2 className={`text-xl font-bold text-slate-800 dark:text-white mb-6 ${bengaliClass}`}>
                    {language === 'bn' ? 'আপনার চেকআউট খালি' : 'No items to checkout'}
                </h2>
                <button onClick={() => router.push('/courses')} className={`px-8 py-3 bg-[#E62D26] text-white rounded-md font-normal text-sm uppercase tracking-widest hover:bg-[#c41e18] transition-all ${bengaliClass}`}>
                    Browse Courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-16">

                {/* Simplified Header Like Contact Page Info Title */}
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/10 text-slate-400 hover:text-[#E62D26] transition-all">
                        <LuChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className={`text-2xl font-bold text-slate-800 dark:text-white outfit ${bengaliClass}`}>
                            {language === 'bn' ? 'চেকআউট' : 'Secure Checkout'}
                        </h1>
                        <p className={`text-[10px] text-slate-500 uppercase tracking-[0.2em] ${bengaliClass}`}>
                            {language === 'bn' ? 'ভর্তি প্রক্রিয়া সম্পন্ন করুন' : 'Complete your enrollment'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left: Form */}
                    <div className="flex-1 w-full space-y-6">
                        <div className="bg-white dark:bg-white/5 p-6 lg:p-8 rounded-md border border-slate-200 dark:border-white/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-slate-50 dark:bg-white/10 rounded-md flex items-center justify-center text-[#E62D26] border border-slate-100 dark:border-white/10">
                                    <LuUser size={20} />
                                </div>
                                <h2 className={`text-lg font-bold text-slate-800 dark:text-white ${bengaliClass}`}>
                                    {language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Details'}
                                </h2>
                            </div>

                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className={`text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest ${bengaliClass}`}>
                                            {language === 'bn' ? 'পুরো নাম' : 'Full Name'}
                                        </label>
                                        <div className="relative group">
                                            <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text" required name="fullName" value={formData.fullName} onChange={handleInputChange}
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md focus:border-[#E62D26] focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-normal text-slate-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest ${bengaliClass}`}>
                                            {language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                                        </label>
                                        <div className="relative group">
                                            <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="email" required name="email" value={formData.email} onChange={handleInputChange}
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md focus:border-[#E62D26] focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-normal text-slate-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest ${bengaliClass}`}>
                                            {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                                        </label>
                                        <div className="relative group">
                                            <LuPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text" required name="phone" value={formData.phone} onChange={handleInputChange}
                                                className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md focus:border-[#E62D26] focus:bg-white dark:focus:bg-white/10 outline-none transition-all font-normal text-slate-700 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-6">
                                    <h3 className={`text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest ${bengaliClass}`}>
                                        {language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('manual')}
                                            className={`p-5 rounded-md border-2 flex items-center gap-4 transition-all ${paymentMethod === 'manual'
                                                ? 'border-[#E62D26] bg-[#E62D26]/5'
                                                : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className="w-10 h-10 bg-[#E62D26] rounded-md flex items-center justify-center text-white">
                                                <LuSmartphone size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold text-slate-800 dark:text-white uppercase tracking-tight text-xs ${bengaliClass}`}>
                                                    {language === 'bn' ? 'ম্যানুয়াল' : 'Manual'}
                                                </p>
                                                <p className="text-[9px] font-normal text-slate-400 uppercase tracking-widest">bKash/Rocket</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('direct')}
                                            className={`p-5 rounded-md border-2 flex items-center gap-4 transition-all ${paymentMethod === 'direct'
                                                ? 'border-slate-800 dark:border-white bg-slate-800 dark:bg-white/20'
                                                : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-slate-200'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${paymentMethod === 'direct' ? 'bg-white text-slate-800' : 'bg-slate-800 text-white dark:bg-white/10'}`}>
                                                <LuLock size={20} />
                                            </div>
                                            <div className="text-left">
                                                <p className={`font-bold uppercase tracking-tight text-xs ${paymentMethod === 'direct' ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                                                    {language === 'bn' ? 'অনলাইন' : 'Online'}
                                                </p>
                                                <p className="text-[9px] font-normal text-slate-400 uppercase tracking-widest">Automatic</p>
                                            </div>
                                        </button>
                                    </div>

                                    {paymentMethod === 'manual' && (
                                        <div className="mt-6 p-6 lg:p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-md bg-slate-50 dark:bg-white/[0.02] space-y-8">
                                            <div>
                                                <h4 className={`text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ${bengaliClass}`}>
                                                    {language === 'bn' ? 'পেমেন্ট গেটওয়ে' : 'Choose Gateway'}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { id: 'bkash', label: 'bKash', color: 'bg-[#d12053]' },
                                                        { id: 'rocket', label: 'Rocket', color: 'bg-[#8c3494]' },
                                                        { id: 'nagad', label: 'Nagad', color: 'bg-[#f7941d]' }
                                                    ].map((method) => (
                                                        <button
                                                            key={method.id}
                                                            type="button"
                                                            onClick={() => setManualMethod(method.id)}
                                                            className={`px-4 py-2 rounded-md font-bold text-[10px] transition-all flex items-center gap-2 ${manualMethod === method.id
                                                                ? `${method.color} text-white`
                                                                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                                                                }`}
                                                        >
                                                            {method.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-5 bg-white dark:bg-white/5 rounded-md border border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-md flex items-center justify-center text-white text-xl font-bold ${manualMethod === 'bkash' ? 'bg-[#d12053]' :
                                                        manualMethod === 'rocket' ? 'bg-[#8c3494]' : 'bg-[#f7941d]'
                                                        }`}>
                                                        {manualMethod[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">01730481212</p>
                                                        <p className={`text-[10px] font-normal text-slate-400 uppercase tracking-widest ${bengaliClass}`}>
                                                            {language === 'bn' ? 'পার্সোনাল নম্বর' : 'Personal Number'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className={`text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest ${bengaliClass}`}>
                                                        {language === 'bn' ? 'সেন্ডার নম্বর' : 'Sender Number'}
                                                    </label>
                                                    <input
                                                        type="text" required name="senderNumber" value={paymentDetails.senderNumber} onChange={handlePaymentDetailChange}
                                                        className="w-full px-5 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md focus:border-[#E62D26] outline-none transition-all font-normal text-slate-700 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={`text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest ${bengaliClass}`}>
                                                        {language === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}
                                                    </label>
                                                    <input
                                                        type="text" required name="transactionId" value={paymentDetails.transactionId} onChange={handlePaymentDetailChange}
                                                        className="w-full px-5 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md focus:border-[#E62D26] outline-none transition-all font-normal text-slate-700 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={`text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest ${bengaliClass}`}>
                                                        {language === 'bn' ? 'পেমেন্ট সময়' : 'Time'}
                                                    </label>
                                                    <input
                                                        type="time" required name="time" value={paymentDetails.time} onChange={handlePaymentDetailChange}
                                                        className="w-full px-5 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md focus:border-[#E62D26] outline-none transition-all font-normal text-slate-700 dark:text-white text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className={`text-[10px] font-bold text-slate-400 mb-2 block uppercase tracking-widest ${bengaliClass}`}>
                                                        {language === 'bn' ? 'পেমেন্ট তারিখ' : 'Date'}
                                                    </label>
                                                    <input
                                                        type="date" required name="date" value={paymentDetails.date} onChange={handlePaymentDetailChange}
                                                        className="w-full px-5 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md focus:border-[#E62D26] outline-none transition-all font-normal text-slate-700 dark:text-white text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit" disabled={loading}
                                        className={`w-full py-4 bg-[#E62D26] text-white rounded-md font-normal text-sm uppercase tracking-widest hover:bg-[#c41e18] transition-all flex items-center justify-center gap-3 ${bengaliClass}`}
                                    >
                                        {loading ? <LuLoader className="animate-spin" size={18} /> : (language === 'bn' ? 'ভর্তি নিশ্চিত করুন' : 'Confirm Enrollment')}
                                        {!loading && <LuArrowRight size={18} />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white dark:bg-white/5 p-6 lg:p-8 rounded-md border border-slate-200 dark:border-white/10 shadow-sm space-y-8 lg:sticky lg:top-8">
                            <h3 className={`text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-white/5 pb-6 outfit ${bengaliClass}`}>
                                {language === 'bn' ? 'অর্ডার রিভিউ' : 'Order Summary'}
                            </h3>

                            <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                {checkoutItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-14 h-14 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-white/5 shrink-0">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-xs font-normal text-slate-800 dark:text-white leading-tight mb-1 line-clamp-2 ${bengaliClass}`}>{item.title}</h4>
                                            <span className="text-[8px] font-bold text-[#E62D26] bg-[#E62D26]/5 px-1.5 py-0.5 rounded-md uppercase tracking-widest">{item.type}</span>
                                        </div>
                                        <div className="text-slate-800 dark:text-white font-bold text-sm">৳{item.price?.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 space-y-4 border-t border-slate-100 dark:border-white/5">
                                <div className="flex gap-2">
                                    <input
                                        type="text" placeholder="Coupon Code" value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-md text-[10px] font-bold uppercase focus:border-[#E62D26] outline-none"
                                    />
                                    <button
                                        onClick={handleApplyCoupon} disabled={couponApplying}
                                        className="px-4 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold text-[10px] rounded-md hover:bg-[#E62D26] dark:hover:bg-[#E62D26] dark:hover:text-white transition-all disabled:opacity-50"
                                    >
                                        Apply
                                    </button>
                                </div>

                                <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900 dark:text-white">৳{totalValue.toLocaleString()}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                        <span>Discount</span>
                                        <span>-৳{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-slate-800 dark:text-white font-bold uppercase text-xs ${bengaliClass}`}>
                                            {language === 'bn' ? 'মোট পেমেন্ট' : 'Total Amount'}
                                        </span>
                                        <span className="text-2xl font-black text-[#E62D26] outfit">৳{finalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-md border border-slate-100 dark:border-white/10">
                                <LuShieldCheck className="text-[#10B981] text-2xl shrink-0" />
                                <p className={`text-[9px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wider ${bengaliClass}`}>
                                    {language === 'bn'
                                        ? '১০০% নিরাপদ পেমেন্ট সলিউশন।'
                                        : 'Secure payment solution. Your data is protected.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckoutPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <LuLoader className="animate-spin text-[#E62D26]" size={40} />
                    <p className="text-slate-500 font-normal text-[10px]">Loading...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
};

export default CheckoutPage;


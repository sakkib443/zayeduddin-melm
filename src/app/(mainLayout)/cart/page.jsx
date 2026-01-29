"use client";

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '@/redux/cartSlice';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LuTrash2, LuShoppingBag, LuChevronRight, LuArrowLeft, LuShieldCheck, LuShoppingCart, LuArrowRight, LuCheck } from 'react-icons/lu';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

const CartPage = () => {
    const { items, totalAmount } = useSelector((state) => state.cart || { items: [], totalAmount: 0 });
    const dispatch = useDispatch();
    const router = useRouter();
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-20">
                <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-md flex items-center justify-center mb-6 border border-slate-100 dark:border-white/10">
                    <LuShoppingBag className="text-[#E62D26] text-3xl" />
                </div>
                <h2 className={`text-xl font-bold text-slate-800 dark:text-white mb-2 ${bengaliClass}`}>
                    {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
                </h2>
                <p className={`text-slate-500 dark:text-slate-400 mb-8 text-center max-w-xs text-sm font-normal ${bengaliClass}`}>
                    {language === 'bn' ? 'মনে হচ্ছে আপনি কার্টে কিছু যোগ করেননি।' : "Looks like you haven't added anything to your cart yet."}
                </p>
                <Link
                    href="/courses"
                    className={`px-8 py-3 bg-[#E62D26] text-white rounded-md font-normal text-sm uppercase tracking-widest hover:bg-[#c41e18] transition-all ${bengaliClass}`}
                >
                    {language === 'bn' ? 'কোর্সগুলো দেখুন' : 'Explore Courses'}
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-16">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/10 text-slate-400 hover:text-[#E62D26] transition-all">
                        <LuArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className={`text-2xl font-bold text-slate-800 dark:text-white outfit ${bengaliClass}`}>
                            {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
                        </h1>
                        <p className={`text-[10px] text-slate-500 uppercase tracking-[0.2em] ${bengaliClass}`}>
                            {language === 'bn' ? `${items.length} টি আইটেম যোগ করা হয়েছে` : `${items.length} Items Added`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Items List */}
                    <div className="flex-1 w-full space-y-4">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="group bg-white dark:bg-white/5 p-4 rounded-md border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-6 hover:border-[#E62D26]/20 transition-all duration-300">
                                    <div className="w-20 h-20 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-white/5">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-1 text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <span className="text-[8px] font-bold text-[#E62D26] bg-[#E62D26]/5 px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                                                {item.type}
                                            </span>
                                        </div>
                                        <h3 className={`text-base font-normal text-slate-800 dark:text-white group-hover:text-[#E62D26] transition-colors line-clamp-1 ${bengaliClass}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">Lifetime Access</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xl font-bold text-slate-800 dark:text-white">৳{item.price?.toLocaleString()}</span>
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            className="w-10 h-10 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500 rounded-md transition-all border border-slate-100 dark:border-white/10 flex items-center justify-center"
                                        >
                                            <LuTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => dispatch(clearCart())}
                                className={`text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-2 ${bengaliClass}`}
                            >
                                <LuTrash2 size={14} />
                                {language === 'bn' ? 'কার্ট পরিষ্কার করুন' : 'Clear Entire Cart'}
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white dark:bg-white/5 p-8 rounded-md border border-slate-200 dark:border-white/10 shadow-sm space-y-8 lg:sticky lg:top-8">
                            <h3 className={`text-lg font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-white/5 pb-6 outfit uppercase tracking-wider ${bengaliClass}`}>
                                {language === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${bengaliClass}`}>
                                        {language === 'bn' ? 'মোট মূল্য' : 'Subtotal'}
                                    </span>
                                    <span className="text-slate-800 dark:text-white font-bold">৳{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${bengaliClass}`}>
                                        {language === 'bn' ? 'প্রসেসিং ফি' : 'Tax / Fee'}
                                    </span>
                                    <span className="text-[#10B981] font-bold text-[10px]">FREE</span>
                                </div>
                                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                                    <span className={`text-slate-800 dark:text-white font-bold uppercase tracking-tight text-sm ${bengaliClass}`}>
                                        {language === 'bn' ? 'সর্বমোট' : 'Grand Total'}
                                    </span>
                                    <span className="text-3xl font-black text-[#E62D26] outfit">৳{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className={`w-full flex items-center justify-center gap-3 py-4 bg-[#E62D26] hover:bg-[#c41e18] text-white rounded-md font-normal text-sm uppercase tracking-widest transition-all active:scale-[0.98] group ${bengaliClass}`}
                            >
                                {language === 'bn' ? 'চেকআউট' : 'Checkout Now'}
                                <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-md border border-slate-100 dark:border-white/10">
                                <LuShieldCheck className="text-[#10B981] text-xl shrink-0" />
                                <p className={`text-[9px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed uppercase tracking-wider ${bengaliClass}`}>
                                    {language === 'bn' ? 'নিরাপদ চেকআউট গ্যারান্টি।' : 'Secure Checkout & Payment Guarantee.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

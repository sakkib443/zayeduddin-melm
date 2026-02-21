"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCheck, LuX, LuZap } from "react-icons/lu";
import { useLanguage } from "@/context/LanguageContext";

const PricingPage = () => {
    const { language } = useLanguage();
    const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" or "yearly"
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const plans = [
        {
            name: "Free",
            nameBn: "ফ্রি",
            description: "Perfect for exploring",
            descriptionBn: "এক্সপ্লোর করার জন্য উপযুক্ত",
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                { text: "5 Free Downloads/month", textBn: "মাসে ৫টি ফ্রি ডাউনলোড", included: true },
                { text: "Access to Free Templates", textBn: "ফ্রি টেম্পলেটে অ্যাক্সেস", included: true },
                { text: "Basic Support", textBn: "বেসিক সাপোর্ট", included: true },
                { text: "Premium Templates", textBn: "প্রিমিয়াম টেম্পলেট", included: false },
                { text: "Commercial License", textBn: "কমার্শিয়াল লাইসেন্স", included: false },
            ],
            buttonText: "Get Started",
            buttonTextBn: "শুরু করুন",
            highlight: false
        },
        {
            name: "Pro",
            nameBn: "প্রো",
            description: "Best for freelancers",
            descriptionBn: "ফ্রিল্যান্সারদের জন্য সেরা",
            monthlyPrice: 999,
            yearlyPrice: 799,
            features: [
                { text: "50 Downloads/month", textBn: "মাসে ৫০টি ডাউনলোড", included: true },
                { text: "All Premium Templates", textBn: "সব প্রিমিয়াম টেম্পলেট", included: true },
                { text: "Commercial License", textBn: "কমার্শিয়াল লাইসেন্স", included: true },
                { text: "Priority Support", textBn: "প্রায়োরিটি সাপোর্ট", included: true },
                { text: "Early Access", textBn: "আর্লি অ্যাক্সেস", included: true },
            ],
            buttonText: "Subscribe Now",
            buttonTextBn: "সাবস্ক্রাইব করুন",
            highlight: true,
            badge: "POPULAR",
            badgeBn: "জনপ্রিয়"
        },
        {
            name: "Enterprise",
            nameBn: "এন্টারপ্রাইজ",
            description: "For teams & agencies",
            descriptionBn: "টিম এবং এজেন্সির জন্য",
            monthlyPrice: 4999,
            yearlyPrice: 3999,
            features: [
                { text: "Unlimited Downloads", textBn: "আনলিমিটেড ডাউনলোড", included: true },
                { text: "All Premium Templates", textBn: "সব প্রিমিয়াম টেম্পলেট", included: true },
                { text: "Extended License", textBn: "এক্সটেন্ডেড লাইসেন্স", included: true },
                { text: "24/7 Priority Support", textBn: "২৪/৭ প্রায়োরিটি সাপোর্ট", included: true },
                { text: "Team Access (10 seats)", textBn: "টিম অ্যাক্সেস (১০ জন)", included: true },
            ],
            buttonText: "Subscribe Now",
            buttonTextBn: "সাবস্ক্রাইব করুন",
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-4xl md:text-6xl font-bold text-[#021E14] dark:text-[#D4AF37] mb-4`}
                    >
                        {language === 'bn' ? 'সহজ মূল্যতালিকা' : 'Simple Pricing'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10 ${bengaliClass}`}
                    >
                        {language === 'bn'
                            ? 'আপনার প্রয়োজন অনুযায়ী সঠিক প্ল্যানটি বেছে নিন। যেকোনো সময় আপগ্রেড বা ডাউনগ্রেড করুন।'
                            : 'Choose the right plan for your needs. Upgrade or downgrade anytime.'}
                    </motion.p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="bg-white dark:bg-white/5 p-1.5 rounded-full border border-slate-100 dark:border-white/10 shadow-sm flex items-center">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${billingCycle === "monthly"
                                    ? "bg-[#021E14] text-white shadow-lg shadow-[#021E14]/20"
                                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                                    }`}
                            >
                                {language === 'bn' ? 'মাসিক' : 'Monthly'}
                            </button>
                            <button
                                onClick={() => setBillingCycle("yearly")}
                                className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${billingCycle === "yearly"
                                    ? "bg-[#021E14] text-white shadow-lg shadow-[#021E14]/20"
                                    : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                                    }`}
                            >
                                <span>{language === 'bn' ? 'বার্ষিক' : 'Yearly'}</span>
                                <span className="bg-[#021E14]/10 dark:bg-[#021E14]/20 text-[#021E14] dark:text-emerald-400 text-[10px] px-1.5 py-0.5 rounded-full">-20%</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative bg-white dark:bg-[#0d0d0d] rounded-[32px] p-8 md:p-10 flex flex-col items-start transition-all duration-500 ${plan.highlight
                                ? "ring-2 ring-[#021E14]/50 shadow-2xl shadow-[#021E14]/10 scale-105 z-10"
                                : "border border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 shadow-xl shadow-black/5"
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-[#021E14] text-white text-[10px] font-bold tracking-widest px-6 py-1.5 rounded-full shadow-lg">
                                        {language === 'bn' ? plan.badgeBn : plan.badge}
                                    </span>
                                </div>
                            )}

                            <div className="mb-8 w-full">
                                <h3 className={`text-3xl font-bold text-slate-800 dark:text-white mb-2 ${bengaliClass}`}>
                                    {language === 'bn' ? plan.nameBn : plan.name}
                                </h3>
                                <p className={`text-slate-500 dark:text-slate-400 text-sm ${bengaliClass}`}>
                                    {language === 'bn' ? plan.descriptionBn : plan.description}
                                </p>
                            </div>

                            <div className="mb-10 w-full">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                        ৳{billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400 text-sm italic font-medium">
                                        {plan.monthlyPrice === 0
                                            ? (language === 'bn' ? '/ চিরকাল' : '/ forever')
                                            : (language === 'bn' ? '/ মাস' : '/ month')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-12 flex-1 w-full">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-3">
                                        <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${feature.included
                                            ? "bg-[#021E14]/10 dark:bg-[#021E14]/20 text-[#021E14] dark:text-emerald-400"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-400/50"
                                            }`}>
                                            {feature.included ? <LuCheck size={12} strokeWidth={3} /> : <LuX size={12} />}
                                        </div>
                                        <span className={`text-sm ${feature.included
                                            ? "text-slate-700 dark:text-slate-300 font-medium"
                                            : "text-slate-400 dark:text-slate-600"
                                            } ${bengaliClass}`}>
                                            {language === 'bn' ? feature.textBn : feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-4 rounded-full text-sm font-bold transition-all duration-300 mt-auto ${plan.highlight
                                    ? "bg-[#021E14] text-white hover:bg-[#01140D] shadow-lg shadow-[#021E14]/30 hover:-translate-y-1"
                                    : "bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:-translate-y-1"
                                    } ${bengaliClass}`}
                            >
                                {language === 'bn' ? plan.buttonTextBn : plan.buttonText}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ or Footer info if needed */}
                <div className="mt-24 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm">
                        <LuZap className="text-[#D4AF37]" size={20} />
                        <p className={`text-slate-600 dark:text-slate-400 text-sm font-medium ${bengaliClass}`}>
                            {language === 'bn'
                                ? 'কোন প্রশ্ন আছে? আমাদের সাপোর্ট টিমের সাথে কথা বলুন।'
                                : 'Have questions? Contact our dedicated support team.'}
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .font-script {
                    font-family: var(--font-poppins);
                }
            `}</style>
        </div>
    );
};

export default PricingPage;

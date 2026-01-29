"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const AboutMe = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const socialLinks = [
        { icon: <FaFacebookF />, href: "https://facebook.com", color: "#1877F2" },
        { icon: <FaLinkedinIn />, href: "https://linkedin.com", color: "#0A66C2" },
    ];

    return (
        <section className="py-16 bg-[#efefef] dark:bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-16">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 order-2 lg:order-1"
                    >
                        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-serif italic text-[#300000] mb-6 ${bengaliClass}`}>
                            {language === 'bn' ? 'আমার সম্পর্কে' : 'About Me'}
                        </h2>

                        <div className={`space-y-4 text-slate-700 dark:text-slate-400 text-sm md:text-base leading-relaxed ${bengaliClass}`}>
                            <p>
                                {language === 'bn'
                                    ? 'জায়েদ উদ্দিন একজন অভিজ্ঞ গ্রাফিক এবং ইউএক্স/ইউআই ডিজাইন নির্দেশক, যার রয়েছে ২০ বছরেরও বেশি সময়ের পেশাদার অভিজ্ঞতা। বর্তমানে তিনি BITM এবং UIU (IBER)-এর মতো স্বনামধন্য প্রতিষ্ঠানে ডিজাইন প্রশিক্ষক হিসেবে কাজ করছেন।'
                                    : 'Zayed Uddin is a seasoned Graphic and UX/UI Design instructor with over 20 years of professional experience. He currently leads design training programs at BITM and UIU (IBER), sharing his vast industry expertise with aspiring designers.'}
                            </p>

                            <p>
                                {language === 'bn'
                                    ? '২০০৩ সাল থেকে দেশের শীর্ষস্থানীয় প্রতিষ্ঠান এবং আন্তর্জাতিক অনলাইন মার্কেটপ্লেসে সফলভাবে কাজ করার পর, তিনি এখন নিজেকে নিয়োজিত করেছেন দক্ষ জনবল তৈরিতে। সরকারি এবং আন্তর্জাতিক বিভিন্ন দক্ষতা উন্নয়ন প্রকল্পে (যেমন: ASSET, BYTES) তিনি নিয়মিত মাস্টার ট্রেইনার হিসেবে দায়িত্ব পালন করছেন।'
                                    : 'Since 2003, he has worked with top-tier organizations and as a successful freelancer on global marketplaces. Beyond professional design, he is deeply committed to education, serving as a master trainer for various government and international projects like ASSET and BYTES.'}
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-10">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-[#300000] hover:text-white hover:border-[#300000] transition-all duration-300 shadow-sm"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Visual Image Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end"
                    >
                        <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-square mx-auto">
                            {/* Abstract Background Shapes */}
                            <div className="absolute top-10 right-10 w-3/4 h-3/4 bg-[#300000]/5 rounded-[40px] rotate-6 z-0" />
                            <div className="absolute -bottom-4 -left-4 w-1/2 h-1/2 bg-[#D4AF37]/10 rounded-full blur-3xl z-0" />

                            {/* Main Training Image 1 (Large) - Top Right */}
                            <div className="absolute top-0 right-0 w-[70%] h-[60%] bg-white dark:bg-[#0d0d0d] p-2 rounded-[32px] shadow-2xl z-20 group">
                                <div className="relative w-full h-full rounded-[24px] overflow-hidden border border-slate-100 dark:border-white/5">
                                    <Image
                                        src="/images/training.jpg"
                                        alt="Training Session 1"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                </div>
                            </div>

                            {/* Training Image 2 (Medium) - Bottom Left */}
                            <div className="absolute bottom-0 left-0 w-[60%] h-[45%] bg-white dark:bg-[#0d0d0d] p-2 rounded-[28px] shadow-xl z-20 group">
                                <div className="relative w-full h-full rounded-[20px] overflow-hidden border border-slate-100 dark:border-white/5">
                                    <Image
                                        src="/images/training2.jpg"
                                        alt="Training Session 2"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            </div>

                            {/* Training Image 3 (Accent) - Floating Center/Right */}
                            <div className="absolute top-1/2 right-10 translate-y-12 w-[40%] h-[30%] bg-white dark:bg-[#0d0d0d] p-2 rounded-[24px] shadow-xl z-30 group animate-float hidden sm:block">
                                <div className="relative w-full h-full rounded-[16px] overflow-hidden border border-slate-100 dark:border-white/5">
                                    <Image
                                        src="/images/training3.jpg"
                                        alt="Training Session 3"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            </div>

                            {/* Experience Badge */}
                            <div className="absolute top-10 left-0 -translate-x-1/4 bg-[#300000] text-[#D4AF37] p-4 md:p-6 rounded-full shadow-2xl z-40 flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 border-4 border-white dark:border-[#050505] animate-bounce-slow">
                                <span className="text-2xl md:text-3xl font-bold font-serif leading-none">20+</span>
                                <span className="text-[10px] md:text-xs uppercase tracking-wider mt-1 text-center text-white/80">Years Exp.</span>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl"></div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#300000]/5 rounded-full blur-3xl"></div>
                        </div>
                    </motion.div>

                </div>
            </div>
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default AboutMe;

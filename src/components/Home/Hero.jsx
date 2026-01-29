"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const colors = {
        bg: "#fafafa",
        dark: "#300000",
        gold: "#D4AF37",
        white: "#FFFFFF",
    };

    const cards = [
        {
            title: "Design",
            description: "Design Work means that portion of the Work consisting of the design services required...",
            href: "/design-template",
        },
        {
            title: "Training",
            description: "Workplace training is the process of developing knowledge, skills and efficiency in your job...",
            href: "/courses",
        },
    ];

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden" style={{ backgroundColor: colors.bg }}>

            {/* Background Image - Blended & Faded */}
            <div className="absolute right-0 bottom-0 top-0 w-full md:w-[70%] lg:w-[30%] h-full z-0 pointer-events-none select-none overflow-hidden">
                <div className="relative w-full h-full opacity-[0.12] blur-[0.5px] grayscale contrast-125 mix-blend-multiply dark:mix-blend-overlay">
                    <Image
                        src="/images/zayed uddin.png"
                        alt="Background"
                        fill
                        className="object-contain object-right-bottom scale-110 translate-y-10 md:translate-y-0"
                        priority
                    />
                </div>
                {/* Gradient Masks for "Mise Ase" (Blending) effect */}
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#fafafa]" style={{ background: `linear-gradient(to left, transparent 0%, ${colors.bg} 100%)` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#fafafa] opacity-50" style={{ background: `linear-gradient(to top, transparent 0%, ${colors.bg} 100%)` }} />
            </div>

            {/* Main Content Container */}
            <div className="max-w-6xl mx-auto text-center z-10">

                {/* Name & Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-10"
                >
                    <h1 className="text-5xl md:text-6xl font-serif italic mb-4" style={{ color: colors.dark }}>
                        Zayed Uddin
                    </h1>
                    <h2 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase mb-6" style={{ color: colors.dark }}>
                        Designer & Trainer
                    </h2>

                    {/* Bio Description */}
                    <p className={`max-w-3xl mx-auto text-xs md:text-sm leading-relaxed opacity-80 ${bengaliClass}`} style={{ color: colors.dark }}>
                        "Zayed Uddin is a seasoned Graphic and UX/UI Design instructor with over 20 years of professional experience. He currently leads design training programs at BITM and UIU (IBER), sharing his vast industry expertise with aspiring designers.
                        <br /><br />
                        Since 2003, he has worked with top-tier organizations and as a successful freelancer on global marketplaces. Beyond professional design, he is deeply committed to education, serving as a master trainer for various government and international projects like ASSET and BYTES."
                    </p>
                </motion.div>

                {/* Service Cards */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 px-4 max-w-5xl mx-auto">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 + (index * 0.2) }}
                        >
                            <Link href={card.href} className="group block h-full">
                                <div
                                    className="h-full p-10 md:p-14 rounded-[30px] shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-black/20 flex flex-col items-center justify-center text-center"
                                    style={{ backgroundColor: colors.dark }}
                                >
                                    <h3
                                        className="text-3xl md:text-4xl font-serif italic mb-4 transition-colors group-hover:text-white"
                                        style={{ color: colors.gold }}
                                    >
                                        {card.title}
                                    </h3>
                                    <p
                                        className="text-xs md:text-sm opacity-70 leading-relaxed font-light"
                                        style={{ color: colors.white }}
                                    >
                                        {card.description}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Custom Font Import */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,600&family=Outfit:wght@400;700&display=swap');
                
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }
            `}</style>
        </section>
    );
};

export default Hero;



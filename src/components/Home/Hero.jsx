"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/config/api";

const Hero = ({ data }) => {
    const { language, t } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [heroData, setHeroData] = useState(data || null);

    // Fetch hero design data from API if no data prop is provided
    useEffect(() => {
        if (data) {
            setHeroData(data);
            return;
        }

        const fetchHero = async () => {
            try {
                const res = await fetch(`${API_URL}/design/hero`);
                const data = await res.json();
                if (data.success && data.data?.heroContent) {
                    setHeroData(data.data.heroContent);
                }
            } catch (error) {
                console.error('Error fetching hero data:', error);
            }
        };
        fetchHero();
    }, [data]);

    const colors = {
        bg: "#fafafa",
        dark: "#021E14",
        gold: "#D4AF37",
        white: "#FFFFFF",
    };

    const cards = [
        {
            title: t("hero.design"),
            description: t("hero.designDesc"),
            href: "/design-template",
        },
        {
            title: t("hero.training"),
            description: t("hero.trainingDesc"),
            href: "/courses",
        },
    ];

    // Determine background image: API data > fallback
    const backgroundImage = heroData?.backgroundImage || "/images/zayed uddin.png";

    // Dynamic text from API (with fallback to translation keys)
    const heroName = heroData?.heading
        ? (language === 'bn' ? heroData.heading.line1Bn : heroData.heading.line1) || t("hero.name")
        : t("hero.name");

    const heroSubTitle = heroData?.heading
        ? (language === 'bn' ? heroData.heading.line2Bn : heroData.heading.line2) || t("hero.subTitle")
        : t("hero.subTitle");

    const heroBio = heroData?.description
        ? (language === 'bn' ? heroData.description.textBn : heroData.description.text) || t("hero.bio")
        : t("hero.bio");

    return (
        <section className="relative h-[550px] md:h-[650px] flex flex-col items-center justify-center px-4 overflow-hidden" style={{ backgroundColor: colors.bg }}>

            {/* Background Image - Dynamic Effects (Centered Full Cover) */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
                <div
                    className="relative w-full h-full"
                    style={{
                        filter: `blur(${heroData?.backgroundBlur || 0}px) grayscale(${heroData?.backgroundGrayscale ? 1 : 0})`,
                    }}
                >
                    <Image
                        src={backgroundImage}
                        alt="Background"
                        fill
                        className="object-cover object-center"
                        priority
                        unoptimized={backgroundImage.startsWith('http')}
                    />
                </div>

                {/* Dynamic Overlay Color Mask (Only visible if opacity > 0) */}
                {heroData?.backgroundOverlayOpacity > 0 && (
                    <div
                        className="absolute inset-0 z-10"
                        style={{
                            backgroundColor: heroData?.backgroundOverlayColor || 'transparent',
                            opacity: heroData?.backgroundOverlayOpacity
                        }}
                    />
                )}
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
                    <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: colors.dark, fontFamily: 'var(--font-poppins)' }}>
                        {heroName}
                    </h1>
                    <h2 className="text-lg md:text-xl font-bold tracking-[0.2em] uppercase mb-6" style={{ color: colors.dark }}>
                        {heroSubTitle}
                    </h2>

                    {/* Bio Description */}
                    <p className={`max-w-3xl mx-auto text-xs md:text-sm leading-relaxed opacity-80 whitespace-pre-line ${bengaliClass}`} style={{ color: colors.dark }}>
                        {heroBio}
                        <Link href="/about" className="inline-block ml-2 text-[#D4AF37] font-bold hover:underline transition-all">
                            {t("hero.seeMore")}
                        </Link>
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
                                        className="text-3xl md:text-4xl font-bold mb-4 transition-colors group-hover:text-white"
                                        style={{ color: colors.gold, fontFamily: 'var(--font-poppins)' }}
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
            `}</style>
        </section>
    );
};

export default Hero;

"use client";

import { LuTarget, LuRocket, LuAward, LuArrowRight } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi2";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const WhatWeProvide = () => {
  const { t, language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const features = [
    { icon: LuRocket, titleKey: "lifetimeSupport", descKey: "lifetimeSupportDesc", emoji: "??", color: "orange" },
    { icon: LuTarget, titleKey: "jobPlacement", descKey: "jobPlacementDesc", emoji: "??", color: "teal" },
    { icon: LuAward, titleKey: "getCertification", descKey: "getCertificationDesc", emoji: "??", color: "orange" }
  ];

  const getColorClasses = (color) => color === 'teal'
    ? { gradient: 'from-[#E62D26] to-[#c41e18]', light: 'bg-[#E62D26]/10', text: 'text-[#E62D26]', border: 'border-[#E62D26]/20' }
    : { gradient: 'from-[#F79952] to-[#fb923c]', light: 'bg-[#F79952]/10', text: 'text-[#F79952]', border: 'border-[#F79952]/20' };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-gradient-to-br from-[#E62D26]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-gradient-to-br from-[#F79952]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-16 relative z-10">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <motion.div className="inline-flex items-center gap-3 mb-5 px-5 py-2.5 rounded-full bg-white dark:bg-black/50 border border-red-500/30 shadow-sm" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500/20 to-cyan-500/20 flex items-center justify-center">
              <HiOutlineSparkles className="text-[#E62D26]" size={14} />
            </div>
            <span className={`text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-[0.2em] ${bengaliClass}`}>{t("whatWeProvide.badge")}</span>
          </motion.div>
          <motion.h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-5 ${bengaliClass}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            {t("whatWeProvide.title1")}<span className="text-primary">{t("whatWeProvide.title2")}</span>
          </motion.h2>
          <motion.p className={`text-gray-500 dark:text-gray-400 text-base lg:text-lg max-w-2xl mx-auto ${bengaliClass}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}>{t("whatWeProvide.subtitle")}</motion.p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <motion.div key={index} variants={cardVariants} className="group relative bg-white dark:bg-[#0d0d0d] rounded-[2rem] p-8 border border-gray-200 dark:border-white/10 transition-all duration-500 hover:shadow-lg hover:-translate-y-2 overflow-hidden">
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${colors.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="relative mb-5">
                    <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110`}>
                      <feature.icon size={28} className={colors.text} />
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2 ${bengaliClass}`}>{t(`whatWeProvide.features.${feature.titleKey}`)} <span>{feature.emoji}</span></h3>
                  <p className={`text-sm text-gray-500 dark:text-gray-400 mb-6 ${bengaliClass}`}>{t(`whatWeProvide.features.${feature.descKey}`)}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                    <span className={`text-xs font-semibold ${colors.text} uppercase tracking-widest ${bengaliClass}`}>{t("whatWeProvide.learnMore")}</span>
                    <div className={`w-8 h-8 rounded-lg ${colors.light} flex items-center justify-center`}><LuArrowRight size={16} className={colors.text} /></div>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${colors.gradient} rounded-b-2xl group-hover:w-full transition-all duration-500`} />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div className="flex justify-center mt-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5 }}>
          <Link href="/about" className={`group relative bg-white dark:bg-[#0d0d0d] rounded-2xl px-8 py-4 border border-gray-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg flex items-center gap-4 transition-all ${bengaliClass}`}>
            <span className="font-bold text-gray-900 dark:text-white">{t("whatWeProvide.learnMoreAboutUs")}</span>
            <div className="w-10 h-10 rounded-xl bg-[#E62D26]/10 flex items-center justify-center group-hover:bg-[#E62D26]"><LuArrowRight size={18} className="text-[#E62D26] group-hover:text-white" /></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeProvide;

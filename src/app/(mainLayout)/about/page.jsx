"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL as API_URL } from "@/config/api";
import {
  LuTarget,
  LuUsers,
  LuBookOpen,
  LuMoveRight,
  LuSparkles,
  LuGraduationCap,
  LuAward,
  LuGlobe,
  LuQuote,
  LuCheck
} from "react-icons/lu";

const statIcons = [LuUsers, LuGraduationCap, LuBookOpen, LuAward];
const featureIcons = [LuUsers, LuGraduationCap, LuAward, LuGlobe, LuTarget, LuCheck];

const AboutPage = () => {
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const [content, setContent] = useState({
    hero: {
      badge: 'Our Story', badgeBn: 'আমাদের সম্পর্কে',
      title: 'Building Skills, Shaping Futures', titleBn: 'দক্ষতা বুনন, ভবিষ্যৎ গঠন',
      description: 'We turn potential into professional success. Our mission is to empower the youth of Bangladesh with world-class digital skills.',
      descriptionBn: 'আমরা সম্ভাবনাকে পেশাদার সাফল্যে রূপান্তর করি। আমাদের লক্ষ্য হলো বাংলাদেশের তরুণদের বিশ্বমানের ডিজিটাল দক্ষতায় দক্ষ করে তোলা।',
      buttonText: 'Explore Courses', buttonTextBn: 'কোর্সগুলো দেখুন',
      happyStudents: '50k+ Happy Students', happyStudentsBn: '৫০ হাজার+ সন্তুষ্ট শিক্ষার্থী'
    },
    stats: [
      { number: '50k+', label: 'Active Learners', labelBn: 'সক্রিয় শিক্ষার্থী' },
      { number: '120+', label: 'Expert Mentors', labelBn: 'বিশেষজ্ঞ মেন্টর' },
      { number: '500+', label: 'Premium Courses', labelBn: 'প্রিমিয়াম কোর্স' },
      { number: '4.9', label: 'Top Rated', labelBn: 'শীর্ষ রেটিং' }
    ],
    mission: {
      title: 'Our Mission', titleBn: 'আমাদের মিশন',
      description: 'We teach more than just code. We foster a community of innovators ready to lead the next digital revolution with cutting-edge expertise.',
      descriptionBn: 'আমরা কোডিংয়ের চেয়ে বেশি কিছু শেখাই। আমরা একটি সম্প্রদায় গড়ে তুলি যারা উদ্ভাবন এবং প্রযুক্তির মাধ্যমে ভবিষ্যতের চ্যালেঞ্জ মোকাবেলা করতে সক্ষম।',
      quote: '"Education is not the learning of facts, but the training of the mind to think."',
      quoteBn: '"শিক্ষা তথ্য মুখস্থ করা নয়, বরং মনকে চিন্তা করতে শেখানো।"',
      quoteLabel: 'Our Philosophy', quoteLabelBn: 'আমাদের দর্শন',
      features: [
        { title: 'Our Target', titleBn: 'আমাদের লক্ষ্য', desc: 'Digital Literacy for all.', descBn: 'সবার জন্য ডিজিটাল সাক্ষরতা।' },
        { title: 'Global Standard', titleBn: 'বিশ্বমান', desc: 'Industry-vetted curriculum.', descBn: 'ইন্ডাস্ট্রি-অনুমোদিত কারিকুলাম।' }
      ]
    },
    whyUs: {
      title: 'Why Choose Us?', titleBn: 'কেন আমরা সেরা?',
      features: [
        { title: 'Student Focused', titleBn: 'শিক্ষার্থী কেন্দ্রিক', desc: "Every curriculum is designed keeping the student's journey in mind, ensuring maximum learning impact.", descBn: 'প্রতিটি কারিকুলাম শিক্ষার্থীদের কথা মাথায় রেখে ডিজাইন করা হয়েছে।' },
        { title: 'Expert Mentors', titleBn: 'বিশেষজ্ঞ মেন্টর', desc: 'Learn directly from industry veterans who bring real-world projects and insights to the classroom.', descBn: 'ইন্ডাস্ট্রির অভিজ্ঞদের কাছ থেকে সরাসরি শিখুন।' },
        { title: 'Certifications', titleBn: 'সার্টিফিকেশন', desc: 'Earn certificates that are recognized by top tech companies and valid across the global job market.', descBn: 'শীর্ষ কোম্পানি দ্বারা স্বীকৃত সার্টিফিকেট অর্জন করুন।' }
      ]
    },
    cta: {
      title: 'Begin Your Legacy', titleBn: 'আপনার যাত্রা শুরু করুন',
      description: 'Join over 50,000 students worldwide and start your journey towards greatness today.',
      descriptionBn: 'বিশ্বব্যাপী ৫০ হাজারেরও বেশি শিক্ষার্থীর সাথে যোগ দিন এবং আজই আপনার যাত্রা শুরু করুন।',
      button1Text: 'Get Started Now', button1TextBn: 'কোর্সগুলো দেখুন',
      button2Text: 'Contact Support', button2TextBn: 'যোগাযোগ করুন'
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/design/about`);
        const data = await res.json();
        if (data.success && data.data?.aboutContent) {
          const ac = data.data.aboutContent;
          setContent(prev => ({
            hero: { ...prev.hero, ...(ac.hero || {}) },
            stats: ac.stats?.length ? ac.stats : prev.stats,
            mission: { ...prev.mission, ...(ac.mission || {}), features: ac.mission?.features?.length ? ac.mission.features : prev.mission.features },
            whyUs: { ...prev.whyUs, ...(ac.whyUs || {}), features: ac.whyUs?.features?.length ? ac.whyUs.features : prev.whyUs.features },
            cta: { ...prev.cta, ...(ac.cta || {}) }
          }));
        }
      } catch (err) { console.error(err); }
    };
    fetchContent();
  }, []);

  const t = (en, bn) => language === 'bn' ? (bn || en) : en;
  const statAccents = [
    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">

      {/* Hero Section */}
      <section className="bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 lg:px-16 pt-28 pb-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full lg:w-1/2">
              <span className={`inline-block text-xs font-semibold tracking-widest uppercase text-[#021E14] dark:text-[#D4AF37] mb-4 ${bengaliClass}`}>
                {t(content.hero.badge, content.hero.badgeBn)}
              </span>
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-5 leading-tight ${bengaliClass}`}>
                {t(content.hero.title, content.hero.titleBn)}
              </h1>
              <p className={`text-base text-gray-500 dark:text-gray-400 mb-8 leading-relaxed ${bengaliClass}`}>
                {t(content.hero.description, content.hero.descriptionBn)}
              </p>

              <div className="flex flex-wrap items-center gap-5">
                <Link href="/courses">
                  <button className={`px-6 py-3 bg-[#021E14] dark:bg-[#D4AF37] text-white dark:text-[#021E14] rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 ${bengaliClass}`}>
                    {t(content.hero.buttonText, content.hero.buttonTextBn)}
                    <LuMoveRight size={16} />
                  </button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#111] overflow-hidden bg-gray-100">
                        <img src={`https://i.pravatar.cc/80?u=${i}`} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className={`text-xs font-semibold text-gray-600 dark:text-gray-300 ${bengaliClass}`}>
                    {t(content.hero.happyStudents, content.hero.happyStudentsBn)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full lg:w-1/2">
              <div className="grid grid-cols-2 gap-3 h-[400px] lg:h-[440px]">
                <div className="space-y-3">
                  <div className="h-[58%] rounded-xl overflow-hidden relative">
                    <Image src="/images/training2.jpg" fill className="object-cover" alt="Training" />
                  </div>
                  <div className="h-[38%] rounded-xl overflow-hidden relative">
                    <Image src="/images/training3.jpg" fill className="object-cover" alt="Training" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="h-[80%] rounded-xl overflow-hidden border-2 border-gray-100 dark:border-white/10 relative">
                    <Image src="/images/training.jpg" fill className="object-cover" alt="Training" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 lg:px-16 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {content.stats.map((stat, idx) => {
            const Icon = statIcons[idx % statIcons.length];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-5 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-lg ${statAccents[idx % statAccents.length]} flex items-center justify-center mb-3`}>
                  <Icon size={18} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</h3>
                <p className={`text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider ${bengaliClass}`}>
                  {t(stat.label, stat.labelBn)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-[#021E14] border-y border-[#021E14]">
        <div className="container mx-auto px-4 lg:px-16 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Quote Card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 order-2 lg:order-1"
            >
              <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
                <LuQuote className="text-[#D4AF37] mb-5" size={36} />
                <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold text-white mb-6 leading-snug ${bengaliClass}`}>
                  {t(content.mission.quote, content.mission.quoteBn)}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-0.5 bg-[#D4AF37] rounded-full" />
                  <p className={`text-[#D4AF37] font-semibold text-xs uppercase tracking-widest ${bengaliClass}`}>
                    {t(content.mission.quoteLabel, content.mission.quoteLabelBn)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission Text */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 order-1 lg:order-2"
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#D4AF37] mb-3">
                {t('Mission & Vision', 'মিশন ও ভিশন')}
              </span>
              <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#D4AF37] mb-5 ${bengaliClass}`}>
                {t(content.mission.title, content.mission.titleBn)}
              </h2>
              <p className={`text-white/60 mb-8 leading-relaxed ${bengaliClass}`}>
                {t(content.mission.description, content.mission.descriptionBn)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.mission.features.map((item, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
                    <div className="w-9 h-9 bg-[#D4AF37] rounded-lg flex items-center justify-center shrink-0">
                      {i === 0 ? <LuTarget className="text-[#021E14]" size={16} /> : <LuGlobe className="text-[#021E14]" size={16} />}
                    </div>
                    <div>
                      <h4 className={`font-semibold text-white text-sm mb-0.5 ${bengaliClass}`}>{t(item.title, item.titleBn)}</h4>
                      <p className={`text-white/40 text-xs ${bengaliClass}`}>{t(item.desc, item.descBn)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 lg:px-16 py-16 lg:py-20">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#021E14] dark:text-[#D4AF37] mb-3">
              {t('Our Advantages', 'আমাদের বিশেষত্ব')}
            </span>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 ${bengaliClass}`}>
              {t(content.whyUs.title, content.whyUs.titleBn)}
            </h2>
            <div className="w-12 h-0.5 bg-[#021E14] dark:bg-[#D4AF37] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {content.whyUs.features.map((item, i) => {
              const Icon = featureIcons[i % featureIcons.length];
              const accents = [
                'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
                'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
              ];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center"
                >
                  <div className={`w-12 h-12 ${accents[i % accents.length]} rounded-xl flex items-center justify-center mb-5 mx-auto group-hover:scale-105 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <h3 className={`text-base font-bold text-gray-900 dark:text-white mb-2 ${bengaliClass}`}>
                    {t(item.title, item.titleBn)}
                  </h3>
                  <p className={`text-sm text-gray-500 dark:text-gray-400 leading-relaxed ${bengaliClass}`}>
                    {t(item.desc, item.descBn)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-16 py-16">
        <div className="bg-[#021E14] rounded-xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.1),transparent_60%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#D4AF37] mb-4">
              {t('Start Today', 'আজই শুরু করুন')}
            </span>
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#D4AF37] mb-4 ${bengaliClass}`}>
              {t(content.cta.title, content.cta.titleBn)}
            </h2>
            <p className={`text-white/60 mb-8 ${bengaliClass}`}>
              {t(content.cta.description, content.cta.descriptionBn)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/courses">
                <button className={`px-8 py-3.5 bg-[#D4AF37] text-[#021E14] rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity ${bengaliClass}`}>
                  {t(content.cta.button1Text, content.cta.button1TextBn)}
                </button>
              </Link>
              <Link href="/contact">
                <button className={`px-8 py-3.5 border border-white/20 text-white rounded-lg font-semibold text-sm hover:bg-white/5 transition-colors ${bengaliClass}`}>
                  {t(content.cta.button2Text, content.cta.button2TextBn)}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

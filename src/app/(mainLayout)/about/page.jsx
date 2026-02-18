"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from "@/context/LanguageContext";
import {
  LuTarget,
  LuUsers,
  LuBookOpen,
  LuMoveRight,
  LuSparkles,
  LuCheck,
  LuGraduationCap,
  LuAward,
  LuGlobe,
  LuQuote
} from "react-icons/lu";

const StatCard = ({ number, label, icon: Icon, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: idx * 0.1, duration: 0.5 }}
    className="relative p-8 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 shadow-xl shadow-black/5 group hover:-translate-y-2 transition-all duration-500 overflow-hidden"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#021E14]/5 dark:bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#021E14]/10 dark:group-hover:bg-[#D4AF37]/10 transition-colors" />
    <div className="relative z-10">
      <div className="w-14 h-14 mb-6 rounded-2xl bg-[#021E14]/5 dark:bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#021E14] dark:group-hover:bg-[#D4AF37] transition-colors duration-500">
        <Icon className="w-6 h-6 text-[#021E14] dark:text-[#D4AF37] group-hover:text-white dark:group-hover:text-[#021E14] transition-colors duration-500" />
      </div>
      <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{number}</h3>
      <p className="text-xs text-slate-500 dark:text-white/50 font-bold uppercase tracking-widest">{label}</p>
    </div>
  </motion.div>
);

const AboutPage = () => {
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  return (
    <div className="min-h-screen bg-white dark:bg-[#020202]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-white dark:bg-[#020202]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#021E1408,transparent_50%)]" />

        <div className="container mx-auto px-4 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#021E14]/5 dark:bg-[#D4AF37]/10 border border-[#021E14]/10 dark:border-[#D4AF37]/20 rounded-full mb-8">
                <LuSparkles className="text-[#021E14] dark:text-[#D4AF37]" size={14} />
                <span className="text-[10px] font-bold text-[#021E14] dark:text-[#D4AF37] tracking-widest uppercase">
                  {language === 'bn' ? 'আমাদের সম্পর্কে' : 'Our Story'}
                </span>
              </div>

              <h1 className={`text-4xl md:text-7xl font-bold text-[#021E14] dark:text-[#D4AF37] mb-8 leading-tight ${bengaliClass}`}>
                {language === 'bn' ? 'দক্ষতা বুনন, ভবিষ্যৎ গঠন' : 'Building Skills, Shaping Futures'}
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-light">
                {language === 'bn'
                  ? 'আমরা সম্ভাবনাকে পেশাদার সাফল্যে রূপান্তর করি। আমাদের লক্ষ্য হলো বাংলাদেশের তরুণদের বিশ্বমানের ডিজিটাল দক্ষতায় দক্ষ করে তোলা।'
                  : 'We turn potential into professional success. Our mission is to empower the youth of Bangladesh with world-class digital skills.'}
              </p>

              <div className="flex flex-wrap gap-6">
                <Link href="/courses">
                  <button className="px-8 py-4 bg-[#021E14] text-white rounded-full font-bold shadow-2xl shadow-[#021E14]/20 hover:bg-[#021E14] transition-all flex items-center gap-3 group">
                    {language === 'bn' ? 'কোর্সগুলো দেখুন' : 'Explore Courses'}
                    <LuMoveRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <div className="flex -space-x-3 items-center">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#020202] overflow-hidden bg-slate-100">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                    </div>
                  ))}
                  <div className="pl-6">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">50k+ Happy Students</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Image Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative grid grid-cols-2 gap-4 h-[500px]">
                <div className="space-y-4">
                  <div className="h-[60%] rounded-[40px] overflow-hidden shadow-2xl relative">
                    <Image src="/images/training2.jpg" fill className="w-full h-full object-cover" alt="About" />
                  </div>
                  <div className="h-[35%] rounded-[40px] overflow-hidden shadow-2xl relative">
                    <Image src="/images/training3.jpg" fill className="w-full h-full object-cover" alt="About" />
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="h-[75%] rounded-[40px] overflow-hidden shadow-2xl border-4 border-[#021E14]/10 relative">
                    <Image
                      src="/images/training.jpg"
                      alt="Training"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#021E14]/5 dark:bg-[#D4AF37]/5 rounded-full blur-3xl -z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#021E14]/5 rounded-full blur-[100px] -z-10 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="pb-32 container mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard number="50k+" label="Active Learners" icon={LuUsers} idx={0} />
          <StatCard number="120+" label="Expert Mentors" icon={LuGraduationCap} idx={1} />
          <StatCard number="500+" label="Premium Courses" icon={LuBookOpen} idx={2} />
          <StatCard number="4.9" label="Top Rated" icon={LuAward} idx={3} />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 relative bg-[#021E14] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[48px]">
                  <LuQuote className="text-[#D4AF37] mb-8" size={48} />
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                    "Education is not the learning of facts, but the training of the mind to think."
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-1 bg-[#D4AF37] rounded-full" />
                    <p className="text-[#D4AF37] font-bold tracking-widest uppercase text-sm">Our Philosophy</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-4xl md:text-6xl font-bold text-[#D4AF37] mb-8">
                {language === 'bn' ? 'আমাদের মিশন' : 'Our Mission'}
              </h2>
              <p className="text-xl text-white/70 mb-12 leading-relaxed">
                {language === 'bn'
                  ? 'আমরা কোডিংয়ের চেয়ে বেশি কিছু শেখাই। আমরা একটি সম্প্রদায় গড়ে তুলি যারা উদ্ভাবন এবং প্রযুক্তির মাধ্যমে ভবিষ্যতের চ্যালেঞ্জ মোকাবেলা করতে সক্ষম।'
                  : 'We teach more than just code. We foster a community of innovators ready to lead the next digital revolution with cutting-edge expertise.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: LuTarget, title: "Our Target", desc: "Digital Literacy for all." },
                  { icon: LuGlobe, title: "Global Standard", desc: "Industry-vetted curriculum." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="text-[#021E14]" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 uppercase tracking-wider text-xs">{item.title}</h4>
                      <p className="text-white/50 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-32 bg-white dark:bg-[#020202]">
        <div className="container mx-auto px-4 lg:px-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-[#021E14] dark:text-[#D4AF37] mb-6">
              {language === 'bn' ? 'কেন আমরা সেরা?' : 'Why Choose Us?'}
            </h2>
            <div className="w-24 h-1 bg-[#021E14] dark:bg-[#D4AF37] mx-auto rounded-full mb-8" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: LuUsers,
                title: "Student Focused",
                desc: "Every curriculum is designed keeping the student's journey in mind, ensuring maximum learning impact."
              },
              {
                icon: LuGraduationCap,
                title: "Expert Mentors",
                desc: "Learn directly from industry veterans who bring real-world projects and insights to the classroom."
              },
              {
                icon: LuAward,
                title: "Certifications",
                desc: "Earn certificates that are recognized by top tech companies and valid across the global job market."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-slate-50 dark:bg-white/5 rounded-[48px] border border-transparent hover:border-[#021E14]/10 dark:hover:border-[#D4AF37]/20 transition-all duration-500 group text-center"
              >
                <div className="w-20 h-20 bg-white dark:bg-[#020202] rounded-[28px] flex items-center justify-center mb-8 mx-auto shadow-xl group-hover:bg-[#021E14] dark:group-hover:bg-[#D4AF37] transition-all duration-500">
                  <item.icon className="text-[#021E14] dark:text-[#D4AF37] group-hover:text-white dark:group-hover:text-[#021E14]" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-4 lg:px-16 container mx-auto">
        <div className="bg-[#021E14] rounded-[60px] p-12 lg:p-24 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(48,0,0,0.3)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.15),transparent_70%)]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className={`text-4xl md:text-7xl font-bold text-[#D4AF37] mb-8`}>
              {language === 'bn' ? 'আপনার যাত্রা শুরু করুন' : 'Begin Your Legacy'}
            </h2>
            <p className="text-xl text-white/70 mb-12">
              Join over 50,000 students worldwide and start your journey towards greatness today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/courses">
                <button className="px-12 py-5 bg-[#D4AF37] text-[#021E14] rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl">
                  {language === 'bn' ? 'কোর্সগুলো দেখুন' : 'Get Started Now'}
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-12 py-5 border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/5 transition-all">
                  {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Support'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
                .font-script {
                    font-family: var(--font-poppins);
                }
            `}</style>
    </div>
  );
};

export default AboutPage;

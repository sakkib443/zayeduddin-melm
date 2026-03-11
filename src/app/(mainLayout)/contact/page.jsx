"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuMail,
  LuPhone,
  LuMapPin,
  LuSend,
  LuClock,
  LuMessageCircle,
  LuHeadphones,
  LuSparkles,
  LuCheck,
  LuArrowRight
} from "react-icons/lu";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL as API_URL } from "@/config/api";

const ContactPage = () => {
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";
  const [messageSent, setMessageSent] = useState(false);
  const [content, setContent] = useState({
    hero: {
      badge: 'Get In Touch',
      badgeBn: 'যোগাযোগ করুন',
      title1: "Let's ",
      title1Bn: 'আমাদের সাথে ',
      title2: 'Connect',
      title2Bn: 'যোগাযোগ করুন',
      subtitle: "Have questions or need support? We'd love to hear from you. Reach out and our team will get back to you shortly.",
      subtitleBn: 'আপনার যেকোনো প্রশ্ন বা সহযোগিতার জন্য আমরা সর্বদা প্রস্তুত। আমাদের মেসেজ পাঠান বা সরাসরি কল করুন।'
    },
    contactInfo: {
      email: 'support@zayeduddin.com',
      phone: '+880 1714117701',
      address: 'Dhaka, Bangladesh',
      addressBn: 'ঢাকা, বাংলাদেশ',
      officeHours: 'Sat - Thu: 10:00 AM - 6:00 PM',
      officeHoursBn: 'শনি - বৃহঃ: সকাল ১০টা - সন্ধ্যা ৬টা'
    },
    socialLinks: {
      facebook: 'https://web.facebook.com/zayeduddin.official/',
      youtube: '#',
      linkedin: 'https://www.linkedin.com/in/zayeduddin/',
      instagram: '#',
      whatsapp: '#'
    },
    whatsappSection: {
      title: 'Quick Chat?',
      titleBn: 'দ্রুত চ্যাট?',
      description: 'Need instant support? Chat with our experts directly on WhatsApp for immediate assistance.',
      descriptionBn: 'তাৎক্ষণিক সাপোর্ট দরকার? হোয়াটসঅ্যাপে আমাদের সাথে চ্যাট করুন।',
      buttonText: 'Message Us Now',
      buttonTextBn: 'এখনই মেসেজ করুন'
    },
    mapEmbedUrl: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/design/contact`);
        const data = await res.json();
        if (data.success && data.data?.contactContent) {
          const cc = data.data.contactContent;
          setContent(prev => ({
            hero: { ...prev.hero, ...(cc.hero || {}) },
            contactInfo: { ...prev.contactInfo, ...(cc.contactInfo || {}) },
            socialLinks: { ...prev.socialLinks, ...(cc.socialLinks || {}) },
            whatsappSection: { ...prev.whatsappSection, ...(cc.whatsappSection || {}) },
            mapEmbedUrl: cc.mapEmbedUrl || prev.mapEmbedUrl
          }));
        }
      } catch (error) {
        console.error('Error fetching contact content:', error);
      }
    };
    fetchContent();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 5000);
  };

  const t = (en, bn) => language === 'bn' ? (bn || en) : en;

  const contactCards = [
    { icon: LuMail, title: t("Email Us", "ইমেইল করুন"), value: content.contactInfo.email, link: `mailto:${content.contactInfo.email}`, accent: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { icon: LuPhone, title: t("Call Us", "কল করুন"), value: content.contactInfo.phone, link: `tel:${content.contactInfo.phone.replace(/\s/g, '')}`, accent: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { icon: LuMapPin, title: t("Visit Us", "আমাদের অফিস"), value: t(content.contactInfo.address, content.contactInfo.addressBn), link: "https://maps.google.com", accent: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { icon: LuClock, title: t("Office Hours", "অফিস সময়"), value: t(content.contactInfo.officeHours, content.contactInfo.officeHoursBn), accent: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' }
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: content.socialLinks.facebook, label: 'Facebook', color: 'hover:bg-blue-600 hover:text-white' },
    { icon: FaYoutube, href: content.socialLinks.youtube, label: 'YouTube', color: 'hover:bg-red-600 hover:text-white' },
    { icon: FaLinkedinIn, href: content.socialLinks.linkedin, label: 'LinkedIn', color: 'hover:bg-sky-600 hover:text-white' },
    { icon: FaInstagram, href: content.socialLinks.instagram, label: 'Instagram', color: 'hover:bg-pink-600 hover:text-white' },
    { icon: FaWhatsapp, href: content.socialLinks.whatsapp, label: 'WhatsApp', color: 'hover:bg-green-600 hover:text-white' },
  ].filter(s => s.href && s.href !== '#');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Hero */}
      <header className="bg-white dark:bg-[#111] border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-4 lg:px-16 pt-28 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className={`inline-block text-xs font-semibold tracking-widest uppercase text-[#021E14] dark:text-[#D4AF37] mb-4 ${bengaliClass}`}>
              {t(content.hero.badge, content.hero.badgeBn)}
            </span>
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-5 leading-tight ${bengaliClass}`}>
              {language === 'bn'
                ? `${content.hero.title1Bn || ''}${content.hero.title2Bn || ''}`
                : <>{content.hero.title1}<span className="text-[#D4AF37]">{content.hero.title2}</span></>
              }
            </h1>
            <p className={`text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed ${bengaliClass}`}>
              {t(content.hero.subtitle, content.hero.subtitleBn)}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Contact Cards */}
      <section className="container mx-auto px-4 lg:px-16 -mt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-10">
          {contactCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group"
            >
              {card.link ? (
                <a href={card.link} className="block p-5 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className={`w-10 h-10 rounded-lg ${card.accent} flex items-center justify-center mb-3`}>
                    <card.icon size={18} />
                  </div>
                  <p className={`text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 ${bengaliClass}`}>{card.title}</p>
                  <p className={`text-sm font-semibold text-gray-800 dark:text-white ${bengaliClass}`}>{card.value}</p>
                </a>
              ) : (
                <div className="p-5 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                  <div className={`w-10 h-10 rounded-lg ${card.accent} flex items-center justify-center mb-3`}>
                    <card.icon size={18} />
                  </div>
                  <p className={`text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 ${bengaliClass}`}>{card.title}</p>
                  <p className={`text-sm font-semibold text-gray-800 dark:text-white ${bengaliClass}`}>{card.value}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 lg:px-16 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[60%]"
          >
            <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-6 md:p-10">
              <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-1 ${bengaliClass}`}>
                {t('Send us a Message', 'মেসেজ পাঠান')}
              </h2>
              <p className={`text-sm text-gray-400 mb-8 ${bengaliClass}`}>
                {t("Fill in the form and we'll respond within 24 hours.", 'ফর্ম পূরণ করুন, আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেব।')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{t('Full Name', 'পুরো নাম')}</label>
                    <input required type="text" placeholder={t('John Doe', 'আপনার নাম')}
                      className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-[#021E14] dark:focus:border-[#D4AF37] transition-colors dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{t('Email', 'ইমেইল')}</label>
                    <input required type="email" placeholder="you@example.com"
                      className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-[#021E14] dark:focus:border-[#D4AF37] transition-colors dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{t('Subject', 'বিষয়')}</label>
                  <input required type="text" placeholder={t('How can we help?', 'আমরা কিভাবে সাহায্য করতে পারি?')}
                    className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-[#021E14] dark:focus:border-[#D4AF37] transition-colors dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{t('Message', 'মেসেজ')}</label>
                  <textarea required rows="5" placeholder={t('Write your message here...', 'আপনার মেসেজ লিখুন...')}
                    className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-[#021E14] dark:focus:border-[#D4AF37] transition-colors dark:text-white resize-none"
                  />
                </div>

                <button type="submit"
                  className={`w-full py-3.5 bg-[#021E14] dark:bg-[#D4AF37] text-white dark:text-[#021E14] rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${bengaliClass}`}
                >
                  <AnimatePresence mode="wait">
                    {messageSent ? (
                      <motion.span key="sent" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                        <LuCheck size={16} /> {t('Sent Successfully!', 'সফলভাবে পাঠানো হয়েছে!')}
                      </motion.span>
                    ) : (
                      <motion.span key="send" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-2">
                        {t('Send Message', 'মেসেজ পাঠান')}
                        <LuSend size={14} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[40%] space-y-5"
          >
            {/* WhatsApp */}
            <div className="bg-[#25D366] rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-10">
                <FaWhatsapp size={80} />
              </div>
              <div className="relative z-10">
                <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${bengaliClass}`}>
                  <LuMessageCircle size={20} />
                  {t(content.whatsappSection.title, content.whatsappSection.titleBn)}
                </h3>
                <p className={`text-white/80 text-sm mb-5 leading-relaxed ${bengaliClass}`}>
                  {t(content.whatsappSection.description, content.whatsappSection.descriptionBn)}
                </p>
                <a
                  href={content.socialLinks.whatsapp && content.socialLinks.whatsapp !== '#'
                    ? content.socialLinks.whatsapp
                    : `https://wa.me/${content.contactInfo.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#25D366] rounded-lg font-semibold text-sm hover:shadow-lg transition-shadow ${bengaliClass}`}
                >
                  {t(content.whatsappSection.buttonText, content.whatsappSection.buttonTextBn)} <LuArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 p-6">
                <h3 className={`text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider ${bengaliClass}`}>
                  {t('Follow Us', 'আমাদের ফলো করুন')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, i) => (
                    <Link
                      key={i}
                      href={social.href}
                      target="_blank"
                      title={social.label}
                      className={`w-11 h-11 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300`}
                    >
                      <social.icon size={18} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Support Hours */}
            <div className="bg-[#021E14] rounded-xl p-6 text-white">
              <h3 className={`text-sm font-bold flex items-center gap-2 text-[#D4AF37] mb-5 uppercase tracking-wider ${bengaliClass}`}>
                <LuHeadphones size={16} />
                {t('Support Hours', 'সাপোর্ট সময়')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className={`text-white/50 text-sm ${bengaliClass}`}>{t('Saturday - Thursday', 'শনিবার - বৃহস্পতিবার')}</span>
                  <span className={`font-semibold text-sm ${bengaliClass}`}>
                    {t('10 AM - 6 PM', 'সকাল ১০টা - সন্ধ্যা ৬টা')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-white/50 text-sm ${bengaliClass}`}>{t('Friday', 'শুক্রবার')}</span>
                  <span className={`text-[#D4AF37] font-semibold text-xs uppercase tracking-wider ${bengaliClass}`}>{t('Holiday', 'ছুটি')}</span>
                </div>
              </div>
            </div>

            {/* Map */}
            {content.mapEmbedUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-white/10">
                <iframe
                  src={content.mapEmbedUrl}
                  width="100%"
                  height="200"
                  className="border-0"
                  loading="lazy"
                />
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

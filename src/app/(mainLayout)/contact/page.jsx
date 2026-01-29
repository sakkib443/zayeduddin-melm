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
  LuChevronRight,
  LuMessageCircle,
  LuHeadphones,
  LuSparkles,
  LuCheck,
  LuArrowRight
} from "react-icons/lu";
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL as API_URL } from "@/config/api";

const ContactInfoCard = ({ icon: Icon, title, value, link, color, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: idx * 0.1 }}
    className="group relative p-8 bg-white dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/10 shadow-xl shadow-black/5 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#300000]/5 dark:bg-[#D4AF37]/5 rounded-full blur-2xl group-hover:bg-[#300000]/10 dark:group-hover:bg-[#D4AF37]/10 transition-colors" />
    <div className="relative z-10">
      <div className="w-14 h-14 mb-6 rounded-2xl bg-[#300000]/5 dark:bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#300000] dark:group-hover:bg-[#D4AF37] transition-colors duration-500">
        <Icon className="w-6 h-6 text-[#300000] dark:text-[#D4AF37] group-hover:text-white dark:group-hover:text-[#300000] transition-colors duration-500" />
      </div>
      <h3 className="text-xs font-bold text-slate-400 dark:text-white/50 uppercase tracking-widest mb-3">{title}</h3>
      {link ? (
        <a href={link} className="text-lg font-bold text-slate-800 dark:text-white hover:text-[#300000] dark:hover:text-[#D4AF37] transition-colors break-words">
          {value}
        </a>
      ) : (
        <p className="text-lg font-bold text-slate-800 dark:text-white">{value}</p>
      )}
    </div>
  </motion.div>
);

const ContactPage = () => {
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";
  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [content, setContent] = useState({
    contactInfo: {
      email: 'info@jayeduddin.com',
      phone: '+880 1829-818616',
      address: 'Dhaka, Bangladesh',
      addressBn: 'ঢাকা, বাংলাদেশ',
      officeHours: 'Sat - Thu: 10:00 AM - 6:00 PM',
      officeHoursBn: 'শনি - বৃহঃ: সকাল ১০টা - সন্ধ্যা ৬টা'
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${API_URL}/design/contact`);
        const data = await res.json();
        if (data.success && data.data?.contactContent) {
          setContent(prev => ({ ...prev, ...data.data.contactContent }));
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

  const contactCards = [
    { icon: LuMail, title: language === "bn" ? "ইমেইল করুন" : "Email Us", value: content.contactInfo.email, link: `mailto:${content.contactInfo.email}` },
    { icon: LuPhone, title: language === "bn" ? "কল করুন" : "Call Us", value: content.contactInfo.phone, link: `tel:${content.contactInfo.phone.replace(/\s/g, '')}` },
    { icon: LuMapPin, title: language === "bn" ? "আমাদের অফিস" : "Visit Us", value: language === "bn" ? content.contactInfo.addressBn : content.contactInfo.address, link: "https://maps.google.com" },
    { icon: LuClock, title: language === "bn" ? "অফিস সময়" : "Office Hours", value: language === "bn" ? content.contactInfo.officeHoursBn : content.contactInfo.officeHours }
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", color: "hover:bg-[#1877F2]" },
    { icon: FaYoutube, href: "#", color: "hover:bg-[#FF0000]" },
    { icon: FaLinkedinIn, href: "#", color: "hover:bg-[#0A66C2]" },
    { icon: FaInstagram, href: "#", color: "hover:bg-[#E4405F]" },
    { icon: FaWhatsapp, href: "#", color: "hover:bg-[#25D366]" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#020202]">
      {/* Header Section */}
      <header className="relative pt-24 pb-20 items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#30000008,transparent_50%)]" />
        <div className="container mx-auto px-4 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#300000]/5 dark:bg-[#D4AF37]/10 border border-[#300000]/10 dark:border-[#D4AF37]/20 rounded-full mb-8">
              <LuSparkles className="text-[#300000] dark:text-[#D4AF37]" size={14} />
              <span className="text-[10px] font-bold text-[#300000] dark:text-[#D4AF37] tracking-widest uppercase">
                {language === 'bn' ? 'যোগাযোগ করুন' : 'Get In Touch'}
              </span>
            </div>
            <h1 className={`text-4xl md:text-7xl font-script italic text-[#300000] dark:text-[#D4AF37] mb-6 leading-tight ${bengaliClass}`}>
              {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : "Let's Start a Conversation"}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
              {language === 'bn'
                ? 'আপনার যেকোনো প্রশ্ন বা সহযোগিতার জন্য আমরা সর্বদা প্রস্তুত। আমাদের মেসেজ পাঠান বা সরাসরি কল করুন।'
                : "Have questions or need support? We'd love to hear from you. Reach out and our team will get back to you shortly."}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Contact Cards Grid */}
      <section className="pb-24 container mx-auto px-4 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactCards.map((card, idx) => (
            <ContactInfoCard key={idx} {...card} idx={idx} />
          ))}
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="pb-32 container mx-auto px-4 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[60%]"
          >
            <div className="p-8 md:p-12 bg-white dark:bg-white/5 rounded-[48px] border border-slate-100 dark:border-white/10 shadow-2xl shadow-black/5">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-10 flex items-center gap-4">
                <span className="w-12 h-1 bg-[#300000] dark:bg-[#D4AF37] rounded-full" />
                {language === 'bn' ? 'মেসেজ পাঠান' : 'Send us a Message'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-8 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#300000]/20 dark:focus:border-[#D4AF37]/20 rounded-full outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-8 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#300000]/20 dark:focus:border-[#D4AF37]/20 rounded-full outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Subject</label>
                  <input
                    required
                    type="text"
                    placeholder="How can we help?"
                    className="w-full px-8 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#300000]/20 dark:focus:border-[#D4AF37]/20 rounded-full outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Message</label>
                  <textarea
                    required
                    rows="6"
                    placeholder="Write your message here..."
                    className="w-full px-8 py-6 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-[#300000]/20 dark:focus:border-[#D4AF37]/20 rounded-[32px] outline-none transition-all dark:text-white resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-[#300000] text-white rounded-full font-bold shadow-2xl shadow-[#300000]/20 hover:bg-[#4a0000] transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
                >
                  <AnimatePresence mode="wait">
                    {messageSent ? (
                      <motion.span
                        key="sent"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <LuCheck size={20} /> Sent Successfully!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        {language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
                        <LuSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Socials Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[40%] space-y-8"
          >
            {/* WhatsApp Card */}
            <div className="p-10 bg-[#25D366] rounded-[48px] text-white shadow-2xl shadow-[#25D366]/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
                <FaWhatsapp size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <LuMessageCircle size={32} />
                  Quick Chat?
                </h3>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Need instant support? Chat with our experts directly on WhatsApp for immediate assistance.
                </p>
                <a
                  href={`https://wa.me/${content.contactInfo.phone.replace(/[^0-9]/g, '')}`}
                  className="inline-flex items-center gap-3 px-8 py-3 bg-white text-[#25D366] rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Message Us Now <LuArrowRight size={18} />
                </a>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[48px] border border-slate-100 dark:border-white/10 shadow-xl shadow-black/5">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8 border-b border-[#300000]/10 dark:border-white/10 pb-4 uppercase tracking-widest text-xs">Stay Connected</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, i) => (
                  <Link
                    key={i}
                    href={social.href}
                    className={`w-14 h-14 rounded-2xl bg-white dark:bg-[#020202] shadow-sm flex items-center justify-center text-slate-400 hover:text-white ${social.color} transition-all duration-300 hover:-translate-y-1`}
                  >
                    <social.icon size={24} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Hours Card */}
            <div className="p-10 bg-[#300000] rounded-[48px] text-white shadow-2xl shadow-[#300000]/20">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#D4AF37]">
                <LuHeadphones />
                Support Hours
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-white/50 text-sm">Saturday - Thursday</span>
                  <span className="font-bold">10 AM - 6 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-sm">Friday</span>
                  <span className="text-red-400 font-bold uppercase tracking-widest text-xs">Holiday</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4 lg:px-16 pb-32">
        <div className="rounded-[60px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border-8 border-white dark:border-white/5">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8986834879085!2d90.41723!3d23.7656976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c754583dd209%3A0xdd0c5fcc7d2d3836!2sDaisy%20Garden!5e0!3m2!1sen!2sbd!4v1704532086149!5m2!1sen!2sbd"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                .font-script {
                    font-family: 'Dancing Script', cursive;
                }
            `}</style>
    </div>
  );
};

export default ContactPage;

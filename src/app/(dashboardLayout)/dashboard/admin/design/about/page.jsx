"use client";
import { API_URL } from '@/config/api';
import React, { useState, useEffect } from 'react';
import { LuSave, LuRefreshCw, LuEye, LuUsers, LuGraduationCap, LuBookOpen, LuAward, LuTarget, LuGlobe, LuSparkles, LuMessageCircle, LuPlus, LuTrash2 } from 'react-icons/lu';
import { useTheme } from '@/providers/ThemeProvider';
import toast from 'react-hot-toast';

const defaultAboutContent = {
    hero: {
        badge: 'Our Story',
        badgeBn: 'আমাদের সম্পর্কে',
        title: 'Building Skills, Shaping Futures',
        titleBn: 'দক্ষতা বুনন, ভবিষ্যৎ গঠন',
        description: 'We turn potential into professional success. Our mission is to empower the youth of Bangladesh with world-class digital skills.',
        descriptionBn: 'আমরা সম্ভাবনাকে পেশাদার সাফল্যে রূপান্তর করি। আমাদের লক্ষ্য হলো বাংলাদেশের তরুণদের বিশ্বমানের ডিজিটাল দক্ষতায় দক্ষ করে তোলা।',
        buttonText: 'Explore Courses',
        buttonTextBn: 'কোর্সগুলো দেখুন',
        happyStudents: '50k+ Happy Students',
        happyStudentsBn: '৫০ হাজার+ সন্তুষ্ট শিক্ষার্থী'
    },
    stats: [
        { number: '50k+', label: 'Active Learners', labelBn: 'সক্রিয় শিক্ষার্থী' },
        { number: '120+', label: 'Expert Mentors', labelBn: 'বিশেষজ্ঞ মেন্টর' },
        { number: '500+', label: 'Premium Courses', labelBn: 'প্রিমিয়াম কোর্স' },
        { number: '4.9', label: 'Top Rated', labelBn: 'শীর্ষ রেটিং' }
    ],
    mission: {
        title: 'Our Mission',
        titleBn: 'আমাদের মিশন',
        description: 'We teach more than just code. We foster a community of innovators ready to lead the next digital revolution with cutting-edge expertise.',
        descriptionBn: 'আমরা কোডিংয়ের চেয়ে বেশি কিছু শেখাই। আমরা একটি সম্প্রদায় গড়ে তুলি যারা উদ্ভাবন এবং প্রযুক্তির মাধ্যমে ভবিষ্যতের চ্যালেঞ্জ মোকাবেলা করতে সক্ষম।',
        quote: '"Education is not the learning of facts, but the training of the mind to think."',
        quoteBn: '"শিক্ষা তথ্য মুখস্থ করা নয়, বরং মনকে চিন্তা করতে শেখানো।"',
        quoteLabel: 'Our Philosophy',
        quoteLabelBn: 'আমাদের দর্শন',
        features: [
            { title: 'Our Target', titleBn: 'আমাদের লক্ষ্য', desc: 'Digital Literacy for all.', descBn: 'সবার জন্য ডিজিটাল সাক্ষরতা।' },
            { title: 'Global Standard', titleBn: 'বিশ্বমান', desc: 'Industry-vetted curriculum.', descBn: 'ইন্ডাস্ট্রি-অনুমোদিত কারিকুলাম।' }
        ]
    },
    whyUs: {
        title: 'Why Choose Us?',
        titleBn: 'কেন আমরা সেরা?',
        features: [
            { title: 'Student Focused', titleBn: 'শিক্ষার্থী কেন্দ্রিক', desc: 'Every curriculum is designed keeping the student\'s journey in mind, ensuring maximum learning impact.', descBn: 'প্রতিটি কারিকুলাম শিক্ষার্থীদের কথা মাথায় রেখে ডিজাইন করা হয়েছে।' },
            { title: 'Expert Mentors', titleBn: 'বিশেষজ্ঞ মেন্টর', desc: 'Learn directly from industry veterans who bring real-world projects and insights to the classroom.', descBn: 'ইন্ডাস্ট্রির অভিজ্ঞদের কাছ থেকে সরাসরি শিখুন।' },
            { title: 'Certifications', titleBn: 'সার্টিফিকেশন', desc: 'Earn certificates that are recognized by top tech companies and valid across the global job market.', descBn: 'শীর্ষ কোম্পানি দ্বারা স্বীকৃত সার্টিফিকেট অর্জন করুন।' }
        ]
    },
    cta: {
        title: 'Begin Your Legacy',
        titleBn: 'আপনার যাত্রা শুরু করুন',
        description: 'Join over 50,000 students worldwide and start your journey towards greatness today.',
        descriptionBn: 'বিশ্বব্যাপী ৫০ হাজারেরও বেশি শিক্ষার্থীর সাথে যোগ দিন এবং আজই আপনার যাত্রা শুরু করুন।',
        button1Text: 'Get Started Now',
        button1TextBn: 'কোর্সগুলো দেখুন',
        button2Text: 'Contact Support',
        button2TextBn: 'যোগাযোগ করুন'
    }
};

const AboutDesignPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aboutContent, setAboutContent] = useState(defaultAboutContent);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/about`);
            const data = await res.json();
            if (data.success && data.data?.aboutContent) {
                const ac = data.data.aboutContent;
                setAboutContent(prev => ({
                    hero: { ...prev.hero, ...(ac.hero || {}) },
                    stats: ac.stats?.length ? ac.stats : prev.stats,
                    mission: {
                        ...prev.mission,
                        ...(ac.mission || {}),
                        features: ac.mission?.features?.length ? ac.mission.features : prev.mission.features
                    },
                    whyUs: {
                        ...prev.whyUs,
                        ...(ac.whyUs || {}),
                        features: ac.whyUs?.features?.length ? ac.whyUs.features : prev.whyUs.features
                    },
                    cta: { ...prev.cta, ...(ac.cta || {}) }
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API_URL}/design/about`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aboutContent })
            });
            const data = await res.json();
            if (data.success) toast.success('About page saved!');
            else toast.error('Failed: ' + (data.message || ''));
        } catch (err) {
            toast.error('Error saving');
        } finally {
            setSaving(false);
        }
    };

    const inputCls = `w-full mt-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-emerald-500 outline-none`;
    const labelCls = `text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
    const cardCls = `p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-gray-500">Loading about page design...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>About Page Design</h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Edit all sections of the about page</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                        <LuRefreshCw size={18} /> Refresh
                    </button>
                    <a href="/about" target="_blank" className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                        <LuEye size={18} /> Preview
                    </a>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-[#021E14] text-white rounded-xl font-semibold shadow-lg hover:bg-[#01140D] transition-all disabled:opacity-50">
                        <LuSave size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* ===== HERO SECTION ===== */}
            <div className={`${cardCls} lg:col-span-2`}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center"><LuSparkles className="text-white" size={20} /></div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hero Section</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Badge (EN)</label><input className={inputCls} value={aboutContent.hero.badge} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Badge (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.hero.badgeBn} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, badgeBn: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Title (EN)</label><input className={inputCls} value={aboutContent.hero.title} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, title: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Title (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.hero.titleBn} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, titleBn: e.target.value } }))} /></div>
                    <div className="md:col-span-2"><label className={labelCls}>Description (EN)</label><textarea className={inputCls} rows={2} value={aboutContent.hero.description} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, description: e.target.value } }))} /></div>
                    <div className="md:col-span-2"><label className={labelCls}>Description (বাংলা)</label><textarea className={`${inputCls} hind-siliguri`} rows={2} value={aboutContent.hero.descriptionBn} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, descriptionBn: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Button Text (EN)</label><input className={inputCls} value={aboutContent.hero.buttonText} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, buttonText: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Button Text (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.hero.buttonTextBn} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, buttonTextBn: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Happy Students Text (EN)</label><input className={inputCls} value={aboutContent.hero.happyStudents} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, happyStudents: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Happy Students (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.hero.happyStudentsBn} onChange={e => setAboutContent(p => ({ ...p, hero: { ...p.hero, happyStudentsBn: e.target.value } }))} /></div>
                </div>
            </div>

            {/* ===== STATS SECTION ===== */}
            <div className={cardCls}>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center"><LuAward className="text-white" size={20} /></div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Statistics ({aboutContent.stats.length})</h3>
                    </div>
                    <button onClick={() => setAboutContent(p => ({ ...p, stats: [...p.stats, { number: '', label: '', labelBn: '' }] }))} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 text-sm font-medium hover:bg-blue-500/20 transition-colors">
                        <LuPlus size={14} /> Add Stat
                    </button>
                </div>
                <div className="space-y-4">
                    {aboutContent.stats.map((stat, i) => (
                        <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${isDark ? 'bg-slate-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{i + 1}</span>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div><label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Number</label><input className={inputCls} value={stat.number} onChange={e => { const s = [...aboutContent.stats]; s[i] = { ...s[i], number: e.target.value }; setAboutContent(p => ({ ...p, stats: s })); }} placeholder="50k+" /></div>
                                <div><label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Label (EN)</label><input className={inputCls} value={stat.label} onChange={e => { const s = [...aboutContent.stats]; s[i] = { ...s[i], label: e.target.value }; setAboutContent(p => ({ ...p, stats: s })); }} /></div>
                                <div><label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Label (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={stat.labelBn} onChange={e => { const s = [...aboutContent.stats]; s[i] = { ...s[i], labelBn: e.target.value }; setAboutContent(p => ({ ...p, stats: s })); }} /></div>
                            </div>
                            <button onClick={() => setAboutContent(p => ({ ...p, stats: p.stats.filter((_, j) => j !== i) }))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0 mt-1"><LuTrash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== MISSION SECTION ===== */}
            <div className={cardCls}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center"><LuTarget className="text-white" size={20} /></div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Mission Section</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Title (EN)</label><input className={inputCls} value={aboutContent.mission.title} onChange={e => setAboutContent(p => ({ ...p, mission: { ...p.mission, title: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Title (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.mission.titleBn} onChange={e => setAboutContent(p => ({ ...p, mission: { ...p.mission, titleBn: e.target.value } }))} /></div>
                    <div className="md:col-span-2"><label className={labelCls}>Description (EN)</label><textarea className={inputCls} rows={2} value={aboutContent.mission.description} onChange={e => setAboutContent(p => ({ ...p, mission: { ...p.mission, description: e.target.value } }))} /></div>
                    <div className="md:col-span-2"><label className={labelCls}>Description (বাংলা)</label><textarea className={`${inputCls} hind-siliguri`} rows={2} value={aboutContent.mission.descriptionBn} onChange={e => setAboutContent(p => ({ ...p, mission: { ...p.mission, descriptionBn: e.target.value } }))} /></div>
                    <div className="md:col-span-2"><label className={labelCls}>Quote (EN)</label><textarea className={inputCls} rows={2} value={aboutContent.mission.quote} onChange={e => setAboutContent(p => ({ ...p, mission: { ...p.mission, quote: e.target.value } }))} /></div>
                    <div className="md:col-span-2"><label className={labelCls}>Quote (বাংলা)</label><textarea className={`${inputCls} hind-siliguri`} rows={2} value={aboutContent.mission.quoteBn} onChange={e => setAboutContent(p => ({ ...p, mission: { ...p.mission, quoteBn: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Quote Label (EN)</label><input className={inputCls} value={aboutContent.mission.quoteLabel} onChange={e => setAboutContent(p => ({ ...p, mission: { ...p.mission, quoteLabel: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Quote Label (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.mission.quoteLabelBn} onChange={e => setAboutContent(p => ({ ...p, mission: { ...p.mission, quoteLabelBn: e.target.value } }))} /></div>
                </div>
                {/* Mission Features */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Mission Features</h4>
                        <button onClick={() => setAboutContent(p => ({ ...p, mission: { ...p.mission, features: [...p.mission.features, { title: '', titleBn: '', desc: '', descBn: '' }] } }))} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 text-sm font-medium hover:bg-amber-500/20 transition-colors"><LuPlus size={14} /> Add</button>
                    </div>
                    {aboutContent.mission.features.map((f, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-xl mb-2 ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <input className={inputCls} placeholder="Title EN" value={f.title} onChange={e => { const fs = [...aboutContent.mission.features]; fs[i] = { ...fs[i], title: e.target.value }; setAboutContent(p => ({ ...p, mission: { ...p.mission, features: fs } })); }} />
                                <input className={`${inputCls} hind-siliguri`} placeholder="Title বাংলা" value={f.titleBn} onChange={e => { const fs = [...aboutContent.mission.features]; fs[i] = { ...fs[i], titleBn: e.target.value }; setAboutContent(p => ({ ...p, mission: { ...p.mission, features: fs } })); }} />
                                <input className={inputCls} placeholder="Desc EN" value={f.desc} onChange={e => { const fs = [...aboutContent.mission.features]; fs[i] = { ...fs[i], desc: e.target.value }; setAboutContent(p => ({ ...p, mission: { ...p.mission, features: fs } })); }} />
                                <input className={`${inputCls} hind-siliguri`} placeholder="Desc বাংলা" value={f.descBn} onChange={e => { const fs = [...aboutContent.mission.features]; fs[i] = { ...fs[i], descBn: e.target.value }; setAboutContent(p => ({ ...p, mission: { ...p.mission, features: fs } })); }} />
                            </div>
                            <button onClick={() => setAboutContent(p => ({ ...p, mission: { ...p.mission, features: p.mission.features.filter((_, j) => j !== i) } }))} className="p-2 text-red-400 hover:text-red-600 rounded-lg"><LuTrash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== WHY US SECTION ===== */}
            <div className={cardCls}>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center"><LuUsers className="text-white" size={20} /></div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Why Choose Us</h3>
                    </div>
                    <button onClick={() => setAboutContent(p => ({ ...p, whyUs: { ...p.whyUs, features: [...p.whyUs.features, { title: '', titleBn: '', desc: '', descBn: '' }] } }))} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 text-sm font-medium hover:bg-purple-500/20 transition-colors"><LuPlus size={14} /> Add Feature</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div><label className={labelCls}>Section Title (EN)</label><input className={inputCls} value={aboutContent.whyUs.title} onChange={e => setAboutContent(p => ({ ...p, whyUs: { ...p.whyUs, title: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Section Title (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.whyUs.titleBn} onChange={e => setAboutContent(p => ({ ...p, whyUs: { ...p.whyUs, titleBn: e.target.value } }))} /></div>
                </div>
                <div className="space-y-3">
                    {aboutContent.whyUs.features.map((f, i) => (
                        <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>{i + 1}</span>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div><label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Title (EN)</label><input className={inputCls} value={f.title} onChange={e => { const fs = [...aboutContent.whyUs.features]; fs[i] = { ...fs[i], title: e.target.value }; setAboutContent(p => ({ ...p, whyUs: { ...p.whyUs, features: fs } })); }} /></div>
                                <div><label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Title (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={f.titleBn} onChange={e => { const fs = [...aboutContent.whyUs.features]; fs[i] = { ...fs[i], titleBn: e.target.value }; setAboutContent(p => ({ ...p, whyUs: { ...p.whyUs, features: fs } })); }} /></div>
                                <div><label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Description (EN)</label><textarea className={inputCls} rows={2} value={f.desc} onChange={e => { const fs = [...aboutContent.whyUs.features]; fs[i] = { ...fs[i], desc: e.target.value }; setAboutContent(p => ({ ...p, whyUs: { ...p.whyUs, features: fs } })); }} /></div>
                                <div><label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Description (বাংলা)</label><textarea className={`${inputCls} hind-siliguri`} rows={2} value={f.descBn} onChange={e => { const fs = [...aboutContent.whyUs.features]; fs[i] = { ...fs[i], descBn: e.target.value }; setAboutContent(p => ({ ...p, whyUs: { ...p.whyUs, features: fs } })); }} /></div>
                            </div>
                            <button onClick={() => setAboutContent(p => ({ ...p, whyUs: { ...p.whyUs, features: p.whyUs.features.filter((_, j) => j !== i) } }))} className="p-2 text-red-400 hover:text-red-600 rounded-lg shrink-0 mt-1"><LuTrash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== CTA SECTION ===== */}
            <div className={cardCls}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-amber-700 rounded-xl flex items-center justify-center"><LuMessageCircle className="text-white" size={20} /></div>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Call to Action (CTA)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Title (EN)</label><input className={inputCls} value={aboutContent.cta.title} onChange={e => setAboutContent(p => ({ ...p, cta: { ...p.cta, title: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Title (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.cta.titleBn} onChange={e => setAboutContent(p => ({ ...p, cta: { ...p.cta, titleBn: e.target.value } }))} /></div>
                    <div className="md:col-span-2"><label className={labelCls}>Description (EN)</label><textarea className={inputCls} rows={2} value={aboutContent.cta.description} onChange={e => setAboutContent(p => ({ ...p, cta: { ...p.cta, description: e.target.value } }))} /></div>
                    <div className="md:col-span-2"><label className={labelCls}>Description (বাংলা)</label><textarea className={`${inputCls} hind-siliguri`} rows={2} value={aboutContent.cta.descriptionBn} onChange={e => setAboutContent(p => ({ ...p, cta: { ...p.cta, descriptionBn: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Button 1 (EN)</label><input className={inputCls} value={aboutContent.cta.button1Text} onChange={e => setAboutContent(p => ({ ...p, cta: { ...p.cta, button1Text: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Button 1 (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.cta.button1TextBn} onChange={e => setAboutContent(p => ({ ...p, cta: { ...p.cta, button1TextBn: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Button 2 (EN)</label><input className={inputCls} value={aboutContent.cta.button2Text} onChange={e => setAboutContent(p => ({ ...p, cta: { ...p.cta, button2Text: e.target.value } }))} /></div>
                    <div><label className={labelCls}>Button 2 (বাংলা)</label><input className={`${inputCls} hind-siliguri`} value={aboutContent.cta.button2TextBn} onChange={e => setAboutContent(p => ({ ...p, cta: { ...p.cta, button2TextBn: e.target.value } }))} /></div>
                </div>
            </div>
        </div>
    );
};

export default AboutDesignPage;

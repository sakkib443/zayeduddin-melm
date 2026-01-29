"use client";
import { API_URL, API_BASE_URL } from '@/config/api';


import React, { useState, useEffect } from 'react';
import { LuSave, LuRefreshCw, LuEye, LuMail, LuPhone, LuMapPin, LuClock, LuGlobe, LuMessageCircle } from 'react-icons/lu';
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { useTheme } from '@/providers/ThemeProvider';



const ContactDesignPage = () => {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [contactContent, setContactContent] = useState({
        hero: {
            badge: 'Get In Touch',
            badgeBn: '??????? ????',
            title1: "Let's ",
            title1Bn: '?????? ???? ',
            title2: 'Connect',
            title2Bn: '??????? ????',
            subtitle: 'Have questions? We would love to hear from you.',
            subtitleBn: '???? ?????? ???? ?????? ????? ??????'
        },
        contactInfo: {
            email: 'info@ejobsit.com',
            phone: '+88 01730481212',
            address: 'Daisy Garden, House 14 (Level-5), Block A, Banasree, Dhaka',
            addressBn: '????? ???????, ????? ?? (?????-?), ???? ?, ??????, ????',
            officeHours: 'Sat - Thu: 10:00 AM - 6:00 PM',
            officeHoursBn: '??? - ????????: ???? ???? - ??????? ???'
        },
        socialLinks: {
            facebook: 'https://www.facebook.com/ejobsit',
            youtube: 'https://www.youtube.com/@ejobsit',
            linkedin: 'https://www.linkedin.com/company/ejobsit',
            whatsapp: 'https://wa.me/8801730481212',
            instagram: 'https://www.instagram.com/ejobsit/'
        },
        whatsappSection: {
            title: 'Need Quick Help?',
            titleBn: '????? ??????? ??????',
            description: 'Chat with us on WhatsApp for instant support.',
            descriptionBn: '????????? ????????? ???? ????????????? ????? ?????',
            buttonText: 'Chat on WhatsApp',
            buttonTextBn: '????????????? ????? ????'
        },
        mapEmbedUrl: ''
    });

    useEffect(() => {
        fetchContactDesign();
    }, []);

    const fetchContactDesign = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/design/contact`);
            const data = await res.json();
            if (data.success && data.data?.contactContent) {
                setContactContent(data.data.contactContent);
            }
        } catch (error) {
            console.error('Error fetching contact design:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await fetch(`${API_URL}/design/contact`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contactContent })
            });
            const data = await res.json();
            if (data.success) {
                alert('Contact page saved successfully!');
            } else {
                alert('Failed to save: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving contact page');
        } finally {
            setSaving(false);
        }
    };

    const updateHero = (field, value) => {
        setContactContent(prev => ({
            ...prev,
            hero: { ...prev.hero, [field]: value }
        }));
    };

    const updateContactInfo = (field, value) => {
        setContactContent(prev => ({
            ...prev,
            contactInfo: { ...prev.contactInfo, [field]: value }
        }));
    };

    const updateSocialLinks = (field, value) => {
        setContactContent(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [field]: value }
        }));
    };

    const updateWhatsappSection = (field, value) => {
        setContactContent(prev => ({
            ...prev,
            whatsappSection: { ...prev.whatsappSection, [field]: value }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading contact design...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Contact Page Design
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Customize the contact page content and information
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchContactDesign}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                    >
                        <LuRefreshCw size={18} />
                        Refresh
                    </button>
                    <a
                        href="/contact"
                        target="_blank"
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                    >
                        <LuEye size={18} />
                        Preview
                    </a>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50"
                    >
                        <LuSave size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hero Section */}
                <div className={`p-6 rounded-2xl lg:col-span-2 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <LuMessageCircle className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Hero Section</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Badge (English)</label>
                            <input
                                type="text"
                                value={contactContent.hero?.badge || ''}
                                onChange={(e) => updateHero('badge', e.target.value)}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="Get In Touch"
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Badge (?????)</label>
                            <input
                                type="text"
                                value={contactContent.hero?.badgeBn || ''}
                                onChange={(e) => updateHero('badgeBn', e.target.value)}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 hind-siliguri`}
                                placeholder="??????? ????"
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Title Part 1 (English)</label>
                            <input
                                type="text"
                                value={contactContent.hero?.title1 || ''}
                                onChange={(e) => updateHero('title1', e.target.value)}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="Let's "
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Title Part 2 (Colored)</label>
                            <input
                                type="text"
                                value={contactContent.hero?.title2 || ''}
                                onChange={(e) => updateHero('title2', e.target.value)}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 text-red-500 font-bold`}
                                placeholder="Connect"
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subtitle (English)</label>
                            <textarea
                                value={contactContent.hero?.subtitle || ''}
                                onChange={(e) => updateHero('subtitle', e.target.value)}
                                rows={2}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="Have questions? We'd love to hear from you..."
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subtitle (?????)</label>
                            <textarea
                                value={contactContent.hero?.subtitleBn || ''}
                                onChange={(e) => updateHero('subtitleBn', e.target.value)}
                                rows={2}
                                className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 hind-siliguri`}
                                placeholder="???? ?????? ???? ?????? ????? ?????..."
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <LuPhone className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <LuMail className="text-red-500 shrink-0" size={18} />
                            <input
                                type="email"
                                value={contactContent.contactInfo?.email || ''}
                                onChange={(e) => updateContactInfo('email', e.target.value)}
                                className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="info@example.com"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <LuPhone className="text-orange-500 shrink-0" size={18} />
                            <input
                                type="text"
                                value={contactContent.contactInfo?.phone || ''}
                                onChange={(e) => updateContactInfo('phone', e.target.value)}
                                className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="+88 01XXXXXXXXX"
                            />
                        </div>
                        <div className="flex items-start gap-3">
                            <LuMapPin className="text-purple-500 shrink-0 mt-3" size={18} />
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    value={contactContent.contactInfo?.address || ''}
                                    onChange={(e) => updateContactInfo('address', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                    placeholder="Address (English)"
                                />
                                <input
                                    type="text"
                                    value={contactContent.contactInfo?.addressBn || ''}
                                    onChange={(e) => updateContactInfo('addressBn', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 hind-siliguri`}
                                    placeholder="?????? (?????)"
                                />
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <LuClock className="text-pink-500 shrink-0 mt-3" size={18} />
                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    value={contactContent.contactInfo?.officeHours || ''}
                                    onChange={(e) => updateContactInfo('officeHours', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                    placeholder="Office Hours (English)"
                                />
                                <input
                                    type="text"
                                    value={contactContent.contactInfo?.officeHoursBn || ''}
                                    onChange={(e) => updateContactInfo('officeHoursBn', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 hind-siliguri`}
                                    placeholder="???? ?????? (?????)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <LuGlobe className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Social Links</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <FaFacebookF className="text-blue-600" size={16} />
                            </div>
                            <input
                                type="url"
                                value={contactContent.socialLinks?.facebook || ''}
                                onChange={(e) => updateSocialLinks('facebook', e.target.value)}
                                className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="Facebook URL"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center">
                                <FaYoutube className="text-red-600" size={16} />
                            </div>
                            <input
                                type="url"
                                value={contactContent.socialLinks?.youtube || ''}
                                onChange={(e) => updateSocialLinks('youtube', e.target.value)}
                                className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="YouTube URL"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-sky-500/10 rounded-lg flex items-center justify-center">
                                <FaLinkedinIn className="text-sky-600" size={16} />
                            </div>
                            <input
                                type="url"
                                value={contactContent.socialLinks?.linkedin || ''}
                                onChange={(e) => updateSocialLinks('linkedin', e.target.value)}
                                className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="LinkedIn URL"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <FaWhatsapp className="text-green-600" size={16} />
                            </div>
                            <input
                                type="url"
                                value={contactContent.socialLinks?.whatsapp || ''}
                                onChange={(e) => updateSocialLinks('whatsapp', e.target.value)}
                                className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="WhatsApp URL (wa.me/...)"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-pink-500/10 rounded-lg flex items-center justify-center">
                                <FaInstagram className="text-pink-600" size={16} />
                            </div>
                            <input
                                type="url"
                                value={contactContent.socialLinks?.instagram || ''}
                                onChange={(e) => updateSocialLinks('instagram', e.target.value)}
                                className={`flex-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="Instagram URL"
                            />
                        </div>
                    </div>
                </div>

                {/* WhatsApp Section */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                            <FaWhatsapp className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>WhatsApp Quick Help Section</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Title (English)</label>
                                <input
                                    type="text"
                                    value={contactContent.whatsappSection?.title || ''}
                                    onChange={(e) => updateWhatsappSection('title', e.target.value)}
                                    className={`w-full mt-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                    placeholder="Need Quick Help?"
                                />
                            </div>
                            <div>
                                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Title (?????)</label>
                                <input
                                    type="text"
                                    value={contactContent.whatsappSection?.titleBn || ''}
                                    onChange={(e) => updateWhatsappSection('titleBn', e.target.value)}
                                    className={`w-full mt-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 hind-siliguri`}
                                    placeholder="????? ??????? ??????"
                                />
                            </div>
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description (English)</label>
                            <textarea
                                value={contactContent.whatsappSection?.description || ''}
                                onChange={(e) => updateWhatsappSection('description', e.target.value)}
                                rows={2}
                                className={`w-full mt-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                placeholder="Chat with us for instant support..."
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description (?????)</label>
                            <textarea
                                value={contactContent.whatsappSection?.descriptionBn || ''}
                                onChange={(e) => updateWhatsappSection('descriptionBn', e.target.value)}
                                rows={2}
                                className={`w-full mt-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 hind-siliguri`}
                                placeholder="????????? ????????? ???? ????? ????..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Button Text (English)</label>
                                <input
                                    type="text"
                                    value={contactContent.whatsappSection?.buttonText || ''}
                                    onChange={(e) => updateWhatsappSection('buttonText', e.target.value)}
                                    className={`w-full mt-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                                    placeholder="Chat on WhatsApp"
                                />
                            </div>
                            <div>
                                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Button Text (?????)</label>
                                <input
                                    type="text"
                                    value={contactContent.whatsappSection?.buttonTextBn || ''}
                                    onChange={(e) => updateWhatsappSection('buttonTextBn', e.target.value)}
                                    className={`w-full mt-1 px-4 py-2.5 rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500 hind-siliguri`}
                                    placeholder="????????????? ????? ????"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Embed */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <LuMapPin className="text-white" size={20} />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Google Map Embed</h3>
                    </div>
                    <div>
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Map Embed URL</label>
                        <input
                            type="url"
                            value={contactContent.mapEmbedUrl || ''}
                            onChange={(e) => setContactContent(prev => ({ ...prev, mapEmbedUrl: e.target.value }))}
                            className={`w-full mt-1 px-4 py-3 rounded-xl ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-gray-50 text-gray-900 border-gray-200'} border focus:ring-2 focus:ring-red-500`}
                            placeholder="https://www.google.com/maps/embed?pb=..."
                        />
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Get this URL from Google Maps ? Share ? Embed a map ? Copy the src URL from the iframe
                        </p>
                    </div>
                    {contactContent.mapEmbedUrl && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600">
                            <iframe
                                src={contactContent.mapEmbedUrl}
                                width="100%"
                                height="200"
                                className="border-0 grayscale hover:grayscale-0 transition-all"
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactDesignPage;


"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";
import { API_URL } from "@/config/api";
import toast from "react-hot-toast";
import {
    LuShoppingCart,
    LuCheck,
    LuStar,
    LuLayers,
    LuDownload,
    LuFileCode,
    LuSearch,
    LuHeart,
    LuEye,
    LuCalendar,
    LuRefreshCw,
} from "react-icons/lu";
import {
    FiMessageSquare,
    FiFolder,
    FiShare2,
    FiThumbsUp,
    FiTool,
    FiMoreVertical,
    FiPlus,
    FiChevronLeft,
    FiBookmark,
} from "react-icons/fi";
import { SiAdobephotoshop, SiAdobeillustrator, SiAdobeaftereffects, SiFigma, SiSketch, SiCanva } from "react-icons/si";

// Loading Skeleton
const DetailSkeleton = () => (
    <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-16 bg-white border-b" />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="aspect-video bg-gray-200 rounded-2xl mb-8" />
            <div className="flex gap-8">
                <div className="flex-1 space-y-4">
                    <div className="h-8 w-1/2 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
                <div className="w-20 space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-12 h-12 bg-gray-200 rounded-full mx-auto" />)}
                </div>
            </div>
        </div>
    </div>
);

// Software icon mapper based on platform field
const getSoftwareIcon = (platform) => {
    const icons = {
        'Photoshop': SiAdobephotoshop,
        'Illustrator': SiAdobeillustrator,
        'After Effects': SiAdobeaftereffects,
        'Figma': SiFigma,
        'Sketch': SiSketch,
        'Canva': SiCanva,
    };
    return icons[platform] || SiAdobephotoshop;
};

const DesignTemplateDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { language } = useLanguage();
    const { isDark } = useTheme();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [user, setUser] = useState(null);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");
    const [isAdded, setIsAdded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // First try to fetch by slug
                let res = await fetch(`${API_URL}/design-templates/slug/${id}`);
                let data = await res.json();

                // If slug not found, try by ID (for backward compatibility)
                if (!data.success) {
                    res = await fetch(`${API_URL}/design-templates/${id}`);
                    data = await res.json();
                }

                if (data.success) {
                    setTemplate(data.data);
                    setActiveImage(data.data.images?.[0] || "");
                    setLikeCount(data.data.likeCount || 0);

                    // Check if current user has liked this template
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    if (currentUser._id && data.data.likedBy?.length > 0) {
                        const hasLiked = data.data.likedBy.some(likedUserId =>
                            likedUserId === currentUser._id || likedUserId._id === currentUser._id
                        );
                        setIsLiked(hasLiked);
                    } else {
                        setIsLiked(false);
                    }
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }

        };

        if (id) fetchDetails();
    }, [id]);

    const handleAddToCart = () => {
        if (!template) return;
        dispatch(addToCart({
            id: template._id,
            title: template.title,
            price: template.offerPrice || template.price,
            image: activeImage,
            type: "design-template"
        }));
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleDownload = async () => {
        if (!user) {
            toast.error(language === 'bn' ? 'ডাউনলোড করতে আগে লগইন করুন' : 'Please login to download');
            return;
        }

        if (template?.downloadFile || template?._id) {
            try {
                toast.loading(language === 'bn' ? 'ডাউনলোড শুরু হচ্ছে...' : 'Starting download...', { id: 'download-toast' });

                // Use our backend API to download (handles Cloudinary auth)
                const token = localStorage.getItem('token');
                const downloadApiUrl = `${API_URL}/design-templates/${template._id}/download`;

                const response = await fetch(downloadApiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    const filename = `${template.title.replace(/[^a-z0-9]/gi, '_')}.zip`;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    toast.success(language === 'bn' ? 'ডাউনলোড শুরু হয়েছে' : 'Download started', { id: 'download-toast' });
                    return;
                } else {
                    const errorStatus = response.status;
                    if (errorStatus === 401 && !response.url.includes('cloudinary')) {
                        toast.error(language === 'bn' ? 'আপনার সেশন শেষ হয়ে গেছে, দয়া করে আবার লগইন করুন' : 'Session expired, please login again', { id: 'download-toast' });
                    } else if (errorStatus === 404 || response.url.includes('cloudinary')) {
                        toast.error(language === 'bn' ? 'ডাউনলোড ফাইলটি পাওয়া যায়নি বা এক্সেস সমস্যা' : 'Download file not found or access issue', { id: 'download-toast' });
                    } else {
                        toast.error(language === 'bn' ? 'ডাউনলোড করতে সমস্যা হয়েছে' : 'Download failed', { id: 'download-toast' });
                    }
                    return;
                }
            } catch (error) {
                console.error('Download error:', error);
                toast.error(language === 'bn' ? 'ডাউনলোড করতে সমস্যা হয়েছে' : 'Download failed', { id: 'download-toast' });
            }
        } else {
            toast.error('Download file not found');
        }
    };

    const handleBuyNow = () => {
        if (!template) return;
        if (template.accessType === 'free') {
            handleDownload();
            return;
        }
        dispatch(addToCart({
            id: template._id,
            title: template.title,
            price: template.offerPrice || template.price,
            image: activeImage,
            type: "design-template"
        }));
        window.location.href = '/checkout';
    };


    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to appreciate this design');
                return;
            }

            // Use template._id for API call (not the slug from URL)
            const templateId = template?._id;
            if (!templateId) {
                console.error('Template ID not found');
                return;
            }

            const res = await fetch(`${API_URL}/design-templates/${templateId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            console.log('Like response:', data);

            if (data.success) {
                setIsLiked(data.data.liked);
                setLikeCount(data.data.likeCount);
            } else {
                console.error('Like failed:', data.message);
            }
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    if (loading) return <DetailSkeleton />;

    if (!template) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
            <LuSearch size={48} className="text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Template Not Found</h2>
            <Link href="/design-template" className="mt-4 text-[#021E14] hover:underline text-sm font-medium">
                Back to Templates
            </Link>
        </div>
    );

    // Database fields mapping
    const hasDiscount = template.offerPrice && template.offerPrice > 0 && template.offerPrice < template.price;
    const currentPrice = hasDiscount ? template.offerPrice : template.price;
    const SoftwareIcon = getSoftwareIcon(template.platform);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className={`min-h-screen pt-2 ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>


            {/* Breadcrumb Header */}
            <div className={`border-b ${isDark ? 'bg-[#0f0f0f] border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="container mx-auto px-4 lg:px-8 py-4 max-w-7xl">

                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className={`hover:text-[#021E14] transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Home
                        </Link>
                        <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
                        <Link href="/design-template" className={`hover:text-[#021E14] transition-colors ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Design Template
                        </Link>
                        <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
                        <span className={`font-medium truncate max-w-[300px] ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {template.title}
                        </span>
                    </nav>
                </div>
            </div>


            {/* Main Layout */}
            <main className="container mx-auto px-4 lg:px-8 max-w-7xl py-8">

                <div className="flex gap-6 lg:gap-8">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Cover Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`w-full rounded-2xl overflow-hidden border shadow-lg ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}
                        >
                            <div className="relative aspect-video w-full">
                                {activeImage ? (
                                    <Image
                                        src={activeImage}
                                        alt={template.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Thumbnail Gallery */}
                        {template.images?.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide">
                                {template.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`relative w-20 h-14 md:w-28 md:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img
                                            ? "border-[#021E14] ring-2 ring-[#021E14]/30"
                                            : isDark ? "border-white/10 opacity-60 hover:opacity-100" : "border-gray-200 opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <Image src={img} fill className="object-cover" alt={`View ${idx + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Title & Stats */}
                        <div className="py-6">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {template.category?.name && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-[#021E14]/10 text-[#021E14] border border-[#021E14]/20' : 'bg-[#021E14]/10 text-[#021E14] border border-[#021E14]/20'}`}>
                                        {template.category.name}
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                    {template.templateType}
                                </span>
                                {template.accessType === 'free' && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">FREE</span>
                                )}
                            </div>

                            <h1 className={`text-2xl md:text-3xl font-bold leading-tight mb-4 ${bengaliClass} ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {template.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5">
                                    <LuEye size={16} /> {template.viewCount || 0} views
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <LuHeart size={16} className={isLiked ? "text-[#021E14] fill-red-500" : ""} /> {likeCount} likes
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <LuStar size={16} className="text-[#D4AF37]" /> {template.rating || 0} ({template.reviewCount || 0} reviews)
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <LuDownload size={16} /> {template.salesCount || 0} sales
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={`py-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                            <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Description</h2>
                            <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                                <div
                                    className={`rich-content ${bengaliClass}`}
                                    dangerouslySetInnerHTML={{ __html: template.longDescription || template.description || "<p>No description provided.</p>" }}
                                />
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                            {/* Features Card */}
                            <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <LuLayers className="text-[#021E14]" size={16} /> Features
                                </h3>
                                <ul className="space-y-2">
                                    {(template.features?.length > 0 ? template.features : ["Fully Editable", "High Resolution", "Well Organized"]).map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                            <LuCheck className="text-green-500 shrink-0" size={14} /> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Files Included Card */}
                            <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <LuFileCode className="text-[#D4AF37]" size={16} /> Files Included
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(template.filesIncluded?.length > 0 ? template.filesIncluded : [template.platform || "PSD"]).map((file, i) => (
                                        <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                            {file}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Compatibility Card */}
                            {template.compatibility?.length > 0 && (
                                <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                    <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        <LuRefreshCw className="text-[#021E14]" size={16} /> Compatibility
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {template.compatibility.map((item, i) => (
                                            <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Meta Info Card */}
                            <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <LuCalendar className="text-cyan-500" size={16} /> Info
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Version</span>
                                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{template.version || "1.0.0"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Published</span>
                                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(template.publishDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Last Update</span>
                                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(template.lastUpdate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">License</span>
                                        <span className={`capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{template.licenseType || "Regular"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="hidden lg:flex flex-col items-center gap-5 pt-2 w-20 shrink-0 sticky top-20 self-start">
                        {/* Message - WhatsApp */}
                        <button
                            onClick={() => window.open('https://wa.me/8801714117701?text=Hi, I am interested in: ' + encodeURIComponent(template.title), '_blank')}
                            className="group flex flex-col items-center gap-1.5"
                        >
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                <FiMessageSquare size={16} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 group-hover:text-green-500 transition-colors uppercase tracking-wider">Message</span>
                        </button>

                        {/* Save/Like */}
                        <button
                            onClick={handleLike}
                            className="group flex flex-col items-center gap-1.5"
                        >
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${isLiked
                                ? 'bg-[#021E14] text-white border-[#021E14]'
                                : isDark ? 'bg-white/5 text-gray-400 border-white/10 group-hover:bg-[#021E14] group-hover:text-white group-hover:border-[#021E14]' : 'bg-gray-100 text-gray-500 border-gray-200 group-hover:bg-[#021E14] group-hover:text-white group-hover:border-[#021E14]'}`}>
                                <LuHeart size={16} className={isLiked ? 'fill-white' : ''} />
                            </div>
                            <span className={`text-[8px] font-bold transition-colors uppercase tracking-wider ${isLiked ? 'text-[#021E14]' : 'text-gray-400 group-hover:text-[#021E14]'}`}>Save</span>
                        </button>

                        {/* Share - Copy Link */}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="group flex flex-col items-center gap-1.5"
                        >
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all group-hover:bg-[#021E14] group-hover:text-white group-hover:border-[#021E14] ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                <FiShare2 size={16} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 group-hover:text-[#021E14] transition-colors uppercase tracking-wider">Share</span>
                        </button>

                        <div className={`w-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />


                        {template.accessType !== 'free' && (
                            <button
                                onClick={handleAddToCart}
                                className="group flex flex-col items-center gap-1.5"
                            >
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${isAdded
                                    ? 'bg-green-500 text-white border-green-500'
                                    : isDark ? 'bg-white/5 text-gray-400 border-white/10 group-hover:bg-[#D4AF37] group-hover:text-white group-hover:border-[#D4AF37]' : 'bg-gray-100 text-gray-500 border-gray-200 group-hover:bg-[#D4AF37] group-hover:text-white group-hover:border-[#D4AF37]'}`}>
                                    {isAdded ? <LuCheck size={16} /> : <LuShoppingCart size={16} />}
                                </div>
                                <span className={`text-[8px] font-bold transition-colors uppercase tracking-wider ${isAdded ? 'text-green-500' : 'text-gray-400 group-hover:text-[#D4AF37]'}`}>{isAdded ? 'Added' : 'Cart'}</span>
                            </button>
                        )}

                        <div className={`mt-4 p-3 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                            <div className="text-center">
                                {template.accessType === 'free' ? (
                                    <div className="text-lg font-bold text-green-500">Free</div>
                                ) : (
                                    <>
                                        <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            ৳{currentPrice?.toLocaleString()}
                                        </div>
                                        {hasDiscount && (
                                            <div className="text-xs text-gray-400 line-through">
                                                ৳{template.price?.toLocaleString()}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleBuyNow}
                            className={`mt-1 w-full py-3 rounded-md text-sm font-bold transition-all ${template.accessType === 'free'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : isAdded ? 'bg-green-500 text-white' : 'bg-[#021E14] hover:bg-[#400000] text-white'
                                }`}
                        >
                            {template.accessType === 'free' ? "Free Download" : isAdded ? "Added!" : "Buy Now"}
                        </button>

                    </aside>

                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <div className={`lg:hidden fixed bottom-0 left-0 w-full z-50 backdrop-blur-xl border-t p-3 flex items-center gap-3 ${isDark ? 'bg-[#0f0f0f]/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                <button
                    onClick={handleLike}
                    className={`p-3 rounded-xl border transition-all ${isLiked ? "bg-[#021E14] border-[#021E14] text-white" : isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500"}`}
                >
                    <FiThumbsUp size={18} />
                </button>
                <div className="flex-1 text-center">
                    {template.accessType === 'free' ? (
                        <span className="text-lg font-bold text-green-500">Free</span>
                    ) : (
                        <>
                            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>৳{currentPrice?.toLocaleString()}</span>
                            {hasDiscount && <span className="text-xs text-gray-400 line-through ml-2">৳{template.price?.toLocaleString()}</span>}
                        </>
                    )}
                </div>
                <button
                    onClick={template.accessType === 'free' ? handleDownload : handleAddToCart}
                    className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 ${template.accessType === 'free' ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-[#021E14] text-white shadow-[#021E14]/20'}`}
                >
                    <LuDownload size={16} />
                    {template.accessType === 'free' ? "Free Download" : isAdded ? "Added!" : "Get Now"}
                </button>
            </div>

            {/* Rich Content Styles - Supports both light and dark */}
            <style jsx global>{`
                .rich-content {
                    white-space: normal !important;
                    word-break: normal !important;
                    overflow-wrap: break-word !important;
                    text-align: left !important;
                    max-width: 100%;
                }
                .rich-content * {
                    white-space: normal !important;
                    word-break: normal !important;
                    overflow-wrap: break-word !important;
                }
                .rich-content h2 { 
                    font-size: 1.5rem; 
                    font-weight: 700; 
                    margin-top: 2rem; 
                    margin-bottom: 1rem; 
                    border-left: 4px solid #2563eb; 
                    padding-left: 1rem; 
                }
                .rich-content h3 { 
                    font-size: 1.25rem; 
                    font-weight: 600; 
                    margin-top: 1.5rem; 
                    margin-bottom: 0.75rem; 
                }
                .rich-content p { 
                    line-height: 1.8; 
                    margin-bottom: 1.25rem; 
                }
                .rich-content ul { 
                    list-style: disc; 
                    padding-left: 1.5rem; 
                    margin-bottom: 1.25rem; 
                }
                .rich-content li { 
                    margin-bottom: 0.5rem; 
                }
                .rich-content img { 
                    border-radius: 0.75rem; 
                    margin: 1.5rem 0; 
                    max-width: 100%;
                    height: auto;
                }
                .rich-content a { 
                    color: #2563eb; 
                    text-decoration: underline; 
                }
                .rich-content b, .rich-content strong {
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default DesignTemplateDetails;

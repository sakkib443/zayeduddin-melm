"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDesignTemplates, fetchDesignCategories } from "@/redux/designTemplateSlice";
import ProductCard from "@/components/sheard/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";
import { addToCart } from "@/redux/cartSlice";
import { API_URL } from "@/config/api";
import toast from "react-hot-toast";
import {
    LuSparkles,
    LuX,
    LuHeart,
    LuShoppingCart,
    LuCheck,
    LuDownload,
    LuStar,
    LuLayers,
    LuEye,
    LuCalendar
} from "react-icons/lu";
import { FiMessageSquare, FiShare2, FiChevronLeft, FiThumbsUp } from "react-icons/fi";
import {
    SiAdobephotoshop,
    SiAdobeillustrator,
    SiAdobeaftereffects,
    SiFigma,
    SiSketch,
    SiCanva
} from "react-icons/si";
import { useRouter } from "next/navigation";

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

const DigitalAssets = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { items: templates = [], categories = [], loading } = useSelector((state) => state.designTemplates);
    const { language, t } = useLanguage();
    const { isDark } = useTheme();
    const [activeCategory, setActiveCategory] = useState("all");

    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    // Modal states
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeImage, setActiveImage] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        dispatch(fetchDesignCategories());
        dispatch(fetchDesignTemplates({ limit: 6 }));
    }, [dispatch]);

    // Lock/unlock scroll when modal opens/closes
    useEffect(() => {
        if (isModalOpen) {
            // Just hide overflow on html and body
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }

        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        dispatch(fetchDesignTemplates({ category: categoryId, limit: 6 }));
    };

    // Open modal with template data
    const openModalWithTemplate = (template) => {
        setSelectedTemplate(template);
        setActiveImage(template.images?.[0] || "");
        setLikeCount(template.likeCount || 0);

        // Check if user liked
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser._id && template.likedBy?.length > 0) {
            const hasLiked = template.likedBy.some(id => id === currentUser._id || id._id === currentUser._id);
            setIsLiked(hasLiked);
        } else {
            setIsLiked(false);
        }

        setIsModalOpen(true);
    };

    // Open modal
    const openModal = (template) => {
        openModalWithTemplate(template);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
        setIsAdded(false);
    };

    // Handle add to cart
    const handleAddToCart = () => {
        if (!selectedTemplate) return;
        dispatch(addToCart({
            id: selectedTemplate._id,
            title: selectedTemplate.title,
            price: selectedTemplate.offerPrice || selectedTemplate.price,
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

        if (selectedTemplate?.downloadFile || selectedTemplate?._id) {
            try {
                toast.loading(language === 'bn' ? 'ডাউনলোড শুরু হচ্ছে...' : 'Starting download...', { id: 'download-toast' });

                // Use our backend API to download (handles Cloudinary auth)
                const token = localStorage.getItem('token');

                if (!token) {
                    toast.error(language === 'bn' ? 'সেশন শেষ হয়ে গেছে, আবার লগইন করুন' : 'Session expired, please login again', { id: 'download-toast' });
                    return;
                }

                console.log(`[Frontend] Downloading with token: ${token.substring(0, 10)}...`);
                const downloadApiUrl = `${API_URL}/design-templates/${selectedTemplate._id}/download`;

                const response = await fetch(downloadApiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.redirectUrl) {
                        console.log('[Frontend] Secure download link ready, opening...');
                        // Use a hidden anchor tag to trigger download and control filename if possible
                        const a = document.createElement('a');
                        a.href = data.redirectUrl;
                        a.target = '_blank';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        toast.success(language === 'bn' ? 'ডাউনলোড শুরু হয়েছে' : 'Download started', { id: 'download-toast' });
                    } else {
                        toast.error(language === 'bn' ? 'ডাউনলোড লিংক পাওয়া যায়নি' : 'Download link not found', { id: 'download-toast' });
                    }
                } else {
                    const errorStatus = response.status;
                    if (errorStatus === 401) {
                        toast.error(language === 'bn' ? 'আপনার সেশন শেষ হয়ে গেছে, আবার লগইন করুন' : 'Session expired, please login again', { id: 'download-toast' });
                    } else {
                        toast.error(language === 'bn' ? 'ডাউনলোড করতে সমস্যা হয়েছে' : 'Download failed', { id: 'download-toast' });
                    }
                }
            } catch (error) {
                console.error('Download error:', error);
                toast.error(language === 'bn' ? 'ডাউনলোড করতে সমস্যা হয়েছে' : 'Download failed', { id: 'download-toast' });
            }
        } else {
            toast.error('Download file not found');
        }
    };

    // Handle buy now
    const handleBuyNow = () => {
        if (!selectedTemplate) return;
        if (selectedTemplate.accessType === 'free') {
            handleDownload();
            return;
        }
        dispatch(addToCart({
            id: selectedTemplate._id,
            title: selectedTemplate.title,
            price: selectedTemplate.offerPrice || selectedTemplate.price,
            image: activeImage,
            type: "design-template"
        }));
        closeModal();
        router.push('/checkout');
    };

    // Handle like
    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to save this design');
                return;
            }

            const res = await fetch(`${API_URL}/design-templates/${selectedTemplate._id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            if (data.success) {
                setIsLiked(data.data.liked);
                setLikeCount(data.data.likeCount);
            }
        } catch (error) {
            console.error('Like error:', error);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Pricing
    const hasDiscount = selectedTemplate?.offerPrice && selectedTemplate.offerPrice > 0 && selectedTemplate.offerPrice < selectedTemplate.price;
    const currentPrice = hasDiscount ? selectedTemplate?.offerPrice : selectedTemplate?.price;

    return (
        <section className="py-16 bg-[#fafafa] dark:bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-4 lg:px-16">
                {/* Section Header */}
                <div className="text-center mb-10 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#300000]/5 border border-[#300000]/10 mb-6"
                    >
                        <LuSparkles className="text-[#300000]" size={16} />
                        <span className="text-[10px] font-bold text-[#300000] uppercase tracking-[0.2em]">
                            {t("digitalAssets.title")}
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`text-3xl md:text-4xl lg:text-5xl font-bold text-[#300000] mb-4 ${bengaliClass}`}
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        {t("digitalAssets.title")}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className={`text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed ${bengaliClass}`}
                    >
                        {t("digitalAssets.subtitle")}
                    </motion.p>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <button
                        onClick={() => handleCategoryChange("all")}
                        className={`px-8 py-3.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${activeCategory === "all"
                            ? "bg-[#300000] text-white shadow-lg shadow-[#300000]/20"
                            : "bg-white dark:bg-white/5 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10"
                            }`}
                    >
                        {t("digitalAssets.all")}
                    </button>

                    {categories
                        .filter(cat => cat.type === 'design-template')
                        .map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => handleCategoryChange(cat._id)}
                                className={`px-8 py-3.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm ${activeCategory === cat._id
                                    ? "bg-[#300000] text-white shadow-lg shadow-[#300000]/20"
                                    : "bg-white dark:bg-white/5 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/10"
                                    }`}
                            >
                                {language === 'bn' ? cat.nameBn : cat.name}
                            </button>
                        ))}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            // Skeletons
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white dark:bg-white/5 rounded-md h-[400px]"></div>
                            ))
                        ) : (
                            templates.map((template) => (
                                <motion.div
                                    key={template._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => openModal(template)}
                                    className="cursor-pointer"
                                >
                                    <ProductCard product={template} type="design-template" disableLink={true} />
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* No Templates Message */}
                {!loading && templates.length === 0 && (
                    <div className="text-center py-20">
                        <p className={`text-slate-400 ${bengaliClass}`}>{t("digitalAssets.noAssets")}</p>
                    </div>
                )}
            </div>

            {/* ==================== BEHANCE STYLE MODAL - SAME AS DESIGN TEMPLATE PAGE ==================== */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isModalOpen && selectedTemplate && (
                        <motion.div
                            className="fixed inset-0 z-[9999] overflow-y-auto overscroll-contain"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ touchAction: 'pan-y' }}
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                        >
                            {/* Dark Blur Overlay */}
                            <div
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={closeModal}
                            />

                            {/* Modal Container */}
                            <div className="relative min-h-screen flex justify-center items-start gap-4 py-4 px-4">
                                <motion.div
                                    className={`relative w-full max-w-7xl rounded-md overflow-hidden shadow-2xl ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 100 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Breadcrumb Header - Sticky */}
                                    <div className={`sticky top-0 z-50 border-b backdrop-blur-xl ${isDark ? 'bg-[#0f0f0f]/95 border-white/5' : 'bg-white/95 border-gray-200'}`}>
                                        <div className="px-4 lg:px-8 py-4">
                                            <div className="flex items-center justify-between">
                                                <nav className="flex items-center gap-2 text-sm overflow-hidden">
                                                    <button onClick={closeModal} className={`hover:text-blue-600 transition-colors shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        <FiChevronLeft size={20} className="inline mr-1" />
                                                        Back
                                                    </button>
                                                    <span className={`shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>/</span>
                                                    <span className={`font-medium truncate max-w-[100px] md:max-w-[300px] ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {selectedTemplate.title}
                                                    </span>
                                                </nav>
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    {/* Contact us Button */}
                                                    <button
                                                        onClick={() => window.open('https://wa.me/8801714117701?text=Hi, I am interested in: ' + encodeURIComponent(selectedTemplate.title), '_blank')}
                                                        className={`hidden md:flex items-center gap-3 px-5 py-2.5 border rounded-lg transition-all ${isDark ? 'border-white/10 hover:bg-white/5 text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-900 font-medium'}`}
                                                    >
                                                        <FiMessageSquare className="text-green-500" size={18} />
                                                        <span className="text-sm">Contact us</span>
                                                    </button>

                                                    <div className="flex items-center gap-1.5 md:gap-2.5">
                                                        {selectedTemplate.accessType !== 'free' && (
                                                            <button
                                                                onClick={handleAddToCart}
                                                                className={`p-2.5 border rounded-lg transition-all ${isAdded ? 'text-green-500 border-green-500/30 bg-green-500/5' : isDark ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                                            >
                                                                {isAdded ? <LuCheck size={18} /> : <LuShoppingCart size={18} />}
                                                            </button>
                                                        )}

                                                        {/* Like Button */}
                                                        <button
                                                            onClick={handleLike}
                                                            className={`p-2.5 border rounded-lg transition-all ${isLiked ? 'text-red-500 border-red-500/30 bg-red-500/5' : isDark ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                                        >
                                                            <LuHeart size={18} className={isLiked ? 'fill-current' : ''} />
                                                        </button>
                                                    </div>

                                                    {/* Download Button Group */}
                                                    <div className="flex items-stretch rounded-lg overflow-hidden border-0">
                                                        <button
                                                            onClick={handleBuyNow}
                                                            className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm transition-all shadow-none ${selectedTemplate.accessType === 'free' ? 'bg-[#00C853] hover:bg-[#00B24A] text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                                        >
                                                            {selectedTemplate.accessType === 'free' ? 'Free download' : 'Buy Template'}
                                                        </button>
                                                    </div>

                                                    {/* Close Button */}
                                                    <button
                                                        onClick={closeModal}
                                                        className={`ml-1 md:ml-2 p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                                                    >
                                                        <LuX size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Content Layout */}
                                    <div className="px-4 lg:px-8 py-8">
                                        <div className="flex gap-6 lg:gap-8">
                                            {/* Main Content Column */}
                                            <div className="flex-1 min-w-0">
                                                {/* Cover Image */}
                                                <div className={`w-full rounded-md overflow-hidden border shadow-lg ${isDark ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                                                    <div className="relative aspect-video w-full">
                                                        {activeImage ? (
                                                            <img
                                                                src={activeImage}
                                                                alt={selectedTemplate.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                                <span className="text-gray-400">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Thumbnail Gallery */}
                                                {selectedTemplate.images?.length > 1 && (
                                                    <div className="flex gap-3 overflow-x-auto py-4 scrollbar-hide">
                                                        {selectedTemplate.images.map((img, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setActiveImage(img)}
                                                                className={`relative w-20 h-14 md:w-28 md:h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === img
                                                                    ? "border-blue-500 ring-2 ring-blue-500/30"
                                                                    : isDark ? "border-white/10 opacity-60 hover:opacity-100" : "border-gray-200 opacity-60 hover:opacity-100"
                                                                    }`}
                                                            >
                                                                <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Title & Stats */}
                                                <div className="py-6">
                                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                                        {selectedTemplate.category?.name && (
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                                                                {selectedTemplate.category.name}
                                                            </span>
                                                        )}
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                                            {selectedTemplate.templateType}
                                                        </span>
                                                        {selectedTemplate.accessType === 'free' && (
                                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white">FREE</span>
                                                        )}
                                                    </div>

                                                    <h1 className={`text-2xl md:text-3xl font-bold leading-tight mb-4 ${bengaliClass} ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        {selectedTemplate.title}
                                                    </h1>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <LuEye size={16} /> {selectedTemplate.viewCount || 0} views
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <LuHeart size={16} className={isLiked ? "text-red-500 fill-red-500" : ""} /> {likeCount} likes
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <LuStar size={16} className="text-amber-500" /> {selectedTemplate.rating || 0} ({selectedTemplate.reviewCount || 0} reviews)
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <LuDownload size={16} /> {selectedTemplate.salesCount || 0} sales
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className={`py-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                                    <h2 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Description</h2>
                                                    <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                                                        <div
                                                            className={`rich-content ${bengaliClass}`}
                                                            dangerouslySetInnerHTML={{ __html: selectedTemplate.longDescription || selectedTemplate.description || "<p>No description provided.</p>" }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Details Grid */}
                                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                                    {/* Design Tools Card */}
                                                    <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                                        <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            <LuLayers className="text-blue-600" size={16} /> Design Tools
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(selectedTemplate.designTools?.length > 0 ? selectedTemplate.designTools : [selectedTemplate.platform || "Other"]).map((tool, i) => (
                                                                <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                                    {tool}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Meta Info Card */}
                                                    <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                                        <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            <LuCalendar className="text-cyan-500" size={16} /> Info
                                                        </h3>
                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Published</span>
                                                                <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(selectedTemplate.publishDate)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Last Update</span>
                                                                <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(selectedTemplate.lastUpdate)}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">License</span>
                                                                <span className={`capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedTemplate.licenseType || "Regular"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Right Sidebar - Outside the Box */}
                                <aside className={`hidden xl:flex flex-col items-center gap-4 p-4 sticky top-4 h-fit rounded-md backdrop-blur-xl border ${isDark ? 'bg-[#0f0f0f]/90 border-white/10' : 'bg-white/90 border-gray-200 shadow-xl'}`}>
                                    {/* Close Button */}
                                    <button
                                        onClick={closeModal}
                                        className="group flex flex-col items-center gap-1.5"
                                    >
                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            <LuX size={16} />
                                        </div>
                                        <span className="text-[8px] font-bold text-gray-400 group-hover:text-red-500 transition-colors uppercase tracking-wider">Close</span>
                                    </button>

                                    <div className={`w-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

                                    {/* Message - WhatsApp */}
                                    <button
                                        onClick={() => window.open('https://wa.me/8801714117701?text=Hi, I am interested in: ' + encodeURIComponent(selectedTemplate.title), '_blank')}
                                        className="group flex flex-col items-center gap-1.5"
                                    >
                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            <FiMessageSquare size={16} />
                                        </div>
                                        <span className="text-[8px] font-bold text-gray-400 group-hover:text-green-500 transition-colors uppercase tracking-wider">Message</span>
                                    </button>

                                    {/* Save/Like */}
                                    <button
                                        onClick={handleLike}
                                        className="group flex flex-col items-center gap-1.5"
                                    >
                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all ${isLiked
                                            ? 'bg-red-500 text-white border-red-500'
                                            : isDark ? 'bg-white/5 text-gray-400 border-white/10 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500' : 'bg-gray-100 text-gray-500 border-gray-200 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500'}`}>
                                            <LuHeart size={16} className={isLiked ? 'fill-white' : ''} />
                                        </div>
                                        <span className={`text-[8px] font-bold transition-colors uppercase tracking-wider ${isLiked ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}>Save</span>
                                    </button>

                                    {/* Share - Copy Link */}
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.origin + `/design-template/${selectedTemplate.slug || selectedTemplate._id}`);
                                            alert('Link copied to clipboard!');
                                        }}
                                        className="group flex flex-col items-center gap-1.5"
                                    >
                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            <FiShare2 size={16} />
                                        </div>
                                        <span className="text-[8px] font-bold text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-wider">Share</span>
                                    </button>

                                    {selectedTemplate.accessType !== 'free' && (
                                        <button
                                            onClick={handleAddToCart}
                                            className="group flex flex-col items-center gap-1.5"
                                        >
                                            <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all ${isAdded
                                                ? 'bg-green-500 text-white border-green-500'
                                                : isDark ? 'bg-white/5 text-gray-400 border-white/10 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500' : 'bg-gray-100 text-gray-500 border-gray-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'}`}>
                                                {isAdded ? <LuCheck size={16} /> : <LuShoppingCart size={16} />}
                                            </div>
                                            <span className={`text-[8px] font-bold transition-colors uppercase tracking-wider ${isAdded ? 'text-green-500' : 'text-gray-400 group-hover:text-amber-500'}`}>{isAdded ? 'Added' : 'Cart'}</span>
                                        </button>
                                    )}

                                    <div className={`w-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

                                    <div className={`p-2 rounded-md border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                        <div className="text-center">
                                            {selectedTemplate.accessType === 'free' ? (
                                                <div className="text-base font-bold text-green-500">Free</div>
                                            ) : (
                                                <>
                                                    <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        ৳{currentPrice?.toLocaleString()}
                                                    </div>
                                                    {hasDiscount && (
                                                        <div className="text-[10px] text-gray-400 line-through">
                                                            ৳{selectedTemplate.price?.toLocaleString()}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBuyNow}
                                        className={`w-full py-2.5 px-3 rounded-md text-xs font-bold transition-all ${selectedTemplate.accessType === 'free'
                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                            : isAdded ? 'bg-green-500 text-white' : 'bg-[#300000] hover:bg-[#400000] text-white'
                                            }`}
                                    >
                                        {selectedTemplate.accessType === 'free' ? "Free Download" : isAdded ? "Added!" : "Buy Now"}
                                    </button>
                                </aside>

                                {/* Mobile Bottom Bar */}
                                <div className={`lg:hidden fixed bottom-0 left-0 w-full z-50 backdrop-blur-xl border-t p-3 flex items-center gap-3 ${isDark ? 'bg-[#0f0f0f]/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                                    <button
                                        onClick={handleLike}
                                        className={`p-3 rounded-md border transition-all ${isLiked ? "bg-blue-600 border-blue-600 text-white" : isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500"}`}
                                    >
                                        <FiThumbsUp size={18} />
                                    </button>
                                    <div className="flex-1 text-center">
                                        {selectedTemplate.accessType === 'free' ? (
                                            <span className="text-lg font-bold text-green-500">Free</span>
                                        ) : (
                                            <>
                                                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>৳{currentPrice?.toLocaleString()}</span>
                                                {hasDiscount && <span className="text-xs text-gray-400 line-through ml-2">৳{selectedTemplate.price?.toLocaleString()}</span>}
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleBuyNow}
                                        className={`px-6 py-3 rounded-md font-bold text-sm shadow-lg flex items-center gap-2 ${selectedTemplate.accessType === 'free' ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-blue-600 text-white shadow-blue-600/20'}`}
                                    >
                                        <LuDownload size={16} />
                                        {selectedTemplate.accessType === 'free' ? 'Free Download' : 'Buy Now'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Rich Content Styles */}
            <style jsx global>{`
                .font-script {
                    font-family: var(--font-poppins);
                }
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
                    border-radius: 0.375rem; 
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
        </section>
    );
};

export default DigitalAssets;

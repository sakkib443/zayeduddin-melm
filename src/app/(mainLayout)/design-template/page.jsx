"use client";
import { API_URL } from '@/config/api';
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuPalette,
    LuSearch,
    LuGrid3X3,
    LuChevronDown,
    LuX,
    LuHeart,
    LuShoppingCart,
    LuCheck,
    LuDownload,
    LuShare2,
    LuExternalLink,
    LuStar,
    LuLayers,
    LuFileCode,
    LuEye,
    LuCalendar,
    LuRefreshCw,
    LuBookmark,
} from "react-icons/lu";
import { FiMessageSquare, FiShare2, FiChevronLeft, FiThumbsUp } from "react-icons/fi";
import ProductCard from "@/components/sheard/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import {
    SiAdobephotoshop,
    SiAdobeillustrator,
    SiAdobeaftereffects,
    SiFigma,
    SiSketch,
    SiCanva
} from "react-icons/si";

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

const DesignTemplateContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);

    // Modal states
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeImage, setActiveImage] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isAdded, setIsAdded] = useState(false);

    // Fetch design templates from API
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/design-templates?limit=50`);
                const data = await res.json();
                if (data.success) {
                    setTemplates(data.data || []);
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCats = async () => {
            try {
                const res = await fetch(`${API_URL}/categories?type=design-template`);
                const data = await res.json();
                if (data.success && data.data) {
                    setCategories(data.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchTemplates();
        fetchCats();
    }, []);

    // Check URL for modal on load
    useEffect(() => {
        const modalId = searchParams.get('view');
        if (modalId && templates.length > 0) {
            const template = templates.find(t => t.slug === modalId || t._id === modalId);
            if (template) {
                openModalWithTemplate(template);
            }
        }
    }, [searchParams, templates]);

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = (template.title || template.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" ||
            template.category?._id === selectedCategory ||
            template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryCount = (categoryId) => {
        if (categoryId === 'all') return templates.length;
        return templates.filter(t => (t.category?._id || t.category) === categoryId).length;
    };

    // Open modal with template data
    const openModalWithTemplate = (template) => {
        setSelectedTemplate(template);
        setActiveImage(template.images?.[0] || "");
        setLikeCount(template.likeCount || 0);

        // Check if user liked
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user._id && template.likedBy?.length > 0) {
            const hasLiked = template.likedBy.some(id => id === user._id || id._id === user._id);
            setIsLiked(hasLiked);
        } else {
            setIsLiked(false);
        }

        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    // Open modal and update URL
    const openModal = (template) => {
        const newUrl = `/design-template?view=${template.slug || template._id}`;
        window.history.pushState({}, '', newUrl);
        openModalWithTemplate(template);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
        setIsAdded(false);
        document.body.style.overflow = 'auto';
        window.history.pushState({}, '', '/design-template');
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

    // Handle buy now
    const handleBuyNow = () => {
        if (!selectedTemplate) return;
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
    const SoftwareIcon = selectedTemplate ? getSoftwareIcon(selectedTemplate.platform) : SiAdobephotoshop;

    return (
        <div className="min-h-screen bg-white dark:bg-[#020202]">
            {/* Header Section */}
            <header className="pt-24 pb-6 bg-white dark:bg-[#020202]">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className={`text-4xl md:text-7xl font-script italic text-[#300000] mb-4 ${bengaliClass}`}>
                            {language === 'bn' ? 'গ্রাফিক টেম্পলেট' : 'Graphic Templates'}
                        </h1>
                        <p className={`text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed mb-10 ${bengaliClass}`}>
                            {language === 'bn'
                                ? 'আপনার সৃজনশীল প্রজেক্টের জন্য প্রিমিয়াম গ্রাফিক্স এবং UI/UX টেমপ্লেট।'
                                : 'Premium graphics and UI/UX templates for your creative projects.'}
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-16 px-4">
                            <div className="relative group">
                                <LuSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#300000] transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === 'bn' ? 'ডিজাইন খুঁজুন...' : 'Search design...'}
                                    className="w-full pl-16 pr-8 py-5 md:py-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-full shadow-lg shadow-black/5 outline-none focus:ring-4 focus:ring-[#300000]/5 transition-all text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-50 dark:border-white/5 pb-8 lg:px-16">
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => setSelectedCategory("all")}
                                    className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedCategory === "all"
                                        ? "bg-[#300000] text-white shadow-lg shadow-[#300000]/20"
                                        : "bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    <LuGrid3X3 size={14} />
                                    <span>{language === 'bn' ? 'সব' : 'All'}</span>
                                    <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] ${selectedCategory === "all" ? "bg-white/20" : "bg-slate-200 dark:bg-white/10"}`}>{templates.length}</span>
                                </button>

                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setSelectedCategory(cat._id)}
                                        className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${selectedCategory === cat._id
                                            ? "bg-[#300000] text-white shadow-lg shadow-[#300000]/20"
                                            : "bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-slate-100"
                                            }`}
                                    >
                                        <LuPalette size={14} />
                                        <span>{cat.name}</span>
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] ${selectedCategory === cat._id ? "bg-white/20" : "bg-slate-200 dark:bg-white/10"}`}>{getCategoryCount(cat._id)}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="relative group">
                                <button className="flex items-center gap-3 px-6 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-100 transition-all">
                                    <span>Most Popular</span>
                                    <LuChevronDown size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Content Section */}
            <main className="pb-24 pt-4">
                <div className="container mx-auto px-4 lg:px-16">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="animate-pulse bg-slate-50 dark:bg-white/5 rounded-3xl h-[400px]"></div>
                            ))}
                        </div>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="text-center py-24">
                            <LuPalette className="mx-auto text-slate-200 mb-6" size={64} />
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No templates found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTemplates.map((template) => (
                                <div
                                    key={template._id}
                                    onClick={() => openModal(template)}
                                    className="cursor-pointer"
                                >
                                    <ProductCard
                                        product={template}
                                        type="design-template"
                                        disableLink={true}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ==================== BEHANCE STYLE MODAL - EXACT SAME AS DETAILS PAGE ==================== */}
            <AnimatePresence>
                {isModalOpen && selectedTemplate && (
                    <motion.div
                        className="fixed inset-0 z-[100] overflow-y-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Dark Blur Overlay */}
                        <div
                            className="fixed inset-0 bg-black/90 backdrop-blur-sm"
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
                                                    {/* Bookmark Button */}
                                                    <button className={`p-2.5 border rounded-lg transition-all ${isDark ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                                                        <LuBookmark size={18} />
                                                    </button>

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
                                                        className="flex items-center gap-2 px-6 py-2.5 bg-[#00C853] hover:bg-[#00B24A] text-white font-bold text-sm transition-all shadow-none"
                                                    >
                                                        {selectedTemplate.accessType === 'free' ? 'Free download' : 'Buy Template'}
                                                    </button>
                                                    <div className="w-[1px] bg-white/20" />
                                                    <button className="px-3 bg-[#00C853] hover:bg-[#00B24A] text-white transition-all shadow-none">
                                                        <LuChevronDown size={18} />
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
                                                {/* Features Card */}
                                                <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                                    <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        <LuLayers className="text-blue-600" size={16} /> Features
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {(selectedTemplate.features?.length > 0 ? selectedTemplate.features : ["Fully Editable", "High Resolution", "Well Organized"]).map((f, i) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                                                <LuCheck className="text-green-500 shrink-0" size={14} /> {f}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Files Included Card */}
                                                <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                                    <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        <LuFileCode className="text-amber-500" size={16} /> Files Included
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(selectedTemplate.filesIncluded?.length > 0 ? selectedTemplate.filesIncluded : [selectedTemplate.platform || "PSD"]).map((file, i) => (
                                                            <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                                {file}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Compatibility Card */}
                                                {selectedTemplate.compatibility?.length > 0 && (
                                                    <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                                        <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                            <LuRefreshCw className="text-purple-500" size={16} /> Compatibility
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedTemplate.compatibility.map((item, i) => (
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
                                                            <span className={isDark ? 'text-white' : 'text-gray-900'}>{selectedTemplate.version || "1.0.0"}</span>
                                                        </div>
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

                                {/* Cart Button */}
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

                                <div className={`w-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

                                {/* Price Card */}
                                <div className={`p-2 rounded-md border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="text-center">
                                        <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            ৳{currentPrice?.toLocaleString()}
                                        </div>
                                        {hasDiscount && (
                                            <div className="text-[10px] text-gray-400 line-through">
                                                ৳{selectedTemplate.price?.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Buy Now Button */}
                                <button
                                    onClick={handleBuyNow}
                                    className={`w-full py-2.5 px-3 rounded-md text-xs font-bold transition-all ${isAdded
                                        ? 'bg-green-500 text-white'
                                        : 'bg-[#300000] hover:bg-[#400000] text-white'
                                        }`}
                                >
                                    {isAdded ? "Added!" : "Buy Now"}
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
                                    <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>৳{currentPrice?.toLocaleString()}</span>
                                    {hasDiscount && <span className="text-xs text-gray-400 line-through ml-2">৳{selectedTemplate.price?.toLocaleString()}</span>}
                                </div>
                                <button
                                    onClick={handleBuyNow}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-md font-bold text-sm shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                >
                                    <LuDownload size={16} />
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rich Content Styles */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                .font-script {
                    font-family: 'Dancing Script', cursive;
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
                    width: 100%; 
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

const DesignTemplatePage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020202]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <LuPalette className="text-blue-600 mb-2" size={48} />
                    <p className="text-gray-500 font-medium tracking-wider text-sm uppercase">Loading Gallery...</p>
                </div>
            </div>
        }>
            <DesignTemplateContent />
        </Suspense>
    );
};

export default DesignTemplatePage;


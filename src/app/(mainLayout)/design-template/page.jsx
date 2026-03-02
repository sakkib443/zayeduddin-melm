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
    LuArrowUpDown,
} from "react-icons/lu";
import { FiMessageSquare, FiShare2, FiChevronLeft, FiThumbsUp } from "react-icons/fi";
import ProductCard from "@/components/sheard/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/providers/ThemeProvider";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import toast from "react-hot-toast";
import {
    SiAdobephotoshop,
    SiAdobeillustrator,
    SiAdobeaftereffects,
    SiFigma,
    SiSketch,
    SiCanva
} from "react-icons/si";

const DESIGN_TOOLS_OPTIONS = [
    'Figma',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe XD',
    'Sketch',
    'Canva',
    'Adobe InDesign',
    'After Effects',
    'Other'
];

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
    const { language, t } = useLanguage();
    const { isDark } = useTheme();
    const dispatch = useDispatch();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedTool, setSelectedTool] = useState("all");
    const [selectedPrice, setSelectedPrice] = useState("all");
    const [selectedRating, setSelectedRating] = useState("all");
    const [selectedSort, setSelectedSort] = useState("popular");
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState([]);

    // Modal states
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeImage, setActiveImage] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isAdded, setIsAdded] = useState(false);

    // Initial check for user in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

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
        const matchesTool = selectedTool === "all" ||
            (template.designTools && template.designTools.includes(selectedTool));

        // Price filter
        let matchesPrice = true;
        if (selectedPrice !== "all") {
            const price = template.discountPrice || template.price || 0;
            if (selectedPrice === "free") matchesPrice = template.accessType === 'free' || price === 0;
            else if (selectedPrice === "under500") matchesPrice = price > 0 && price < 500;
            else if (selectedPrice === "500to1000") matchesPrice = price >= 500 && price <= 1000;
            else if (selectedPrice === "1000to5000") matchesPrice = price >= 1000 && price <= 5000;
            else if (selectedPrice === "above5000") matchesPrice = price > 5000;
        }

        // Rating filter
        let matchesRating = true;
        if (selectedRating !== "all") {
            const rating = template.rating || 0;
            if (selectedRating === "4plus") matchesRating = rating >= 4;
            else if (selectedRating === "3plus") matchesRating = rating >= 3;
            else if (selectedRating === "2plus") matchesRating = rating >= 2;
        }

        return matchesSearch && matchesCategory && matchesTool && matchesPrice && matchesRating;
    }).sort((a, b) => {
        if (selectedSort === "popular") return (b.salesCount || 0) - (a.salesCount || 0);
        if (selectedSort === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (selectedSort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (selectedSort === "priceLow") return (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0);
        if (selectedSort === "priceHigh") return (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0);
        return 0;
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
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser._id && template.likedBy?.length > 0) {
            const hasLiked = template.likedBy.some(id => id === currentUser._id || id._id === currentUser._id);
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

    const handleDownload = async () => {
        if (!selectedTemplate) {
            toast.error('No template selected');
            return;
        }

        // For free templates - direct download without login
        if (selectedTemplate.accessType === 'free') {
            const fileUrl = selectedTemplate.downloadFile;
            if (!fileUrl) {
                toast.error(language === 'bn' ? '??????? ???? ?????? ??????' : 'Download file not available');
                return;
            }

            let downloadUrl = fileUrl;

            // Convert Google Drive share link to direct download link
            // Share link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
            // Direct link: https://drive.google.com/uc?export=download&id=FILE_ID
            if (fileUrl.includes('drive.google.com')) {
                const fileIdMatch = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (fileIdMatch && fileIdMatch[1]) {
                    downloadUrl = `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
                }
            }

            // Open download in new tab
            window.open(downloadUrl, '_blank');
            toast.success(language === 'bn' ? '??????? ???? ??????!' : 'Download started!');
            return;
        }

        // For paid templates - require login and use backend API
        if (!user) {
            toast.error(language === 'bn' ? '??????? ???? ??? ???? ????' : 'Please login to download');
            return;
        }

        try {
            toast.loading(language === 'bn' ? '?????? ???? ??? ?????...' : 'Preparing file...', { id: 'download-toast' });
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/design-templates/${selectedTemplate._id}/download`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success && data.redirectUrl) {
                window.open(data.redirectUrl, '_blank');
                toast.success(language === 'bn' ? '??????? ???? ??????' : 'Download started!', { id: 'download-toast' });
            } else {
                toast.error(language === 'bn' ? '???? ?????? ??????' : 'File not found', { id: 'download-toast' });
            }
        } catch (error) {
            console.error('Download error:', error);
            toast.error(language === 'bn' ? '??????? ???? ?????? ??????' : 'Download failed', { id: 'download-toast' });
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
                alert(t('designTemplatePage.loginToSave'));
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
            <header className="pt-20 pb-2 bg-white dark:bg-[#020202]">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className={`text-3xl md:text-4xl font-bold text-[#021E14] mb-2 ${bengaliClass}`}>
                            {t('designTemplatePage.title')}
                        </h1>
                        <p className={`text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto leading-relaxed mb-6 ${bengaliClass}`}>
                            {t('designTemplatePage.subtitle')}
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto mb-8 px-4">
                            <div className="relative group">
                                <LuSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#021E14] transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('designTemplatePage.searchPlaceholder')}
                                    className="w-full pl-14 pr-6 py-3.5 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-md shadow-md shadow-black/5 outline-none focus:ring-4 focus:ring-[#021E14]/5 transition-all text-slate-800 dark:text-white text-sm"
                                />
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-50 dark:border-white/5 pb-8 lg:px-16">
                            {/* Left side: All + Category + Price + Rating */}
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => { setSelectedCategory("all"); setSelectedPrice("all"); setSelectedRating("all"); setSelectedSort("popular"); setSelectedTool("all"); }}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-normal transition-all duration-300 ${selectedCategory === "all" && selectedPrice === "all" && selectedRating === "all"
                                        ? "bg-[#021E14] text-white shadow-lg shadow-[#021E14]/20"
                                        : "bg-slate-50 dark:bg-white/5 text-gray-800 dark:text-gray-300 hover:bg-slate-100"
                                        }`}
                                >
                                    <LuGrid3X3 size={14} />
                                    <span className={bengaliClass}>{t('designTemplatePage.all')}</span>
                                    <span className={`w-5 h-5 flex items-center justify-center rounded-md text-[10px] ${selectedCategory === "all" && selectedPrice === "all" && selectedRating === "all" ? "bg-white/20" : "bg-slate-200 dark:bg-white/10"}`}>{templates.length}</span>
                                </button>

                                {/* Category Dropdown */}
                                <div className="relative">
                                    <LuPalette className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={14} />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className={`appearance-none pl-10 pr-8 py-2.5 rounded-md text-xs font-normal transition-all outline-none cursor-pointer border-none focus:ring-1 focus:ring-[#021E14]/20 ${selectedCategory !== "all" ? "bg-[#021E14] text-white" : "bg-slate-50 dark:bg-white/5 text-gray-800 dark:text-gray-300 hover:bg-slate-100"} ${bengaliClass}`}
                                    >
                                        <option value="all">{t('designTemplatePage.allCategories')}</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {language === 'bn' ? (cat.nameBn || cat.name) : cat.name} ({getCategoryCount(cat._id)})
                                            </option>
                                        ))}
                                    </select>
                                    <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-50 pointer-events-none" size={12} />
                                </div>

                                {/* Price Dropdown */}
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none text-[13px]">?</span>
                                    <select
                                        value={selectedPrice}
                                        onChange={(e) => setSelectedPrice(e.target.value)}
                                        className={`appearance-none pl-9 pr-8 py-2.5 rounded-md text-xs font-normal transition-all outline-none cursor-pointer border-none focus:ring-1 focus:ring-[#021E14]/20 ${selectedPrice !== "all" ? "bg-[#021E14] text-white" : "bg-slate-50 dark:bg-white/5 text-gray-800 dark:text-gray-300 hover:bg-slate-100"} ${bengaliClass}`}
                                    >
                                        <option value="all">{t('designTemplatePage.allPrices')}</option>
                                        <option value="free">{t('designTemplatePage.priceFree')}</option>
                                        <option value="under500">{t('designTemplatePage.priceUnder500')}</option>
                                        <option value="500to1000">{t('designTemplatePage.price500to1000')}</option>
                                        <option value="1000to5000">{t('designTemplatePage.price1000to5000')}</option>
                                        <option value="above5000">{t('designTemplatePage.priceAbove5000')}</option>
                                    </select>
                                    <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-50 pointer-events-none" size={12} />
                                </div>

                                {/* Rating Dropdown */}
                                <div className="relative">
                                    <LuStar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] z-10 pointer-events-none" size={14} />
                                    <select
                                        value={selectedRating}
                                        onChange={(e) => setSelectedRating(e.target.value)}
                                        className={`appearance-none pl-10 pr-8 py-2.5 rounded-md text-xs font-normal transition-all outline-none cursor-pointer border-none focus:ring-1 focus:ring-[#021E14]/20 ${selectedRating !== "all" ? "bg-[#021E14] text-white" : "bg-slate-50 dark:bg-white/5 text-gray-800 dark:text-gray-300 hover:bg-slate-100"} ${bengaliClass}`}
                                    >
                                        <option value="all">{t('designTemplatePage.allRatings')}</option>
                                        <option value="4plus">{t('designTemplatePage.rating4plus')}</option>
                                        <option value="3plus">{t('designTemplatePage.rating3plus')}</option>
                                        <option value="2plus">{t('designTemplatePage.rating2plus')}</option>
                                    </select>
                                    <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-50 pointer-events-none" size={12} />
                                </div>
                            </div>

                            {/* Right side: All Tools + Sort */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* All Tools Dropdown */}
                                <div className="relative">
                                    <LuLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={14} />
                                    <select
                                        value={selectedTool}
                                        onChange={(e) => setSelectedTool(e.target.value)}
                                        className={`appearance-none pl-10 pr-8 py-2.5 rounded-md text-xs font-normal transition-all outline-none cursor-pointer border-none focus:ring-1 focus:ring-[#021E14]/20 ${selectedTool !== "all" ? "bg-[#021E14] text-white" : "bg-slate-50 dark:bg-white/5 text-gray-800 dark:text-gray-300 hover:bg-slate-100"} ${bengaliClass}`}
                                    >
                                        <option value="all">{t('designTemplatePage.allTools')}</option>
                                        {DESIGN_TOOLS_OPTIONS.map(tool => (
                                            <option key={tool} value={tool}>{tool}</option>
                                        ))}
                                    </select>
                                    <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-50 pointer-events-none" size={12} />
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <LuArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={14} />
                                    <select
                                        value={selectedSort}
                                        onChange={(e) => setSelectedSort(e.target.value)}
                                        className={`appearance-none pl-10 pr-8 py-2.5 rounded-md text-xs font-normal transition-all outline-none cursor-pointer border-none focus:ring-1 focus:ring-[#021E14]/20 bg-slate-50 dark:bg-white/5 text-gray-800 dark:text-gray-300 hover:bg-slate-100 ${bengaliClass}`}
                                    >
                                        <option value="popular">{t('designTemplatePage.mostPopular')}</option>
                                        <option value="newest">{t('designTemplatePage.sortNewest')}</option>
                                        <option value="oldest">{t('designTemplatePage.sortOldest')}</option>
                                        <option value="priceLow">{t('designTemplatePage.sortPriceLow')}</option>
                                        <option value="priceHigh">{t('designTemplatePage.sortPriceHigh')}</option>
                                    </select>
                                    <LuChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-50 pointer-events-none" size={12} />
                                </div>
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
                            <h3 className={`text-xl font-bold text-slate-800 dark:text-white mb-2 ${bengaliClass}`}>{t('designTemplatePage.noTemplatesTitle')}</h3>
                            <p className={`text-slate-500 ${bengaliClass}`}>{t('designTemplatePage.noTemplatesDesc')}</p>
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
                                                <button onClick={closeModal} className={`hover:text-[#021E14] transition-colors shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    <FiChevronLeft size={20} className="inline mr-1" />
                                                    {t('designTemplatePage.back')}
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
                                                    <span className={`text-sm ${bengaliClass}`}>{t('designTemplatePage.contactUs')}</span>
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
                                                        className={`p-2.5 border rounded-lg transition-all ${isLiked ? 'text-[#021E14] border-[#021E14]/30 bg-[#021E14]/5' : isDark ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
                                                    >
                                                        <LuHeart size={18} className={isLiked ? 'fill-current' : ''} />
                                                    </button>
                                                </div>

                                                {/* Download Button Group */}
                                                <div className="flex items-stretch rounded-lg overflow-hidden border-0">
                                                    <button
                                                        onClick={handleBuyNow}
                                                        className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm transition-all shadow-none ${selectedTemplate.accessType === 'free' ? 'bg-[#00C853] hover:bg-[#00B24A] text-white' : 'bg-[#021E14] hover:bg-[#021E14] text-white'}`}
                                                    >
                                                        {selectedTemplate.accessType === 'free' ? t('designTemplatePage.freeDownload') : t('designTemplatePage.buyTemplate')}
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
                                                            <span className="text-gray-400">{t('designTemplatePage.noImage')}</span>
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
                                                                ? "border-[#021E14] ring-2 ring-[#021E14]/30"
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
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-[#021E14]/10 text-[#021E14] border border-[#021E14]/20' : 'bg-[#021E14]/10 text-[#021E14] border border-[#021E14]/20'}`}>
                                                            {language === 'bn' ? (selectedTemplate.category.nameBn || selectedTemplate.category.name) : selectedTemplate.category.name}
                                                        </span>
                                                    )}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                                        {selectedTemplate.templateType}
                                                    </span>
                                                    {selectedTemplate.accessType === 'free' && (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white ${bengaliClass}`}>{t('designTemplatePage.free').toUpperCase()}</span>
                                                    )}
                                                </div>

                                                <h1 className={`text-2xl md:text-3xl font-bold leading-tight mb-4 ${bengaliClass} ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {selectedTemplate.title}
                                                </h1>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <LuEye size={16} /> {selectedTemplate.viewCount || 0} {t('designTemplatePage.views')}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <LuHeart size={16} className={isLiked ? "text-[#021E14] fill-red-500" : ""} /> {likeCount} {t('designTemplatePage.likes')}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <LuStar size={16} className="text-[#D4AF37]" /> {selectedTemplate.rating || 0} ({selectedTemplate.reviewCount || 0} {t('designTemplatePage.reviews')})
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <LuDownload size={16} /> {selectedTemplate.salesCount || 0} {t('designTemplatePage.sales')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className={`py-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                                <h2 className={`text-lg font-bold mb-4 ${bengaliClass} ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('designTemplatePage.description')}</h2>
                                                <div className={`prose max-w-none ${isDark ? 'prose-invert' : ''}`}>
                                                    <div
                                                        className={`rich-content ${bengaliClass}`}
                                                        dangerouslySetInnerHTML={{ __html: selectedTemplate.longDescription || selectedTemplate.description || `<p>${t('designTemplatePage.noDescription')}</p>` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                                                {/* Design Tools Card */}
                                                <div className={`p-5 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                                    <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        <LuLayers className="text-[#021E14]" size={16} /> {t('designTemplatePage.designTools')}
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
                                                        <LuCalendar className="text-cyan-500" size={16} /> {t('designTemplatePage.info')}
                                                    </h3>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className={`text-gray-500 ${bengaliClass}`}>{t('designTemplatePage.published')}</span>
                                                            <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(selectedTemplate.publishDate)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className={`text-gray-500 ${bengaliClass}`}>{t('designTemplatePage.lastUpdate')}</span>
                                                            <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(selectedTemplate.lastUpdate)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className={`text-gray-500 ${bengaliClass}`}>{t('designTemplatePage.license')}</span>
                                                            <span className={`capitalize ${bengaliClass} ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedTemplate.licenseType || t('designTemplatePage.regular')}</span>
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
                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all group-hover:bg-[#021E14] group-hover:text-white group-hover:border-[#021E14] ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                        <LuX size={16} />
                                    </div>
                                    <span className={`text-[8px] font-bold text-gray-400 group-hover:text-[#021E14] transition-colors uppercase tracking-wider ${bengaliClass}`}>{t('designTemplatePage.close')}</span>
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
                                    <span className={`text-[8px] font-bold text-gray-400 group-hover:text-green-500 transition-colors uppercase tracking-wider ${bengaliClass}`}>{t('designTemplatePage.message')}</span>
                                </button>

                                {/* Save/Like */}
                                <button
                                    onClick={handleLike}
                                    className="group flex flex-col items-center gap-1.5"
                                >
                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all ${isLiked
                                        ? 'bg-[#021E14] text-white border-[#021E14]'
                                        : isDark ? 'bg-white/5 text-gray-400 border-white/10 group-hover:bg-[#021E14] group-hover:text-white group-hover:border-[#021E14]' : 'bg-gray-100 text-gray-500 border-gray-200 group-hover:bg-[#021E14] group-hover:text-white group-hover:border-[#021E14]'}`}>
                                        <LuHeart size={16} className={isLiked ? 'fill-white' : ''} />
                                    </div>
                                    <span className={`text-[8px] font-bold transition-colors uppercase tracking-wider ${bengaliClass} ${isLiked ? 'text-[#021E14]' : 'text-gray-400 group-hover:text-[#021E14]'}`}>{t('designTemplatePage.save')}</span>
                                </button>

                                {/* Share - Copy Link */}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.origin + `/design-template/${selectedTemplate.slug || selectedTemplate._id}`);
                                        alert(t('designTemplatePage.linkCopied'));
                                    }}
                                    className="group flex flex-col items-center gap-1.5"
                                >
                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all group-hover:bg-[#021E14] group-hover:text-white group-hover:border-[#021E14] ${isDark ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                        <FiShare2 size={16} />
                                    </div>
                                    <span className={`text-[8px] font-bold text-gray-400 group-hover:text-[#021E14] transition-colors uppercase tracking-wider ${bengaliClass}`}>{t('designTemplatePage.share')}</span>
                                </button>

                                {selectedTemplate.accessType !== 'free' && (
                                    <button
                                        onClick={handleAddToCart}
                                        className="group flex flex-col items-center gap-1.5"
                                    >
                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-all ${isAdded
                                            ? 'bg-green-500 text-white border-green-500'
                                            : isDark ? 'bg-white/5 text-gray-400 border-white/10 group-hover:bg-[#D4AF37] group-hover:text-white group-hover:border-[#D4AF37]' : 'bg-gray-100 text-gray-500 border-gray-200 group-hover:bg-[#D4AF37] group-hover:text-white group-hover:border-[#D4AF37]'}`}>
                                            {isAdded ? <LuCheck size={16} /> : <LuShoppingCart size={16} />}
                                        </div>
                                        <span className={`text-[8px] font-bold transition-colors uppercase tracking-wider ${bengaliClass} ${isAdded ? 'text-green-500' : 'text-gray-400 group-hover:text-[#D4AF37]'}`}>{isAdded ? t('designTemplatePage.added') : t('designTemplatePage.cart')}</span>
                                    </button>
                                )}

                                <div className={`w-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

                                <div className={`p-2 rounded-md border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="text-center">
                                        {selectedTemplate.accessType === 'free' ? (
                                            <div className={`text-base font-bold text-green-500 ${bengaliClass}`}>{t('designTemplatePage.free')}</div>
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
                                        : isAdded ? 'bg-green-500 text-white' : 'bg-[#021E14] hover:bg-[#400000] text-white'
                                        }`}
                                >
                                    {selectedTemplate.accessType === 'free' ? t('designTemplatePage.freeDownloadBtn') : isAdded ? t('designTemplatePage.added') + '!' : t('designTemplatePage.buyNow')}
                                </button>
                            </aside>

                            {/* Mobile Bottom Bar */}
                            <div className={`lg:hidden fixed bottom-0 left-0 w-full z-50 backdrop-blur-xl border-t p-3 flex items-center gap-3 ${isDark ? 'bg-[#0f0f0f]/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                                <button
                                    onClick={handleLike}
                                    className={`p-3 rounded-md border transition-all ${isLiked ? "bg-[#021E14] border-[#021E14] text-white" : isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-500"}`}
                                >
                                    <FiThumbsUp size={18} />
                                </button>
                                <div className="flex-1 text-center">
                                    {selectedTemplate.accessType === 'free' ? (
                                        <span className={`text-lg font-bold text-green-500 ${bengaliClass}`}>{t('designTemplatePage.free')}</span>
                                    ) : (
                                        <>
                                            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>৳{currentPrice?.toLocaleString()}</span>
                                            {hasDiscount && <span className="text-xs text-gray-400 line-through ml-2">৳{selectedTemplate.price?.toLocaleString()}</span>}
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={handleBuyNow}
                                    className={`px-6 py-3 rounded-md font-bold text-sm shadow-lg flex items-center gap-2 ${selectedTemplate.accessType === 'free' ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-[#021E14] text-white shadow-[#021E14]/20'}`}
                                >
                                    <LuDownload size={16} />
                                    {selectedTemplate.accessType === 'free' ? t('designTemplatePage.freeDownloadBtn') : t('designTemplatePage.buyNow')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
        </div>
    );
};

const DesignTemplatePage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020202]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <LuPalette className="text-[#021E14] mb-2" size={48} />
                    <p className="text-gray-500 font-medium tracking-wider text-sm uppercase">Loading...</p>
                </div>
            </div>
        }>
            <DesignTemplateContent />
        </Suspense>
    );
};

export default DesignTemplatePage;


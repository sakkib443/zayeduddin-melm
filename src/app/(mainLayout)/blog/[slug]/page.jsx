'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiTrendingUp,
    FiArrowLeft,
    FiClock,
    FiUser,
    FiCalendar,
    FiHeart,
    FiMessageCircle,
    FiShare2,
    FiBookOpen,
    FiTag,
    FiEye,
    FiSend,
    FiTwitter,
    FiFacebook,
    FiLinkedin,
    FiCopy,
    FiCheck,
    FiArrowRight,
    FiTrash2,
    FiCornerDownRight,
    FiX,
    FiMail,
} from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function SingleBlogPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;
    const user = useSelector(state => state.auth?.user);
    const { language } = useLanguage();

    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [readProgress, setReadProgress] = useState(0);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [deletingComment, setDeletingComment] = useState(null);

    const bengaliClass = language === 'bn' ? 'hind-siliguri' : '';

    // Translations
    const text = {
        bn: {
            blog: 'রিসোর্স লাইব্রেরি',
            min: 'মিঃ',
            views: 'ভিউ',
            summary: 'সারসংক্ষেপ',
            videoTutorial: 'ভিডিও টিউটোরিয়াল',
            allArticles: 'সব নিবন্ধ দেখুন',
            authorDesc: 'এই প্ল্যাটফর্মের একজন নিবেদিতপ্রাণ কন্টেন্ট ক্রিয়েটর।',
            comments: 'মন্তব্য',
            commentsCount: 'টি মন্তব্য',
            writeComment: 'আপনার মতামত লিখুন...',
            loginToComment: 'মন্তব্য করতে লগইন করুন অথবা নাম দিন',
            posting: 'পোস্ট হচ্ছে...',
            submitComment: 'মন্তব্য করুন',
            noComments: 'কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!',
            relatedPosts: 'সম্পর্কিত পোস্ট',
            learnMore: 'আরও শিখতে চান?',
            allBlogsHere: 'আমাদের সব রিসোর্স এক জায়গায়',
            viewAllBlogs: 'সব রিসোর্স দেখুন',
            blogNotFound: 'রিসোর্স পাওয়া যায়নি',
            backToBlog: '← রিসোর্স লাইব্রেরিতে ফিরে যান',
            loginRequired: 'লগইন করুন',
            commentAdded: 'মন্তব্য যোগ হয়েছে!',
            linkCopied: 'লিংক কপি হয়েছে!',
            yourName: 'আপনার নাম',
            yourEmail: 'ইমেইল (ঐচ্ছিক)',
            reply: 'উত্তর দিন',
            replies: 'টি উত্তর',
            cancel: 'বাতিল',
            delete: 'মুছুন',
            deleteConfirm: 'আপনি কি নিশ্চিত মুছতে চান?',
            guest: 'অতিথি',
            liked: 'পছন্দ করেছেন',
        },
        en: {
            blog: 'Resource Library',
            min: 'min',
            views: 'views',
            summary: 'Summary',
            videoTutorial: 'Video Tutorial',
            allArticles: 'View all articles',
            authorDesc: 'A dedicated content creator on this platform.',
            comments: 'Comments',
            commentsCount: 'comments',
            writeComment: 'Write your comment...',
            loginToComment: 'Login or enter your name to comment',
            posting: 'Posting...',
            submitComment: 'Submit',
            noComments: 'No comments yet. Be the first to comment!',
            relatedPosts: 'Related Posts',
            learnMore: 'Want to learn more?',
            allBlogsHere: 'All our resources in one place',
            viewAllBlogs: 'View All Resources',
            blogNotFound: 'Resource not found',
            backToBlog: '← Back to Resource Library',
            loginRequired: 'Please login',
            commentAdded: 'Comment added!',
            linkCopied: 'Link copied!',
            yourName: 'Your name',
            yourEmail: 'Email (optional)',
            reply: 'Reply',
            replies: 'replies',
            cancel: 'Cancel',
            delete: 'Delete',
            deleteConfirm: 'Are you sure you want to delete?',
            guest: 'Guest',
            liked: 'Liked',
        }
    }[language] || {};

    // Check anonymous like from localStorage
    useEffect(() => {
        if (blog?._id) {
            const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
            if (likedBlogs.includes(blog._id)) {
                setIsLiked(true);
            }
        }
    }, [blog?._id]);

    // Load guest info from localStorage
    useEffect(() => {
        const savedName = localStorage.getItem('guestCommentName');
        const savedEmail = localStorage.getItem('guestCommentEmail');
        if (savedName) setGuestName(savedName);
        if (savedEmail) setGuestEmail(savedEmail);
    }, []);

    // Reading progress bar
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setReadProgress(Math.min(100, Math.max(0, progress)));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch blog data
    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return;

            setLoading(true);
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const res = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`, { headers });
                const data = await res.json();

                if (data.success && data.data) {
                    setBlog(data.data);
                    setRelatedBlogs(data.data.relatedBlogs || []);
                    setIsLiked(data.data.isLiked || false);
                    setLikeCount(data.data.likeCount || 0);

                    // Check local storage for anonymous likes
                    const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
                    if (likedBlogs.includes(data.data._id)) {
                        setIsLiked(true);
                    }

                    const commentsRes = await fetch(`${API_BASE_URL}/blogs/${data.data._id}/comments`);
                    const commentsData = await commentsRes.json();
                    if (commentsData.success) setComments(commentsData.data || []);
                } else {
                    router.push('/blog');
                }
            } catch (error) {
                console.error('Failed to fetch blog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug, router]);

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');

            if (user && token) {
                // Authenticated like
                const res = await fetch(`${API_BASE_URL}/blogs/${blog._id}/toggle-like`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) {
                    setIsLiked(data.data.isLiked);
                    setLikeCount(data.data.likeCount);
                }
            } else {
                // Anonymous like using localStorage
                const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');

                if (likedBlogs.includes(blog._id)) {
                    // Already liked, remove
                    const filtered = likedBlogs.filter(id => id !== blog._id);
                    localStorage.setItem('likedBlogs', JSON.stringify(filtered));
                    setIsLiked(false);
                    setLikeCount(prev => Math.max(0, prev - 1));
                    toast.success(language === 'bn' ? 'লাইক সরানো হয়েছে' : 'Like removed');
                } else {
                    // Add like
                    likedBlogs.push(blog._id);
                    localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
                    setIsLiked(true);
                    setLikeCount(prev => prev + 1);
                    toast.success(language === 'bn' ? 'পছন্দ করেছেন!' : 'Liked!');
                }
            }
        } catch (error) {
            toast.error('Failed to like');
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        // Check if user or guest name is provided
        if (!user && !guestName.trim()) {
            toast.error(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম দিন' : 'Please provide your name');
            return;
        }

        setSubmittingComment(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers.Authorization = `Bearer ${token}`;

            const bodyData = { content: commentText };
            if (!user) {
                bodyData.guestName = guestName;
                bodyData.guestEmail = guestEmail;
                // Save to localStorage for future
                localStorage.setItem('guestCommentName', guestName);
                if (guestEmail) localStorage.setItem('guestCommentEmail', guestEmail);
            }

            const res = await fetch(`${API_BASE_URL}/blogs/${blog._id}/comments`, {
                method: 'POST',
                headers,
                body: JSON.stringify(bodyData),
            });
            const data = await res.json();
            if (data.success) {
                setComments([data.data, ...comments]);
                setCommentText('');
                toast.success(language === 'bn' ? 'মন্তব্য যোগ হয়েছে!' : 'Comment added!');
            } else {
                toast.error(data.message || 'Failed to add comment');
            }
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleReply = async (parentCommentId) => {
        if (!replyText.trim()) return;

        if (!user && !guestName.trim()) {
            toast.error(language === 'bn' ? 'অনুগ্রহ করে আপনার নাম দিন' : 'Please provide your name');
            return;
        }

        setSubmittingComment(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers.Authorization = `Bearer ${token}`;

            const bodyData = { content: replyText, parentComment: parentCommentId };
            if (!user) {
                bodyData.guestName = guestName;
                bodyData.guestEmail = guestEmail;
            }

            const res = await fetch(`${API_BASE_URL}/blogs/${blog._id}/comments`, {
                method: 'POST',
                headers,
                body: JSON.stringify(bodyData),
            });
            const data = await res.json();
            if (data.success) {
                // Add reply to the parent comment
                setComments(comments.map(c => {
                    if (c._id === parentCommentId) {
                        return { ...c, replies: [...(c.replies || []), data.data] };
                    }
                    return c;
                }));
                setReplyText('');
                setReplyingTo(null);
                toast.success(language === 'bn' ? 'উত্তর যোগ হয়েছে!' : 'Reply added!');
            }
        } catch (error) {
            toast.error('Failed to add reply');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId, isReply = false, parentId = null) => {
        if (!confirm(text.deleteConfirm)) return;

        setDeletingComment(commentId);
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers.Authorization = `Bearer ${token}`;

            const bodyData = {};
            if (!user && guestEmail) {
                bodyData.guestEmail = guestEmail;
            }

            const res = await fetch(`${API_BASE_URL}/blogs/comments/${commentId}`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify(bodyData),
            });
            const data = await res.json();

            if (data.success) {
                if (isReply && parentId) {
                    setComments(comments.map(c => {
                        if (c._id === parentId) {
                            return { ...c, replies: c.replies.filter(r => r._id !== commentId) };
                        }
                        return c;
                    }));
                } else {
                    setComments(comments.filter(c => c._id !== commentId));
                }
                toast.success(language === 'bn' ? 'মন্তব্য মুছে ফেলা হয়েছে!' : 'Comment deleted!');
            } else {
                toast.error(data.message || 'Failed to delete');
            }
        } catch (error) {
            toast.error('Failed to delete comment');
        } finally {
            setDeletingComment(null);
        }
    };

    const canDeleteComment = (comment) => {
        if (!comment) return false;
        // Admin can delete any
        if (user?.role === 'admin') return true;
        // Owner can delete own
        if (user && comment.user && comment.user._id === user._id) return true;
        // Guest can delete own by email
        if (!comment.user && guestEmail && comment.guestEmail === guestEmail) return true;
        return false;
    };

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = blog?.title || '';

    const handleShare = (platform) => {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        };
        if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
        setShowShareMenu(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success(language === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link copied!');
        setTimeout(() => setCopied(false), 2000);
        setShowShareMenu(false);
    };

    const getCommentAuthor = (comment) => {
        if (comment.user) {
            return `${comment.user.firstName || ''} ${comment.user.lastName || ''}`.trim() || 'User';
        }
        return comment.guestName || text.guest;
    };

    const getCommentAvatar = (comment) => {
        if (comment.user?.avatar) return comment.user.avatar;
        const name = comment.user?.firstName || comment.guestName || 'G';
        return name[0]?.toUpperCase() || 'G';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-[#021E14]/20 border-t-[#021E14] rounded-full"
                />
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] transition-colors duration-300">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1.5 z-[60]">
                <motion.div
                    style={{ width: `${readProgress}%` }}
                    className="h-full bg-[#021E14] dark:bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />
            </div>

            {/* --- Premium Banner --- */}
            <div className="relative h-[45vh] md:h-[60vh] overflow-hidden">
                <Image
                    src={blog.thumbnail || "/images/blog-placeholder.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#021E14] via-[#021E14]/60 to-[#021E14]/40" />

                {/* Banner Content */}
                <div className="absolute inset-x-0 bottom-0 py-12 md:py-20">
                    <div className="container mx-auto px-4 lg:px-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-4xl"
                        >
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <Link
                                    href="/blog"
                                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
                                >
                                    <FiArrowLeft size={14} />
                                    {text.blog}
                                </Link>
                                <span className="px-4 py-1.5 rounded-full bg-[#D4AF37] text-[#021E14] text-xs font-bold uppercase tracking-widest">
                                    {blog.category?.name || 'Article'}
                                </span>
                            </div>

                            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight tracking-tight ${bengaliClass}`}>
                                {blog.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] p-0.5 relative overflow-hidden">
                                        {blog.author?.avatar ? (
                                            <Image src={blog.author.avatar} alt="Author" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#D4AF37] text-[#021E14] flex items-center justify-center font-bold">
                                                {blog.author?.firstName?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{blog.author?.firstName} {blog.author?.lastName}</p>
                                        <p className="text-xs">{blog.authorRole?.toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-white/20 hidden md:block" />
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="text-[#D4AF37]" />
                                    <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiClock className="text-[#D4AF37]" />
                                    <span>{blog.readingTime || 5} {text.min}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiEye className="text-[#D4AF37]" />
                                    <span>{blog.totalViews || 0} {text.views}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* --- Article Body --- */}
            <section className="py-16 md:py-24 bg-white dark:bg-[#050505]">
                <div className="container mx-auto px-4 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Left Sidebar - Social Share */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-24 flex flex-col items-center gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLike}
                                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all shadow-lg ${isLiked
                                        ? 'bg-[#021E14] text-white shadow-[#021E14]/20'
                                        : 'bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-[#021E14] dark:hover:text-[#D4AF37]'
                                        }`}
                                >
                                    <FiHeart size={20} className={isLiked ? 'fill-current' : ''} />
                                    <span className="text-[10px] font-bold mt-1">{likeCount}</span>
                                </motion.button>

                                <button className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 flex flex-col items-center justify-center hover:text-[#021E14] dark:hover:text-[#D4AF37] transition-all">
                                    <FiMessageCircle size={20} />
                                    <span className="text-[10px] font-bold mt-1">{comments.length}</span>
                                </button>

                                <div className="w-10 h-px bg-slate-200 dark:bg-white/10 my-2" />

                                <div className="relative group">
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 flex items-center justify-center hover:text-[#021E14] dark:hover:text-[#D4AF37] transition-all"
                                    >
                                        <FiShare2 size={20} />
                                    </button>

                                    <AnimatePresence>
                                        {showShareMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className="absolute left-16 top-0 bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-2 min-w-[160px] z-20"
                                            >
                                                <button onClick={() => handleShare('twitter')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-all">
                                                    <FiTwitter className="text-sky-500" /> <span className="text-xs font-bold">Twitter</span>
                                                </button>
                                                <button onClick={() => handleShare('facebook')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-all">
                                                    <FiFacebook className="text-[#021E14]" /> <span className="text-xs font-bold">Facebook</span>
                                                </button>
                                                <button onClick={() => handleShare('linkedin')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-all">
                                                    <FiLinkedin className="text-[#021E14]" /> <span className="text-xs font-bold">LinkedIn</span>
                                                </button>
                                                <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />
                                                <button onClick={copyLink} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-all">
                                                    {copied ? <FiCheck className="text-[#021E14]" /> : <FiCopy />}
                                                    <span className="text-xs font-bold">{copied ? 'Copied!' : 'Copy Link'}</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="lg:col-span-8">
                            <article className="max-w-none">
                                {/* Excerpt / Summary */}
                                <div className="mb-14 p-10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#021E14]/5 dark:bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 text-[#021E14] dark:text-[#D4AF37] text-xs font-black uppercase tracking-[0.2em] mb-4">
                                            <FiBookOpen size={14} />
                                            {text.summary}
                                        </div>
                                        <p className={`text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed ${bengaliClass}`}>
                                            "{blog.excerpt}"
                                        </p>
                                    </div>
                                </div>

                                {/* Main Rich Text Content */}
                                <div
                                    className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none mb-20 break-words overflow-hidden
                                        prose-headings:font-bold prose-headings:text-[#021E14] dark:prose-headings:text-white
                                        prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                                        prose-a:text-[#021E14] dark:prose-a:text-[#D4AF37] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                                        prose-blockquote:border-[#021E14] dark:prose-blockquote:border-[#D4AF37] prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-white/5 prose-blockquote:rounded-r-3xl prose-blockquote:py-4 prose-blockquote:px-8
                                        prose-img:rounded-[2.5rem] prose-img:shadow-2xl
                                        prose-li:text-slate-600 dark:prose-li:text-slate-400
                                        ${bengaliClass}`}
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />

                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-3 mb-20">
                                        <div className="flex items-center gap-2 text-slate-400 mr-2">
                                            <FiTag />
                                            <span className="text-sm font-bold uppercase tracking-widest">Tags:</span>
                                        </div>
                                        {blog.tags.map((tag, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/blog?tag=${tag}`}
                                                className="px-5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-[#021E14] hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-[#021E14] transition-all"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Author Signature */}
                                <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#021E14] to-[#6b0f0f] text-white shadow-2xl relative overflow-hidden mb-20">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                        <div className="w-24 h-24 rounded-3xl border-2 border-[#D4AF37]/30 p-1 shrink-0">
                                            <div className="w-full h-full rounded-2xl relative overflow-hidden bg-white/10 flex items-center justify-center text-3xl font-bold">
                                                {blog.author?.avatar ? (
                                                    <Image src={blog.author.avatar} alt="Author" fill className="object-cover" />
                                                ) : blog.author?.firstName?.[0]}
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h4 className="text-2xl font-bold mb-3">{blog.author?.firstName} {blog.author?.lastName}</h4>
                                            <p className="text-white/70 text-base mb-6 leading-relaxed">{text.authorDesc}</p>
                                            <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] text-[#021E14] font-bold hover:shadow-xl hover:-translate-y-1 transition-all">
                                                About the Author <FiArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="pt-20 border-t border-slate-100 dark:border-white/5">
                                    <h3 className={`text-3xl font-bold text-[#021E14] dark:text-white mb-12 ${bengaliClass}`}>
                                        {text.comments} ({comments.length})
                                    </h3>

                                    {/* Comment Form */}
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-[2.5rem] p-8 md:p-12 mb-16 border border-slate-100 dark:border-white/5">
                                        <form onSubmit={handleSubmitComment}>
                                            {/* Guest Name & Email fields - Only show if not logged in */}
                                            {!user && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                    <div className="relative">
                                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={guestName}
                                                            onChange={(e) => setGuestName(e.target.value)}
                                                            placeholder={text.yourName + ' *'}
                                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-4 focus:ring-[#021E14]/5 dark:focus:ring-[#D4AF37]/5 focus:border-[#021E14] dark:focus:border-[#D4AF37] transition-all"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                        <input
                                                            type="email"
                                                            value={guestEmail}
                                                            onChange={(e) => setGuestEmail(e.target.value)}
                                                            placeholder={text.yourEmail}
                                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-4 focus:ring-[#021E14]/5 dark:focus:ring-[#D4AF37]/5 focus:border-[#021E14] dark:focus:border-[#D4AF37] transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="relative group mb-6">
                                                <textarea
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder={text.writeComment}
                                                    rows={4}
                                                    className={`w-full p-8 rounded-3xl bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-4 focus:ring-[#021E14]/5 dark:focus:ring-[#D4AF37]/5 focus:border-[#021E14] dark:focus:border-[#D4AF37] transition-all resize-none shadow-inner ${bengaliClass}`}
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    disabled={!commentText.trim() || submittingComment || (!user && !guestName.trim())}
                                                    className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#021E14] text-white font-bold disabled:opacity-50 hover:shadow-2xl hover:scale-105 transition-all"
                                                >
                                                    {submittingComment ? text.posting : text.submitComment}
                                                    <FiSend />
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Comments List */}
                                    <div className="space-y-6">
                                        {comments.length === 0 ? (
                                            <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                                                <FiMessageCircle size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                                                <p className="text-slate-400 font-bold">{text.noComments}</p>
                                            </div>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment._id} className="p-8 bg-white dark:bg-[#0d0d0d] rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm">
                                                    <div className="flex gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-[#021E14]/5 dark:bg-[#D4AF37]/10 flex items-center justify-center font-bold text-[#021E14] dark:text-[#D4AF37] shrink-0 overflow-hidden relative">
                                                            {comment.user?.avatar ? (
                                                                <Image src={comment.user.avatar} alt="" fill className="object-cover" />
                                                            ) : (
                                                                getCommentAvatar(comment)
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <h5 className="font-bold text-[#021E14] dark:text-white">
                                                                        {getCommentAuthor(comment)}
                                                                        {!comment.user && (
                                                                            <span className="ml-2 text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-white/10 rounded-full text-slate-500 dark:text-slate-400">
                                                                                {text.guest}
                                                                            </span>
                                                                        )}
                                                                    </h5>
                                                                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                                                        className="text-xs font-bold text-slate-400 hover:text-[#021E14] dark:hover:text-[#D4AF37] transition-colors flex items-center gap-1"
                                                                    >
                                                                        <FiCornerDownRight size={12} />
                                                                        {text.reply}
                                                                    </button>
                                                                    {canDeleteComment(comment) && (
                                                                        <button
                                                                            onClick={() => handleDeleteComment(comment._id)}
                                                                            disabled={deletingComment === comment._id}
                                                                            className="text-xs font-bold text-[#021E14] hover:text-[#021E14] transition-colors flex items-center gap-1"
                                                                        >
                                                                            <FiTrash2 size={12} />
                                                                            {text.delete}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{comment.content}</p>

                                                            {/* Reply Form */}
                                                            <AnimatePresence>
                                                                {replyingTo === comment._id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="mt-4 pl-4 border-l-2 border-[#021E14]/20 dark:border-[#D4AF37]/20"
                                                                    >
                                                                        {!user && (
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    value={guestName}
                                                                                    onChange={(e) => setGuestName(e.target.value)}
                                                                                    placeholder={text.yourName + ' *'}
                                                                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-[#021E14] dark:focus:border-[#D4AF37]"
                                                                                />
                                                                                <input
                                                                                    type="email"
                                                                                    value={guestEmail}
                                                                                    onChange={(e) => setGuestEmail(e.target.value)}
                                                                                    placeholder={text.yourEmail}
                                                                                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-[#021E14] dark:focus:border-[#D4AF37]"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                        <div className="flex gap-2">
                                                                            <input
                                                                                type="text"
                                                                                value={replyText}
                                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                                placeholder={text.writeComment}
                                                                                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#021E14] dark:focus:border-[#D4AF37]"
                                                                            />
                                                                            <button
                                                                                onClick={() => handleReply(comment._id)}
                                                                                disabled={!replyText.trim() || submittingComment || (!user && !guestName.trim())}
                                                                                className="px-4 py-3 rounded-xl bg-[#021E14] text-white font-bold disabled:opacity-50 hover:bg-[#500000] transition-all"
                                                                            >
                                                                                <FiSend />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                                                className="px-4 py-3 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                                                                            >
                                                                                <FiX />
                                                                            </button>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>

                                                            {/* Replies */}
                                                            {comment.replies && comment.replies.length > 0 && (
                                                                <div className="mt-6 space-y-4 pl-4 border-l-2 border-[#021E14]/10 dark:border-[#D4AF37]/10">
                                                                    {comment.replies.map((reply) => (
                                                                        <div key={reply._id} className="flex gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                                                            <div className="w-10 h-10 rounded-xl bg-[#021E14]/5 dark:bg-[#D4AF37]/10 flex items-center justify-center font-bold text-[#021E14] dark:text-[#D4AF37] text-sm shrink-0 overflow-hidden relative">
                                                                                {reply.user?.avatar ? (
                                                                                    <Image src={reply.user.avatar} alt="" fill className="object-cover" />
                                                                                ) : (
                                                                                    getCommentAvatar(reply)
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <h6 className="font-bold text-sm text-[#021E14] dark:text-white">
                                                                                            {getCommentAuthor(reply)}
                                                                                            {!reply.user && (
                                                                                                <span className="ml-1 text-[9px] px-1.5 py-0.5 bg-slate-200 dark:bg-white/10 rounded-full text-slate-500 dark:text-slate-400">
                                                                                                    {text.guest}
                                                                                                </span>
                                                                                            )}
                                                                                        </h6>
                                                                                        <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">
                                                                                            {new Date(reply.createdAt).toLocaleDateString()}
                                                                                        </span>
                                                                                    </div>
                                                                                    {canDeleteComment(reply) && (
                                                                                        <button
                                                                                            onClick={() => handleDeleteComment(reply._id, true, comment._id)}
                                                                                            disabled={deletingComment === reply._id}
                                                                                            className="text-[10px] font-bold text-[#021E14] hover:text-[#021E14] transition-colors"
                                                                                        >
                                                                                            <FiTrash2 size={10} />
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                                <p className="text-sm text-slate-600 dark:text-slate-400">{reply.content}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Right Sidebar */}
                        <aside className="lg:col-span-3 space-y-12">
                            {/* Related Posts */}
                            {relatedBlogs.length > 0 && (
                                <div className="bg-white dark:bg-[#0d0d0d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 shadow-xl shadow-black/5">
                                    <h3 className="text-xl font-bold text-[#021E14] dark:text-white mb-8 flex items-center gap-3">
                                        <FiTrendingUp className="text-[#D4AF37]" />
                                        {text.relatedPosts}
                                    </h3>
                                    <div className="space-y-8">
                                        {relatedBlogs.map((related) => (
                                            <Link key={related._id} href={`/blog/${related.slug}`} className="group block">
                                                <div className="relative h-40 rounded-3xl overflow-hidden mb-4 shadow-lg">
                                                    <Image src={related.thumbnail || "/images/blog-placeholder.jpg"} alt={related.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                    <div className="absolute bottom-4 left-4">
                                                        <span className="px-2 py-1 rounded-lg bg-[#D4AF37] text-[#021E14] text-[10px] font-bold uppercase tracking-tighter">
                                                            {related.category?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <h4 className={`text-sm md:text-base font-bold text-[#021E14] dark:text-white line-clamp-2 group-hover:text-[#D4AF37] transition-colors ${bengaliClass}`}>
                                                    {related.title}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                    <FiCalendar />
                                                    <span>{new Date(related.publishedAt || related.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Sidebar Ad / CTA */}
                            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#021E14] to-[#1a0000] text-center relative overflow-hidden shadow-2xl">
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#D4AF37]/20">
                                        <FiRocket className="text-[#021E14]" size={30} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{text.learnMore}</h3>
                                    <p className="text-white/60 text-sm mb-8 leading-relaxed">{text.allBlogsHere}</p>
                                    <Link href="/blog" className="block w-full py-4 rounded-2xl bg-white text-[#021E14] font-bold hover:shadow-2xl hover:bg-[#D4AF37] transition-all">
                                        {text.viewAllBlogs}
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Mobile Social Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0d0d0d] border-t border-slate-100 dark:border-white/10 p-4 z-50">
                <div className="flex items-center justify-around">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isLiked ? 'bg-[#021E14] text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'}`}
                    >
                        <FiHeart className={isLiked ? 'fill-current' : ''} />
                        <span className="font-bold">{likeCount}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                        <FiMessageCircle />
                        <span className="font-bold">{comments.length}</span>
                    </button>
                    <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
                    >
                        <FiShare2 />
                        <span className="font-bold">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Internal Icon
const FiRocket = ({ size, className }) => (
    <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height={size}
        width={size}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="m9 12-3 3"></path>
        <path d="m12 15-3 3"></path>
        <path d="M15 9h.01"></path>
    </svg>
);

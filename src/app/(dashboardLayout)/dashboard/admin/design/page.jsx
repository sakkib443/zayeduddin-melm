"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '@/config/api';
import { 
    FiLayout, 
    FiHome, 
    FiInfo, 
    FiMail, 
    FiSearch, 
    FiArrowRight,
    FiImage,
    FiFileText,
    FiLayers,
    FiRefreshCw
} from 'react-icons/fi';

// Design page sections configuration
const designPages = [
    {
        id: 'home',
        title: 'Home Page',
        description: 'Hero section, popular courses, digital products, and what we provide',
        href: '/dashboard/admin/design/home',
        icon: FiHome,
        sections: ['Hero', 'Popular Courses', 'Digital Products', 'What We Provide'],
        color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
        id: 'about',
        title: 'About Page',
        description: 'Mission, features, founder info, stats, and CTA sections',
        href: '/dashboard/admin/design/about',
        icon: FiInfo,
        sections: ['Hero', 'Mission', 'Features', 'Founder', 'Stats', 'CTA'],
        color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
    },
    {
        id: 'contact',
        title: 'Contact Page',
        description: 'Contact form settings and information',
        href: '/dashboard/admin/design/contact',
        icon: FiMail,
        sections: ['Contact Info', 'Form Settings'],
        color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400'
    }
];

// Stats card component
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-4 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${color}`}>
                <Icon size={18} />
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    </div>
);

// Design page card component
const DesignCard = ({ page }) => (
    <Link
        href={page.href}
        className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-5 shadow-sm hover:shadow-md transition-shadow"
    >
        <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-md flex items-center justify-center ${page.color}`}>
                <page.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {page.title}
                    </h3>
                    <FiArrowRight 
                        size={16} 
                        className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" 
                    />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {page.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {page.sections.map((section, idx) => (
                        <span 
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-md font-medium"
                        >
                            {section}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </Link>
);

const DesignManagementPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSections: 0,
        lastUpdated: null
    });

    // Fetch designs from API
    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/design`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.data) {
                setDesigns(data.data);
                setStats({
                    totalSections: data.data.length,
                    lastUpdated: data.data[0]?.updatedAt || null
                });
            }
        } catch (error) {
            console.error('Error fetching designs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter pages based on search
    const filteredPages = designPages.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.sections.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-md bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <FiLayout className="text-red-600 dark:text-red-400" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Design Management
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Customize website sections and content
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    icon={FiLayers} 
                    label="Total Pages" 
                    value={designPages.length}
                    color="text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                />
                <StatCard 
                    icon={FiFileText} 
                    label="Total Sections" 
                    value={designPages.reduce((acc, p) => acc + p.sections.length, 0)}
                    color="text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                />
                <StatCard 
                    icon={FiImage} 
                    label="Design Configs" 
                    value={loading ? '...' : stats.totalSections}
                    color="text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400"
                />
                <StatCard 
                    icon={FiRefreshCw} 
                    label="Last Updated" 
                    value={loading ? '...' : formatDate(stats.lastUpdated)}
                    color="text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
                />
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search pages or sections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                    <button
                        onClick={fetchDesigns}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Design Pages Grid */}
            <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Website Pages ({filteredPages.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPages.map((page) => (
                        <DesignCard key={page.id} page={page} />
                    ))}
                </div>
                
                {filteredPages.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md">
                        <FiSearch className="mx-auto text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No pages found matching "{searchQuery}"
                        </p>
                    </div>
                )}
            </div>

            {/* Quick Tips */}
            <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quick Tips
                </h3>
                <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Click on any page card to edit its sections</li>
                    <li>• Changes are saved automatically when you update content</li>
                    <li>• Use the preview feature to see changes before publishing</li>
                    <li>• All content supports both English and Bengali languages</li>
                </ul>
            </div>
        </div>
    );
};

export default DesignManagementPage;

"use client";

import React from 'react';
import Link from 'next/link';
import { FiImage, FiTarget, FiBarChart2, FiStar, FiUser, FiGlobe, FiArrowRight, FiMessageCircle } from 'react-icons/fi';

const sections = [
    {
        title: 'About Hero',
        description: 'Main banner with headline and description',
        href: '/dashboard/admin/design/about/hero',
        icon: FiImage,
        gradient: 'from-red-500 to-cyan-500'
    },
    {
        title: 'Mission & Vision',
        description: 'Company mission and vision statements',
        href: '/dashboard/admin/design/about/mission',
        icon: FiTarget,
        gradient: 'from-orange-500 to-amber-500'
    },
    {
        title: 'Statistics',
        description: 'Company stats and achievements',
        href: '/dashboard/admin/design/about/stats',
        icon: FiBarChart2,
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        title: 'Features',
        description: 'Why choose us features section',
        href: '/dashboard/admin/design/about/features',
        icon: FiStar,
        gradient: 'from-blue-500 to-indigo-500'
    },
    {
        title: 'Founder',
        description: 'Founder information and quote',
        href: '/dashboard/admin/design/about/founder',
        icon: FiUser,
        gradient: 'from-green-500 to-emerald-500'
    },
    {
        title: 'Global Reach',
        description: 'Global presence and partnerships',
        href: '/dashboard/admin/design/about/global',
        icon: FiGlobe,
        gradient: 'from-cyan-500 to-blue-500'
    },
    {
        title: 'Call to Action',
        description: 'Bottom CTA section with contact info',
        href: '/dashboard/admin/design/about/cta',
        icon: FiMessageCircle,
        gradient: 'from-rose-500 to-pink-500'
    }
];

const AboutDesignPage = () => {
    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Page Design</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all sections of the about page</p>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section) => (
                    <Link
                        key={section.href}
                        href={section.href}
                        className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.gradient} flex items-center justify-center`}>
                                <section.icon className="text-white" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{section.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{section.description}</p>
                                <div className="flex items-center gap-2 text-sm font-medium text-red-500">
                                    <span>Edit Section</span>
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AboutDesignPage;

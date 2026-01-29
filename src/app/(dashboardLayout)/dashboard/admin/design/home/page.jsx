"use client";

import React from 'react';
import Link from 'next/link';
import { FiImage, FiBook, FiCode, FiStar, FiArrowRight } from 'react-icons/fi';

const sections = [
    {
        title: 'Hero Section',
        description: 'Main banner with headline, description, and search',
        href: '/dashboard/admin/design/home/hero',
        icon: FiImage,
        gradient: 'from-red-500 to-cyan-500'
    },
    {
        title: 'Popular Courses',
        description: 'Featured courses section with stats',
        href: '/dashboard/admin/design/home/popular-course',
        icon: FiBook,
        gradient: 'from-orange-500 to-amber-500'
    },
    {
        title: 'Digital Products',
        description: 'Software and website showcase section',
        href: '/dashboard/admin/design/home/digital-products',
        icon: FiCode,
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        title: 'What We Provide',
        description: 'Features and benefits section',
        href: '/dashboard/admin/design/home/what-we-provide',
        icon: FiStar,
        gradient: 'from-blue-500 to-indigo-500'
    }
];

const HomeDesignPage = () => {
    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Home Page Design</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all sections of the home page</p>
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

export default HomeDesignPage;

"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Logo = ({ className = "", color = "#D4AF37", size = "normal", align = "center", href = "/" }) => {
    const isSmall = size === "small";
    const isLarge = size === "large";
    const alignmentClass = align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center";

    const Content = () => (
        <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className={`flex flex-col ${alignmentClass}`}
        >
            <span
                className={`${isSmall ? 'text-xl' : isLarge ? 'text-4xl' : 'text-2xl lg:text-3xl'} font-serif italic leading-none mb-1 translate-y-1`}
                style={{ color: color }}
            >
                Zayed
            </span>
            <div
                className={`${isSmall ? 'w-8' : isLarge ? 'w-16' : 'w-12'} h-[1px] opacity-30`}
                style={{ backgroundColor: color }}
            />
            <span
                className={`${isSmall ? 'text-[6px]' : isLarge ? 'text-[10px]' : 'text-[7px] lg:text-[8px]'} tracking-[0.4em] font-light uppercase mt-1 opacity-70`}
                style={{ color: color }}
            >
                DESIGNER & TRAINER
            </span>
        </motion.div>
    );

    const Styles = () => (
        <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,600&display=swap');
            .font-serif {
                font-family: 'Poppins', sans-serif;
            }
        `}</style>
    );

    if (href) {
        return (
            <Link href={href} className={`group flex flex-col ${alignmentClass} ${className}`}>
                <Content />
                <Styles />
            </Link>
        );
    }

    return (
        <div className={`group flex flex-col ${alignmentClass} ${className}`}>
            <Content />
            <Styles />
        </div>
    );
};

export default Logo;

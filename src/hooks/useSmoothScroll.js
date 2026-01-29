"use client";

import { useEffect } from 'react';

// Ultra Smooth Scroll Hook - 100% Butter Smooth
export const useSmoothScroll = () => {
    useEffect(() => {
        // Smooth scroll for anchor links
        const handleAnchorClick = (e) => {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;

            const href = target.getAttribute('href');
            if (!href || href === '#') return;

            const element = document.querySelector(href);
            if (!element) return;

            e.preventDefault();
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        };

        document.addEventListener('click', handleAnchorClick);

        return () => {
            document.removeEventListener('click', handleAnchorClick);
        };
    }, []);
};

// Custom Smooth Scroll Component with Lerp (Linear Interpolation)
export const SmoothScrollProvider = ({ children }) => {
    useEffect(() => {
        let current = 0;
        let target = 0;
        let ease = 0.08; // Lower = smoother, Higher = faster
        let rafId = null;

        const lerp = (start, end, factor) => {
            return start + (end - start) * factor;
        };

        const smoothScroll = () => {
            target = window.scrollY;
            current = lerp(current, target, ease);
            current = Math.round(current * 100) / 100; // Round for performance

            // Apply transform for smooth visual effect
            const diff = Math.abs(current - target);

            if (diff > 0.1) {
                rafId = requestAnimationFrame(smoothScroll);
            }
        };

        const handleScroll = () => {
            if (!rafId) {
                rafId = requestAnimationFrame(smoothScroll);
            }
        };

        // Initialize
        current = window.scrollY;
        target = window.scrollY;

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        };
    }, []);

    return children;
};

export default useSmoothScroll;

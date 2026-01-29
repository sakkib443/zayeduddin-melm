"use client";

import { useEffect } from 'react';

// Native Smooth Scroll - No external library needed
const SmoothScroll = ({ children }) => {
    useEffect(() => {
        // Apply smooth scroll to html
        document.documentElement.style.scrollBehavior = 'smooth';

        // Cleanup
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;

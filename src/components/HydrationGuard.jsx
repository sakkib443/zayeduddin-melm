"use client";
import { useState, useEffect } from 'react';

export default function HydrationGuard({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <>{children}</>;
}

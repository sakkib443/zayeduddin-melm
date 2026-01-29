"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MouseCursorEffect() {
    const [particles, setParticles] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Magical Palette
    const colors = ["#FFD700", "#FFB6C1", "#FF69B4", "#FFA500"];

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            if (typeof window !== 'undefined') {
                setIsMobile(window.innerWidth < 1024);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!mounted || isMobile) return;

        const createParticle = (x, y, isBurst = false) => {
            const id = Math.random().toString(36).substr(2, 9);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * (isBurst ? 8 : 4) + 2;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * (isBurst ? 60 : 20) + (isBurst ? 20 : 5);
            return { id, x, y, color, size, xDist: Math.cos(angle) * velocity, yDist: Math.sin(angle) * velocity, duration: Math.random() * 0.5 + 0.5 };
        };

        const handleMouseMove = (e) => {
            if (Math.random() > 0.9) {
                setParticles((prev) => [...prev.slice(-20), createParticle(e.clientX, e.clientY)]);
            }
        };

        const handleClick = (e) => {
            const newParticles = Array.from({ length: 6 }).map(() => createParticle(e.clientX, e.clientY, true));
            setParticles((prev) => [...prev.slice(-40), ...newParticles]);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleClick);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick);
        };
    }, [isMobile, mounted]);

    const removeParticle = (id) => setParticles((prev) => prev.filter((p) => p.id !== id));

    // MOVED RETURN STATEMENT TO THE BOTTOM TO ENSURE ALL HOOKS LOADED
    if (!mounted || isMobile) return null;

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-[99999]" aria-hidden="true">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ x: p.x - p.size / 2, y: p.y - p.size / 2, opacity: 1, scale: 0.5 }}
                        animate={{ x: p.x + p.xDist, y: p.y + p.yDist, opacity: 0, scale: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: p.duration, ease: "easeOut" }}
                        onAnimationComplete={() => removeParticle(p.id)}
                        style={{
                            position: "absolute",
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            borderRadius: "50%",
                            boxShadow: `0 0 ${p.size}px ${p.color}`,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

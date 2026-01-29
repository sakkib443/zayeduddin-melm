"use client";

import React, { useEffect, useState } from "react";

const SnowfallBackground = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // Generate static snowflakes on mount to avoid hydration mismatch
        const flakes = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.5 + 0.3,
            size: `${Math.random() * 4 + 2}px`,
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* CSS for Snowfall Animation */}
            <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0);
          }
          50% {
             transform: translateY(50vh) translateX(20px);
          }
          100% {
            transform: translateY(100vh) translateX(-20px);
          }
        }
      `}</style>

            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute bg-white rounded-full blur-[1px]"
                    style={{
                        left: flake.left,
                        top: "-10px",
                        width: flake.size,
                        height: flake.size,
                        opacity: flake.opacity,
                        animation: `snowfall ${flake.animationDuration} linear infinite`,
                        animationDelay: flake.animationDelay,
                    }}
                />
            ))}

            {/* Foggy Overlay for "Winter" feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-red-100/20 backdrop-blur-[1px]"></div>
        </div>
    );
};

export default SnowfallBackground;

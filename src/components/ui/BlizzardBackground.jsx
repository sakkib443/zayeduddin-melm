"use client";

import React, { useEffect, useState } from "react";

const BlizzardBackground = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // Generate layered snowflakes for depth
        // 3 Layers: Far (small, slow), Mid (medium, windy), Near (large, fast)

        const farFlakes = Array.from({ length: 50 }).map((_, i) => ({
            id: `far-${i}`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 10}s`, // Slow
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.3 + 0.1,
            size: `${Math.random() * 2 + 1}px`,
            layer: "far"
        }));

        const midFlakes = Array.from({ length: 40 }).map((_, i) => ({
            id: `mid-${i}`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.5 + 0.3,
            size: `${Math.random() * 3 + 2}px`,
            layer: "mid"
        }));

        const nearFlakes = Array.from({ length: 15 }).map((_, i) => ({
            id: `near-${i}`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`, // Fast
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.4 + 0.4,
            size: `${Math.random() * 6 + 4}px`,
            layer: "near"
        }));

        setSnowflakes([...farFlakes, ...midFlakes, ...nearFlakes]);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[#eefcfc]"> {/* Very subtle ice tint base */}

            {/* Background Gradient for Depth (Ice Fog) */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 via-red-50/30 to-white/80 blur-xl"></div>

            <style jsx>{`
        @keyframes blizzard-far {
          0% { transform: translateY(-10vh) translateX(0); }
          100% { transform: translateY(110vh) translateX(-20px); }
        }
        @keyframes blizzard-mid {
           0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }
          100% { transform: translateY(110vh) translateX(-100px) rotate(180deg); }
        }
         @keyframes blizzard-near {
           0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }
          100% { transform: translateY(110vh) translateX(-300px) rotate(360deg); }
        }
      `}</style>

            {snowflakes.map((flake) => {
                let animationName;
                if (flake.layer === "far") animationName = "blizzard-far";
                else if (flake.layer === "mid") animationName = "blizzard-mid";
                else animationName = "blizzard-near";

                return (
                    <div
                        key={flake.id}
                        className="absolute bg-white rounded-full blur-[0.5px]"
                        style={{
                            left: flake.left,
                            top: "-20px",
                            width: flake.size,
                            height: flake.size,
                            opacity: flake.opacity,
                            animation: `${animationName} ${flake.animationDuration} linear infinite`,
                            animationDelay: flake.animationDelay,
                            boxShadow: "0 0 5px white" // Glow
                        }}
                    />
                );
            })}

            {/* Frost Overlay - Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(224,242,254,0.3)_100%)]"></div>
        </div>
    );
};

export default BlizzardBackground;

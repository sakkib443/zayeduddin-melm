"use client";

import React, { useEffect, useState } from "react";

const WinterLandscape = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // Intense Blizzard Generation
        const flakeCount = 100; // MORE SNOW
        const flakes = Array.from({ length: flakeCount }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`, // Fast wind
            animationDelay: `-${Math.random() * 5}s`, // Provide negative delay to start instantly
            opacity: Math.random() * 0.7 + 0.3,
            size: `${Math.random() * 4 + 2}px`,
            sway: Math.random() * 20 - 10, // Random horizontal drift variation
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* 1. Sky Background (Winter Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#b3e5fc] via-[#e1f5fe] to-white opacity-50"></div>

            {/* 2. Styles for Animations */}
            <style jsx>{`
        @keyframes blizzard-wind {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
             opacity: 1;
          }
          100% {
            transform: translateY(110vh) translateX(-250px) rotate(360deg); /* Strong Left Wind */
            opacity: 0.8;
          }
        }
        @keyframes tree-sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes tree-sway-intense {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(8deg); }
        }
      `}</style>

            {/* 3. Intense Falling Snow */}
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute bg-white rounded-full blur-[0.5px]"
                    style={{
                        left: flake.left,
                        top: "-10px",
                        width: flake.size,
                        height: flake.size,
                        opacity: flake.opacity,
                        animation: `blizzard-wind ${flake.animationDuration} linear infinite`,
                        animationDelay: flake.animationDelay,
                        boxShadow: "0 0 4px white"
                    }}
                />
            ))}

            {/* 4. Landscape Container (Bottom aligned) */}
            <div className="absolute bottom-0 left-0 w-full h-[300px] z-10">

                {/* Back Row Trees (Smaller, darker, swaying) */}
                <div className="absolute bottom-[40px] left-[5%] w-[80px] opacity-60" style={{ animation: "tree-sway 4s infinite ease-in-out" }}>
                    <TreeSVG color="#90a4ae" />
                </div>
                <div className="absolute bottom-[60px] left-[20%] w-[120px] opacity-50" style={{ animation: "tree-sway 5s infinite ease-in-out reverse" }}>
                    <TreeSVG color="#78909c" />
                </div>
                <div className="absolute bottom-[50px] right-[15%] w-[100px] opacity-60" style={{ animation: "tree-sway 4.5s infinite ease-in-out" }}>
                    <TreeSVG color="#90a4ae" />
                </div>
                <div className="absolute bottom-[30px] right-[40%] w-[70px] opacity-40" style={{ animation: "tree-sway 6s infinite ease-in-out reverse" }}>
                    <TreeSVG color="#b0bec5" />
                </div>


                {/* Front Snow Mounds (SVG Pile) */}
                <div className="absolute bottom-0 left-0 w-full">
                    <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
                        <path fill="#ffffff" fillOpacity="0.9" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Front Row Trees (Larger, more intense sway) */}
                <div className="absolute bottom-[20%] left-[-20px] text-teal-800/20" style={{ animation: "tree-sway-intense 3s infinite ease-in-out" }}>
                    {/* Big Tree Left */}
                    <svg width="150" height="200" viewBox="0 0 100 150" fill="none">
                        <path d="M50 0L20 50H40L10 100H45V150H55V100H90L60 50H80L50 0Z" fill="#b2dfdb" stroke="#80cbc4" strokeWidth="2" />
                    </svg>
                </div>

                <div className="absolute bottom-[20%] right-[-10px] text-teal-800/20" style={{ animation: "tree-sway-intense 3.5s infinite ease-in-out reverse" }}>
                    {/* Big Tree Right */}
                    <svg width="180" height="240" viewBox="0 0 100 150" fill="none">
                        <path d="M50 0L20 50H40L10 100H45V150H55V100H90L60 50H80L50 0Z" fill="#b2dfdb" stroke="#80cbc4" strokeWidth="2" />
                    </svg>
                </div>

            </div>
        </div>
    );
};

// Simple Pine Tree SVG Component
const TreeSVG = ({ color }) => (
    <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-sm">
        <path d="M50 0L20 50H40L10 100H45V150H55V100H90L60 50H80L50 0Z" fill={color} />
    </svg>
);

export default WinterLandscape;

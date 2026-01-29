"use client";

import React from "react";

const CinematicWinterBackground = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-slate-900">
            {/* 1. Cinematic Video Layer */}
            {/* Source: Pexels (Snowy Forest) - Royalty Free */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            >
                <source
                    src="https://videos.pexels.com/video-files/3195566/3195566-hd_1920_1080_25fps.mp4"
                    type="video/mp4"
                />
                {/* Fallback if video fails */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-teal-900 to-slate-900"></div>
            </video>

            {/* 2. Color Grading Overlay (Nordic Blue/Teal) */}
            <div className="absolute inset-0 bg-[#0f172a] mix-blend-overlay opacity-60"></div>

            {/* 3. Vignette (Focus on center) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.8)_100%)]"></div>

            {/* 4. Atmospheric Mist/Fog Animation */}
            <style jsx>{`
        @keyframes drift {
          0% { transform: translateX(0); opacity: 0.3; }
          50% { transform: translateX(-50px); opacity: 0.6; }
          100% { transform: translateX(0); opacity: 0.3; }
        }
      `}</style>
            <div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/20 to-transparent blur-2xl"
                style={{ animation: "drift 10s ease-in-out infinite" }}
            ></div>

            {/* 5. Additional Snow Particles (Overlaying the video for depth) */}
            {/* Reuse Blizzard logic or simple CSS snow if needed, but video has snow. 
          Let's add a light overlay to ensure movement even if video buffers. */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 animate-pulse"></div>

        </div>
    );
};

export default CinematicWinterBackground;

"use client";

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

const GlobeBackground = () => {
    const [globeReady, setGlobeReady] = useState(false);
    const globeRef = useRef();

    // Auto-rotate globe
    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.4;
            globeRef.current.controls().enableZoom = false;
            globeRef.current.pointOfView({ altitude: 2.5 });
        }
    }, [globeReady]);

    return (
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 pointer-events-none z-0">
            <div className="relative w-[600px] h-[600px] lg:w-[900px] lg:h-[900px] opacity-30">
                {/* Globe Only - No Glow */}
                <Globe
                    ref={globeRef}
                    onGlobeReady={() => setGlobeReady(true)}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundColor="rgba(0,0,0,0)"
                    showAtmosphere={false}
                    width={900}
                    height={900}
                />
            </div>
        </div>
    );
};

export default GlobeBackground;

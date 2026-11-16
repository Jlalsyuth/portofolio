'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function InteractiveBackground() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Smooth springs for cursor glow follower
  const springConfig = { damping: 30, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Subtle Animated Mesh Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-[120px] dark:from-indigo-600/20 dark:via-purple-600/15 animate-mesh-orb-1" />
      <div className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tl from-pink-500/10 via-indigo-500/10 to-transparent blur-[130px] dark:from-pink-600/15 dark:via-blue-600/10 animate-mesh-orb-2" />
      <div className="absolute bottom-[-10%] left-[25%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-transparent blur-[120px] dark:from-cyan-600/10 dark:via-indigo-900/20 animate-mesh-orb-3" />

      {/* 2. Interactive Glowing Cursor Follower */}
      {mounted && (
        <motion.div
          className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-indigo-500/15 via-purple-500/12 to-pink-500/8 dark:from-indigo-500/20 dark:via-purple-500/18 dark:to-transparent blur-[90px] opacity-75 transition-opacity"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      )}
    </div>
  );
}

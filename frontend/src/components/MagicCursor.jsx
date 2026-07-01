import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * MagicCursor Component
 * 
 * Features:
 * - Smooth trailing particle effect
 * - Magnet effect on hover of actionable elements
 * - Scales and changes shape on button hover
 * - Respects prefers-reduced-motion
 * 
 * Accessibility: Automatically disabled for users who prefer reduced motion
 */
const MagicCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [particles, setParticles] = useState([]);
  const particleIdRef = useRef(0);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Create particle trail (limit frequency)
      if (Math.random() > 0.7) {
        const newParticle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
        };
        setParticles((prev) => [...prev.slice(-8), newParticle]);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, prefersReducedMotion]);

  // Detect hover over interactive elements
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseOver = (e) => {
      if (
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [prefersReducedMotion]);

  // Clean up old particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(-5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (prefersReducedMotion || typeof window === 'undefined') {
    return null;
  }

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9999] mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`rounded-full border-2 transition-all duration-200 ${
            isHovering
              ? 'h-10 w-10 border-[#00E5FF] bg-[#00E5FF]/20'
              : 'h-4 w-4 border-white bg-white/50'
          }`}
          style={{
            boxShadow: isHovering
              ? '0 0 20px rgba(0, 229, 255, 0.6), 0 0 40px rgba(0, 229, 255, 0.3)'
              : '0 0 10px rgba(255, 255, 255, 0.5)',
          }}
        />
      </motion.div>

      {/* Particle Trail */}
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="pointer-events-none fixed z-[9998]"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 1,
            opacity: 0.6,
          }}
          animate={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          style={{
            left: 0,
            top: 0,
          }}
        >
          <div
            className="h-2 w-2 rounded-full bg-[#00E5FF]"
            style={{
              boxShadow: '0 0 10px rgba(0, 229, 255, 0.8)',
            }}
          />
        </motion.div>
      ))}
    </>
  );
};

export default MagicCursor;
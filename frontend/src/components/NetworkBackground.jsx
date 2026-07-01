import React, { useEffect, useRef, useState } from 'react';

/**
 * NetworkBackground Component
 * 
 * Animated network grid with particles that react to:
 * - Cursor proximity (nodes expand near cursor)
 * - Scanning activity (pulses during scan)
 * 
 * Uses Canvas API for performance
 * Respects prefers-reduced-motion
 */
const NetworkBackground = ({ isScanning = false }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Create network nodes
    const initNodes = () => {
      nodesRef.current = [];
      const nodeCount = Math.floor((width * height) / 25000); // Adjust density
      
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 2,
        });
      }
    };

    // Set canvas size
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initNodes();
    };
    resize();

    // Track mouse position
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections and nodes
      nodesRef.current.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Calculate distance to mouse
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = distance < 150;

        // Draw connections to nearby nodes
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx2 = otherNode.x - node.x;
          const dy2 = otherNode.y - node.y;
          const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.3;
            ctx.strokeStyle = isScanning
              ? `rgba(0, 229, 255, ${opacity * 1.5})`
              : `rgba(0, 229, 255, ${opacity})`;
            ctx.lineWidth = isScanning ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });

        // Draw node with glow
        const nodeRadius = isNearMouse ? node.radius * 2 : node.radius;
        const nodeColor = isScanning ? 'rgba(0, 229, 255, 0.9)' : 'rgba(0, 229, 255, 0.6)';

        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          nodeRadius * 3
        );
        gradient.addColorStop(0, nodeColor);
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning, prefersReducedMotion]);

  if (prefersReducedMotion) {
    // Static background for reduced motion
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#07070A] via-[#0a0a0f] to-[#07070A]" />
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(to bottom, #07070A, #0a0a0f, #07070A)' }}
      />
      {/* Vignette overlay */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at center, transparent 0%, rgba(7, 7, 10, 0.8) 100%)',
        }}
      />
    </>
  );
};

export default NetworkBackground;
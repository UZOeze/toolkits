import { useEffect, useState } from 'react';

/**
 * GoldCursor
 * A custom blinking gold arrow cursor that replaces the default system pointer.
 * Tracks mouse position and renders a gold SVG arrow with a pulsing glow effect.
 * Automatically disabled for touch devices and users who prefer reduced motion.
 */
export default function GoldCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // Disable on touch devices and reduced motion preference
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || isTouch) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.body.style.cursor = ''; // Restore default cursor on cleanup
    };
  }, []);

  return (
    <div
      className="gold-cursor-wrapper"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {/* Standard arrow shape, filled gold */}
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="gold-cursor-arrow"
      >
        <path
          d="M2 2L2 26L7.5 20.5L12 30L16 28L11.5 19L19 19L2 2Z"
          fill="#FFD700"
          stroke="#000000"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

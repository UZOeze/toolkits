import { useEffect, useRef } from 'react';

/**
 * ScorpionCursor
 * A custom animated cursor made of an IK-style connected chain of segments
 * that trails the mouse like a living scorpion — spine, tapering tail,
 * animated legs, and articulated claws — all rendered on a single
 * transparent, hardware-accelerated canvas layer.
 *
 * Disabled automatically for touch devices and users who prefer reduced motion.
 */
export default function ScorpionCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pull theme colors from CSS variables (read once — cheap)
    const rootStyle = getComputedStyle(document.documentElement);
    const cursorColor = rootStyle.getPropertyValue('--cursor-color').trim() || '#ffffff';
    const glowStrength = parseFloat(rootStyle.getPropertyValue('--glow-strength')) || 10;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Chain configuration ──────────────────────────────────────
    const SEGMENT_COUNT = 62;
    const BASE_SEGMENT_LENGTH = 5.2;
    const segmentLengths: number[] = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      // Taper: body slightly thicker/longer near head, narrowing toward tail tip
      const taper = 1 - (i / SEGMENT_COUNT) * 0.55;
      segmentLengths.push(BASE_SEGMENT_LENGTH * taper);
    }

    interface Point { x: number; y: number; }
    const points: Point[] = new Array(SEGMENT_COUNT).fill(null).map(() => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }));

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let headX = mouseX;
    let headY = mouseY;
    let lastMoveTime = performance.now();
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let speed = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTime = performance.now();
    };
    window.addEventListener('mousemove', onMove);

    let running = true;
    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running) lastTime = performance.now();
    };
    document.addEventListener('visibilitychange', onVisibility);

    let animId = 0;
    let lastTime = performance.now();

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (!running) return;
      const dt = Math.min((now - lastTime) / 16.67, 3); // normalize to ~60fps steps
      lastTime = now;

      const idle = now - lastMoveTime > 380;

      // Head easing toward mouse (organic lag)
      const ease = idle ? 0.12 : 0.35;
      headX += (mouseX - headX) * ease * Math.min(dt, 1.5);
      headY += (mouseY - headY) * ease * Math.min(dt, 1.5);

      // Idle breathing / gentle sway applied to head target
      if (idle) {
        const t = now * 0.0016;
        headX += Math.sin(t) * 0.6;
        headY += Math.cos(t * 1.3) * 0.6;
      }

      speed += ((Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY)) - speed) * 0.2;
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      points[0].x = headX;
      points[0].y = headY;

      // Distance-constraint chain solve (rope/tail physics)
      for (let i = 1; i < SEGMENT_COUNT; i++) {
        const p = points[i];
        const prev = points[i - 1];
        const dx = p.x - prev.x;
        const dy = p.y - prev.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const target = segmentLengths[i];
        const diff = (dist - target) / dist;
        p.x -= dx * diff;
        p.y -= dy * diff;
      }

      // Idle tail tip sway (independent gentle wiggle at the very end)
      if (idle) {
        const tailT = now * 0.0028;
        const tip = points[SEGMENT_COUNT - 1];
        tip.x += Math.sin(tailT) * 1.4;
        tip.y += Math.cos(tailT * 0.8) * 1.4;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const breathe = idle ? 0.85 + Math.sin(now * 0.0025) * 0.15 : 1;
      const legSwingAmp = 4 + Math.min(speed, 18) * 0.6;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = cursorColor;
      ctx.shadowBlur = glowStrength * breathe;
      ctx.strokeStyle = `rgba(255,255,255,${0.85 * breathe})`;

      // ── Legs (drawn first, beneath the spine) ──────────────────
      for (let i = 6; i < SEGMENT_COUNT - 10; i += 3) {
        const p = points[i];
        const prev = points[i - 1];
        const next = points[i + 1] || p;
        const tangentX = next.x - prev.x;
        const tangentY = next.y - prev.y;
        const tLen = Math.hypot(tangentX, tangentY) || 1;
        const nx = -tangentY / tLen;
        const ny = tangentX / tLen;

        const legPhase = now * 0.006 + i * 0.7;
        const swing = Math.sin(legPhase) * legSwingAmp * (idle ? 0.25 : 1);
        const legLen = 12 * (1 - i / SEGMENT_COUNT);

        for (const side of [1, -1]) {
          const kneeX = p.x + nx * side * legLen * 0.6 + tangentX * 0.02 * swing;
          const kneeY = p.y + ny * side * legLen * 0.6 + tangentY * 0.02 * swing;
          const footX = kneeX + nx * side * legLen * 0.7 + (swing * side * 0.3);
          const footY = kneeY + ny * side * legLen * 0.7 + Math.abs(swing) * 0.4;

          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();
        }
      }

      // ── Spine (smooth curve through points) with rib ticks ─────
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < SEGMENT_COUNT - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Rib ticks (skeleton detail) along the spine
      ctx.lineWidth = 1;
      for (let i = 2; i < SEGMENT_COUNT - 4; i += 2) {
        const p = points[i];
        const prev = points[i - 1];
        const next = points[i + 1];
        const tangentX = next.x - prev.x;
        const tangentY = next.y - prev.y;
        const tLen = Math.hypot(tangentX, tangentY) || 1;
        const nx = -tangentY / tLen;
        const ny = tangentX / tLen;
        const ribLen = 3.5 * (1 - i / SEGMENT_COUNT) + 1;
        ctx.beginPath();
        ctx.moveTo(p.x - nx * ribLen, p.y - ny * ribLen);
        ctx.lineTo(p.x + nx * ribLen, p.y + ny * ribLen);
        ctx.globalAlpha = 0.5 * breathe;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // ── Claws at the head ────────────────────────────────────
      const head = points[0];
      const neck = points[3] || points[0];
      const dirX = head.x - neck.x;
      const dirY = head.y - neck.y;
      const dLen = Math.hypot(dirX, dirY) || 1;
      const ux = dirX / dLen;
      const uy = dirY / dLen;
      const pnx = -uy;
      const pny = ux;
      const clawOpen = 6 + Math.min(speed, 14) * 0.5;

      ctx.lineWidth = 1.6;
      for (const side of [1, -1]) {
        const baseX = head.x + pnx * side * 3;
        const baseY = head.y + pny * side * 3;
        const armX = baseX + ux * 14 + pnx * side * clawOpen;
        const armY = baseY + uy * 14 + pny * side * clawOpen;
        const pincerAX = armX + ux * 6 + pnx * side * 6;
        const pincerAY = armY + uy * 6 + pny * side * 6;
        const pincerBX = armX + ux * 9 - pnx * side * 2;
        const pincerBY = armY + uy * 9 - pny * side * 2;

        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(armX, armY, pincerAX, pincerAY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(armX, armY);
        ctx.quadraticCurveTo((armX + pincerBX) / 2, (armY + pincerBY) / 2, pincerBX, pincerBY);
        ctx.stroke();
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(draw);

    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = 'none';

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      document.body.style.cursor = prevCursor;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="scorpion-cursor-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999999,
        transform: 'translate3d(0,0,0)',
      }}
      aria-hidden="true"
    />
  );
}

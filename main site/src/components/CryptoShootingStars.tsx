import { useEffect, useRef } from 'react';

/**
 * CryptoShootingStars
 * Adds a premium ambient layer of glowing crypto/forex symbols that streak
 * across the screen like shooting stars, plus subtle drifting particles.
 * Purely decorative (pointer-events: none) and painted on a fully
 * transparent canvas so the existing site background is never altered.
 */

interface SymbolDef {
  text: string;
  color: string;
}

const CRYPTO_SYMBOLS: SymbolDef[] = [
  { text: '₿ BTC', color: '#FFD700' },
  { text: 'Ξ ETH', color: '#C7C7D6' },
  { text: '◎ SOL', color: '#B48CFF' },
  { text: '◈ BNB', color: '#F3BA2F' },
  { text: 'Ð DOGE', color: '#E8C97A' },
  { text: 'Ł LTC', color: '#BFC7D5' },
  { text: '✕ XRP', color: '#6FA8FF' },
  { text: 'ADA', color: '#5FD3FF' },
  { text: 'AVAX', color: '#FF6E6E' },
  { text: 'LINK', color: '#5B8DEF' },
  { text: 'DOT', color: '#E86FD0' },
  { text: 'TRX', color: '#FF7A5C' },
  { text: 'ARB', color: '#8FB6FF' },
  { text: 'OP', color: '#FF6B6B' },
  { text: 'PEPE', color: '#8DE38D' },
  { text: 'SHIB', color: '#FF9E5C' },
  { text: 'SUI', color: '#7FE0E0' },
  { text: 'APT', color: '#7FCFFF' },
  { text: 'TON', color: '#6FC8FF' },
  { text: 'NEAR', color: '#E8E8E8' },
  { text: 'MATIC', color: '#B79CFF' },
  { text: 'ATOM', color: '#B9A6FF' },
  { text: 'FIL', color: '#8FD0FF' },
  { text: 'INJ', color: '#C9CFFF' },
  { text: 'TIA', color: '#C79CFF' },
  { text: 'RUNE', color: '#7FE3C0' },
  { text: 'FET', color: '#8FE3D8' },
  { text: 'SEI', color: '#EDEDED' },
  { text: 'ICP', color: '#8FC5FF' },
];

const FOREX_SYMBOLS: SymbolDef[] = [
  { text: 'EUR/USD', color: '#7FE8FF' },
  { text: 'GBP/USD', color: '#7FE8FF' },
  { text: 'USD/JPY', color: '#7FE8FF' },
  { text: 'USD/CHF', color: '#7FE8FF' },
  { text: 'AUD/USD', color: '#7FE8FF' },
  { text: 'NZD/USD', color: '#7FE8FF' },
  { text: 'EUR/GBP', color: '#7FE8FF' },
  { text: 'EUR/JPY', color: '#7FE8FF' },
  { text: 'GBP/JPY', color: '#7FE8FF' },
  { text: 'USD/CAD', color: '#7FE8FF' },
  { text: 'AUD/JPY', color: '#7FE8FF' },
  { text: 'XAU/USD', color: '#FFD700' },
  { text: 'XAG/USD', color: '#E6E6E6' },
  { text: 'US30', color: '#9FD9FF' },
  { text: 'NAS100', color: '#9FD9FF' },
  { text: 'SPX500', color: '#9FD9FF' },
  { text: 'GER40', color: '#9FD9FF' },
  { text: 'UK100', color: '#9FD9FF' },
];

const ALL_SYMBOLS: SymbolDef[] = [...CRYPTO_SYMBOLS, ...FOREX_SYMBOLS];

export default function CryptoShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const particleOpacityMax = parseFloat(rootStyle.getPropertyValue('--particle-opacity')) || 0.22;
    const shootingSpeedScale = parseFloat(rootStyle.getPropertyValue('--shooting-speed')) || 1;

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

    // ── Shooting stars ──────────────────────────────────────────
    interface Star {
      x: number; y: number;
      vx: number; vy: number;
      baseVx: number; baseVy: number;
      symbol: string; color: string;
      size: number;
      rotation: number; rotationSpeed: number;
      life: number; maxLife: number;
      trail: { x: number; y: number }[];
      brightBoost: number;
    }

    const stars: Star[] = [];
    const MAX_STARS = reduceMotion ? 3 : 9;

    function spawnStar(): Star {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const fromLeft = Math.random() > 0.5;
      const startX = fromLeft ? -40 : Math.random() * w;
      const startY = fromLeft ? Math.random() * h * 0.6 : -40;
      const speed = (0.35 + Math.random() * 0.55) * shootingSpeedScale * (reduceMotion ? 0.3 : 1);
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // diagonal down-right-ish
      const def = ALL_SYMBOLS[Math.floor(Math.random() * ALL_SYMBOLS.length)];
      const vx = Math.cos(angle) * speed * 60;
      const vy = Math.sin(angle) * speed * 60;
      return {
        x: startX,
        y: startY,
        vx, vy,
        baseVx: vx, baseVy: vy,
        symbol: def.text,
        color: def.color,
        size: 11 + Math.random() * 10,
        rotation: angle,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        life: 0,
        maxLife: 6 + Math.random() * 5,
        trail: [],
        brightBoost: 0,
      };
    }

    for (let i = 0; i < (reduceMotion ? 2 : 5); i++) {
      const s = spawnStar();
      s.life = Math.random() * s.maxLife * 0.5;
      stars.push(s);
    }

    // ── Ambient drifting particles ──────────────────────────────
    interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; }
    const particles: Particle[] = [];
    const PARTICLE_COUNT = reduceMotion ? 12 : 40;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 1.6 + 0.5,
        opacity: Math.random() * particleOpacityMax,
      });
    }

    // ── Click ripple + burst effects ─────────────────────────────
    interface Ripple { x: number; y: number; radius: number; alpha: number; }
    interface Burst { x: number; y: number; vx: number; vy: number; life: number; }
    const ripples: Ripple[] = [];
    const bursts: Burst[] = [];

    let mouseX = -9999;
    let mouseY = -9999;
    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onClick = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, radius: 2, alpha: 0.6 });
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI * 2 * i) / 8;
        bursts.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * (1.5 + Math.random()),
          vy: Math.sin(a) * (1.5 + Math.random()),
          life: 0,
        });
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('click', onClick);

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
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Particles (subtle drifting dust/sparkles)
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shooting stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.life += dt;

        // Cursor proximity scatter
        const dx = s.x - mouseX;
        const dy = s.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          const force = (1 - dist / 110) * 90;
          s.vx += (dx / (dist || 1)) * force * dt;
          s.vy += (dy / (dist || 1)) * force * dt;
          s.brightBoost = Math.min(s.brightBoost + dt * 4, 1);
        } else {
          // ease back to base trajectory
          s.vx += (s.baseVx - s.vx) * Math.min(dt * 2, 1);
          s.vy += (s.baseVy - s.vy) * Math.min(dt * 2, 1);
          s.brightBoost = Math.max(s.brightBoost - dt * 2, 0);
        }

        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rotation += s.rotationSpeed * dt;

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 14) s.trail.shift();

        const lifeRatio = s.life / s.maxLife;
        let alpha = 1;
        if (lifeRatio < 0.15) alpha = lifeRatio / 0.15;
        else if (lifeRatio > 0.75) alpha = Math.max(0, (1 - lifeRatio) / 0.25);
        const brightness = 1 + s.brightBoost * 0.6;

        // Trail (ghost symbols fading out)
        for (let t = 0; t < s.trail.length; t++) {
          const tp = s.trail[t];
          const trailAlpha = (t / s.trail.length) * alpha * 0.35;
          if (trailAlpha <= 0.01) continue;
          ctx.save();
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = s.color;
          ctx.font = `${s.size * 0.7}px 'Segoe UI', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(s.symbol, tp.x, tp.y);
          ctx.restore();
        }

        // Head symbol with glow
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation * 0.15);
        ctx.globalAlpha = alpha;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12 * brightness;
        ctx.fillStyle = s.color;
        ctx.font = `${s.size * brightness}px 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.symbol, 0, 0);
        ctx.restore();

        // Remove if expired or far off-screen
        if (s.life > s.maxLife || s.x > w + 150 || s.y > h + 150 || s.x < -150) {
          stars.splice(i, 1);
        }
      }

      // Maintain a balanced pool, spawn gradually (never all at once)
      if (stars.length < MAX_STARS && Math.random() < (reduceMotion ? 0.003 : 0.012)) {
        stars.push(spawnStar());
      }

      // Click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 90 * dt;
        r.alpha -= dt * 2.2;
        if (r.alpha <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,215,0,${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Click particle bursts
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.life += dt;
        b.x += b.vx * dt * 60;
        b.y += b.vy * dt * 60;
        if (b.life > 0.5) { bursts.splice(i, 1); continue; }
        const bAlpha = 1 - b.life / 0.5;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,215,0,${bAlpha})`;
        ctx.arc(b.x, b.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="crypto-stars-canvas fixed inset-0 z-[-1] pointer-events-none"
      style={{ transform: 'translate3d(0,0,0)' }}
      aria-hidden="true"
    />
  );
}

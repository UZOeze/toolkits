import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
    }

    const particles: Particle[] = [];
    const maxParticles = 60;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -Math.random() * 0.8 - 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        life: Math.random() * 100,
      });
    }

    let animId: number;
    let scrollY = 0;
    const handleScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', handleScroll);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life += 1;

        if (p.y < -10 || p.life > 300) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.life = 0;
          p.opacity = Math.random() * 0.5 + 0.2;
        }

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(184, 134, 11, ${p.opacity * 0.55})`);
        gradient.addColorStop(1, 'rgba(184, 134, 11, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gold glow waves
      const time = Date.now() * 0.001;
      for (let i = 0; i < 3; i++) {
        const y = (canvas.height * 0.3) + Math.sin(time + i * 2) * 50 + (scrollY * 0.1);
        const waveGradient = ctx.createRadialGradient(
          canvas.width / 2 + Math.sin(time + i) * 200, y, 0,
          canvas.width / 2, y, 400
        );
        waveGradient.addColorStop(0, 'rgba(184, 134, 11, 0.02)');
        waveGradient.addColorStop(1, 'rgba(184, 134, 11, 0)');
        ctx.fillStyle = waveGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-[-2]"
        style={{
          backgroundImage: 'url(https://plain-weur-prod-public.komododecks.com/202606/16/ksMQSOHR9jsVncAmlizZ/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.5) saturate(0.85)',
        }}
      />
      <div className="fixed inset-0 z-[-1] bg-black/85" />
      <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />
    </>
  );
}

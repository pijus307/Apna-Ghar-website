import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  hue: number;
}

export const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const points: Point[] = [];
    const mouse = { x: width / 2, y: height / 2, moved: false };
    let globalHue = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      } else {
        return;
      }

      mouse.x = clientX;
      mouse.y = clientY;
      mouse.moved = true;

      // Spawn particles on mouse move with continuous RGB hue shifting
      const count = 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.2;
        points.push({
          x: clientX + (Math.random() - 0.5) * 6,
          y: clientY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          size: Math.random() * 7 + 4,
          alpha: 1,
          maxLife: Math.random() * 25 + 20,
          life: 0,
          hue: (globalHue + i * 20) % 360,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Continuously cycle hue angle smoothly across the RGB spectrum
      globalHue = (globalHue + 2.5) % 360;

      // Draw smooth ribbon connecting recent trail points
      if (points.length > 2) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const xc = (points[i].x + points[i + 1].x) / 2;
          const yc = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }

        // Rainbow gradient stroke transitioning smoothly through RGB spectrum
        const gradient = ctx.createLinearGradient(
          points[0].x,
          points[0].y,
          mouse.x,
          mouse.y
        );
        gradient.addColorStop(0, `hsla(${globalHue}, 100%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${(globalHue + 120) % 360}, 100%, 65%, 0.4)`);
        gradient.addColorStop(1, `hsla(${(globalHue + 240) % 360}, 100%, 70%, 0.8)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      // Render glowing RGB rainbow particles
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.hue = (p.hue + 1.5) % 360; // Smooth RGB color-cycling per particle

        const progress = p.life / p.maxLife;
        p.alpha = Math.max(0, 1 - progress);
        const currentSize = Math.max(0, p.size * (1 - progress * 0.7));

        if (p.life >= p.maxLife || p.alpha <= 0) {
          points.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);

        // Vibrant RGB glow aura
        ctx.shadowColor = `hsl(${p.hue}, 100%, 60%)`;
        ctx.shadowBlur = 10;

        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.alpha})`;
        ctx.fill();
        ctx.restore();
      }

      // Glowing cursor head indicator with live RGB color cycle
      if (mouse.moved) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${globalHue}, 100%, 65%)`;
        ctx.shadowColor = `hsl(${globalHue}, 100%, 60%)`;
        ctx.shadowBlur = 14;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 9, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${(globalHue + 180) % 360}, 100%, 70%, 0.7)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

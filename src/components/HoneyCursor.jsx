import { useEffect, useRef, useCallback } from 'react';

function drawPetal(ctx, x, y, petalR, dist, angle, alpha, color) {
  const px = x + Math.cos(angle) * dist;
  const py = y + Math.sin(angle) * dist;

  // Petal glow
  const g = ctx.createRadialGradient(px, py, 0, px, py, petalR * 1.8);
  g.addColorStop(0,   `hsla(${color.h},${color.s}%,${color.l}%,${(alpha * 0.3).toFixed(3)})`);
  g.addColorStop(1,   'transparent');
  ctx.beginPath();
  ctx.arc(px, py, petalR * 1.8, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();

  // Petal body
  ctx.beginPath();
  ctx.arc(px, py, petalR, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${color.h},${color.s}%,${color.l}%,${(alpha * 0.88).toFixed(3)})`;
  ctx.fill();
  ctx.strokeStyle = `hsla(${color.h},${color.s - 10}%,${color.l - 12}%,${(alpha * 0.45).toFixed(3)})`;
  ctx.lineWidth = 0.7;
  ctx.stroke();
}

export default function HoneyCursor() {
  const canvasRef = useRef(null);
  const loopRef   = useRef(null);
  const stateRef  = useRef({
    mouse:    { x: -999, y: -999 },
    bloom:    0,
    angle:    0,
    ripples:  [],
    particles: [],
    hovering: false,
    raf:      null,
  });

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  const isHoverable = useCallback((el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    if (['a', 'button'].includes(tag)) return true;
    const cls = el.className || '';
    if (typeof cls === 'string' &&
      (cls.includes('hotspot') || cls.includes('btn') ||
       cls.includes('info-card') || cls.includes('path-step') ||
       cls.includes('timeline-step') || cls.includes('fly-in-option') ||
       cls.includes('hotspot-tag'))) return true;
    return false;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    const s = stateRef.current;

    function loop() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx  = canvas.getContext('2d');
      const time = performance.now() * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = s.mouse.x;
      const my = s.mouse.y;
      if (mx < -900) {
        s.raf = requestAnimationFrame(loopRef.current);
        return;
      }

      // ── Bloom ─────────────────────────────────────────────────
      const targetBloom = s.hovering ? 1 : 0.32;
      s.bloom += (targetBloom - s.bloom) * 0.075;
      const b = s.bloom;

      s.angle += s.hovering ? 0.007 : 0.002;

      // ── Ripples ───────────────────────────────────────────────
      s.ripples = s.ripples.filter(r => r.alpha > 0.01);
      for (const r of s.ripples) {
        r.radius += 2;
        r.alpha  *= 0.9;
        ctx.beginPath();
        ctx.arc(mx, my, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(181,122,18,${r.alpha.toFixed(3)})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      // ── Floating particles on full hover ──────────────────────
      if (s.hovering && Math.random() < 0.18) {
        const a  = Math.random() * Math.PI * 2;
        const rd = 14 + Math.random() * 20;
        s.particles.push({
          x:    mx + Math.cos(a) * rd,
          y:    my + Math.sin(a) * rd,
          vx:   (Math.random() - 0.5) * 0.7,
          vy:   -0.5 - Math.random() * 0.8,
          life: 1,
          r:    1.2 + Math.random() * 1.8,
          h:    40 + Math.random() * 18,
        });
      }

      s.particles = s.particles.filter(p => p.life > 0);
      for (const p of s.particles) {
        p.life -= 0.03;
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   += 0.012;
        const a = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},90%,65%,${a.toFixed(3)})`;
        ctx.fill();
      }

      // ── Outer ambient glow ────────────────────────────────────
      const glowR = 24 + b * 40;
      const glow  = ctx.createRadialGradient(mx, my, 0, mx, my, glowR);
      glow.addColorStop(0,   `rgba(239,196,90,${(b * 0.2).toFixed(3)})`);
      glow.addColorStop(0.5, `rgba(181,122,18,${(b * 0.08).toFixed(3)})`);
      glow.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(mx, my, glowR, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // ── Outer petals (6) ──────────────────────────────────────
      const petalR = 4 + b * 10;
      const petalD = 6 + b * 16;
      const outerColor = { h: 46, s: 92, l: 68 };

      for (let i = 0; i < 6; i++) {
        drawPetal(
          ctx, mx, my, petalR, petalD,
          s.angle + (Math.PI / 3) * i,
          b, outerColor
        );
      }

      // ── Inner petals (6) offset — only when blooming ──────────
      if (b > 0.4) {
        const ib    = (b - 0.4) / 0.6;
        const innerColor = { h: 38, s: 88, l: 60 };
        for (let i = 0; i < 6; i++) {
          drawPetal(
            ctx, mx, my,
            petalR * 0.52,
            petalD * 0.55,
            s.angle + Math.PI / 6 + (Math.PI / 3) * i,
            ib * 0.85,
            innerColor
          );
        }
      }

      // ── Centre disc ───────────────────────────────────────────
      const centreR = 3 + b * 5.5;

      // Centre glow
      const cg = ctx.createRadialGradient(mx, my, 0, mx, my, centreR * 2);
      cg.addColorStop(0,   `rgba(255,220,80,${(b * 0.55).toFixed(3)})`);
      cg.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(mx, my, centreR * 2, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      // Centre fill
      ctx.beginPath();
      ctx.arc(mx, my, centreR, 0, Math.PI * 2);
      ctx.fillStyle   = `rgba(181,108,14,${(0.5 + b * 0.5).toFixed(3)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,200,60,${(b * 0.8).toFixed(3)})`;
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Centre highlight
      ctx.beginPath();
      ctx.arc(mx - centreR * 0.28, my - centreR * 0.28, centreR * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,245,180,${(b * 0.7).toFixed(3)})`;
      ctx.fill();

      // ── Stem ──────────────────────────────────────────────────
      const stemLen = 10 + b * 18;
      const stemY   = my + centreR + 1;

      ctx.beginPath();
      ctx.moveTo(mx, stemY);
      ctx.quadraticCurveTo(
        mx + b * 6,
        stemY + stemLen * 0.5,
        mx + b * 3,
        stemY + stemLen
      );
      ctx.strokeStyle = `rgba(90,110,50,${(0.3 + b * 0.5).toFixed(3)})`;
      ctx.lineWidth   = 1.6;
      ctx.stroke();

      // Leaf
      if (b > 0.25) {
        const la  = (b - 0.25) / 0.75;
        const ly  = stemY + stemLen * 0.5;
        const lx  = mx + b * 4;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(0.6);
        ctx.beginPath();
        ctx.ellipse(0, 0, 6 * la, 3 * la, 0, 0, Math.PI * 2);
        ctx.fillStyle   = `rgba(90,120,50,${(la * 0.6).toFixed(3)})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(70,100,40,${(la * 0.4).toFixed(3)})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
        ctx.restore();
      }

      // ── Orbit ring on full hover ──────────────────────────────
      if (b > 0.65) {
        const ra = (b - 0.65) / 0.35;
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(time * 0.35);
        ctx.beginPath();
        ctx.arc(0, 0, 52, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(181,122,18,${(ra * 0.15).toFixed(3)})`;
        ctx.lineWidth   = 1;
        ctx.setLineDash([3, 10]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      s.raf = requestAnimationFrame(loopRef.current);
    }

    loopRef.current = loop;
    s.raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      s.mouse.x = e.clientX;
      s.mouse.y = e.clientY;

      let node  = document.elementFromPoint(e.clientX, e.clientY);
      let found = false;
      for (let i = 0; i < 5 && node; i++) {
        if (isHoverable(node)) { found = true; break; }
        node = node.parentElement;
      }

      if (found && !s.hovering) {
        s.hovering = true;
        s.ripples.push({ radius: 10, alpha: 0.65 });
        s.ripples.push({ radius: 4,  alpha: 0.4  });
      } else if (!found && s.hovering) {
        s.hovering = false;
      }
    };

    const onLeave = () => {
      s.mouse.x  = -999;
      s.mouse.y  = -999;
      s.hovering = false;
    };

    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('resize',     resize);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(s.raf);
    };
  }, [resize, isHoverable]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:          0,
        zIndex:         9999,
        pointerEvents: 'none',
        width:          '100%',
        height:         '100%',
      }}
      aria-hidden="true"
    />
  );
}
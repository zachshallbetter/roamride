// RoamRide v3 — Rewritten card stack with rich motion

/* ── Multi-value spring ── */
function useSpring3(target, config = {}) {
  const { stiffness = 180, damping = 24, mass = 1 } = config;
  const [val, setVal] = React.useState(target);
  const ref = React.useRef({ val: target, vel: 0, target });
  React.useEffect(() => {
    ref.current.target = target;
    let raf, last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.064); last = now;
      const s = ref.current;
      const f = -stiffness * (s.val - s.target) - damping * s.vel;
      s.vel += (f / mass) * dt; s.val += s.vel * dt;
      if (Math.abs(s.val - s.target) < 0.001 && Math.abs(s.vel) < 0.001) {
        s.val = s.target; s.vel = 0; setVal(s.target); return;
      }
      setVal(s.val); raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, stiffness, damping, mass]);
  return val;
}

/* ── Pressable ── */
function Press({ children, onTap, scale = 0.96, style = {}, disabled, className }) {
  const [p, setP] = React.useState(false);
  const s = useSpring3(p ? scale : 1, { stiffness: 400, damping: 28 });
  return (
    <div className={className}
      onPointerDown={() => !disabled && setP(true)}
      onPointerUp={() => { setP(false); if (!disabled && onTap) onTap(); }}
      onPointerLeave={() => setP(false)} onPointerCancel={() => setP(false)}
      style={{ transform: `scale(${s})`, cursor: disabled ? 'default' : 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none', ...style }}
    >{children}</div>
  );
}

/* ── Improved Card Stack ── */
function CardStack({ cards, onSwipeRight, onSwipeLeft, onTap, renderCard }) {
  const [dragState, setDragState] = React.useState({ active: false, x: 0, y: 0 });
  const [exit, setExit] = React.useState(null); // { dir, startTime }
  const [nudged, setNudged] = React.useState(false);
  const [idle, setIdle] = React.useState(0); // for breathing
  const startRef = React.useRef(null);
  const velRef = React.useRef({ vx: 0, lastX: 0, lastT: 0 });
  const moved = React.useRef(false);

  // Idle breathing for top card
  React.useEffect(() => {
    let raf;
    const tick = () => { setIdle(performance.now()); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Teach-by-nudge: after 1.5s idle, nudge card right then back
  const nudgeTimer = React.useRef(null);
  React.useEffect(() => {
    if (nudged || dragState.active || exit) return;
    nudgeTimer.current = setTimeout(() => setNudged(true), 1800);
    return () => clearTimeout(nudgeTimer.current);
  }, [cards[0]?.id, dragState.active, exit]);

  // Spring targets
  const isExiting = !!exit;
  const exitX = exit ? (exit.dir === 'right' ? 450 : -450) : 0;
  const exitY = exit ? (exit.dir === 'right' ? -40 : -30) : 0;
  const exitRot = exit ? (exit.dir === 'right' ? 18 : -18) : 0;

  const nudgeX = (!dragState.active && !exit && nudged) ? 30 : 0;

  const targetX = dragState.active ? dragState.x : (isExiting ? exitX : nudgeX);
  const targetY = dragState.active ? dragState.y * 0.25 : (isExiting ? exitY : 0);

  const sx = useSpring3(targetX, {
    stiffness: dragState.active ? 999 : isExiting ? 160 : 280,
    damping: dragState.active ? 999 : isExiting ? 20 : 32
  });
  const sy = useSpring3(targetY, {
    stiffness: dragState.active ? 999 : isExiting ? 160 : 280,
    damping: dragState.active ? 999 : isExiting ? 20 : 32
  });

  // Reset nudge after spring settles
  React.useEffect(() => {
    if (nudged && !dragState.active && !exit) {
      const t = setTimeout(() => setNudged(false), 400);
      return () => clearTimeout(t);
    }
  }, [nudged, dragState.active, exit]);

  const rot = sx * 0.05;
  const opa = isExiting ? Math.max(0, 1 - Math.abs(sx) / 400) : 1;

  // Swipe thresholds
  const rightPct = Math.min(1, Math.max(0, sx / 90));
  const leftPct = Math.min(1, Math.max(0, -sx / 90));

  // Pointer handlers
  const onDown = (e) => {
    startRef.current = { x: e.clientX, y: e.clientY };
    velRef.current = { vx: 0, lastX: e.clientX, lastT: Date.now() };
    moved.current = false;
    setDragState({ active: true, x: 0, y: 0 });
    setNudged(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved.current = true;
    const now = Date.now();
    const dt = Math.max(1, now - velRef.current.lastT);
    velRef.current.vx = (e.clientX - velRef.current.lastX) / dt * 1000;
    velRef.current.lastX = e.clientX; velRef.current.lastT = now;
    setDragState({ active: true, x: dx, y: dy });
  };
  const onUp = () => {
    if (!startRef.current) return;
    const { x } = dragState;
    const vx = velRef.current.vx;
    let dir = null;
    if (x > 70 || vx > 350) dir = 'right';
    else if (x < -70 || vx < -350) dir = 'left';

    setDragState({ active: false, x: 0, y: 0 });
    startRef.current = null;

    if (dir) {
      setExit({ dir });
      setTimeout(() => {
        setExit(null);
        if (dir === 'right') onSwipeRight?.(cards[0]);
        else onSwipeLeft?.(cards[0]);
      }, 380);
    } else if (!moved.current) {
      onTap?.(cards[0]);
    }
  };
  const onCancel = () => {
    setDragState({ active: false, x: 0, y: 0 }); startRef.current = null;
  };

  if (!cards || !cards.length) return null;

  // Breathing offset for top card
  const breathe = Math.sin(idle / 1200) * 2;

  // Background card layout: fanned, rotated, offset
  const bgLayouts = [
    { scale: 0.94, y: 12, rot: -2.5, opa: 0.7 },
    { scale: 0.88, y: 24, rot: 2, opa: 0.45 },
  ];

  // When top card is being dragged/exiting, background cards spring up
  const dragProgress = Math.min(1, Math.abs(sx) / 200);
  const promote = isExiting ? 1 : dragProgress;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* BG cards */}
      {cards.slice(1, 3).reverse().map((card, ri) => {
        const idx = cards.slice(1, 3).length - ri - 1; // 0 = next, 1 = after
        const layout = bgLayouts[idx] || bgLayouts[1];
        const promoteTo = idx === 0 ? { scale: 1, y: breathe, rot: 0, opa: 1 } : bgLayouts[0];
        const sc = layout.scale + (promoteTo.scale - layout.scale) * promote * 0.6;
        const ty = layout.y + (promoteTo.y - layout.y) * promote * 0.6;
        const r = layout.rot + (promoteTo.rot - layout.rot) * promote * 0.6;
        const o = layout.opa + (promoteTo.opa - layout.opa) * promote * 0.5;

        return (
          <div key={card.id + '_bg'} style={{
            position: 'absolute', inset: 0,
            transform: `scale(${sc}) translateY(${ty}px) rotate(${r}deg)`,
            opacity: o, pointerEvents: 'none', borderRadius: 28, overflow: 'hidden',
            transition: dragState.active ? 'none' : 'all 0.35s cubic-bezier(.4,0,.2,1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            {renderCard(card, false)}
          </div>
        );
      })}

      {/* Top card */}
      <div
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel}
        style={{
          position: 'absolute', inset: 0,
          transform: `translateX(${sx}px) translateY(${sy + (dragState.active || isExiting ? 0 : breathe)}px) rotate(${rot + (isExiting ? exitRot * (Math.abs(sx) / 450) : 0)}deg)`,
          opacity: opa, touchAction: 'none', borderRadius: 28, overflow: 'hidden',
          boxShadow: dragState.active
            ? `0 20px 60px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.04)`
            : '0 12px 48px rgba(0,0,0,0.14)',
          transition: dragState.active ? 'box-shadow 0.15s ease' : (isExiting ? 'none' : 'box-shadow 0.3s ease'),
          zIndex: 10,
        }}
      >
        {renderCard(cards[0], true, { parallax: sx })}

        {/* Right edge glow (unlock) */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%',
          background: `linear-gradient(to left, rgba(42,191,94,${rightPct * 0.5}), transparent)`,
          pointerEvents: 'none', opacity: rightPct > 0.05 ? 1 : 0,
          transition: dragState.active ? 'none' : 'opacity 0.2s ease',
        }} />
        {/* Unlock badge */}
        <div style={{
          position: 'absolute', top: '42%', right: 20,
          transform: `scale(${0.5 + rightPct * 0.5}) translateX(${(1 - rightPct) * 20}px)`,
          opacity: rightPct > 0.15 ? rightPct : 0,
          pointerEvents: 'none',
          transition: dragState.active ? 'none' : 'all 0.25s ease',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.97)', borderRadius: 20, padding: '12px 18px',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 8px 28px rgba(42,191,94,0.3)',
          }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M11 2L4 11h5l-1 7 7-9h-5l1-7z" fill="#2ABF5E"/></svg>
            <span style={{ fontSize: 15, fontWeight: 800, fontFamily: C.font, color: '#2ABF5E', letterSpacing: -0.3 }}>UNLOCK</span>
          </div>
        </div>

        {/* Left edge glow (skip) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '40%',
          background: `linear-gradient(to right, rgba(0,0,0,${leftPct * 0.35}), transparent)`,
          pointerEvents: 'none', opacity: leftPct > 0.05 ? 1 : 0,
          transition: dragState.active ? 'none' : 'opacity 0.2s ease',
        }} />
        <div style={{
          position: 'absolute', top: '42%', left: 20,
          transform: `scale(${0.5 + leftPct * 0.5}) translateX(${(1 - leftPct) * -20}px)`,
          opacity: leftPct > 0.15 ? leftPct : 0,
          pointerEvents: 'none',
          transition: dragState.active ? 'none' : 'all 0.25s ease',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.92)', borderRadius: 20, padding: '12px 18px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}>
            <span style={{ fontSize: 15, fontWeight: 800, fontFamily: C.font, color: '#aaa' }}>SKIP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Particle burst ── */
function Burst({ active, color = '#FF6B35' }) {
  const [particles, setParticles] = React.useState([]);
  React.useEffect(() => {
    if (!active) return;
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i, angle: (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
      dist: 50 + Math.random() * 100, size: 3 + Math.random() * 7,
      delay: Math.random() * 120,
      color: ['#2ABF5E', '#FBBF24', color, '#FF4E6B', '#3B82F6'][i % 5],
    }));
    setParticles(p);
    const t = setTimeout(() => setParticles([]), 1000);
    return () => clearTimeout(t);
  }, [active]);
  if (!particles.length) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 99 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: '50%', top: '45%',
          width: p.size, height: p.size, borderRadius: p.size,
          background: p.color,
          animation: `burstParticle 0.8s cubic-bezier(.2,0,.2,1) ${p.delay}ms forwards`,
          '--bx': `${Math.cos(p.angle) * p.dist}px`,
          '--by': `${Math.sin(p.angle) * p.dist}px`,
        }} />
      ))}
    </div>
  );
}

/* ── Animated counter ── */
function AnimNum({ value, prefix = '', suffix = '', style = {} }) {
  const [display, setDisplay] = React.useState(value);
  const ref = React.useRef({ start: value, target: value, t0: 0 });
  React.useEffect(() => {
    if (value === ref.current.target) return;
    ref.current.start = display; ref.current.target = value; ref.current.t0 = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - ref.current.t0) / 600);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(ref.current.start + (ref.current.target - ref.current.start) * ease));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span style={style}>{prefix}{display}{suffix}</span>;
}

Object.assign(window, { useSpring3, Press, CardStack, Burst, AnimNum });

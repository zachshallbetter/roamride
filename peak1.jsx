// RoamRide v5.1 — Enhanced Peak 1: Richer vibe calibration
// Ambient particles, better bubble physics, richer loading, gesture hints

const VIBES = [
  { id: 'water', label: 'Get on the water', emoji: '🌊', color: '#38BDF8', x: 15, y: 18 },
  { id: 'ride', label: 'Move around', emoji: '🚲', color: '#FF6B35', x: 72, y: 12 },
  { id: 'fun', label: 'Something fun', emoji: '✨', color: '#FBBF24', x: 44, y: 5 },
  { id: 'new', label: 'Try something new', emoji: '🧪', color: '#A78BFA', x: 85, y: 30 },
  { id: 'money', label: 'Make money', emoji: '💰', color: '#2ABF5E', x: 8, y: 42 },
  { id: 'weekend', label: 'Plan a weekend', emoji: '🏕️', color: '#F97316', x: 58, y: 34 },
  { id: 'practical', label: 'Something practical', emoji: '🔧', color: '#6EE7B7', x: 78, y: 48 },
  { id: 'surprise', label: 'Surprise me', emoji: '🎲', color: '#EC4899', x: 32, y: 50 },
  { id: 'date', label: 'Date night', emoji: '🌙', color: '#8B5CF6', x: 55, y: 55 },
];

const CIRCLE_X = 50, CIRCLE_Y = 73, CIRCLE_R = 18;

/* ── Ambient floating particles ── */
function AmbientParticles({ time, selectedColors }) {
  const particles = React.useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: 3 + Math.random() * 5, speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2, opacity: 0.08 + Math.random() * 0.12,
    })), []);

  const colors = selectedColors.length > 0 ? selectedColors : ['rgba(0,0,0,0.06)'];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {particles.map((p, i) => {
        const y = (p.y + Math.sin(time / (2000 * p.speed) + p.phase) * 8) % 100;
        const x = p.x + Math.cos(time / (3000 * p.speed) + p.phase) * 5;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            width: p.size, height: p.size, borderRadius: p.size,
            background: colors[i % colors.length],
            opacity: p.opacity,
          }} />
        );
      })}
    </div>
  );
}

/* ── Vibe Bubble (enhanced) ── */
function VibeBubble({ vibe, time, selected, onTap, captured, idx }) {
  const phase = vibe.x * 0.08 + vibe.y * 0.04 + idx * 0.7;
  const floatY = Math.sin(time / 1100 + phase) * 7;
  const floatX = Math.cos(time / 1500 + phase * 1.3) * 5;
  const wobble = selected ? Math.sin(time / 300 + phase) * 1.5 : 0;

  // Captured positions — arranged in a pleasing cluster inside circle
  const capturedOffsets = [
    { dx: -12, dy: -8 }, { dx: 10, dy: -10 }, { dx: 0, dy: 2 },
    { dx: -15, dy: 8 }, { dx: 14, dy: 6 }, { dx: -6, dy: -14 },
    { dx: 8, dy: 12 }, { dx: -10, dy: 0 }, { dx: 4, dy: -6 },
  ];
  const co = capturedOffsets[idx % capturedOffsets.length];

  return (
    <div
      onClick={() => onTap(vibe.id)}
      style={{
        position: 'absolute',
        left: `${captured ? CIRCLE_X + co.dx : vibe.x}%`,
        top: `${captured ? CIRCLE_Y + co.dy : vibe.y}%`,
        transform: `translate(-50%, calc(-50% + ${captured ? wobble : floatY}px)) translateX(${captured ? 0 : floatX}px) scale(${selected ? 1.08 : 1}${captured ? ' scale(0.82)' : ''})`,
        transition: captured
          ? `left 0.55s cubic-bezier(.25,.8,.25,1.05), top 0.55s cubic-bezier(.25,.8,.25,1.05), transform 0.3s ease`
          : 'transform 0.25s ease',
        cursor: 'pointer', zIndex: selected ? 20 : 10,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '10px 16px', borderRadius: 50,
        background: selected || captured ? vibe.color : 'rgba(255,255,255,0.93)',
        color: selected || captured ? '#fff' : C.text,
        boxShadow: selected
          ? `0 8px 28px ${vibe.color}55, 0 0 0 3px ${vibe.color}30`
          : captured
            ? `0 4px 16px ${vibe.color}44`
            : '0 3px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
        border: 'none',
        fontSize: 13, fontWeight: 700, fontFamily: C.font, whiteSpace: 'nowrap',
        backdropFilter: !selected && !captured ? 'blur(8px)' : 'none',
        transition: 'background 0.3s ease, color 0.3s ease, box-shadow 0.35s ease',
      }}>
        <span style={{ fontSize: 18, transition: 'transform 0.3s ease', transform: selected ? 'scale(1.2)' : 'scale(1)' }}>{vibe.emoji}</span>
        {vibe.label}
      </div>
      {/* Ripple on tap */}
      {selected && !captured && (
        <>
          <div style={{ position: 'absolute', inset: -8, borderRadius: 60, border: `2px solid ${vibe.color}`, opacity: 0.25, animation: 'vibeRing 1.2s ease-out infinite' }} />
          <div style={{ position: 'absolute', inset: -16, borderRadius: 70, border: `1.5px solid ${vibe.color}`, opacity: 0.12, animation: 'vibeRing 1.2s ease-out 0.3s infinite' }} />
        </>
      )}
    </div>
  );
}

/* ── Today Circle (enhanced) ── */
function TodayCircle({ count, pulsing, time }) {
  const breathe = pulsing ? Math.sin(time / 800) * 3 : 0;
  return (
    <div style={{
      position: 'absolute', left: `${CIRCLE_X}%`, top: `${CIRCLE_Y}%`,
      transform: `translate(-50%, -50%) scale(${1 + breathe * 0.005})`,
      width: `${CIRCLE_R * 2}%`, paddingBottom: `${CIRCLE_R * 2}%`,
      borderRadius: '50%',
      border: count > 0 ? `2.5px solid ${C.orange}40` : `2px dashed rgba(0,0,0,0.06)`,
      transition: 'border 0.5s ease',
      pointerEvents: 'none', zIndex: 5,
    }}>
      {count > 0 && (
        <>
          <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', background: `radial-gradient(${C.orange}18, transparent 70%)`, animation: 'breathe3 2s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: `1.5px solid ${C.orange}15`, animation: 'vibeRing 2.5s ease-out infinite' }} />
        </>
      )}
      <div style={{
        position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)',
        fontSize: 10, fontWeight: 700, color: count > 0 ? C.orange : C.text3,
        fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1,
        whiteSpace: 'nowrap', transition: 'color 0.3s ease',
      }}>
        {count > 0 ? `${count} vibes · let's go` : 'your today'}
      </div>
    </div>
  );
}

/* ── Loading sequence (enhanced) ── */
function VibeLoading({ selected, phase, loadStep, loadMessages }) {
  // Orbiting vibes around the spinner
  const selectedVibes = [...selected].map(id => VIBES.find(x => x.id === id)).filter(Boolean);
  const [time, setTime] = React.useState(0);
  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: C.bg, padding: 32, gap: 16, position: 'relative', overflow: 'hidden',
    }}>
      <ContourBG />
      <AmbientParticles time={time} selectedColors={selectedVibes.map(v => v.color + '30')} />

      {/* Central orb with orbiting vibe dots */}
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 8, zIndex: 2 }}>
        {/* Orbiting colored dots */}
        {selectedVibes.map((v, i) => {
          const angle = (i / selectedVibes.length) * Math.PI * 2 + time / 1200;
          const r = 48;
          const x = 60 + Math.cos(angle) * r;
          const y = 60 + Math.sin(angle) * r;
          return (
            <div key={v.id} style={{
              position: 'absolute', left: x - 6, top: y - 6,
              width: 12, height: 12, borderRadius: 6,
              background: v.color, boxShadow: `0 0 10px ${v.color}66`,
              transition: 'all 0.3s ease',
            }} />
          );
        })}
        {/* Center spinner/check */}
        <div style={{
          position: 'absolute', left: 30, top: 30, width: 60, height: 60, borderRadius: 30,
          background: phase === 'done' ? `linear-gradient(135deg, ${C.green}, #10B981)` : `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: phase === 'done' ? `0 8px 32px ${C.greenGlow}` : `0 8px 32px ${C.orangeGlow}`,
          transition: 'all 0.5s ease',
        }}>
          {phase === 'done'
            ? <div style={{ animation: 'popIn3 0.4s cubic-bezier(.175,.885,.32,1.275)' }}>{I.check('#fff')}</div>
            : <div style={{ width: 22, height: 22, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 11, animation: 'spin3 0.7s linear infinite' }} />
          }
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, zIndex: 2, width: '100%', maxWidth: 260 }}>
        {loadMessages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 12,
            background: i < loadStep ? `${C.green}08` : i === loadStep ? `${C.orange}08` : 'transparent',
            opacity: i < loadStep ? 1 : i === loadStep ? 0.7 : 0.15,
            transform: i <= loadStep ? 'translateX(0)' : 'translateX(10px)',
            transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 10,
              background: i < loadStep ? C.green : i === loadStep ? C.orange : C.border,
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
              boxShadow: i === loadStep ? `0 0 8px ${C.orangeGlow}` : 'none',
            }}>
              {i < loadStep && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
              {i === loadStep && <div style={{ width: 5, height: 5, borderRadius: 3, background: '#fff' }} />}
            </div>
            <span style={{ fontSize: 14, fontFamily: C.font, color: C.text, fontWeight: i < loadStep ? 600 : 400 }}>{msg}</span>
          </div>
        ))}
      </div>

      {/* Selected vibes strip */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8, zIndex: 2 }}>
        {selectedVibes.map(v => (
          <span key={v.id} style={{
            padding: '4px 10px', borderRadius: 20, background: v.color,
            fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: C.font,
            display: 'flex', alignItems: 'center', gap: 4,
            boxShadow: `0 2px 8px ${v.color}33`,
          }}>{v.emoji} {v.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ── Main Vibe Calibration (enhanced) ── */
function VibeCalibration({ onComplete }) {
  const [time, setTime] = React.useState(0);
  const [selected, setSelected] = React.useState(new Set());
  const [phase, setPhase] = React.useState('pick');
  const [loadStep, setLoadStep] = React.useState(0);

  React.useEffect(() => {
    let raf;
    const tick = () => { setTime(performance.now()); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleVibe = (id) => {
    if (phase !== 'pick') return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const loadMessages = [
    'Reading your vibe…',
    'Scanning 42 nearby assets…',
    'Matching your energy…',
    'Building your world…',
    'Ready.',
  ];

  const launch = () => {
    if (selected.size === 0) return;
    setPhase('loading');
    let s = 0;
    const iv = setInterval(() => {
      s++; setLoadStep(s);
      if (s >= 5) { clearInterval(iv); setTimeout(() => { setPhase('done'); setTimeout(() => onComplete([...selected]), 700); }, 400); }
    }, 550);
  };

  if (phase === 'loading' || phase === 'done') {
    return <VibeLoading selected={selected} phase={phase} loadStep={loadStep} loadMessages={loadMessages} />;
  }

  const selectedColors = [...selected].map(id => VIBES.find(x => x.id === id)?.color).filter(Boolean);

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', background: C.bg, paddingTop: 58 }}>
      <ContourBG />
      <AmbientParticles time={time} selectedColors={selectedColors.map(c => c + '25')} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 30, padding: '8px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 10,
            background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 3px 10px ${C.orangeGlow}`,
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1l7 5v4l-7 5-7-5V6l7-5z" fill="#fff" fillOpacity="0.9"/></svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, fontFamily: C.font, color: C.orange, letterSpacing: -0.3 }}>RoamRide</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: C.font, color: C.text, lineHeight: 1.1, letterSpacing: -0.6, margin: 0 }}>
          What do you want from<br/>the physical world today?
        </h1>
        <p style={{ fontSize: 13, fontFamily: C.font, color: C.text2, marginTop: 6, fontWeight: 500 }}>
          Tap what calls to you.
        </p>
      </div>

      {/* Bubble field */}
      <div style={{ position: 'absolute', inset: 0, top: 160, bottom: 80 }}>
        <TodayCircle count={selected.size} pulsing={selected.size > 0} time={time} />
        {VIBES.map((v, i) => (
          <VibeBubble
            key={v.id} vibe={v} time={time} idx={i}
            selected={selected.has(v.id)}
            captured={selected.has(v.id)}
            onTap={toggleVibe}
          />
        ))}
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20, zIndex: 40 }}>
        <Press onTap={launch} disabled={selected.size === 0} scale={0.97}>
          <div style={{
            background: selected.size > 0 ? `linear-gradient(135deg, ${C.orange}, ${C.orange2})` : 'rgba(0,0,0,0.06)',
            borderRadius: 50, padding: '17px', textAlign: 'center',
            color: selected.size > 0 ? '#fff' : C.text3,
            fontSize: 16, fontWeight: 750, fontFamily: C.font,
            boxShadow: selected.size > 0 ? `0 6px 24px ${C.orangeGlow}` : 'none',
            transition: 'all 0.4s cubic-bezier(.4,0,.2,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {selected.size > 0 ? <>{I.bolt()} Show me my world</> : <>Tap what calls to you</>}
          </div>
        </Press>
      </div>
    </div>
  );
}

Object.assign(window, { VIBES, VibeCalibration, AmbientParticles });

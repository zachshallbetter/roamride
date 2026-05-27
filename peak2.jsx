// RoamRide v5.1 — Enhanced Peak 2: Garage Reveal
// AR-style overlay lines, richer stagger, ghost listing hint, more objects

const GARAGE_OBJECTS = [
  { id: 'g1', label: 'E-Bike', earnings: '$120–340', demand: 'High', type: 'bike', x: 28, y: 24, delay: 0, color: '#FF6B35' },
  { id: 'g2', label: 'Camera', earnings: '$80–200', demand: 'Medium', type: 'camera', x: 72, y: 18, delay: 250, color: '#FBBF24' },
  { id: 'g3', label: 'Paddleboard', earnings: '$60–180', demand: 'Rising', type: 'paddle', x: 18, y: 44, delay: 500, color: '#38BDF8' },
  { id: 'g4', label: 'Drill Set', earnings: '$40–120', demand: 'Popular', type: 'tool', x: 76, y: 48, delay: 700, color: '#6EE7B7' },
  { id: 'g5', label: 'Cooler', earnings: '$25–75', demand: 'Weekend', type: 'cooler', x: 50, y: 58, delay: 950, color: '#A78BFA' },
  { id: 'g6', label: 'Scooter', earnings: '$90–260', demand: 'High', type: 'scooter', x: 45, y: 32, delay: 400, color: '#EC4899' },
  { id: 'g7', label: 'Camping Kit', earnings: '$55–150', demand: 'Seasonal', type: 'camp', x: 25, y: 62, delay: 1100, color: '#F97316' },
];

function EarningsTag({ obj, visible, onTap, selected, time }) {
  const float = Math.sin(time / 1200 + obj.delay * 0.003) * 3;
  const dc = obj.color;

  return (
    <div
      onClick={() => onTap(obj.id)}
      style={{
        position: 'absolute', left: `${obj.x}%`, top: `${obj.y}%`,
        transform: `translate(-50%, calc(-50% + ${visible ? float : 0}px)) scale(${visible ? (selected ? 1.1 : 1) : 0.2})`,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.6s cubic-bezier(.4,0,.2,1) ${obj.delay}ms, transform 0.6s cubic-bezier(.25,.8,.25,1.05) ${obj.delay}ms`,
        cursor: 'pointer', zIndex: selected ? 20 : 10,
      }}
    >
      {/* AR-style connecting line */}
      <div style={{
        position: 'absolute', top: '100%', left: '50%', width: 1.5, height: 24,
        background: `linear-gradient(${visible ? dc + '60' : 'transparent'}, transparent)`,
        transform: 'translateX(-50%)',
        transition: `background 0.5s ease ${obj.delay}ms`,
      }} />
      {/* Scan corner brackets */}
      {visible && (
        <div style={{ position: 'absolute', inset: -6, pointerEvents: 'none', opacity: selected ? 0.5 : 0.2, transition: 'opacity 0.3s' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 10, borderTop: `2px solid ${dc}`, borderLeft: `2px solid ${dc}`, borderRadius: '3px 0 0 0' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, borderTop: `2px solid ${dc}`, borderRight: `2px solid ${dc}`, borderRadius: '0 3px 0 0' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 10, height: 10, borderBottom: `2px solid ${dc}`, borderLeft: `2px solid ${dc}`, borderRadius: '0 0 0 3px' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderBottom: `2px solid ${dc}`, borderRight: `2px solid ${dc}`, borderRadius: '0 0 3px 0' }} />
        </div>
      )}
      {/* Card */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        padding: '12px 16px', borderRadius: 20,
        background: selected ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.88)',
        boxShadow: selected ? `0 12px 36px rgba(0,0,0,0.18), 0 0 0 2px ${dc}` : '0 6px 20px rgba(0,0,0,0.12)',
        backdropFilter: 'blur(12px)',
        border: `1.5px solid ${selected ? dc : 'rgba(255,255,255,0.35)'}`,
        transition: 'all 0.3s ease',
        minWidth: 96,
      }}>
        {DI[obj.type] ? DI[obj.type](22, dc, dc) : DI.bike(22, dc, dc)}
        <span style={{ fontSize: 11, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.2 }}>{obj.label}</span>
        <div style={{
          fontSize: 14, fontWeight: 800, fontFamily: C.font, color: C.green,
          background: `${C.green}10`, padding: '2px 8px', borderRadius: 8, letterSpacing: -0.3,
        }}>{obj.earnings}<span style={{ fontSize: 9, fontWeight: 600, color: C.text2 }}>/mo</span></div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          fontSize: 8, fontWeight: 700, color: dc, fontFamily: C.font,
          textTransform: 'uppercase', letterSpacing: 0.6,
        }}>
          <div style={{ width: 4, height: 4, borderRadius: 2, background: dc, boxShadow: `0 0 4px ${dc}66` }} />
          {obj.demand}
        </div>
      </div>
    </div>
  );
}

function GarageReveal({ onSelectItem, onBack }) {
  const [scanning, setScanning] = React.useState(true);
  const [revealed, setRevealed] = React.useState(false);
  const [scanLine, setScanLine] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [totalEst, setTotalEst] = React.useState(0);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);

  React.useEffect(() => {
    let raf; const start = performance.now();
    const tick = (now) => {
      const t = (now - start) / 2400;
      setScanLine(Math.min(1, t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else { setScanning(false); setRevealed(true); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  React.useEffect(() => {
    if (!revealed) return;
    let start = performance.now(), raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 2000);
      setTotalEst(Math.round(1590 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed]);

  const handleTap = (id) => setSelected(selected === id ? null : id);
  const selectedObj = GARAGE_OBJECTS.find(o => o.id === selected);

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', background: '#1A1714' }}>
      {/* Camera BG */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #2A2622 0%, #1C1916 50%, #1A1814 100%)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}>
          <defs><pattern id="gg" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0v30H0" fill="none" stroke="#fff" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#gg)" />
        </svg>
      </div>

      {/* Ambient particles */}
      <AmbientParticles time={time} selectedColors={revealed ? GARAGE_OBJECTS.map(o => o.color + '12') : ['rgba(255,255,255,0.02)']} />

      {/* Top bar */}
      <div style={{ position: 'absolute', top: 58, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 30 }}>
        <Press onTap={onBack} scale={0.9}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>{I.close('#fff')}</div>
        </Press>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {scanning ? (
            <><div style={{ width: 8, height: 8, borderRadius: 4, background: C.orange, animation: 'pulse3 1.5s ease-in-out infinite' }} /><span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: C.font }}>Scanning…</span></>
          ) : (
            <><Dot color={C.green} size={8} /><span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: C.font }}>Found money</span></>
          )}
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Scan line */}
      {scanning && (
        <>
          <div style={{ position: 'absolute', left: 0, right: 0, top: `${scanLine * 100}%`, height: 2, zIndex: 25, background: `linear-gradient(90deg, transparent 5%, ${C.orange}, transparent 95%)`, boxShadow: `0 0 20px ${C.orange}, 0 0 60px ${C.orange}44` }} />
          {/* Scan glow area */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: `${Math.max(0, scanLine * 100 - 15)}%`, height: '15%', zIndex: 24, background: `linear-gradient(transparent, ${C.orange}08, transparent)`, pointerEvents: 'none' }} />
        </>
      )}

      {/* Earnings tags */}
      <div style={{ position: 'absolute', inset: 0, top: 100, bottom: 90, zIndex: 15 }}>
        {GARAGE_OBJECTS.map(obj => (
          <EarningsTag key={obj.id} obj={obj} visible={revealed} onTap={handleTap} selected={selected === obj.id} time={time} />
        ))}
      </div>

      {/* Bottom panel */}
      {revealed && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
          background: 'rgba(26,23,20,0.94)', backdropFilter: 'blur(16px)',
          borderRadius: '28px 28px 0 0', padding: '18px 22px 34px',
          animation: 'sheetUp3 0.5s cubic-bezier(.4,0,.2,1)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {!selectedObj ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 }}>Total estimated earnings</div>
                  <div style={{ fontSize: 34, fontWeight: 800, color: C.green, fontFamily: C.font, letterSpacing: -1.5, lineHeight: 1 }}>${totalEst}<span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.3)' }}>/mo</span></div>
                </div>
                <div style={{ padding: '8px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: C.font }}>{GARAGE_OBJECTS.length}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>items</div>
                </div>
              </div>
              {/* Ghost listing hint */}
              <div style={{ padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                {I.scan('rgba(255,255,255,0.5)')}
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: C.font, lineHeight: 1.4 }}>
                  <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Ghost listing:</strong> We can quietly test demand before you commit.
                </div>
              </div>
              <Press onTap={() => onSelectItem(GARAGE_OBJECTS[0])} scale={0.97}>
                <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '16px', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 750, fontFamily: C.font, boxShadow: `0 6px 24px ${C.orangeGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{I.bolt()} List your first item</div>
              </Press>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${selectedObj.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${selectedObj.color}25` }}>{DI[selectedObj.type] ? DI[selectedObj.type](24, selectedObj.color, selectedObj.color) : DI.bike(24, selectedObj.color, selectedObj.color)}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: C.font }}>{selectedObj.label}</div>
                  <div style={{ fontSize: 14, color: C.green, fontWeight: 700, fontFamily: C.font }}>{selectedObj.earnings}/mo</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'wrap' }}>
                <GBadge label={`${selectedObj.demand} demand`} icon={I.fire(selectedObj.color)} variant="dark" />
                <GBadge label="3 min setup" icon={I.clock('rgba(255,255,255,0.7)')} variant="dark" />
                <GBadge label="Protected" icon={I.shield('rgba(255,255,255,0.7)')} variant="dark" />
                <GBadge label="Ghost test available" icon={I.scan('rgba(255,255,255,0.5)')} variant="dark" />
              </div>
              <Press onTap={() => onSelectItem(selectedObj)} scale={0.97}>
                <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '16px', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 750, fontFamily: C.font, boxShadow: `0 6px 24px ${C.orangeGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{I.scan()} Scan & list this</div>
              </Press>
            </>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { GARAGE_OBJECTS, GarageReveal });

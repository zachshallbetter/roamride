// RoamRide v4 — Focus overlay, Access Pass, Active Rental, Return, Scan, Stats

/* ━━━━━ FOCUS OVERLAY (item detail + unlock) ━━━━━ */
function FocusOverlay({ item, mode, onUnlock, onClose, onScan }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setShow(true))); }, []);

  const gc = { bike: ['#FF9A56','#FF6B35'], paddle: ['#34D399','#10B981'], camera: ['#FBBF24','#F59E0B'], scooter: ['#A78BFA','#7C5CE0'], tool: ['#6EE7B7','#2ABF5E'] };
  const colors = gc[item.type] || gc.bike;
  const isEarn = mode === 'earn';

  const dismiss = () => { setShow(false); setTimeout(onClose, 300); };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
      {/* Scrim */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', opacity: show ? 1 : 0, transition: 'opacity 0.3s ease' }} />
      {/* Sheet */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: C.white, borderRadius: '28px 28px 0 0',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(.32,.72,.37,1.02)',
        maxHeight: '72%', overflow: 'hidden',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
        </div>

        {isEarn ? (
          /* ── Earn detail ── */
          <div style={{ padding: '6px 22px 32px' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>{DI[item.type] ? DI[item.type](48, C.text, C.text) : DI.bike(48, C.text, C.text)}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.orange, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>{item.demand}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: C.font, letterSpacing: -0.3 }}>{item.name}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[{ l: 'Estimated', v: item.earnings }, { l: 'Suggested', v: '$18/hr' }, { l: 'Nearby', v: 'High' }].map(m => (
                <div key={m.l} style={{ flex: 1, padding: '12px 8px', borderRadius: 16, background: '#FFF2EB', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: C.text2, fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>{m.l}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.orange, fontFamily: C.font }}>{m.v}</div>
                </div>
              ))}
            </div>
            <Press onTap={() => { dismiss(); setTimeout(onScan, 350); }} scale={0.97}>
              <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '16px', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 750, fontFamily: C.font, boxShadow: `0 6px 24px ${C.orangeGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{I.scan()} Scan Yours</div>
            </Press>
          </div>
        ) : (
          /* ── Find detail ── */
          <div style={{ padding: '0 22px 32px' }}>
            {/* Color strip */}
            <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`, margin: '0 0 14px', boxShadow: `0 2px 8px ${colors[1]}33` }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
              {/* Mini image */}
              <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(145deg, ${colors[0]}, ${colors[1]})`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: `0 4px 16px ${colors[1]}33` }}>
                {DI[item.type] ? DI[item.type](28, colors[0], colors[0]) : DI.bike(28, colors[0], colors[0])}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: C.font, letterSpacing: -0.4, lineHeight: 1.1, marginBottom: 4 }}>{item.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, fontFamily: C.font, color: C.text }}>{I.star()} {item.rating}</span>
                  <span style={{ fontSize: 11, color: C.text2, fontFamily: C.font }}>{item.distance}</span>
                </div>
              </div>
            </div>

            {/* Vibe */}
            <div style={{ fontSize: 14, color: C.text2, fontFamily: C.font, marginBottom: 16, lineHeight: 1.5, fontWeight: 500 }}>"{item.vibe}"</div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[{ l: 'Price', v: item.price, c: C.orange }, { l: 'Hold', v: item.deposit, c: C.text }, { l: 'Rating', v: item.rating, c: C.gold }].map(m => (
                <div key={m.l} style={{ flex: 1, padding: '12px 8px', borderRadius: 14, background: C.bg, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: C.text2, fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.l}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: m.c, fontFamily: C.font, letterSpacing: -0.3 }}>{m.v}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 18 }}>
              {item.instant && <GBadge label="Instant access" icon={I.bolt(C.orange)} variant="orange" />}
              {item.verified && <GBadge label="Verified" icon={I.shield('#1A8A3E')} variant="green" />}
              <GBadge label="Clean return eligible" icon={I.check('#1A8A3E')} variant="green" />
            </div>

            {/* CTA */}
            <Press onTap={() => { dismiss(); setTimeout(() => onUnlock(item), 350); }} scale={0.97}>
              <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '17px', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 750, fontFamily: C.font, boxShadow: `0 6px 24px ${C.orangeGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{I.bolt()} Unlock · {item.price}</div>
            </Press>
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━━━ PASS VIEW (ticket card after unlock) ━━━━━ */
function PassView({ item, onStart, onBack }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);
  const gc = { bike: ['#FF9A56','#FF6B35'], paddle: ['#34D399','#10B981'], camera: ['#FBBF24','#F59E0B'], scooter: ['#A78BFA','#7C5CE0'], tool: ['#6EE7B7','#2ABF5E'] };
  const colors = gc[item.type] || gc.bike;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 96px' }}>
        <div style={{ padding: '6px 20px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Press onTap={onBack} scale={0.9}><div style={{ width: 36, height: 36, borderRadius: 18, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.close(C.text)}</div></Press>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.2 }}>Unlocked</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: C.font }}>You're in.</div>
          </div>
        </div>
        <div style={{ padding: '4px 20px 12px' }}><MiniMap h={90} style={{ borderRadius: 16 }} /></div>

        {/* Ticket */}
        <div style={{ padding: '0 20px', opacity: show ? 1 : 0, transform: show ? 'scale(1)' : 'scale(0.94)', transition: 'all 0.5s cubic-bezier(.4,0,.2,1) 0.15s' }}>
          <div style={{ borderRadius: 26, overflow: 'hidden', boxShadow: `0 12px 40px ${colors[1]}33` }}>
            <div style={{ background: `linear-gradient(140deg, ${colors[0]}, ${colors[1]})`, padding: '22px 22px 20px', position: 'relative' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>Access Pass</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: C.font, marginBottom: 14 }}>{item.name}</div>
              <div style={{ display: 'flex', gap: 20 }}>
                {[{ l: 'From', v: 'Now' }, { l: 'Duration', v: '2 hrs' }, { l: 'Pickup', v: 'Self' }].map(m => (
                  <div key={m.l}><div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.l}</div><div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: C.font }}>{m.v}</div></div>
                ))}
              </div>
              <div style={{ position: 'absolute', top: 18, right: 18, opacity: 0.15 }}>{DI[item.type] ? DI[item.type](32, '#fff', '#fff') : DI.bike(32, '#fff', '#fff')}</div>
            </div>
            <div style={{ position: 'relative', height: 2, background: C.white }}>
              <div style={{ position: 'absolute', left: 28, right: 28, top: 0, borderTop: `2px dashed ${C.border}` }} />
              <div style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: C.bg }} />
              <div style={{ position: 'absolute', right: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: C.bg }} />
            </div>
            <div style={{ background: C.white, padding: '20px', textAlign: 'center' }}>
              <div style={{ width: 100, height: 100, borderRadius: 18, margin: '0 auto 10px', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${C.border}` }}>{I.qr(C.text)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}><Dot color={C.green} size={7} /><span style={{ fontSize: 13, fontWeight: 650, fontFamily: C.font, color: C.text }}>Ready now</span></div>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 20px 0', display: 'flex', gap: 5 }}>
          <GBadge label="ID verified" icon={I.check('#1A8A3E')} variant="green" />
          <GBadge label="Deposit held" icon={I.shield('#1A8A3E')} variant="green" />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20, zIndex: 40 }}>
        <Press onTap={onStart} scale={0.97}><div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '17px', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 750, fontFamily: C.font, boxShadow: `0 6px 24px ${C.orangeGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{I.bolt()} Start Expedition</div></Press>
      </div>
    </div>
  );
}

/* ━━━━━ ACTIVE RENTAL (dark) ━━━━━ */
function ActiveView({ item, onReturn }) {
  const [mins] = React.useState(120);
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);
  const h = Math.floor(mins / 60), m = mins % 60;
  const pct = mins / 120;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.dark, paddingTop: 58 }}>
      <ContourBG dark />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 96px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', padding: '6px 20px 0', opacity: show ? 1 : 0, transition: 'opacity 0.4s ease' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.5 }}>Active Expedition</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: C.font }}>You're Out There</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0 14px', opacity: show ? 1 : 0, transform: show ? 'none' : 'scale(0.9)', transition: 'all 0.5s ease 0.1s' }}>
          <div style={{ position: 'relative', width: 160, height: 160 }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="9" />
              <circle cx="80" cy="80" r="68" fill="none" stroke={C.orange} strokeWidth="9" strokeDasharray={`${2*Math.PI*68}`} strokeDashoffset={`${2*Math.PI*68*(1-pct)}`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.orangeGlow})` }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 800, fontFamily: C.font, color: '#fff', letterSpacing: -2, lineHeight: 1 }}>{h}:{String(m).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: C.font, marginTop: 4 }}>remaining</div>
            </div>
            <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(${C.orange}0D, transparent 70%)`, animation: 'breathe3 3s ease-in-out infinite', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 18 }}><span style={{ fontSize: 14, fontWeight: 700, color: C.orange, fontFamily: C.font }}>{item.name}</span></div>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap', padding: '0 20px', marginBottom: 18 }}>
          <GBadge label="Deposit held" icon={I.shield('rgba(255,255,255,0.7)')} variant="dark" />
          <GBadge label="Clean eligible" icon={I.check('rgba(255,255,255,0.7)')} variant="dark" />
          <GBadge label="Active" icon={<Dot color={C.green} size={6} />} variant="dark" />
        </div>
        <div style={{ padding: '0 20px' }}><MiniMap dark h={110} /></div>
      </div>
      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20, zIndex: 40 }}>
        <Press onTap={onReturn} scale={0.97}><div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '17px', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 750, fontFamily: C.font, boxShadow: `0 6px 24px ${C.orangeGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{I.camera()} Return Item</div></Press>
      </div>
    </div>
  );
}

/* ━━━━━ RETURN (4-tap) ━━━━━ */
function ReturnView({ onDone }) {
  const [photos, setPhotos] = React.useState([false, false, false, false]);
  const [phase, setPhase] = React.useState('snap');
  const [vStep, setVStep] = React.useState(0);
  const labels = ['Front', 'Back', 'Left', 'Right'];
  const types = ['bike', 'scooter', 'paddle', 'camera'];
  const filled = photos.filter(Boolean).length;

  const snap = (i) => {
    const n = [...photos]; n[i] = true; setPhotos(n);
    if (n.every(Boolean)) setTimeout(() => {
      setPhase('verify'); let s = 0;
      const iv = setInterval(() => { s++; setVStep(s); if (s >= 4) { clearInterval(iv); setTimeout(() => setPhase('done'), 500); } }, 380);
    }, 250);
  };

  const gc = { bike: ['#FF9A56','#FF6B35'], scooter: ['#A78BFA','#7C5CE0'], paddle: ['#34D399','#10B981'], camera: ['#FBBF24','#F59E0B'] };

  if (phase === 'done') return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 40, gap: 14, textAlign: 'center' }}>
      <Burst active color={C.green} />
      <div style={{ width: 84, height: 84, borderRadius: 42, background: `linear-gradient(135deg, ${C.green}, #10B981)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 40px ${C.greenGlow}`, animation: 'popIn3 0.5s cubic-bezier(.175,.885,.32,1.275)' }}>
        <svg width="38" height="30" viewBox="0 0 24 20" fill="none"><path d="M2 10l7 7L22 3" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, fontFamily: C.font, color: C.text }}>Clean.</div>
      <div style={{ fontSize: 13, fontFamily: C.font, color: C.text2 }}>Deposit releasing. +1 streak.</div>
      <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
        <GBadge label="Released" icon={I.check('#1A8A3E')} variant="green" />
        <GBadge label="+1 streak" icon={I.bolt('#1A8A3E')} variant="green" />
      </div>
      <Press onTap={onDone} scale={0.95} style={{ marginTop: 14 }}>
        <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '14px 40px', color: '#fff', fontSize: 15, fontWeight: 750, fontFamily: C.font, boxShadow: `0 4px 16px ${C.orangeGlow}` }}>Back to field</div>
      </Press>
    </div>
  );

  if (phase === 'verify') return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 40, gap: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 28px ${C.orangeGlow}` }}>
        <div style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 12, animation: 'spin3 0.6s linear infinite' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['Asset', 'Condition', 'Accessories', 'Location'].map((c, i) => {
          const done = i < vStep, act = i === vStep;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: done || act ? 1 : 0.2, transition: 'all 0.3s' }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: done ? C.green : act ? C.orange : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                {done && I.check('#fff')}{act && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }} />}
              </div>
              <span style={{ fontSize: 15, fontFamily: C.font, color: C.text, fontWeight: 500 }}>{c}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 20px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: C.font, color: C.text }}>Close it clean</div>
          <div style={{ fontSize: 13, color: C.text2, fontFamily: C.font, marginTop: 2 }}>Tap each angle.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ position: 'relative', width: 46, height: 46 }}>
            <svg width="46" height="46" viewBox="0 0 46 46" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="23" cy="23" r="19" fill="none" stroke={C.border} strokeWidth="4" />
              <circle cx="23" cy="23" r="19" fill="none" stroke={C.orange} strokeWidth="4" strokeDasharray={`${2*Math.PI*19}`} strokeDashoffset={`${2*Math.PI*19*(1-filled/4)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, fontFamily: C.font, color: C.text }}>{filled}</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {labels.map((l, i) => {
            const c = gc[types[i]] || gc.bike;
            return (
              <Press key={i} onTap={() => !photos[i] && snap(i)} disabled={photos[i]} scale={0.93}>
                <div style={{
                  borderRadius: 22, height: '100%', minHeight: 120, position: 'relative', overflow: 'hidden',
                  background: photos[i] ? `linear-gradient(145deg, ${c[0]}22, ${c[1]}22)` : C.white,
                  border: photos[i] ? `2px solid ${C.green}` : `2px dashed ${C.border}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.3s ease',
                }}>
                  {photos[i] ? (
                    <>
                      <div style={{ width: 32, height: 32, borderRadius: 16, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.check('#fff')}</div>
                      <span style={{ fontSize: 12, fontWeight: 700, fontFamily: C.font, color: '#1A8A3E' }}>{l}</span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 42, height: 42, borderRadius: 14, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.camera(C.text3)}</div>
                      <span style={{ fontSize: 12, fontWeight: 650, fontFamily: C.font, color: C.text3 }}>{l}</span>
                    </>
                  )}
                </div>
              </Press>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ━━━━━ SCAN (earn mode) ━━━━━ */
function ScanView4({ onListed, onBack }) {
  const [detected, setDetected] = React.useState(false);
  const [scanY, setScanY] = React.useState(0);
  const [time, setTime] = React.useState(0);
  React.useEffect(() => { const t = setTimeout(() => setDetected(true), 2800); return () => clearTimeout(t); }, []);
  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);
  React.useEffect(() => {
    if (detected) return;
    let raf; const s = performance.now();
    const t = (n) => { setScanY(((n - s) / 1800) % 1); raf = requestAnimationFrame(t); };
    raf = requestAnimationFrame(t); return () => clearTimeout(raf);
  }, [detected]);

  const gridPulse = Math.sin(time / 600) * 0.02 + 0.04;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.dark, position: 'relative' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, #2A2622 0%, #1C1916 40%, #1A1714 100%)' }} />

        {/* Animated grid overlay */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: gridPulse }}>
          <defs><pattern id="scanGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0v40H0" fill="none" stroke="#fff" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#scanGrid)" />
        </svg>

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 58, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <Press onTap={onBack} scale={0.9}><div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.close('#fff')}</div></Press>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
            {detected ? <Dot color={C.green} size={7} /> : <div style={{ width: 7, height: 7, borderRadius: 4, background: C.orange, animation: 'pulse3 1.5s ease-in-out infinite' }} />}
            <span style={{ fontSize: 13, fontWeight: 700, color: detected ? C.green : '#fff', fontFamily: C.font }}>{detected ? 'Found it' : 'Scanning…'}</span>
          </div>
          <div style={{ width: 38 }} />
        </div>

        {/* Viewfinder frame */}
        <div style={{
          position: 'absolute', top: '16%', left: '8%', right: '8%', bottom: '28%',
          border: `2.5px solid ${detected ? C.green : C.orange}`,
          borderRadius: 24, transition: 'border-color 0.5s ease',
          boxShadow: detected ? `0 0 50px ${C.green}22, inset 0 0 30px ${C.green}08` : `0 0 50px ${C.orange}18, inset 0 0 30px ${C.orange}06`,
        }}>
          {/* Corner brackets */}
          {[
            { top: -3, left: -3, bT: `3px solid ${detected ? C.green : C.orange}`, bL: `3px solid ${detected ? C.green : C.orange}`, br: '24px 0 0 0' },
            { top: -3, right: -3, bT: `3px solid ${detected ? C.green : C.orange}`, bR: `3px solid ${detected ? C.green : C.orange}`, br: '0 24px 0 0' },
            { bottom: -3, left: -3, bB: `3px solid ${detected ? C.green : C.orange}`, bL: `3px solid ${detected ? C.green : C.orange}`, br: '0 0 0 24px' },
            { bottom: -3, right: -3, bB: `3px solid ${detected ? C.green : C.orange}`, bR: `3px solid ${detected ? C.green : C.orange}`, br: '0 0 24px 0' },
          ].map((s, i) => (
            <div key={i} style={{ position: 'absolute', width: 28, height: 28, top: s.top, left: s.left, right: s.right, bottom: s.bottom, borderTop: s.bT, borderLeft: s.bL, borderRight: s.bR, borderBottom: s.bB, borderRadius: s.br }} />
          ))}

          {/* Scan beam */}
          {!detected && (
            <>
              <div style={{
                position: 'absolute', left: 0, right: 0, top: `${scanY * 100}%`, height: 2,
                background: C.orange,
                boxShadow: `0 0 20px ${C.orange}, 0 0 60px ${C.orange}55`,
              }} />
              {/* Trailing glow */}
              <div style={{
                position: 'absolute', left: 0, right: 0,
                top: `${Math.max(0, scanY * 100 - 15)}%`, height: '15%',
                background: `linear-gradient(transparent, ${C.orange}0A, transparent)`,
                pointerEvents: 'none',
              }} />
            </>
          )}

          {/* Center crosshair */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: detected ? 0 : 0.3, transition: 'opacity 0.5s' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <line x1="20" y1="8" x2="20" y2="16" stroke={C.orange} strokeWidth="1.5" />
              <line x1="20" y1="24" x2="20" y2="32" stroke={C.orange} strokeWidth="1.5" />
              <line x1="8" y1="20" x2="16" y2="20" stroke={C.orange} strokeWidth="1.5" />
              <line x1="24" y1="20" x2="32" y2="20" stroke={C.orange} strokeWidth="1.5" />
              <circle cx="20" cy="20" r="3" stroke={C.orange} strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* Detection flash */}
          {detected && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 22,
              background: `${C.green}10`,
              animation: 'fadeIn3 0.3s ease',
            }} />
          )}
        </div>

        {/* Guide text */}
        {!detected && (
          <div style={{ position: 'absolute', top: '10%', left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: C.font }}>Point at something rentable</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: C.font, marginTop: 4 }}>Hold steady for best results</div>
          </div>
        )}

        {/* Ambient scan particles */}
        {!detected && Array.from({ length: 6 }).map((_, i) => {
          const px = 15 + (i * 37) % 70;
          const py = 20 + Math.sin(time / 900 + i * 1.5) * 15 + (i * 23) % 40;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${px}%`, top: `${py}%`,
              width: 4, height: 4, borderRadius: 2,
              background: C.orange, opacity: 0.15 + Math.sin(time / 500 + i * 2) * 0.1,
              boxShadow: `0 0 6px ${C.orange}44`,
            }} />
          );
        })}
      </div>

      {/* Detected result */}
      {detected && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: C.white, borderRadius: '28px 28px 0 0', padding: '18px 20px 36px', boxShadow: '0 -10px 40px rgba(0,0,0,0.25)', animation: 'sheetUp3 0.4s cubic-bezier(.4,0,.2,1)' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: '0 auto 12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Dot color={C.green} size={8} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: C.font }}>Detected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <DuoIcon type="bike" size={44} />
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: C.font, color: C.text, letterSpacing: -0.3 }}>Looks like an e-bike.</div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {[{ l: 'Earnings', v: '$120–340/mo' }, { l: 'Price', v: '$18/hr' }, { l: 'Demand', v: 'High' }].map(m => (
              <div key={m.l} style={{ flex: 1, padding: '10px 6px', borderRadius: 14, background: '#FFF2EB', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: C.text2, fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>{m.l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.orange, fontFamily: C.font }}>{m.v}</div>
              </div>
            ))}
          </div>
          <Press onTap={onListed} scale={0.97}><div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '16px', textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: 750, fontFamily: C.font, boxShadow: `0 6px 24px ${C.orangeGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{I.bolt()} Publish Now</div></Press>
        </div>
      )}
    </div>
  );
}

/* ━━━━━ LISTED CELEBRATION ━━━━━ */
function ListedView4({ onDone }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 40, gap: 14, textAlign: 'center' }}>
      <Burst active color={C.green} />
      <div style={{ width: 76, height: 76, borderRadius: 22, background: `linear-gradient(135deg, ${C.green}, #10B981)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 40px ${C.greenGlow}`, animation: 'popIn3 0.5s cubic-bezier(.175,.885,.32,1.275)' }}>{I.check('#fff')}</div>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: C.font, color: C.text }}>Listed.</div>
      <div style={{ fontSize: 13, fontFamily: C.font, color: C.text2 }}>It's live and earning.</div>
      <div style={{ padding: '10px 16px', borderRadius: 14, background: '#FFF2EB', marginTop: 4 }}><span style={{ fontSize: 13, fontWeight: 700, fontFamily: C.font, color: C.orange }}>Est. $120–$340/mo</span></div>
      <Press onTap={onDone} scale={0.95} style={{ marginTop: 12 }}>
        <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '14px 40px', color: '#fff', fontSize: 15, fontWeight: 750, fontFamily: C.font, boxShadow: `0 4px 16px ${C.orangeGlow}` }}>Back to field</div>
      </Press>
    </div>
  );
}

/* ━━━━━ STATS OVERLAY ━━━━━ */
function Stats4({ show, onClose }) {
  if (!show) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, animation: 'fadeIn3 0.3s ease' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'relative', margin: '62px 16px 0', borderRadius: 26, background: C.dark, padding: '22px', color: '#fff', boxShadow: '0 12px 48px rgba(0,0,0,0.4)', animation: 'slideDown3 0.35s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: C.font }}>A</div>
            <div><div style={{ fontSize: 15, fontWeight: 750, fontFamily: C.font }}>Alex</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: C.font }}>Level 3 · Explorer</div></div>
          </div>
          <Press onTap={onClose} scale={0.9}><div style={{ width: 30, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.close('#fff')}</div></Press>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[{ v: '5', l: 'Streak', c: C.orange }, { v: '$482', l: 'Earned', c: C.green }, { v: '$185', l: 'Saved', c: C.gold }].map(m => (
            <div key={m.l} style={{ flex: 1, padding: '12px 6px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: C.font, color: m.c }}>{m.v}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{m.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <GBadge label="Instant access" icon={I.bolt('rgba(255,255,255,0.7)')} variant="dark" />
          <GBadge label="3 assets listed" icon={I.dollar('rgba(255,255,255,0.7)')} variant="dark" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FocusOverlay, PassView, ActiveView, ReturnView, ScanView4, ListedView4, Stats4 });

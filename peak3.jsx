// RoamRide v5.1 — Enhanced Peak 3: Clean Return Ritual
// Richer scan UI, cinematic verification, animated credential card, deposit waterfall

const SCAN_ANGLES = [
  { id: 0, label: 'Front', icon: 'F', color: '#FF6B35' },
  { id: 1, label: 'Left Side', icon: 'L', color: '#38BDF8' },
  { id: 2, label: 'Back', icon: 'B', color: '#A78BFA' },
  { id: 3, label: 'Right Side', icon: 'R', color: '#FBBF24' },
  { id: 4, label: 'Accessories', icon: 'A', color: '#2ABF5E' },
];

const CONDITION_CHECKS = [
  { label: 'Matching asset identity', icon: 'scan', detail: 'Serial + visual match' },
  { label: 'Analyzing condition delta', icon: 'shield', detail: 'Pre vs post comparison' },
  { label: 'Checking accessories', icon: 'check', detail: 'All items accounted for' },
  { label: 'Verifying return location', icon: 'map', detail: 'Within pickup zone' },
  { label: 'Computing trust update', icon: 'bolt', detail: 'Clean history applied' },
];

function ReturnRitual({ item, onComplete }) {
  const [phase, setPhase] = React.useState('intro');
  const [scanIdx, setScanIdx] = React.useState(0);
  const [photos, setPhotos] = React.useState(Array(5).fill(false));
  const [verifyStep, setVerifyStep] = React.useState(-1);
  const [reward, setReward] = React.useState(false);
  const [depositCount, setDepositCount] = React.useState(45);
  const [trustCount, setTrustCount] = React.useState(0);
  const [ringPct, setRingPct] = React.useState(0);
  const [credentialShow, setCredentialShow] = React.useState(false);
  const [time, setTime] = React.useState(0);

  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);

  const startScan = () => setPhase('scan');

  const snap = () => {
    const next = [...photos]; next[scanIdx] = true; setPhotos(next);
    if (scanIdx < 4) setTimeout(() => setScanIdx(scanIdx + 1), 350);
    else setTimeout(() => setPhase('verify'), 500);
  };

  // Verification
  React.useEffect(() => {
    if (phase !== 'verify') return;
    let s = -1;
    const iv = setInterval(() => { s++; setVerifyStep(s); if (s >= CONDITION_CHECKS.length) { clearInterval(iv); setTimeout(() => setPhase('reward'), 500); } }, 700);
    return () => clearInterval(iv);
  }, [phase]);

  // Reward animations
  React.useEffect(() => {
    if (phase !== 'reward') return;
    setReward(true);
    let start = performance.now(), raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 2000);
      const ease = 1 - Math.pow(1 - t, 3);
      setDepositCount(Math.round(45 * (1 - ease)));
      setTrustCount(Math.round(6 * ease));
      setRingPct(ease);
      if (t >= 0.7 && !credentialShow) setCredentialShow(true);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 28, gap: 16, textAlign: 'center', position: 'relative' }}>
        <ContourBG />
        <AmbientParticles time={time} selectedColors={['rgba(0,0,0,0.03)', `${C.orange}08`]} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 32px ${C.orangeGlow}`,
          }}>
            <div style={{ transform: 'scale(1.6)' }}>{I.camera('#fff')}</div>
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: C.font, color: C.text, letterSpacing: -0.6, marginBottom: 6 }}>Let's close this clean.</div>
            <div style={{ fontSize: 14, fontFamily: C.font, color: C.text2, lineHeight: 1.5, maxWidth: 280 }}>
              5 quick angles. The AI verifies condition. Your deposit releases instantly.
            </div>
          </div>

          {/* Angle preview strip */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {SCAN_ANGLES.map(a => (
              <div key={a.id} style={{
                width: 44, height: 44, borderRadius: 14,
                background: `${a.color}10`, border: `1.5px solid ${a.color}20`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
              }}>
                <span style={{ fontSize: 14, color: a.color }}>{a.icon}</span>
                <span style={{ fontSize: 7, fontWeight: 700, color: a.color, fontFamily: C.font }}>{a.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          {/* What happens after */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <GBadge label="Deposit → $0" icon={I.shield(C.green)} variant="green" />
            <GBadge label="Trust +6" icon={I.bolt(C.orange)} variant="orange" />
          </div>

          <Press onTap={startScan} scale={0.97} style={{ marginTop: 12, width: '100%' }}>
            <div style={{
              background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50,
              padding: '17px', textAlign: 'center', color: '#fff',
              fontSize: 16, fontWeight: 750, fontFamily: C.font,
              boxShadow: `0 6px 24px ${C.orangeGlow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>{I.camera()} Start Return Scan</div>
          </Press>
        </div>
      </div>
    );
  }

  // ── SCAN ──
  if (phase === 'scan') {
    const angle = SCAN_ANGLES[scanIdx];
    const breathe = Math.sin(time / 600) * 4;
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1A1714', position: 'relative' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #2A2622, #1A1714)' }} />

          {/* Progress bars at top */}
          <div style={{ position: 'absolute', top: 58, left: 20, right: 20, display: 'flex', gap: 4, zIndex: 20 }}>
            {SCAN_ANGLES.map((a, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  background: i < scanIdx ? C.green : i === scanIdx ? a.color : 'transparent',
                  width: i < scanIdx ? '100%' : i === scanIdx ? '100%' : '0%',
                  transition: 'all 0.3s ease',
                  boxShadow: i === scanIdx ? `0 0 8px ${a.color}55` : 'none',
                }} />
              </div>
            ))}
          </div>

          {/* Angle indicator */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{
              width: 130, height: 130, borderRadius: 36,
              border: `3px solid ${angle.color}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: `0 0 40px ${angle.color}30`,
              transform: `translateY(${breathe}px)`,
            }}>
              <span style={{ fontSize: 36, transition: 'transform 0.3s ease' }}>{angle.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: C.font }}>{angle.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: C.font }}>{scanIdx + 1} of {SCAN_ANGLES.length}</span>
              {scanIdx > 0 && <span style={{ fontSize: 10, color: C.green, fontFamily: C.font, fontWeight: 600 }}>· {scanIdx} captured</span>}
            </div>
          </div>

          {/* Previous captures as mini thumbnails */}
          {scanIdx > 0 && (
            <div style={{ position: 'absolute', bottom: 90, left: 20, display: 'flex', gap: 6, zIndex: 15 }}>
              {SCAN_ANGLES.slice(0, scanIdx).map(a => (
                <div key={a.id} style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${a.color}25`, border: `1.5px solid ${C.green}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke={C.green} strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Capture button */}
        <div style={{ padding: '12px 20px 34px', display: 'flex', justifyContent: 'center' }}>
          <Press onTap={snap} scale={0.88}>
            <div style={{
              width: 74, height: 74, borderRadius: 37,
              background: `linear-gradient(135deg, ${angle.color}, ${angle.color}CC)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 6px 28px ${angle.color}55`,
              border: '4px solid rgba(255,255,255,0.3)',
              transition: 'background 0.3s ease, box-shadow 0.3s ease',
            }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.9)' }} />
            </div>
          </Press>
        </div>
      </div>
    );
  }

  // ── VERIFY ──
  if (phase === 'verify') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 28, gap: 20, position: 'relative' }}>
        <ContourBG />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 34,
            background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 32px ${C.orangeGlow}`,
          }}>
            <div style={{ width: 26, height: 26, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 13, animation: 'spin3 0.6s linear infinite' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: C.font, color: C.text, letterSpacing: -0.3 }}>Verifying condition…</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 300 }}>
            {CONDITION_CHECKS.map((c, i) => {
              const done = i < verifyStep, active = i === verifyStep;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 16,
                  background: done ? `${C.green}08` : active ? `${C.orange}08` : 'transparent',
                  opacity: done || active ? 1 : 0.15,
                  transform: done || active ? 'translateX(0)' : 'translateX(8px)',
                  transition: 'all 0.4s ease',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 15,
                    background: done ? C.green : active ? C.orange : C.border,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: active ? `0 0 12px ${C.orangeGlow}` : done ? `0 0 8px ${C.greenGlow}` : 'none',
                  }}>
                    {done && <svg width="14" height="12" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
                    {active && (I[c.icon] ? I[c.icon](C.orange) : I.bolt(C.orange))}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontFamily: C.font, color: C.text, fontWeight: done ? 600 : 500 }}>{c.label}</div>
                    {(done || active) && <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font }}>{c.detail}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── REWARD ──
  const glowPulse = Math.sin(time / 800) * 0.04;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 24, textAlign: 'center', position: 'relative', overflowY: 'auto' }}>
      <Burst active={reward} color={C.green} />
      <ContourBG />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%', maxWidth: 320 }}>

        {/* CLEAN ring */}
        <div style={{ position: 'relative', width: 130, height: 130 }}>
          <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="65" cy="65" r="56" fill="none" stroke={`${C.green}12`} strokeWidth="6" />
            <circle cx="65" cy="65" r="56" fill="none" stroke={C.green} strokeWidth="6"
              strokeDasharray={`${2*Math.PI*56}`} strokeDashoffset={`${2*Math.PI*56*(1-ringPct)}`}
              strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.greenGlow})` }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 34, fontWeight: 800, fontFamily: C.font, color: C.green, letterSpacing: -1, animation: reward ? 'popIn3 0.6s cubic-bezier(.175,.885,.32,1.275)' : 'none' }}>CLEAN</div>
            <div style={{ fontSize: 9, color: C.text2, fontFamily: C.font, fontWeight: 600, marginTop: 2 }}>Condition matched</div>
          </div>
          <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: `radial-gradient(${C.green}10, transparent 70%)`, transform: `scale(${1 + glowPulse})`, pointerEvents: 'none' }} />
        </div>

        {/* Deposit waterfall */}
        <div style={{
          padding: '16px 24px', borderRadius: 22, width: '100%',
          background: C.white, boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1 }}>Deposit</div>
            <div style={{ fontSize: 36, fontWeight: 800, fontFamily: C.font, color: depositCount > 0 ? C.text : C.green, letterSpacing: -2, lineHeight: 1, transition: 'color 0.5s' }}>${depositCount}</div>
          </div>
          {depositCount === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, animation: 'popIn3 0.4s cubic-bezier(.175,.885,.32,1.275)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.check('#fff')}</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.green, fontFamily: C.font }}>Released</span>
            </div>
          )}
        </div>

        {/* Trust upgrade badges */}
        <div style={{
          display: 'flex', gap: 8, width: '100%',
          opacity: ringPct > 0.4 ? 1 : 0, transform: ringPct > 0.4 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s ease',
        }}>
          <div style={{ flex: 1, padding: '12px', borderRadius: 18, background: `${C.green}08`, border: `1.5px solid ${C.green}18`, display: 'flex', alignItems: 'center', gap: 8 }}>
            {I.shield(C.green)}
            <div><div style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: C.font }}>Trust +{trustCount}</div><div style={{ fontSize: 9, color: C.text2, fontFamily: C.font }}>Streak: 6</div></div>
          </div>
          <div style={{ flex: 1, padding: '12px', borderRadius: 18, background: `${C.orange}08`, border: `1.5px solid ${C.orange}18`, display: 'flex', alignItems: 'center', gap: 8 }}>
            {I.bolt(C.orange)}
            <div><div style={{ fontSize: 12, fontWeight: 700, color: C.orange, fontFamily: C.font }}>Save $15</div><div style={{ fontSize: 9, color: C.text2, fontFamily: C.font }}>Next deposit</div></div>
          </div>
        </div>

        {/* Credential card */}
        <div style={{
          width: '100%', padding: '16px 18px', borderRadius: 22,
          background: `linear-gradient(145deg, ${C.gold}12, ${C.gold}06)`,
          border: `1.5px solid ${C.gold}25`,
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: credentialShow ? 1 : 0,
          transform: credentialShow ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(10px)',
          transition: 'all 0.6s cubic-bezier(.25,.8,.25,1.05)',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: `linear-gradient(135deg, ${C.gold}, #D4A017)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${C.gold}33`,
          }}>
            {I.medal(C.gold)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.8 }}>Credential Unlocked</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: C.font, marginTop: 1 }}>Verified E-Bike Renter</div>
            <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font }}>Lower deposits across all e-bikes</div>
          </div>
        </div>

        <Press onTap={onComplete} scale={0.97} style={{ width: '100%', marginTop: 4 }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50,
            padding: '16px', textAlign: 'center', color: '#fff',
            fontSize: 16, fontWeight: 750, fontFamily: C.font,
            boxShadow: `0 6px 24px ${C.orangeGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>{I.compass()} Back to exploring</div>
        </Press>
      </div>
    </div>
  );
}

Object.assign(window, { ReturnRitual });

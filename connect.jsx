// RoamRide v5.1 — Enhanced Explore + Unlock experiences
// Micro-adventures, time-pockets, richer cards, tactile unlock morphing

/* ━━━ MICRO-ADVENTURES ━━━ */
const ADVENTURES = [
  { id: 'a1', title: 'Sunset loop', sub: 'E-bike + camera', type: 'bike', color: '#FF8F50', time: '2 hrs' },
  { id: 'a2', title: 'Lake afternoon', sub: 'Paddleboard + cooler', type: 'paddle', color: '#38BDF8', time: '3 hrs' },
  { id: 'a3', title: 'Street walk', sub: 'Camera + scooter', type: 'camera', color: '#FBBF24', time: '90 min' },
  { id: 'a4', title: 'Fix everything', sub: 'Drill + toolbox', type: 'tool', color: '#6EE7B7', time: '1 hr' },
];

/* ━━━ ENHANCED EXPLORE RESULTS ━━━ */
function ExploreResults({ vibes, onUnlock, onEarn, onStats }) {
  const [time, setTime] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);
  React.useEffect(() => { const t = setTimeout(() => setLoaded(true), 50); return () => clearTimeout(t); }, []);

  const items = [
    { id: 'r1', name: 'E-Bike Cruiser', price: '$18/hr', type: 'bike', rating: '4.9', distance: '0.6 mi', vibe: 'Perfect for a sunset loop', deposit: '$45', color: ['#FF9A56','#FF6B35'],  instant: true, verified: true, depositSaved: '$15' },
    { id: 'r2', name: 'Paddleboard', price: '$22/hr', type: 'paddle', rating: '4.8', distance: '0.3 mi', vibe: 'Calm water, zero effort', deposit: '$30', color: ['#34D399','#10B981'],  instant: true, verified: true, depositSaved: '$10' },
    { id: 'r3', name: 'Camera Kit', price: '$35/hr', type: 'camera', rating: '5.0', distance: '1.2 mi', vibe: 'Street photography starter', deposit: '$80', color: ['#FBBF24','#F59E0B'],  instant: false, verified: true, depositSaved: '$20' },
    { id: 'r4', name: 'Scooter Pro', price: '$12/hr', type: 'scooter', rating: '4.7', distance: '0.4 mi', vibe: 'Zip through the neighborhood', deposit: '$25', color: ['#A78BFA','#7C5CE0'],  instant: true, verified: false, depositSaved: '$0' },
  ];

  const [focusItem, setFocusItem] = React.useState(null);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 56, position: 'relative' }}>
      <ContourBG />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 90 }}>
        {/* Header */}
        <div style={{ padding: '6px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.2 }}>Your world</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.text, fontFamily: C.font, letterSpacing: -0.5 }}>Ready for you</div>
          </div>
          <Press onTap={onStats} scale={0.9}>
            <div style={{ width: 42, height: 42, borderRadius: 15, background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, fontFamily: C.font, color: '#fff', boxShadow: `0 4px 14px ${C.orangeGlow}` }}>A</div>
          </Press>
        </div>

        {/* Active vibes */}
        <div style={{ padding: '10px 20px 0', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {vibes.map(id => {
            const v = VIBES.find(x => x.id === id);
            return v ? <span key={id} style={{ padding: '5px 12px', borderRadius: 20, background: v.color, fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: C.font, display: 'inline-flex', alignItems: 'center', gap: 4, boxShadow: `0 2px 8px ${v.color}33` }}>{v.label}</span> : null;
          })}
        </div>

        {/* Count banner */}
        <div style={{ padding: '12px 20px 6px', opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(10px)', transition: 'all 0.5s ease 0.1s' }}>
          <div style={{ padding: '14px 18px', borderRadius: 20, background: `linear-gradient(135deg, ${C.orange}10, ${C.orange}05)`, border: `1.5px solid ${C.orange}18`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Dot color={C.orange} size={10} />
              <span style={{ fontSize: 14, fontWeight: 700, fontFamily: C.font, color: C.text }}>4 things match your vibe</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: C.font, color: C.orange }}>right now</span>
          </div>
        </div>

        {/* Micro-adventures */}
        <div style={{ padding: '10px 0 4px' }}>
          <div style={{ padding: '0 20px', marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.2 }}>Micro-adventures</span>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px 4px', scrollbarWidth: 'none' }}>
            {ADVENTURES.map((a, i) => (
              <div key={a.id} style={{
                opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.4s ease ${0.2 + i * 0.08}s`,
              }}>
                <Press scale={0.95}>
                  <div style={{
                    flexShrink: 0, width: 140, padding: '14px', borderRadius: 20,
                    background: `linear-gradient(150deg, ${a.color}18, ${a.color}08)`,
                    border: `1.5px solid ${a.color}20`,
                  }}>
                    <DuoIcon type={a.type} size={32} />
                    <div style={{ fontSize: 13, fontWeight: 750, fontFamily: C.font, color: C.text, marginTop: 8, lineHeight: 1.2 }}>{a.title}</div>
                    <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font, marginTop: 2 }}>{a.sub}</div>
                    <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 8, background: `${a.color}15`, fontSize: 10, fontWeight: 700, color: a.color, fontFamily: C.font }}>
                      {I.clock(a.color)} {a.time}
                    </div>
                  </div>
                </Press>
              </div>
            ))}
          </div>
        </div>

        {/* Available now */}
        <div style={{ padding: '12px 20px 4px' }}>
          <span style={{ fontSize: 15, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.2 }}>Available now</span>
        </div>

        {/* Asset cards (enhanced) */}
        <div style={{ padding: '8px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => {
            const float = Math.sin(time / 1200 + i * 1.5) * 1.5;
            return (
              <div key={item.id} style={{
                opacity: loaded ? 1 : 0, transform: loaded ? `translateY(${float}px)` : 'translateY(20px)',
                transition: `opacity 0.5s ease ${0.3 + i * 0.08}s, transform ${loaded ? '0.05s linear' : `0.5s ease ${0.3 + i * 0.08}s`}`,
              }}>
                <Press onTap={() => setFocusItem(item)} scale={0.97}>
                  <div style={{
                    borderRadius: 24, overflow: 'hidden', background: C.white,
                    boxShadow: '0 3px 16px rgba(0,0,0,0.05)',
                    display: 'flex', height: 116,
                  }}>
                    {/* Color panel */}
                    <div style={{
                      width: 108, flexShrink: 0, position: 'relative', overflow: 'hidden',
                      background: `linear-gradient(150deg, ${item.color[0]}, ${item.color[1]})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ opacity: 0.35, transform: 'scale(2)' }}>{DI[item.type] ? DI[item.type](24, '#fff', '#fff') : DI.bike(24, '#fff', '#fff')}</div>
                      <div style={{ position: 'absolute', top: '-25%', right: '-25%', width: '65%', height: '65%', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                      {item.instant && <div style={{ position: 'absolute', top: 8, left: 8 }}><GBadge label="Instant" icon={I.bolt('#fff')} /></div>}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
                      <div style={{ fontSize: 16, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.3 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: C.text2, fontFamily: C.font, fontWeight: 500, fontStyle: 'italic' }}>"{item.vibe}"</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: C.orange, fontFamily: C.font }}>{item.price}</span>
                        <span style={{ fontSize: 10, color: C.text3, fontFamily: C.font }}>·</span>
                        <span style={{ fontSize: 11, color: C.text2, fontFamily: C.font }}>{item.distance}</span>
                        <span style={{ fontSize: 10, color: C.text3, fontFamily: C.font }}>·</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 700, fontFamily: C.font, color: C.text }}>{I.star()} {item.rating}</span>
                      </div>
                      {/* Trust line */}
                      {item.depositSaved !== '$0' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                          {I.shield(C.green)}
                          <span style={{ fontSize: 10, fontWeight: 600, fontFamily: C.font, color: C.green }}>Deposit reduced {item.depositSaved} by your trust</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Press>
              </div>
            );
          })}
        </div>

        {/* Map */}
        <div style={{ padding: '16px 20px 0' }}>
          <MiniMap h={110} style={{ borderRadius: 20 }} />
        </div>
        <div style={{ height: 8 }} />
      </div>

      {/* Bottom toggle */}
      <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 35 }}>
        <div style={{ display: 'flex', background: C.dark, borderRadius: 32, padding: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.35)' }}>
          <Press scale={0.93}><div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 20px', borderRadius: 28, background: C.orange, boxShadow: `0 4px 16px ${C.orangeGlow}` }}>{I.compass('#fff')}<span style={{ fontSize: 13, fontWeight: 700, fontFamily: C.font, color: '#fff' }}>Explore</span></div></Press>
          <Press onTap={onEarn} scale={0.93}><div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 20px', borderRadius: 28 }}>{I.dollar('rgba(255,255,255,0.35)')}<span style={{ fontSize: 13, fontWeight: 700, fontFamily: C.font, color: 'rgba(255,255,255,0.35)' }}>Earn</span></div></Press>
        </div>
      </div>

      {/* Focus overlay */}
      {focusItem && (
        <FocusOverlay
          item={{ ...focusItem, verified: true }}
          mode="find"
          onUnlock={(item) => { setFocusItem(null); onUnlock(item); }}
          onClose={() => setFocusItem(null)}
          onScan={() => {}}
        />
      )}
    </div>
  );
}

/* ━━━ ENHANCED ACTIVE SESSION ━━━ */
function ActiveSession({ item, onReturn }) {
  const [mins] = React.useState(120);
  const [show, setShow] = React.useState(false);
  const [time, setTime] = React.useState(0);
  React.useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);
  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);
  const h = Math.floor(mins / 60), m = mins % 60;
  const pct = mins / 120;
  // Glow pulse
  const glowScale = 1 + Math.sin(time / 1000) * 0.06;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#2A2520', paddingTop: 58 }}>
      <ContourBG dark />
      <AmbientParticles time={time} selectedColors={[`${C.orange}15`, `${C.orange}10`, 'rgba(255,255,255,0.03)']} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, padding: '0 28px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, opacity: show ? 1 : 0, transition: 'opacity 0.4s ease' }}>Active Expedition</div>

        {/* Timer */}
        <div style={{ position: 'relative', width: 190, height: 190, marginBottom: 18, opacity: show ? 1 : 0, transform: show ? 'none' : 'scale(0.9)', transition: 'all 0.5s ease 0.1s' }}>
          <svg width="190" height="190" viewBox="0 0 190 190" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="95" cy="95" r="82" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
            <circle cx="95" cy="95" r="82" fill="none" stroke={C.orange} strokeWidth="8"
              strokeDasharray={`${2*Math.PI*82}`} strokeDashoffset={`${2*Math.PI*82*(1-pct)}`}
              strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${C.orangeGlow})` }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 52, fontWeight: 800, fontFamily: C.font, color: '#fff', letterSpacing: -3, lineHeight: 1 }}>{h}:{String(m).padStart(2, '0')}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: C.font, marginTop: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>remaining</div>
          </div>
          <div style={{ position: 'absolute', inset: -30, borderRadius: '50%', background: `radial-gradient(${C.orange}0C, transparent 70%)`, transform: `scale(${glowScale})`, pointerEvents: 'none' }} />
        </div>

        {/* Item */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <DuoIcon type={item.type || 'bike'} size={32} />
          <span style={{ fontSize: 16, fontWeight: 700, color: C.orange, fontFamily: C.font }}>{item.name}</span>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22 }}>
          <GBadge label="Deposit held" icon={I.shield('rgba(255,255,255,0.7)')} variant="dark" />
          <GBadge label="Clean eligible" icon={I.check('rgba(255,255,255,0.7)')} variant="dark" />
          <GBadge label="Active" icon={<Dot color={C.green} size={6} />} variant="dark" />
        </div>

        <MiniMap dark h={110} style={{ width: '100%', borderRadius: 20 }} />
      </div>

      <div style={{ padding: '0 20px 34px', position: 'relative', zIndex: 2, display: 'flex', gap: 8 }}>
        <Press onTap={() => {}} scale={0.97} style={{ flex: 0 }}>
          <div style={{ padding: '16px', borderRadius: 50, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 4h14a2 2 0 012 2v7a2 2 0 01-2 2H7l-4 3V6a2 2 0 012-2z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
        </Press>
        <Press onTap={onReturn} scale={0.97} style={{ flex: 1 }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50,
            padding: '17px', textAlign: 'center', color: '#fff',
            fontSize: 16, fontWeight: 750, fontFamily: C.font,
            boxShadow: `0 6px 24px ${C.orangeGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>{I.camera()} Return Item</div>
        </Press>
      </div>
    </div>
  );
}

Object.assign(window, { ExploreResults, ActiveSession, ADVENTURES });

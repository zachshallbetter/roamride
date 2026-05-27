// RoamRide v4 — The Expedition Field: spatial canvas with floating items

/* ── Item positions in the field (scattered semicircle above user dot) ── */
const FIELD_ITEMS = [
  { id: 'f1', name: 'E-Bike Cruiser', price: '$18/hr', type: 'bike', rating: '4.9', distance: '0.6 mi', vibe: 'Perfect for a sunset loop.', deposit: '$45', instant: true, verified: true, x: 48, y: 28, phase: 0, amp: 5 },
  { id: 'f2', name: 'Paddleboard', price: '$22/hr', type: 'paddle', rating: '4.8', distance: '0.3 mi', vibe: 'Calm water. Zero effort.', deposit: '$30', instant: false, verified: true, x: 15, y: 38, phase: 1.2, amp: 6 },
  { id: 'f3', name: 'Camera Kit', price: '$35/hr', type: 'camera', rating: '5.0', distance: '1.2 mi', vibe: 'Street photography starter.', deposit: '$80', instant: true, verified: true, x: 72, y: 15, phase: 2.4, amp: 4 },
  { id: 'f4', name: 'Scooter Pro', price: '$12/hr', type: 'scooter', rating: '4.7', distance: '0.4 mi', vibe: 'Zip through the neighborhood.', deposit: '$25', instant: true, verified: false, x: 78, y: 45, phase: 0.8, amp: 5 },
  { id: 'f5', name: 'Drill Set', price: '$8/hr', type: 'tool', rating: '4.9', distance: '0.8 mi', vibe: 'Fix that shelf. Finally.', deposit: '$40', instant: true, verified: true, x: 30, y: 12, phase: 3.6, amp: 4 },
];

const EARN_ITEMS = [
  { id: 'e1', name: 'E-bikes', price: '$120–340/mo', type: 'bike', rating: 'High', distance: 'demand', vibe: 'High demand nearby', deposit: '', instant: false, verified: false, x: 40, y: 35, phase: 0.5, amp: 5 },
  { id: 'e2', name: 'Cameras', price: '$80–200/mo', type: 'camera', rating: 'Low', distance: 'supply', vibe: 'Low supply in area', deposit: '', instant: false, verified: false, x: 70, y: 30, phase: 1.8, amp: 4 },
  { id: 'e3', name: 'Paddleboards', price: '$60–180/mo', type: 'paddle', rating: 'Weekend', distance: 'spike', vibe: 'Weekend spike demand', deposit: '', instant: false, verified: false, x: 18, y: 45, phase: 2.5, amp: 6 },
  { id: 'e4', name: 'Tools', price: '$40–120/mo', type: 'tool', rating: 'Popular', distance: 'demand', vibe: 'Always in demand', deposit: '', instant: false, verified: false, x: 60, y: 52, phase: 3.2, amp: 5 },
];

/* ── Contour line background ── */
function ContourBG({ dark = false }) {
  const stroke = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
      {[180, 280, 380, 460, 560].map((cy, i) => (
        <React.Fragment key={i}>
          <ellipse cx="200" cy={cy} rx={120 + i * 30} ry={60 + i * 20} fill="none" stroke={stroke} strokeWidth="1" />
          <ellipse cx="200" cy={cy} rx={80 + i * 22} ry={40 + i * 14} fill="none" stroke={stroke} strokeWidth="0.7" />
        </React.Fragment>
      ))}
      {/* Compass ticks at bottom center */}
      <line x1="200" y1="720" x2="200" y2="680" stroke={stroke} strokeWidth="1.5" />
      <line x1="180" y1="710" x2="220" y2="710" stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

/* ── Floating field item card ── */
function FieldItem({ item, mode, time, focused, onTap, fieldFocused }) {
  const float = Math.sin(time / 1000 + item.phase) * item.amp;
  const floatX = Math.cos(time / 1400 + item.phase * 0.7) * (item.amp * 0.4);
  const isFocused = focused === item.id;
  const anyFocused = focused !== null;
  const hiding = anyFocused && !isFocused;

  const typeColors = {
    bike: ['#FF9A56','#FF6B35'], paddle: ['#34D399','#10B981'], camera: ['#FBBF24','#F59E0B'],
    scooter: ['#A78BFA','#7C5CE0'], tool: ['#6EE7B7','#2ABF5E'], gear: ['#8B5CF6','#6D28D9'],
  };
  const gc = typeColors[item.type] || typeColors.bike;
  const isEarn = mode === 'earn';

  return (
    <div
      onClick={() => !hiding && onTap(item)}
      style={{
        position: 'absolute',
        left: `${item.x}%`, top: `${item.y}%`,
        transform: `translate(-50%, ${-50 + float}%) translateX(${floatX}px) scale(${hiding ? 0.7 : isFocused ? 1.1 : 1})`,
        opacity: hiding ? 0.15 : 1,
        transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(.4,0,.2,1)',
        cursor: 'pointer', zIndex: isFocused ? 20 : 5,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        width: isEarn ? 100 : 110, padding: isEarn ? '10px 10px' : '8px',
        borderRadius: 18,
        background: `linear-gradient(145deg, ${gc[0]}, ${gc[1]})`,
        boxShadow: `0 8px 28px ${gc[1]}44, 0 2px 8px rgba(0,0,0,0.08)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        border: '2px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(4px)',
      }}>
        {isEarn ? (
          <>
            <span style={{ fontSize: 28 }}>{item.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily: C.font, textAlign: 'center', lineHeight: 1.2 }}>{item.name}</span>
            <span style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.65)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.demand}</span>
          </>
        ) : (
          <>
            <div style={{ width: '100%', height: 56, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${gc[0]}88, ${gc[1]}44)` }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, opacity: 0.3, filter: 'grayscale(1) brightness(10)' }}>
                {{ bike: '🚲', paddle: '🏄', camera: '📸', scooter: '🛴', tool: '🔧' }[item.type] || '📦'}
              </div>
            </div>
            <div style={{ width: '100%', padding: '2px 4px 0' }}>
              <div style={{ fontSize: 11, fontWeight: 750, color: '#fff', fontFamily: C.font, lineHeight: 1.2, marginBottom: 2 }}>{item.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: C.font, background: 'rgba(0,0,0,0.15)', borderRadius: 6, padding: '1px 5px' }}>{item.price}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily: C.font }}>{item.distance}</span>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Pulse ring for instant/available */}
      {(item.instant || isEarn) && (
        <div style={{
          position: 'absolute', top: -4, right: -4, width: 14, height: 14, borderRadius: 7,
          background: isEarn ? C.gold : C.green,
          border: '2px solid rgba(255,255,255,0.9)',
          boxShadow: `0 0 8px ${isEarn ? C.gold : C.green}55`,
        }}>
          <div style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            background: isEarn ? C.gold : C.green, opacity: 0.25,
            animation: 'pulse3 2s ease-in-out infinite',
          }} />
        </div>
      )}
    </div>
  );
}

/* ── User position dot ── */
function UserDot({ dark }) {
  return (
    <div style={{ position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)', zIndex: 15 }}>
      <div style={{ position: 'relative', width: 20, height: 20 }}>
        <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: C.orange, opacity: 0.12, animation: 'pulse3 2.5s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: C.orange, opacity: 0.2 }} />
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.orange, border: '3px solid #fff', boxShadow: `0 2px 12px ${C.orangeGlow}` }} />
      </div>
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: dark ? 'rgba(255,255,255,0.4)' : C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1 }}>You</span>
      </div>
    </div>
  );
}

/* ── The Field (spatial canvas) ── */
function ExpeditionField({ mode, focused, onFocus, onBlur, passes, onStats }) {
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const tick = () => { setTime(performance.now()); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = mode === 'find' ? FIELD_ITEMS : EARN_ITEMS;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <ContourBG />
      <UserDot />

      {/* Distance rings */}
      {[35, 55, 75].map((r, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: `${14 - r/2}%`, left: '50%',
          width: `${r * 2}%`, height: `${r}%`,
          transform: 'translateX(-50%)',
          border: `1px dashed rgba(0,0,0,0.04)`,
          borderRadius: '50%', pointerEvents: 'none',
        }} />
      ))}

      {/* Floating items */}
      {items.map(item => (
        <FieldItem
          key={item.id} item={item} mode={mode} time={time}
          focused={focused} onTap={onFocus}
          fieldFocused={focused !== null}
        />
      ))}

      {/* Active pass indicators at bottom */}
      {passes.length > 0 && (
        <div style={{
          position: 'absolute', bottom: 74, left: 20, right: 20,
          display: 'flex', gap: 6, justifyContent: 'center', zIndex: 25,
        }}>
          {passes.map(p => (
            <div key={p.id} style={{
              padding: '5px 10px', borderRadius: 10,
              background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
              fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: C.font,
              boxShadow: `0 3px 10px ${C.orangeGlow}`,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {I.bolt('#fff')} {p.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { FIELD_ITEMS, EARN_ITEMS, ContourBG, FieldItem, UserDot, ExpeditionField });

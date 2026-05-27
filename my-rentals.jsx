// RoamRide — My Rentals: active bookings, upcoming, past history for renters

/* ── Sample data ── */
const MY_RENTALS_ACTIVE = [
  { id: 'ra1', name: 'E-Bike Cruiser', type: 'bike', price: '$18/hr', owner: 'Jamie L.', ownerRating: '4.9', pickup: 'May 17, 2:00 PM', returnBy: 'May 17, 6:00 PM', timeLeft: '1h 24m', deposit: '$45', status: 'active' },
];

const MY_RENTALS_UPCOMING = [
  { id: 'ru1', name: 'Camera Kit', type: 'camera', price: '$35/hr', owner: 'Sam R.', pickup: 'May 19, 10:00 AM', returnBy: 'May 19, 4:00 PM', deposit: '$80', status: 'confirmed' },
  { id: 'ru2', name: 'Paddleboard', type: 'paddle', price: '$22/hr', owner: 'River K.', pickup: 'May 22, 9:00 AM', returnBy: 'May 22, 1:00 PM', deposit: '$30', status: 'pending' },
];

const MY_RENTALS_PAST = [
  { id: 'rp1', name: 'Scooter Pro', type: 'scooter', price: '$12/hr', owner: 'Taylor M.', date: 'May 12', duration: '3 hrs', total: '$36', deposit: 'Released', condition: 'clean', rating: 5 },
  { id: 'rp2', name: 'Drill Set', type: 'tool', price: '$8/hr', owner: 'Casey N.', date: 'May 8', duration: '2 hrs', total: '$16', deposit: 'Released', condition: 'clean', rating: 4 },
  { id: 'rp3', name: 'E-Bike Cruiser', type: 'bike', price: '$18/hr', owner: 'Jamie L.', date: 'Apr 30', duration: '4 hrs', total: '$72', deposit: 'Released', condition: 'clean', rating: 5 },
  { id: 'rp4', name: 'Camera Kit', type: 'camera', price: '$35/hr', owner: 'Sam R.', date: 'Apr 22', duration: '6 hrs', total: '$210', deposit: 'Released', condition: 'minor-note', rating: 4 },
];

/* ── Active Rental Card ── */
function ActiveRentalCard({ rental, onTap, onReturn, time, onChat }) {
  const pulse = Math.sin((time || 0) / 800) * 0.03;
  const typeColors = { bike: ['#FF9A56','#FF6B35'], paddle: ['#34D399','#10B981'], camera: ['#FBBF24','#F59E0B'], scooter: ['#A78BFA','#7C5CE0'], tool: ['#6EE7B7','#2ABF5E'] };
  const gc = typeColors[rental.type] || typeColors.bike;

  return (
    <div style={{
      borderRadius: 24, overflow: 'hidden', background: C.dark,
      boxShadow: `0 12px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.04)`,
    }}>
      {/* Header with photo */}
      <div style={{ position: 'relative', height: 100 }}>
        <img src={PHOTOS[rental.type]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 20%, rgba(26,23,20,0.85))' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.45)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.2 }}>Active now</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: C.font, letterSpacing: -0.4 }}>{rental.name}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Dot color={C.green} size={8} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: C.font }}>Live</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 16px' }}>
        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderRadius: 16,
          background: `linear-gradient(135deg, ${C.orange}18, ${C.orange}08)`,
          border: `1px solid ${C.orange}25`, marginBottom: 12,
          transform: `scale(${1 + pulse})`, transition: 'transform 0.1s linear',
        }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: C.orange, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.8 }}>Time remaining</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: C.font, letterSpacing: -1.5, lineHeight: 1 }}>{rental.timeLeft}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.35)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.5 }}>Return by</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: C.font }}>{rental.returnBy.split(', ')[1]}</div>
          </div>
        </div>

        {/* Details row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[
            { l: 'Owner', v: rental.owner },
            { l: 'Rate', v: rental.price },
            { l: 'Deposit', v: rental.deposit },
          ].map(m => (
            <div key={m.l} style={{ flex: 1, padding: '8px 6px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.l}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontFamily: C.font, marginTop: 2 }}>{m.v}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Press onTap={onChat} scale={0.97} style={{ flex: 0 }}>
            <div style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 4h14a2 2 0 012 2v7a2 2 0 01-2 2H7l-4 3V6a2 2 0 012-2z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            </div>
          </Press>
          <Press onTap={onTap} scale={0.97} style={{ flex: 1 }}>
            <div style={{ padding: '12px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: C.font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {I.map('rgba(255,255,255,0.5)')} Details
            </div>
          </Press>
          <Press onTap={onReturn} scale={0.97} style={{ flex: 1 }}>
            <div style={{ padding: '12px', borderRadius: 14, background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: C.font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: `0 4px 14px ${C.orangeGlow}` }}>
              {I.camera('#fff')} Return
            </div>
          </Press>
        </div>
      </div>
    </div>
  );
}

/* ── Upcoming Card ── */
function UpcomingCard({ rental, onTap }) {
  const statusMap = {
    confirmed: { color: C.green, bg: C.greenBg, label: 'Confirmed' },
    pending: { color: C.gold, bg: `${C.gold}12`, label: 'Pending' },
  };
  const s = statusMap[rental.status] || statusMap.confirmed;

  return (
    <Press onTap={onTap} scale={0.97}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', borderRadius: 20, background: C.white,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, overflow: 'hidden', flexShrink: 0 }}>
          <img src={PHOTOS[rental.type]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.2 }}>{rental.name}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: s.color, fontFamily: C.font, padding: '2px 8px', borderRadius: 8, background: s.bg }}>{s.label}</span>
          </div>
          <div style={{ fontSize: 11, color: C.text2, fontFamily: C.font, marginBottom: 2 }}>{rental.pickup}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.orange, fontFamily: C.font }}>{rental.price}</span>
            <span style={{ fontSize: 10, color: C.text3 }}>·</span>
            <span style={{ fontSize: 11, color: C.text2, fontFamily: C.font }}>from {rental.owner}</span>
          </div>
        </div>
      </div>
    </Press>
  );
}

/* ── Past Rental Row ── */
function PastRentalRow({ rental }) {
  const conditionMap = {
    clean: { color: C.green, label: 'Clean return', icon: I.check(C.green) },
    'minor-note': { color: C.gold, label: 'Minor note', icon: I.shield(C.gold) },
    dispute: { color: '#FF4E4E', label: 'Dispute', icon: I.close('#FF4E4E') },
  };
  const cond = conditionMap[rental.condition] || conditionMap.clean;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', borderRadius: 18, background: C.white,
      boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
    }}>
      <DuoIcon type={rental.type} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: C.font, color: C.text }}>{rental.name}</span>
          <span style={{ fontSize: 13, fontWeight: 800, fontFamily: C.font, color: C.text }}>{rental.total}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: C.text2, fontFamily: C.font }}>{rental.date}</span>
          <span style={{ fontSize: 10, color: C.text3 }}>·</span>
          <span style={{ fontSize: 11, color: C.text2, fontFamily: C.font }}>{rental.duration}</span>
          <span style={{ fontSize: 10, color: C.text3 }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, color: cond.color, fontFamily: C.font }}>{cond.icon} {cond.label}</span>
        </div>
      </div>
    </div>
  );
}

/* ━━━ MAIN: My Rentals Screen ━━━ */
function MyRentals({ onBack, onActiveDetail, onReturn }) {
  const [time, setTime] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);
  React.useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 30 }}>
        <IntakeHeader title="My rentals" sub="Renter" onBack={onBack} />

        {/* Quick stats */}
        <div style={{ padding: '0 20px 14px', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(8px)', transition: 'all 0.4s ease' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { v: '5', l: 'Clean returns', c: C.green },
              { v: '$185', l: 'Saved on deposits', c: C.orange },
              { v: '4.9', l: 'Avg rating given', c: C.gold },
            ].map(m => (
              <div key={m.l} style={{ flex: 1, padding: '12px 6px', borderRadius: 16, background: C.white, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: C.font, color: m.c, letterSpacing: -0.5 }}>{m.v}</div>
                <div style={{ fontSize: 9, color: C.text2, fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active */}
        {MY_RENTALS_ACTIVE.length > 0 && (
          <div style={{ padding: '0 20px 16px', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease 0.1s' }}>
            <div style={{ fontSize: 15, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.2, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dot color={C.green} size={8} /> Active now
            </div>
            {MY_RENTALS_ACTIVE.map(r => (
              <ActiveRentalCard key={r.id} rental={r} time={time} onTap={() => onActiveDetail?.(r)} onReturn={() => onReturn?.(r)} />
            ))}
          </div>
        )}

        {/* Upcoming */}
        {MY_RENTALS_UPCOMING.length > 0 && (
          <div style={{ padding: '0 20px 16px', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease 0.15s' }}>
            <div style={{ fontSize: 15, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.2, marginBottom: 10 }}>Upcoming</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MY_RENTALS_UPCOMING.map(r => (
                <UpcomingCard key={r.id} rental={r} onTap={() => {}} />
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        <div style={{ padding: '0 20px 16px', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease 0.2s' }}>
          <div style={{ fontSize: 15, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.2, marginBottom: 10 }}>Past rentals</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MY_RENTALS_PAST.map(r => <PastRentalRow key={r.id} rental={r} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━ ACTIVITY HUB ━━━ */
function ActivityHub({ onBack, onActiveDetail, onReturn, onAddListing, onChat }) {
  const [tab, setTab] = React.useState('rentals'); // rentals | listings
  const [loaded, setLoaded] = React.useState(false);
  const [time, setTime] = React.useState(0);
  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);
  React.useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 30 }}>
        <IntakeHeader title="Activity" onBack={onBack} />

        {/* Tab switcher */}
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: 4 }}>
          {['rentals', 'listings'].map(t => (
            <Press key={t} onTap={() => setTab(t)} scale={0.95}>
              <div style={{ padding: '9px 18px', borderRadius: 14, background: tab === t ? C.text : C.white, fontSize: 13, fontWeight: 700, fontFamily: C.font, color: tab === t ? '#fff' : C.text2, transition: 'all 0.25s ease' }}>
                {t === 'rentals' ? 'My Rentals' : 'My Listings'}
              </div>
            </Press>
          ))}
        </div>

        {tab === 'rentals' ? (
          <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            {/* Quick stats */}
            <div style={{ padding: '0 20px 14px' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ v: '5', l: 'Clean returns', c: C.green }, { v: '$185', l: 'Saved', c: C.orange }, { v: '4.9', l: 'Avg rating', c: C.gold }].map(m => (
                  <div key={m.l} style={{ flex: 1, padding: '12px 6px', borderRadius: 16, background: C.white, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: C.font, color: m.c, letterSpacing: -0.5 }}>{m.v}</div>
                    <div style={{ fontSize: 9, color: C.text2, fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active */}
            {MY_RENTALS_ACTIVE.length > 0 && (
              <div style={{ padding: '0 20px 14px' }}>
                <div style={{ fontSize: 14, fontWeight: 750, fontFamily: C.font, color: C.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Dot color={C.green} size={7} /> Active now</div>
                {MY_RENTALS_ACTIVE.map(r => (
                  <ActiveRentalCard key={r.id} rental={r} time={time} onTap={() => onActiveDetail?.(r)} onReturn={() => onReturn?.(r)} onChat={onChat} />
                ))}
              </div>
            )}

            {/* Upcoming */}
            {MY_RENTALS_UPCOMING.length > 0 && (
              <div style={{ padding: '0 20px 14px' }}>
                <div style={{ fontSize: 14, fontWeight: 750, fontFamily: C.font, color: C.text, marginBottom: 8 }}>Upcoming</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{MY_RENTALS_UPCOMING.map(r => <UpcomingCard key={r.id} rental={r} onTap={() => {}} />)}</div>
              </div>
            )}

            {/* Past */}
            <div style={{ padding: '0 20px 14px' }}>
              <div style={{ fontSize: 14, fontWeight: 750, fontFamily: C.font, color: C.text, marginBottom: 8 }}>Past</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{MY_RENTALS_PAST.slice(0, 3).map(r => <PastRentalRow key={r.id} rental={r} />)}</div>
            </div>
          </div>
        ) : (
          <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            <MyListingsInner time={time} onAddListing={onAddListing} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━ QUICK CHAT (canned messages) ━━━ */
function QuickChat({ onBack }) {
  const [msgs, setMsgs] = React.useState([
    { id: 1, from: 'owner', text: 'Hi! The bike is ready for pickup at the front porch.', time: '2:01 PM' },
    { id: 2, from: 'owner', text: 'Lock combo is 4821.', time: '2:01 PM' },
  ]);
  const canned = ['On my way!', 'Running 5 min late', 'Can I extend 1 hour?', 'All good, thanks!', 'Where exactly is pickup?', 'Returning now'];

  const send = (text) => setMsgs(prev => [...prev, { id: Date.now(), from: 'me', text, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58 }}>
      <IntakeHeader title="Jamie L." sub="E-Bike Cruiser" onBack={onBack} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {msgs.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '78%', padding: '10px 14px', borderRadius: 18,
              background: m.from === 'me' ? C.orange : C.white,
              color: m.from === 'me' ? '#fff' : C.text,
              fontSize: 13, fontFamily: C.font, fontWeight: 500, lineHeight: 1.4,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              borderBottomRightRadius: m.from === 'me' ? 6 : 18,
              borderBottomLeftRadius: m.from === 'me' ? 18 : 6,
            }}>
              {m.text}
              <div style={{ fontSize: 9, color: m.from === 'me' ? 'rgba(255,255,255,0.6)' : C.text3, fontFamily: C.font, marginTop: 3, textAlign: 'right' }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 16px 28px', borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {canned.map(c => (
            <Press key={c} onTap={() => send(c)} scale={0.93}>
              <div style={{ padding: '8px 14px', borderRadius: 20, background: C.white, border: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, fontFamily: C.font, color: C.text, whiteSpace: 'nowrap' }}>{c}</div>
            </Press>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MyRentals, ActivityHub, QuickChat });

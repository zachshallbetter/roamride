// RoamRide — My Listings: host dashboard with listed items, active renters, earnings

/* ── Sample data ── */
const MY_LISTINGS = [
  { id: 'l1', name: 'Mountain Bike — Trek', type: 'bike', price: '$18/hr', status: 'rented', renter: 'Alex P.', renterRating: '4.8', returnBy: 'May 17, 6:00 PM', timeLeft: '1h 24m', totalEarned: '$482', thisMonth: '$156', rentals: 12, rating: '4.9' },
  { id: 'l2', name: 'Canon EOS R6 Kit', type: 'camera', price: '$35/hr', status: 'available', totalEarned: '$310', thisMonth: '$70', rentals: 6, rating: '5.0', views: 24, saves: 8 },
  { id: 'l3', name: 'Paddleboard + Paddle', type: 'paddle', price: '$22/hr', status: 'available', totalEarned: '$198', thisMonth: '$44', rentals: 5, rating: '4.8', views: 31, saves: 12 },
  { id: 'l4', name: 'DeWalt Drill Set', type: 'tool', price: '$8/hr', status: 'paused', totalEarned: '$96', thisMonth: '$0', rentals: 8, rating: '4.7', pauseReason: 'You paused this listing' },
];

const MY_LISTING_ACTIVITY = [
  { id: 'a1', listingName: 'Mountain Bike — Trek', type: 'bike', renter: 'Alex P.', date: 'May 17', duration: '4 hrs', earned: '$72', status: 'active' },
  { id: 'a2', listingName: 'Canon EOS R6 Kit', type: 'camera', renter: 'Jordan S.', date: 'May 14', duration: '6 hrs', earned: '$210', status: 'completed' },
  { id: 'a3', listingName: 'Mountain Bike — Trek', type: 'bike', renter: 'Riley T.', date: 'May 11', duration: '3 hrs', earned: '$54', status: 'completed' },
  { id: 'a4', listingName: 'Paddleboard + Paddle', type: 'paddle', renter: 'Morgan F.', date: 'May 9', duration: '4 hrs', earned: '$88', status: 'completed' },
  { id: 'a5', listingName: 'DeWalt Drill Set', type: 'tool', renter: 'Casey N.', date: 'May 5', duration: '2 hrs', earned: '$16', status: 'completed' },
];

/* ── Earnings Header Card ── */
function EarningsCard({ loaded }) {
  const total = MY_LISTINGS.reduce((s, l) => s + parseInt(l.thisMonth.replace('$', '')), 0);
  const pendingCount = MY_LISTINGS.filter(l => l.status === 'rented').length;

  return (
    <div style={{
      borderRadius: 24, overflow: 'hidden', position: 'relative',
      background: C.dark, boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
      opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(10px)',
      transition: 'all 0.5s ease',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
        <svg width="100%" height="100%"><defs><pattern id="eGrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0v30H0" fill="none" stroke="#fff" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#eGrid)" /></svg>
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '20px 20px 18px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>This month</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: C.green, fontFamily: C.font, letterSpacing: -2, lineHeight: 1 }}>${total}</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: C.font }}>
              {pendingCount > 0 ? `${pendingCount} item rented now` : 'No active rentals'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { v: MY_LISTINGS.length, l: 'Listings', c: '#fff' },
            { v: MY_LISTINGS.reduce((s, l) => s + l.rentals, 0), l: 'Total rentals', c: C.orange },
            { v: MY_LISTINGS.reduce((s, l) => s + parseInt(l.totalEarned.replace('$', '')), 0), l: 'All-time', c: C.green, prefix: '$' },
          ].map(m => (
            <div key={m.l} style={{ flex: 1, padding: '10px 6px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: C.font, color: m.c, letterSpacing: -0.5 }}>{m.prefix || ''}{m.v}</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Listing Card ── */
function ListingCard({ listing, onTap, time }) {
  const statusMap = {
    rented: { color: C.green, bg: C.greenBg, label: 'Rented out', dot: true },
    available: { color: C.blue, bg: `${C.blue}08`, label: 'Available', dot: false },
    paused: { color: C.text3, bg: `${C.text3}10`, label: 'Paused', dot: false },
    review: { color: C.gold, bg: `${C.gold}10`, label: 'In review', dot: false },
  };
  const s = statusMap[listing.status] || statusMap.available;
  const isRented = listing.status === 'rented';
  const pulse = isRented ? Math.sin((time || 0) / 1000) * 0.5 : 0;

  return (
    <Press onTap={onTap} scale={0.97}>
      <div style={{
        borderRadius: 22, overflow: 'hidden', background: C.white,
        boxShadow: '0 3px 14px rgba(0,0,0,0.05)',
        border: isRented ? `1.5px solid ${C.green}20` : `1px solid ${C.border}`,
      }}>
        {/* Photo + status */}
        <div style={{ position: 'relative', height: 88 }}>
          <img src={PHOTOS[listing.type]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.35))' }} />
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <span style={{
              padding: '4px 10px', borderRadius: 10, fontSize: 10, fontWeight: 700, fontFamily: C.font,
              color: s.color, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {s.dot && <div style={{ width: 6, height: 6, borderRadius: 3, background: s.color, opacity: 0.6 + pulse }} />}
              {s.label}
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', gap: 4 }}>
            <span style={{ padding: '3px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: C.font }}>{listing.price}</span>
          </div>
        </div>

        <div style={{ padding: '10px 14px 12px' }}>
          <div style={{ fontSize: 14, fontWeight: 750, fontFamily: C.font, color: C.text, letterSpacing: -0.2, marginBottom: 4 }}>{listing.name}</div>

          {/* Rented-out details */}
          {isRented && (
            <div style={{
              padding: '8px 12px', borderRadius: 12, background: `${C.green}06`,
              border: `1px solid ${C.green}12`, marginBottom: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 8, background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', fontFamily: C.font }}>{listing.renter[0]}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, fontFamily: C.font, color: C.text }}>{listing.renter}</div>
                  <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font }}>Returns {listing.returnBy.split(', ')[1]}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.orange, fontFamily: C.font }}>{listing.timeLeft}</div>
                <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font }}>remaining</div>
              </div>
            </div>
          )}

          {/* Available: views/saves */}
          {listing.status === 'available' && listing.views && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: C.text2, fontFamily: C.font, display: 'flex', alignItems: 'center', gap: 3 }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke={C.text3} strokeWidth="1.5" /><path d="M1 8c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5c-1.5 3.5-4.5 5-7 5S2.5 11.5 1 8z" stroke={C.text3} strokeWidth="1.3" /></svg>
                {listing.views} views
              </span>
              <span style={{ fontSize: 11, color: C.text2, fontFamily: C.font, display: 'flex', alignItems: 'center', gap: 3 }}>
                {I.heart(C.text3)} {listing.saves} saves
              </span>
            </div>
          )}

          {/* Paused */}
          {listing.status === 'paused' && (
            <div style={{ fontSize: 11, color: C.text3, fontFamily: C.font, fontStyle: 'italic', marginBottom: 6 }}>{listing.pauseReason}</div>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: C.font }}>{listing.thisMonth} this mo</span>
            <span style={{ fontSize: 10, color: C.text3 }}>·</span>
            <span style={{ fontSize: 11, color: C.text2, fontFamily: C.font }}>{listing.rentals} rentals</span>
            <span style={{ fontSize: 10, color: C.text3 }}>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontFamily: C.font, color: C.text }}>{I.star()} {listing.rating}</span>
          </div>
        </div>
      </div>
    </Press>
  );
}

/* ── Rental Activity Row ── */
function ActivityRow({ activity }) {
  const isActive = activity.status === 'active';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', borderRadius: 16, background: C.white,
      boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
      border: isActive ? `1.5px solid ${C.green}20` : 'none',
    }}>
      <DuoIcon type={activity.type} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: C.font, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activity.renter}</span>
          <span style={{ fontSize: 13, fontWeight: 800, fontFamily: C.font, color: C.green, flexShrink: 0 }}>+{activity.earned}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: C.text2, fontFamily: C.font }}>{activity.date}</span>
          <span style={{ fontSize: 10, color: C.text3 }}>·</span>
          <span style={{ fontSize: 10, color: C.text2, fontFamily: C.font }}>{activity.duration}</span>
          {isActive && (
            <><span style={{ fontSize: 10, color: C.text3 }}>·</span><span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: C.green, fontFamily: C.font }}><Dot color={C.green} size={5} /> Active</span></>
          )}
        </div>
      </div>
    </div>
  );
}

/* ━━━ MAIN: My Listings Screen ━━━ */
function MyListings({ onBack, onAddListing }) {
  const [time, setTime] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);
  const [tab, setTab] = React.useState('listings'); // listings | activity
  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);
  React.useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 90 }}>
        <IntakeHeader title="My listings" sub="Host" onBack={onBack} />

        {/* Earnings card */}
        <div style={{ padding: '0 20px 14px' }}>
          <EarningsCard loaded={loaded} />
        </div>

        {/* Tab switcher */}
        <div style={{ padding: '0 20px 12px', display: 'flex', gap: 4 }}>
          {['listings', 'activity'].map(t => (
            <Press key={t} onTap={() => setTab(t)} scale={0.95}>
              <div style={{
                padding: '9px 18px', borderRadius: 14,
                background: tab === t ? C.text : C.white,
                fontSize: 13, fontWeight: 700, fontFamily: C.font,
                color: tab === t ? '#fff' : C.text2,
                transition: 'all 0.25s ease',
              }}>{t === 'listings' ? `Items (${MY_LISTINGS.length})` : `Activity (${MY_LISTING_ACTIVITY.length})`}</div>
            </Press>
          ))}
        </div>

        {/* Listings tab */}
        {tab === 'listings' && (
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12, opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(10px)', transition: 'all 0.4s ease 0.1s' }}>
            {MY_LISTINGS.map(l => (
              <ListingCard key={l.id} listing={l} time={time} onTap={() => {}} />
            ))}
          </div>
        )}

        {/* Activity tab */}
        {tab === 'activity' && (
          <div style={{ padding: '0 20px', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(10px)', transition: 'all 0.4s ease 0.1s' }}>
            {/* Active first */}
            {MY_LISTING_ACTIVITY.filter(a => a.status === 'active').length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 750, fontFamily: C.font, color: C.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Dot color={C.green} size={7} /> Currently rented
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {MY_LISTING_ACTIVITY.filter(a => a.status === 'active').map(a => <ActivityRow key={a.id} activity={a} />)}
                </div>
              </div>
            )}
            {/* Completed */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 750, fontFamily: C.font, color: C.text, marginBottom: 8 }}>Completed</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {MY_LISTING_ACTIVITY.filter(a => a.status === 'completed').map(a => <ActivityRow key={a.id} activity={a} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add listing CTA */}
      <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20, zIndex: 40 }}>
        <Press onTap={onAddListing} scale={0.97}>
          <div style={{
            background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50,
            padding: '16px', textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: 750, fontFamily: C.font,
            boxShadow: `0 6px 24px ${C.orangeGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>{I.scan('#fff')} Add new listing</div>
        </Press>
      </div>
    </div>
  );
}

/* ── Listings inner content (for embedding in ActivityHub) ── */
function MyListingsInner({ time, onAddListing }) {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);
  const total = MY_LISTINGS.reduce((s, l) => s + parseInt(l.thisMonth.replace('$', '')), 0);

  return (
    <div>
      {/* Earnings summary */}
      <div style={{ padding: '0 20px 14px', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ v: `$${total}`, l: 'This month', c: C.green }, { v: MY_LISTINGS.length, l: 'Listings', c: '#fff' }, { v: MY_LISTINGS.filter(l => l.status === 'rented').length, l: 'Rented now', c: C.orange }].map(m => (
            <div key={m.l} style={{ flex: 1, padding: '12px 6px', borderRadius: 16, background: C.white, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: C.font, color: m.c === '#fff' ? C.text : m.c, letterSpacing: -0.5 }}>{m.v}</div>
              <div style={{ fontSize: 9, color: C.text2, fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 2 }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12, opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease 0.1s' }}>
        {MY_LISTINGS.map(l => <ListingCard key={l.id} listing={l} time={time} onTap={() => {}} />)}
      </div>
      <div style={{ padding: '14px 20px' }}>
        <Press onTap={onAddListing} scale={0.97}>
          <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '14px', textAlign: 'center', color: '#fff', fontSize: 14, fontWeight: 750, fontFamily: C.font, boxShadow: `0 4px 16px ${C.orangeGlow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{I.scan('#fff')} Add listing</div>
        </Press>
      </div>
    </div>
  );
}

Object.assign(window, { MyListings, MyListingsInner });

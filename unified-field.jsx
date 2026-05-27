// RoamRide Unified — Expedition field items with real photos, active rental pill, trust indicator

/* ── Field items with photos ── */
const UNI_ITEMS = [
  { id: 'f1', name: 'E-Bike Cruiser', price: '$18/hr', type: 'bike', rating: '4.9', distance: '0.6 mi', vibe: 'Perfect for a sunset loop.', deposit: '$45', instant: true, verified: true, x: 58, y: 14, phase: 0, amp: 5, saved: '$15' },
  { id: 'f2', name: 'Paddleboard', price: '$22/hr', type: 'paddle', rating: '4.8', distance: '0.3 mi', vibe: 'Calm water. Zero effort.', deposit: '$30', instant: true, verified: true, x: 5, y: 68, phase: 1.2, amp: 6, saved: '$10' },
  { id: 'f3', name: 'Camera Kit', price: '$35/hr', type: 'camera', rating: '5.0', distance: '1.2 mi', vibe: 'Street photography starter.', deposit: '$80', instant: true, verified: true, x: 68, y: 60, phase: 2.4, amp: 4, saved: '$20' },
  { id: 'f4', name: 'Scooter Pro', price: '$12/hr', type: 'scooter', rating: '4.7', distance: '0.4 mi', vibe: 'Zip through the neighborhood.', deposit: '$25', instant: true, verified: false, x: 14, y: 22, phase: 0.8, amp: 5, saved: null },
  { id: 'f5', name: 'Drill Set', price: '$8/hr', type: 'tool', rating: '4.9', distance: '0.8 mi', vibe: 'Fix that shelf. Finally.', deposit: '$40', instant: true, verified: true, x: 60, y: 82, phase: 3.6, amp: 4, saved: '$10' },
];

/* ── Photo-based field item ── */
function UniFieldItem({ item, time, focused, onTap, panOffset, fav, onFav }) {
  const float = Math.sin(time / 1000 + item.phase) * item.amp;
  const floatX = Math.cos(time / 1400 + item.phase * 0.7) * (item.amp * 0.4);
  const isFocused = focused === item.id;
  const anyFocused = focused !== null;
  const hiding = anyFocused && !isFocused;
  const px = panOffset ? panOffset.x * 1.3 : 0;
  const py = panOffset ? panOffset.y * 1.3 : 0;

  const typeColors = { bike: '#FF6B35', paddle: '#10B981', camera: '#F59E0B', scooter: '#7C5CE0', tool: '#2ABF5E' };
  const tc = typeColors[item.type] || '#FF6B35';

  return (
    <div onClick={() => !hiding && onTap(item)} style={{
      position: 'absolute', left: `${item.x}%`, top: `${item.y}%`,
      transform: `translate(calc(-50% + ${px}px), calc(${-50 + float}% + ${py}px)) translateX(${floatX}px) scale(${hiding ? 0.6 : isFocused ? 1.05 : 1})`,
      opacity: hiding ? 0.15 : 1,
      transition: 'opacity 0.35s ease',
      cursor: 'pointer', zIndex: isFocused ? 20 : 5,
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{
        width: 128, borderRadius: 18, overflow: 'hidden',
        background: C.white,
        boxShadow: `0 8px 28px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.05)`,
        border: `2px solid ${isFocused ? tc : 'rgba(255,255,255,0.8)'}`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}>
        {/* Photo */}
        <div style={{ height: 78, position: 'relative', overflow: 'hidden' }}>
          <img src={PHOTOS[item.type]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 55%, rgba(0,0,0,0.2))' }} />
          {item.instant && (
            <div style={{ position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderRadius: 6, background: C.green, border: '2px solid #fff', boxShadow: `0 0 8px ${C.green}55` }}>
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: C.green, opacity: 0.2, animation: 'pulse3 2s ease-in-out infinite' }} />
            </div>
          )}
        </div>
        {/* Info */}
        <div style={{ padding: '8px 10px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 750, fontFamily: C.font, color: C.text, lineHeight: 1.2, marginBottom: 3 }}>{item.name}</div>
            {onFav && <div onClick={(e) => { e.stopPropagation(); onFav(); }} style={{ cursor: 'pointer', padding: 2 }}>{fav ? I.heartFill(C.orange) : I.heart(C.text3)}</div>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.orange, fontFamily: C.font }}>{item.price}</span>
            <span style={{ fontSize: 10, color: C.text3, fontFamily: C.font }}>{item.distance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Active rental pill (persistent) ── */
function ActiveRentalPill({ item, timeLeft, onTap }) {
  if (!item) return null;
  return (
    <Press onTap={onTap} scale={0.95}>
      <div style={{
        position: 'absolute', top: 58, left: 16, right: 16, zIndex: 35,
        padding: '10px 14px', borderRadius: 18,
        background: C.dark, boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, overflow: 'hidden' }}>
            <img src={PHOTOS[item.type]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <Dot color={C.green} size={8} style={{ position: 'absolute', top: -2, right: -2, border: '2px solid ' + C.dark, borderRadius: 6 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: C.font }}>{item.name}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: C.font }}>{timeLeft} remaining</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, fontFamily: C.font }}>Active</div>
          {I.arrow(C.orange)}
        </div>
      </div>
    </Press>
  );
}

/* ── Trust avatar (with level indicator) ── */
function TrustAvatar({ level, onTap, notifications }) {
  return (
    <Press onTap={onTap} scale={0.9}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 14,
          background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, fontFamily: C.font, color: '#fff',
          boxShadow: `0 4px 14px ${C.orangeGlow}`,
        }}>A</div>
        {notifications > 0 && (
          <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, background: '#FF4E4E', border: '2px solid ' + C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff', fontFamily: C.font }}>{notifications}</div>
        )}
      </div>
    </Press>
  );
}

/* ── Enhanced Focus Overlay with map + inline identity ── */
function UniFocusOverlay({ item, onUnlock, onClose, trustLevel, onVerify }) {
  const [show, setShow] = React.useState(false);
  const [verifyInline, setVerifyInline] = React.useState(false);
  const [verified, setVerified] = React.useState(trustLevel >= 3);
  React.useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setShow(true))); }, []);

  const needsVerify = !verified && item.deposit && parseInt(item.deposit.replace('$','')) > 30;
  const dismiss = () => { setShow(false); setTimeout(onClose, 300); };

  const doVerify = () => {
    setVerifyInline(true);
    setTimeout(() => { setVerified(true); setVerifyInline(false); if (onVerify) onVerify(); }, 2000);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', opacity: show ? 1 : 0, transition: 'opacity 0.3s ease' }} />
      <div style={{
        position: 'relative', zIndex: 1, background: C.white, borderRadius: '28px 28px 0 0',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s cubic-bezier(.32,.72,.37,1.02)',
        maxHeight: '78%', overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
        </div>

        {/* Photo header */}
        <div style={{ margin: '0 16px', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
          <AssetImg type={item.type} h={140} overlay={false} radius={18}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.35))' }} />
            <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 4 }}>
              {item.instant && <GBadge label="Instant" icon={I.bolt('#fff')} />}
              {item.verified && <GBadge label="Verified" icon={I.shield('#fff')} />}
            </div>
          </AssetImg>
        </div>

        <div style={{ padding: '0 20px 24px' }}>
          {/* Name + rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <DuoIcon type={item.type} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: C.font, color: C.text, letterSpacing: -0.4 }}>{item.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {I.star()}<span style={{ fontSize: 13, fontWeight: 700, fontFamily: C.font, color: C.text }}>{item.rating}</span>
                <span style={{ color: C.text3 }}>·</span>
                <span style={{ fontSize: 12, color: C.text2, fontFamily: C.font }}>{item.distance}</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: C.text2, fontFamily: C.font, lineHeight: 1.5, marginTop: 8, marginBottom: 14 }}>"{item.vibe}"</div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[{ l: 'Price', v: item.price, c: C.orange }, { l: 'Hold', v: item.deposit, c: C.text }, { l: 'Rating', v: item.rating, c: C.gold }].map(s => (
              <div key={s.l} style={{ flex: 1, padding: '12px 8px', borderRadius: 16, background: C.bg, textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: C.text2, fontFamily: C.font, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.l}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.c, fontFamily: C.font, letterSpacing: -0.3, marginTop: 2 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Trust savings */}
          {item.saved && verified && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 14, background: C.greenBg, marginBottom: 14 }}>
              {I.shield(C.green)}
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: C.font, color: C.green }}>Deposit reduced {item.saved} by your trust level</span>
            </div>
          )}

          {/* Inline identity verification */}
          {needsVerify && !verifyInline && (
            <div style={{ padding: '14px 16px', borderRadius: 18, background: `${C.orange}06`, border: `1.5px solid ${C.orange}20`, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                {I.shield(C.orange)}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: C.font }}>Quick verification needed</div>
                  <div style={{ fontSize: 11, color: C.text2, fontFamily: C.font }}>High-value rental requires identity proof</div>
                </div>
              </div>
              <Press onTap={doVerify} scale={0.97}>
                <div style={{ padding: '11px', borderRadius: 50, background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: C.font, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{I.shield('#fff')} Verify now — 30 seconds</div>
              </Press>
            </div>
          )}
          {verifyInline && (
            <div style={{ padding: '18px', borderRadius: 18, background: `${C.orange}06`, border: `1.5px solid ${C.orange}20`, marginBottom: 14, textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, border: '3px solid rgba(255,107,53,0.2)', borderTopColor: C.orange, borderRadius: 16, animation: 'spin3 0.7s linear infinite', margin: '0 auto 8px' }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: C.font }}>Verifying…</div>
              <div style={{ fontSize: 11, color: C.text2, fontFamily: C.font, marginTop: 2 }}>We don't store your documents</div>
            </div>
          )}
          {verified && needsVerify === false && item.saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <GBadge label="Instant access" icon={I.bolt(C.orange)} variant="orange" />
              <GBadge label="Clean eligible" icon={I.check('#1A8A3E')} variant="green" />
            </div>
          )}

          {/* Map */}
          <div style={{ marginBottom: 14, borderRadius: 16, overflow: 'hidden' }}>
            <MiniMap h={90} style={{ borderRadius: 16 }} />
            <div style={{ padding: '8px 12px', background: C.bg, display: 'flex', alignItems: 'center', gap: 6, borderRadius: '0 0 16px 16px' }}>
              {I.map(C.orange)}
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: C.font, color: C.text }}>Self-pickup · {item.distance} away</span>
            </div>
          </div>

          {/* CTA */}
          <Press onTap={() => { if (!needsVerify || verified) { dismiss(); setTimeout(() => onUnlock(item), 350); } }} disabled={needsVerify && !verified} scale={0.97}>
            <div style={{
              background: (needsVerify && !verified) ? C.border : `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
              borderRadius: 50, padding: '17px', textAlign: 'center',
              color: (needsVerify && !verified) ? C.text3 : '#fff',
              fontSize: 16, fontWeight: 750, fontFamily: C.font,
              boxShadow: (needsVerify && !verified) ? 'none' : `0 6px 24px ${C.orangeGlow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.3s ease',
            }}>{I.bolt((needsVerify && !verified) ? C.text3 : '#fff')} Unlock · {item.price}</div>
          </Press>
        </div>
      </div>
    </div>
  );
}

/* ── Stats overlay with trust progression ── */
function UniStats({ show, onClose, trustLevel, onMyRentals, onMyListings }) {
  if (!show) return null;
  const levelNames = { 1: 'New', 2: 'Verified', 3: 'Trusted', 4: 'Gold' };
  const levelPerks = { 1: [], 2: ['Lower deposits'], 3: ['Instant access', 'Lower deposits'], 4: ['Instant access', 'Lowest deposits', 'Priority booking'] };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, animation: 'fadeIn3 0.3s ease' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }} />
      <div style={{ position: 'relative', margin: '62px 16px 0', borderRadius: 26, background: C.dark, padding: '22px', color: '#fff', boxShadow: '0 12px 48px rgba(0,0,0,0.4)', animation: 'slideDown3 0.35s ease', maxHeight: 'calc(100% - 100px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrustAvatar level={trustLevel} />
            <div><div style={{ fontSize: 15, fontWeight: 750, fontFamily: C.font }}>Alex</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: C.font }}>Level {trustLevel} · {levelNames[trustLevel]}</div></div>
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

        {/* Navigation cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          <Press onTap={onMyRentals} scale={0.97}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 16,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: `${C.orange}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {I.compass(C.orange)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: C.font, color: '#fff' }}>My rentals</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: C.font }}>Active, upcoming &amp; past</div>
                </div>
              </div>
              {I.arrow('rgba(255,255,255,0.3)')}
            </div>
          </Press>
          <Press onTap={onMyListings} scale={0.97}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 16,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: `${C.green}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {I.dollar(C.green)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: C.font, color: '#fff' }}>My listings</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: C.font }}>Items, renters &amp; earnings</div>
                </div>
              </div>
              {I.arrow('rgba(255,255,255,0.3)')}
            </div>
          </Press>
        </div>

        {/* Trust perks */}
        <div style={{ padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Level {trustLevel} perks</div>
          {(levelPerks[trustLevel] || []).map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
              {I.check(C.green)}
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: C.font }}>{p}</span>
            </div>
          ))}
          {trustLevel < 4 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', opacity: 0.4 }}>
              {I.bolt(C.gold)}
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: C.font }}>Next: Level {trustLevel + 1} — {3 - trustLevel} more clean returns</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <GBadge label={`Level ${trustLevel}`} icon={I.shield('rgba(255,255,255,0.7)')} variant="dark" />
          <GBadge label="3 assets listed" icon={I.dollar('rgba(255,255,255,0.7)')} variant="dark" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { UNI_ITEMS, UniFieldItem, ActiveRentalPill, TrustAvatar, UniFocusOverlay, UniStats });

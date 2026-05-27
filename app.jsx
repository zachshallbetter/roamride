// RoamRide Unified — App shell: expedition field home + all flows

function UniApp() {
  const [state, setState] = React.useState('field');
  const [focused, setFocused] = React.useState(null);
  const [focusedItem, setFocusedItem] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);
  const [showStats, setShowStats] = React.useState(false);
  const [trustLevel, setTrustLevel] = React.useState(3);
  const [activeTab, setActiveTab] = React.useState('explore'); // explore | activity | earn
  const [filterType, setFilterType] = React.useState(null); // null = all
  const [favorites, setFavorites] = React.useState(new Set());
  const [showEarnMenu, setShowEarnMenu] = React.useState(false);
  const [notifications] = React.useState(2); // badge count

  const toggleFav = (id) => setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const onFocus = (item) => { setFocused(item.id); setFocusedItem(item); };
  const onBlur = () => { setFocused(null); setFocusedItem(null); };

  const onUnlock = (item) => {
    setActiveItem(item);
    setFocused(null); setFocusedItem(null);
    setState('renterBooking'); // Full renter intake flow
  };

  const backToField = () => { setState('field'); setActiveItem(null); };
  const onVerify = () => { if (trustLevel < 4) setTrustLevel(l => l + 1); };

  const mode = activeTab === 'earn' ? 'earn' : 'find';
  const isDark = state === 'active' || state === 'renterActive' || state === 'scan' || state === 'earn';

  // Render non-field states
  const nav = (s) => setState(s === 'start' ? 'field' : s);

  const renderContent = () => {
    switch (state) {
      // Renter flow: unlock → booking → payment → proof → confirm → pickup → active → return
      case 'renterBooking':
        return <RenterBooking nav={(s) => setState(s === 'start' ? 'field' : s)} item={activeItem} />;
      case 'renterPayment':
        return <RenterPayment nav={(s) => setState(s === 'start' ? 'field' : s)} />;
      case 'renterProof':
        return <RenterProof nav={(s) => setState(s === 'start' ? 'field' : s)} />;
      case 'renterConfirm':
        return <RenterConfirm nav={(s) => setState(s === 'start' ? 'field' : s)} />;
      case 'renterPickup':
        return <RenterPickup nav={(s) => setState(s === 'start' ? 'field' : s === 'renterActive' ? 'active' : s)} />;
      case 'active':
        return <ActiveSession item={activeItem} onReturn={() => setState('renterReturn')} />;
      case 'renterReturn':
        return <RenterReturn nav={(s) => { if (s === 'start' || s === 'field') { setTrustLevel(l => Math.min(4, l + 1)); backToField(); } else setState(s); }} />;
      case 'renterActive':
        return <RenterActive nav={(s) => setState(s === 'start' ? 'field' : s)} />;
      // Legacy pass (quick unlock without full booking)
      case 'pass':
        return <PassView item={activeItem} onStart={() => setState('active')} onBack={() => setState('field')} />;
      case 'return':
        return <RenterReturn nav={(s) => { if (s === 'start' || s === 'field') { setTrustLevel(l => Math.min(4, l + 1)); backToField(); } else setState(s); }} />;
      // Earn: garage reveal scanner
      case 'earn':
        return <GarageReveal onSelectItem={() => setState('scan')} onBack={() => setState('field')} />;
      case 'scan':
        return <ScanView4 onListed={() => setState('listed')} onBack={() => setState('earn')} />;
      case 'listed':
        return <ListedView4 onDone={backToField} />;
      // Dashboard screens
      case 'activity':
        return <ActivityHub onBack={backToField} onActiveDetail={() => setState('active')} onReturn={() => setState('renterReturn')} onAddListing={() => setState('ownerStart')} onChat={() => setState('chat')} />;
      case 'myRentals':
        return <MyRentals onBack={backToField} onActiveDetail={(r) => setState('active')} onReturn={() => setState('renterReturn')} />;
      case 'myListings':
        return <MyListings onBack={backToField} onAddListing={() => setState('ownerStart')} />;
      case 'chat':
        return <QuickChat onBack={() => setState('active')} />;
      // Owner listing flow
      case 'ownerStart': return <OwnerStart nav={nav} />;
      case 'ownerDetails': return <OwnerDetails nav={nav} />;
      case 'ownerPrice': return <OwnerPrice nav={nav} />;
      case 'ownerPayout': return <OwnerPayout nav={nav} />;
      case 'ownerReview': return <OwnerReview nav={nav} />;
      default: return null;
    }
  };

  // Draggable field
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const panStart = React.useRef(null);
  const panHandlers = {
    onPointerDown: (e) => { panStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }; e.currentTarget.setPointerCapture(e.pointerId); },
    onPointerMove: (e) => { if (!panStart.current) return; setPanOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y }); },
    onPointerUp: () => { panStart.current = null; },
    onPointerCancel: () => { panStart.current = null; },
  };

  // Animation time for field
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const tick = () => { setTime(performance.now()); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100vw',
      height: '100dvh',
      background: 'var(--wrapper-bg)',
      padding: 'var(--wrapper-padding)',
      overflow: 'hidden',
    }}>
      <IOSDevice dark={isDark}>
        <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
          {state === 'field' ? (
            <>
              <div style={{ position: 'absolute', inset: 0, background: C.bg }} />
              <NoiseOverlay opacity={0.02} />
              <ContourBG />

              {/* Header */}
              <div style={{ position: 'absolute', top: activeItem ? 100 : 56, left: 0, right: 0, zIndex: 30, padding: '6px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'top 0.3s ease' }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                    {mode === 'find' ? 'Expedition' : 'Demand Map'}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.text, fontFamily: C.font, letterSpacing: -0.6 }}>
                    {mode === 'find' ? 'Explore nearby' : "What's hot?"}
                  </div>
                </div>
                <TrustAvatar level={trustLevel} onTap={() => setShowStats(true)} notifications={notifications} />
              </div>

              {/* Active rental pill */}
              {activeItem && state === 'field' && (
                <ActiveRentalPill item={activeItem} timeLeft="1h 24m" onTap={() => setState('active')} />
              )}

              {/* Field items — draggable zone */}
              <div {...panHandlers} style={{ position: 'absolute', inset: 0, top: activeItem ? 140 : 110, bottom: 80, touchAction: 'none', cursor: 'grab' }}>
                {/* Parallax contours (move slower) */}
                <div style={{ position: 'absolute', inset: 0, transform: `translate(${panOffset.x * 0.3}px, ${panOffset.y * 0.3}px)`, transition: panStart.current ? 'none' : 'transform 0.3s ease' }}>
                  <ContourBG />
                  {/* Distance rings */}
                  {[30, 50].map((r, i) => (
                    <div key={i} style={{
                      position: 'absolute', bottom: `${3 - r/3}%`, left: '50%',
                      width: `${r * 2}%`, height: `${r}%`,
                      transform: 'translateX(-50%)',
                      border: `1px dashed rgba(0,0,0,0.04)`,
                      borderRadius: '50%', pointerEvents: 'none',
                    }} />
                  ))}
                </div>

                {/* Items (move faster — parallax) */}
                {(mode === 'find' ? UNI_ITEMS : EARN_ITEMS).filter(item => !filterType || item.type === filterType).map(item => (
                  <UniFieldItem key={item.id} item={item} time={time} focused={focused} onTap={onFocus} panOffset={panOffset} fav={favorites.has(item.id)} onFav={() => toggleFav(item.id)} />
                ))}

                {/* User dot (stays centered, moves with slow parallax) */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: `translate(calc(-50% + ${panOffset.x * 0.15}px), calc(-50% + ${panOffset.y * 0.15}px))`,
                  transition: panStart.current ? 'none' : 'transform 0.3s ease',
                  zIndex: 15,
                }}>
                  <div style={{ position: 'relative', width: 20, height: 20 }}>
                    <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: C.orange, opacity: 0.12, animation: 'pulse3 2.5s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: C.orange, opacity: 0.2 }} />
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: C.orange, border: '3px solid #fff', boxShadow: `0 2px 12px ${C.orangeGlow}` }} />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: C.text3, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1 }}>You</span>
                  </div>
                </div>
              </div>

              {/* Focus overlay */}
              {focusedItem && mode === 'find' && (
                <UniFocusOverlay item={focusedItem} onUnlock={onUnlock} onClose={onBlur} trustLevel={trustLevel} onVerify={onVerify} />
              )}
              {focusedItem && mode === 'earn' && (
                <FocusOverlay item={focusedItem} mode="earn" onUnlock={() => {}} onClose={onBlur} onScan={() => { onBlur(); setShowEarnMenu(false); setState('earn'); }} />
              )}

              {/* Filter chips */}
              <div style={{ position: 'absolute', top: activeItem ? 140 : 104, left: 0, right: 0, zIndex: 32, display: 'flex', gap: 5, padding: '0 20px', overflowX: 'auto' }}>
                {[{ id: null, label: 'All' }, { id: 'bike', label: 'Bikes' }, { id: 'camera', label: 'Cameras' }, { id: 'paddle', label: 'Water' }, { id: 'tool', label: 'Tools' }, { id: 'scooter', label: 'Scooters' }].map(f => (
                  <Press key={f.id || 'all'} onTap={() => setFilterType(f.id)} scale={0.93}>
                    <div style={{ padding: '5px 12px', borderRadius: 12, background: filterType === f.id ? C.orange : C.white, fontSize: 11, fontWeight: 700, fontFamily: C.font, color: filterType === f.id ? '#fff' : C.text2, whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.2s ease' }}>{f.label}</div>
                  </Press>
                ))}
              </div>

              {/* Bottom 3-tab bar */}
              <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 35 }}>
                <div style={{ display: 'flex', background: C.dark, borderRadius: 32, padding: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.35)' }}>
                  {[
                    { id: 'explore', label: 'Explore', icon: I.compass },
                    { id: 'activity', label: 'Activity', icon: I.clock },
                    { id: 'earn', label: 'Earn', icon: I.dollar },
                  ].map(tab => {
                    const isA = activeTab === tab.id;
                    return (
                      <Press key={tab.id} onTap={() => {
                        if (tab.id === 'activity') { setState('activity'); }
                        else if (tab.id === 'earn') { setActiveTab('earn'); setShowEarnMenu(true); setFocused(null); setFocusedItem(null); }
                        else { setActiveTab('explore'); setFocused(null); setFocusedItem(null); setState('field'); }
                      }} scale={0.93}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '12px 16px', borderRadius: 28,
                          background: isA ? C.orange : 'transparent',
                          boxShadow: isA ? `0 4px 16px ${C.orangeGlow}` : 'none',
                          transition: 'all 0.35s ease',
                        }}>
                          {tab.icon(isA ? '#fff' : 'rgba(255,255,255,0.35)')}
                          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: C.font, color: isA ? '#fff' : 'rgba(255,255,255,0.35)' }}>{tab.label}</span>
                        </div>
                      </Press>
                    );
                  })}
                </div>
              </div>

              <UniStats show={showStats} onClose={() => setShowStats(false)} trustLevel={trustLevel}
                onMyRentals={() => { setShowStats(false); setState('myRentals'); }}
                onMyListings={() => { setShowStats(false); setState('myListings'); }}
              />

              {/* Earn menu */}
              {showEarnMenu && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 70, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
                  onClick={(e) => { if (e.target === e.currentTarget) { setShowEarnMenu(false); setActiveTab('explore'); } }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', animation: 'fadeIn3 0.25s ease' }} />
                  <div style={{ position: 'relative', zIndex: 1, background: C.white, borderRadius: '28px 28px 0 0', padding: '20px 20px 34px', animation: 'sheetUp3 0.35s cubic-bezier(.32,.72,.37,1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 0 12px' }}>
                      <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: C.font, color: C.text, marginBottom: 4, letterSpacing: -0.4 }}>Make money</div>
                    <div style={{ fontSize: 13, color: C.text2, fontFamily: C.font, marginBottom: 16 }}>Choose how to start earning.</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <Press onTap={() => { setShowEarnMenu(false); setState('earn'); }} scale={0.97}>
                        <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                          <AssetImg type="tool" h={100} overlay={false} radius={20}>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.6), transparent 70%)', borderRadius: 20 }} />
                          </AssetImg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.scan('#fff')}</div>
                            <div>
                              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: C.font }}>Quick Scan</div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontFamily: C.font }}>Point at something, we price it</div>
                            </div>
                          </div>
                        </div>
                      </Press>
                      <Press onTap={() => { setShowEarnMenu(false); setState('ownerStart'); }} scale={0.97}>
                        <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                          <AssetImg type="lifestyle" h={100} overlay={false} radius={20}>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.55), transparent 70%)', borderRadius: 20 }} />
                          </AssetImg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.camera('#fff')}</div>
                            <div>
                              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: C.font }}>Full Listing</div>
                              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontFamily: C.font }}>Details, photos, price, payout setup</div>
                            </div>
                          </div>
                        </div>
                      </Press>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ height: '100%', animation: 'screenFadeIn5 0.35s ease' }} key={state}>
              {renderContent()}
            </div>
          )}
        </div>
      </IOSDevice>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UniApp />);

// RoamRide Intake — Renter Flow (all screens)

/* ━━━━━ RENTER: BOOKING SUMMARY ━━━━━ */
function RenterBooking({ nav, item }) {
  const it = item || { name: 'E-Bike Cruiser', price: '$18/day', deposit: '$45', type: 'bike', rating: '4.9' };
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Booking" sub="Review & pay" onBack={() => nav('start')} />
        <div style={{ padding: '0 20px' }}>
          {/* Rich rental card with photo */}
          <div style={{
            borderRadius: 24, overflow: 'hidden', background: C.white,
            boxShadow: '0 6px 28px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.03)',
            marginBottom: 16,
            opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(10px)', transition: 'all 0.5s ease',
          }}>
            <AssetImg type={it.type} h={160} radius={0} overlay={false}>
              {/* Duotone watermark */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(3)', opacity: 0.04, pointerEvents: 'none' }}>
                {DI[it.type]?.(40, '#fff', '#fff')}
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 55%, rgba(0,0,0,0.3))' }} />
              <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 4 }}>
                <GBadge label="Verified" icon={I.shield('#fff')} />
                <GBadge label="Instant" icon={I.bolt('#fff')} />
              </div>
            </AssetImg>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <DuoIcon type={it.type} size={36} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: C.font, color: C.text, letterSpacing: -0.3 }}>{it.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: C.orange, fontFamily: C.font }}>{it.price}</span>
                    {I.star()}<span style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: C.font }}>{it.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div style={{ padding: '14px 16px', borderRadius: 16, background: C.white, marginBottom: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Rental dates</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ padding: '10px 16px', borderRadius: 12, background: `${C.orange}08`, fontSize: 14, fontWeight: 700, fontFamily: C.font, color: C.orange }}>May 18</div>
              <div style={{ flex: 1, height: 2, background: C.border, position: 'relative' }}><div style={{ position: 'absolute', right: 0, top: -4, width: 10, height: 10, borderRadius: 5, background: C.orange }} /></div>
              <div style={{ padding: '10px 16px', borderRadius: 12, background: `${C.orange}08`, fontSize: 14, fontWeight: 700, fontFamily: C.font, color: C.orange }}>May 20</div>
            </div>
          </div>

          {/* Price breakdown */}
          <div style={{ padding: '14px 16px', borderRadius: 16, background: C.white, marginBottom: 12, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Price</div>
            {[['Rental (2 days)', '$36'], ['Platform fee', '$4'], ['Deposit hold', it.deposit]].map(([l, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, fontFamily: C.font }}>
                <span style={{ color: C.text2 }}>{l}</span><span style={{ color: C.text, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: C.border, margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontFamily: C.font }}>
              <span style={{ fontWeight: 750, color: C.text }}>Total today</span>
              <span style={{ fontWeight: 800, color: C.orange, fontSize: 18 }}>$40</span>
            </div>
            <div style={{ fontSize: 10, color: C.text3, fontFamily: C.font, marginTop: 3 }}>Deposit releases after clean return.</div>
          </div>

          {/* Cancellation */}
          <div style={{ padding: '12px 14px', borderRadius: 14, background: `${C.blue}06`, border: `1px solid ${C.blue}12`, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            {I.shield(C.blue)}
            <span style={{ fontSize: 11, fontFamily: C.font, color: C.text2, lineHeight: 1.4 }}>Free cancellation up to 24 hours before pickup.</span>
          </div>

          <SessionBanner />
        </div>
      </div>
      <BottomCTA label="Continue to payment" onTap={() => nav('renterPayment')} icon={I.arrow('#fff')} />
    </div>
  );
}

/* ━━━━━ RENTER: PAYMENT ━━━━━ */
function RenterPayment({ nav }) {
  const [status, setStatus] = React.useState('pending'); // pending | processing | verified | failed

  const simulatePay = () => {
    setStatus('processing');
    setTimeout(() => setStatus('verified'), 2000);
    setTimeout(() => nav('renterProof'), 2800);
  };

  if (status === 'processing' || status === 'verified') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 40, gap: 20 }}>
        <div style={{
          width: 68, height: 68, borderRadius: 34,
          background: status === 'verified' ? `linear-gradient(135deg, ${C.green}, #10B981)` : `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: status === 'verified' ? `0 8px 28px ${C.greenGlow}` : `0 8px 28px ${C.orangeGlow}`,
          transition: 'all 0.5s ease',
        }}>
          {status === 'verified' ? <div style={{ animation: 'popIn3 0.4s ease' }}>{I.check('#fff')}</div>
            : <div style={{ width: 22, height: 22, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 11, animation: 'spin3 0.7s linear infinite' }} />}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: C.font, color: C.text }}>
          {status === 'verified' ? 'Payment verified' : 'Verifying payment…'}
        </div>
        <div style={{ fontSize: 12, color: C.text2, fontFamily: C.font }}>Processed securely. We never store card details.</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Payment" sub="Secure checkout" onBack={() => nav('renterBooking')} />
        <div style={{ padding: '0 20px' }}>
          <FormInput label="Card number" placeholder="4242 4242 4242 4242" />
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}><FormInput label="Expiry" placeholder="MM/YY" /></div>
            <div style={{ flex: 1 }}><FormInput label="CVC" placeholder="123" /></div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: 14, background: `${C.green}06`, border: `1px solid ${C.green}12`, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            {I.shield(C.green)}
            <span style={{ fontSize: 11, fontFamily: C.font, color: C.text2, lineHeight: 1.4 }}>Payment is verified securely. The owner is paid according to the rental settlement rules.</span>
          </div>
        </div>
      </div>
      <BottomCTA label="Pay $40" onTap={simulatePay} icon={I.bolt('#fff')} />
    </div>
  );
}

/* ━━━━━ RENTER: PROOF REQUIRED ━━━━━ */
function RenterProof({ nav }) {
  const [idDone, setIdDone] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);

  const startVerify = () => {
    setVerifying(true);
    setTimeout(() => { setIdDone(true); setVerifying(false); }, 2200);
  };

  if (verifying) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 40, gap: 20, position: 'relative' }}>
        <ContourBG />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 68, height: 68, borderRadius: 34, background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 32px ${C.orangeGlow}` }}>
            <div style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 12, animation: 'spin3 0.7s linear infinite' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: C.font, color: C.text }}>Verifying your identity…</div>
          <div style={{ fontSize: 12, color: C.text2, fontFamily: C.font, textAlign: 'center', lineHeight: 1.5, maxWidth: 260 }}>This is only needed because this rental requires it. We don't store your documents.</div>
          {/* Mini map showing where this rental is */}
          <MiniMap h={80} style={{ borderRadius: 16, width: '100%', marginTop: 8 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Verification needed" sub="For this rental" onBack={() => nav('renterPayment')} />
        <div style={{ padding: '0 20px' }}>
          {/* Contextual rental card showing WHY */}
          <div style={{ borderRadius: 18, overflow: 'hidden', background: C.white, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 16 }}>
            <AssetImg type="bike" h={80} radius={0} overlay={false}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.4))' }} />
              <div style={{ position: 'absolute', bottom: 8, left: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: C.font }}>E-Bike Cruiser — $500+ value</span>
              </div>
            </AssetImg>
          </div>

          <p style={{ fontSize: 13, fontFamily: C.font, color: C.text2, margin: '0 0 16px', lineHeight: 1.5 }}>
            This rental requires additional proof before it can be confirmed. We only ask for this when the rental type, value, or policy requires it.
          </p>

          <ProofCard
            title="Identity verification"
            reason="This e-bike has a value over $500. The owner requires identity verification for high-value rentals."
            status={idDone ? 'verified' : 'required'}
            onAction={startVerify}
            actionLabel="Verify identity"
            icon={I.shield(idDone ? C.green : C.orange)}
          />

          <div style={{ marginTop: 12 }}>
            <ProofCard
              title="Payment method"
              reason="Your payment has been verified."
              status="verified"
              icon={I.check(C.green)}
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <ProofCard
              title="Rental waiver"
              reason="Standard terms for equipment rentals. Accepted automatically."
              status="verified"
              icon={I.check(C.green)}
            />
          </div>
        </div>
      </div>
      <BottomCTA label="Confirm booking" onTap={() => nav('renterConfirm')} disabled={!idDone} icon={I.bolt('#fff')} />
    </div>
  );
}

/* ━━━━━ RENTER: BOOKING CONFIRMED ━━━━━ */
function RenterConfirm({ nav }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <Burst active={show} color={C.green} />
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <div style={{ textAlign: 'center', padding: '8px 20px 12px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${C.green}, #10B981)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: `0 8px 28px ${C.greenGlow}`, animation: 'popIn3 0.5s ease' }}>
            {I.check('#fff')}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: C.font, color: C.text, marginBottom: 4 }}>Booking confirmed</div>
          <div style={{ fontSize: 13, color: C.text2, fontFamily: C.font }}>Your booking pass is ready.</div>
        </div>

        {/* Booking Pass with photo */}
        <div style={{ padding: '0 20px', opacity: show ? 1 : 0, transform: show ? 'none' : 'scale(0.95)', transition: 'all 0.5s ease 0.2s' }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: `0 10px 40px ${C.orangeGlow}, 0 4px 12px rgba(0,0,0,0.06)` }}>
            {/* Photo header */}
            <div style={{ position: 'relative' }}>
              <AssetImg type="bike" h={100} radius={0} overlay={false}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.35))' }} />
              </AssetImg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 20px' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>Booking Pass</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: C.font }}>E-Bike Cruiser</div>
              </div>
              {/* Duotone watermark */}
              <div style={{ position: 'absolute', top: '40%', right: 20, transform: 'translateY(-50%) scale(2)', opacity: 0.08, pointerEvents: 'none' }}>
                {DI.bike(24, '#fff', '#fff')}
              </div>
            </div>
            {/* Details row */}
            <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, padding: '12px 20px', display: 'flex', gap: 20 }}>
              {[{ l: 'Pickup', v: 'May 18' }, { l: 'Return', v: 'May 20' }, { l: 'Access', v: 'Self' }].map(m => (
                <div key={m.l}><div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.l}</div><div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: C.font }}>{m.v}</div></div>
              ))}
            </div>
            {/* Tear */}
            <div style={{ position: 'relative', height: 2, background: C.white }}>
              <div style={{ position: 'absolute', left: 28, right: 28, top: 0, borderTop: `2px dashed ${C.border}` }} />
              <div style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: C.bg }} />
              <div style={{ position: 'absolute', right: -10, top: -10, width: 20, height: 20, borderRadius: 10, background: C.bg }} />
            </div>
            {/* Bottom */}
            <div style={{ background: C.white, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Dot color={C.green} size={7} /><span style={{ fontSize: 13, fontWeight: 650, fontFamily: C.font, color: C.text }}>Booking access ready</span>
              </div>
              <ReadinessChecklist items={[
                { label: 'Payment verified', status: 'complete' },
                { label: 'Identity verified', status: 'complete' },
                { label: 'Pickup photos', status: 'pending' },
              ]} />
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px 0' }}>
          <EvidenceTimeline events={[
            { label: 'Reserved', done: true, time: 'Just now' },
            { label: 'Payment verified', done: true, time: 'Just now' },
            { label: 'Pickup', active: true, sub: 'May 18 — take condition photos' },
            { label: 'Active rental', sub: 'May 18–20' },
            { label: 'Return', sub: 'May 20 — document return condition' },
            { label: 'Deposit released', sub: 'After clean return verified' },
          ]} />
        </div>
      </div>
      <BottomCTA label="Continue to pickup" onTap={() => nav('renterPickup')} icon={I.camera('#fff')} />
    </div>
  );
}

/* ━━━━━ RENTER: PICKUP PHOTOS ━━━━━ */
function RenterPickup({ nav }) {
  const [photos, setPhotos] = React.useState([false, false, false, false, false]);
  const labels = ['Front view', 'Side angles', 'Existing wear', 'Accessories', 'Serial / ID'];
  const filled = photos.filter(Boolean).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Document pickup" sub="Condition photos" onBack={() => nav('renterConfirm')} />
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, fontFamily: C.font, color: C.text2, margin: '0 0 12px', lineHeight: 1.5 }}>
            Take a few photos before the rental begins. These are attached only to this booking and help protect both sides.
          </p>

          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ position: 'relative', width: 48, height: 48 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="24" cy="24" r="20" fill="none" stroke={C.border} strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke={C.orange} strokeWidth="4" strokeDasharray={`${2*Math.PI*20}`} strokeDashoffset={`${2*Math.PI*20*(1-filled/5)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, fontFamily: C.font, color: C.text }}>{filled}/5</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {labels.slice(0, 4).map((l, i) => (
              <Press key={i} onTap={() => !photos[i] && (() => { const n = [...photos]; n[i] = true; setPhotos(n); })()} disabled={photos[i]} scale={0.94}>
                <div style={{
                  borderRadius: 18, height: 110,
                  background: photos[i] ? C.greenBg : C.white,
                  border: photos[i] ? `2px solid ${C.green}` : `2px dashed ${C.border}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.3s ease',
                }}>
                  {photos[i] ? (
                    <><div style={{ width: 28, height: 28, borderRadius: 14, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.check('#fff')}</div><span style={{ fontSize: 11, fontWeight: 650, fontFamily: C.font, color: '#1A8A3E' }}>{l}</span></>
                  ) : (
                    <><div style={{ width: 38, height: 38, borderRadius: 12, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.camera(C.text3)}</div><span style={{ fontSize: 11, fontWeight: 600, fontFamily: C.font, color: C.text3 }}>{l}</span></>
                  )}
                </div>
              </Press>
            ))}
          </div>
          {/* 5th photo full width */}
          <div style={{ marginTop: 10 }}>
            <Press onTap={() => !photos[4] && (() => { const n = [...photos]; n[4] = true; setPhotos(n); })()} disabled={photos[4]} scale={0.95}>
              <div style={{
                borderRadius: 18, height: 70,
                background: photos[4] ? C.greenBg : C.white,
                border: photos[4] ? `2px solid ${C.green}` : `2px dashed ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.3s ease',
              }}>
                {photos[4] ? (
                  <><div style={{ width: 24, height: 24, borderRadius: 12, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.check('#fff')}</div><span style={{ fontSize: 11, fontWeight: 650, fontFamily: C.font, color: '#1A8A3E' }}>{labels[4]}</span></>
                ) : (
                  <><div style={{ width: 32, height: 32, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.camera(C.text3)}</div><span style={{ fontSize: 11, fontWeight: 600, fontFamily: C.font, color: C.text3 }}>{labels[4]}</span></>
                )}
              </div>
            </Press>
          </div>
        </div>
      </div>
      <BottomCTA label="Save pickup condition" onTap={() => nav('renterActive')} disabled={filled < 3} icon={I.check('#fff')} />
    </div>
  );
}

/* ━━━━━ RENTER: RETURN + SETTLEMENT ━━━━━ */
function RenterReturn({ nav }) {
  const [phase, setPhase] = React.useState('photos'); // photos | review | released | rating
  const [photos, setPhotos] = React.useState([false, false, false, false]);
  const [reviewStep, setReviewStep] = React.useState(-1);
  const [rating, setRating] = React.useState(0);
  const filled = photos.filter(Boolean).length;

  const submitReturn = () => {
    setPhase('review');
    let s = -1;
    const iv = setInterval(() => { s++; setReviewStep(s); if (s >= 4) { clearInterval(iv); setTimeout(() => setPhase('released'), 600); } }, 600);
  };

  if (phase === 'released') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 28, textAlign: 'center', position: 'relative' }}>
        <Burst active color={C.green} />
        <NoiseOverlay opacity={0.02} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 300 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: `linear-gradient(135deg, ${C.green}, #10B981)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 40px ${C.greenGlow}`, animation: 'popIn3 0.5s ease' }}>
            <svg width="36" height="28" viewBox="0 0 24 20" fill="none"><path d="M2 10l7 7L22 3" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: C.font, color: C.text }}>Deposit released</div>
          <div style={{ fontSize: 13, color: C.text2, fontFamily: C.font }}>No issues found. Return accepted.</div>
          <Press onTap={() => setPhase('rating')} scale={0.97} style={{ width: '100%', marginTop: 8 }}>
            <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '15px', textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: C.font, boxShadow: `0 4px 16px ${C.orangeGlow}` }}>Rate this rental</div>
          </Press>
          <Press onTap={() => nav('start')} scale={0.95} style={{ width: '100%' }}>
            <div style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, fontFamily: C.font, color: C.text2 }}>Skip</div>
          </Press>
        </div>
      </div>
    );
  }

  if (phase === 'rating') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 28, textAlign: 'center', position: 'relative' }}>
        <NoiseOverlay opacity={0.02} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 300 }}>
          <DuoIcon type="bike" size={56} />
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: C.font, color: C.text }}>How was it?</div>
          <div style={{ fontSize: 13, color: C.text2, fontFamily: C.font }}>Rate the item and owner</div>
          {/* Star rating */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <Press key={s} onTap={() => setRating(s)} scale={0.85}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: s <= rating ? `${C.gold}15` : C.white, border: `2px solid ${s <= rating ? C.gold : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
                  {I.star(s <= rating ? C.gold : C.border)}
                </div>
              </Press>
            ))}
          </div>
          {rating > 0 && (
            <div style={{ animation: 'fadeIn3 0.3s ease' }}>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: C.font, color: C.gold }}>{['', 'Poor', 'Fair', 'Good', 'Great', 'Amazing'][rating]}</div>
            </div>
          )}
          <Press onTap={() => rating > 0 && nav('start')} disabled={rating === 0} scale={0.97} style={{ width: '100%', marginTop: 8 }}>
            <div style={{ background: rating > 0 ? `linear-gradient(135deg, ${C.orange}, ${C.orange2})` : C.border, borderRadius: 50, padding: '15px', textAlign: 'center', color: rating > 0 ? '#fff' : C.text3, fontSize: 15, fontWeight: 700, fontFamily: C.font, boxShadow: rating > 0 ? `0 4px 16px ${C.orangeGlow}` : 'none', transition: 'all 0.3s ease' }}>Submit rating</div>
          </Press>
        </div>
      </div>
    );
  }

  if (phase === 'review') {
    const checks = ['Comparing condition', 'Checking accessories', 'Verifying location', 'Processing deposit'];
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 36, gap: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 28px ${C.orangeGlow}` }}>
          <div style={{ width: 22, height: 22, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 11, animation: 'spin3 0.6s linear infinite' }} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: C.font, color: C.text }}>Reviewing return…</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 260 }}>
          {checks.map((c, i) => {
            const done = i < reviewStep, act = i === reviewStep;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: done || act ? 1 : 0.2, transition: 'all 0.3s' }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: done ? C.green : act ? C.orange : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                  {done && I.check('#fff')}
                </div>
                <span style={{ fontSize: 14, fontFamily: C.font, color: C.text, fontWeight: 500 }}>{c}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Document return" sub="Condition photos" onBack={() => nav('renterActive')} />
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, fontFamily: C.font, color: C.text2, margin: '0 0 12px', lineHeight: 1.5 }}>
            Take photos of the current condition. These are compared to pickup photos and help release your deposit faster.
          </p>
          <PhotoGrid
            photos={photos}
            labels={['Front view', 'Side angles', 'Wear / damage', 'Accessories']}
            onCapture={(i) => { const n = [...photos]; n[i] = true; setPhotos(n); }}
          />
        </div>
      </div>
      <BottomCTA label={filled >= 3 ? "Submit return" : `${3 - filled} more photo${3 - filled !== 1 ? 's' : ''} needed`} onTap={filled >= 3 ? submitReturn : null} disabled={filled < 3} icon={I.check('#fff')} />
    </div>
  );
}

/* ━━━━━ RENTER: ACTIVE (reuses ActiveSession) ━━━━━ */
function RenterActive({ nav }) {
  return <ActiveSession item={{ name: 'E-Bike Cruiser', type: 'bike', color: ['#FF9A56','#FF6B35'] }} onReturn={() => nav('renterReturn')} onClose={() => nav('field')} onRentals={() => nav('myRentals')} />;
}

Object.assign(window, { RenterBooking, RenterPayment, RenterProof, RenterConfirm, RenterPickup, RenterReturn, RenterActive });

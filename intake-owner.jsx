// RoamRide Intake — Owner Flow: photo-first with AI prefill

const OWNER_STEPS = ['Photos', 'Details', 'Price', 'Payout', 'Review'];

/* ── Simulated item types for photo capture ── */
const DETECTABLE_ITEMS = [
  { type: 'bike', prompt: 'an electric bicycle / e-bike' },
  { type: 'camera', prompt: 'a mirrorless camera with lens kit' },
  { type: 'paddle', prompt: 'a stand-up paddleboard with paddle' },
  { type: 'tool', prompt: 'a cordless drill and bit set' },
  { type: 'scooter', prompt: 'an electric scooter' },
];

/* ━━━━━ OWNER: PHOTO CAPTURE + AI ANALYSIS ━━━━━ */
function OwnerStart({ nav }) {
  const [photos, setPhotos] = React.useState([false, false, false, false]);
  const [phase, setPhase] = React.useState('capture'); // capture | analyzing | done
  const [analyzeStep, setAnalyzeStep] = React.useState(0);
  const [detectedType, setDetectedType] = React.useState(null);
  const [time, setTime] = React.useState(0);
  const labels = ['Front', 'Side', 'Detail', 'Accessories'];
  const filled = photos.filter(Boolean).length;

  React.useEffect(() => { let r; const t = () => { setTime(performance.now()); r = requestAnimationFrame(t); }; r = requestAnimationFrame(t); return () => cancelAnimationFrame(r); }, []);

  const snap = (i) => {
    const n = [...photos]; n[i] = true; setPhotos(n);
  };

  const analyze = async () => {
    setPhase('analyzing');
    // Pick a random item type for the "detected" item
    const pick = DETECTABLE_ITEMS[Math.floor(Math.random() * DETECTABLE_ITEMS.length)];
    setDetectedType(pick.type);

    // Animate analysis steps
    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setAnalyzeStep(step);
      if (step >= 4) clearInterval(stepInterval);
    }, 600);

    // Call Claude to generate listing details
    try {
      const text = await window.claude.complete(
        `You are an AI for a peer-to-peer rental app. A user photographed ${pick.prompt} to list for rent. Generate listing details as JSON only, no other text. Fields: {"title": "short catchy name", "description": "2 sentence description of the item and its appeal to renters", "category": "${pick.type === 'bike' || pick.type === 'scooter' ? 'equipment' : pick.type === 'camera' ? 'camera' : pick.type === 'tool' ? 'tool' : 'outdoor'}", "condition": "excellent", "suggestedHourly": number, "suggestedDaily": number, "suggestedDeposit": number, "suggestedWeekly": number}`
      );
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : null;
      if (parsed) {
        window.__ownerAiResult = { ...parsed, photoType: pick.type, photoCount: filled };
      } else {
        throw new Error('no parse');
      }
    } catch (e) {
      // Fallback if Claude is unavailable
      const fallbacks = {
        bike: { title: 'E-Bike Cruiser — City Edition', description: 'Well-maintained electric bike perfect for city exploration and sunset rides. Includes charger, lock, and helmet.', category: 'equipment', suggestedHourly: 18, suggestedDaily: 65, suggestedWeekly: 280, suggestedDeposit: 45 },
        camera: { title: 'Canon EOS R6 — Full Kit', description: 'Professional mirrorless camera with two lenses and carry case. Ideal for photo walks and content creation.', category: 'camera', suggestedHourly: 35, suggestedDaily: 120, suggestedWeekly: 500, suggestedDeposit: 150 },
        paddle: { title: 'Inflatable SUP Board — 10\'6"', description: 'Lightweight inflatable paddleboard with adjustable paddle and pump. Great for calm lakes and easy coastal paddling.', category: 'outdoor', suggestedHourly: 22, suggestedDaily: 75, suggestedWeekly: 320, suggestedDeposit: 60 },
        tool: { title: 'DeWalt 20V Drill + Bit Set', description: 'Cordless drill with two batteries, charger, and 40-piece bit set. Handles any home project.', category: 'tool', suggestedHourly: 8, suggestedDaily: 25, suggestedWeekly: 100, suggestedDeposit: 40 },
        scooter: { title: 'Segway Ninebot Max — Long Range', description: 'Electric scooter with 40-mile range and pneumatic tires. Folds for easy storage.', category: 'equipment', suggestedHourly: 12, suggestedDaily: 45, suggestedWeekly: 200, suggestedDeposit: 50 },
      };
      window.__ownerAiResult = { ...fallbacks[pick.type], photoType: pick.type, photoCount: filled, condition: 'excellent' };
    }

    // Wait for animation to finish, then navigate
    setTimeout(() => {
      setPhase('done');
      setTimeout(() => nav('ownerDetails'), 600);
    }, Math.max(0, 3000 - (step * 600)));
  };

  const analyzeMessages = ['Detecting item type…', 'Analyzing condition…', 'Estimating market value…', 'Generating listing…'];
  const breathe = Math.sin(time / 600) * 4;

  // ── ANALYZING PHASE ──
  if (phase === 'analyzing' || phase === 'done') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 28, gap: 20, position: 'relative' }}>
        <ContourBG />
        <NoiseOverlay opacity={0.02} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%', maxWidth: 300 }}>
          {/* Captured photos strip */}
          <div style={{ display: 'flex', gap: 6 }}>
            {photos.map((p, i) => p && (
              <div key={i} style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', border: `2px solid ${phase === 'done' ? C.green : C.orange}`, transition: 'border-color 0.3s' }}>
                <img src={PHOTOS[detectedType]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>

          {/* Central orb */}
          <div style={{
            width: 72, height: 72, borderRadius: 36,
            background: phase === 'done' ? `linear-gradient(135deg, ${C.green}, #10B981)` : `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: phase === 'done' ? `0 8px 32px ${C.greenGlow}` : `0 8px 32px ${C.orangeGlow}`,
            transition: 'all 0.5s ease',
          }}>
            {phase === 'done'
              ? <div style={{ animation: 'popIn3 0.4s cubic-bezier(.175,.885,.32,1.275)' }}>{I.check('#fff')}</div>
              : <div style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 12, animation: 'spin3 0.7s linear infinite' }} />
            }
          </div>

          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: C.font, color: C.text, textAlign: 'center' }}>
            {phase === 'done' ? 'Item identified' : 'Analyzing your photos…'}
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {analyzeMessages.map((msg, i) => {
              const done = i < analyzeStep, act = i === analyzeStep && phase !== 'done';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 14,
                  background: done ? `${C.green}06` : act ? `${C.orange}06` : 'transparent',
                  opacity: done || act || phase === 'done' ? 1 : 0.15,
                  transform: done || act ? 'translateX(0)' : 'translateX(8px)',
                  transition: 'all 0.4s ease',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 11,
                    background: done || phase === 'done' ? C.green : act ? C.orange : C.border,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                  }}>
                    {(done || phase === 'done') && I.check('#fff')}
                    {act && <div style={{ width: 5, height: 5, borderRadius: 3, background: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: 13, fontFamily: C.font, color: C.text, fontWeight: done ? 600 : 400 }}>{msg}</span>
                </div>
              );
            })}
          </div>

          {phase === 'done' && detectedType && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 18, background: C.white, boxShadow: '0 4px 16px rgba(0,0,0,0.06)', width: '100%', animation: 'slideDown3 0.3s ease' }}>
              <DuoIcon type={detectedType} size={40} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 750, fontFamily: C.font, color: C.text }}>{window.__ownerAiResult?.title || 'Item detected'}</div>
                <div style={{ fontSize: 11, color: C.green, fontFamily: C.font, fontWeight: 600 }}>Ready to list</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── CAPTURE PHASE ──
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Photograph your item" sub="Step 1" onBack={() => nav('start')} />

        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, fontFamily: C.font, color: C.text2, margin: '0 0 14px', lineHeight: 1.5 }}>
            Take a few photos. Our AI will identify your item and pre-fill the listing details for you.
          </p>

          {/* Camera viewfinder */}
          <div style={{
            borderRadius: 24, overflow: 'hidden', marginBottom: 16,
            background: '#1A1714', position: 'relative', height: 200,
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #2A2622, #1A1714)' }} />
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
              <defs><pattern id="captureGrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0v30H0" fill="none" stroke="#fff" strokeWidth="0.5" /></pattern></defs>
              <rect width="100%" height="100%" fill="url(#captureGrid)" />
            </svg>
            {/* Viewfinder brackets */}
            <div style={{ position: 'absolute', inset: 20, border: `2px solid ${filled > 0 ? C.green : C.orange}40`, borderRadius: 16, transition: 'border-color 0.3s' }}>
              {[{ top: -2, left: -2, bT: true, bL: true, br: '16px 0 0 0' }, { top: -2, right: -2, bT: true, bR: true, br: '0 16px 0 0' }, { bottom: -2, left: -2, bB: true, bL: true, br: '0 0 0 16px' }, { bottom: -2, right: -2, bB: true, bR: true, br: '0 0 16px 0' }].map((s, i) => {
                const borderColor = filled > 0 ? `${C.green}80` : `${C.orange}80`;
                return <div key={i} style={{ position: 'absolute', width: 20, height: 20, top: s.top, left: s.left, right: s.right, bottom: s.bottom, borderTop: s.bT ? `2.5px solid ${borderColor}` : 'none', borderLeft: s.bL ? `2.5px solid ${borderColor}` : 'none', borderRight: s.bR ? `2.5px solid ${borderColor}` : 'none', borderBottom: s.bB ? `2.5px solid ${borderColor}` : 'none', borderRadius: s.br }} />;
              })}
            </div>
            {/* Center prompt */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div style={{ transform: `scale(1.4) translateY(${breathe * 0.3}px)` }}>{I.camera('rgba(255,255,255,0.4)')}</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontFamily: C.font }}>
                {filled === 0 ? 'Point at your item' : `${filled} photo${filled > 1 ? 's' : ''} captured`}
              </span>
            </div>
            {/* Captured thumbnails */}
            {filled > 0 && (
              <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 4 }}>
                {photos.map((p, i) => p && (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: 8, background: `${C.green}30`, border: `1.5px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.check('#fff')}</div>
                ))}
              </div>
            )}
          </div>

          {/* Photo grid */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: C.font, color: C.text, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Capture angles</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: filled >= 2 ? C.green : C.orange, fontFamily: C.font }}>{filled}/4 · {filled >= 2 ? 'Ready' : '2 min needed'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {labels.map((l, i) => (
                <Press key={i} onTap={() => !photos[i] && snap(i)} disabled={photos[i]} scale={0.93}>
                  <div style={{
                    borderRadius: 18, height: 90, position: 'relative', overflow: 'hidden',
                    background: photos[i] ? C.greenBg : C.white,
                    border: photos[i] ? `2px solid ${C.green}` : `2px dashed ${C.border}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                    transition: 'all 0.3s ease',
                  }}>
                    {photos[i] ? (
                      <><div style={{ width: 28, height: 28, borderRadius: 14, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.check('#fff')}</div><span style={{ fontSize: 11, fontWeight: 650, fontFamily: C.font, color: '#1A8A3E' }}>{l}</span></>
                    ) : (
                      <><div style={{ width: 34, height: 34, borderRadius: 11, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.camera(C.text3)}</div><span style={{ fontSize: 11, fontWeight: 600, fontFamily: C.font, color: C.text3 }}>{l}</span></>
                    )}
                  </div>
                </Press>
              ))}
            </div>
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 14, background: `${C.blue}06`, border: `1px solid ${C.blue}12`, display: 'flex', alignItems: 'center', gap: 8 }}>
            {I.bolt(C.blue)}
            <span style={{ fontSize: 11, fontFamily: C.font, color: C.text2, lineHeight: 1.4 }}>AI will identify your item, suggest a title, description, and pricing — all editable.</span>
          </div>
        </div>
      </div>
      <BottomCTA label={filled >= 2 ? 'Analyze with AI' : `${2 - filled} more photo${2 - filled !== 1 ? 's' : ''} needed`} onTap={filled >= 2 ? analyze : null} disabled={filled < 2} icon={filled >= 2 ? I.bolt('#fff') : null} />
    </div>
  );
}

/* ━━━━━ OWNER: DETAILS (AI PRE-FILLED) ━━━━━ */
function OwnerDetails({ nav }) {
  const ai = window.__ownerAiResult || {};
  const [title, setTitle] = React.useState(ai.title || '');
  const [desc, setDesc] = React.useState(ai.description || '');
  const [cat, setCat] = React.useState(ai.category || 'equipment');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Review details" sub="Step 2 of 5" onBack={() => nav('ownerStart')} />
        <div style={{ padding: '0 20px 12px' }}><IntakeStepper steps={OWNER_STEPS} current={1} /></div>
        <div style={{ padding: '0 20px' }}>
          {/* AI badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 14, background: `${C.green}06`, border: `1px solid ${C.green}15`, marginBottom: 16 }}>
            {I.bolt(C.green)}
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: C.font, color: C.green }}>Pre-filled by AI — review and edit anything below</span>
          </div>

          {/* Photo preview strip */}
          {ai.photoType && (
            <div style={{ marginBottom: 16, borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
              <AssetImg type={ai.photoType} h={100} radius={18} overlay={false}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.3))', borderRadius: 18 }} />
                <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', gap: 4 }}>
                  <GBadge label={`${ai.photoCount || 2} photos`} icon={I.camera('#fff')} />
                  <GBadge label={ai.condition || 'Excellent'} icon={I.check('#fff')} />
                </div>
              </AssetImg>
            </div>
          )}

          <FormInput label="Title" placeholder="e.g. Mountain Bike — Trek Marlin 7" value={title} onChange={(e) => setTitle(e.target.value)} />
          <FormInput label="Description" placeholder="Describe condition, accessories, anything useful" multiline value={desc} />
          <FormChips label="Category" options={[
            { id: 'equipment', label: 'Equipment', icon: DI.bike(16, C.orange, C.orange) },
            { id: 'camera', label: 'Camera / Tech', icon: DI.camera(16, C.gold, C.gold) },
            { id: 'tool', label: 'Tool', icon: DI.tool(16, C.green, C.green) },
            { id: 'outdoor', label: 'Outdoor', icon: DI.camp(16, '#F97316', '#F97316') },
          ]} value={cat} onChange={setCat} />
          <FormInput label="Location area" placeholder="e.g. Capitol Hill, Seattle" />
          <FormChips label="Availability" options={[
            { id: 'always', label: 'Always available' },
            { id: 'weekends', label: 'Weekends only' },
            { id: 'weekdays', label: 'Weekdays only' },
            { id: 'custom', label: 'Custom schedule' },
          ]} value="always" onChange={() => {}} />
          <FormChips label="Duration rules" options={[
            { id: 'hourly', label: 'Hourly' },
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'any', label: 'Any duration' },
          ]} value="any" onChange={() => {}} />
        </div>
      </div>
      <BottomCTA label="Next: Pricing" onTap={() => nav('ownerPrice')} icon={I.arrow('#fff')} />
    </div>
  );
}

/* ━━━━━ OWNER: PRICE & DEPOSIT (AI SUGGESTED) ━━━━━ */
function OwnerPrice({ nav }) {
  const ai = window.__ownerAiResult || {};
  const hourly = ai.suggestedHourly || 18;
  const daily = ai.suggestedDaily || 65;
  const weekly = ai.suggestedWeekly || 280;
  const deposit = ai.suggestedDeposit || 45;
  const fee = (daily * 0.12).toFixed(2);
  const payout = (daily - daily * 0.12).toFixed(2);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Price & deposit" sub="Step 3 of 5" onBack={() => nav('ownerDetails')} />
        <div style={{ padding: '0 20px 12px' }}><IntakeStepper steps={OWNER_STEPS} current={2} /></div>
        <div style={{ padding: '0 20px' }}>
          {/* AI suggestion banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 14, background: `${C.green}06`, border: `1px solid ${C.green}15`, marginBottom: 16 }}>
            {I.bolt(C.green)}
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: C.font, color: C.green }}>AI-suggested pricing based on similar items nearby</span>
          </div>

          <FormInput label="Hourly price" placeholder="0" prefix="$" suffix="/hr" value={String(hourly)} onChange={() => {}} />
          <FormInput label="Daily price" placeholder="0" prefix="$" suffix="/day" value={String(daily)} onChange={() => {}} />
          <FormInput label="Weekly price" placeholder="0" prefix="$" suffix="/week" value={String(weekly)} onChange={() => {}} />
          <FormInput label="Security deposit" placeholder="0" prefix="$" value={String(deposit)} onChange={() => {}} />

          <div style={{ padding: '14px 16px', borderRadius: 16, background: C.white, marginBottom: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 }}>Daily earnings estimate</div>
            {[['Rental price', `$${daily}/day`], ['Platform fee (12%)', `-$${fee}`], ['Your payout', `$${payout}`]].map(([l, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, fontFamily: C.font }}>
                <span style={{ color: i === 2 ? C.text : C.text2 }}>{l}</span>
                <span style={{ color: i === 2 ? C.green : C.text, fontWeight: i === 2 ? 700 : 500 }}>{v}</span>
              </div>
            ))}
          </div>

          <FormChips label="Cancellation policy" options={[
            { id: 'flexible', label: 'Flexible' },
            { id: 'moderate', label: 'Moderate' },
            { id: 'strict', label: 'Strict' },
          ]} value="moderate" onChange={() => {}} />
        </div>
      </div>
      <BottomCTA label="Next: Payouts" onTap={() => nav('ownerPayout')} icon={I.arrow('#fff')} />
    </div>
  );
}

/* ━━━━━ OWNER: PAYOUT SETUP ━━━━━ */
function OwnerPayout({ nav }) {
  const [status, setStatus] = React.useState('not-started');

  const simulateSetup = () => {
    setStatus('in-progress');
    setTimeout(() => setStatus('enabled'), 2500);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Set up payouts" sub="Step 4 of 5" onBack={() => nav('ownerPrice')} />
        <div style={{ padding: '0 20px 12px' }}><IntakeStepper steps={OWNER_STEPS} current={3} /></div>
        <div style={{ padding: '0 20px' }}>
          <p style={{ fontSize: 13, fontFamily: C.font, color: C.text2, margin: '0 0 16px', lineHeight: 1.55 }}>
            We use secure payment processing to verify payout eligibility and send rental earnings. This step is required before your listing can go live.
          </p>
          <PayoutSetupCard status={status} onAction={simulateSetup} />

          {status === 'enabled' && (
            <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 16, background: C.greenBg, border: `1.5px solid ${C.green}20`, display: 'flex', alignItems: 'center', gap: 10 }}>
              {I.check(C.green)}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: C.font }}>Payouts are ready</div>
                <div style={{ fontSize: 11, color: C.text2, fontFamily: C.font }}>You'll receive earnings after each completed rental.</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomCTA label="Next: Review" onTap={() => nav('ownerReview')} disabled={status !== 'enabled'} icon={I.arrow('#fff')} />
    </div>
  );
}

/* ━━━━━ OWNER: PUBLISH READINESS ━━━━━ */
function OwnerReview({ nav }) {
  const ai = window.__ownerAiResult || {};
  const [submitted, setSubmitted] = React.useState(false);
  const checklist = [
    { label: 'Photos captured', status: 'complete' },
    { label: 'AI-generated details reviewed', status: 'complete' },
    { label: 'Pricing confirmed', status: 'complete' },
    { label: 'Payout setup', status: 'complete' },
    { label: 'Ready to publish', status: submitted ? 'complete' : 'pending' },
  ];

  if (submitted) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 32, textAlign: 'center', position: 'relative' }}>
        <Burst active color={C.green} />
        <NoiseOverlay opacity={0.02} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: `linear-gradient(135deg, ${C.green}, #10B981)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 40px ${C.greenGlow}`, animation: 'popIn3 0.5s cubic-bezier(.175,.885,.32,1.275)' }}>
            <svg width="36" height="28" viewBox="0 0 24 20" fill="none"><path d="M2 10l7 7L22 3" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: C.font, color: C.text }}>Listed!</div>
          <p style={{ fontSize: 13, fontFamily: C.font, color: C.text2, lineHeight: 1.5, maxWidth: 260 }}>Your {ai.title || 'item'} is live and visible to renters nearby.</p>
          <EvidenceTimeline events={[
            { label: 'Photos analyzed', done: true, time: 'Just now' },
            { label: 'Listing created by AI', done: true, time: 'Just now' },
            { label: 'Published', done: true, time: 'Just now' },
            { label: 'First rental', active: true, sub: 'Waiting for a renter' },
          ]} />
          <Press onTap={() => nav('start')} scale={0.97} style={{ marginTop: 12, width: '100%' }}>
            <div style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.orange2})`, borderRadius: 50, padding: '15px', textAlign: 'center', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: C.font, boxShadow: `0 4px 16px ${C.orangeGlow}` }}>Done</div>
          </Press>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, paddingTop: 58, position: 'relative' }}>
      <NoiseOverlay opacity={0.02} />
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, paddingBottom: 92 }}>
        <IntakeHeader title="Review & publish" sub="Step 5 of 5" onBack={() => nav('ownerPayout')} />
        <div style={{ padding: '0 20px 12px' }}><IntakeStepper steps={OWNER_STEPS} current={4} /></div>
        <div style={{ padding: '0 20px' }}>
          {/* Listing preview card */}
          {ai.photoType && (
            <div style={{ borderRadius: 22, overflow: 'hidden', background: C.white, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: 16 }}>
              <AssetImg type={ai.photoType} h={120} radius={0} overlay={false}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.4))' }} />
              </AssetImg>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: C.font, color: C.text, marginBottom: 2 }}>{ai.title}</div>
                <div style={{ fontSize: 12, color: C.text2, fontFamily: C.font, lineHeight: 1.4, marginBottom: 6 }}>{ai.description}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.orange, fontFamily: C.font }}>${ai.suggestedHourly}/hr</span>
                  <span style={{ fontSize: 12, color: C.text3 }}>·</span>
                  <span style={{ fontSize: 12, color: C.text2, fontFamily: C.font }}>Deposit ${ai.suggestedDeposit}</span>
                </div>
              </div>
            </div>
          )}

          <ReadinessChecklist items={checklist} />

          <div style={{ marginTop: 16 }}>
            <Press scale={0.98}>
              <div style={{ padding: '14px 16px', borderRadius: 16, background: C.white, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>Preview listing</span>
                {I.arrow(C.text2)}
              </div>
            </Press>
          </div>
        </div>
      </div>
      <BottomCTA label="Publish listing" onTap={() => setSubmitted(true)} icon={I.bolt('#fff')} />
    </div>
  );
}

Object.assign(window, { OwnerStart, OwnerDetails, OwnerPrice, OwnerPayout, OwnerReview });

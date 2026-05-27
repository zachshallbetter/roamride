// RoamRide v3 — Colors, icons, and shared constants

const C = {
  orange: '#FF6B35', orange2: '#FF4E2E', orangeGlow: 'rgba(255,107,53,0.4)',
  cream: '#FAF7F3', white: '#FFF', bg: '#F3F0EB',
  dark: '#1A1714', darkCard: '#282420', darkGlass: 'rgba(28,23,20,0.85)',
  text: '#1A1714', text2: '#8E8983', text3: '#C0BCB6',
  green: '#2ABF5E', greenGlow: 'rgba(42,191,94,0.35)', greenBg: '#EAFAF0',
  blue: '#3B82F6', purple: '#7C5CE0', gold: '#FBBF24',
  border: '#E8E4DE', font: "'Plus Jakarta Sans', sans-serif",
};

/* ── Photos for asset types (local uploads + Unsplash fallbacks) ── */
const PHOTOS = {
  bike: 'uploads/pasted-1778922469886-0.jpeg',
  paddle: 'uploads/pasted-1778922645150-0.png',
  camera: 'uploads/pasted-1778922724294-0.jpeg',
  scooter: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop&auto=format',
  tool: 'uploads/pasted-1778922618954-0.jpeg',
  gear: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop&auto=format',
  cooler: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&h=400&fit=crop&auto=format',
  camp: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&h=400&fit=crop&auto=format',
  lifestyle: 'uploads/pasted-1778922558114-0.jpeg',
  earn: 'uploads/pasted-1778922618954-0.jpeg',
  paddle2: 'uploads/pasted-1778922661200-0.png',
};

/* ── Asset image with gradient overlay ── */
function AssetImg({ type = 'bike', h = 200, overlay = true, radius = 0, children, style = {} }) {
  return (
    <div style={{ width: '100%', height: h, borderRadius: radius, overflow: 'hidden', position: 'relative', flexShrink: 0, background: '#E5E2DD', ...style }}>
      <img src={PHOTOS[type] || PHOTOS.bike} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
      {overlay && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 55%, rgba(0,0,0,0.35))' }} />}
      {children}
    </div>
  );
}

/* ── Duotone icons (filled bg + stroke detail) ── */
const DI = {
  bike: (size=24, c1='#FF6B35', c2='#fff') => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="5.5" cy="17" r="3.5" fill={c1} fillOpacity="0.15" stroke={c1} strokeWidth="1.5"/><circle cx="18.5" cy="17" r="3.5" fill={c1} fillOpacity="0.15" stroke={c1} strokeWidth="1.5"/><path d="M5.5 17L8 9h3l3 8M14 9l4.5 8M8 9l3-4h4" stroke={c2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  paddle: (size=24, c1='#10B981', c2='#fff') => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="14" rx="7" ry="3" fill={c1} fillOpacity="0.15" stroke={c1} strokeWidth="1.5"/><path d="M12 2v20" stroke={c2} strokeWidth="1.5" strokeLinecap="round"/><path d="M8 14c0-3 1.8-8 4-8s4 5 4 8" stroke={c2} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  camera: (size=24, c1='#F59E0B', c2='#fff') => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="14" rx="3" fill={c1} fillOpacity="0.15" stroke={c1} strokeWidth="1.5"/><circle cx="12" cy="13" r="4" stroke={c2} strokeWidth="1.5"/><circle cx="12" cy="13" r="1.5" fill={c2}/><circle cx="18" cy="9" r="1" fill={c2}/><path d="M8 6l1.5-3h5L16 6" stroke={c2} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
  scooter: (size=24, c1='#7C5CE0', c2='#fff') => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="7" cy="19" r="2.5" fill={c1} fillOpacity="0.15" stroke={c1} strokeWidth="1.5"/><circle cx="17" cy="19" r="2.5" fill={c1} fillOpacity="0.15" stroke={c1} strokeWidth="1.5"/><path d="M17 19V7.5a2 2 0 00-2-2h-2M7 19l3-12h3" stroke={c2} strokeWidth="1.5" strokeLinecap="round"/><path d="M9 7h5" stroke={c2} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  tool: (size=24, c1='#2ABF5E', c2='#fff') => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.7A5.5 5.5 0 0114.2 13l-7.4 7.4a2 2 0 01-2.8-2.8L11 10.2A5.5 5.5 0 0114.7 6.3z" fill={c1} fillOpacity="0.12" stroke={c2} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  camp: (size=24, c1='#F97316', c2='#fff') => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 3L3 20h18L12 3z" fill={c1} fillOpacity="0.12" stroke={c2} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 3v10M8.5 20l3.5-7 3.5 7" stroke={c2} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  cooler: (size=24, c1='#3B82F6', c2='#fff') => <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" fill={c1} fillOpacity="0.12" stroke={c2} strokeWidth="1.5"/><path d="M3 11h18M8 6V4h8v2" stroke={c2} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

/* ── Duotone icon in a tinted circle ── */
function DuoIcon({ type, size = 40, bgOpacity = 0.1 }) {
  const colors = { bike: C.orange, paddle: '#10B981', camera: '#F59E0B', scooter: C.purple, tool: C.green, camp: '#F97316', cooler: C.blue, gear: C.purple };
  const col = colors[type] || C.orange;
  const iconFn = DI[type] || DI.bike;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: `${col}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {iconFn(size * 0.55, col, col)}
    </div>
  );
}

/* ── Noise texture overlay ── */
function NoiseOverlay({ opacity = 0.03 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity, mixBlendMode: 'multiply' }}>
      <svg width="100%" height="100%"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#noise)" opacity="0.5"/></svg>
    </div>
  );
}

/* ── Compact icon set (no emojis, SVG only) ── */
const I = {
  bolt: (c='#fff') => <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M11 2L4 11h5l-1 7 7-9h-5l1-7z" fill={c}/></svg>,
  compass: (c='#fff') => <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M12.8 7.2l-1.5 4.1-4.1 1.5 1.5-4.1z" fill={c} opacity="0.9"/></svg>,
  dollar: (c='#fff') => <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/><path d="M10 5v10M7.5 8c0-1 .9-1.6 2.5-1.6s2.5.6 2.5 1.6-.9 1.4-2.5 1.8-2.5.8-2.5 1.8c0 1 .9 1.6 2.5 1.6s2.5-.6 2.5-1.6" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>,
  star: (c='#FBBF24') => <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 0l1.8 3.6L12 4.2 8.9 7.1l.7 4.1L6 9.4 2.4 11.2l.7-4.1L0 4.2l4.2-.6z" fill={c}/></svg>,
  shield: (c='#fff') => <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 2.5l6.5 2.7V9.5c0 4.2-2.8 7-6.5 8.5-3.7-1.5-6.5-4.3-6.5-8.5V5.2L10 2.5z" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check: (c='#fff') => <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4.5 10.5l3.5 3.5 7.5-8" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  camera: (c='#fff') => <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="5.5" width="16" height="11.5" rx="2.5" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="11.5" r="3.5" stroke={c} strokeWidth="1.5"/><path d="M7.5 5.5L8.5 3h3l1 2.5" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  scan: (c='#fff') => <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M2 6V3.5A1.5 1.5 0 013.5 2H6M14 2h2.5A1.5 1.5 0 0118 3.5V6M18 14v2.5a1.5 1.5 0 01-1.5 1.5H14M6 18H3.5A1.5 1.5 0 012 16.5V14" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M5 10h10" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  map: (c='#fff') => <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 17.5s6-4.5 6-9.5a6 6 0 00-12 0c0 5 6 9.5 6 9.5z" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="8" r="2" fill={c}/></svg>,
  clock: (c='#fff') => <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.25" stroke={c} strokeWidth="1.5"/><path d="M10 5.5V10l3 3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  fire: (c='#FF6B35') => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1C8 1 3 5.5 3 9.5a5 5 0 0010 0C13 5.5 8 1 8 1z" fill={c} fillOpacity="0.25" stroke={c} strokeWidth="1.1"/><path d="M8 7s-2 1.5-2 3.5a2 2 0 004 0C10 8.5 8 7 8 7z" fill={c}/></svg>,
  arrow: (c='#fff') => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close: (c='#fff') => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  back: (c='#fff') => <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L4 8l6 5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  heart: (c='#fff') => <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 16.5l-.95-.86C5.2 12.18 3 10.06 3 7.5A3.49 3.49 0 016.5 4c1.04 0 2.04.49 2.65 1.25L10 6.33l.85-1.08A3.48 3.48 0 0113.5 4 3.49 3.49 0 0117 7.5c0 2.56-2.2 4.68-6.05 8.14L10 16.5z" stroke={c} strokeWidth="1.5"/></svg>,
  heartFill: (c='#FF6B35') => <svg width="16" height="16" viewBox="0 0 20 20"><path d="M10 16.5l-.95-.86C5.2 12.18 3 10.06 3 7.5A3.49 3.49 0 016.5 4c1.04 0 2.04.49 2.65 1.25L10 6.33l.85-1.08A3.48 3.48 0 0113.5 4 3.49 3.49 0 0117 7.5c0 2.56-2.2 4.68-6.05 8.14L10 16.5z" fill={c}/></svg>,
  qr: (c='#1A1714') => <svg width="52" height="52" viewBox="0 0 52 52" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke={c} strokeWidth="2"/><rect x="32" y="4" width="16" height="16" rx="2" stroke={c} strokeWidth="2"/><rect x="4" y="32" width="16" height="16" rx="2" stroke={c} strokeWidth="2"/><rect x="8" y="8" width="8" height="8" rx="1" fill={c}/><rect x="36" y="8" width="8" height="8" rx="1" fill={c}/><rect x="8" y="36" width="8" height="8" rx="1" fill={c}/><rect x="32" y="32" width="6" height="6" fill={c}/><rect x="40" y="40" width="6" height="6" fill={c}/><rect x="32" y="42" width="4" height="4" fill={c}/><rect x="42" y="32" width="4" height="4" fill={c}/></svg>,
  medal: (c='#FBBF24') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="12" r="5" fill={c} fillOpacity="0.15" stroke={c} strokeWidth="1.5"/><path d="M7 3h6l-1.5 5h-3L7 3z" fill={c} fillOpacity="0.2" stroke={c} strokeWidth="1.2"/><path d="M8.5 10l1.5 1.5 2.5-3" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  front: (c='#FF6B35') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke={c} strokeWidth="1.5"/><path d="M7 10h6M13 10l-2.5-2.5M13 10l-2.5 2.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  side: (c='#38BDF8') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke={c} strokeWidth="1.5"/><path d="M10 7v6M10 13l-2.5-2.5M10 13l2.5-2.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  acc: (c='#2ABF5E') => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.5"/><circle cx="10" cy="10" r="3" stroke={c} strokeWidth="1.3"/><circle cx="10" cy="10" r="1" fill={c}/></svg>,
};

/* ── Vivid card backgrounds ── */
function CardBG({ type = 'bike', children, style = {} }) {
  const themes = {
    bike:    ['#FF9A56','#FF6B35'],
    board:   ['#5BB8FF','#3B82F6'],
    scooter: ['#A78BFA','#7C5CE0'],
    paddle:  ['#34D399','#10B981'],
    camera:  ['#FBBF24','#F59E0B'],
    tool:    ['#6EE7B7','#2ABF5E'],
    sunset:  ['#FF8F50','#FF4E6B'],
    gear:    ['#8B5CF6','#6D28D9'],
  };
  const g = themes[type] || themes.bike;
  return (
    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(155deg, ${g[0]}, ${g[1]})`, ...style }}>
      <div style={{ position: 'absolute', top: '-25%', right: '-15%', width: '65%', height: '65%', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-8%', width: '45%', height: '45%', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
        <defs><pattern id={`p_${type}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1" height="6" fill="#fff"/></pattern></defs>
        <rect width="100%" height="100%" fill={`url(#p_${type})`} />
      </svg>
      {children}
    </div>
  );
}

/* ── Animated mini map ── */
function MiniMap({ dark = false, h = 100, style = {} }) {
  const bg = dark ? '#1A1714' : '#EBE7E1';
  const bl = dark ? '#232220' : '#DBD7D0';
  const rd = dark ? '#2A2826' : '#CEC9C3';
  return (
    <div style={{ width: '100%', height: h, borderRadius: 16, overflow: 'hidden', ...style }}>
      <svg width="100%" height="100%" viewBox="0 0 360 100" preserveAspectRatio="xMidYMid slice">
        <rect width="360" height="100" fill={bg}/>
        <rect x="10" y="8" width="65" height="35" rx="4" fill={bl}/><rect x="82" y="8" width="50" height="35" rx="4" fill={bl}/>
        <rect x="140" y="8" width="70" height="35" rx="4" fill={bl}/><rect x="218" y="8" width="55" height="35" rx="4" fill={bl}/>
        <rect x="10" y="55" width="90" height="35" rx="4" fill={bl}/><rect x="108" y="55" width="60" height="35" rx="4" fill={bl}/>
        <rect x="176" y="55" width="50" height="35" rx="4" fill={bl}/><rect x="234" y="55" width="70" height="35" rx="4" fill={bl}/>
        <line x1="76" y1="0" x2="76" y2="100" stroke={rd} strokeWidth="4"/><line x1="134" y1="0" x2="134" y2="100" stroke={rd} strokeWidth="4"/>
        <line x1="0" y1="48" x2="360" y2="48" stroke={rd} strokeWidth="4"/>
        <path d="M40 85 C70 50,130 40,180 48 S260 25,320 18" stroke={C.orange} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7">
          <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.5s" fill="freeze"/>
        </path>
        <path d="M40 85 C70 50,130 40,180 48 S260 25,320 18" stroke={C.orange} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.2" strokeDasharray="7 5">
          <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite"/>
        </path>
        <circle cx="40" cy="85" r="8" fill={C.orange} opacity="0.15"><animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="40" cy="85" r="4.5" fill={C.orange}/><circle cx="40" cy="85" r="2" fill="#fff"/>
        <circle cx="320" cy="18" r="8" fill={C.orange} opacity="0.15"><animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/></circle>
        <circle cx="320" cy="18" r="4.5" fill={C.orange}/><circle cx="320" cy="18" r="2.5" fill="#fff"/>
      </svg>
    </div>
  );
}

/* ── Pulsing dot ── */
function Dot({ color = C.orange, size = 8, style = {} }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}>
      <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: color, opacity: 0.2, animation: 'pulse3 2s ease-in-out infinite' }} />
      <div style={{ width: size, height: size, borderRadius: '50%', background: color }} />
    </div>
  );
}

/* ── Glass badge ── */
function GBadge({ label, icon, variant = 'glass' }) {
  const m = {
    glass: { bg: 'rgba(255,255,255,0.18)', color: '#fff', bd: 'rgba(255,255,255,0.1)' },
    green: { bg: C.greenBg, color: '#1A8A3E', bd: 'transparent' },
    orange: { bg: '#FFF2EB', color: C.orange, bd: 'transparent' },
    dark: { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', bd: 'rgba(255,255,255,0.06)' },
  };
  const s = m[variant] || m.glass;
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 50, padding: '4px 10px',
      fontSize: 10, fontWeight: 700, fontFamily: C.font,
      display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
      border: `1px solid ${s.bd}`, backdropFilter: variant === 'glass' ? 'blur(8px)' : 'none',
    }}>{icon}{label}</span>
  );
}

Object.assign(window, { C, I, PHOTOS, AssetImg, DI, DuoIcon, NoiseOverlay, CardBG, MiniMap, Dot, GBadge });

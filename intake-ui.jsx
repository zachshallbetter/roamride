// RoamRide Intake — Shared components: stepper, proof cards, form elements, session banner

/* ── Intake Stepper ── */
function IntakeStepper({ steps, current, onTap }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', gap: 2 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const future = i > current;
        return (
          <React.Fragment key={i}>
            <div onClick={() => done && onTap?.(i)} style={{
              display: 'flex', alignItems: 'center', gap: 6, cursor: done ? 'pointer' : 'default',
              opacity: future ? 0.35 : 1, transition: 'opacity 0.3s ease',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: done ? C.green : active ? C.orange : C.border,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: active ? `0 0 10px ${C.orangeGlow}` : 'none',
              }}>
                {done ? I.check('#fff') : <span style={{ fontSize: 10, fontWeight: 700, color: active ? '#fff' : C.text3, fontFamily: C.font }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? C.text : done ? C.green : C.text3, fontFamily: C.font, whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1.5, background: done ? C.green : C.border, minWidth: 8, transition: 'background 0.3s ease' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ── Readiness Checklist ── */
function ReadinessChecklist({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderRadius: 14, background: C.white,
          border: `1px solid ${item.status === 'required' ? `${C.orange}30` : C.border}`,
          transition: 'all 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              background: item.status === 'complete' ? C.green : item.status === 'required' ? C.orange : C.border,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}>
              {item.status === 'complete' && I.check('#fff')}
              {item.status === 'required' && <span style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>!</span>}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.font }}>{item.label}</span>
          </div>
          <span style={{
            fontSize: 10, fontWeight: 600, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.5,
            color: item.status === 'complete' ? C.green : item.status === 'required' ? C.orange : C.text3,
          }}>
            {item.status === 'complete' ? 'Done' : item.status === 'required' ? 'Required' : 'Pending'}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Proof Card (contextual verification) ── */
function ProofCard({ title, reason, status, onAction, actionLabel, icon }) {
  const statusColors = {
    required: { bg: `${C.orange}08`, border: `${C.orange}25`, color: C.orange, label: 'Required' },
    'in-progress': { bg: `${C.blue}08`, border: `${C.blue}25`, color: C.blue, label: 'In progress' },
    verified: { bg: C.greenBg, border: `${C.green}25`, color: C.green, label: 'Verified' },
    expired: { bg: `${C.gold}08`, border: `${C.gold}25`, color: C.gold, label: 'Expired' },
    failed: { bg: '#FFF0F0', border: '#FF4E4E25', color: '#FF4E4E', label: 'Failed' },
  };
  const s = statusColors[status] || statusColors.required;

  return (
    <div style={{
      padding: '16px 18px', borderRadius: 20, background: s.bg,
      border: `1.5px solid ${s.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon || I.shield(s.color)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: C.font }}>{title}</span>
            <GBadge label={s.label} variant={status === 'verified' ? 'green' : status === 'failed' ? 'orange' : 'orange'} />
          </div>
          <p style={{ fontSize: 12, color: C.text2, fontFamily: C.font, lineHeight: 1.5, margin: 0 }}>{reason}</p>
        </div>
      </div>
      {onAction && status !== 'verified' && (
        <Press onTap={onAction} scale={0.97}>
          <div style={{
            background: status === 'failed' ? '#FF4E4E' : `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
            borderRadius: 50, padding: '12px', textAlign: 'center',
            color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: C.font,
            boxShadow: `0 4px 14px ${C.orangeGlow}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>{actionLabel || 'Continue verification'}</div>
        </Press>
      )}
    </div>
  );
}

/* ── Session Banner ── */
function SessionBanner({ onSendLink }) {
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 14, background: `${C.blue}08`,
      border: `1px solid ${C.blue}15`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, background: C.green }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.text2, fontFamily: C.font }}>Saved on this device</span>
      </div>
      {onSendLink && (
        <Press onTap={onSendLink} scale={0.95}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, fontFamily: C.font }}>Send continue link</span>
        </Press>
      )}
    </div>
  );
}

/* ── Form Input ── */
function FormInput({ label, placeholder, value, onChange, multiline, prefix, suffix, type = 'text' }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>{label}</div>}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: multiline ? '12px 14px' : '0 14px', height: multiline ? 'auto' : 48,
        borderRadius: 14, background: C.white,
        border: `1.5px solid ${focused ? C.orange : C.border}`,
        transition: 'border-color 0.2s ease',
        boxShadow: focused ? `0 0 0 3px ${C.orangeGlow}` : 'none',
      }}>
        {prefix && <span style={{ fontSize: 14, color: C.text2, fontFamily: C.font, marginRight: 6 }}>{prefix}</span>}
        {multiline ? (
          <div
            contentEditable suppressContentEditableWarning
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ flex: 1, minHeight: 60, fontSize: 14, fontFamily: C.font, color: C.text, outline: 'none', lineHeight: 1.5 }}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: C.font, color: C.text, background: 'transparent', height: '100%' }}
          />
        )}
        {suffix && <span style={{ fontSize: 12, color: C.text3, fontFamily: C.font, marginLeft: 6 }}>{suffix}</span>}
      </div>
    </div>
  );
}

/* ── Form Select Chips ── */
function FormChips({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>{label}</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(opt => {
          const sel = value === opt.id;
          return (
            <Press key={opt.id} onTap={() => onChange(opt.id)} scale={0.95}>
              <div style={{
                padding: '10px 16px', borderRadius: 14,
                background: sel ? `${C.orange}10` : C.white,
                border: `1.5px solid ${sel ? C.orange : C.border}`,
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s ease',
              }}>
                {opt.icon && <div style={{ opacity: sel ? 1 : 0.5, transition: 'opacity 0.2s' }}>{opt.icon}</div>}
                <span style={{ fontSize: 13, fontWeight: sel ? 700 : 500, color: sel ? C.orange : C.text, fontFamily: C.font }}>{opt.label}</span>
              </div>
            </Press>
          );
        })}
      </div>
    </div>
  );
}

/* ── Photo Upload Grid ── */
function PhotoGrid({ photos, onCapture, labels }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {(labels || ['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4']).map((label, i) => {
        const taken = photos[i];
        return (
          <Press key={i} onTap={() => !taken && onCapture(i)} disabled={taken} scale={0.94}>
            <div style={{
              borderRadius: 18, height: 110, position: 'relative', overflow: 'hidden',
              background: taken ? C.greenBg : C.white,
              border: taken ? `2px solid ${C.green}` : `2px dashed ${C.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.3s ease',
            }}>
              {taken ? (
                <>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.check('#fff')}</div>
                  <span style={{ fontSize: 11, fontWeight: 650, fontFamily: C.font, color: '#1A8A3E' }}>{label}</span>
                </>
              ) : (
                <>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.camera(C.text3)}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: C.font, color: C.text3 }}>{label}</span>
                </>
              )}
            </div>
          </Press>
        );
      })}
    </div>
  );
}

/* ── Evidence Timeline ── */
function EvidenceTimeline({ events }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 24 }}>
      {/* Vertical line */}
      <div style={{ position: 'absolute', left: 8, top: 4, bottom: 4, width: 1.5, background: C.border }} />
      {events.map((e, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: i < events.length - 1 ? 18 : 0, position: 'relative' }}>
          {/* Dot */}
          <div style={{
            position: 'absolute', left: -20, top: 2,
            width: 14, height: 14, borderRadius: 7,
            background: e.active ? C.orange : e.done ? C.green : C.border,
            border: `2px solid ${e.active ? `${C.orange}30` : e.done ? `${C.green}30` : C.bg}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: e.active ? `0 0 8px ${C.orangeGlow}` : 'none',
          }}>
            {e.done && <div style={{ width: 4, height: 4, borderRadius: 2, background: '#fff' }} />}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 650, color: C.text, fontFamily: C.font }}>{e.label}</div>
            {e.sub && <div style={{ fontSize: 10, color: C.text2, fontFamily: C.font, marginTop: 2 }}>{e.sub}</div>}
            {e.time && <div style={{ fontSize: 9, color: C.text3, fontFamily: C.font, marginTop: 2 }}>{e.time}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Stripe Status Card (obfuscated) ── */
function PayoutSetupCard({ status, onAction }) {
  const states = {
    'not-started': { icon: I.dollar(C.text3), title: 'Set up payouts', sub: 'Required before your listing can go live. Secure payment processing.', cta: 'Set up payouts', color: C.text3, badge: 'Required' },
    'in-progress': { icon: I.clock(C.blue), title: 'Payout setup in progress', sub: 'Finalizing your payout information. This may take a moment.', cta: 'Continue setup', color: C.blue, badge: 'In progress' },
    'needs-info': { icon: I.shield(C.gold), title: 'More information needed', sub: 'Additional details are needed to complete your payout setup.', cta: 'Provide details', color: C.gold, badge: 'Action needed' },
    'enabled': { icon: I.check(C.green), title: 'Payouts enabled', sub: 'You can receive rental earnings. Payouts are processed securely.', cta: null, color: C.green, badge: 'Active' },
    'paused': { icon: I.shield('#FF4E4E'), title: 'Payouts paused', sub: 'There is an issue with your payout setup. Please update your information.', cta: 'Resolve issue', color: '#FF4E4E', badge: 'Paused' },
  };
  const s = states[status] || states['not-started'];
  return (
    <div style={{
      padding: '16px 18px', borderRadius: 20,
      background: `${s.color}06`, border: `1.5px solid ${s.color}20`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: s.cta ? 12 : 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 14, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {s.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: C.font }}>{s.title}</span>
          </div>
          <div style={{ fontSize: 11, color: C.text2, fontFamily: C.font, lineHeight: 1.4, marginTop: 2 }}>{s.sub}</div>
        </div>
      </div>
      {s.cta && onAction && (
        <Press onTap={onAction} scale={0.97}>
          <div style={{
            background: status === 'paused' ? '#FF4E4E' : `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
            borderRadius: 50, padding: '12px', textAlign: 'center',
            color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: C.font,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>{s.cta}</div>
        </Press>
      )}
    </div>
  );
}

/* ── Screen header with back ── */
function IntakeHeader({ title, sub, onBack, rightAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {onBack && (
          <Press onTap={onBack} scale={0.9}>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.back(C.text)}</div>
          </Press>
        )}
        <div>
          {sub && <div style={{ fontSize: 10, fontWeight: 600, color: C.text2, fontFamily: C.font, textTransform: 'uppercase', letterSpacing: 0.8 }}>{sub}</div>}
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, fontFamily: C.font, letterSpacing: -0.4 }}>{title}</div>
        </div>
      </div>
      {rightAction}
    </div>
  );
}

/* ── Primary CTA at bottom ── */
function BottomCTA({ label, onTap, disabled, icon, secondary }) {
  return (
    <div style={{ position: 'absolute', bottom: 28, left: 20, right: 20, zIndex: 40, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Press onTap={disabled ? null : onTap} disabled={disabled} scale={0.97}>
        <div style={{
          background: disabled ? C.border : `linear-gradient(135deg, ${C.orange}, ${C.orange2})`,
          borderRadius: 50, padding: '17px', textAlign: 'center',
          color: disabled ? C.text3 : '#fff',
          fontSize: 16, fontWeight: 750, fontFamily: C.font,
          boxShadow: disabled ? 'none' : `0 6px 24px ${C.orangeGlow}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.3s ease',
        }}>{icon}{label}</div>
      </Press>
      {secondary}
    </div>
  );
}

Object.assign(window, {
  IntakeStepper, ReadinessChecklist, ProofCard, SessionBanner,
  FormInput, FormChips, PhotoGrid, EvidenceTimeline,
  PayoutSetupCard, IntakeHeader, BottomCTA,
});

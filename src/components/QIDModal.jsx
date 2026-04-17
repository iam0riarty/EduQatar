import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function QIDModal({ userId, onVerified, onClose }) {
  const [qid, setQid] = useState('')
  const [step, setStep] = useState(1) // 1=form, 2=success

  const handleVerify = async () => {
    // DUMMY — no real QID check, just mark verified
    if (qid.length >= 5) {
      await supabase.from('profiles')
        .update({ qid_verified: true, qid_masked: `QID-*****-${qid.slice(-4)}` })
        .eq('id', userId)
      setStep(2)
      setTimeout(() => { onVerified(); onClose() }, 1500)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(36,26,16,.5)',
      zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, backdropFilter: 'blur(8px)', fontFamily: "'DM Sans', sans-serif"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 18, maxWidth: 420, width: '100%',
        boxShadow: '0 24px 64px rgba(36,26,16,.2)',
        animation: 'modalIn .3s cubic-bezier(.16,1,.3,1)'
      }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.93) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {step === 1 ? (
          <div style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>🔐 تحقق من هويتك</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#8A7B6A' }}>✕</button>
            </div>

            {/* DUMMY badge */}
            <div style={{
              background: 'rgba(160,112,16,.07)', border: '1px solid rgba(160,112,16,.25)',
              borderRadius: 8, padding: '8px 12px', marginBottom: 14,
              display: 'flex', gap: 8, alignItems: 'center'
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: '.78rem', color: '#7A5800', fontWeight: 600 }}>
                وضع تجريبي — التحقق dummy، سيتم ربط QID حقيقي لاحقاً
              </span>
            </div>

            <div style={{ background: 'rgba(26,122,74,.05)', border: '1.5px solid rgba(26,122,74,.18)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <p style={{ fontSize: '.82rem', color: '#4A3A28', margin: 0, lineHeight: 1.7 }}>
                في النسخة الحقيقية، سيتم التحقق عبر بطاقة الهوية القطرية (QID) وتسجيل الطالب فعلاً. دلوقتي أي رقم يشتغل.
              </p>
            </div>

            <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#8A7B6A', marginBottom: 5, textTransform: 'uppercase', letterSpacing: .8 }}>
              رقم الهوية الوطنية (QID)
            </div>
            <input
              style={{
                width: '100%', padding: '10px 13px', background: 'rgba(248,244,238,.8)',
                border: '1.5px solid rgba(212,197,169,.6)', borderRadius: 9,
                color: '#241A10', fontFamily: 'inherit', fontSize: '.88rem',
                outline: 'none', boxSizing: 'border-box', marginBottom: 16
              }}
              placeholder="28xxxxxxxxx (أي رقم للتجربة)"
              value={qid}
              onChange={e => setQid(e.target.value)}
              maxLength={11}
            />

            <button onClick={handleVerify} style={{
              width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#6B1830,#9B2548)',
              color: '#FFF8F0', fontFamily: 'inherit', fontSize: '.9rem',
              fontWeight: 700, cursor: 'pointer'
            }}>
              تحقق والمتابعة →
            </button>

            <button onClick={onClose} style={{
              width: '100%', padding: '9px 0', borderRadius: 10, border: '1.5px solid rgba(212,197,169,.6)',
              background: 'transparent', color: '#8A7B6A', fontFamily: 'inherit',
              fontSize: '.85rem', cursor: 'pointer', marginTop: 8
            }}>
              تخطي الآن
            </button>
          </div>
        ) : (
          <div style={{ padding: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontWeight: 700, color: '#1A7A4A', marginBottom: 6 }}>تم التحقق بنجاح!</h3>
            <p style={{ fontSize: '.83rem', color: '#5A4A38' }}>QID-*****-{qid.slice(-4)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

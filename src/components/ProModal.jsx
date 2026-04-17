import { useState } from 'react'
import { supabase } from '../lib/supabase'

const PLANS = [
  {
    id: 'monthly',
    label: 'شهري',
    price: 'QAR 99',
    period: '/ شهر',
    features: ['تقييمات غير محدودة', 'AI Insight', 'شارة Pro', 'إحصائيات متقدمة'],
    badge: null
  },
  {
    id: 'yearly',
    label: 'سنوي',
    price: 'QAR 799',
    period: '/ سنة',
    features: ['كل مميزات الشهري', 'توفير 33%', 'دعم أولوية', 'تقرير سنوي مخصص'],
    badge: 'الأوفر'
  }
]

export default function ProModal({ userId, onUpgraded, onClose }) {
  const [plan, setPlan] = useState('yearly')
  const [step, setStep] = useState(1) // 1=plans, 2=payment, 3=success
  const [cardNum, setCardNum] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    // DUMMY payment — just wait 1.5s then mark pro
    await new Promise(r => setTimeout(r, 1500))
    await supabase.from('profiles')
      .update({ is_pro: true, pro_plan: plan, pro_since: new Date().toISOString() })
      .eq('id', userId)
    setStep(3)
    setLoading(false)
    setTimeout(() => { onUpgraded(); onClose() }, 2000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(36,26,16,.5)',
      zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, backdropFilter: 'blur(8px)', fontFamily: "'DM Sans', sans-serif"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 18, maxWidth: 460, width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(36,26,16,.2)',
        animation: 'modalIn .3s cubic-bezier(.16,1,.3,1)'
      }}>
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.93) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {step === 1 && (
          <div style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>⭐ EduQatar Pro</h2>
                <p style={{ fontSize: '.78rem', color: '#8A7B6A', margin: '4px 0 0' }}>ميزات حصرية للمدارس والأهالي المميزين</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#8A7B6A' }}>✕</button>
            </div>

            {/* Dummy badge */}
            <div style={{
              background: 'rgba(160,112,16,.07)', border: '1px solid rgba(160,112,16,.25)',
              borderRadius: 8, padding: '7px 12px', marginBottom: 18,
              display: 'flex', gap: 8, alignItems: 'center'
            }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <span style={{ fontSize: '.75rem', color: '#7A5800', fontWeight: 600 }}>
                وضع تجريبي — الدفع dummy، لن يُخصم أي مبلغ حقيقي
              </span>
            </div>

            {/* Plans */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {PLANS.map(p => (
                <div key={p.id} onClick={() => setPlan(p.id)} style={{
                  border: `2px solid ${plan === p.id ? '#7A1E3A' : 'rgba(212,197,169,.6)'}`,
                  borderRadius: 12, padding: '14px 12px', cursor: 'pointer',
                  background: plan === p.id ? 'rgba(122,30,58,.04)' : '#fff',
                  position: 'relative', transition: 'all .15s'
                }}>
                  {p.badge && (
                    <div style={{
                      position: 'absolute', top: -10, right: 10,
                      background: 'linear-gradient(135deg,#A07010,#C8921A)',
                      color: '#FFF8EE', fontSize: '.67rem', fontWeight: 700,
                      padding: '2px 8px', borderRadius: 10
                    }}>{p.badge}</div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: '.88rem', marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#7A1E3A', fontFamily: 'DM Sans,sans-serif' }}>{p.price}</div>
                  <div style={{ fontSize: '.72rem', color: '#8A7B6A', marginBottom: 10 }}>{p.period}</div>
                  {p.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 6, marginBottom: 4, fontSize: '.76rem', color: '#4A3A28' }}>
                      <span style={{ color: '#1A7A4A', fontWeight: 700 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <button onClick={() => setStep(2)} style={{
              width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#6B1830,#9B2548)',
              color: '#FFF8F0', fontFamily: 'inherit', fontSize: '.9rem',
              fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 12px rgba(107,24,48,.25)'
            }}>
              المتابعة للدفع →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A1E3A', fontWeight: 700, fontSize: '.85rem', fontFamily: 'inherit' }}>← رجوع</button>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>💳 بيانات الدفع</h2>
            </div>

            <div style={{
              background: 'rgba(26,122,74,.05)', border: '1px solid rgba(26,122,74,.18)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 18,
              fontSize: '.79rem', color: '#1A5A35'
            }}>
              🔒 وضع تجريبي — أدخل أي أرقام للتجربة
            </div>

            {/* Fake card form */}
            {[
              ['رقم البطاقة', '4242 4242 4242 4242', cardNum, e => setCardNum(e.target.value)],
              ['تاريخ الانتهاء', 'MM/YY', '', () => {}],
              ['CVV', '•••', '', () => {}],
              ['الاسم على البطاقة', 'Mohamed Al-...', '', () => {}]
            ].map(([label, ph, val, onChange]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#8A7B6A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: .8 }}>{label}</div>
                <input
                  placeholder={ph} value={val} onChange={onChange}
                  style={{
                    width: '100%', padding: '10px 13px',
                    background: 'rgba(248,244,238,.8)',
                    border: '1.5px solid rgba(212,197,169,.6)',
                    borderRadius: 9, fontFamily: 'inherit', fontSize: '.88rem',
                    outline: 'none', boxSizing: 'border-box', color: '#241A10'
                  }}
                />
              </div>
            ))}

            {/* Summary */}
            <div style={{
              background: 'rgba(122,30,58,.04)', border: '1px solid rgba(122,30,58,.15)',
              borderRadius: 10, padding: '12px 14px', marginTop: 16, marginBottom: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                <span>خطة {plan === 'yearly' ? 'السنوية' : 'الشهرية'}</span>
                <span style={{ fontWeight: 700, color: '#7A1E3A' }}>
                  {plan === 'yearly' ? 'QAR 799' : 'QAR 99'}
                </span>
              </div>
            </div>

            <button onClick={handlePay} disabled={loading} style={{
              width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
              background: loading ? '#C4A4B0' : 'linear-gradient(135deg,#6B1830,#9B2548)',
              color: '#FFF8F0', fontFamily: 'inherit', fontSize: '.9rem',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
            }}>
              {loading ? '⏳ جاري المعالجة...' : '✓ ادفع الآن'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#7A1E3A', marginBottom: 8 }}>مرحباً بك في Pro!</h3>
            <p style={{ fontSize: '.85rem', color: '#5A4A38', lineHeight: 1.7 }}>
              تم تفعيل اشتراكك بنجاح.<br />استمتع بكل المميزات الحصرية.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

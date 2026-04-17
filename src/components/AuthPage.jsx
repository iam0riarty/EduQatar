import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Logo from './Logo'

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login') // login | register
  const [role, setRole] = useState('school') // school | admin | parent
  const [form, setForm] = useState({ email: '', password: '', schoolName: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password
        })
        if (error) throw error
        // fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        onAuth(data.user, profile)
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password
        })
        if (error) throw error
        // create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          role,
          school_name: form.schoolName,
          phone: form.phone,
          is_pro: false,
          qid_verified: false
        })
        onAuth(data.user, { role, school_name: form.schoolName, is_pro: false, qid_verified: false })
      }
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#F8F4EE',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <Logo size={52} />
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 18,
          border: '1px solid rgba(212,197,169,.6)',
          boxShadow: '0 4px 24px rgba(36,26,16,.08)',
          overflow: 'hidden'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(212,197,169,.5)' }}>
            {[['login', 'تسجيل دخول'], ['register', 'حساب جديد']].map(([k, v]) => (
              <button key={k} onClick={() => { setMode(k); setError('') }} style={{
                flex: 1, padding: '14px 0', border: 'none', background: 'none',
                fontFamily: 'inherit', fontSize: '.9rem', fontWeight: mode === k ? 700 : 400,
                color: mode === k ? '#7A1E3A' : '#8A7B6A',
                borderBottom: mode === k ? '2px solid #7A1E3A' : '2px solid transparent',
                cursor: 'pointer', marginBottom: -1, transition: 'all .15s'
              }}>{v}</button>
            ))}
          </div>

          <div style={{ padding: 28 }}>
            {/* Role selector (register only) */}
            {mode === 'register' && (
              <div style={{ marginBottom: 18 }}>
                <Label>أنت:</Label>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  {[['school', '🏫 مدرسة'], ['admin', '👤 مشرف'], ['parent', '👨‍👩‍👧 ولي أمر']].map(([k, v]) => (
                    <button key={k} onClick={() => setRole(k)} style={{
                      flex: 1, padding: '8px 4px', borderRadius: 9, border: '1.5px solid',
                      borderColor: role === k ? '#7A1E3A' : 'rgba(212,197,169,.6)',
                      background: role === k ? 'rgba(122,30,58,.05)' : '#fff',
                      color: role === k ? '#7A1E3A' : '#5A4A38',
                      fontSize: '.78rem', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all .15s'
                    }}>{v}</button>
                  ))}
                </div>
              </div>
            )}

            {/* School name (register + school role) */}
            {mode === 'register' && role === 'school' && (
              <div style={{ marginBottom: 14 }}>
                <Label>اسم المدرسة</Label>
                <Input placeholder="مدرسة الدوحة الدولية" value={form.schoolName}
                  onChange={e => set('schoolName', e.target.value)} />
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <Label>البريد الإلكتروني</Label>
              <Input type="email" placeholder="school@example.com" value={form.email}
                onChange={e => set('email', e.target.value)} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: mode === 'register' ? 14 : 20 }}>
              <Label>كلمة المرور</Label>
              <Input type="password" placeholder="••••••••" value={form.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>

            {/* Phone (register) */}
            {mode === 'register' && (
              <div style={{ marginBottom: 20 }}>
                <Label>رقم الجوال (اختياري)</Label>
                <Input placeholder="+974 XXXX XXXX" value={form.phone}
                  onChange={e => set('phone', e.target.value)} />
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(160,48,48,.06)', border: '1px solid rgba(160,48,48,.2)',
                borderRadius: 8, padding: '9px 12px', marginBottom: 14,
                fontSize: '.8rem', color: '#A03030'
              }}>{error}</div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
              background: loading ? '#C4A4B0' : 'linear-gradient(135deg,#6B1830,#9B2548)',
              color: '#FFF8F0', fontFamily: 'inherit', fontSize: '.92rem',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 12px rgba(107,24,48,.25)', transition: 'all .18s'
            }}>
              {loading ? '...' : mode === 'login' ? 'دخول ←' : 'إنشاء الحساب ←'}
            </button>

            {/* Demo hint */}
            <p style={{ textAlign: 'center', fontSize: '.73rem', color: '#8A7B6A', marginTop: 14 }}>
              للتجربة: سجّل بأي إيميل وكلمة مرور جديدة
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Label = ({ children }) => (
  <div style={{
    fontSize: '.72rem', fontWeight: 700, color: '#8A7B6A',
    textTransform: 'uppercase', letterSpacing: .8, marginBottom: 5
  }}>{children}</div>
)

const Input = ({ ...props }) => (
  <input {...props} style={{
    width: '100%', padding: '10px 13px',
    background: 'rgba(248,244,238,.8)',
    border: '1.5px solid rgba(212,197,169,.6)',
    borderRadius: 9, color: '#241A10',
    fontFamily: "'DM Sans', sans-serif", fontSize: '.88rem',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color .15s'
  }} onFocus={e => e.target.style.borderColor = '#7A1E3A'}
    onBlur={e => e.target.style.borderColor = 'rgba(212,197,169,.6)'}
  />
)

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const TABS = [
  { id: 'overview', label: '📊 نظرة عامة' },
  { id: 'info', label: '🏫 بيانات المدرسة' },
  { id: 'teachers', label: '👨‍🏫 المدرسون' },
  { id: 'fees', label: '💰 الرسوم' },
  { id: 'reviews', label: '⭐ التقييمات' },
]

export default function SchoolDashboard({ profile, userId, onLogout }) {
  const [tab, setTab] = useState('overview')
  const [school, setSchool] = useState(null)
  const [teachers, setTeachers] = useState([])
  const [reviews, setReviews] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // School form state
  const [form, setForm] = useState({
    name_ar: '', name_en: '', area_ar: '', area_en: '',
    curriculum_ar: '', curriculum_en: '', founded: '',
    students_count: '', description_ar: '', description_en: '',
    hero_url: ''
  })

  // Teacher form
  const [tForm, setTForm] = useState({ name_ar: '', name_en: '', subject_ar: '', subject_en: '', exp: '', grade: '' })
  const [addingTeacher, setAddingTeacher] = useState(false)

  // Fee form
  const [fees, setFees] = useState([{ stage_ar: '', stage_en: '', min_fee: '', max_fee: '' }])

  // eslint-disable-next-line
  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: s } = await supabase.from('schools').select('*').eq('owner_id', userId).single()
    if (s) {
      setSchool(s)
      setForm({
        name_ar: s.name_ar || '', name_en: s.name_en || '',
        area_ar: s.area_ar || '', area_en: s.area_en || '',
        curriculum_ar: s.curriculum_ar || '', curriculum_en: s.curriculum_en || '',
        founded: s.founded || '', students_count: s.students_count || '',
        description_ar: s.description_ar || '', description_en: s.description_en || '',
        hero_url: s.hero_url || ''
      })
      const { data: t } = await supabase.from('teachers').select('*').eq('school_id', s.id)
      if (t) setTeachers(t)
      const { data: r } = await supabase.from('reviews').select('*').eq('school_id', s.id).order('created_at', { ascending: false })
      if (r) setReviews(r)
      const { data: f } = await supabase.from('fees').select('*').eq('school_id', s.id)
      if (f && f.length) setFees(f)
    }
  }

  const saveSchool = async () => {
    setSaving(true)
    const payload = { ...form, owner_id: userId, updated_at: new Date().toISOString() }
    if (school) {
      await supabase.from('schools').update(payload).eq('id', school.id)
    } else {
      const { data } = await supabase.from('schools').insert(payload).select().single()
      setSchool(data)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    loadData()
  }

  const addTeacher = async () => {
    if (!school) return alert('احفظ بيانات المدرسة أولاً')
    await supabase.from('teachers').insert({ ...tForm, school_id: school.id })
    setTForm({ name_ar: '', name_en: '', subject_ar: '', subject_en: '', exp: '', grade: '' })
    setAddingTeacher(false)
    loadData()
  }

  const saveFees = async () => {
    if (!school) return alert('احفظ بيانات المدرسة أولاً')
    await supabase.from('fees').delete().eq('school_id', school.id)
    await supabase.from('fees').insert(fees.map(f => ({ ...f, school_id: school.id })))
    alert('تم حفظ الرسوم ✓')
  }

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const setTF = (k, v) => setTForm(p => ({ ...p, [k]: v }))

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4EE', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid rgba(212,197,169,.5)',
        padding: '0 20px', height: 54, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'linear-gradient(135deg,#6B1830,#9B2548)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FAF7F2', fontWeight: 800, fontSize: 11
          }}>EQ</div>
          <span style={{ fontWeight: 700, fontSize: '.92rem' }}>
            Edu<span style={{ fontWeight: 300 }}>Qatar</span>
            <span style={{ fontSize: '.72rem', color: '#8A7B6A', fontWeight: 400, marginRight: 8 }}>
              — لوحة تحكم المدرسة
            </span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {profile?.is_pro && (
            <span style={{
              background: 'rgba(122,30,58,.08)', color: '#7A1E3A',
              fontSize: '.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: 10,
              border: '1px solid rgba(122,30,58,.2)'
            }}>⭐ Pro</span>
          )}
          <span style={{ fontSize: '.8rem', color: '#8A7B6A' }}>{profile?.school_name || 'مدرستي'}</span>
          <button onClick={onLogout} style={{
            padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(212,197,169,.6)',
            background: 'transparent', color: '#8A7B6A', fontSize: '.78rem',
            cursor: 'pointer', fontFamily: 'inherit'
          }}>خروج</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 18px' }}>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 22, overflowX: 'auto',
          paddingBottom: 2, scrollbarWidth: 'none'
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 14px', borderRadius: 9, border: '1.5px solid',
              borderColor: tab === t.id ? '#7A1E3A' : 'rgba(212,197,169,.6)',
              background: tab === t.id ? 'rgba(122,30,58,.05)' : '#fff',
              color: tab === t.id ? '#7A1E3A' : '#5A4A38',
              fontSize: '.8rem', fontWeight: tab === t.id ? 700 : 400,
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              transition: 'all .15s'
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12, marginBottom: 20 }}>
              {[
                ['المدرسون المسجلون', teachers.length, '#7A1E3A'],
                ['التقييمات', reviews.length, '#1A7A4A'],
                ['متوسط التقييم', reviews.length ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1) : '—', '#A07010'],
                ['حالة الحساب', profile?.is_pro ? 'Pro ⭐' : 'مجاني', '#1A5AA0'],
              ].map(([label, val, color]) => (
                <div key={label} style={{
                  background: '#fff', borderRadius: 14, padding: '16px 14px',
                  border: '1px solid rgba(212,197,169,.6)',
                  boxShadow: '0 2px 8px rgba(36,26,16,.04)'
                }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color, fontFamily: 'DM Sans,sans-serif', lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: '.73rem', color: '#8A7B6A', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            {!school && (
              <div style={{
                background: 'rgba(26,90,160,.05)', border: '1px solid rgba(26,90,160,.2)',
                borderRadius: 12, padding: '16px 18px', marginBottom: 16
              }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>🚀 ابدأ الآن</div>
                <p style={{ fontSize: '.83rem', color: '#4A3A28', margin: 0, lineHeight: 1.7 }}>
                  لم تضف بيانات مدرستك بعد. ابدأ بتبويب "بيانات المدرسة" لإنشاء ملفك الكامل.
                </p>
                <button onClick={() => setTab('info')} style={{
                  marginTop: 10, padding: '7px 16px', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg,#6B1830,#9B2548)',
                  color: '#FFF8F0', fontSize: '.82rem', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit'
                }}>أضف بيانات مدرستك ←</button>
              </div>
            )}

            {/* Latest reviews */}
            {reviews.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: '.9rem' }}>آخر التقييمات</div>
                {reviews.slice(0, 3).map(r => (
                  <div key={r.id} style={{
                    background: '#fff', borderRadius: 12, padding: '13px 14px', marginBottom: 8,
                    border: '1px solid rgba(212,197,169,.5)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: '.85rem' }}>{r.author || 'مجهول'}</span>
                      <span style={{ color: '#C8921A' }}>{'★'.repeat(r.rating || 0)}{'☆'.repeat(5 - (r.rating || 0))}</span>
                    </div>
                    <p style={{ fontSize: '.82rem', color: '#4A3A28', margin: 0, lineHeight: 1.6 }}>{r.text_ar || r.text_en}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SCHOOL INFO ── */}
        {tab === 'info' && (
          <div>
            <SectionTitle>بيانات المدرسة الأساسية</SectionTitle>
            <Card>
              <Grid2>
                <Field label="اسم المدرسة (عربي)" value={form.name_ar} onChange={e => setF('name_ar', e.target.value)} placeholder="مدرسة الدوحة الدولية" />
                <Field label="School Name (English)" value={form.name_en} onChange={e => setF('name_en', e.target.value)} placeholder="Doha International School" />
                <Field label="المنطقة (عربي)" value={form.area_ar} onChange={e => setF('area_ar', e.target.value)} placeholder="المسيلة، الدوحة" />
                <Field label="Area (English)" value={form.area_en} onChange={e => setF('area_en', e.target.value)} placeholder="Al Messila, Doha" />
                <Field label="المنهج (عربي)" value={form.curriculum_ar} onChange={e => setF('curriculum_ar', e.target.value)} placeholder="بريطاني" />
                <Field label="Curriculum (English)" value={form.curriculum_en} onChange={e => setF('curriculum_en', e.target.value)} placeholder="British" />
                <Field label="سنة التأسيس" value={form.founded} onChange={e => setF('founded', e.target.value)} placeholder="1990" type="number" />
                <Field label="عدد الطلاب" value={form.students_count} onChange={e => setF('students_count', e.target.value)} placeholder="1200" type="number" />
              </Grid2>
              <div style={{ marginTop: 12 }}>
                <FieldLabel>وصف المدرسة (عربي)</FieldLabel>
                <textarea value={form.description_ar} onChange={e => setF('description_ar', e.target.value)}
                  placeholder="وصف مختصر عن المدرسة..."
                  style={{ ...inputStyle, minHeight: 80, resize: 'vertical', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginTop: 12 }}>
                <FieldLabel>School Description (English)</FieldLabel>
                <textarea value={form.description_en} onChange={e => setF('description_en', e.target.value)}
                  placeholder="Brief school description..."
                  style={{ ...inputStyle, minHeight: 80, resize: 'vertical', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginTop: 12 }}>
                <Field label="رابط صورة المدرسة (Hero Image URL)" value={form.hero_url}
                  onChange={e => setF('hero_url', e.target.value)}
                  placeholder="https://images.unsplash.com/..." />
              </div>

              <SaveBtn saving={saving} saved={saved} onClick={saveSchool} />
            </Card>
          </div>
        )}

        {/* ── TEACHERS ── */}
        {tab === 'teachers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <SectionTitle style={{ margin: 0 }}>المدرسون ({teachers.length})</SectionTitle>
              <button onClick={() => setAddingTeacher(!addingTeacher)} style={{
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: 'linear-gradient(135deg,#6B1830,#9B2548)',
                color: '#FFF8F0', fontSize: '.8rem', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit'
              }}>+ إضافة مدرس</button>
            </div>

            {addingTeacher && (
              <Card style={{ marginBottom: 14, border: '2px solid rgba(122,30,58,.2)' }}>
                <div style={{ fontWeight: 700, marginBottom: 12, color: '#7A1E3A', fontSize: '.88rem' }}>مدرس جديد</div>
                <Grid2>
                  <Field label="الاسم (عربي)" value={tForm.name_ar} onChange={e => setTF('name_ar', e.target.value)} placeholder="أحمد محمد" />
                  <Field label="Name (English)" value={tForm.name_en} onChange={e => setTF('name_en', e.target.value)} placeholder="Ahmed Mohamed" />
                  <Field label="المادة (عربي)" value={tForm.subject_ar} onChange={e => setTF('subject_ar', e.target.value)} placeholder="الرياضيات" />
                  <Field label="Subject (English)" value={tForm.subject_en} onChange={e => setTF('subject_en', e.target.value)} placeholder="Mathematics" />
                  <Field label="سنوات الخبرة" value={tForm.exp} onChange={e => setTF('exp', e.target.value)} placeholder="8" type="number" />
                  <Field label="المرحلة الدراسية" value={tForm.grade} onChange={e => setTF('grade', e.target.value)} placeholder="KS2 · IGCSE" />
                </Grid2>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={addTeacher} style={{
                    padding: '8px 18px', borderRadius: 8, border: 'none',
                    background: 'linear-gradient(135deg,#6B1830,#9B2548)',
                    color: '#FFF8F0', fontSize: '.82rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit'
                  }}>حفظ المدرس</button>
                  <button onClick={() => setAddingTeacher(false)} style={{
                    padding: '8px 14px', borderRadius: 8,
                    border: '1px solid rgba(212,197,169,.6)',
                    background: 'transparent', color: '#8A7B6A',
                    fontSize: '.82rem', cursor: 'pointer', fontFamily: 'inherit'
                  }}>إلغاء</button>
                </div>
              </Card>
            )}

            {teachers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#8A7B6A', fontSize: '.85rem' }}>
                لا يوجد مدرسون بعد — اضغط "+ إضافة مدرس"
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 10 }}>
                {teachers.map(t => (
                  <div key={t.id} style={{
                    background: '#fff', borderRadius: 12, padding: '14px',
                    border: '1px solid rgba(212,197,169,.6)'
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(122,30,58,.1)', color: '#7A1E3A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '.85rem', flexShrink: 0
                      }}>{(t.name_ar || t.name_en || '?').slice(0, 2)}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '.87rem' }}>{t.name_ar}</div>
                        <div style={{ fontSize: '.72rem', color: '#8A7B6A' }}>{t.subject_ar} · {t.exp} سنة</div>
                        <div style={{ fontSize: '.7rem', color: '#A07010', marginTop: 2 }}>{t.grade}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── FEES ── */}
        {tab === 'fees' && (
          <div>
            <SectionTitle>جدول الرسوم الرسمية</SectionTitle>
            <Card>
              {fees.map((fee, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 10, alignItems: 'end' }}>
                  <MiniField label="المرحلة (عربي)" value={fee.stage_ar}
                    onChange={e => { const n = [...fees]; n[i].stage_ar = e.target.value; setFees(n) }} placeholder="ابتدائي" />
                  <MiniField label="Stage (EN)" value={fee.stage_en}
                    onChange={e => { const n = [...fees]; n[i].stage_en = e.target.value; setFees(n) }} placeholder="Primary" />
                  <MiniField label="الحد الأدنى QAR" value={fee.min_fee} type="number"
                    onChange={e => { const n = [...fees]; n[i].min_fee = e.target.value; setFees(n) }} placeholder="45000" />
                  <MiniField label="الحد الأقصى QAR" value={fee.max_fee} type="number"
                    onChange={e => { const n = [...fees]; n[i].max_fee = e.target.value; setFees(n) }} placeholder="55000" />
                  <button onClick={() => setFees(fees.filter((_, j) => j !== i))} style={{
                    padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(160,48,48,.3)',
                    background: 'rgba(160,48,48,.05)', color: '#A03030',
                    cursor: 'pointer', fontSize: 14, marginBottom: 0
                  }}>✕</button>
                </div>
              ))}
              <button onClick={() => setFees([...fees, { stage_ar: '', stage_en: '', min_fee: '', max_fee: '' }])} style={{
                padding: '7px 14px', borderRadius: 8,
                border: '1.5px dashed rgba(122,30,58,.3)', background: 'transparent',
                color: '#7A1E3A', fontSize: '.8rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', marginBottom: 14
              }}>+ إضافة مرحلة</button>
              <SaveBtn saving={false} saved={false} onClick={saveFees} label="حفظ جدول الرسوم" />
            </Card>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {tab === 'reviews' && (
          <div>
            <SectionTitle>التقييمات الواردة ({reviews.length})</SectionTitle>
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: '#8A7B6A', fontSize: '.85rem' }}>
                لا توجد تقييمات بعد
              </div>
            ) : reviews.map(r => (
              <div key={r.id} style={{
                background: '#fff', borderRadius: 12, padding: '16px',
                border: '1px solid rgba(212,197,169,.6)', marginBottom: 10
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '.87rem' }}>{r.author || 'مجهول'}</span>
                    <span style={{ fontSize: '.72rem', color: '#8A7B6A', marginRight: 8 }}>
                      {r.qid_masked || ''} · {r.role === 'parent' ? 'ولي أمر' : r.role === 'student' ? 'طالب' : ''}
                    </span>
                  </div>
                  <span style={{ color: '#C8921A', fontSize: 14 }}>{'★'.repeat(r.rating || 0)}</span>
                </div>
                <p style={{ fontSize: '.83rem', color: '#4A3A28', margin: 0, lineHeight: 1.7 }}>
                  {r.text_ar || r.text_en}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Small reusable components ──
const inputStyle = {
  padding: '9px 12px', background: 'rgba(248,244,238,.8)',
  border: '1.5px solid rgba(212,197,169,.6)', borderRadius: 9,
  color: '#241A10', fontFamily: "'DM Sans', sans-serif",
  fontSize: '.85rem', outline: 'none', width: '100%', boxSizing: 'border-box'
}

const SectionTitle = ({ children, style }) => (
  <h2 style={{ fontWeight: 700, fontSize: '.97rem', marginBottom: 14, color: '#241A10', ...style }}>{children}</h2>
)

const Card = ({ children, style }) => (
  <div style={{
    background: '#fff', borderRadius: 14, padding: '18px 16px',
    border: '1px solid rgba(212,197,169,.6)',
    boxShadow: '0 2px 8px rgba(36,26,16,.04)', ...style
  }}>{children}</div>
)

const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>{children}</div>
)

const FieldLabel = ({ children }) => (
  <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#8A7B6A', marginBottom: 4, textTransform: 'uppercase', letterSpacing: .8 }}>{children}</div>
)

const Field = ({ label, ...props }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <input {...props} style={inputStyle} />
  </div>
)

const MiniField = ({ label, ...props }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    <input {...props} style={{ ...inputStyle, fontSize: '.8rem', padding: '8px 10px' }} />
  </div>
)

const SaveBtn = ({ saving, saved, onClick, label = 'حفظ التغييرات' }) => (
  <button onClick={onClick} disabled={saving} style={{
    marginTop: 16, padding: '10px 22px', borderRadius: 9, border: 'none',
    background: saved ? '#1A7A4A' : saving ? '#C4A4B0' : 'linear-gradient(135deg,#6B1830,#9B2548)',
    color: '#FFF8F0', fontFamily: 'inherit', fontSize: '.87rem',
    fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
    transition: 'background .3s'
  }}>
    {saved ? '✓ تم الحفظ' : saving ? '...' : label}
  </button>
)

import { useState, useEffect, useRef } from 'react'
import Logo from './components/Logo'

/* ══════════════════════════════════════════════════
   EDUQATAR — PREMIUM LANDING PAGE v2
   - Cairo font for Arabic (professional & widely used)
   - Larger dynamic hero visual
   - Animated scroll indicator
   - Qatar SVG map with school pins
   - School comparison tool
   - Live stats ticker
   - Featured teacher section
   - Parent stories
   - Ministry badge
══════════════════════════════════════════════════ */

const SCHOOLS_DATA = [
  { id:1, name:{ar:'مدرسة الدوحة الدولية',en:'Doha International School'}, area:{ar:'المسيلة',en:'Al Messila'}, curriculum:'British', founded:1975, students:2200, igcse:81, match:94, rating:4.8, reviews:312, img:'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80', color:'#7A1E3A', lat:25.285, lng:51.487 },
  { id:2, name:{ar:'أكاديمية قطر الأمريكية',en:'Qatar American Academy'}, area:{ar:'الغرافة',en:'Al Gharrafa'}, curriculum:'American', founded:1990, students:1800, igcse:78, match:88, rating:4.7, reviews:241, img:'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80', color:'#1A5AA0', lat:25.352, lng:51.442 },
  { id:3, name:{ar:'مدرسة شيربورن قطر',en:'Sherborne Qatar'}, area:{ar:'الخور',en:'Al Khor'}, curriculum:'Premium British', founded:2009, students:420, igcse:92, match:91, rating:5.0, reviews:189, img:'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80', color:'#1A7A4A', lat:25.683, lng:51.496 },
  { id:4, name:{ar:'المدرسة الفرنسية الدولية',en:'French International School'}, area:{ar:'الروضة',en:'Al Rawda'}, curriculum:'French IB', founded:1988, students:960, igcse:74, match:82, rating:4.5, reviews:156, img:'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80', color:'#A07010', lat:25.268, lng:51.521 },
  { id:5, name:{ar:'مدرسة الخليج الانجليزية',en:'Gulf English School'}, area:{ar:'الدوحة',en:'Doha'}, curriculum:'British', founded:1982, students:1400, igcse:69, match:79, rating:4.3, reviews:198, img:'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80', color:'#7A1E3A', lat:25.296, lng:51.534 },
  { id:6, name:{ar:'الأكاديمية الآسيوية',en:'Asian International Academy'}, area:{ar:'أبو حمور',en:'Abu Hamour'}, curriculum:'Indian CBSE', founded:2001, students:2100, igcse:71, match:76, rating:4.4, reviews:267, img:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', color:'#1A5AA0', lat:25.231, lng:51.458 },
]

const FEATURED_TEACHER = {
  nameAr:'فاطمة النعيمي', nameEn:'Fatima Al-Naimi',
  subjectAr:'اللغة العربية', subjectEn:'Arabic Language',
  schoolAr:'مدرسة الدوحة الدولية', schoolEn:'Doha International School',
  exp:15, rating:4.9, reviews:112,
  quoteAr:'التعليم ليس مجرد نقل معلومات، بل هو إشعال شعلة الفضول في قلب كل طالب.',
  quoteEn:'Education is not merely transferring information, but igniting the flame of curiosity in every student.',
  achievements:{ar:['أفضل مدرسة 2024','100% نجاح IGCSE','ذكرها 89 ولي أمر'],en:['Best Teacher 2024','100% IGCSE Pass','Mentioned by 89 parents']}
}

const PARENT_STORIES = [
  { nameAr:'أم عبدالله الهاشمي', nameEn:'Um Abdullah Al-Hashimi', roleAr:'ولي أمر — مدرسة الدوحة', roleEn:'Parent — Doha School', textAr:'ساعدتني المنصة في اختيار أفضل مدرسة لابني. التقييمات دقيقة جداً ووفّرت عليّ أشهراً من البحث.', textEn:'The platform helped me choose the best school. Reviews are very accurate and saved me months of research.', rating:5, color:'#7A1E3A' },
  { nameAr:'خالد السيد', nameEn:'Khaled Al-Sayed', roleAr:'طالب — شيربورن قطر', roleEn:'Student — Sherborne Qatar', textAr:'أخيراً منصة تعطي صوتاً حقيقياً للطلاب. تقييماتنا مسموعة وموثّقة بالهوية القطرية.', textEn:'Finally a platform that gives real voice to students. Our reviews are heard and QID-verified.', rating:5, color:'#1A5AA0' },
  { nameAr:'سارة القحطاني', nameEn:'Sarah Al-Qahtani', roleAr:'ولية أمر — الأكاديمية الأمريكية', roleEn:'Parent — American Academy', textAr:'قارنت بين 5 مدارس في ساعة واحدة! كل المعلومات في مكان واحد وموثوقة من الوزارة.', textEn:'Compared 5 schools in one hour! All information in one trusted place, verified by the Ministry.', rating:5, color:'#1A7A4A' },
]

const TICKER_ITEMS = [
  {ar:'تم إضافة تقييم جديد منذ 3 دقائق', en:'New review added 3 minutes ago'},
  {ar:'مدرسة الدوحة الدولية — 81% IGCSE 2024', en:'Doha International School — 81% IGCSE 2024'},
  {ar:'18,400+ ولي أمر يثقون بـ EduQatar', en:'18,400+ parents trust EduQatar'},
  {ar:'تم التحقق من 47 مدرسة من وزارة التعليم', en:'47 schools verified by Ministry of Education'},
  {ar:'شيربورن قطر — أعلى تقييم هذا الشهر ⭐ 5.0', en:'Sherborne Qatar — Highest rated this month ⭐ 5.0'},
]

function useReveal(threshold=0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true) }, { threshold })
    if(ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function Counter({ target }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useReveal()
  useEffect(() => {
    if(!visible) return
    const num = parseInt(target.replace(/[^0-9]/g,''))
    if(isNaN(num)) { setCount(target); return }
    let start = 0
    const step = Math.ceil(num/60)
    const timer = setInterval(() => {
      start = Math.min(start+step, num)
      setCount(start)
      if(start>=num) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [visible, target])
  const isNaN2 = isNaN(parseInt(target.replace(/[^0-9]/g,'')))
  return <span ref={ref}>{isNaN2 ? target : (target.includes('+') ? count.toLocaleString()+'+' : target.includes('%') ? count+'%' : count.toLocaleString())}</span>
}

function Reveal({ children, delay=0, direction='up' }) {
  const [ref, visible] = useReveal()
  const t = { up:'translateY(40px)', left:'translateX(-40px)', right:'translateX(40px)', scale:'scale(0.92)' }
  return (
    <div ref={ref} style={{
      opacity: visible?1:0,
      transform: visible?'none':t[direction],
      transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`
    }}>{children}</div>
  )
}

/* ── Qatar SVG Map ── */
function QatarMap({ lang, schools }) {
  const [hovered, setHovered] = useState(null)
  const isRTL = lang==='ar'

  // Qatar map path (simplified outline)
  const qatarPath = "M280,40 L320,35 L355,50 L370,80 L365,130 L350,180 L330,230 L310,270 L295,300 L280,320 L265,300 L250,260 L240,210 L238,160 L245,110 L255,70 Z"

  // Convert lat/lng to SVG coordinates
  const toSVG = (lat, lng) => {
    const minLat=25.0, maxLat=26.2, minLng=50.7, maxLng=51.7
    const x = ((lng-minLng)/(maxLng-minLng)) * 240 + 200
    const y = ((maxLat-lat)/(maxLat-minLat)) * 320 + 30
    return { x, y }
  }

  return (
    <div style={{ position:'relative', width:'100%' }}>
      <svg width="100%" viewBox="0 0 600 400" style={{ overflow:'visible' }}>
        <defs>
          <filter id="mapGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <radialGradient id="mapBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(122,30,58,.08)"/>
            <stop offset="100%" stopColor="rgba(122,30,58,.02)"/>
          </radialGradient>
        </defs>

        {/* Background */}
        <rect x="150" y="10" width="300" height="380" rx="20" fill="url(#mapBg)" stroke="rgba(122,30,58,.1)" strokeWidth="1"/>

        {/* Qatar shape */}
        <path d={qatarPath} fill="rgba(122,30,58,.12)" stroke="rgba(122,30,58,.4)" strokeWidth="2" strokeLinejoin="round"/>

        {/* Grid lines */}
        {[1,2,3,4].map(i=>(
          <line key={i} x1="150" y1={10+i*76} x2="450" y2={10+i*76} stroke="rgba(122,30,58,.06)" strokeWidth="1"/>
        ))}
        {[1,2,3].map(i=>(
          <line key={i} x1={150+i*75} y1="10" x2={150+i*75} y2="390" stroke="rgba(122,30,58,.06)" strokeWidth="1"/>
        ))}

        {/* School pins */}
        {schools.map((s,i) => {
          const pos = toSVG(s.lat, s.lng)
          const isHov = hovered===s.id
          return (
            <g key={s.id} style={{cursor:'pointer'}}
              onMouseEnter={()=>setHovered(s.id)}
              onMouseLeave={()=>setHovered(null)}>
              {/* Pulse ring */}
              {isHov && (
                <circle cx={pos.x} cy={pos.y} r="20" fill="none" stroke={s.color} strokeWidth="2" opacity="0.4" style={{animation:'pulse-map 1s ease-out infinite'}}/>
              )}
              {/* Pin circle */}
              <circle cx={pos.x} cy={pos.y} r={isHov?10:7}
                fill={s.color} stroke="white" strokeWidth="2"
                style={{transition:'r .2s', filter:isHov?`drop-shadow(0 0 6px ${s.color}80)`:'none'}}/>
              {/* Number */}
              <text x={pos.x} y={pos.y+1} textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="8" fontWeight="700" fontFamily="DM Sans,sans-serif">{i+1}</text>

              {/* Tooltip */}
              {isHov && (
                <g>
                  <rect x={pos.x-60} y={pos.y-52} width="120" height="44" rx="8"
                    fill="white" stroke={s.color} strokeWidth="1"
                    style={{filter:'drop-shadow(0 4px 12px rgba(0,0,0,.15))'}}/>
                  <text x={pos.x} y={pos.y-35} textAnchor="middle"
                    fill="#241A10" fontSize="9" fontWeight="700" fontFamily="DM Sans,sans-serif">
                    {isRTL ? s.name.ar.slice(0,18) : s.name.en.slice(0,20)}
                  </text>
                  <text x={pos.x} y={pos.y-20} textAnchor="middle"
                    fill={s.color} fontSize="8" fontFamily="DM Sans,sans-serif">
                    ★ {s.rating} · {s.igcse}% IGCSE
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Legend */}
        <text x="160" y="385" fill="rgba(122,30,58,.5)" fontSize="9" fontFamily="DM Sans,sans-serif">
          {isRTL ? '🇶🇦 قطر — مواقع المدارس المسجّلة' : '🇶🇦 Qatar — Registered School Locations'}
        </text>
      </svg>

      {/* School list beside map */}
      <div style={{ position:'absolute', top:10, right: isRTL?'auto':'10px', left: isRTL?'10px':'auto', display:'flex', flexDirection:'column', gap:4, maxWidth:160 }}>
        {schools.slice(0,4).map((s,i)=>(
          <div key={s.id}
            onMouseEnter={()=>setHovered(s.id)}
            onMouseLeave={()=>setHovered(null)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 8px', background:'white', borderRadius:8, border:`1px solid ${hovered===s.id?s.color:'rgba(212,197,169,.4)'}`, cursor:'pointer', transition:'all .2s', boxShadow:hovered===s.id?`0 4px 12px ${s.color}25`:'none' }}>
            <div style={{ width:16, height:16, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ color:'white', fontSize:8, fontWeight:700 }}>{i+1}</span>
            </div>
            <span style={{ fontSize:'.68rem', fontWeight:600, color:'#241A10', lineHeight:1.2 }}>{isRTL?s.name.ar.slice(0,12):s.name.en.slice(0,14)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Comparison Tool ── */
function ComparisonTool({ lang, schools }) {
  const isRTL = lang==='ar'
  const [a, setA] = useState(schools[0])
  const [b, setB] = useState(schools[1])

  const metrics = [
    { key:'igcse', label:{ar:'IGCSE A%',en:'IGCSE A%'}, suffix:'%', color:'#7A1E3A' },
    { key:'rating', label:{ar:'التقييم',en:'Rating'}, suffix:'/5', color:'#C8921A' },
    { key:'match', label:{ar:'نسبة التطابق',en:'Match Score'}, suffix:'%', color:'#1A5AA0' },
    { key:'students', label:{ar:'عدد الطلاب',en:'Students'}, suffix:'', color:'#1A7A4A' },
    { key:'reviews', label:{ar:'عدد التقييمات',en:'Reviews'}, suffix:'', color:'#A07010' },
  ]

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid rgba(212,197,169,.5)', boxShadow:'0 4px 24px rgba(36,26,16,.06)' }}>
      {/* School selectors */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', gap:12, alignItems:'center', marginBottom:24 }}>
        <select value={a.id} onChange={e=>setA(schools.find(s=>s.id===parseInt(e.target.value)))} style={{ padding:'10px 14px', borderRadius:10, border:'2px solid rgba(122,30,58,.2)', fontFamily:'inherit', fontSize:'.82rem', color:'#241A10', background:'rgba(248,244,238,.8)', outline:'none', cursor:'pointer' }}>
          {schools.map(s=><option key={s.id} value={s.id}>{isRTL?s.name.ar:s.name.en}</option>)}
        </select>
        <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7A1E3A,#C8921A)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'.8rem', flexShrink:0 }}>VS</div>
        <select value={b.id} onChange={e=>setB(schools.find(s=>s.id===parseInt(e.target.value)))} style={{ padding:'10px 14px', borderRadius:10, border:'2px solid rgba(26,90,160,.2)', fontFamily:'inherit', fontSize:'.82rem', color:'#241A10', background:'rgba(248,244,238,.8)', outline:'none', cursor:'pointer' }}>
          {schools.map(s=><option key={s.id} value={s.id}>{isRTL?s.name.ar:s.name.en}</option>)}
        </select>
      </div>

      {/* School headers */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 1fr', gap:8, marginBottom:16 }}>
        <div style={{ textAlign:'center', padding:'12px', background:`${a.color}10`, borderRadius:10, border:`1px solid ${a.color}25` }}>
          <div style={{ fontWeight:700, fontSize:'.85rem', color:a.color, marginBottom:2 }}>{isRTL?a.name.ar:a.name.en}</div>
          <div style={{ fontSize:'.72rem', color:'#8A7B6A' }}>{a.curriculum} · {a.founded}</div>
        </div>
        <div/>
        <div style={{ textAlign:'center', padding:'12px', background:`${b.color}10`, borderRadius:10, border:`1px solid ${b.color}25` }}>
          <div style={{ fontWeight:700, fontSize:'.85rem', color:b.color, marginBottom:2 }}>{isRTL?b.name.ar:b.name.en}</div>
          <div style={{ fontSize:'.72rem', color:'#8A7B6A' }}>{b.curriculum} · {b.founded}</div>
        </div>
      </div>

      {/* Metrics */}
      {metrics.map(m=>{
        const aVal = a[m.key], bVal = b[m.key]
        const max = Math.max(aVal, bVal)
        const aWin = aVal >= bVal
        return (
          <div key={m.key} style={{ marginBottom:12 }}>
            <div style={{ fontSize:'.72rem', color:'#8A7B6A', fontWeight:600, marginBottom:6, textAlign:'center', textTransform:'uppercase', letterSpacing:.8 }}>{m.label[lang]}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 1fr', gap:8, alignItems:'center' }}>
              {/* A bar */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:3 }}>
                <span style={{ fontSize:'.88rem', fontWeight:700, color:aWin?a.color:'#8A7B6A' }}>{aVal}{m.suffix}</span>
                <div style={{ width:'100%', height:6, background:'rgba(212,197,169,.3)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${(aVal/max)*100}%`, background:aWin?a.color:'rgba(212,197,169,.5)', borderRadius:3, transition:'width 1s' }}/>
                </div>
              </div>
              {/* Winner badge */}
              <div style={{ textAlign:'center' }}>
                {aWin && aVal!==bVal && <div style={{ background:a.color, color:'white', borderRadius:20, padding:'2px 6px', fontSize:'.65rem', fontWeight:700 }}>✓</div>}
                {!aWin && aVal!==bVal && <div style={{ background:b.color, color:'white', borderRadius:20, padding:'2px 6px', fontSize:'.65rem', fontWeight:700 }}>✓</div>}
                {aVal===bVal && <div style={{ color:'#8A7B6A', fontSize:'.7rem' }}>=</div>}
              </div>
              {/* B bar */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:3 }}>
                <span style={{ fontSize:'.88rem', fontWeight:700, color:!aWin||aVal===bVal?b.color:'#8A7B6A' }}>{bVal}{m.suffix}</span>
                <div style={{ width:'100%', height:6, background:'rgba(212,197,169,.3)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${(bVal/max)*100}%`, background:!aWin||aVal===bVal?b.color:'rgba(212,197,169,.5)', borderRadius:3, transition:'width 1s' }}/>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Main Landing Page ── */
export default function LandingPage({ lang='ar', setPage, setSchool }) {
  const isRTL = lang==='ar'
  const [activeTab, setActiveTab] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [tickerIdx, setTickerIdx] = useState(0)
  const [heroAngle, setHeroAngle] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive:true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ticker
  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i=>(i+1)%TICKER_ITEMS.length), 3500)
    return () => clearInterval(t)
  }, [])

  // Hero rotation
  useEffect(() => {
    const t = setInterval(() => setHeroAngle(a=>a+0.3), 50)
    return () => clearInterval(t)
  }, [])

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #FAF8F4;
      color: #1A1208;
      font-family: ${isRTL ? "'Cairo'" : "'DM Sans'"}, sans-serif;
      direction: ${isRTL ? 'rtl' : 'ltr'};
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: #C8921A; border-radius: 2px; }

    .lp-btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, #6B1830, #9B2548);
      color: #FFF8F0; border: none; border-radius: 50px;
      padding: 14px 28px; font-size: .95rem; font-weight: 700;
      cursor: pointer; font-family: inherit;
      box-shadow: 0 4px 20px rgba(107,24,48,.35);
      transition: all .3s cubic-bezier(.16,1,.3,1);
    }
    .lp-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 40px rgba(107,24,48,.45); }

    .lp-btn-outline {
      display: inline-flex; align-items: center; gap: 8px;
      background: transparent; color: #7A1E3A;
      border: 2px solid rgba(122,30,58,.35); border-radius: 50px;
      padding: 13px 28px; font-size: .95rem; font-weight: 600;
      cursor: pointer; font-family: inherit;
      transition: all .3s cubic-bezier(.16,1,.3,1);
    }
    .lp-btn-outline:hover { background: rgba(122,30,58,.05); border-color: #7A1E3A; transform: translateY(-2px); }

    .school-card {
      background: #fff; border-radius: 20px; overflow: hidden; cursor: pointer;
      border: 1px solid rgba(212,197,169,.5);
      box-shadow: 0 4px 20px rgba(36,26,16,.06);
      transition: all .35s cubic-bezier(.16,1,.3,1);
    }
    .school-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(36,26,16,.12); }

    .tab-pill {
      padding: 8px 20px; border-radius: 50px; font-size: .82rem; font-weight: 600;
      cursor: pointer; border: 2px solid transparent; font-family: inherit;
      transition: all .25s; white-space: nowrap; color: #8A7B6A; background: transparent;
    }
    .tab-pill.active { background: #7A1E3A; color: #FFF8F0; border-color: #7A1E3A; }
    .tab-pill:not(.active):hover { border-color: rgba(122,30,58,.3); color: #7A1E3A; }

    /* Scroll indicator */
    @keyframes scrollBounce {
      0%, 100% { transform: translateY(0) scaleY(1); opacity: .9; }
      30% { transform: translateY(8px) scaleY(.85); opacity: 1; }
      60% { transform: translateY(4px) scaleY(.95); opacity: .8; }
    }
    @keyframes scrollFade {
      0%, 100% { opacity: .7; }
      50% { opacity: 1; }
    }
    @keyframes scrollDot {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(14px); opacity: 0; }
    }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ticker { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse-map { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.5);opacity:0} }
    @keyframes shimmer { 0%{opacity:.5} 50%{opacity:1} 100%{opacity:.5} }
    @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes spinReverse { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
    @keyframes glowPulse { 0%,100%{opacity:.3} 50%{opacity:.7} }

    .hero-text-1 { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) .1s both; }
    .hero-text-2 { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) .25s both; }
    .hero-text-3 { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) .4s both; }
    .hero-btns  { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) .55s both; }
    .hero-proof { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) .7s both; }

    .stat-card {
      background: #fff; border-radius: 20px;
      border: 1px solid rgba(212,197,169,.5);
      padding: 28px 20px; text-align: center;
      box-shadow: 0 4px 24px rgba(36,26,16,.05);
      transition: all .3s cubic-bezier(.16,1,.3,1);
    }
    .stat-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(36,26,16,.1); }

    .story-card {
      background: #fff; border-radius: 20px;
      border: 1px solid rgba(212,197,169,.5);
      padding: 28px; position: relative; overflow: hidden;
      box-shadow: 0 4px 24px rgba(36,26,16,.05);
      transition: all .3s cubic-bezier(.16,1,.3,1);
    }
    .story-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(36,26,16,.1); }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .hero-grid { grid-template-columns: 1fr !important; }
      .stats-grid { grid-template-columns: 1fr 1fr !important; }
      .schools-grid { grid-template-columns: 1fr !important; }
    }
  `

  return (
    <div style={{ minHeight:'100vh', background:'#FAF8F4' }}>
      <style>{css}</style>

      {/* ══ LIVE TICKER ══ */}
      <div style={{ background:'linear-gradient(135deg,#6B1830,#9B2548)', height:36, display:'flex', alignItems:'center', overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0px, rgba(255,255,255,.05) 1px, transparent 1px, transparent 60px)' }}/>
        <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', padding:'0 24px', display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#C8921A', animation:'shimmer 1.5s ease-in-out infinite' }}/>
            <span style={{ fontSize:'.68rem', fontWeight:700, color:'rgba(255,255,255,.7)', textTransform:'uppercase', letterSpacing:1 }}>{isRTL?'مباشر':'LIVE'}</span>
          </div>
          <div key={tickerIdx} style={{ fontSize:'.78rem', color:'rgba(255,255,255,.9)', fontWeight:500, animation:'ticker .4s ease both' }}>
            {TICKER_ITEMS[tickerIdx][lang]}
          </div>
        </div>
      </div>

      {/* ══ NAV ══ */}
      <nav style={{
        position:'sticky', top:0, left:0, right:0, zIndex:100,
        background: scrollY>40?'rgba(250,248,244,.97)':'transparent',
        backdropFilter: scrollY>40?'blur(20px)':'none',
        borderBottom: scrollY>40?'1px solid rgba(212,197,169,.4)':'none',
        transition:'all .4s ease',
        height:64, display:'flex', alignItems:'center',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Logo size={40} showText lang={lang}/>

          {/* Ministry badge */}
          <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(26,122,74,.08)', border:'1px solid rgba(26,122,74,.2)', borderRadius:50, padding:'5px 14px' }}>
            <span style={{ fontSize:12 }}>🏛️</span>
            <span style={{ fontSize:'.72rem', fontWeight:600, color:'#1A5A35' }}>
              {isRTL?'معتمدة من وزارة التعليم':'Approved by Ministry of Education'}
            </span>
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button className="hide-mobile" style={{ background:'none', border:'none', color:'#5A4A38', fontSize:'.85rem', fontWeight:500, cursor:'pointer', padding:'6px 12px', borderRadius:8, fontFamily:'inherit' }} onClick={()=>setPage('schools')}>
              {isRTL?'المدارس':'Schools'}
            </button>
            <button className="lp-btn-primary" style={{ padding:'9px 20px', fontSize:'.82rem', borderRadius:50 }} onClick={()=>setPage('auth')}>
              {isRTL?'دخول ←':'Login →'}
            </button>
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', paddingTop:64 }}>

        {/* Background */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:-100, right:-100, width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(122,30,58,.07) 0%, transparent 70%)', animation:'float 12s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', bottom:-80, left:-80, width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(200,146,26,.06) 0%, transparent 70%)', animation:'float2 10s ease-in-out infinite .5s' }}/>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(122,30,58,.05) 1px, transparent 1px)', backgroundSize:'44px 44px', opacity:.6 }}/>
        </div>

        <div className="hero-grid" style={{ maxWidth:1200, margin:'0 auto', padding:'60px 24px', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>

          {/* Text */}
          <div>
            <div className="hero-text-1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(122,30,58,.07)', border:'1px solid rgba(122,30,58,.15)', borderRadius:50, padding:'6px 16px', marginBottom:24 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#7A1E3A', animation:'shimmer 1.5s infinite' }}/>
              <span style={{ fontSize:'.78rem', fontWeight:600, color:'#7A1E3A', letterSpacing:.5 }}>
                🇶🇦 {isRTL?'منصة قطر التعليمية الأولى':"Qatar's #1 Education Platform"}
              </span>
            </div>

            <h1 className="hero-text-2" style={{ fontSize:'clamp(2.4rem,5vw,3.8rem)', fontWeight:900, lineHeight:1.1, marginBottom:20, letterSpacing:isRTL?'-.5px':'-1.5px' }}>
              {isRTL?(
                <>اختر مدرسة<br/>
                <span style={{ color:'#7A1E3A', position:'relative', display:'inline-block' }}>
                  ابنك
                  <svg style={{ position:'absolute', bottom:-8, right:0, left:0, width:'100%' }} height="10" viewBox="0 0 160 10" fill="none">
                    <path d="M4 7 Q80 2 156 7" stroke="#C8921A" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  </svg>
                </span>
                <br/>بثقة تامة</>
              ):(
                <>Find the<br/>
                <span style={{ color:'#7A1E3A', position:'relative', display:'inline-block' }}>
                  Right School
                  <svg style={{ position:'absolute', bottom:-8, right:0, left:0, width:'100%' }} height="10" viewBox="0 0 280 10" fill="none">
                    <path d="M4 7 Q140 2 276 7" stroke="#C8921A" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  </svg>
                </span>
                <br/>with Confidence</>
              )}
            </h1>

            <p className="hero-text-3" style={{ fontSize:'1.05rem', color:'#5A4A38', lineHeight:1.9, marginBottom:36, maxWidth:460 }}>
              {isRTL?'تقييمات موثّقة عبر QID · بروفايلات تفصيلية لكل مدرس · رسوم الوزارة الرسمية · مقارنة ذكية':'QID-verified reviews · Detailed teacher profiles · Official Ministry fees · Smart comparison'}
            </p>

            <div className="hero-btns" style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:48 }}>
              <button className="lp-btn-primary" style={{ fontSize:'1rem', padding:'15px 32px' }} onClick={()=>setPage('schools')}>
                🏫 {isRTL?'استعرض المدارس':'Browse Schools'}
              </button>
              <button className="lp-btn-outline" style={{ fontSize:'1rem', padding:'14px 32px' }} onClick={()=>setPage('auth')}>
                {isRTL?'سجّل مجاناً':'Register Free'}
              </button>
            </div>

            {/* Social proof */}
            <div className="hero-proof" style={{ display:'flex', gap:20, alignItems:'center' }}>
              <div style={{ display:'flex' }}>
                {['#7A1E3A','#1A5AA0','#1A7A4A','#A07010','#9B2548'].map((c,i)=>(
                  <div key={i} style={{ width:34, height:34, borderRadius:'50%', background:c, border:'2.5px solid #FAF8F4', marginLeft:i>0?-10:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:700, color:'#fff' }}>
                    {['أم','KH','SR','FA','MN'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:'flex', gap:2, marginBottom:2 }}>
                  {[1,2,3,4,5].map(n=><span key={n} style={{ color:'#C8921A', fontSize:13 }}>★</span>)}
                </div>
                <div style={{ fontSize:'.75rem', color:'#8A7B6A', fontWeight:500 }}>
                  {isRTL?'+18,000 ولي أمر يثقون بنا':'+18,000 parents trust us'}
                </div>
              </div>
            </div>
          </div>

          {/* ══ LARGE DYNAMIC VISUAL ══ */}
          <div className="hide-mobile" style={{ position:'relative', height:580, display:'flex', alignItems:'center', justifyContent:'center' }}>

            {/* Outer spinning ring */}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:520, height:520, marginTop:-260, marginLeft:-260, borderRadius:'50%', border:'1px dashed rgba(122,30,58,.15)', animation:'spinSlow 40s linear infinite' }}/>

            {/* Middle spinning ring */}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:400, height:400, marginTop:-200, marginLeft:-200, borderRadius:'50%', border:'1px dashed rgba(200,146,26,.12)', animation:'spinReverse 25s linear infinite' }}/>

            {/* Inner ring */}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:290, height:290, marginTop:-145, marginLeft:-145, borderRadius:'50%', border:'1.5px solid rgba(122,30,58,.08)', animation:'spinSlow 15s linear infinite' }}/>

            {/* Glow */}
            <div style={{ position:'absolute', top:'50%', left:'50%', width:200, height:200, marginTop:-100, marginLeft:-100, borderRadius:'50%', background:'radial-gradient(circle, rgba(122,30,58,.12) 0%, transparent 70%)', animation:'glowPulse 3s ease-in-out infinite' }}/>

            {/* Center card */}
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:220, background:'#fff', borderRadius:24, padding:22, boxShadow:'0 24px 80px rgba(122,30,58,.18)', border:'1px solid rgba(212,197,169,.6)', zIndex:3, animation:'float 6s ease-in-out infinite' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#6B1830,#9B2548)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, fontSize:24 }}>📚</div>
              <div style={{ fontWeight:800, fontSize:'.95rem', marginBottom:6 }}>{isRTL?'مدرسة الدوحة':'Doha School'}</div>
              <div style={{ display:'flex', gap:2, marginBottom:10 }}>
                {[1,2,3,4,5].map(n=><span key={n} style={{ color:'#C8921A', fontSize:12 }}>★</span>)}
                <span style={{ fontSize:'.75rem', color:'#8A7B6A', marginRight:4 }}>4.8</span>
              </div>
              <div style={{ background:'rgba(122,30,58,.06)', borderRadius:10, padding:'10px 12px' }}>
                <div style={{ fontSize:'.62rem', color:'#8A7B6A', marginBottom:2 }}>IGCSE A%</div>
                <div style={{ fontSize:'1.8rem', fontWeight:900, color:'#7A1E3A', lineHeight:1 }}>81%</div>
              </div>
              {/* Match ring */}
              <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8 }}>
                <svg width="36" height="36" style={{ transform:'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(212,197,169,.3)" strokeWidth="3.5"/>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#1A7A4A" strokeWidth="3.5" strokeDasharray={`${0.94*2*Math.PI*14} ${2*Math.PI*14}`} strokeLinecap="round"/>
                </svg>
                <div>
                  <div style={{ fontSize:'.76rem', fontWeight:800, color:'#1A7A4A' }}>94%</div>
                  <div style={{ fontSize:'.6rem', color:'#8A7B6A' }}>match</div>
                </div>
              </div>
            </div>

            {/* Orbiting badges — bigger and more dynamic */}
            {[
              { top:'4%', left:'50%', marginLeft:-60, icon:'🔐', label:isRTL?'تحقق QID':'QID Verified', color:'#1A7A4A', anim:'float 5s ease-in-out infinite' },
              { top:'25%', right:'2%', icon:'📊', label:isRTL?'بيانات رسمية':'Official Data', color:'#1A5AA0', anim:'float2 7s ease-in-out infinite .8s' },
              { bottom:'25%', right:'2%', icon:'⭐', label:isRTL?'تقييم موثّق':'Verified Review', color:'#C8921A', anim:'float3 6s ease-in-out infinite 1.2s' },
              { bottom:'4%', left:'50%', marginLeft:-55, icon:'🏆', label:isRTL?'أفضل اختيار':'Best Match', color:'#7A1E3A', anim:'float 8s ease-in-out infinite .4s' },
              { top:'25%', left:'2%', icon:'🏛️', label:isRTL?'معتمد وزارياً':'Ministry Approved', color:'#1A5A35', anim:'float2 5.5s ease-in-out infinite 1.6s' },
              { bottom:'25%', left:'2%', icon:'📋', label:isRTL?'PDF رسمي':'Official PDF', color:'#A07010', anim:'float3 7.5s ease-in-out infinite .2s' },
            ].map((c,i)=>(
              <div key={i} style={{
                position:'absolute', ...c,
                background:'#fff', borderRadius:14, padding:'10px 14px',
                boxShadow:'0 8px 32px rgba(36,26,16,.12)',
                border:`1px solid ${c.color}30`,
                display:'flex', alignItems:'center', gap:8, zIndex:2,
                animation:c.anim,
                minWidth:130,
              }}>
                <span style={{ fontSize:20 }}>{c.icon}</span>
                <span style={{ fontSize:'.73rem', fontWeight:700, color:c.color, whiteSpace:'nowrap' }}>{c.label}</span>
              </div>
            ))}

            {/* Floating school mini cards */}
            {SCHOOLS_DATA.slice(0,3).map((s,i)=>{
              const positions = [
                { top:'12%', left:'8%', anim:'float2 9s ease-in-out infinite' },
                { top:'60%', left:'5%', anim:'float3 7s ease-in-out infinite .6s' },
                { top:'38%', right:'5%', anim:'float 8s ease-in-out infinite 1s' },
              ]
              const pos = positions[i]
              return (
                <div key={s.id} style={{ position:'absolute', ...pos, background:'#fff', borderRadius:12, padding:'8px 10px', boxShadow:'0 6px 20px rgba(36,26,16,.1)', border:`1px solid ${s.color}20`, zIndex:2, animation:pos.anim, width:110 }}>
                  <div style={{ fontSize:'.66rem', fontWeight:700, color:s.color, marginBottom:2 }}>{isRTL?s.name.ar.slice(0,10):s.name.en.slice(0,12)}</div>
                  <div style={{ display:'flex', gap:2 }}>
                    {[1,2,3,4,5].map(n=><span key={n} style={{ color:n<=Math.floor(s.rating)?'#C8921A':'#D4C5A9', fontSize:9 }}>★</span>)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ══ SCROLL INDICATOR — Dynamic ══ */}
        <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor:'pointer' }} onClick={()=>window.scrollBy({top:window.innerHeight, behavior:'smooth'})}>
          <span style={{ fontSize:'.68rem', color:'#8A7B6A', letterSpacing:2, textTransform:'uppercase', fontWeight:600, animation:'scrollFade 2s ease-in-out infinite' }}>
            {isRTL?'اسحب للأسفل':'SCROLL'}
          </span>
          {/* Animated mouse */}
          <div style={{ width:24, height:38, border:'2px solid rgba(122,30,58,.35)', borderRadius:12, display:'flex', justifyContent:'center', paddingTop:6, animation:'scrollBounce 2s ease-in-out infinite' }}>
            <div style={{ width:4, height:8, background:'#7A1E3A', borderRadius:2, animation:'scrollDot 1.5s ease-in-out infinite' }}/>
          </div>
          {/* Arrow chevrons */}
          <div style={{ display:'flex', flexDirection:'column', gap:-2, alignItems:'center' }}>
            {[0,1,2].map(i=>(
              <svg key={i} width="14" height="8" viewBox="0 0 14 8" style={{ animation:`scrollFade 1.5s ease-in-out infinite`, animationDelay:`${i*0.2}s`, opacity:1-i*0.25 }}>
                <path d="M1 1L7 7L13 1" stroke="#7A1E3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section style={{ padding:'80px 24px', background:'#fff', position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(to right, transparent, rgba(122,30,58,.15), rgba(200,146,26,.15), transparent)' }}/>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,146,26,.08)', border:'1px solid rgba(200,146,26,.2)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:700, color:'#A07010' }}>{isRTL?'بالأرقام':'By the Numbers'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, letterSpacing:'-1px' }}>
                {isRTL?'منصة موثوقة بأرقام حقيقية':'Trusted Platform, Real Numbers'}
              </h2>
            </div>
          </Reveal>
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {[['47+',isRTL?'مدرسة مسجّلة':'Registered Schools','🏫','#7A1E3A'],['18400+',isRTL?'تقييم موثّق':'Verified Reviews','⭐','#C8921A'],['98%',isRTL?'دقة البيانات':'Data Accuracy','✓','#1A7A4A'],['QID',isRTL?'تحقق بالهوية':'ID Verification','🔐','#1A5AA0']].map(([num,label,icon,color],i)=>(
              <Reveal key={i} delay={i*0.12}>
                <div className="stat-card">
                  <div style={{ fontSize:32, marginBottom:12 }}>{icon}</div>
                  <div style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:900, color, lineHeight:1, marginBottom:8, fontFamily:"'DM Sans',sans-serif" }}>
                    <Counter target={num}/>
                  </div>
                  <div style={{ fontSize:'.85rem', color:'#5A4A38', fontWeight:500 }}>{label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SCHOOLS SHOWCASE ══ */}
      <section style={{ padding:'100px 24px', background:'#FAF8F4' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:20 }}>
            <Reveal>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(122,30,58,.07)', border:'1px solid rgba(122,30,58,.15)', borderRadius:50, padding:'5px 16px', marginBottom:14 }}>
                  <span style={{ fontSize:'.75rem', fontWeight:600, color:'#7A1E3A' }}>{isRTL?'المدارس المسجّلة':'Registered Schools'}</span>
                </div>
                <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, letterSpacing:'-1px', marginBottom:8 }}>
                  {isRTL?'استعرض أفضل مدارس قطر':"Explore Qatar's Top Schools"}
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ display:'flex', gap:6, background:'rgba(212,197,169,.2)', padding:4, borderRadius:50 }}>
                {(isRTL?['الكل','بريطاني','أمريكي','دولي']:['All','British','American','IB']).map((tab,i)=>(
                  <button key={i} className={`tab-pill ${activeTab===i?'active':''}`} onClick={()=>setActiveTab(i)}>{tab}</button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="schools-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {SCHOOLS_DATA.filter(s=>activeTab===0||(activeTab===1&&s.curriculum.includes('British'))||(activeTab===2&&s.curriculum.includes('American'))||(activeTab===3&&(s.curriculum.includes('IB')||s.curriculum.includes('French')))).map((s,i)=>(
              <Reveal key={s.id} delay={i*0.08}>
                <div className="school-card" onClick={()=>{ setSchool&&setSchool(s); setPage&&setPage('school') }}>
                  <div style={{ height:160, overflow:'hidden', position:'relative' }}>
                    <img src={s.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .6s cubic-bezier(.16,1,.3,1)' }}
                      onMouseEnter={e=>e.target.style.transform='scale(1.06)'}
                      onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(36,26,16,.6) 0%, transparent 60%)' }}/>
                    <div style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,.92)', backdropFilter:'blur(8px)', borderRadius:20, padding:'4px 10px', fontSize:'.72rem', fontWeight:700, color:s.color }}>{s.match}% match</div>
                    <div style={{ position:'absolute', bottom:12, right:12, background:s.color, borderRadius:8, padding:'3px 9px', fontSize:'.68rem', fontWeight:600, color:'#fff' }}>{s.curriculum}</div>
                  </div>
                  <div style={{ padding:'16px 16px 14px' }}>
                    <h3 style={{ fontWeight:700, fontSize:'.95rem', marginBottom:3, lineHeight:1.3 }}>{s.name[lang]}</h3>
                    <p style={{ fontSize:'.74rem', color:'#8A7B6A', marginBottom:12 }}>📍 {s.area[lang]} · Est. {s.founded} · {s.students.toLocaleString()}</p>
                    <div style={{ display:'flex', borderTop:'1px solid rgba(212,197,169,.3)', paddingTop:10 }}>
                      {[[s.igcse+'%','IGCSE A',s.color],[s.rating+'★','Rating','#C8921A'],[s.reviews+'','Reviews','#8A7B6A']].map(([v,l,c])=>(
                        <div key={l} style={{ flex:1, textAlign:'center', borderLeft:'1px solid rgba(212,197,169,.2)' }}>
                          <div style={{ fontSize:'.9rem', fontWeight:700, color:c, lineHeight:1 }}>{v}</div>
                          <div style={{ fontSize:'.62rem', color:'#A09080', marginTop:2 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div style={{ textAlign:'center', marginTop:48 }}>
              <button className="lp-btn-outline" onClick={()=>setPage('schools')}>{isRTL?'عرض كل المدارس ←':'View All Schools →'}</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ QATAR MAP ══ */}
      <section style={{ padding:'100px 24px', background:'#fff' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(26,90,160,.07)', border:'1px solid rgba(26,90,160,.18)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#1A5AA0' }}>🗺️ {isRTL?'خريطة المدارس':'Schools Map'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, letterSpacing:'-1px', marginBottom:12 }}>
                {isRTL?'مدارس قطر على الخريطة':'Qatar Schools on the Map'}
              </h2>
              <p style={{ fontSize:'1rem', color:'#8A7B6A' }}>
                {isRTL?'حرّك الماوس على الدبابيس لعرض تفاصيل كل مدرسة':'Hover over pins to see school details'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{ background:'rgba(248,244,238,.6)', borderRadius:24, padding:24, border:'1px solid rgba(212,197,169,.4)' }}>
              <QatarMap lang={lang} schools={SCHOOLS_DATA}/>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ COMPARISON TOOL ══ */}
      <section style={{ padding:'100px 24px', background:'#FAF8F4' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(122,30,58,.07)', border:'1px solid rgba(122,30,58,.15)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#7A1E3A' }}>⚡ {isRTL?'مقارنة فورية':'Quick Compare'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, letterSpacing:'-1px', marginBottom:12 }}>
                {isRTL?'قارن بين مدرستين بضغطة واحدة':'Compare Two Schools Instantly'}
              </h2>
              <p style={{ fontSize:'1rem', color:'#8A7B6A' }}>
                {isRTL?'اختر مدرستين وشاهد المقارنة الفورية':'Select two schools and see the instant comparison'}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <ComparisonTool lang={lang} schools={SCHOOLS_DATA}/>
          </Reveal>
        </div>
      </section>

      {/* ══ FEATURED TEACHER ══ */}
      <section style={{ padding:'100px 24px', background:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(200,146,26,.06) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,146,26,.08)', border:'1px solid rgba(200,146,26,.2)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#A07010' }}>⭐ {isRTL?'مدرّس الشهر':'Teacher of the Month'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, letterSpacing:'-1px' }}>
                {isRTL?'أبرز مدرّسي هذا الشهر':'This Month\'s Top Teachers'}
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{ background:'linear-gradient(135deg,rgba(122,30,58,.04),rgba(200,146,26,.04))', borderRadius:24, padding:40, border:'1px solid rgba(200,146,26,.15)', display:'grid', gridTemplateColumns:'auto 1fr', gap:40, alignItems:'center' }}>
              {/* Avatar */}
              <div style={{ textAlign:'center' }}>
                <div style={{ width:120, height:120, borderRadius:'50%', background:'linear-gradient(135deg,rgba(160,112,16,.15),rgba(200,146,26,.1))', border:'3px solid rgba(200,146,26,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', margin:'0 auto 16px' }}>👩‍🏫</div>
                <div style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:4 }}>{isRTL?FEATURED_TEACHER.nameAr:FEATURED_TEACHER.nameEn}</div>
                <div style={{ fontSize:'.8rem', color:'#8A7B6A', marginBottom:8 }}>{isRTL?FEATURED_TEACHER.subjectAr:FEATURED_TEACHER.subjectEn}</div>
                <div style={{ display:'flex', gap:2, justifyContent:'center', marginBottom:8 }}>
                  {[1,2,3,4,5].map(n=><span key={n} style={{ color:'#C8921A', fontSize:16 }}>★</span>)}
                </div>
                <div style={{ fontSize:'.85rem', fontWeight:700, color:'#C8921A' }}>{FEATURED_TEACHER.rating} ({FEATURED_TEACHER.reviews})</div>
              </div>
              {/* Content */}
              <div>
                <div style={{ fontSize:'3rem', color:'rgba(200,146,26,.2)', lineHeight:1, marginBottom:8, fontFamily:'serif' }}>"</div>
                <p style={{ fontSize:'1.05rem', color:'#4A3A28', lineHeight:1.9, marginBottom:24, fontStyle:'italic' }}>
                  {isRTL?FEATURED_TEACHER.quoteAr:FEATURED_TEACHER.quoteEn}
                </p>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {FEATURED_TEACHER.achievements[lang].map((a,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:6, background:'white', borderRadius:20, padding:'6px 14px', border:'1px solid rgba(200,146,26,.2)', fontSize:'.78rem', fontWeight:600, color:'#A07010' }}>
                      <span>🏆</span> {a}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:16, fontSize:'.78rem', color:'#8A7B6A' }}>
                  📍 {isRTL?FEATURED_TEACHER.schoolAr:FEATURED_TEACHER.schoolEn} · {FEATURED_TEACHER.exp} {isRTL?'سنة خبرة':'yrs exp'}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding:'100px 24px', background:'#FAF8F4' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(26,122,74,.07)', border:'1px solid rgba(26,122,74,.18)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#1A7A4A' }}>{isRTL?'كيف تعمل':'How It Works'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, letterSpacing:'-1px' }}>
                {isRTL?'٤ خطوات للقرار الصحيح':'4 Steps to the Right Decision'}
              </h2>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
            {(isRTL?[['01','ابحث عن مدرسة','ابحث بالاسم أو المنطقة أو المنهج'],['02','اقرأ التقييمات','تقييمات موثّقة من أهالي وطلاب حقيقيين'],['03','قارن المدارس','قارن الرسوم والأداء والمدرسين'],['04','اختر بثقة','قرار مبني على بيانات حقيقية']]:[['01','Search a School','Search by name, area, or curriculum'],['02','Read Reviews','Verified reviews from real parents & students'],['03','Compare Schools','Compare fees, performance & teachers'],['04','Choose Confidently','Decision based on real verified data']]).map(([n,title,desc],i)=>(
              <Reveal key={i} delay={i*0.12}>
                <div style={{ textAlign:'center', position:'relative' }}>
                  <div style={{ position:'relative', display:'inline-block', marginBottom:20 }}>
                    <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,rgba(122,30,58,.1),rgba(122,30,58,.05))', border:'2px solid rgba(122,30,58,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
                      <span style={{ fontSize:'1.2rem', fontWeight:900, color:'#7A1E3A', fontFamily:"'DM Sans',sans-serif" }}>{n}</span>
                    </div>
                    {i<3&&<div style={{ position:'absolute', top:'50%', [isRTL?'left':'right']:'-100%', width:'100%', height:1, background:`linear-gradient(${isRTL?'to left':'to right'},rgba(122,30,58,.25),transparent)`, transform:'translateY(-50%)' }}/>}
                  </div>
                  <h3 style={{ fontWeight:700, fontSize:'.95rem', marginBottom:8 }}>{title}</h3>
                  <p style={{ fontSize:'.8rem', color:'#8A7B6A', lineHeight:1.7 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRUST FEATURES ══ */}
      <section style={{ padding:'100px 24px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:80 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(26,90,160,.07)', border:'1px solid rgba(26,90,160,.18)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#1A5AA0' }}>{isRTL?'لماذا EduQatar':'Why EduQatar'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, letterSpacing:'-1px' }}>
                {isRTL?'منصة لا يمكن التلاعب بها':"A Platform That Can't Be Manipulated"}
              </h2>
            </div>
          </Reveal>
          {[
            { icon:'🪪', color:'#7A1E3A', ar:{title:'ربط حقيقي بالهوية القطرية',body:'كل حساب مربوط ببطاقة هوية قطرية حقيقية. شخص واحد = تقييم واحد فقط طوال الحياة.',tag:'QID Binding'}, en:{title:'Real QID Binding',body:'Every account linked to a real Qatari ID. One person = one review for life.',tag:'QID Binding'} },
            { icon:'📋', color:'#1A5AA0', ar:{title:'تحقق من التسجيل الفعلي',body:'لا يمكن لأي شخص كتابة تقييم إلا إذا كان طفله مسجّلاً فعلاً في المدرسة.',tag:'Enrollment Check'}, en:{title:'Actual Enrollment Verification',body:"No one can review unless their child is actually enrolled in the school.",tag:'Enrollment Check'} },
            { icon:'🤖', color:'#1A7A4A', ar:{title:'ذكاء اصطناعي يكشف التزوير',body:'نظام AI يرصد التقييمات المنسّقة من نفس الشبكة ويحذفها تلقائياً.',tag:'AI Detection'}, en:{title:'AI Fraud Detection',body:'AI system detects coordinated reviews from the same network automatically.',tag:'AI Detection'} },
            { icon:'📊', color:'#A07010', ar:{title:'بيانات مباشرة من الوزارة',body:'الرسوم الدراسية والأداء الأكاديمي مستخرجة مباشرة من قرارات وزارة التعليم.',tag:'Ministry Data'}, en:{title:'Direct Ministry Data',body:'Fees and performance extracted directly from Ministry of Education decrees.',tag:'Ministry Data'} },
          ].map((f,i)=>(
            <Reveal key={i} delay={0.1} direction={i%2===0?'left':'right'}>
              <div style={{ display:'flex', alignItems:'center', gap:60, padding:'50px 0', borderBottom:i<3?'1px solid rgba(212,197,169,.2)':'none', flexDirection:i%2===0?(isRTL?'row':'row'):(isRTL?'row-reverse':'row-reverse') }}>
                <div style={{ flex:'0 0 260px', display:'flex', justifyContent:'center' }}>
                  <div style={{ width:200, height:200, borderRadius:28, background:`${f.color}08`, border:`2px solid ${f.color}18`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, boxShadow:`0 20px 60px ${f.color}10` }}>
                    <span style={{ fontSize:60 }}>{f.icon}</span>
                    <div style={{ background:f.color, borderRadius:20, padding:'4px 12px', fontSize:'.72rem', fontWeight:700, color:'#fff' }}>{(isRTL?f.ar:f.en).tag}</div>
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontSize:'clamp(1.3rem,3vw,1.7rem)', fontWeight:800, marginBottom:16, letterSpacing:'-.5px' }}>{(isRTL?f.ar:f.en).title}</h3>
                  <p style={{ fontSize:'1rem', color:'#5A4A38', lineHeight:1.9, maxWidth:480 }}>{(isRTL?f.ar:f.en).body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ PARENT STORIES ══ */}
      <section style={{ padding:'100px 24px', background:'#FAF8F4', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(122,30,58,.04) 1px, transparent 1px)', backgroundSize:'30px 30px', pointerEvents:'none' }}/>
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,146,26,.08)', border:'1px solid rgba(200,146,26,.2)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#A07010' }}>{isRTL?'قصص حقيقية':'Real Stories'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:900, letterSpacing:'-1px' }}>
                {isRTL?'ماذا يقول آباؤنا وطلابنا':'What Our Parents & Students Say'}
              </h2>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
            {PARENT_STORIES.map((s,i)=>(
              <Reveal key={i} delay={i*0.12}>
                <div className="story-card">
                  <div style={{ position:'absolute', top:20, [isRTL?'left':'right']:20, fontSize:80, color:s.color, opacity:.06, fontFamily:'serif', lineHeight:1 }}>"</div>
                  <div style={{ display:'flex', gap:2, marginBottom:16 }}>
                    {[1,2,3,4,5].map(n=><span key={n} style={{ color:'#C8921A', fontSize:14 }}>★</span>)}
                  </div>
                  <p style={{ fontSize:'.92rem', color:'#4A3A28', lineHeight:1.85, marginBottom:20, position:'relative' }}>
                    {isRTL?s.textAr:s.textEn}
                  </p>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <div style={{ width:42, height:42, borderRadius:'50%', background:`${s.color}20`, border:`2px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.82rem', color:s.color, flexShrink:0 }}>
                      {(isRTL?s.nameAr:s.nameEn).slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'.87rem' }}>{isRTL?s.nameAr:s.nameEn}</div>
                      <div style={{ fontSize:'.73rem', color:s.color, fontWeight:600 }}>{isRTL?s.roleAr:s.roleEn}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ padding:'100px 24px', background:'linear-gradient(135deg,#1A0810 0%,#4A0D1E 40%,#6B1830 100%)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-60, width:300, height:300, borderRadius:'50%', background:'rgba(200,146,26,.08)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize:'40px 40px' }}/>
        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <Reveal>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,146,26,.15)', border:'1px solid rgba(200,146,26,.3)', borderRadius:50, padding:'6px 18px', marginBottom:24 }}>
              <span style={{ fontSize:'.78rem', fontWeight:600, color:'#C8921A' }}>🚀 {isRTL?'ابدأ مجاناً اليوم':'Start Free Today'}</span>
            </div>
            <h2 style={{ fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:900, color:'#FAF7F2', lineHeight:1.1, marginBottom:20, letterSpacing:'-1px' }}>
              {isRTL?'مستعد تختار المدرسة\nالمناسبة لأبنائك?':'Ready to Find the\nRight School?'}
            </h2>
            <p style={{ fontSize:'1.05rem', color:'rgba(248,244,238,.7)', lineHeight:1.8, marginBottom:40, maxWidth:500, margin:'0 auto 40px' }}>
              {isRTL?'انضم لأكثر من 18,000 ولي أمر يستخدمون EduQatar لاتخاذ قرارات تعليمية مبنية على البيانات.':'Join 18,000+ parents using EduQatar for data-driven educational decisions.'}
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <button style={{ background:'linear-gradient(135deg,#C8921A,#A07010)', color:'#1A0810', border:'none', borderRadius:50, padding:'15px 36px', fontSize:'1rem', fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 20px rgba(200,146,26,.4)', transition:'all .3s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}
                onClick={()=>setPage('auth')}>
                🏫 {isRTL?'سجّل مجاناً الآن':'Register Free Now'}
              </button>
              <button style={{ background:'transparent', color:'rgba(248,244,238,.85)', border:'2px solid rgba(248,244,238,.25)', borderRadius:50, padding:'14px 32px', fontSize:'1rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .3s' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(248,244,238,.6)'; e.currentTarget.style.color='#FAF7F2' }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(248,244,238,.25)'; e.currentTarget.style.color='rgba(248,244,238,.85)' }}
                onClick={()=>setPage('schools')}>
                {isRTL?'استعرض المدارس':'Browse Schools'}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background:'#0F0608', padding:'48px 24px 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:32, marginBottom:40 }}>
            <div>
              <Logo size={42} showText lang={lang}/>
              <p style={{ fontSize:'.82rem', color:'rgba(248,244,238,.45)', marginTop:12, maxWidth:260, lineHeight:1.7 }}>
                {isRTL?"منصة قطر التعليمية الأولى للتقييمات الموثّقة ومقارنة المدارس.":"Qatar's #1 education platform for verified reviews and school comparison."}
              </p>
              {/* Ministry badge in footer */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(26,122,74,.15)', border:'1px solid rgba(26,122,74,.3)', borderRadius:8, padding:'6px 12px', marginTop:14 }}>
                <span style={{ fontSize:12 }}>🏛️</span>
                <span style={{ fontSize:'.72rem', fontWeight:600, color:'rgba(26,122,74,.9)' }}>
                  {isRTL?'معتمدة من وزارة التعليم والتعليم العالي':'Approved by Ministry of Education'}
                </span>
              </div>
            </div>
            <div style={{ display:'flex', gap:48, flexWrap:'wrap' }}>
              {(isRTL?[{title:'المنصة',links:['المدارس','المدرسون','التقييمات','AI Insight']},{title:'الشركة',links:['من نحن','سياسة الخصوصية','الشروط','تواصل معنا']}]:[{title:'Platform',links:['Schools','Teachers','Reviews','AI Insight']},{title:'Company',links:['About','Privacy Policy','Terms','Contact']}]).map((col,i)=>(
                <div key={i}>
                  <div style={{ fontSize:'.8rem', fontWeight:700, color:'rgba(248,244,238,.7)', marginBottom:14, letterSpacing:.8, textTransform:'uppercase' }}>{col.title}</div>
                  {col.links.map(l=>(
                    <div key={l} style={{ fontSize:'.82rem', color:'rgba(248,244,238,.4)', marginBottom:8, cursor:'pointer', transition:'color .2s' }}
                      onMouseEnter={e=>e.target.style.color='rgba(248,244,238,.8)'}
                      onMouseLeave={e=>e.target.style.color='rgba(248,244,238,.4)'}>{l}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ height:1, background:'rgba(248,244,238,.08)', marginBottom:24 }}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <span style={{ fontSize:'.75rem', color:'rgba(248,244,238,.3)' }}>© 2025 EduQatar. {isRTL?'جميع الحقوق محفوظة.':'All rights reserved.'}</span>
            <span style={{ fontSize:'.75rem', color:'rgba(248,244,238,.3)' }}>Made with ❤️ in Qatar 🇶🇦</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

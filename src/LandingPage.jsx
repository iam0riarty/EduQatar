import { useState, useEffect, useRef } from 'react'
import Logo from './components/Logo'

/* ══════════════════════════════════════════════════
   EDUQATAR — WORLD-CLASS LANDING PAGE
   Luxury editorial meets infographic clarity
   Warm cream palette, maroon accents, gold highlights
   Smooth scroll animations, parallax, micro-interactions
══════════════════════════════════════════════════ */

const SCHOOLS_DATA = [
  { id:1, name:{ar:'مدرسة الدوحة الدولية',en:'Doha International School'}, area:{ar:'المسيلة',en:'Al Messila'}, curriculum:'British', founded:1975, students:2200, igcse:81, match:94, rating:4.8, reviews:312, img:'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80', color:'#7A1E3A' },
  { id:2, name:{ar:'أكاديمية قطر الأمريكية',en:'Qatar American Academy'}, area:{ar:'الغرافة',en:'Al Gharrafa'}, curriculum:'American', founded:1990, students:1800, igcse:78, match:88, rating:4.7, reviews:241, img:'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80', color:'#1A5AA0' },
  { id:3, name:{ar:'مدرسة شيربورن قطر',en:'Sherborne Qatar'}, area:{ar:'الخور',en:'Al Khor'}, curriculum:'Premium British', founded:2009, students:420, igcse:92, match:91, rating:5.0, reviews:189, img:'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&q=80', color:'#1A7A4A' },
  { id:4, name:{ar:'المدرسة الفرنسية الدولية',en:'French International School'}, area:{ar:'الروضة',en:'Al Rawda'}, curriculum:'French IB', founded:1988, students:960, igcse:74, match:82, rating:4.5, reviews:156, img:'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80', color:'#A07010' },
  { id:5, name:{ar:'مدرسة الخليج الانجليزية',en:'Gulf English School'}, area:{ar:'الدوحة',en:'Doha'}, curriculum:'British', founded:1982, students:1400, igcse:69, match:79, rating:4.3, reviews:198, img:'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80', color:'#7A1E3A' },
  { id:6, name:{ar:'الأكاديمية الآسيوية',en:'Asian International Academy'}, area:{ar:'أبو حمور',en:'Abu Hamour'}, curriculum:'Indian CBSE', founded:2001, students:2100, igcse:71, match:76, rating:4.4, reviews:267, img:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80', color:'#1A5AA0' },
]

const STATS = [
  { num:'47', label:'مدرسة مسجّلة', labelEn:'Registered Schools', icon:'🏫' },
  { num:'18,400+', label:'تقييم موثّق', labelEn:'Verified Reviews', icon:'⭐' },
  { num:'98%', label:'دقة البيانات', labelEn:'Data Accuracy', icon:'✓' },
  { num:'QID', label:'تحقق بالهوية', labelEn:'ID Verification', icon:'🔐' },
]

const HOW_WORKS = [
  { n:'01', ar:'ابحث عن مدرسة', en:'Search a School', ar2:'ابحث بالاسم أو المنطقة أو المنهج', en2:'Search by name, area, or curriculum' },
  { n:'02', ar:'اقرأ التقييمات', en:'Read Reviews', ar2:'تقييمات موثّقة من أهالي وطلاب حقيقيين', en2:'Verified reviews from real parents & students' },
  { n:'03', ar:'قارن المدارس', en:'Compare Schools', ar2:'قارن الرسوم والأداء والمدرسين', en2:'Compare fees, performance & teachers' },
  { n:'04', ar:'اختر بثقة', en:'Choose Confidently', ar2:'قرار مبني على بيانات حقيقية', en2:'Decision based on real verified data' },
]

const TESTIMONIALS = [
  { name:{ar:'أم عبدالله الهاشمي',en:'Um Abdullah Al-Hashimi'}, role:{ar:'ولي أمر',en:'Parent'}, text:{ar:'ساعدتني المنصة في اختيار أفضل مدرسة لابني بدون ضغط أو تخمين. التقييمات دقيقة جداً.',en:'The platform helped me choose the best school for my son without stress or guesswork. Reviews are very accurate.'}, rating:5, color:'#7A1E3A' },
  { name:{ar:'خالد السيد',en:'Khaled Al-Sayed'}, role:{ar:'طالب',en:'Student'}, text:{ar:'أخيراً منصة تعطي صوتاً حقيقياً للطلاب. تقييماتنا مسموعة وموثّقة.',en:'Finally a platform that gives real voice to students. Our reviews are heard and verified.'}, rating:5, color:'#1A5AA0' },
  { name:{ar:'سارة القحطاني',en:'Sarah Al-Qahtani'}, role:{ar:'ولية أمر',en:'Parent'}, text:{ar:'وفّرت عليّ أشهراً من البحث. كل المعلومات في مكان واحد وموثوقة.',en:'Saved me months of research. All information in one trusted place.'}, rating:5, color:'#1A7A4A' },
]

/* ══ HOOK: Intersection Observer for scroll animations ══ */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVisible(true) }, { threshold: 0.12 })
    if(ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ══ ANIMATED COUNTER ══ */
function Counter({ target, suffix='' }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useReveal()
  useEffect(() => {
    if(!visible) return
    const num = parseInt(target.replace(/[^0-9]/g,''))
    if(isNaN(num)) return
    let start = 0
    const step = Math.ceil(num / 60)
    const timer = setInterval(() => {
      start = Math.min(start + step, num)
      setCount(start)
      if(start >= num) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [visible, target])
  const display = target.includes('+') ? count.toLocaleString()+'+' : target.includes('%') ? count+'%' : target === 'QID' ? 'QID' : count.toLocaleString()
  return <span ref={ref}>{display}</span>
}

/* ══ REVEAL WRAPPER ══ */
function Reveal({ children, delay=0, direction='up', className='' }) {
  const [ref, visible] = useReveal()
  const transforms = { up:'translateY(40px)', down:'translateY(-40px)', left:'translateX(-40px)', right:'translateX(40px)', scale:'scale(0.9)' }
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : transforms[direction],
      transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

/* ══ SCHOOL CARD ══ */
function SchoolCard({ s, lang, delay, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Reveal delay={delay} direction="up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
        style={{
          background: '#fff',
          borderRadius: 20,
          overflow: 'hidden',
          cursor: 'pointer',
          border: `1px solid ${hovered ? s.color+'40' : 'rgba(212,197,169,.5)'}`,
          boxShadow: hovered ? `0 20px 60px ${s.color}20` : '0 4px 20px rgba(36,26,16,.06)',
          transform: hovered ? 'translateY(-6px)' : 'none',
          transition: 'all .35s cubic-bezier(.16,1,.3,1)',
        }}>
        {/* Image */}
        <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
          <img src={s.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transform: hovered?'scale(1.06)':'scale(1)', transition:'transform .6s cubic-bezier(.16,1,.3,1)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(36,26,16,.6) 0%, transparent 60%)' }}/>
          {/* Match badge */}
          <div style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,.92)', backdropFilter:'blur(8px)', borderRadius:20, padding:'4px 10px', fontSize:'.72rem', fontWeight:700, color:s.color }}>
            {s.match}% match
          </div>
          {/* Curriculum */}
          <div style={{ position:'absolute', bottom:12, right:12, background:s.color, borderRadius:8, padding:'3px 9px', fontSize:'.68rem', fontWeight:600, color:'#fff' }}>
            {s.curriculum}
          </div>
        </div>
        {/* Content */}
        <div style={{ padding:'16px 16px 14px' }}>
          <h3 style={{ fontWeight:700, fontSize:'.95rem', marginBottom:3, lineHeight:1.3 }}>{s.name[lang]}</h3>
          <p style={{ fontSize:'.74rem', color:'#8A7B6A', marginBottom:12 }}>📍 {s.area[lang]} · Est. {s.founded} · {s.students.toLocaleString()} طالب</p>
          {/* Stats row */}
          <div style={{ display:'flex', gap:0, borderTop:'1px solid rgba(212,197,169,.3)', paddingTop:10 }}>
            {[
              [s.igcse+'%','IGCSE A', s.color],
              [s.rating+'★','Rating','#C8921A'],
              [s.reviews+'','Reviews','#8A7B6A'],
            ].map(([v,l,c])=>(
              <div key={l} style={{ flex:1, textAlign:'center', borderLeft:'1px solid rgba(212,197,169,.2)' }}>
                <div style={{ fontSize:'.9rem', fontWeight:700, color:c, lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:'.62rem', color:'#A09080', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* ══ MAIN LANDING PAGE ══ */
export default function LandingPage({ lang='ar', setPage, setSchool }) {
  const isRTL = lang === 'ar'
  const [activeTab, setActiveTab] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #FAF8F4; color: #1A1208; font-family: ${isRTL ? "'Noto Sans Arabic'" : "'DM Sans'"}, sans-serif; direction: ${isRTL ? 'rtl' : 'ltr'}; overflow-x: hidden; }
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

    .school-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

    .step-line::after {
      content: '';
      position: absolute;
      top: 32px;
      ${isRTL ? 'left: -50%' : 'right: -50%'};
      width: 100%;
      height: 1px;
      background: linear-gradient(${isRTL ? 'to left' : 'to right'}, rgba(122,30,58,.3), transparent);
    }

    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
    @keyframes pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes fade-in-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

    .float-anim { animation: float 6s ease-in-out infinite; }
    .float-anim-2 { animation: float 8s ease-in-out infinite .5s; }
    .float-anim-3 { animation: float 7s ease-in-out infinite 1s; }

    .hero-text-1 { animation: fade-in-up .8s cubic-bezier(.16,1,.3,1) .1s both; }
    .hero-text-2 { animation: fade-in-up .8s cubic-bezier(.16,1,.3,1) .25s both; }
    .hero-text-3 { animation: fade-in-up .8s cubic-bezier(.16,1,.3,1) .4s both; }
    .hero-btns  { animation: fade-in-up .8s cubic-bezier(.16,1,.3,1) .55s both; }
    .hero-cards { animation: fade-in-up .8s cubic-bezier(.16,1,.3,1) .7s both; }

    .tab-pill {
      padding: 8px 20px; border-radius: 50px; font-size: .82rem; font-weight: 600;
      cursor: pointer; border: 2px solid transparent; font-family: inherit;
      transition: all .25s; white-space: nowrap; color: #8A7B6A; background: transparent;
    }
    .tab-pill.active { background: #7A1E3A; color: #FFF8F0; border-color: #7A1E3A; }
    .tab-pill:not(.active):hover { border-color: rgba(122,30,58,.3); color: #7A1E3A; }

    .stat-card {
      background: #fff; border-radius: 20px;
      border: 1px solid rgba(212,197,169,.5);
      padding: 28px 20px; text-align: center;
      box-shadow: 0 4px 24px rgba(36,26,16,.05);
      transition: all .3s cubic-bezier(.16,1,.3,1);
    }
    .stat-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(36,26,16,.1); }

    .testimonial-card {
      background: #fff; border-radius: 20px;
      border: 1px solid rgba(212,197,169,.5);
      padding: 28px; position: relative; overflow: hidden;
      box-shadow: 0 4px 24px rgba(36,26,16,.05);
      transition: all .3s cubic-bezier(.16,1,.3,1);
    }
    .testimonial-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(36,26,16,.1); }

    .feature-row {
      display: flex; align-items: center; gap: 60px;
      padding: 60px 0;
      border-bottom: 1px solid rgba(212,197,169,.25);
    }
    .feature-row:last-child { border-bottom: none; }

    @media (max-width: 768px) {
      .feature-row { flex-direction: column; gap: 30px; }
      .school-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr 1fr !important; }
      .hero-visual { display: none !important; }
      .hide-mobile { display: none !important; }
    }
  `

  return (
    <div style={{ minHeight:'100vh', background:'#FAF8F4' }}>
      <style>{css}</style>

      {/* ══ STICKY NAV ══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 40 ? 'rgba(250,248,244,.96)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(212,197,169,.4)' : 'none',
        transition: 'all .4s ease',
        height: 68, display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Logo size={40} showText lang={lang}/>
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <button className="hide-mobile" style={{ background:'none', border:'none', color:'#5A4A38', fontSize:'.85rem', fontWeight:500, cursor:'pointer', padding:'6px 12px', borderRadius:8, fontFamily:'inherit' }} onClick={()=>setPage('home')}>
              {isRTL ? 'المدارس' : 'Schools'}
            </button>
            <button className="hide-mobile" style={{ background:'none', border:'none', color:'#5A4A38', fontSize:'.85rem', fontWeight:500, cursor:'pointer', padding:'6px 12px', borderRadius:8, fontFamily:'inherit' }} onClick={()=>setPage('trust')}>
              {isRTL ? 'التحقق' : 'Trust'}
            </button>
            <button className="lp-btn-primary" style={{ padding:'9px 20px', fontSize:'.82rem', borderRadius:50 }} onClick={()=>setPage('auth')}>
              {isRTL ? 'دخول ←' : 'Login →'}
            </button>
          </div>
        </div>
      </nav>

      {/* ══ HERO SECTION ══ */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', paddingTop:68 }}>

        {/* Background decorations */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
          {/* Large gradient orb top right */}
          <div style={{ position:'absolute', top:-100, right:-100, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(122,30,58,.08) 0%, transparent 70%)', animation:'float 10s ease-in-out infinite' }}/>
          {/* Gold orb bottom left */}
          <div style={{ position:'absolute', bottom:-50, left:-50, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(200,146,26,.07) 0%, transparent 70%)', animation:'float 12s ease-in-out infinite .5s' }}/>
          {/* Subtle grid pattern */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(122,30,58,.06) 1px, transparent 1px)', backgroundSize:'40px 40px', opacity:.5 }}/>
          {/* Diagonal accent line */}
          <div style={{ position:'absolute', top:0, right:'30%', width:1, height:'100%', background:'linear-gradient(to bottom, transparent, rgba(122,30,58,.1), transparent)', transform:'rotate(15deg)', transformOrigin:'top' }}/>
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 24px', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>

          {/* Left: Text */}
          <div>
            {/* Eyebrow */}
            <div className="hero-text-1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(122,30,58,.07)', border:'1px solid rgba(122,30,58,.15)', borderRadius:50, padding:'6px 16px', marginBottom:24 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#7A1E3A', animation:'pulse-ring 1.5s ease-out infinite' }}/>
              <span style={{ fontSize:'.78rem', fontWeight:600, color:'#7A1E3A', letterSpacing:.5 }}>
                {isRTL ? '🇶🇦 منصة قطر التعليمية الأولى' : '🇶🇦 Qatar\'s #1 Education Platform'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-text-2" style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 20,
              letterSpacing: isRTL ? '-.5px' : '-1.5px',
            }}>
              {isRTL ? (
                <>اختر مدرسة<br/><span style={{ color:'#7A1E3A', position:'relative' }}>
                  ابنك
                  <svg style={{ position:'absolute', bottom:-6, right:0, left:0, width:'100%' }} height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M4 6 Q100 1 196 6" stroke="#C8921A" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  </svg>
                </span><br/>بثقة تامة</>
              ) : (
                <>Find the<br/><span style={{ color:'#7A1E3A', position:'relative' }}>
                  Right School
                  <svg style={{ position:'absolute', bottom:-6, right:0, left:0, width:'100%' }} height="8" viewBox="0 0 300 8" fill="none">
                    <path d="M4 6 Q150 1 296 6" stroke="#C8921A" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  </svg>
                </span><br/>with Confidence</>
              )}
            </h1>

            {/* Sub */}
            <p className="hero-text-3" style={{ fontSize:'1.05rem', color:'#5A4A38', lineHeight:1.8, marginBottom:36, maxWidth:460 }}>
              {isRTL
                ? 'تقييمات موثّقة عبر الهوية القطرية · بروفايلات تفصيلية لكل مدرس · رسوم الوزارة الرسمية · مقارنة ذكية بين المدارس'
                : 'QID-verified reviews · Detailed teacher profiles · Official Ministry fees · Smart school comparison'}
            </p>

            {/* Buttons */}
            <div className="hero-btns" style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:48 }}>
              <button className="lp-btn-primary" style={{ fontSize:'1rem', padding:'15px 32px' }} onClick={()=>setPage('home')}>
                {isRTL ? '🏫 استعرض المدارس' : '🏫 Browse Schools'}
              </button>
              <button className="lp-btn-outline" style={{ fontSize:'1rem', padding:'14px 32px' }} onClick={()=>setPage('auth')}>
                {isRTL ? 'سجّل مجاناً' : 'Register Free'}
              </button>
            </div>

            {/* Social proof */}
            <div className="hero-cards" style={{ display:'flex', gap:20, alignItems:'center' }}>
              <div style={{ display:'flex', gap:-8 }}>
                {['#7A1E3A','#1A5AA0','#1A7A4A','#A07010','#9B2548'].map((c,i)=>(
                  <div key={i} style={{ width:34, height:34, borderRadius:'50%', background:c, border:'2.5px solid #FAF8F4', marginLeft: i>0 ? -10 : 0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', fontWeight:700, color:'#fff' }}>
                    {['أم','KH','SR','FA','MN'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:'flex', gap:2, marginBottom:2 }}>
                  {[1,2,3,4,5].map(n=><span key={n} style={{ color:'#C8921A', fontSize:13 }}>★</span>)}
                </div>
                <div style={{ fontSize:'.75rem', color:'#8A7B6A', fontWeight:500 }}>
                  {isRTL ? '+18,000 ولي أمر يثقون بنا' : '+18,000 parents trust us'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual infographic */}
          <div className="hero-visual" style={{ position:'relative', height:520, display:'flex', alignItems:'center', justifyContent:'center' }}>

            {/* Center main card */}
            <div className="float-anim" style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%, -50%)',
              width:200, background:'#fff', borderRadius:24,
              padding:20, boxShadow:'0 20px 60px rgba(122,30,58,.15)',
              border:'1px solid rgba(212,197,169,.6)', zIndex:3,
            }}>
              <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#6B1830,#9B2548)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, fontSize:22 }}>📚</div>
              <div style={{ fontWeight:700, fontSize:'.88rem', marginBottom:4 }}>{isRTL ? 'مدرسة الدوحة' : 'Doha School'}</div>
              <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:8 }}>
                {[1,2,3,4,5].map(n=><span key={n} style={{ color:'#C8921A', fontSize:11 }}>★</span>)}
                <span style={{ fontSize:'.72rem', color:'#8A7B6A' }}>4.8</span>
              </div>
              <div style={{ background:'linear-gradient(135deg,rgba(122,30,58,.08),rgba(122,30,58,.04))', borderRadius:10, padding:'8px 10px' }}>
                <div style={{ fontSize:'.65rem', color:'#8A7B6A', marginBottom:2 }}>IGCSE A%</div>
                <div style={{ fontSize:'1.4rem', fontWeight:800, color:'#7A1E3A', lineHeight:1 }}>81%</div>
              </div>
            </div>

            {/* Orbiting cards */}
            {[
              { top:'5%', left:'5%', icon:'🔐', label:isRTL?'تحقق QID':'QID Verified', color:'#1A7A4A', delay:0 },
              { top:'5%', right:'5%', icon:'📊', label:isRTL?'بيانات رسمية':'Official Data', color:'#1A5AA0', delay:.5 },
              { bottom:'5%', left:'5%', icon:'⭐', label:isRTL?'تقييم موثّق':'Verified Review', color:'#C8921A', delay:1 },
              { bottom:'5%', right:'5%', icon:'🏆', label:isRTL?'أفضل اختيار':'Best Match', color:'#7A1E3A', delay:1.5 },
            ].map((c,i)=>(
              <div key={i} className={`float-anim-${i%2===0?'2':'3'}`} style={{
                position:'absolute', ...c,
                background:'#fff', borderRadius:16, padding:'12px 14px',
                boxShadow:'0 8px 30px rgba(36,26,16,.1)',
                border:`1px solid ${c.color}30`,
                display:'flex', alignItems:'center', gap:8, zIndex:2,
                animationDelay: `${c.delay}s`,
              }}>
                <span style={{ fontSize:18 }}>{c.icon}</span>
                <span style={{ fontSize:'.72rem', fontWeight:600, color:c.color, whiteSpace:'nowrap' }}>{c.label}</span>
              </div>
            ))}

            {/* Background ring */}
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:360, height:360, borderRadius:'50%', border:'1px dashed rgba(122,30,58,.12)', animation:'spin-slow 30s linear infinite' }}/>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:280, height:280, borderRadius:'50%', border:'1px dashed rgba(200,146,26,.1)', animation:'spin-slow 20s linear infinite reverse' }}/>

            {/* Match ring visual */}
            <svg style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:420, height:420 }} viewBox="0 0 420 420">
              <circle cx="210" cy="210" r="180" fill="none" stroke="rgba(122,30,58,.05)" strokeWidth="2"/>
              <circle cx="210" cy="210" r="180" fill="none" stroke="rgba(122,30,58,.12)" strokeWidth="2"
                strokeDasharray={`${0.91 * 2 * Math.PI * 180} ${2 * Math.PI * 180}`}
                strokeLinecap="round" transform="rotate(-90 210 210)"/>
            </svg>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:.5 }}>
          <span style={{ fontSize:'.7rem', color:'#8A7B6A', letterSpacing:1.5 }}>{isRTL ? 'اسحب للأسفل' : 'SCROLL'}</span>
          <div style={{ width:1, height:40, background:'linear-gradient(to bottom, #7A1E3A, transparent)', animation:'float 1.5s ease-in-out infinite' }}/>
        </div>
      </section>

      {/* ══ STATS SECTION ══ */}
      <section style={{ padding:'80px 24px', background:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(to right, transparent, rgba(122,30,58,.15), rgba(200,146,26,.15), transparent)' }}/>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,146,26,.08)', border:'1px solid rgba(200,146,26,.2)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#A07010' }}>{isRTL ? 'بالأرقام' : 'By the Numbers'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:800, letterSpacing:'-1px' }}>
                {isRTL ? 'منصة موثوقة بأرقام حقيقية' : 'Trusted Platform, Real Numbers'}
              </h2>
            </div>
          </Reveal>
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {STATS.map((s,i)=>(
              <Reveal key={i} delay={i*0.12}>
                <div className="stat-card">
                  <div style={{ fontSize:32, marginBottom:12 }}>{s.icon}</div>
                  <div style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:900, color:'#7A1E3A', lineHeight:1, marginBottom:8, fontFamily:"'DM Sans',sans-serif" }}>
                    <Counter target={s.num}/>
                  </div>
                  <div style={{ fontSize:'.85rem', color:'#5A4A38', fontWeight:500 }}>{isRTL ? s.label : s.labelEn}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SCHOOLS SHOWCASE ══ */}
      <section style={{ padding:'100px 24px', background:'#FAF8F4', position:'relative' }}>
        {/* Section bg decoration */}
        <div style={{ position:'absolute', top:0, right:0, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(122,30,58,.04) 0%, transparent 70%)', pointerEvents:'none' }}/>

        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:20 }}>
            <Reveal>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(122,30,58,.07)', border:'1px solid rgba(122,30,58,.15)', borderRadius:50, padding:'5px 16px', marginBottom:14 }}>
                  <span style={{ fontSize:'.75rem', fontWeight:600, color:'#7A1E3A' }}>{isRTL ? 'المدارس المسجّلة' : 'Registered Schools'}</span>
                </div>
                <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:800, letterSpacing:'-1px', marginBottom:8 }}>
                  {isRTL ? 'استعرض أفضل مدارس قطر' : 'Explore Qatar\'s Top Schools'}
                </h2>
                <p style={{ fontSize:'1rem', color:'#8A7B6A' }}>
                  {isRTL ? 'مقارنة شاملة للمدارس مع تقييمات موثّقة' : 'Comprehensive school comparison with verified reviews'}
                </p>
              </div>
            </Reveal>
            {/* Filter tabs */}
            <Reveal delay={0.2}>
              <div style={{ display:'flex', gap:6, background:'rgba(212,197,169,.2)', padding:4, borderRadius:50, flexWrap:'wrap' }}>
                {(isRTL ? ['الكل','بريطاني','أمريكي','دولي'] : ['All','British','American','IB']).map((tab,i)=>(
                  <button key={i} className={`tab-pill ${activeTab===i?'active':''}`} onClick={()=>setActiveTab(i)}>{tab}</button>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="school-grid">
            {SCHOOLS_DATA.filter(s => activeTab === 0 || (activeTab===1&&s.curriculum.includes('British')) || (activeTab===2&&s.curriculum.includes('American')) || (activeTab===3&&(s.curriculum.includes('IB')||s.curriculum.includes('French')))).map((s,i)=>(
              <SchoolCard key={s.id} s={s} lang={lang} delay={i*0.08} onClick={()=>{ setSchool && setSchool(s); setPage && setPage('school') }}/>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div style={{ textAlign:'center', marginTop:48 }}>
              <button className="lp-btn-outline" style={{ fontSize:'.95rem' }} onClick={()=>setPage('home')}>
                {isRTL ? 'عرض كل المدارس ←' : 'View All Schools →'}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section style={{ padding:'100px 24px', background:'#fff' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:72 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(26,122,74,.07)', border:'1px solid rgba(26,122,74,.18)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#1A7A4A' }}>{isRTL ? 'كيف تعمل المنصة' : 'How It Works'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:800, letterSpacing:'-1px' }}>
                {isRTL ? '٤ خطوات للقرار الصحيح' : '4 Steps to the Right Decision'}
              </h2>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
            {HOW_WORKS.map((step,i)=>(
              <Reveal key={i} delay={i*0.12} direction="up">
                <div style={{ textAlign:'center', position:'relative' }}>
                  {/* Step number */}
                  <div style={{ position:'relative', display:'inline-block', marginBottom:20 }}>
                    <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,rgba(122,30,58,.1),rgba(122,30,58,.05))', border:'2px solid rgba(122,30,58,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
                      <span style={{ fontSize:'1.2rem', fontWeight:900, color:'#7A1E3A', fontFamily:"'DM Sans',sans-serif" }}>{step.n}</span>
                    </div>
                    {/* Connector line */}
                    {i < 3 && (
                      <div style={{ position:'absolute', top:'50%', [isRTL?'left':'right']:'-100%', width:'100%', height:1, background:`linear-gradient(${isRTL?'to left':'to right'},rgba(122,30,58,.25),transparent)`, transform:'translateY(-50%)' }}/>
                    )}
                  </div>
                  <h3 style={{ fontWeight:700, fontSize:'.95rem', marginBottom:8 }}>{isRTL ? step.ar : step.en}</h3>
                  <p style={{ fontSize:'.8rem', color:'#8A7B6A', lineHeight:1.7 }}>{isRTL ? step.ar2 : step.en2}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TRUST FEATURES — alternating layout ══ */}
      <section style={{ padding:'100px 24px', background:'#FAF8F4' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:80 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(26,90,160,.07)', border:'1px solid rgba(26,90,160,.18)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#1A5AA0' }}>{isRTL ? 'لماذا EduQatar' : 'Why EduQatar'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:800, letterSpacing:'-1px' }}>
                {isRTL ? 'منصة لا يمكن التلاعب بها' : 'A Platform That Can\'t Be Manipulated'}
              </h2>
            </div>
          </Reveal>

          {[
            {
              icon:'🪪', color:'#7A1E3A', bg:'rgba(122,30,58,.06)',
              ar:{ title:'ربط حقيقي بالهوية القطرية', body:'كل حساب مربوط ببطاقة هوية قطرية حقيقية. شخص واحد = تقييم واحد فقط طوال الحياة. مستحيل التلاعب.', tag:'QID Binding' },
              en:{ title:'Real QID Binding', body:'Every account linked to a real Qatari ID. One person = one review for life. Manipulation is impossible.', tag:'QID Binding' }
            },
            {
              icon:'📋', color:'#1A5AA0', bg:'rgba(26,90,160,.06)',
              ar:{ title:'تحقق من التسجيل الفعلي', body:'لا يمكن لأي شخص كتابة تقييم إلا إذا كان طفله مسجّلاً فعلاً في المدرسة. نتحقق من قواعد بيانات وزارة التعليم.', tag:'Enrollment Check' },
              en:{ title:'Actual Enrollment Verification', body:'No one can review unless their child is actually enrolled. We verify against Ministry of Education databases.', tag:'Enrollment Check' }
            },
            {
              icon:'🤖', color:'#1A7A4A', bg:'rgba(26,122,74,.06)',
              ar:{ title:'ذكاء اصطناعي يكشف التزوير', body:'نظام AI يرصد التقييمات المنسّقة من نفس الشبكة أو النمط المتشابه ويحذفها تلقائياً قبل النشر.', tag:'AI Detection' },
              en:{ title:'AI Fraud Detection', body:'AI system detects coordinated reviews from the same network or similar patterns and removes them before publishing.', tag:'AI Detection' }
            },
            {
              icon:'📊', color:'#A07010', bg:'rgba(160,112,16,.06)',
              ar:{ title:'بيانات مباشرة من الوزارة', body:'الرسوم الدراسية والأداء الأكاديمي مستخرجة مباشرة من قرارات وزارة التعليم والتعليم العالي. لا تخمين.', tag:'Ministry Data' },
              en:{ title:'Direct Ministry Data', body:'School fees and academic performance extracted directly from Ministry of Education decrees. No guesswork.', tag:'Ministry Data' }
            },
          ].map((f,i)=>(
            <Reveal key={i} delay={0.1} direction={i%2===0?'left':'right'}>
              <div className="feature-row" style={{ flexDirection: i%2===0 ? (isRTL?'row':'row') : (isRTL?'row-reverse':'row-reverse') }}>
                {/* Visual side */}
                <div style={{ flex:'0 0 300px', display:'flex', justifyContent:'center' }}>
                  <div style={{ width:220, height:220, borderRadius:32, background:f.bg, border:`2px solid ${f.color}20`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, boxShadow:`0 20px 60px ${f.color}12` }}>
                    <span style={{ fontSize:64 }}>{f.icon}</span>
                    <div style={{ background:f.color, borderRadius:20, padding:'4px 12px', fontSize:'.72rem', fontWeight:700, color:'#fff' }}>{f.ar.tag}</div>
                  </div>
                </div>
                {/* Text side */}
                <div style={{ flex:1 }}>
                  <h3 style={{ fontSize:'clamp(1.3rem,3vw,1.7rem)', fontWeight:800, marginBottom:16, letterSpacing:'-.5px' }}>
                    {isRTL ? f.ar.title : f.en.title}
                  </h3>
                  <p style={{ fontSize:'1rem', color:'#5A4A38', lineHeight:1.9, maxWidth:480 }}>
                    {isRTL ? f.ar.body : f.en.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding:'100px 24px', background:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, backgroundImage:'radial-gradient(rgba(122,30,58,.04) 1px, transparent 1px)', backgroundSize:'30px 30px', pointerEvents:'none' }}/>
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,146,26,.08)', border:'1px solid rgba(200,146,26,.2)', borderRadius:50, padding:'5px 16px', marginBottom:16 }}>
                <span style={{ fontSize:'.75rem', fontWeight:600, color:'#A07010' }}>{isRTL ? 'ماذا يقولون عنا' : 'What They Say'}</span>
              </div>
              <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:800, letterSpacing:'-1px' }}>
                {isRTL ? 'آراء أهالي وطلاب حقيقيين' : 'Real Parents & Students\' Opinions'}
              </h2>
            </div>
          </Reveal>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
            {TESTIMONIALS.map((t,i)=>(
              <Reveal key={i} delay={i*0.12}>
                <div className="testimonial-card">
                  {/* Quote decoration */}
                  <div style={{ position:'absolute', top:20, [isRTL?'left':'right']:20, fontSize:80, color:t.color, opacity:.06, fontFamily:'serif', lineHeight:1 }}>"</div>
                  {/* Stars */}
                  <div style={{ display:'flex', gap:2, marginBottom:16 }}>
                    {[1,2,3,4,5].map(n=><span key={n} style={{ color:'#C8921A', fontSize:14 }}>★</span>)}
                  </div>
                  <p style={{ fontSize:'.9rem', color:'#4A3A28', lineHeight:1.85, marginBottom:20, position:'relative' }}>
                    {isRTL ? t.text.ar : t.text.en}
                  </p>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:`${t.color}20`, border:`2px solid ${t.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'.8rem', color:t.color, flexShrink:0 }}>
                      {(isRTL ? t.name.ar : t.name.en).slice(0,2)}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'.85rem' }}>{isRTL ? t.name.ar : t.name.en}</div>
                      <div style={{ fontSize:'.72rem', color:t.color, fontWeight:600 }}>{isRTL ? t.role.ar : t.role.en}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section style={{ padding:'100px 24px', background:'linear-gradient(135deg, #1A0810 0%, #4A0D1E 40%, #6B1830 100%)', position:'relative', overflow:'hidden' }}>
        {/* Background decorations */}
        <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,.04)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-60, width:300, height:300, borderRadius:'50%', background:'rgba(200,146,26,.08)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize:'40px 40px' }}/>

        <div style={{ maxWidth:800, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <Reveal>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(200,146,26,.15)', border:'1px solid rgba(200,146,26,.3)', borderRadius:50, padding:'6px 18px', marginBottom:24 }}>
              <span style={{ fontSize:'.78rem', fontWeight:600, color:'#C8921A' }}>🚀 {isRTL ? 'ابدأ مجاناً اليوم' : 'Start Free Today'}</span>
            </div>
            <h2 style={{ fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:900, color:'#FAF7F2', lineHeight:1.1, marginBottom:20, letterSpacing:'-1px' }}>
              {isRTL ? 'مستعد تختار المدرسة\nالمناسبة لأبنائك؟' : 'Ready to Find the\nRight School?'}
            </h2>
            <p style={{ fontSize:'1.05rem', color:'rgba(248,244,238,.7)', lineHeight:1.8, marginBottom:40, maxWidth:500, margin:'0 auto 40px' }}>
              {isRTL
                ? 'انضم لأكثر من 18,000 ولي أمر يستخدمون EduQatar لاتخاذ قرارات تعليمية مبنية على البيانات.'
                : 'Join 18,000+ parents using EduQatar to make data-driven educational decisions.'}
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <button style={{ background:'linear-gradient(135deg,#C8921A,#A07010)', color:'#1A0810', border:'none', borderRadius:50, padding:'15px 36px', fontSize:'1rem', fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 20px rgba(200,146,26,.4)', transition:'all .3s' }}
                onMouseEnter={e=>e.target.style.transform='translateY(-3px)'}
                onMouseLeave={e=>e.target.style.transform='none'}
                onClick={()=>setPage('auth')}>
                {isRTL ? '🏫 سجّل مجاناً الآن' : '🏫 Register Free Now'}
              </button>
              <button style={{ background:'transparent', color:'rgba(248,244,238,.85)', border:'2px solid rgba(248,244,238,.25)', borderRadius:50, padding:'14px 32px', fontSize:'1rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .3s' }}
                onMouseEnter={e=>{ e.target.style.borderColor='rgba(248,244,238,.6)'; e.target.style.color='#FAF7F2' }}
                onMouseLeave={e=>{ e.target.style.borderColor='rgba(248,244,238,.25)'; e.target.style.color='rgba(248,244,238,.85)' }}
                onClick={()=>setPage('home')}>
                {isRTL ? 'استعرض المدارس' : 'Browse Schools'}
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
                {isRTL ? 'منصة قطر التعليمية الأولى للتقييمات الموثّقة ومقارنة المدارس.' : "Qatar's #1 education platform for verified reviews and school comparison."}
              </p>
            </div>
            <div style={{ display:'flex', gap:48, flexWrap:'wrap' }}>
              {(isRTL ? [
                { title:'المنصة', links:['المدارس','المدرسون','التقييمات','AI Insight'] },
                { title:'الشركة', links:['من نحن','سياسة الخصوصية','الشروط والأحكام','تواصل معنا'] },
              ] : [
                { title:'Platform', links:['Schools','Teachers','Reviews','AI Insight'] },
                { title:'Company', links:['About','Privacy Policy','Terms','Contact'] },
              ]).map((col,i)=>(
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
            <span style={{ fontSize:'.75rem', color:'rgba(248,244,238,.3)' }}>© 2025 EduQatar. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
            <div style={{ display:'flex', gap:6 }}>
              {['🇶🇦', isRTL?'عربي':'AR', isRTL?'EN':'إنجليزي'].map((l,i)=>(
                <span key={i} style={{ fontSize:'.75rem', color:'rgba(248,244,238,.35)', padding:'3px 8px', border:'1px solid rgba(248,244,238,.1)', borderRadius:6 }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

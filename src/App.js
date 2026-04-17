import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AuthPage from './components/AuthPage'
import SchoolDashboard from './components/SchoolDashboard'
import QIDModal from './components/QIDModal'
import ProModal from './components/ProModal'
import Logo from './components/Logo'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import LandingPage from './LandingPage'

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{font-size:14px;background:#F8F4EE;scroll-behavior:smooth;}
body{background:#F8F4EE!important;color:#241A10;min-height:100vh;}
body.rtl{font-family:'Noto Sans Arabic',sans-serif;direction:rtl;}
body.ltr{font-family:'DM Sans',sans-serif;direction:ltr;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:#D4C5A9;border-radius:2px;}
.app{background:#F8F4EE;min-height:100vh;}
.container{max-width:1100px;margin:0 auto;padding:0 18px;}
.nav{position:sticky;top:0;z-index:200;background:rgba(248,244,238,0.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(212,197,169,.5);height:60px;display:flex;align-items:center;}
.nav-link{font-size:.82rem;font-weight:500;color:#8A7B6A;cursor:pointer;padding:6px 12px;border-radius:8px;border:none;background:none;font-family:inherit;transition:all .15s;}
.nav-link:hover{color:#241A10;background:rgba(212,197,169,.3);}
.nav-link.active{color:#7A1E3A;font-weight:700;background:rgba(122,30,58,.07);}
.lang-toggle{display:flex;background:rgba(212,197,169,.25);border-radius:9px;padding:2px;border:1px solid rgba(212,197,169,.5);}
.lang-opt{padding:4px 10px;border-radius:7px;font-size:.76rem;font-weight:600;cursor:pointer;border:none;font-family:inherit;transition:all .15s;background:transparent;color:#8A7B6A;}
.lang-opt.active{background:#fff;color:#7A1E3A;box-shadow:0 1px 6px rgba(36,26,16,.1);}
.card{background:#fff;border-radius:16px;border:1px solid rgba(212,197,169,.6);box-shadow:0 2px 10px rgba(36,26,16,.05);overflow:hidden;transition:all .25s ease;}
.card:hover{box-shadow:0 8px 28px rgba(36,26,16,.1);transform:translateY(-2px);border-color:rgba(180,155,110,.5);}
.btn{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:9px;font-family:inherit;font-size:.82rem;font-weight:600;cursor:pointer;border:none;transition:all .18s;white-space:nowrap;}
.btn-primary{background:linear-gradient(135deg,#6B1830,#9B2548);color:#FFF8F0;box-shadow:0 2px 12px rgba(107,24,48,.28);}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(107,24,48,.38);}
.btn-outline{background:transparent;color:#7A1E3A;border:1.5px solid rgba(122,30,58,.4);}
.btn-outline:hover{background:rgba(122,30,58,.05);}
.btn-ghost{background:rgba(212,197,169,.2);color:#5A4A38;border:1px solid rgba(212,197,169,.6);}
.btn-ghost:hover{background:rgba(212,197,169,.4);}
.btn-sm{padding:5px 12px;font-size:.78rem;border-radius:8px;}
.btn-gold{background:linear-gradient(135deg,#A07010,#C8921A);color:#FFF8EE;}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:.7rem;font-weight:600;white-space:nowrap;}
.badge-maroon{background:rgba(107,24,48,.06);color:#7A1E3A;border:1px solid rgba(122,30,58,.2);}
.badge-green{background:rgba(30,90,55,.06);color:#1A5A35;border:1px solid rgba(30,90,55,.2);}
.badge-blue{background:rgba(26,90,160,.06);color:#1A5AA0;border:1px solid rgba(26,90,160,.2);}
.badge-gold{background:rgba(160,112,16,.06);color:#7A5800;border:1px solid rgba(160,112,16,.22);}
.badge-sand{background:rgba(212,197,169,.2);color:#5A4A38;border:1px solid rgba(180,155,110,.3);}
.badge-white{background:rgba(255,255,255,0.18);color:#FAF7F2;border:1px solid rgba(255,255,255,0.35);backdrop-filter:blur(4px);}
.tab-row{display:flex;border-bottom:1.5px solid rgba(212,197,169,.5);overflow-x:auto;scrollbar-width:none;}
.tab-row::-webkit-scrollbar{display:none;}
.tab-btn{padding:10px 14px;font-size:.82rem;font-weight:500;color:#8A7B6A;cursor:pointer;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1.5px;font-family:inherit;transition:all .15s;white-space:nowrap;}
.tab-btn:hover{color:#241A10;}
.tab-btn.active{color:#7A1E3A;font-weight:700;border-bottom-color:#7A1E3A;}
.input{width:100%;padding:9px 13px;background:rgba(248,244,238,.8);border:1.5px solid rgba(212,197,169,.6);border-radius:9px;color:#241A10;font-family:inherit;font-size:.88rem;outline:none;transition:all .15s;}
.input:focus{border-color:#7A1E3A;background:#fff;box-shadow:0 0 0 3px rgba(122,30,58,.07);}
.bar-track{height:6px;background:rgba(212,197,169,.35);border-radius:3px;overflow:hidden;}
.bar-fill{height:100%;border-radius:3px;transition:width 1.2s cubic-bezier(.16,1,.3,1);}
.school-hero{height:280px;position:relative;overflow:hidden;border-radius:0 0 24px 24px;}
.school-hero img{width:100%;height:100%;object-fit:cover;}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(36,26,16,.88) 0%,rgba(36,26,16,.3) 50%,rgba(36,26,16,.05) 100%);}
.eyebrow{font-size:.68rem;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#7A1E3A;display:flex;align-items:center;gap:6px;margin-bottom:5px;}
.eyebrow::before{content:'';display:block;width:12px;height:2px;background:#7A1E3A;border-radius:1px;}
.review-card{background:#fff;border:1px solid rgba(212,197,169,.6);border-radius:14px;padding:18px;transition:all .2s;}
.review-card:hover{box-shadow:0 4px 16px rgba(36,26,16,.07);}
.divider{height:1px;background:rgba(212,197,169,.4);margin:13px 0;}
.stat-chip{padding:12px 8px;text-align:center;border-left:1px solid rgba(212,197,169,.45);}
.stat-chip:first-child{border-left:none;}
.search-wrap{position:relative;}
.search-icon{position:absolute;top:50%;transform:translateY(-50%);color:#A09080;font-size:15px;pointer-events:none;}
body.rtl .search-icon{right:14px;}
body.ltr .search-icon{left:14px;}
body.rtl .search-input{padding:11px 42px 11px 16px;}
body.ltr .search-input{padding:11px 16px 11px 42px;}
.search-input{width:100%;background:#fff;border:1.5px solid rgba(212,197,169,.7);border-radius:12px;color:#241A10;font-family:inherit;font-size:.88rem;outline:none;transition:all .2s;box-shadow:0 2px 8px rgba(36,26,16,.05);}
.search-input:focus{border-color:#7A1E3A;box-shadow:0 0 0 3px rgba(122,30,58,.08);}
.t-card{background:#fff;border:1px solid rgba(212,197,169,.6);border-radius:14px;padding:15px;transition:all .22s;cursor:pointer;}
.t-card:hover{border-color:rgba(160,120,60,.5);box-shadow:0 4px 16px rgba(36,26,16,.08);transform:translateY(-2px);}
.t-card.selected{border-color:#7A1E3A;box-shadow:0 0 0 3px rgba(122,30,58,.1);}
.avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;border:1.5px solid rgba(212,197,169,.5);}
.vote-btn{display:inline-flex;align-items:center;gap:4px;padding:4px 11px;border-radius:20px;font-size:.75rem;font-weight:700;cursor:pointer;border:1.5px solid rgba(212,197,169,.5);background:rgba(248,244,238,.7);font-family:inherit;transition:all .15s;color:#5A4A38;}
.vote-btn.up.voted{background:rgba(26,122,74,.08);border-color:rgba(26,122,74,.3);color:#1A7A4A;}
.vote-btn.down.voted{background:rgba(180,48,48,.08);border-color:rgba(180,48,48,.3);color:#A03030;}
.pg{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:150px 150px;gap:6px;border-radius:12px;overflow:hidden;}
.pg img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s;}
.pg img:hover{transform:scale(1.05);}
.pg .main{grid-row:span 2;}
.pdf-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 15px;background:#fff;border:1px solid rgba(212,197,169,.6);border-radius:11px;cursor:pointer;transition:all .18s;}
.pdf-row:hover{border-color:#1A7A4A;background:rgba(26,122,74,.02);}
.modal-bg{position:fixed;inset:0;background:rgba(36,26,16,.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px);}
.modal{background:#fff;border-radius:18px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(36,26,16,.2);animation:modalIn .3s cubic-bezier(.16,1,.3,1);}
@keyframes modalIn{from{opacity:0;transform:scale(.93) translateY(14px);}to{opacity:1;transform:scale(1) translateY(0);}}
.qid-box{background:rgba(26,122,74,.05);border:1.5px solid rgba(26,122,74,.18);border-radius:10px;padding:14px;}
.grade-pill{padding:6px 13px;border-radius:9px;font-size:.78rem;font-weight:600;cursor:pointer;border:1.5px solid rgba(212,197,169,.6);background:#fff;transition:all .15s;color:#5A4A38;font-family:inherit;}
.grade-pill.active{border-color:#7A1E3A;color:#7A1E3A;background:rgba(122,30,58,.06);}
.insight-card{background:linear-gradient(135deg,rgba(122,30,58,.05),rgba(160,112,16,.05));border:1px solid rgba(122,30,58,.15);border-radius:14px;padding:16px;}
.rating-cat{background:rgba(248,244,238,.8);border-radius:10px;padding:11px 14px;margin-bottom:7px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.fade-up{animation:fadeUp .6s cubic-bezier(.16,1,.3,1) both;}
@media(max-width:700px){.hide-sm{display:none!important;}.pg{grid-template-columns:1fr 1fr;grid-template-rows:110px 110px;}.pg .main{grid-row:span 1;}}
`

/* ══ VERIFIED BADGE ══ */
const VerifiedBadge = ({ role, size = 16 }) => {
  const color = role==='parent' ? '#1A7A4A' : role==='student' ? '#1A5AA0' : '#C8921A'
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{flexShrink:0,display:'inline-block',verticalAlign:'middle'}}>
      <path d="M8 1.2L9.4 0.6L10.5 1.7L12 1.5L12.7 2.8L14 3.2L14.1 4.6L15.2 5.5L14.9 6.9L15.6 8L14.9 9.1L15.2 10.5L14.1 11.4L14 12.8L12.7 13.2L12 14.5L10.5 14.3L9.4 15.4L8 14.8L6.6 15.4L5.5 14.3L4 14.5L3.3 13.2L2 12.8L1.9 11.4L0.8 10.5L1.1 9.1L0.4 8L1.1 6.9L0.8 5.5L1.9 4.6L2 3.2L3.3 2.8L4 1.5L5.5 1.7L6.6 0.6Z" fill={color}/>
      <path d="M4.5 8.5L6.8 10.8L11.5 5.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

/* ══ PRO BADGE — white 3D plus, sized to match VerifiedBadge ══ */
const ProBadge = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{flexShrink:0,display:'inline-block',verticalAlign:'middle'}}>
    <defs>
      <linearGradient id="pbgNew" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9B2548"/>
        <stop offset="100%" stopColor="#5C1529"/>
      </linearGradient>
      <linearGradient id="plusShine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF"/>
        <stop offset="40%" stopColor="#F0F0F0"/>
        <stop offset="100%" stopColor="#CCCCCC"/>
      </linearGradient>
      <filter id="plusShadow">
        <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="rgba(0,0,0,0.45)"/>
      </filter>
    </defs>
    {/* Same sunburst shape as VerifiedBadge */}
    <path d="M8 1.2L9.4 0.6L10.5 1.7L12 1.5L12.7 2.8L14 3.2L14.1 4.6L15.2 5.5L14.9 6.9L15.6 8L14.9 9.1L15.2 10.5L14.1 11.4L14 12.8L12.7 13.2L12 14.5L10.5 14.3L9.4 15.4L8 14.8L6.6 15.4L5.5 14.3L4 14.5L3.3 13.2L2 12.8L1.9 11.4L0.8 10.5L1.1 9.1L0.4 8L1.1 6.9L0.8 5.5L1.9 4.6L2 3.2L3.3 2.8L4 1.5L5.5 1.7L6.6 0.6Z" fill="url(#pbgNew)"/>
    {/* 3D white plus */}
    <rect x="7.1" y="3.8" width="1.8" height="8.4" rx="0.9" fill="url(#plusShine)" filter="url(#plusShadow)"/>
    <rect x="3.8" y="7.1" width="8.4" height="1.8" rx="0.9" fill="url(#plusShine)" filter="url(#plusShadow)"/>
  </svg>
)

const Stars = ({ r, size=12 }) => (
  <span style={{color:'#C8921A',fontSize:size,letterSpacing:.5,fontFamily:'DM Sans,sans-serif'}}>
    {[1,2,3,4,5].map(i=>i<=Math.floor(r)?'★':'☆').join('')}
  </span>
)

const VoteButtons = ({ up, down }) => {
  const [v,setV] = useState({up,down,voted:null})
  const vote = dir => setV(p=>p.voted===dir?{up,down,voted:null}:{up:dir==='up'?up+1:up,down:dir==='down'?down+1:down,voted:dir})
  return (
    <div style={{display:'flex',gap:5}}>
      <button className={`vote-btn up ${v.voted==='up'?'voted':''}`} onClick={()=>vote('up')}>▲ {v.up}</button>
      <button className={`vote-btn down ${v.voted==='down'?'voted':''}`} onClick={()=>vote('down')}>▼ {v.down}</button>
    </div>
  )
}

const MatchRing = ({ score }) => {
  const size=48,r=19,circ=2*Math.PI*r
  const color=score>=85?'#1A7A4A':score>=70?'#A07010':'#7A1E3A'
  return (
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{position:'absolute',top:0,left:0,transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(212,197,169,.35)" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={`${(score/100)*circ} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontSize:'.76rem',fontWeight:800,color,lineHeight:1,fontFamily:'DM Sans,sans-serif'}}>{score}%</span>
        <span style={{fontSize:'.5rem',fontWeight:700,textTransform:'uppercase',color:'#8A7B6A'}}>match</span>
      </div>
    </div>
  )
}

/* ══ TRANSLATIONS ══ */
const T = {
  ar:{brand:'QatarEdu',tagline:'منصة قطر التعليمية',schools:'المدارس',trustPage:'التحقق',addReview:'أضف تقييم',hero1:'اختر المدرسة المناسبة',hero2:'بثقة تامة',heroSub:'تقييمات موثّقة عبر الهوية القطرية · بروفايلات كل مدرس · رسوم الوزارة بضغطة واحدة',searchPH:'ابحث باسم المدرسة أو المدرّس…',viewSchool:'عرض الملف الكامل',howTrust:'كيف نضمن المصداقية؟',trustTitle:'تقييمات لا يمكن التلاعب بها',trustSub:'كل تقييم مربوط بـ QID قطري حقيقي + تحقق من تسجيل الطالب فعلاً.',learnMore:'اعرف أكثر',login:'دخول',logout:'خروج',profile:'ملفي الشخصي',tabs:{grades:'الصفوف',teachers:'المدرّسون',academic:'الأداء',fees:'الرسوم',reviews:'التقييمات',insight:'AI Insight'},grades:'الصفوف الدراسية',gradesSub:'اختر المرحلة',teachers:'المدرّسون',academic:'الأداء الأكاديمي',academicSub:'بيانات رسمية',fees:'الرسوم الرسمية',reviews:'التقييمات الموثّقة',insight:'AI Insight',age:'الأعمار',students:'الطلاب',tchrs:'المدرسون',classSize:'حجم الفصل',avgScore:'متوسط الدرجات',gradeTeachers:'مدرسو هذه المرحلة',allTeachers:'كل المدرسين',strengths:'نقاط القوة',weaknesses:'مجالات التحسين',noWeakness:'لا ملاحظات سلبية ✓',exp:'سنوات خبرة',verifiedQID:'موثّق',unverified:'غير موثّق',pdfTitle:'وثائق وزارة التعليم',pdfNote:'أي زيادة خارج هذه الوثائق مخالفة للقانون.',download:'تحميل',official:'رسمي',approxFees:'الرسوم السنوية التقريبية',feesNote:'* الأرقام الرسمية في ملفات الوزارة',reply:'رد',roleParent:'ولي أمر',roleStudent:'طالب',roleEmployee:'موظف تعليمي',writeReview:'اكتب تقييمك',verifyId:'🔐 تحقق من هويتك',verifyNote:'نطلب التحقق عبر بطاقة الهوية القطرية.',qidLabel:'رقم الهوية (QID)',studentId:'رقم قيد الطالب',verifyBtn:'تحقق والمتابعة →',submitReview:'إرسال التقييم ✓',verifiedAs:'تم التحقق —',encrypted:'بياناتك مشفّرة',yourRole:'صفتك',overallRating:'تقييمك العام',writeExp:'اكتب تجربتك',mentionTeacher:'هل تذكر مدرّساً؟',selectTeacher:'— اختر مدرساً —',back:'العودة ←',verified:'موثّق من الوزارة',founded:'تأسست',igcseA:'IGCSE A%',aLevelA:'A-Level A*%',attendance:'الحضور',regTeachers:'مدرسون',stages:'مراحل',year:'العام',igcse:'IGCSE A%',alevel:'A-Level A*%',att:'الحضور',latest:'الأحدث',noComments:'كن أول من يكتب تقييماً',insightTitle:'ما الذي يميز هذه المدرسة؟',insightDesc:'تحليل مدعوم بالذكاء الاصطناعي',teacherHighlight:'أبرز مدرّس هذا الشهر',trendUp:'في تحسّن',trendDown:'يحتاج اهتمام',parentVoice:'صوت الأهالي',aiWarning:'هذا التحليل مولّد من AI بناءً على التقييمات الموثّقة فقط.',noResults:'لا توجد نتائج لـ',matchLabel:'تطابق: المنهج · المنطقة · الميزانية',reviewSchool:'تقييم المدرسة',reviewTeacher:'تقييم مدرّس',catAcademic:'المستوى الأكاديمي',catFacilities:'المرافق والبيئة',catMgmt:'الإدارة والتواصل',catActivities:'الأنشطة والبرامج',catValue:'القيمة مقابل الرسوم',catSafety:'الأمان والسلامة',tcExplain:'أسلوب الشرح',tcCommit:'الالتزام والحضور',tcInteract:'التفاعل مع الطلاب',tcResults:'النتائج الأكاديمية',tcComm:'التواصل مع الأهالي',myProfile:'ملفي الشخصي',myReviews:'تقييماتي',editProfile:'تعديل الملف',badgeGuide:'دليل العلامات',badgeParent:'ولي أمر موثّق — أخضر',badgeStudent:'طالب موثّق — أزرق',badgeEmployee:'موظف هيئة تدريسية — ذهبي',badgePro:'عضو Pro مميز — عنابي'},
  en:{brand:'EduQatar',tagline:"Qatar's Education Platform",schools:'Schools',trustPage:'Trust',addReview:'Add Review',hero1:'Find the Right School',hero2:'with Full Confidence',heroSub:'Verified via QID · Teacher profiles · Ministry fees in one click',searchPH:'Search school or teacher…',viewSchool:'View Full Profile',howTrust:'How we ensure trust?',trustTitle:'Tamper-proof ratings',trustSub:'Every review linked to a real QID + enrollment verification.',learnMore:'Learn more',login:'Login',logout:'Logout',profile:'My Profile',tabs:{grades:'Grades',teachers:'Teachers',academic:'Performance',fees:'Fees',reviews:'Reviews',insight:'AI Insight'},grades:'Grade Levels',gradesSub:'Select a grade',teachers:'Teaching Staff',academic:'Academic Performance',academicSub:'Official Ministry data',fees:'Official Fees',reviews:'Verified Reviews',insight:'AI Insight',age:'Ages',students:'Students',tchrs:'Teachers',classSize:'Class Size',avgScore:'Avg. Score',gradeTeachers:'Teachers in grade',allTeachers:'All Teachers',strengths:'Strengths',weaknesses:'Areas to Improve',noWeakness:'No negative notes ✓',exp:'yrs exp',verifiedQID:'Verified',unverified:'Unverified',pdfTitle:'Ministry Documents',pdfNote:'Any fees above these documents are illegal.',download:'Download',official:'Official',approxFees:'Approx. Annual Fees',feesNote:'* Official figures in Ministry files',reply:'Reply',roleParent:'Parent',roleStudent:'Student',roleEmployee:'School Staff',writeReview:'Write a Review',verifyId:'🔐 Verify Your Identity',verifyNote:'QID verification required.',qidLabel:'Qatari ID (QID)',studentId:'Student enrollment number',verifyBtn:'Verify & Continue →',submitReview:'Submit Review ✓',verifiedAs:'Verified —',encrypted:'Your data is encrypted',yourRole:'Your Role',overallRating:'Overall Rating',writeExp:'Write your experience',mentionTeacher:'Mention a teacher?',selectTeacher:'— Select a teacher —',back:'← Back',verified:'Ministry Verified',founded:'Est.',igcseA:'IGCSE A%',aLevelA:'A-Level A*%',attendance:'Attendance',regTeachers:'Teachers',stages:'Grades',year:'Year',igcse:'IGCSE A%',alevel:'A-Level A*%',att:'Attendance',latest:'Latest',noComments:'Be the first to review',insightTitle:'What makes this school stand out?',insightDesc:'AI-powered analysis based on verified reviews',teacherHighlight:'Top Teacher This Month',trendUp:'Improving',trendDown:'Needs attention',parentVoice:'Parent Voice',aiWarning:'AI-generated from verified reviews only.',noResults:'No results for',matchLabel:'Match: Curriculum · Area · Budget',reviewSchool:'Rate the School',reviewTeacher:'Rate a Teacher',catAcademic:'Academic Level',catFacilities:'Facilities & Environment',catMgmt:'Management & Communication',catActivities:'Activities & Programs',catValue:'Value for Money',catSafety:'Safety & Security',tcExplain:'Teaching Style',tcCommit:'Commitment & Attendance',tcInteract:'Student Interaction',tcResults:'Academic Results',tcComm:'Parent Communication',myProfile:'My Profile',myReviews:'My Reviews',editProfile:'Edit Profile',badgeGuide:'Badge Guide',badgeParent:'Verified Parent — Green',badgeStudent:'Verified Student — Blue',badgeEmployee:'Teaching Staff — Gold',badgePro:'Pro Member — Maroon'},
}

/* ══ SAMPLE DATA ══ */
const SAMPLE_SCHOOLS = [
  {id:1,name:{ar:'مدرسة الدوحة الدولية',en:'Doha International School'},area:{ar:'المسيلة، الدوحة',en:'Al Messila, Doha'},curriculum:{ar:'بريطاني',en:'British'},founded:1975,students:2200,match:91,
  description:{ar:'من أعرق مدارس المنهج البريطاني في قطر. تأسست 1975 وتضم أكثر من 2200 طالب.',en:"One of Qatar's most established British schools. Founded 1975, 2,200+ students."},
  vision:{ar:'تنمية جيل واعٍ قادر على قيادة المستقبل بقيم أصيلة وتفكير نقدي.',en:'Nurturing a generation capable of leading the future with authentic values.'},
  management:[{nameAr:'د. خالد المنصوري',nameEn:'Dr. Khalid Al-Mansouri',roleAr:'مدير المدرسة',roleEn:'Principal'},{nameAr:'سارة الكواري',nameEn:'Sarah Al-Kawari',roleAr:'مديرة أكاديمية',roleEn:'Academic Director'}],
  services:{ar:['مواصلات','كافيتيريا','مكتبة','ملاعب','نادي علوم','برنامج فنون'],en:['Transportation','Cafeteria','Library','Sports Fields','Science Club','Arts Program']},
  photos:{hero:'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80'},
  grades:[
    {id:'FS',label:{ar:'الروضة (FS1–FS2)',en:'Foundation (FS1–FS2)'},age:'3–5',students:240,teachers:8,classSize:15,avgScore:92,photos:['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700','https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400','https://images.unsplash.com/photo-1562774053-701939374585?w=400']},
    {id:'KS1',label:{ar:'ابتدائي أول (Y1–Y2)',en:'Lower Primary (Y1–Y2)'},age:'5–7',students:420,teachers:14,classSize:20,avgScore:88,photos:['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700','https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400']},
    {id:'KS2',label:{ar:'ابتدائي ثاني (Y3–Y6)',en:'Upper Primary (Y3–Y6)'},age:'7–11',students:580,teachers:22,classSize:22,avgScore:87,photos:['https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=700','https://images.unsplash.com/photo-1562774053-701939374585?w=400','https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400']},
    {id:'GCSE',label:{ar:'IGCSE (Y10–Y11)',en:'IGCSE (Y10–Y11)'},age:'14–16',students:280,teachers:16,classSize:20,avgScore:91,photos:['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400','https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400']},
    {id:'AL',label:{ar:'A-Level (Y12–Y13)',en:'A-Level (Y12–Y13)'},age:'16–18',students:180,teachers:12,classSize:15,avgScore:94,photos:['https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=700','https://images.unsplash.com/photo-1562774053-701939374585?w=400','https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400']},
  ],
  teachers:[
    {id:1,nameAr:'سارة الجابر',nameEn:'Sarah Al-Jaber',subject:{ar:'الرياضيات',en:'Mathematics'},grade:'IGCSE · A-Level',exp:12,rating:4.8,reviews:87,verified:true,role:'employee',pro:true,av:'سج',bg:'rgba(122,30,58,.1)',str:{ar:['شرح واضح','نتائج ممتازة'],en:['Clear explanations','Excellent results']},weak:{ar:['السرعة أحياناً'],en:['Pace sometimes fast']}},
    {id:2,nameAr:'جيمس ويلسون',nameEn:'James Wilson',subject:{ar:'العلوم',en:'Sciences'},grade:'KS2 · KS3',exp:8,rating:4.6,reviews:64,verified:true,role:'employee',pro:false,av:'JW',bg:'rgba(20,90,105,.1)',str:{ar:['أنشطة عملية'],en:['Hands-on']},weak:{ar:['التواصل مع الأهالي'],en:['Parent communication']}},
    {id:3,nameAr:'فاطمة النعيمي',nameEn:'Fatima Al-Naimi',subject:{ar:'اللغة العربية',en:'Arabic Language'},grade:'KS1 · KS3',exp:15,rating:4.9,reviews:112,verified:true,role:'employee',pro:true,av:'فن',bg:'rgba(160,112,16,.1)',str:{ar:['إلهام حقيقي'],en:['Inspiring']},weak:{ar:[],en:[]}},
  ],
  academic:[{year:'19–20',igcse:61,alevel:44,att:94},{year:'20–21',igcse:65,alevel:48,att:91},{year:'21–22',igcse:70,alevel:52,att:95},{year:'22–23',igcse:75,alevel:57,att:96},{year:'23–24',igcse:81,alevel:63,att:97}],
  pdfs:[
    {label:{ar:'جدول رسوم الدراسة 2024–2025',en:'Tuition Fee Schedule 2024–2025'},sub:{ar:'وزارة التعليم والتعليم العالي',en:'Ministry of Education'},size:'1.2 MB',date:'Sep 2024',url:'#'},
    {label:{ar:'هيكل الرسوم والمصاريف الإضافية',en:'Fee Structure & Additional Charges'},sub:{ar:'قرار الوزارة رقم 14 لسنة 2024',en:'Ministerial Decree No.14 / 2024'},size:'890 KB',date:'Aug 2024',url:'#'},
  ],
  fees:[[{ar:'الروضة',en:'Foundation'},51000,55000],[{ar:'ابتدائي',en:'Primary'},55000,63000],[{ar:'إعدادي',en:'Middle'},63000,70000],[{ar:'IGCSE',en:'IGCSE'},70000,76000],[{ar:'A-Level',en:'A-Level'},76000,78000]],
  reviews:[
    {id:1,author:'أم عبدالله الهاشمي',authorEn:'Um Abdullah Al-Hashimi',qid:'QID-*****-8821',role:'parent',pro:true,rating:5,date:{ar:'منذ أسبوعين',en:'2 weeks ago'},text:{ar:'تجاوزت توقعاتنا. نتائج ابني في IGCSE كانت استثنائية.',en:"Exceeded expectations. Son's IGCSE results were exceptional."},up:34,down:2,teacher:'سارة الجابر',categories:{academic:5,facilities:4,management:5,activities:4,value:3,safety:5}},
    {id:2,author:'عائلة المنصوري',authorEn:'Al-Mansouri Family',qid:'QID-*****-4410',role:'parent',pro:false,rating:4,date:{ar:'منذ شهر',en:'1 month ago'},text:{ar:'جو إيجابي ومحفّز. الأنشطة رائعة. الرسوم مرتفعة لكن الجودة تستحق.',en:'Positive environment. Fees high but quality is worth it.'},up:21,down:1,teacher:'',categories:{academic:4,facilities:5,management:4,activities:5,value:3,safety:4}},
  ],
  insight:{
    ar:{summary:'مدرسة الدوحة الدولية في مسار تصاعدي واضح — 32% تحسن في IGCSE خلال 5 سنوات. الكادر التدريسي هو العامل الأبرز.',topTeacher:'فاطمة النعيمي',topScore:4.9,topReason:'الأكثر ذكراً في تقييمات 2024',sentiment:94,trends:[{label:'الأداء الأكاديمي',val:81,up:true},{label:'رضا الأهالي',val:94,up:true},{label:'جودة المرافق',val:78,up:true},{label:'التواصل',val:82,up:true}]},
    en:{summary:'Doha International School shows a clear upward trajectory — 32% IGCSE improvement over 5 years.',topTeacher:'Fatima Al-Naimi',topScore:4.9,topReason:'Most mentioned in 2024 reviews',sentiment:94,trends:[{label:'Academic Performance',val:81,up:true},{label:'Parent Satisfaction',val:94,up:true},{label:'Facilities Quality',val:78,up:true},{label:'Communication',val:82,up:true}]}
  }}
]

/* ══ REVIEW MODAL ══ */
const ReviewModal = ({ school, lang, userId, onClose }) => {
  const t=T[lang], isRTL=lang==='ar'
  const [qid,setQid]=useState(''), [ok,setOk]=useState(false)
  const [role,setRole]=useState('parent'), [stars,setStars]=useState(0), [hover,setHover]=useState(0)
  const [text,setText]=useState(''), [teacher,setTeacher]=useState('')
  const [reviewType,setReviewType]=useState('school')
  const [cats,setCats]=useState({academic:0,facilities:0,management:0,activities:0,value:0,safety:0})
  const [tcats,setTcats]=useState({explain:0,commit:0,interact:0,results:0,comm:0})

  const schoolCats=[[' academic',t.catAcademic],['facilities',t.catFacilities],['management',t.catMgmt],['activities',t.catActivities],['value',t.catValue],['safety',t.catSafety]]
  const teacherCats=[['explain',t.tcExplain],['commit',t.tcCommit],['interact',t.tcInteract],['results',t.tcResults],['comm',t.tcComm]]

  const submit=async()=>{
    await supabase.from('reviews').insert({school_id:school.id,user_id:userId,author:'مستخدم',role,rating:stars,text_ar:text,text_en:text,qid_masked:`QID-*****-${qid.slice(-4)}`,teacher_name:teacher})
    onClose()
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {!ok?(
          <div style={{padding:24}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
              <h2 style={{fontWeight:700,fontSize:'1rem'}}>{t.verifyId}</h2>
              <button onClick={onClose} style={{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#8A7B6A'}}>✕</button>
            </div>
            <div style={{background:'rgba(160,112,16,.07)',border:'1px solid rgba(160,112,16,.25)',borderRadius:8,padding:'8px 12px',marginBottom:12,fontSize:'.77rem',color:'#7A5800',fontWeight:600}}>⚠️ وضع تجريبي — أي رقم يشتغل</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:'.7rem',fontWeight:700,color:'#8A7B6A',marginBottom:5,textTransform:'uppercase',letterSpacing:.8}}>{t.yourRole}</div>
              <div style={{display:'flex',gap:6}}>
                {[['parent',t.roleParent],['student',t.roleStudent],['employee',t.roleEmployee]].map(([k,v])=>(
                  <button key={k} className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:'center',borderColor:role===k?'#7A1E3A':'',color:role===k?'#7A1E3A':''}} onClick={()=>setRole(k)}>{v}</button>
                ))}
              </div>
            </div>
            <div style={{fontSize:'.7rem',fontWeight:700,color:'#8A7B6A',marginBottom:4,textTransform:'uppercase',letterSpacing:.8}}>{t.qidLabel}</div>
            <input className="input" placeholder="أي رقم للتجربة" value={qid} onChange={e=>setQid(e.target.value)} style={{marginBottom:16}}/>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>{if(qid.length>=3)setOk(true)}}>{t.verifyBtn}</button>
          </div>
        ):(
          <div style={{padding:24}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
              <h2 style={{fontWeight:700,fontSize:'1rem'}}>✍️ {t.writeReview}</h2>
              <button onClick={onClose} style={{background:'none',border:'none',fontSize:18,cursor:'pointer',color:'#8A7B6A'}}>✕</button>
            </div>
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {[['school',t.reviewSchool],['teacher',t.reviewTeacher]].map(([k,v])=>(
                <button key={k} className="btn btn-ghost btn-sm" style={{flex:1,justifyContent:'center',borderColor:reviewType===k?'#7A1E3A':'',color:reviewType===k?'#7A1E3A':'',fontWeight:reviewType===k?700:400}} onClick={()=>setReviewType(k)}>{v}</button>
              ))}
            </div>
            <div style={{fontSize:'.7rem',fontWeight:700,color:'#8A7B6A',marginBottom:6,textTransform:'uppercase',letterSpacing:.8}}>{t.overallRating}</div>
            <div style={{display:'flex',gap:3,marginBottom:14}}>
              {[1,2,3,4,5].map(n=>(
                <span key={n} style={{fontSize:30,cursor:'pointer',color:n<=(hover||stars)?'#C8921A':'#D4C5A9',transition:'color .1s'}} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)} onClick={()=>setStars(n)}>★</span>
              ))}
            </div>
            <div style={{marginBottom:12}}>
              {(reviewType==='school'?schoolCats:teacherCats).map(([k,label])=>(
                <div key={k} className="rating-cat">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'.8rem',fontWeight:500}}>{label}</span>
                    <div style={{display:'flex',gap:2}}>
                      {[1,2,3,4,5].map(n=>(
                        <span key={n} onClick={()=>reviewType==='school'?setCats(p=>({...p,[k.trim()]:n})):setTcats(p=>({...p,[k]:n}))}
                          style={{fontSize:15,cursor:'pointer',color:n<=(reviewType==='school'?cats[k.trim()]:tcats[k])?'#C8921A':'#D4C5A9'}}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <textarea className="input" style={{minHeight:80,resize:'vertical',marginBottom:10}} placeholder={t.writeExp} value={text} onChange={e=>setText(e.target.value)}/>
            <select className="input" style={{marginBottom:16}} value={teacher} onChange={e=>setTeacher(e.target.value)}>
              <option value="">{t.selectTeacher}</option>
              {(school.teachers||[]).map(tc=><option key={tc.id}>{isRTL?tc.nameAr:tc.nameEn}</option>)}
            </select>
            <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={submit}>{t.submitReview}</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══ PROFILE PAGE ══ */
const ProfilePage = ({ user, profile, lang, setPage, onLogout }) => {
  const t=T[lang]
  const [reviews,setReviews]=useState([])
  useEffect(()=>{ if(user) supabase.from('reviews').select('*').eq('user_id',user.id).then(({data})=>{ if(data) setReviews(data) }) },[user])
  return (
    <div style={{minHeight:'100vh',background:'#F8F4EE'}}>
      <div className="container" style={{padding:'32px 18px 60px'}}>
        <button className="btn btn-ghost btn-sm" style={{marginBottom:20}} onClick={()=>setPage('landing')}>{t.back}</button>
        <div style={{background:'linear-gradient(135deg,#6B1830,#9B2548)',borderRadius:20,padding:'28px 24px',marginBottom:20,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,.06)'}}/>
          <div style={{display:'flex',gap:16,alignItems:'center'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',fontWeight:700,color:'#FFF8F0',border:'2px solid rgba(255,255,255,.3)',flexShrink:0}}>
              {(user?.email||'U').slice(0,1).toUpperCase()}
            </div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                <span style={{fontWeight:700,fontSize:'1rem',color:'#FFF8F0'}}>{user?.email}</span>
                {profile?.qid_verified&&<VerifiedBadge role={profile?.role||'parent'} size={18}/>}
                {profile?.is_pro&&<ProBadge size={18}/>}
              </div>
              <span style={{fontSize:'.75rem',color:'rgba(248,244,238,.65)'}}>
                {profile?.role==='parent'?t.roleParent:profile?.role==='student'?t.roleStudent:t.roleEmployee}
              </span>
            </div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
          {[[reviews.length,t.myReviews,'#7A1E3A'],[profile?.is_pro?'Pro':'Free',lang==='ar'?'الاشتراك':'Plan','#A07010'],[profile?.qid_verified?'✓':'—','QID','#1A7A4A']].map(([v,l,c])=>(
            <div key={l} style={{background:'#fff',borderRadius:12,padding:'14px 12px',textAlign:'center',border:'1px solid rgba(212,197,169,.6)'}}>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:c,lineHeight:1}}>{v}</div>
              <div style={{fontSize:'.7rem',color:'#8A7B6A',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
        {/* Badge guide */}
        <div style={{background:'#fff',borderRadius:14,padding:'18px 16px',marginBottom:20,border:'1px solid rgba(212,197,169,.6)'}}>
          <div style={{fontWeight:700,marginBottom:14,fontSize:'.92rem'}}>{t.badgeGuide}</div>
          {[['parent','#1A7A4A',t.badgeParent],['student','#1A5AA0',t.badgeStudent],['employee','#C8921A',t.badgeEmployee]].map(([role,color,label])=>(
            <div key={role} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',background:'rgba(248,244,238,.6)',borderRadius:9,marginBottom:8}}>
              <VerifiedBadge role={role} size={22}/>
              <span style={{fontSize:'.83rem',color,fontWeight:600}}>{label}</span>
            </div>
          ))}
          <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',background:'rgba(248,244,238,.6)',borderRadius:9}}>
            <ProBadge size={22}/>
            <span style={{fontSize:'.83rem',color:'#7A1E3A',fontWeight:600}}>{t.badgePro}</span>
          </div>
        </div>
        {/* Reviews */}
        <div style={{fontWeight:700,marginBottom:12,fontSize:'.92rem'}}>{t.myReviews} ({reviews.length})</div>
        {reviews.length===0
          ? <div style={{textAlign:'center',padding:'30px 0',color:'#8A7B6A',fontSize:'.85rem'}}>{t.noComments}</div>
          : reviews.map(r=>(
            <div key={r.id} className="review-card" style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontWeight:600,fontSize:'.85rem'}}>{(r.text_ar||'').slice(0,60)}...</span>
                <Stars r={r.rating}/>
              </div>
              <div style={{fontSize:'.73rem',color:'#8A7B6A'}}>{new Date(r.created_at).toLocaleDateString('ar-QA')}</div>
            </div>
          ))}
        <button onClick={onLogout} style={{marginTop:20,width:'100%',padding:'11px 0',borderRadius:10,border:'1.5px solid rgba(212,197,169,.6)',background:'transparent',color:'#8A7B6A',fontFamily:'inherit',fontSize:'.88rem',cursor:'pointer'}}>{t.logout}</button>
      </div>
    </div>
  )
}

/* ══ SCHOOL PAGE ══ */
const SchoolPageView = ({ school, lang, t, isRTL, setPage, userId, onReview }) => {
  const [tab,setTab]=useState('grades'), [grade,setGrade]=useState(school.grades?.[0]), [teacher,setTeacher]=useState(null)
  const latest=school.academic?.at?.(-1)||{}, ins=school.insight?.[lang]||{}
  const tcName=tc=>isRTL?tc.nameAr:tc.nameEn

  return (
    <div>
      <div className="school-hero">
        <img src={school.photos?.hero} alt=""/>
        <div className="hero-overlay"/>
        <div className="container" style={{position:'absolute',bottom:18,left:'50%',transform:'translateX(-50%)',width:'100%'}}>
          <button className="btn btn-sm" style={{marginBottom:10,background:'rgba(248,244,238,.15)',color:'#F8F4EE',border:'1px solid rgba(248,244,238,.25)',backdropFilter:'blur(8px)'}} onClick={()=>setPage('landing')}>{t.back}</button>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:10}}>
            <div>
              {/* ── Badges on hero — white style to be visible on photo ── */}
              <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap',alignItems:'center'}}>
                <span className="badge badge-white" style={{display:'inline-flex',alignItems:'center',gap:4}}>
                  <svg width="11" height="11" viewBox="0 0 16 16"><path d="M8 1.2L9.4 0.6L10.5 1.7L12 1.5L12.7 2.8L14 3.2L14.1 4.6L15.2 5.5L14.9 6.9L15.6 8L14.9 9.1L15.2 10.5L14.1 11.4L14 12.8L12.7 13.2L12 14.5L10.5 14.3L9.4 15.4L8 14.8L6.6 15.4L5.5 14.3L4 14.5L3.3 13.2L2 12.8L1.9 11.4L0.8 10.5L1.1 9.1L0.4 8L1.1 6.9L0.8 5.5L1.9 4.6L2 3.2L3.3 2.8L4 1.5L5.5 1.7L6.6 0.6Z" fill="white"/><path d="M4.5 8.5L6.8 10.8L11.5 5.5" stroke="rgba(36,26,16,.7)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                  {t.verified}
                </span>
                <span className="badge badge-white">{school.curriculum?.[lang]}</span>
              </div>
              <h1 style={{color:'#FAF7F2',fontWeight:700,fontSize:'clamp(1.2rem,3vw,1.8rem)',marginBottom:3,textShadow:'0 1px 8px rgba(0,0,0,.4)'}}>{school.name?.[lang]}</h1>
              <p style={{color:'rgba(248,244,238,.75)',fontSize:'.8rem',textShadow:'0 1px 4px rgba(0,0,0,.3)'}}>📍 {school.area?.[lang]} · {t.founded} {school.founded} · {school.students?.toLocaleString()}</p>
            </div>
            <button className="btn btn-gold btn-sm" onClick={onReview}>✍️ {t.addReview}</button>
          </div>
        </div>
      </div>

      {latest.igcse&&(
        <div style={{background:'#fff',borderBottom:'1px solid rgba(212,197,169,.5)'}}>
          <div className="container">
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)'}}>
              {[[t.igcseA,latest.igcse+'%','#7A1E3A'],[t.aLevelA,latest.alevel+'%','#9B2548'],[t.attendance,latest.att+'%','#1A7A4A'],[t.regTeachers,school.teachers?.length+'','#1A5AA0'],[t.stages,school.grades?.length+'','#A07010']].map(([l,v,c])=>(
                <div key={l} className="stat-chip">
                  <div style={{fontSize:'1.2rem',fontWeight:700,color:c,marginBottom:1,fontFamily:'DM Sans,sans-serif'}}>{v}</div>
                  <div style={{fontSize:'.66rem',color:'#8A7B6A'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{background:'#fff',borderBottom:'1px solid rgba(212,197,169,.4)',position:'sticky',top:60,zIndex:50}}>
        <div className="container">
          <div className="tab-row">
            {Object.entries(t.tabs).map(([k,v])=>(
              <button key={k} className={`tab-btn ${tab===k?'active':''}`} onClick={()=>setTab(k)}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{padding:'24px 18px 56px'}}>

        {tab==='grades'&&(
          <div className="fade-up">
            <div className="eyebrow">{t.grades}</div>
            <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:3}}>{t.grades}</h2>
            <p style={{fontSize:'.83rem',color:'#5A4A38',marginBottom:16}}>{t.gradesSub}</p>
            {school.grades?.length>0&&(
              <>
                <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:18}}>
                  {school.grades.map(g=><button key={g.id} className={`grade-pill ${grade?.id===g.id?'active':''}`} onClick={()=>setGrade(g)}>{g.label?.[lang]}</button>)}
                </div>
                {grade&&(
                  <>
                    <div className="pg" style={{marginBottom:16}}>
                      <img className="main" src={grade.photos?.[0]} alt=""/>
                      {grade.photos?.slice(1,3).map((p,i)=><img key={i} src={p} alt=""/>)}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
                      <div className="card" style={{padding:16}}>
                        <h3 style={{fontWeight:700,fontSize:'.92rem',marginBottom:11}}>{grade.label?.[lang]}</h3>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:11}}>
                          {[[t.age,grade.age],[t.students,grade.students],[t.tchrs,grade.teachers],[t.classSize,grade.classSize]].map(([l,v])=>(
                            <div key={l} style={{padding:'9px 11px',background:'rgba(248,244,238,.8)',borderRadius:8}}>
                              <div style={{fontSize:'.66rem',color:'#8A7B6A',marginBottom:1}}>{l}</div>
                              <div style={{fontWeight:600,fontSize:'.87rem'}}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{padding:'10px 13px',background:'rgba(122,30,58,.05)',borderRadius:8,borderRight:'3px solid #7A1E3A'}}>
                          <div style={{fontSize:'.66rem',color:'#8A7B6A',marginBottom:1}}>{t.avgScore}</div>
                          <div style={{fontSize:'1.7rem',fontWeight:700,color:'#7A1E3A',lineHeight:1,fontFamily:'DM Sans,sans-serif'}}>{grade.avgScore}%</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {tab==='teachers'&&(
          <div className="fade-up">
            <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:16}}>{t.teachers} — {school.teachers?.length}</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:11}}>
              {(school.teachers||[]).map(tc=>(
                <div key={tc.id} className={`t-card ${teacher?.id===tc.id?'selected':''}`} onClick={()=>setTeacher(teacher?.id===tc.id?null:tc)}>
                  <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:9}}>
                    <div className="avatar" style={{background:tc.bg,width:44,height:44,fontSize:'.95rem'}}>{tc.av}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',marginBottom:1}}>
                        <span style={{fontWeight:700,fontSize:'.88rem'}}>{tcName(tc)}</span>
                        {tc.verified&&<VerifiedBadge role={tc.role}/>}
                        {tc.pro&&<ProBadge/>}
                        {!tc.verified&&<span className="badge badge-sand" style={{fontSize:'.65rem'}}>{t.unverified}</span>}
                      </div>
                      <div style={{fontSize:'.73rem',color:'#8A7B6A'}}>{tc.exp} {t.exp}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:8}}>
                    <span className="badge badge-maroon" style={{fontSize:'.67rem'}}>📚 {tc.subject?.[lang]}</span>
                    <span className="badge badge-blue" style={{fontSize:'.67rem'}}>🎓 {tc.grade}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 10px',background:'rgba(248,244,238,.7)',borderRadius:7}}>
                    <Stars r={tc.rating}/><span style={{fontWeight:700,color:'#C8921A',fontSize:'.9rem'}}>{tc.rating}</span>
                    <span style={{fontSize:'.72rem',color:'#8A7B6A'}}>({tc.reviews})</span>
                  </div>
                  {teacher?.id===tc.id&&(
                    <div style={{marginTop:11}}>
                      <div className="divider" style={{margin:'9px 0'}}/>
                      {[['Teaching Style','#7A1E3A',Math.round(tc.rating/5*100)],['Communication','#1A5AA0',Math.round((tc.rating-.12)/5*100)],['Commitment','#A07010',Math.round((tc.rating+.04)/5*100)],['Results','#1A7A4A',Math.round((tc.rating-.05)/5*100)]].map(([l,c,v])=>(
                        <div key={l} style={{marginBottom:7}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                            <span style={{fontSize:'.72rem',color:'#8A7B6A'}}>{l}</span>
                            <span style={{fontSize:'.72rem',fontWeight:700,color:c}}>{v}%</span>
                          </div>
                          <div className="bar-track"><div className="bar-fill" style={{width:`${v}%`,background:c}}/></div>
                        </div>
                      ))}
                      <div className="divider"/>
                      <div style={{display:'flex',gap:6}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'.65rem',fontWeight:700,color:'#1A7A4A',marginBottom:4,textTransform:'uppercase',letterSpacing:.8}}>{t.strengths}</div>
                          {tc.str?.[lang]?.map(s=><div key={s} style={{fontSize:'.77rem',color:'#4A3A28',marginBottom:2}}>• {s}</div>)}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'.65rem',fontWeight:700,color:'#A07010',marginBottom:4,textTransform:'uppercase',letterSpacing:.8}}>{t.weaknesses}</div>
                          {tc.weak?.[lang]?.length===0?<span style={{fontSize:'.77rem',color:'#1A7A4A'}}>{t.noWeakness}</span>:tc.weak?.[lang]?.map(w=><div key={w} style={{fontSize:'.77rem',color:'#4A3A28',marginBottom:2}}>• {w}</div>)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='academic'&&school.academic?.length>0&&(
          <div className="fade-up">
            <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:18}}>{t.academic}</h2>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {[['igcse',t.igcseA,'#7A1E3A',50,100],['alevel',t.aLevelA,'#A07010',30,85]].map(([key,title,color,mn,mx])=>(
                <div key={key} className="card" style={{padding:16}}>
                  <div style={{fontWeight:600,marginBottom:11}}>{title}</div>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={school.academic}>
                      <defs><linearGradient id={`g${key}${school.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={.15}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,197,169,.4)"/>
                      <XAxis dataKey="year" tick={{fontSize:10,fill:'#8A7B6A'}}/>
                      <YAxis tick={{fontSize:10,fill:'#8A7B6A'}} domain={[mn,mx]} tickFormatter={v=>v+'%'}/>
                      <Tooltip formatter={v=>[v+'%']} contentStyle={{background:'#fff',border:'1px solid rgba(212,197,169,.6)',borderRadius:8,fontSize:12}}/>
                      <Area type="monotone" dataKey={key} stroke={color} strokeWidth={2.5} fill={`url(#g${key}${school.id})`} dot={{r:3.5,fill:color,strokeWidth:0}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='fees'&&(
          <div className="fade-up">
            <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:14}}>{t.pdfTitle}</h2>
            <div style={{background:'rgba(20,90,105,.05)',border:'1px solid rgba(20,90,105,.18)',borderRadius:9,padding:'10px 14px',marginBottom:16,fontSize:'.79rem',color:'#0F5A6A'}}>ℹ️ {t.pdfNote}</div>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
              {(school.pdfs||[]).map((pdf,i)=>(
                <div key={i} className="pdf-row" onClick={()=>window.open(pdf.url||'#','_blank')}>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <div style={{width:37,height:43,background:'rgba(26,122,74,.08)',border:'1px solid rgba(26,122,74,.18)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:17}}>📄</div>
                    <div>
                      <div style={{fontWeight:600,fontSize:'.84rem',marginBottom:1}}>{pdf.label?.[lang]}</div>
                      <div style={{fontSize:'.71rem',color:'#8A7B6A'}}>{pdf.sub?.[lang]}</div>
                      <div style={{fontSize:'.69rem',color:'#8A7B6A',marginTop:1}}>📅 {pdf.date} · {pdf.size}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                    <span className="badge badge-green" style={{fontSize:'.67rem'}}>✓ {t.official}</span>
                    <span style={{color:'#1A7A4A',fontWeight:700,fontSize:'.79rem'}}>{t.download} ↓</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{padding:16}}>
              <div style={{fontWeight:600,marginBottom:11}}>{t.approxFees}</div>
              {(school.fees||[]).map(([l,mn,mx],i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<school.fees.length-1?'1px solid rgba(212,197,169,.3)':'',flexWrap:'wrap',gap:5}}>
                  <span style={{fontSize:'.85rem'}}>{l?.[lang]}</span>
                  <span style={{fontWeight:700,color:'#7A1E3A',fontSize:'.87rem',fontFamily:'DM Sans,sans-serif'}}>QAR {mn?.toLocaleString()} – {mx?.toLocaleString()}</span>
                </div>
              ))}
              <p style={{fontSize:'.71rem',color:'#8A7B6A',marginTop:9}}>{t.feesNote}</p>
            </div>
          </div>
        )}

        {tab==='reviews'&&(
          <div className="fade-up">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:14,flexWrap:'wrap',gap:10}}>
              <h2 style={{fontSize:'1.1rem',fontWeight:700}}>{t.reviews}</h2>
              <button className="btn btn-primary btn-sm" onClick={onReview}>✍️ {t.addReview}</button>
            </div>
            {school.reviews?.length>0&&(
              <div className="card" style={{padding:16,marginBottom:16}}>
                <div style={{fontWeight:600,marginBottom:12,fontSize:'.88rem'}}>{lang==='ar'?'تفاصيل التقييم':'Rating Breakdown'}</div>
                {[[' academic',t.catAcademic],['facilities',t.catFacilities],['management',t.catMgmt],['activities',t.catActivities],['value',t.catValue],['safety',t.catSafety]].map(([k,label])=>{
                  const avg=school.reviews.reduce((a,r)=>a+(r.categories?.[k.trim()]||0),0)/school.reviews.length
                  return (
                    <div key={k} style={{marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                        <span style={{fontSize:'.78rem',color:'#5A4A38'}}>{label}</span>
                        <span style={{fontSize:'.78rem',fontWeight:700,color:'#7A1E3A'}}>{avg.toFixed(1)}/5</span>
                      </div>
                      <div className="bar-track"><div className="bar-fill" style={{width:`${(avg/5)*100}%`,background:'#7A1E3A'}}/></div>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="qid-box" style={{marginBottom:16}}>
              <div style={{fontWeight:700,marginBottom:5,fontSize:'.87rem'}}>🔐 {t.trustTitle}</div>
              {(lang==='ar'?[['✅ QID','شخص واحد = تقييم واحد'],['✅ تسجيل','لا تقييم إلا بتسجيل حقيقي'],['✅ AI','كشف التقييمات المزيفة تلقائياً']]:[['✅ QID','One person = one review'],['✅ Enrollment','No review without real enrollment'],['✅ AI','Auto-detects fake reviews']]).map(([k,v])=>(
                <div key={k} style={{fontSize:'.79rem',marginBottom:2}}><span style={{fontWeight:600,color:'#1A7A4A'}}>{k} </span><span style={{color:'#4A3A28'}}>— {v}</span></div>
              ))}
            </div>
            {(school.reviews||[]).length===0
              ? <p style={{color:'#8A7B6A',fontSize:'.85rem'}}>{t.noComments}</p>
              : (school.reviews||[]).map(r=>(
                <div key={r.id} className="review-card" style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10,flexWrap:'wrap',gap:8}}>
                    <div style={{display:'flex',gap:9,alignItems:'center'}}>
                      <div className="avatar" style={{background:'rgba(122,30,58,.1)',color:'#7A1E3A',fontSize:'.8rem',width:36,height:36}}>{(isRTL?r.author:r.authorEn)?.slice(0,2)}</div>
                      <div>
                        <div style={{display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
                          <span style={{fontWeight:700,fontSize:'.87rem'}}>{isRTL?r.author:r.authorEn}</span>
                          {r.role&&<VerifiedBadge role={r.role}/>}
                          {r.pro&&<ProBadge/>}
                        </div>
                        <div style={{fontSize:'.71rem',color:'#8A7B6A',marginTop:2}}>{r.date?.[lang]}</div>
                      </div>
                    </div>
                    <Stars r={r.rating}/>
                  </div>
                  <p style={{fontSize:'.85rem',color:'#4A3A28',lineHeight:1.75,marginBottom:8}}>{r.text?.[lang]}</p>
                  {r.teacher&&<span style={{fontSize:'.75rem',background:'rgba(122,30,58,.07)',color:'#7A1E3A',padding:'2px 9px',borderRadius:10,fontWeight:600}}>👨‍🏫 {r.teacher}</span>}
                  <div className="divider"/>
                  <VoteButtons up={r.up} down={r.down}/>
                </div>
              ))
            }
          </div>
        )}

        {tab==='insight'&&ins&&(
          <div className="fade-up">
            <div className="eyebrow">{t.insight}</div>
            <h2 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:3}}>{t.insightTitle}</h2>
            <p style={{fontSize:'.83rem',color:'#5A4A38',marginBottom:18}}>{t.insightDesc}</p>
            <div className="insight-card" style={{marginBottom:14}}>
              <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#7A1E3A,#C8921A)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18}}>✦</div>
                <div>
                  <div style={{fontWeight:700,marginBottom:5,fontSize:'.9rem'}}>{lang==='ar'?'تحليل المنصة':'Platform Analysis'}</div>
                  <p style={{fontSize:'.83rem',color:'#4A3A28',lineHeight:1.8,margin:0}}>{ins.summary}</p>
                </div>
              </div>
              <div style={{marginTop:12,padding:'9px 12px',background:'rgba(248,244,238,.7)',borderRadius:8,fontSize:'.73rem',color:'#8A7B6A',display:'flex',gap:5}}><span>⚠️</span>{t.aiWarning}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
              <div style={{padding:16,background:'#fff',border:'1px solid rgba(212,197,169,.6)',borderRadius:14}}>
                <div style={{fontSize:'.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:1.2,color:'#8A7B6A',marginBottom:8}}>{t.teacherHighlight}</div>
                <div style={{fontWeight:700,fontSize:'.87rem',marginBottom:2}}>{ins.topTeacher}</div>
                <div style={{fontSize:'.72rem',color:'#8A7B6A',marginBottom:6}}>{ins.topReason}</div>
                <Stars r={ins.topScore}/><span style={{fontSize:'.76rem',fontWeight:700,color:'#C8921A',marginRight:4}}>{ins.topScore}</span>
              </div>
              <div style={{padding:16,background:'#fff',border:'1px solid rgba(212,197,169,.6)',borderRadius:14}}>
                <div style={{fontSize:'.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:1.2,color:'#8A7B6A',marginBottom:8}}>{t.parentVoice}</div>
                <div style={{fontSize:'2.2rem',fontWeight:800,color:'#1A7A4A',lineHeight:1,fontFamily:'DM Sans,sans-serif'}}>{ins.sentiment}%</div>
                <div style={{fontSize:'.75rem',color:'#5A4A38',marginTop:3}}>{lang==='ar'?'يوصون بهذه المدرسة':'Would recommend'}</div>
                <div className="bar-track" style={{marginTop:8}}><div className="bar-fill" style={{width:`${ins.sentiment}%`,background:'#1A7A4A'}}/></div>
              </div>
            </div>
            <div style={{padding:18,background:'#fff',border:'1px solid rgba(212,197,169,.6)',borderRadius:14,marginBottom:14}}>
              <div style={{fontWeight:600,marginBottom:13,fontSize:'.88rem'}}>{lang==='ar'?'مؤشرات الأداء':'Performance Indicators'}</div>
              {ins.trends?.map((tr,i)=>(
                <div key={i} style={{marginBottom:11}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontSize:'.82rem',fontWeight:500}}>{tr.label}</span>
                      <span style={{fontSize:'.7rem',color:tr.up?'#1A7A4A':'#A03030',fontWeight:600,background:tr.up?'rgba(26,122,74,.08)':'rgba(160,48,48,.08)',padding:'1px 7px',borderRadius:10}}>{tr.up?'↑ '+t.trendUp:'↓ '+t.trendDown}</span>
                    </div>
                    <span style={{fontWeight:700,fontSize:'.82rem',color:tr.val>=85?'#1A7A4A':tr.val>=70?'#A07010':'#A03030'}}>{tr.val}%</span>
                  </div>
                  <div className="bar-track"><div className="bar-fill" style={{width:`${tr.val}%`,background:tr.val>=85?'#1A7A4A':tr.val>=70?'#A07010':'#A03030'}}/></div>
                </div>
              ))}
            </div>
            {school.vision&&<div style={{padding:16,background:'#fff',border:'1px solid rgba(212,197,169,.6)',borderRadius:14,marginBottom:14}}><div style={{fontWeight:600,marginBottom:8,fontSize:'.88rem'}}>{lang==='ar'?'رؤية المدرسة':'School Vision'}</div><p style={{fontSize:'.83rem',color:'#4A3A28',lineHeight:1.8}}>{school.vision?.[lang]}</p></div>}
            {school.management?.length>0&&<div style={{padding:16,background:'#fff',border:'1px solid rgba(212,197,169,.6)',borderRadius:14,marginBottom:14}}><div style={{fontWeight:600,marginBottom:12,fontSize:'.88rem'}}>{lang==='ar'?'الإدارة':'Management'}</div>{school.management.map((m,i)=><div key={i} style={{display:'flex',gap:10,alignItems:'center',marginBottom:i<school.management.length-1?10:0}}><div className="avatar" style={{background:'rgba(122,30,58,.08)',color:'#7A1E3A',width:38,height:38,fontSize:'.82rem'}}>{(isRTL?m.nameAr:m.nameEn).slice(0,2)}</div><div><div style={{fontWeight:600,fontSize:'.85rem'}}>{isRTL?m.nameAr:m.nameEn}</div><div style={{fontSize:'.72rem',color:'#8A7B6A'}}>{isRTL?m.roleAr:m.roleEn}</div></div></div>)}</div>}
            {school.services&&<div style={{padding:16,background:'#fff',border:'1px solid rgba(212,197,169,.6)',borderRadius:14}}><div style={{fontWeight:600,marginBottom:12,fontSize:'.88rem'}}>{lang==='ar'?'الخدمات والمرافق':'Services & Facilities'}</div><div style={{display:'flex',flexWrap:'wrap',gap:7}}>{school.services?.[lang]?.map(s=><span key={s} className="badge badge-sand" style={{fontSize:'.78rem'}}>✓ {s}</span>)}</div></div>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ══ HOME PAGE ══ */
function HomePage({ lang, t, isRTL, schools, setPage, setSchool }) {
  const [query,setQuery]=useState('')
  const filtered=query.trim()===''?schools:schools.filter(s=>(s.name?.ar||'').includes(query)||(s.name?.en||'').toLowerCase().includes(query.toLowerCase()))

  useEffect(()=>{
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)'}})},{threshold:0.1})
    document.querySelectorAll('.anim').forEach(el=>obs.observe(el))
    return ()=>obs.disconnect()
  },[])

  return (
    <div>
      {/* HERO */}
      <div style={{background:'linear-gradient(160deg,#fff 0%,#F2EDE4 100%)',borderBottom:'1px solid rgba(212,197,169,.5)',padding:'80px 0 70px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-60,right:-60,width:300,height:300,borderRadius:'50%',background:'rgba(122,30,58,.04)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:-40,left:-40,width:200,height:200,borderRadius:'50%',background:'rgba(160,112,16,.03)',pointerEvents:'none'}}/>
        <div className="container fade-up">
          <div className="eyebrow">{t.tagline}</div>
          <h1 style={{fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:700,lineHeight:1.1,marginBottom:14,maxWidth:580}}>
            {t.hero1}<br/><span style={{color:'#7A1E3A'}}>{t.hero2}</span>
          </h1>
          <p style={{color:'#5A4A38',fontSize:'1rem',lineHeight:1.8,maxWidth:500,marginBottom:28}}>{t.heroSub}</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:32}}>
            <button className="btn btn-primary" style={{padding:'11px 22px',fontSize:'.9rem'}} onClick={()=>{setSchool(schools[0]);setPage('school')}}>{t.viewSchool} →</button>
            <button className="btn btn-outline" style={{padding:'11px 22px',fontSize:'.9rem'}} onClick={()=>setPage('trust')}>{t.howTrust}</button>
          </div>
          <div className="search-wrap" style={{maxWidth:540}}>
            <span className="search-icon">🔍</span>
            <input className="search-input" style={{padding:'13px 16px 13px 46px'}} placeholder={t.searchPH} value={query} onChange={e=>setQuery(e.target.value)}/>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{background:'#fff',borderBottom:'1px solid rgba(212,197,169,.3)',padding:'24px 0'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))'}}>
            {[[schools.length+'+',(lang==='ar'?'مدرسة مسجّلة':'Registered Schools'),'#7A1E3A'],['2,400+',(lang==='ar'?'تقييم موثّق':'Verified Reviews'),'#1A7A4A'],['98%',(lang==='ar'?'دقة البيانات':'Data Accuracy'),'#A07010'],['QID',(lang==='ar'?'تحقق موثوق':'Trusted Verification'),'#1A5AA0']].map(([v,l,c])=>(
              <div key={l} style={{padding:'16px 12px',textAlign:'center',borderLeft:'1px solid rgba(212,197,169,.3)'}}>
                <div style={{fontSize:'1.6rem',fontWeight:800,color:c,fontFamily:'DM Sans,sans-serif',lineHeight:1}}>{v}</div>
                <div style={{fontSize:'.72rem',color:'#8A7B6A',marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST */}
      <div style={{padding:'70px 0',borderBottom:'1px solid rgba(212,197,169,.3)'}}>
        <div className="container anim" style={{opacity:0,transform:'translateY(24px)',transition:'all .6s cubic-bezier(.16,1,.3,1)'}}>
          <div className="eyebrow" style={{marginBottom:4}}>{t.trustPage}</div>
          <h2 style={{fontSize:'1.6rem',fontWeight:700,marginBottom:8}}>{t.trustTitle}</h2>
          <p style={{fontSize:'.9rem',color:'#5A4A38',marginBottom:28,maxWidth:500}}>{t.trustSub}</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
            {(lang==='ar'?[['🪪','ربط بـ QID','هوية حقيقية واحدة = تقييم واحد'],['📋','تحقق من التسجيل','لا تقييم بدون تسجيل فعلي'],['🤖','كشف الـ AI','يرصد التقييمات المزيفة ويحذفها'],['📊','بيانات وزارية','رسوم رسمية من الوزارة مباشرةً']]:[['🪪','QID Binding','One real ID = one lifetime review'],['📋','Enrollment Check','No review without real enrollment'],['🤖','AI Detection','Automatically detects fake reviews'],['📊','Ministry Data','Official fees directly from Ministry']]).map(([ic,title,desc])=>(
              <div key={title} className="card" style={{padding:18,display:'flex',gap:12}}>
                <span style={{fontSize:22,flexShrink:0}}>{ic}</span>
                <div><div style={{fontWeight:700,marginBottom:4,fontSize:'.88rem'}}>{title}</div><p style={{fontSize:'.78rem',color:'#4A3A28',lineHeight:1.7,margin:0}}>{desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCHOOLS */}
      <div style={{padding:'70px 0 80px'}}>
        <div className="container">
          <div className="anim" style={{opacity:0,transform:'translateY(24px)',transition:'all .6s cubic-bezier(.16,1,.3,1)',marginBottom:24}}>
            <div className="eyebrow">{isRTL?'المدارس المسجّلة':'Registered Schools'}</div>
            <h2 style={{fontSize:'1.5rem',fontWeight:700}}>{isRTL?`${filtered.length} مدرسة`:`${filtered.length} Schools`}</h2>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {filtered.map((s,idx)=>{
              const lat=s.academic?.at?.(-1)||{}
              return (
                <div key={s.id} className="card anim" style={{display:'flex',overflow:'hidden',cursor:'pointer',opacity:0,transform:'translateY(24px)',transition:`all .6s cubic-bezier(.16,1,.3,1) ${idx*0.07}s`}} onClick={()=>{setSchool(s);setPage('school')}}>
                  <div style={{width:200,flexShrink:0}} className="hide-sm">
                    <img src={s.photos?.hero} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                  <div style={{padding:20,flex:1}}>
                    <div style={{display:'flex',gap:5,marginBottom:8,flexWrap:'wrap',alignItems:'center'}}>
                      <span className="badge badge-maroon">{s.curriculum?.[lang]}</span>
                      <span className="badge badge-green" style={{display:'inline-flex',alignItems:'center',gap:3}}>
                        <svg width="10" height="10" viewBox="0 0 16 16"><path d="M8 1.2L9.4 0.6L10.5 1.7L12 1.5L12.7 2.8L14 3.2L14.1 4.6L15.2 5.5L14.9 6.9L15.6 8L14.9 9.1L15.2 10.5L14.1 11.4L14 12.8L12.7 13.2L12 14.5L10.5 14.3L9.4 15.4L8 14.8L6.6 15.4L5.5 14.3L4 14.5L3.3 13.2L2 12.8L1.9 11.4L0.8 10.5L1.1 9.1L0.4 8L1.1 6.9L0.8 5.5L1.9 4.6L2 3.2L3.3 2.8L4 1.5L5.5 1.7L6.6 0.6Z" fill="#1A7A4A"/><path d="M4.5 8.5L6.8 10.8L11.5 5.5" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                        {t.verified}
                      </span>
                    </div>
                    <h3 style={{fontWeight:700,fontSize:'1rem',marginBottom:3}}>{s.name?.[lang]}</h3>
                    <p style={{fontSize:'.76rem',color:'#8A7B6A',marginBottom:8}}>📍 {s.area?.[lang]} · {t.founded} {s.founded} · {s.students?.toLocaleString()}</p>
                    <p style={{fontSize:'.82rem',color:'#5A4A38',lineHeight:1.7,marginBottom:12}}>{s.description?.[lang]?.slice(0,120)}...</p>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
                      <div style={{display:'flex',gap:12,fontSize:'.76rem',color:'#8A7B6A'}}>
                        <span>👨‍🏫 {s.teachers?.length||0}</span>
                        <span>🎓 {s.grades?.length||0}</span>
                        <span>📄 {s.pdfs?.length||0} PDFs</span>
                      </div>
                      <div style={{display:'flex',gap:9,alignItems:'center'}}>
                        <MatchRing score={s.match||80}/>
                        {lat.igcse&&<div style={{textAlign:'center',background:'linear-gradient(135deg,#6B1830,#9B2548)',color:'#FAF7F2',borderRadius:9,padding:'6px 12px'}}><div style={{fontSize:'1.1rem',fontWeight:700,lineHeight:1,fontFamily:'DM Sans,sans-serif'}}>{lat.igcse}%</div><div style={{fontSize:'.6rem',opacity:.8,marginTop:1}}>IGCSE A</div></div>}
                        <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();setSchool(s);setPage('school')}}>{t.viewSchool} →</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══ TRUST PAGE ══ */
function TrustPageView({ lang, t, setPage }) {
  return (
    <div className="container" style={{padding:'40px 18px'}}>
      <button className="btn btn-ghost btn-sm" style={{marginBottom:16}} onClick={()=>setPage('landing')}>{t.back}</button>
      <div className="eyebrow" style={{marginBottom:4}}>{t.trustPage}</div>
      <h1 style={{fontSize:'1.45rem',fontWeight:700,marginBottom:16}}>{lang==='ar'?'لماذا لا يمكن التلاعب بتقييماتنا؟':"Why our ratings can't be manipulated?"}</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:12,marginBottom:28}}>
        {(lang==='ar'?[['🪪','ربط بـ QID','كل حساب مربوط بهوية قطرية حقيقية.'],['📋','تحقق من التسجيل','لا تقييم إلا إذا كان الطالب مسجّلاً فعلاً.'],['🤖','كشف الـ AI','يرصد التقييمات المنسّقة ويحذفها.'],['📊','بيانات وزارية','الرسوم مستخرجة من قرارات الوزارة.']]:[['🪪','QID Binding','Every account linked to a real Qatari ID.'],['📋','Enrollment Check','You can only review if enrolled.'],['🤖','AI Detection','Detects and removes fake reviews.'],['📊','Ministry Data','Fees extracted from official decrees.']]).map(([ic,title,desc])=>(
          <div key={title} className="card" style={{padding:18,display:'flex',gap:12}}>
            <span style={{fontSize:22,flexShrink:0}}>{ic}</span>
            <div><div style={{fontWeight:700,marginBottom:4}}>{title}</div><p style={{fontSize:'.8rem',color:'#4A3A28',lineHeight:1.7,margin:0}}>{desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{padding:20,background:'#fff',border:'1px solid rgba(212,197,169,.6)',borderRadius:14}}>
        <div style={{fontWeight:700,marginBottom:16,fontSize:'.92rem'}}>{t.badgeGuide}</div>
        {[['parent','#1A7A4A',t.badgeParent],['student','#1A5AA0',t.badgeStudent],['employee','#C8921A',t.badgeEmployee]].map(([role,color,label])=>(
          <div key={role} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'rgba(248,244,238,.6)',borderRadius:10,marginBottom:8}}>
            <VerifiedBadge role={role} size={22}/>
            <span style={{fontSize:'.85rem',color,fontWeight:600}}>{label}</span>
          </div>
        ))}
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'rgba(248,244,238,.6)',borderRadius:10}}>
          <ProBadge size={22}/>
          <span style={{fontSize:'.85rem',color:'#7A1E3A',fontWeight:600}}>{t.badgePro}</span>
        </div>
      </div>
    </div>
  )
}

/* ══ MAIN APP ══ */
export default function App() {
  const [lang,setLang]=useState('ar'), [page,setPage]=useState('landing')
  const [school,setSchool]=useState(null), [user,setUser]=useState(null), [profile,setProfile]=useState(null)
  const [dbSchools,setDbSchools]=useState([]), [showQID,setShowQID]=useState(false)
  const [showPro,setShowPro]=useState(false), [modal,setModal]=useState(false)

  useEffect(()=>{ document.body.className=lang==='ar'?'rtl':'ltr'; window.scrollTo({top:0,behavior:'smooth'}) },[page,lang])

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session){ setUser(session.user); supabase.from('profiles').select('*').eq('id',session.user.id).single().then(({data})=>setProfile(data)) }
    })
    supabase.from('schools').select('*').then(({data})=>{ if(data?.length) setDbSchools(data) })
  },[])

  const handleAuth=(u,p)=>{ setUser(u); setProfile(p); setPage('landing') }
  const handleLogout=async()=>{ await supabase.auth.signOut(); setUser(null); setProfile(null); setPage('landing') }

  const t=T[lang], isRTL=lang==='ar'

  const allSchools=[...SAMPLE_SCHOOLS,...dbSchools.map(s=>({
    id:s.id,name:{ar:s.name_ar,en:s.name_en},area:{ar:s.area_ar,en:s.area_en},
    curriculum:{ar:s.curriculum_ar,en:s.curriculum_en},founded:s.founded,students:s.students_count,match:80,
    description:{ar:s.description_ar||'',en:s.description_en||''},vision:{ar:'',en:''},management:[],services:{ar:[],en:[]},
    photos:{hero:s.hero_url||'https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80'},
    grades:[],teachers:[],academic:[],pdfs:[],fees:[],reviews:[],
    insight:{ar:{summary:'',topTeacher:'',topScore:0,topReason:'',sentiment:0,trends:[]},en:{summary:'',topTeacher:'',topScore:0,topReason:'',sentiment:0,trends:[]}}
  }))]

  if(user&&profile?.role==='school'){
    return (
      <>
        <style>{CSS}</style>
        <SchoolDashboard profile={profile} userId={user.id} onLogout={handleLogout}/>
        {showQID&&<QIDModal userId={user.id} onVerified={()=>setProfile(p=>({...p,qid_verified:true}))} onClose={()=>setShowQID(false)}/>}
        {showPro&&<ProModal userId={user.id} onUpgraded={()=>setProfile(p=>({...p,is_pro:true}))} onClose={()=>setShowPro(false)}/>}
      </>
    )
  }

  return (
    <div className="app">
      <style>{CSS}</style>
      <nav className="nav">
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',gap:8}}>
          <div onClick={()=>setPage('landing')} style={{cursor:'pointer'}}>
            <Logo size={38} showText={true} lang={lang}/>
          </div>
          <div style={{display:'flex',gap:1}}>
            <button className={`nav-link ${page==='home'?'active':''}`} onClick={()=>setPage('landing')}>{t.schools}</button>
            <button className={`nav-link ${page==='trust'?'active':''}`} onClick={()=>setPage('trust')}>{t.trustPage}</button>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {user?(
              <>
                {!profile?.is_pro&&<button className="btn btn-gold btn-sm" onClick={()=>setShowPro(true)}>⭐ Pro</button>}
                {profile?.is_pro&&<span className="badge badge-maroon">⭐ Pro</span>}
                {!profile?.qid_verified&&<button className="btn btn-ghost btn-sm" onClick={()=>setShowQID(true)}>🔐 QID</button>}
                <button className="btn btn-ghost btn-sm" onClick={()=>setPage('profile')}>👤 {t.profile}</button>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>{t.logout}</button>
              </>
            ):(
              <button className="btn btn-primary btn-sm" onClick={()=>setPage('auth')}>{t.login} →</button>
            )}
            <div className="lang-toggle">
              <button className={`lang-opt ${lang==='ar'?'active':''}`} onClick={()=>setLang('ar')}>عربي</button>
              <button className={`lang-opt ${lang==='en'?'active':''}`} onClick={()=>setLang('en')}>EN</button>
            </div>
          </div>
        </div>
      </nav>

      {page==='landing'&&<LandingPage lang={lang} setPage={setPage} setSchool={setSchool}/>}
      {page==='auth'&&<AuthPage onAuth={handleAuth}/>}
      {page==='home'&&<HomePage lang={lang} t={t} isRTL={isRTL} schools={allSchools} setPage={setPage} setSchool={setSchool}/>}
      {page==='school'&&school&&(
        <>
          <SchoolPageView school={school} lang={lang} t={t} isRTL={isRTL} setPage={setPage} userId={user?.id} onReview={()=>setModal(true)}/>
          {modal&&<ReviewModal school={school} lang={lang} userId={user?.id} onClose={()=>setModal(false)}/>}
        </>
      )}
      {page==='trust'&&<TrustPageView lang={lang} t={t} setPage={setPage}/>}
      {page==='profile'&&user&&<ProfilePage user={user} profile={profile} lang={lang} setPage={setPage} onLogout={handleLogout}/>}
      {showQID&&user&&<QIDModal userId={user.id} onVerified={()=>setProfile(p=>({...p,qid_verified:true}))} onClose={()=>setShowQID(false)}/>}
      {showPro&&user&&<ProModal userId={user.id} onUpgraded={()=>setProfile(p=>({...p,is_pro:true}))} onClose={()=>setShowPro(false)}/>}

      <footer style={{background:'#F2EDE4',borderTop:'1px solid rgba(212,197,169,.5)',padding:'24px 0',marginTop:40}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
          <Logo size={28} showText={true} lang={lang}/>
          <span style={{fontSize:'.73rem',color:'#8A7B6A'}}>© 2025 — {lang==='ar'?'منصة قطر التعليمية':'Qatar Education Platform'}</span>
        </div>
      </footer>
    </div>
  )
}

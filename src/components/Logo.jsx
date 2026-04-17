export default function Logo({ size = 40, showText = true, lang = 'ar' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.22, cursor: 'pointer' }}>
      <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`lbg${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B02050"/>
            <stop offset="50%" stopColor="#8C1A38"/>
            <stop offset="100%" stopColor="#4A0D1E"/>
          </linearGradient>
          <linearGradient id={`lshine${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
          <clipPath id={`lclip${size}`}>
            <rect x="0" y="0" width="200" height="200" rx="46" ry="46"/>
          </clipPath>
        </defs>
        <rect x="0" y="0" width="200" height="200" rx="46" fill={`url(#lbg${size})`}/>
        <g clipPath={`url(#lclip${size})`} opacity="0.11">
          <rect x="0" y="0" width="62" height="200" fill="white"/>
          <polygon points="62,0 82,11 62,22 82,33 62,44 82,55 62,66 82,77 62,88 82,99 62,110 82,121 62,132 82,143 62,154 82,165 62,176 82,187 62,200 200,200 200,0" fill="#8C1A38"/>
        </g>
        <rect x="0" y="0" width="200" height="200" rx="46" fill={`url(#lshine${size})`}/>
        <path d="M100 58 C80 55 48 61 38 69 L36 142 C46 137 78 132 100 135 Z" fill="white" opacity="0.93"/>
        <path d="M100 58 C120 55 152 61 162 69 L164 142 C154 137 122 132 100 135 Z" fill="white" opacity="0.82"/>
        <rect x="98" y="58" width="5" height="78" rx="2.5" fill="white" opacity="0.97"/>
        {[85,97,109,121].map((y,i) => (
          <line key={i} x1="52" y1={y} x2="90" y2={y-3} stroke="rgba(139,26,56,0.3)" strokeWidth="2" strokeLinecap="round" opacity={0.9-i*0.15}/>
        ))}
        {[82,94,106,118].map((y,i) => (
          <line key={i} x1="111" y1={y} x2="149" y2={y+3} stroke="rgba(139,26,56,0.3)" strokeWidth="2" strokeLinecap="round" opacity={0.9-i*0.15}/>
        ))}
        <ellipse cx="100" cy="148" rx="64" ry="7" fill="rgba(0,0,0,0.15)"/>
        <polygon points="100,26 104,39 117,39 107,47 111,60 100,52 89,60 93,47 83,39 96,39" fill="rgba(255,210,80,0.95)"/>
        <path d="M100 155 L88 161 L88 173 C88 180 94 185 100 187 C106 185 112 180 112 173 L112 161 Z" fill="white" opacity="0.93"/>
        <path d="M93 171 L98 176 L108 164" fill="none" stroke="#7A1E3A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="0" y="0" width="200" height="200" rx="46" fill="none" stroke="rgba(255,180,200,0.18)" strokeWidth="1.5"/>
      </svg>

      {showText && (
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", fontSize: size * 0.46, lineHeight: 1.1 }}>
            {lang === 'ar' ? (
              <>
                <span style={{ fontWeight: 300, color: '#3A0A18' }}>Qatar</span>
                <span style={{ fontWeight: 700, color: '#6B1830' }}>Edu</span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 700, color: '#6B1830' }}>Edu</span>
                <span style={{ fontWeight: 300, color: '#3A0A18' }}>Qatar</span>
              </>
            )}
          </div>
          {size >= 36 && (
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: size * 0.18, fontWeight: 400, letterSpacing: '2px', color: '#8A5060', textTransform: 'uppercase', marginTop: 3 }}>
              {lang === 'ar' ? 'منصة تعليمية' : 'Education Platform'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

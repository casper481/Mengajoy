/** Latar laut biru kehijauan dengan ombak kecil yang bergerak pelan. */
export default function Laut({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #5fd3e6 0%, #3cc0dc 35%, #2aaad3 70%, #1f97c6 100%)' }} />
      <svg className="ombak absolute left-0 top-0 h-full" style={{ width: 'calc(100% + 80px)' }} aria-hidden>
        <defs>
          <pattern id="pola-ombak" width="80" height="64" patternUnits="userSpaceOnUse">
            <path d="M6 18 q8 -7 16 0 q8 7 16 0" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M46 50 q6 -5 12 0 q6 5 12 0" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" fill="none" strokeLinecap="round" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pola-ombak)" />
      </svg>
      {/* pantulan cahaya */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 10%, rgba(255,255,255,0.35), transparent 55%)' }} />
    </div>
  )
}

/**
 * Momo — hewan pendamping ciptaan sendiri (makhluk bulat lembut bertelinga bulat).
 * Tumbuh dalam 5 tahap: telur → menetas → kecil → remaja → bersayap.
 */
export default function Peliharaan({ tahap, ukuran = 120, senang = false, className = '' }: { tahap: number; ukuran?: number; senang?: boolean; className?: string }) {
  const garis = '#6b4a3a'
  const badan = '#ffd3b0'
  const perut = '#fff3e6'
  if (tahap === 0) {
    return (
      <svg viewBox="0 0 120 120" width={ukuran} height={ukuran} className={className} role="img" aria-label="Telur ajaib">
        <ellipse cx="60" cy="110" rx="30" ry="6" fill="#000" opacity="0.12" />
        <g className="goyang-pelan">
          <path d="M60 14 Q92 16 94 66 Q94 106 60 106 Q26 106 26 66 Q28 16 60 14 Z" fill="#e8f1ff" stroke="#9bb6e6" strokeWidth="3" />
          <path d="M40 60 L48 52 L56 62 L64 50 L72 62 L80 54" stroke="#ffb3c7" strokeWidth="4" fill="none" strokeLinejoin="round" />
          <path d="M50 30 l2 5 l5 1 l-4 3 l1 5 l-4 -3 l-4 3 l1 -5 l-4 -3 l5 -1 z" fill="#ffd166" />
          <circle cx="74" cy="82" r="4" fill="#c8b6ff" />
          <circle cx="44" cy="84" r="3" fill="#7fd6ff" />
          <ellipse cx="46" cy="36" rx="7" ry="12" fill="#fff" opacity="0.6" transform="rotate(-20 46 36)" />
        </g>
      </svg>
    )
  }
  const s = tahap === 1 ? 0.75 : tahap === 2 ? 0.88 : 1
  return (
    <svg viewBox="0 0 160 140" width={ukuran} height={(ukuran * 140) / 160} className={className} role="img" aria-label="Momo">
      <ellipse cx="80" cy="132" rx={40 * s} ry="6" fill="#000" opacity="0.12" />
      {tahap === 4 && (
        <>
          <circle cx="80" cy="74" r="62" fill="#fff3b0" opacity="0.45" />
          <g fill="#c8b6ff" stroke={garis} strokeWidth="3">
            <path d="M44 72 Q8 40 14 84 Q22 100 48 92 Z" />
            <path d="M116 72 Q152 40 146 84 Q138 100 112 92 Z" />
          </g>
          <path d="M22 70 Q30 76 26 86 M138 70 Q130 76 134 86" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
        </>
      )}
      <g transform={`translate(80 130) scale(${s}) translate(-80 -130)`}>
        {/* ekor */}
        <circle cx="122" cy="108" r="10" fill={badan} stroke={garis} strokeWidth="3" />
        {/* telinga */}
        <circle cx="50" cy="44" r="14" fill={badan} stroke={garis} strokeWidth="3" />
        <circle cx="110" cy="44" r="14" fill={badan} stroke={garis} strokeWidth="3" />
        <circle cx="50" cy="44" r="7" fill="#ffb3c7" />
        <circle cx="110" cy="44" r="7" fill="#ffb3c7" />
        {/* badan */}
        <ellipse cx="80" cy="86" rx="48" ry="44" fill={badan} stroke={garis} strokeWidth="3" />
        <ellipse cx="80" cy="100" rx="28" ry="24" fill={perut} />
        {/* kaki */}
        <ellipse cx="60" cy="126" rx="12" ry="7" fill={badan} stroke={garis} strokeWidth="3" />
        <ellipse cx="100" cy="126" rx="12" ry="7" fill={badan} stroke={garis} strokeWidth="3" />
        {/* tanda bintang di dahi (remaja & bersayap) */}
        {tahap >= 3 && <path d="M80 50 l3 6 l6.5 1 l-5 4.5 l1.3 6.5 l-5.8 -3.2 l-5.8 3.2 l1.3 -6.5 l-5 -4.5 l6.5 -1 z" fill="#ffd166" stroke="#e0a400" strokeWidth="1.5" />}
        {/* wajah */}
        {senang ? (
          <g stroke={garis} strokeWidth="4" fill="none" strokeLinecap="round">
            <path d="M58 80 Q64 72 70 80" />
            <path d="M90 80 Q96 72 102 80" />
          </g>
        ) : (
          <g>
            <circle cx="64" cy="80" r="7" fill={garis} />
            <circle cx="96" cy="80" r="7" fill={garis} />
            <circle cx="66" cy="77" r="2.5" fill="#fff" />
            <circle cx="98" cy="77" r="2.5" fill="#fff" />
          </g>
        )}
        <circle cx="54" cy="92" r="6" fill="#ff9aa8" opacity="0.6" />
        <circle cx="106" cy="92" r="6" fill="#ff9aa8" opacity="0.6" />
        <path d="M74 92 Q80 98 86 92" stroke={garis} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* cangkang telur (baru menetas) */}
      {tahap === 1 && (
        <g>
          <path d="M40 106 L48 98 L56 108 L64 98 L72 108 L80 98 L88 108 L96 98 L104 108 L112 98 L120 106 Q118 132 80 132 Q42 132 40 106 Z" fill="#e8f1ff" stroke="#9bb6e6" strokeWidth="3" />
          <circle cx="62" cy="120" r="3" fill="#ffb3c7" />
          <circle cx="98" cy="118" r="3" fill="#7fd6ff" />
        </g>
      )}
    </svg>
  )
}

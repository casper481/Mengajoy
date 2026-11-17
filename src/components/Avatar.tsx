/** Karakter anak (chibi), digambar dengan SVG. Bisa memakai peci atau hijab. */
import { AVATAR, type DataAvatar } from '../data/dunia'

export default function Avatar({ a, ukuran = 120, hanyaKepala = false, className = '' }: { a: DataAvatar; ukuran?: number; hanyaKepala?: boolean; className?: string }) {
  const kulit = AVATAR.kulit[a.kulit]
  const rambut = AVATAR.warnaRambut[a.warnaRambut]
  const kepalaW = AVATAR.warnaKepala[a.warnaKepala]
  const baju = AVATAR.baju[a.baju]
  const garis = '#3b2f2f'
  const vb = hanyaKepala ? '20 0 120 120' : '0 0 160 220'
  return (
    <svg viewBox={vb} width={ukuran} height={hanyaKepala ? ukuran : (ukuran * 220) / 160} className={className} role="img" aria-label="Karakterku">
      {!hanyaKepala && (
        <g>
          <ellipse cx="80" cy="212" rx="40" ry="7" fill="#000" opacity="0.12" />
          {/* kaki */}
          <rect x="60" y="176" width="15" height="30" rx="7" fill="#3d5a80" />
          <rect x="85" y="176" width="15" height="30" rx="7" fill="#3d5a80" />
          <ellipse cx="66" cy="206" rx="11" ry="6" fill="#2b2b3a" />
          <ellipse cx="94" cy="206" rx="11" ry="6" fill="#2b2b3a" />
          {/* badan/baju */}
          <path d="M48 128 Q80 116 112 128 L118 184 Q80 194 42 184 Z" fill={baju} stroke={garis} strokeWidth="3" strokeLinejoin="round" />
          <path d="M80 124 L80 186" stroke="#000" strokeOpacity="0.12" strokeWidth="3" />
          <circle cx="80" cy="146" r="2.5" fill="#fff" opacity="0.8" />
          <circle cx="80" cy="160" r="2.5" fill="#fff" opacity="0.8" />
          {/* tangan */}
          <path d="M50 132 Q34 150 38 170" stroke={baju} strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M110 132 Q128 146 124 168" stroke={baju} strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="38" cy="172" r="8" fill={kulit} stroke={garis} strokeWidth="2.5" />
          <circle cx="124" cy="170" r="8" fill={kulit} stroke={garis} strokeWidth="2.5" />
        </g>
      )}

      {/* hijab bagian belakang / bawah (menutup leher) */}
      {a.kepala === 'hijab' && <path d="M34 70 Q30 120 50 136 Q80 150 110 136 Q130 120 126 70 Z" fill={kepalaW} stroke={garis} strokeWidth="3" />}

      {/* rambut belakang */}
      {a.kepala !== 'hijab' && a.rambut === 'kuncir' && (
        <g fill={rambut} stroke={garis} strokeWidth="3">
          <ellipse cx="34" cy="78" rx="12" ry="20" />
          <ellipse cx="126" cy="78" rx="12" ry="20" />
        </g>
      )}

      {/* kepala */}
      <circle cx="80" cy="66" r="44" fill={kulit} stroke={garis} strokeWidth="3" />
      {a.kepala !== 'hijab' && (
        <>
          <circle cx="36" cy="70" r="8" fill={kulit} stroke={garis} strokeWidth="3" />
          <circle cx="124" cy="70" r="8" fill={kulit} stroke={garis} strokeWidth="3" />
        </>
      )}

      {/* rambut depan */}
      {a.kepala !== 'hijab' && (
        <g fill={rambut} stroke={garis} strokeWidth="3" strokeLinejoin="round">
          {a.rambut === 'pendek' && <path d="M36 62 Q36 20 80 20 Q124 20 124 62 Q112 44 92 42 Q70 52 50 46 Q40 52 36 62 Z" />}
          {a.rambut === 'poni' && <path d="M36 66 Q34 20 80 20 Q126 20 124 66 Q118 50 112 48 L104 56 L96 46 L86 56 L76 46 L66 56 L56 46 L48 56 Q42 54 36 66 Z" />}
          {a.rambut === 'kuncir' && <path d="M38 62 Q38 20 80 22 Q122 20 122 62 Q104 40 80 46 Q56 40 38 62 Z" />}
          {a.rambut === 'keriting' && (
            <path d="M34 64 Q26 46 40 38 Q38 22 56 24 Q64 12 80 18 Q96 12 104 24 Q122 22 120 38 Q134 46 126 64 Q118 50 106 52 Q96 42 80 48 Q64 42 54 52 Q42 50 34 64 Z" />
          )}
        </g>
      )}
      {a.kepala === 'hijab' && (
        <path d="M34 72 Q30 18 80 18 Q130 18 126 72 Q122 52 112 44 Q80 34 48 44 Q38 52 34 72 Z" fill={kepalaW} stroke={garis} strokeWidth="3" />
      )}
      {a.kepala === 'peci' && (
        <g>
          <path d="M44 40 Q44 16 80 14 Q116 16 116 40 Q80 32 44 40 Z" fill={kepalaW} stroke={garis} strokeWidth="3" />
          <path d="M46 34 Q80 28 114 34" stroke="#000" strokeOpacity="0.15" strokeWidth="3" fill="none" />
        </g>
      )}

      {/* wajah */}
      <ellipse cx="64" cy="74" rx="5.5" ry="7" fill={garis} />
      <ellipse cx="96" cy="74" rx="5.5" ry="7" fill={garis} />
      <circle cx="66" cy="71" r="2" fill="#fff" />
      <circle cx="98" cy="71" r="2" fill="#fff" />
      <circle cx="54" cy="88" r="7" fill="#ff9aa8" opacity="0.55" />
      <circle cx="106" cy="88" r="7" fill="#ff9aa8" opacity="0.55" />
      <path d="M70 92 Q80 102 90 92" stroke={garis} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

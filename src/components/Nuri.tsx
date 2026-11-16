/**
 * Nuri — burung kecil pemandu, digambar sendiri dengan SVG sederhana.
 * Bisa memakai aksesoris (topi, syal, kacamata, dll.) dan punya beberapa ekspresi.
 */
import type { Slot } from '../data/hadiah'

export type Ekspresi = 'biasa' | 'senang' | 'sorak' | 'mikir'

type Props = {
  ukuran?: number
  ekspresi?: Ekspresi
  dipakai?: Partial<Record<Slot, string>>
  className?: string
}

const BIRU = '#5cc8f0'
const BIRU_TUA = '#3aa9d6'
const PERUT = '#fff4dc'
const PARUH = '#ff9f43'

export default function Nuri({ ukuran = 160, ekspresi = 'biasa', dipakai = {}, className = '' }: Props) {
  const sayapNaik = ekspresi === 'sorak'
  const mataSenang = ekspresi === 'senang' || ekspresi === 'sorak'
  return (
    <svg viewBox="0 0 200 200" width={ukuran} height={ukuran} className={className} role="img" aria-label="Nuri si burung kecil">
      {/* Ransel (di belakang badan) */}
      {dipakai.punggung === 'ransel' && (
        <g>
          <rect x="132" y="96" width="44" height="58" rx="12" fill="#ff7a59" />
          <rect x="140" y="116" width="28" height="18" rx="6" fill="#ffb199" />
        </g>
      )}
      {dipakai.punggung === 'tas-buku' && (
        <g>
          <rect x="130" y="92" width="48" height="62" rx="10" fill="#5cc96b" />
          <rect x="138" y="84" width="16" height="30" rx="2" fill="#ffd166" transform="rotate(-8 146 99)" />
          <rect x="154" y="86" width="14" height="28" rx="2" fill="#ef476f" transform="rotate(6 161 100)" />
          <rect x="136" y="122" width="36" height="14" rx="5" fill="#3fae4f" />
        </g>
      )}

      {/* Kaki */}
      <g stroke={PARUH} strokeWidth="6" strokeLinecap="round">
        <path d="M86 168 L82 186 M82 186 L74 190 M82 186 L88 191" fill="none" />
        <path d="M114 168 L118 186 M118 186 L112 191 M118 186 L126 190" fill="none" />
      </g>

      {/* Sayap */}
      <g fill={BIRU_TUA}>
        <ellipse
          cx="44" cy="122" rx="16" ry="30"
          transform={sayapNaik ? 'rotate(50 52 110)' : 'rotate(18 44 122)'}
        />
        <ellipse
          cx="156" cy="122" rx="16" ry="30"
          transform={sayapNaik ? 'rotate(-50 148 110)' : 'rotate(-18 156 122)'}
        />
      </g>

      {/* Badan */}
      <ellipse cx="100" cy="115" rx="62" ry="60" fill={BIRU} />
      <ellipse cx="100" cy="136" rx="40" ry="34" fill={PERUT} />

      {/* Jambul (disembunyikan kalau pakai topi) */}
      {!dipakai.kepala && (
        <g fill={BIRU_TUA}>
          <ellipse cx="92" cy="56" rx="6" ry="14" transform="rotate(-20 92 56)" />
          <ellipse cx="104" cy="52" rx="6" ry="15" transform="rotate(10 104 52)" />
        </g>
      )}

      {/* Pipi */}
      <circle cx="62" cy="116" r="9" fill="#ffb3c1" opacity="0.8" />
      <circle cx="138" cy="116" r="9" fill="#ffb3c1" opacity="0.8" />

      {/* Mata */}
      {mataSenang ? (
        <g stroke="#2b2b3a" strokeWidth="6" strokeLinecap="round" fill="none">
          <path d="M66 98 Q78 84 90 98" />
          <path d="M110 98 Q122 84 134 98" />
        </g>
      ) : (
        <g>
          <circle cx="78" cy="96" r="15" fill="#fff" />
          <circle cx="122" cy="96" r="15" fill="#fff" />
          <circle cx={ekspresi === 'mikir' ? 82 : 80} cy={ekspresi === 'mikir' ? 91 : 98} r="8" fill="#2b2b3a" />
          <circle cx={ekspresi === 'mikir' ? 126 : 124} cy={ekspresi === 'mikir' ? 91 : 98} r="8" fill="#2b2b3a" />
          <circle cx="83" cy="94" r="2.6" fill="#fff" />
          <circle cx="127" cy="94" r="2.6" fill="#fff" />
        </g>
      )}

      {/* Paruh */}
      {ekspresi === 'sorak' ? (
        <g>
          <path d="M88 110 L112 110 L100 120 Z" fill={PARUH} />
          <path d="M90 121 L110 121 L100 132 Z" fill="#e8822a" />
        </g>
      ) : (
        <path d="M88 110 L112 110 L100 126 Z" fill={PARUH} />
      )}

      {/* ===== Aksesoris ===== */}
      <Kepala id={dipakai.kepala} />
      <Mata id={dipakai.mata} />
      <Leher id={dipakai.leher} />
      {dipakai.punggung && (
        <path d="M140 102 Q120 130 128 160" stroke={dipakai.punggung === 'ransel' ? '#d9573a' : '#3fae4f'} strokeWidth="6" fill="none" strokeLinecap="round" />
      )}
      {dipakai.dada === 'medali' && (
        <g>
          <path d="M70 128 L76 146 L82 128" stroke="#4cb8e8" strokeWidth="5" fill="none" />
          <circle cx="76" cy="152" r="11" fill="#ffc93c" stroke="#e0a400" strokeWidth="3" />
          <text x="76" y="157" textAnchor="middle" fontSize="13" fontWeight="800" fill="#b07800">1</text>
        </g>
      )}
      {dipakai.dada === 'lencana' && (
        <g>
          <circle cx="76" cy="150" r="12" fill="#ffc93c" stroke="#e0a400" strokeWidth="3" />
          <path d="M76 142 L78.5 147.5 L84 148 L80 152 L81 157.5 L76 154.5 L71 157.5 L72 152 L68 148 L73.5 147.5 Z" fill="#fff" />
        </g>
      )}
    </svg>
  )
}

function Kepala({ id }: { id?: string }) {
  switch (id) {
    case 'peci':
      return (
        <g>
          <path d="M66 66 Q66 40 100 40 Q134 40 134 66 Z" fill="#2f4a8a" />
          <rect x="64" y="60" width="72" height="10" rx="4" fill="#24396b" />
        </g>
      )
    case 'topi-petualang':
      return (
        <g>
          <ellipse cx="100" cy="64" rx="56" ry="10" fill="#b8925a" />
          <path d="M70 64 Q70 32 100 32 Q130 32 130 64 Z" fill="#d6b07a" />
          <rect x="70" y="54" width="60" height="8" fill="#7a5a32" />
        </g>
      )
    case 'mahkota-bunga':
      return (
        <g>
          {[64, 82, 100, 118, 136].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy={i % 2 ? 56 : 60} r="10" fill={['#ff8fab', '#ffd166', '#c8b6ff', '#ffd166', '#ff8fab'][i]} />
              <circle cx={x} cy={i % 2 ? 56 : 60} r="4" fill="#fff" />
            </g>
          ))}
          <path d="M58 64 Q100 52 142 64" stroke="#5cc96b" strokeWidth="4" fill="none" />
        </g>
      )
    case 'topi-bintang':
      return (
        <g>
          <path d="M76 64 L100 8 L124 64 Z" fill="#9b8cf2" />
          <circle cx="100" cy="8" r="7" fill="#ffc93c" />
          <path d="M100 30 L103 37 L110 37.5 L105 42 L106.5 49 L100 45.5 L93.5 49 L95 42 L90 37.5 L97 37 Z" fill="#ffc93c" />
          <rect x="72" y="58" width="56" height="9" rx="4" fill="#7b6be0" />
        </g>
      )
    case 'mahkota-emas':
      return (
        <g>
          <path d="M68 66 L72 34 L86 50 L100 28 L114 50 L128 34 L132 66 Z" fill="#ffc93c" stroke="#e0a400" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="100" cy="52" r="5" fill="#ef476f" />
          <circle cx="82" cy="58" r="4" fill="#4cb8e8" />
          <circle cx="118" cy="58" r="4" fill="#5cc96b" />
        </g>
      )
    case 'topi-wisuda':
      return (
        <g>
          <path d="M74 52 L74 68 Q100 76 126 68 L126 52 Z" fill="#2b2b3a" />
          <path d="M100 30 L150 46 L100 62 L50 46 Z" fill="#33334a" />
          <path d="M140 49 L140 74" stroke="#ffc93c" strokeWidth="3" />
          <circle cx="140" cy="77" r="5" fill="#ffc93c" />
        </g>
      )
    default:
      return null
  }
}

function Mata({ id }: { id?: string }) {
  if (id === 'kacamata')
    return (
      <g stroke="#7a4b2a" strokeWidth="4" fill="rgba(255,255,255,0.15)">
        <circle cx="78" cy="96" r="20" />
        <circle cx="122" cy="96" r="20" />
        <path d="M98 94 Q100 90 102 94" fill="none" />
      </g>
    )
  if (id === 'kacamata-hitam')
    return (
      <g>
        <path d="M56 86 L98 86 L94 106 Q78 114 62 106 Z" fill="#2b2b3a" />
        <path d="M102 86 L144 86 L138 106 Q122 114 106 106 Z" fill="#2b2b3a" />
        <rect x="94" y="86" width="12" height="5" fill="#2b2b3a" />
        <path d="M64 90 L74 90" stroke="#fff" strokeWidth="3" opacity="0.6" />
        <path d="M110 90 L120 90" stroke="#fff" strokeWidth="3" opacity="0.6" />
      </g>
    )
  if (id === 'kacamata-bintang')
    return (
      <g fill="#ff8fab" stroke="#e85d8a" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M78 74 L84 88 L99 89 L87 98 L91 113 L78 104 L65 113 L69 98 L57 89 L72 88 Z" opacity="0.85" />
        <path d="M122 74 L128 88 L143 89 L131 98 L135 113 L122 104 L109 113 L113 98 L101 89 L116 88 Z" opacity="0.85" />
      </g>
    )
  return null
}

function Leher({ id }: { id?: string }) {
  if (id === 'syal-merah')
    return (
      <g>
        <path d="M50 130 Q100 150 150 130 L150 142 Q100 162 50 142 Z" fill="#ef476f" />
        <path d="M118 146 L124 178 L110 176 L108 148 Z" fill="#d63a5f" />
      </g>
    )
  if (id === 'syal-pelangi')
    return (
      <g>
        <path d="M50 128 Q100 148 150 128 L150 134 Q100 154 50 134 Z" fill="#ff6b6b" />
        <path d="M50 134 Q100 154 150 134 L150 140 Q100 160 50 140 Z" fill="#ffd166" />
        <path d="M50 140 Q100 160 150 140 L150 146 Q100 166 50 146 Z" fill="#4cb8e8" />
        <path d="M116 150 L122 180 L108 178 L106 152 Z" fill="#9b8cf2" />
      </g>
    )
  if (id === 'kalung-bunga')
    return (
      <g>
        {[54, 68, 84, 100, 116, 132, 146].map((x, i) => {
          const y = 132 + Math.sin((i / 6) * Math.PI) * 14
          return (
            <g key={x}>
              <circle cx={x} cy={y} r="8" fill={['#ff8fab', '#ffd166', '#c8b6ff', '#ff8fab', '#ffd166', '#c8b6ff', '#ff8fab'][i]} />
              <circle cx={x} cy={y} r="3" fill="#fff" />
            </g>
          )
        })}
      </g>
    )
  if (id === 'dasi-kupu')
    return (
      <g>
        <path d="M100 140 L80 128 L80 152 Z" fill="#ef476f" />
        <path d="M100 140 L120 128 L120 152 Z" fill="#ef476f" />
        <circle cx="100" cy="140" r="6" fill="#c9184a" />
      </g>
    )
  return null
}

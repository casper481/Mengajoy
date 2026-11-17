/** Gambar dekorasi untuk Pulau Rumahku. Titik (0,0) = dasar benda. */
import { Bunga, PohonBulat, PohonKelapa, RumahJamur, RumahKubah } from './Hiasan'

export function GambarDekorasi({ id, x = 0, y = 0, s = 1 }: { id: string; x?: number; y?: number; s?: number }) {
  const t = `translate(${x} ${y}) scale(${s})`
  switch (id) {
    case 'rumah-kayu':
      return (
        <g transform={t}>
          <ellipse cx="0" cy="0" rx="40" ry="8" fill="#000" opacity="0.15" />
          <rect x="-32" y="-44" width="64" height="44" rx="4" fill="#e8b778" stroke="#8a5a2b" strokeWidth="3" />
          {[-34, -24, -14].map((yy) => (
            <path key={yy} d={`M-32 ${yy} L32 ${yy}`} stroke="#c9934f" strokeWidth="2" />
          ))}
          <path d="M-42 -40 L0 -74 L42 -40 Z" fill="#ef6f5f" stroke="#a33b2e" strokeWidth="3" strokeLinejoin="round" />
          <rect x="-8" y="-26" width="16" height="26" rx="3" fill="#8a5a2b" />
          <rect x="14" y="-36" width="12" height="12" rx="2" fill="#bfe9ff" stroke="#8a5a2b" strokeWidth="2" />
          <rect x="-26" y="-36" width="12" height="12" rx="2" fill="#bfe9ff" stroke="#8a5a2b" strokeWidth="2" />
          <rect x="16" y="-70" width="8" height="16" fill="#a33b2e" />
        </g>
      )
    case 'rumah-jamur':
      return <RumahJamur x={x} y={y} s={s * 1.7} />
    case 'rumah-kubah':
      return <RumahKubah x={x} y={y} s={s * 1.15} />
    case 'pohon-bulat':
      return <PohonBulat x={x} y={y} s={s * 1.6} />
    case 'pohon-kelapa':
      return <PohonKelapa x={x} y={y} s={s * 1.5} />
    case 'pohon-sakura':
      return <PohonBulat x={x} y={y} s={s * 1.6} warna="#ff9fc7" />
    case 'pohon-jeruk':
      return (
        <g>
          <PohonBulat x={x} y={y} s={s * 1.6} warna="#3fae4f" />
          {[
            [-12, -40],
            [10, -48],
            [2, -62],
            [-16, -56],
            [14, -32],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={x + dx * s} cy={y + dy * s} r={4.5 * s} fill="#ff9f43" stroke="#d9731a" strokeWidth="1" />
          ))}
        </g>
      )
    case 'bunga-warna':
      return (
        <g transform={t}>
          <ellipse cx="0" cy="0" rx="34" ry="9" fill="#8a5a2b" opacity="0.5" />
          {[-24, -12, 0, 12, 24].map((xx, i) => (
            <Bunga key={xx} x={xx} y={(i % 2) * 4} s={1.8} warna={['#ff8fab', '#ffd166', '#fff', '#ff6b6b', '#c8b6ff'][i]} />
          ))}
        </g>
      )
    case 'bunga-pelangi':
      return (
        <g transform={t}>
          <path d="M-34 0 A34 30 0 0 1 34 0" stroke="#ff6b6b" strokeWidth="6" fill="none" />
          <path d="M-28 0 A28 24 0 0 1 28 0" stroke="#ffd166" strokeWidth="6" fill="none" />
          <path d="M-22 0 A22 18 0 0 1 22 0" stroke="#5cc96b" strokeWidth="6" fill="none" />
          <path d="M-16 0 A16 12 0 0 1 16 0" stroke="#4cb8e8" strokeWidth="6" fill="none" />
          {[-30, -15, 15, 30].map((xx, i) => (
            <Bunga key={xx} x={xx} y={4} s={1.6} warna={['#ff8fab', '#c8b6ff', '#ffd166', '#fff'][i]} />
          ))}
        </g>
      )
    case 'kolam-ikan':
      return (
        <g transform={t}>
          <ellipse cx="0" cy="-6" rx="40" ry="16" fill="#b9b2a5" />
          <ellipse cx="0" cy="-8" rx="34" ry="12" fill="#5fd3e6" />
          <path d="M-14 -10 q4 -4 8 0 l4 -3 l0 6 l-4 -3 q-4 4 -8 0 Z" fill="#ff9f43" />
          <path d="M8 -6 q3 -3 6 0 l3 -2 l0 4 l-3 -2 q-3 3 -6 0 Z" fill="#ff6b6b" />
          <path d="M-24 -12 Q-20 -14 -16 -12" stroke="#fff" strokeWidth="2" fill="none" />
        </g>
      )
    case 'air-mancur':
      return (
        <g transform={t}>
          <ellipse cx="0" cy="-4" rx="34" ry="12" fill="#cfc6b6" stroke="#9a8a6e" strokeWidth="2" />
          <ellipse cx="0" cy="-6" rx="28" ry="8" fill="#5fd3e6" />
          <rect x="-5" y="-34" width="10" height="28" fill="#e9e1d2" stroke="#9a8a6e" strokeWidth="2" />
          <ellipse cx="0" cy="-34" rx="14" ry="5" fill="#e9e1d2" stroke="#9a8a6e" strokeWidth="2" />
          <path d="M0 -38 Q-12 -58 -18 -40 M0 -38 Q12 -58 18 -40 M0 -38 L0 -56" stroke="#8fdcff" strokeWidth="3" fill="none" strokeLinecap="round" className="kilau" style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
        </g>
      )
    case 'ayunan':
      return (
        <g transform={t}>
          <path d="M-30 0 L-22 -56 L22 -56 L30 0" stroke="#b5834b" strokeWidth="5" fill="none" strokeLinejoin="round" />
          <path d="M-22 -56 L22 -56" stroke="#8a5a2b" strokeWidth="6" />
          <g className="goyang-pelan" style={{ transformOrigin: 'top center' }}>
            <path d="M-8 -54 L-8 -16 M8 -54 L8 -16" stroke="#7a4e22" strokeWidth="2" />
            <rect x="-12" y="-18" width="24" height="6" rx="2" fill="#ff6b6b" />
          </g>
        </g>
      )
    case 'perosotan':
      return (
        <g transform={t}>
          <path d="M-26 0 L-26 -50 L-14 -50 L-14 0" stroke="#4cb8e8" strokeWidth="4" fill="none" />
          {[-12, -24, -36].map((yy) => (
            <path key={yy} d={`M-26 ${yy} L-14 ${yy}`} stroke="#4cb8e8" strokeWidth="3" />
          ))}
          <path d="M-16 -50 Q10 -40 30 0 L20 0 Q4 -34 -16 -42 Z" fill="#ffd166" stroke="#e0a400" strokeWidth="2" />
        </g>
      )
    case 'lentera':
      return (
        <g transform={t}>
          <rect x="-2" y="-46" width="4" height="46" fill="#7a4e22" />
          <circle cx="0" cy="-54" r="14" fill="#fff3b0" opacity="0.6" className="kilau" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
          <path d="M-8 -46 L8 -46 L10 -62 L-10 -62 Z" fill="#ffc93c" stroke="#b07800" strokeWidth="2" />
          <path d="M-10 -62 L0 -70 L10 -62 Z" fill="#ef6f5f" />
        </g>
      )
    case 'lampu-bintang':
      return (
        <g transform={t}>
          <rect x="-2" y="-46" width="4" height="46" fill="#5d6b80" />
          <circle cx="0" cy="-56" r="16" fill="#fff3b0" opacity="0.6" className="kilau" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
          <path d="M0 -68 L3.5 -60 L12 -59 L5.5 -53.5 L7.5 -45 L0 -49.5 L-7.5 -45 L-5.5 -53.5 L-12 -59 L-3.5 -60 Z" fill="#ffd23f" stroke="#d99a00" strokeWidth="1.5" />
        </g>
      )
    default:
      return null
  }
}

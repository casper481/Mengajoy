/**
 * Perpustakaan gambar dunia Mengajoy (SVG buatan sendiri).
 * Setiap hiasan digambar di sekitar titik (0,0) = dasar/tengah bawah benda,
 * lalu dipindah dengan x, y dan diperbesar dengan s.
 */
type P = { x?: number; y?: number; s?: number; warna?: string; className?: string }
const t = (x = 0, y = 0, s = 1) => `translate(${x} ${y}) scale(${s})`

export function Awan({ x, y, s, className = '' }: P) {
  return (
    <g transform={t(x, y, s)} className={className}>
      <ellipse cx="0" cy="4" rx="34" ry="8" fill="#000" opacity="0.06" />
      <path d="M-30 0 Q-34 -14 -20 -16 Q-16 -30 0 -27 Q12 -36 22 -22 Q36 -22 32 -6 Q36 0 28 2 L-26 2 Q-34 2 -30 0 Z" fill="#fff" />
      <path d="M-24 -2 Q-6 4 26 -2" stroke="#d9eefb" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

export function PohonBulat({ x, y, s, warna = '#4fbf5a' }: P) {
  return (
    <g transform={t(x, y, s)}>
      <ellipse cx="0" cy="0" rx="14" ry="4" fill="#000" opacity="0.15" />
      <path d="M-3 0 L-2 -16 L2 -16 L3 0 Z" fill="#9a6a3a" />
      <g className="goyang-pelan">
        <circle cx="-8" cy="-22" r="11" fill={warna} />
        <circle cx="8" cy="-23" r="11" fill={warna} />
        <circle cx="0" cy="-33" r="13" fill={warna} />
        <circle cx="-4" cy="-37" r="5" fill="#fff" opacity="0.28" />
        <path d="M-17 -18 Q0 -10 17 -18" stroke="#000" strokeOpacity="0.12" strokeWidth="4" fill="none" />
      </g>
    </g>
  )
}

export function PohonKelapa({ x, y, s }: P) {
  return (
    <g transform={t(x, y, s)}>
      <ellipse cx="2" cy="0" rx="14" ry="4" fill="#000" opacity="0.15" />
      <path d="M-3 0 Q-2 -24 6 -46 L10 -45 Q3 -24 3 0 Z" fill="#b5834b" />
      {[-40, -32, -24, -16, -8].map((yy) => (
        <path key={yy} d={`M${-2.5 + (yy + 40) * 0.1} ${yy} l6 -1`} stroke="#8a5f30" strokeWidth="1.5" />
      ))}
      <g className="goyang-pelan">
        <path d="M8 -46 Q-12 -58 -26 -44 Q-12 -50 8 -44 Z" fill="#3fae4f" />
        <path d="M8 -46 Q28 -60 40 -42 Q26 -50 8 -44 Z" fill="#4fbf5a" />
        <path d="M8 -46 Q-2 -66 -18 -64 Q-4 -60 7 -46 Z" fill="#5ccc66" />
        <path d="M8 -46 Q22 -68 34 -62 Q20 -58 9 -46 Z" fill="#3fae4f" />
        <path d="M8 -46 Q4 -40 -6 -30 Q4 -36 9 -44 Z" fill="#2f9a40" />
        <circle cx="6" cy="-44" r="3" fill="#7a4e22" />
        <circle cx="11" cy="-43" r="3" fill="#7a4e22" />
      </g>
    </g>
  )
}

export function RumahJamur({ x, y, s, warna = '#ef4f5f' }: P) {
  return (
    <g transform={t(x, y, s)}>
      <ellipse cx="0" cy="0" rx="18" ry="5" fill="#000" opacity="0.15" />
      <path d="M-12 0 Q-13 -18 -10 -22 L10 -22 Q13 -18 12 0 Z" fill="#fff4dc" stroke="#d8c39c" strokeWidth="1.5" />
      <path d="M-4 0 L-4 -9 Q0 -14 4 -9 L4 0 Z" fill="#9a6a3a" />
      <circle cx="7" cy="-14" r="2.6" fill="#7fd6ff" stroke="#9a6a3a" strokeWidth="1" />
      <path d="M-24 -20 Q-22 -44 0 -46 Q22 -44 24 -20 Q0 -14 -24 -20 Z" fill={warna} />
      <path d="M-24 -20 Q0 -14 24 -20" stroke="#000" strokeOpacity="0.15" strokeWidth="3" fill="none" />
      <circle cx="-10" cy="-32" r="4" fill="#fff" />
      <circle cx="7" cy="-37" r="3" fill="#fff" />
      <circle cx="13" cy="-26" r="2.5" fill="#fff" />
      <circle cx="-3" cy="-25" r="2" fill="#fff" />
      <path d="M-16 -36 Q-10 -43 -2 -44" stroke="#fff" strokeOpacity="0.5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  )
}

export function Bunga({ x, y, s, warna = '#ff8fab' }: P) {
  return (
    <g transform={t(x, y, s)}>
      <path d="M0 0 L0 -8" stroke="#3fae4f" strokeWidth="1.6" />
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="0" cy="-12" rx="2.6" ry="4" fill={warna} transform={`rotate(${r} 0 -8)`} />
      ))}
      <circle cx="0" cy="-8" r="2" fill="#ffd166" />
    </g>
  )
}

export function Semak({ x, y, s, warna = '#3fae4f' }: P) {
  return (
    <g transform={t(x, y, s)}>
      <circle cx="-7" cy="-5" r="7" fill={warna} />
      <circle cx="6" cy="-6" r="8" fill={warna} />
      <circle cx="0" cy="-10" r="7" fill={warna} />
      <circle cx="-2" cy="-12" r="2.5" fill="#fff" opacity="0.3" />
    </g>
  )
}

export function BatuKecil({ x, y, s }: P) {
  return (
    <g transform={t(x, y, s)}>
      <path d="M-10 0 Q-11 -8 -3 -10 Q6 -12 10 -5 Q12 0 8 1 L-8 1 Z" fill="#b9b2a5" />
      <path d="M-6 -6 Q-2 -9 3 -8" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

export function Kristal({ x, y, s, warna = '#b58bff' }: P) {
  return (
    <g transform={t(x, y, s)}>
      <ellipse cx="0" cy="0" rx="12" ry="3" fill="#000" opacity="0.15" />
      <path d="M-8 0 L-11 -14 L-6 -24 L-2 -12 Z" fill={warna} opacity="0.85" />
      <path d="M-3 0 L-3 -26 L3 -36 L8 -24 L6 0 Z" fill={warna} />
      <path d="M-3 -26 L3 -36 L2 0 L-3 0 Z" fill="#fff" opacity="0.35" />
      <path d="M5 0 L9 -12 L14 -8 L11 0 Z" fill={warna} opacity="0.9" />
    </g>
  )
}

export function AirTerjun({ x, y, s }: P) {
  return (
    <g transform={t(x, y, s)}>
      <path d="M-16 -40 Q-18 -52 -6 -54 L10 -54 Q20 -52 18 -40 L18 0 L-16 0 Z" fill="#9c8a73" />
      <path d="M-16 -40 Q0 -46 18 -40" stroke="#5cc96b" strokeWidth="6" fill="none" />
      <path d="M-7 -44 L9 -44 L11 0 L-9 0 Z" fill="#8fdcff" />
      <path d="M-3 -40 L-4 -4 M3 -40 L4 -6" stroke="#fff" strokeWidth="1.6" opacity="0.8" strokeDasharray="5 4" className="ombak" />
      <ellipse cx="1" cy="0" rx="16" ry="4" fill="#fff" opacity="0.8" />
    </g>
  )
}

export function Teratai({ x, y, s }: P) {
  return (
    <g transform={t(x, y, s)}>
      <path d="M-12 0 A12 5 0 1 1 12 0 L0 0 Z" fill="#4fbf5a" />
      <path d="M0 0 L8 -2" stroke="#3fae4f" strokeWidth="1.2" />
      <circle cx="-3" cy="-3" r="2.6" fill="#ff8fab" />
    </g>
  )
}

export function Perahu({ x, y, s }: P) {
  return (
    <g transform={t(x, y, s)} className="goyang-pelan">
      <path d="M-18 -4 L18 -4 Q14 6 0 6 Q-14 6 -18 -4 Z" fill="#b5834b" stroke="#7a4e22" strokeWidth="1.5" />
      <path d="M0 -4 L0 -28" stroke="#7a4e22" strokeWidth="2" />
      <path d="M1 -27 L15 -8 L1 -8 Z" fill="#fff" />
      <path d="M-1 -24 L-11 -8 L-1 -8 Z" fill="#ffd166" />
    </g>
  )
}

export function Jembatan({ x, y, s }: P) {
  return (
    <g transform={t(x, y, s)}>
      <path d="M-24 0 Q0 -14 24 0 L24 6 Q0 -8 -24 6 Z" fill="#b5834b" stroke="#7a4e22" strokeWidth="1.5" />
      {[-16, -8, 0, 8, 16].map((xx) => (
        <path key={xx} d={`M${xx} ${Math.abs(xx) * 0.35 - 8} l0 8`} stroke="#7a4e22" strokeWidth="1.2" />
      ))}
      <path d="M-24 -4 Q0 -18 24 -4" stroke="#7a4e22" strokeWidth="2" fill="none" />
    </g>
  )
}

/** Rumah berkubah emas untuk Pulau Al-Quran (bangunan, tanpa makhluk hidup) */
export function RumahKubah({ x, y, s }: P) {
  return (
    <g transform={t(x, y, s)}>
      <ellipse cx="0" cy="0" rx="30" ry="6" fill="#000" opacity="0.15" />
      <rect x="-22" y="-26" width="44" height="26" rx="3" fill="#fff7e0" stroke="#e0b44c" strokeWidth="2" />
      <path d="M-7 0 L-7 -14 Q0 -22 7 -14 L7 0 Z" fill="#2fa6a0" />
      <path d="M-17 -12 L-17 -18 Q-14 -22 -11 -18 L-11 -12 Z M11 -12 L11 -18 Q14 -22 17 -18 L17 -12 Z" fill="#2fa6a0" />
      <path d="M-18 -26 Q-18 -52 0 -56 Q18 -52 18 -26 Z" fill="#ffc93c" stroke="#e0a400" strokeWidth="2" />
      <path d="M-10 -40 Q-6 -50 2 -52" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M0 -56 L0 -64" stroke="#e0a400" strokeWidth="2" />
      <path d="M3 -70 A5 5 0 1 0 3 -62 A4 4 0 1 1 3 -70 Z" fill="#ffc93c" />
      <rect x="25" y="-44" width="7" height="44" rx="2" fill="#fff7e0" stroke="#e0b44c" strokeWidth="1.5" />
      <path d="M24 -44 L28.5 -54 L33 -44 Z" fill="#ffc93c" />
      <rect x="-32" y="-44" width="7" height="44" rx="2" fill="#fff7e0" stroke="#e0b44c" strokeWidth="1.5" />
      <path d="M-33 -44 L-28.5 -54 L-24 -44 Z" fill="#ffc93c" />
    </g>
  )
}

export function Kilau({ x, y, s, warna = '#fff' }: P) {
  return (
    <g transform={t(x, y, s)}>
      <path className="kilau" style={{ transformOrigin: 'center', transformBox: 'fill-box' }} d="M0 -8 Q1 -1 8 0 Q1 1 0 8 Q-1 1 -8 0 Q-1 -1 0 -8 Z" fill={warna} />
    </g>
  )
}

export function Bintang({ x, y, s, isi = true }: P & { isi?: boolean }) {
  return (
    <g transform={t(x, y, s)}>
      <path
        d="M0 -10 L2.9 -3.6 L9.8 -3.1 L4.6 1.5 L6.1 8.3 L0 4.8 L-6.1 8.3 L-4.6 1.5 L-9.8 -3.1 L-2.9 -3.6 Z"
        fill={isi ? '#ffd23f' : '#e9e4d8'}
        stroke={isi ? '#d99a00' : '#b8b0a0'}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {isi && <path d="M-2 -5 L0 -8 L1 -4" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.4" fill="none" strokeLinecap="round" />}
    </g>
  )
}

/** Ikon-ikon sederhana (SVG) supaya tidak bergantung pada library luar. */
type P = { ukuran?: number; className?: string }

export function IkonBintang({ ukuran = 24, className = '', isi = true }: P & { isi?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} className={className} aria-hidden>
      <path
        d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"
        fill={isi ? '#ffc93c' : '#e3e8ef'}
        stroke={isi ? '#f0a500' : '#c9d1dc'}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IkonApi({ ukuran = 24, className = '', menyala = true }: P & { menyala?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} className={className} aria-hidden>
      <path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2.5 1.2-4 2.5-5 .2 1.8 1 2.8 2 3C11 8 11 5 12 2z" fill={menyala ? '#ff7a3d' : '#d5dbe3'} />
      <path d="M12 12c.6 2 2.5 2.5 2.5 5a2.5 2.5 0 0 1-5 0c0-1.5 1-2.5 2.5-5z" fill={menyala ? '#ffd23f' : '#eef1f5'} />
    </svg>
  )
}

export function IkonSpeaker({ ukuran = 24, className = '', mati = false }: P & { mati?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {mati ? <path d="M17 9l4 6M21 9l-4 6" /> : <><path d="M16.5 8.5a5 5 0 0 1 0 7" /><path d="M19 6a8.5 8.5 0 0 1 0 12" /></>}
    </svg>
  )
}

export function IkonGembok({ ukuran = 24, className = '' }: P) {
  return (
    <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} className={className} aria-hidden>
      <rect x="5" y="10" width="14" height="11" rx="3" fill="#8a94a6" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#8a94a6" strokeWidth="2.5" fill="none" />
      <circle cx="12" cy="15.5" r="1.8" fill="#fff" />
    </svg>
  )
}

export function IkonKembali({ ukuran = 24, className = '' }: P) {
  return (
    <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

export function IkonLemari({ ukuran = 24, className = '' }: P) {
  return (
    <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} className={className} aria-hidden>
      <path d="M4 9l8-5 8 5v2H4z" fill="#ff8fab" />
      <rect x="5" y="11" width="14" height="9" rx="2" fill="#ffd166" />
      <path d="M12 11v9" stroke="#e0a400" strokeWidth="1.5" />
    </svg>
  )
}

export function IkonMisi({ ukuran = 24, className = '' }: P) {
  return (
    <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="#5cc96b" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IkonOrangTua({ ukuran = 24, className = '' }: P) {
  return (
    <svg viewBox="0 0 24 24" width={ukuran} height={ukuran} className={className} aria-hidden>
      <circle cx="9" cy="7" r="3.2" fill="#6c7a93" />
      <path d="M3 20c0-4 2.7-6.5 6-6.5s6 2.5 6 6.5z" fill="#6c7a93" />
      <circle cx="17" cy="10" r="2.4" fill="#9aa6bb" />
      <path d="M13.5 20c0-3 1.6-5 3.5-5s3.5 2 3.5 5z" fill="#9aa6bb" />
    </svg>
  )
}

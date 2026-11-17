/** Latar pemandangan lembut untuk layar aktivitas: langit, awan bergerak, bukit hijau. */
import { Awan, Bunga, PohonBulat, PohonKelapa } from './Hiasan'

export default function LatarLembut() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 mx-auto max-w-md overflow-hidden" aria-hidden>
      <svg viewBox="0 0 400 860" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
        <defs>
          <linearGradient id="langit-l" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9fe4ff" />
            <stop offset="55%" stopColor="#e2f7ff" />
            <stop offset="100%" stopColor="#f3fbe8" />
          </linearGradient>
        </defs>
        <rect width="400" height="860" fill="url(#langit-l)" />
        <g className="awan-jalan" style={{ animationDuration: '90s' }}>
          <Awan x={30} y={150} s={1.3} />
        </g>
        <g className="awan-jalan" style={{ animationDuration: '120s', animationDelay: '-60s' }}>
          <Awan x={10} y={300} s={0.9} />
        </g>
        <path d="M0 720 Q90 670 190 705 Q290 735 400 690 L400 860 L0 860 Z" fill="#a8e39a" />
        <path d="M0 770 Q120 735 230 765 Q320 785 400 755 L400 860 L0 860 Z" fill="#7ad672" />
        <PohonBulat x={46} y={735} s={1.6} />
        <PohonKelapa x={356} y={728} s={1.4} />
        {[110, 170, 250, 300].map((x, i) => (
          <Bunga key={x} x={x} y={800 + (i % 2) * 18} s={1.5} warna={['#ff8fab', '#ffd166', '#fff', '#c8b6ff'][i]} />
        ))}
      </svg>
    </div>
  )
}

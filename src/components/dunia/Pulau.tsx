/** Gambar satu pulau di peta. Setiap level punya tema hiasan sendiri. */
import { AirTerjun, Awan, BatuKecil, Bunga, Kilau, Kristal, PohonBulat, PohonKelapa, RumahJamur, RumahKubah, Semak } from './Hiasan'

type Tema = { rumput: string; rumputTua: string; pasir: string; tebing: string }

export const TEMA: Record<number, Tema> = {
  1: { rumput: '#7ad672', rumputTua: '#56b84f', pasir: '#ffe3a3', tebing: '#c98d55' },
  2: { rumput: '#a6df6a', rumputTua: '#84c44a', pasir: '#ffd88a', tebing: '#d39a5a' },
  3: { rumput: '#b7a6f2', rumputTua: '#9583e0', pasir: '#f3e6ff', tebing: '#8f78c9' },
  4: { rumput: '#6fd6a6', rumputTua: '#4cbc88', pasir: '#d9f4ff', tebing: '#9c8a73' },
  5: { rumput: '#9ee07a', rumputTua: '#78c656', pasir: '#ffe0ec', tebing: '#c98d9a' },
  6: { rumput: '#ffe08a', rumputTua: '#f2c650', pasir: '#fff6d6', tebing: '#d9a63c' },
}

function Hiasan({ id }: { id: number }) {
  switch (id) {
    case 1:
      return (
        <>
          <PohonBulat x={160} y={104} s={1.1} />
          <PohonBulat x={186} y={116} s={0.75} warna="#3fae4f" />
          <RumahJamur x={96} y={110} s={1.15} />
          <Semak x={132} y={124} s={0.8} />
          <Bunga x={66} y={120} />
          <Bunga x={76} y={126} warna="#ffd166" />
        </>
      )
    case 2:
      return (
        <>
          <PohonKelapa x={164} y={112} s={1.05} />
          <PohonKelapa x={70} y={116} s={0.8} />
          <RumahJamur x={118} y={112} s={1.05} warna="#ff9f43" />
          <BatuKecil x={186} y={124} s={0.8} />
          <Bunga x={92} y={126} warna="#ff6b6b" />
        </>
      )
    case 3:
      return (
        <>
          <Kristal x={92} y={114} s={1.2} />
          <Kristal x={150} y={108} s={1.4} warna="#7fd6ff" />
          <PohonBulat x={182} y={118} s={0.8} warna="#9b7be8" />
          <Kristal x={122} y={124} s={0.7} warna="#ff8fab" />
          <Bunga x={66} y={124} warna="#fff" />
        </>
      )
    case 4:
      return (
        <>
          <AirTerjun x={120} y={112} s={1.15} />
          <PohonBulat x={76} y={118} s={0.9} />
          <PohonKelapa x={170} y={116} s={0.75} />
          <Semak x={148} y={126} s={0.7} />
        </>
      )
    case 5:
      return (
        <>
          <PohonBulat x={164} y={106} s={1.05} warna="#ff9fc7" />
          <RumahJamur x={100} y={110} s={1.1} warna="#b98cff" />
          {[60, 72, 132, 144, 188].map((x, i) => (
            <Bunga key={x} x={x} y={120 + (i % 2) * 6} warna={['#ff8fab', '#ffd166', '#fff', '#ff6b6b', '#c8b6ff'][i]} />
          ))}
        </>
      )
    case 6:
      return (
        <>
          <RumahKubah x={120} y={112} s={1.2} />
          <PohonKelapa x={66} y={118} s={0.7} />
          <PohonKelapa x={182} y={118} s={0.7} />
          <Kilau x={70} y={50} s={1.2} />
          <Kilau x={175} y={44} s={1} />
          <Kilau x={150} y={20} s={0.8} warna="#fff3b0" />
          <Kilau x={92} y={26} s={0.9} warna="#fff3b0" />
        </>
      )
    default:
      return null
  }
}

export default function GambarPulau({ id, terkunci }: { id: number; terkunci: boolean }) {
  const w = TEMA[id] ?? TEMA[1]
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full overflow-visible" aria-hidden>
      {id === 6 && !terkunci && (
        <>
          <defs>
            <radialGradient id="cahaya-emas">
              <stop offset="0%" stopColor="#fff3b0" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="120" cy="90" rx="130" ry="95" fill="url(#cahaya-emas)" className="animate-denyut" style={{ transformOrigin: 'center', transformBox: 'fill-box' }} />
        </>
      )}
      <g style={terkunci ? { filter: 'grayscale(0.55) brightness(1.08) opacity(0.85)' } : undefined}>
        {/* bayangan & buih di air */}
        <ellipse cx="120" cy="142" rx="112" ry="34" fill="#0d6f97" opacity="0.28" />
        <ellipse cx="120" cy="136" rx="106" ry="31" fill="#fff" opacity="0.75" />
        {/* tebing, pasir, rumput */}
        <ellipse cx="120" cy="128" rx="98" ry="30" fill={w.tebing} />
        <path d="M30 128 Q40 140 60 142 M180 142 Q200 140 210 128" stroke="#000" strokeOpacity="0.12" strokeWidth="3" fill="none" />
        <ellipse cx="120" cy="114" rx="98" ry="32" fill={w.pasir} />
        <ellipse cx="120" cy="108" rx="86" ry="27" fill={w.rumputTua} />
        <ellipse cx="118" cy="105" rx="82" ry="24" fill={w.rumput} />
        <ellipse cx="92" cy="98" rx="30" ry="7" fill="#fff" opacity="0.18" />
        <Hiasan id={id} />
      </g>
      {terkunci && (
        <g opacity="0.9">
          <Awan x={44} y={128} s={0.9} />
          <Awan x={198} y={120} s={1} />
        </g>
      )}
    </svg>
  )
}

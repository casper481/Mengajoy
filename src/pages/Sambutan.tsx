/** Layar sambutan: pemandangan pantai, papan logo Mengajoy, dan Nuri yang melompat. */
import { Awan, Bunga, Kilau, PohonKelapa, Semak } from '../components/dunia/Hiasan'
import Nuri from '../components/Nuri'
import { sorak } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

export default function Sambutan({ onMulai }: { onMulai: () => void }) {
  const { p, mulai } = useProgres()
  const tekan = () => {
    sorak()
    mulai()
    onMulai()
  }
  return (
    <div className="relative flex h-[100dvh] flex-col items-center overflow-hidden">
      {/* ===== pemandangan ===== */}
      <svg viewBox="0 0 400 860" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="langit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8fe0ff" />
            <stop offset="60%" stopColor="#d4f4ff" />
            <stop offset="100%" stopColor="#fff6dc" />
          </linearGradient>
          <linearGradient id="laut-s" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5fd3e6" />
            <stop offset="100%" stopColor="#2aaad3" />
          </linearGradient>
          <radialGradient id="matahari">
            <stop offset="0%" stopColor="#fff7c2" />
            <stop offset="100%" stopColor="#fff7c2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="860" fill="url(#langit)" />
        <circle cx="320" cy="120" r="120" fill="url(#matahari)" />
        <g className="awan-jalan" style={{ animationDuration: '80s' }}>
          <Awan x={40} y={110} s={1.4} />
        </g>
        <g className="awan-jalan" style={{ animationDuration: '110s', animationDelay: '-50s' }}>
          <Awan x={20} y={220} s={1.1} />
        </g>
        {/* pulau-pulau jauh */}
        <path d="M0 470 Q60 430 120 455 Q170 420 230 452 Q300 425 400 460 L400 520 L0 520 Z" fill="#9fdcc0" opacity="0.7" />
        {/* laut */}
        <rect y="480" width="400" height="140" fill="url(#laut-s)" />
        <g className="ombak">
          {[...Array(8)].map((_, i) => (
            <path key={i} d={`M${i * 60} ${505 + (i % 2) * 30} q10 -7 20 0 q10 7 20 0`} stroke="#fff" strokeOpacity="0.5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ))}
        </g>
        <Kilau x={70} y={530} s={0.8} />
        <Kilau x={300} y={560} s={0.7} />
        {/* pantai & rumput */}
        <path d="M0 590 Q120 560 220 580 Q320 600 400 575 L400 860 L0 860 Z" fill="#ffe3a3" />
        <path d="M0 590 Q120 560 220 580 Q320 600 400 575" stroke="#fff" strokeWidth="6" fill="none" opacity="0.8" />
        <path d="M0 700 Q100 670 200 690 Q300 710 400 680 L400 860 L0 860 Z" fill="#7ad672" />
        <path d="M0 740 Q120 715 220 735 Q320 755 400 725 L400 860 L0 860 Z" fill="#56b84f" />
        <PohonKelapa x={352} y={640} s={2.4} />
        <PohonKelapa x={40} y={665} s={1.7} />
        <Semak x={80} y={720} s={2} />
        <Semak x={320} y={735} s={2.2} warna="#4cae47" />
        {[30, 120, 260, 360, 200].map((x, i) => (
          <Bunga key={x} x={x} y={760 + (i % 2) * 22} s={1.8} warna={['#ff8fab', '#ffd166', '#fff', '#ff6b6b', '#c8b6ff'][i]} />
        ))}
        {/* daun besar di sudut (bingkai) */}
        <path d="M-20 0 Q60 30 50 110 Q10 90 -20 120 Z" fill="#3fae4f" />
        <path d="M-20 0 Q40 60 20 140" stroke="#2f9a40" strokeWidth="3" fill="none" />
        <path d="M420 860 Q330 820 360 740 Q390 780 420 760 Z" fill="#2f9a40" />
        <path d="M-20 860 Q60 810 40 760 Q10 790 -20 780 Z" fill="#3fae4f" />
      </svg>

      {/* ===== papan logo ===== */}
      <div className="animate-masuk relative z-10 mt-[7dvh] flex flex-col items-center">
        <div
          className="relative rounded-[2.2rem] border-[5px] border-[#e9d9b4] px-7 pb-4 pt-6 text-center shadow-[0_8px_0_#c9b48a,0_18px_30px_rgba(0,0,0,0.18)]"
          style={{ background: 'linear-gradient(180deg,#fffaf0,#f6ead0)' }}
        >
          <div className="absolute -top-9 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-[5px] border-[#e9d9b4] bg-[#fffaf0]">
            <Nuri ukuran={50} ekspresi="senang" />
          </div>
          <div className="judul-game text-[3.4rem] leading-none" style={{ ['--g' as string]: '#2a7a36', color: '#7ee081' }}>
            Menga<span style={{ color: '#ffb347', ['--g' as string]: '#b4520e' }} className="judul-game">joy</span>
          </div>
          <div className="mt-2 text-lg font-extrabold text-[#9a7b4f]">Petualangan Mengaji Seru</div>
          <svg viewBox="0 0 60 30" className="absolute -left-8 top-1/2 h-10 w-16 -translate-y-1/2" aria-hidden>
            <path d="M60 15 Q30 -5 4 12 Q30 30 60 15 Z" fill="#5cc96b" />
            <path d="M60 15 L8 13" stroke="#3fae4f" strokeWidth="2" />
          </svg>
          <svg viewBox="0 0 60 30" className="absolute -right-8 top-1/2 h-10 w-16 -translate-y-1/2 -scale-x-100" aria-hidden>
            <path d="M60 15 Q30 -5 4 12 Q30 30 60 15 Z" fill="#5cc96b" />
            <path d="M60 15 L8 13" stroke="#3fae4f" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* ===== sapaan + Nuri ===== */}
      <div className="relative z-10 mt-auto flex flex-col items-center">
        <div className="panel-game animate-masuk relative px-5 py-3 text-center" style={{ animationDelay: '0.4s' }}>
          <div className="text-2xl font-extrabold text-[#6b4e24]">Assalamu'alaikum!</div>
          <div className="text-lg font-bold text-[#9a7b4f]">Yuk berpetualang bersama Nuri!</div>
          <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-b-4 border-r-4 border-[#e9c98f] bg-[#fff4dc]" />
        </div>
        <div className="animate-lompat mt-2" style={{ animationIterationCount: 'infinite', animationDuration: '1.4s' }}>
          <Nuri ukuran={190} ekspresi="sorak" dipakai={p.dipakai} />
        </div>
      </div>

      {/* ===== tombol batu ===== */}
      <div className="relative z-10 mb-[5dvh] mt-3 w-full max-w-sm px-6">
        <button onClick={tekan} className="tombol-game jeruk animate-denyut w-full py-5 text-[1.7rem]">
          {p.sudahMulai ? 'Lanjut Petualangan' : 'Mulai Petualangan'}
        </button>
      </div>
    </div>
  )
}

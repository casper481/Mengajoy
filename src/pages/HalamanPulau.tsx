/** Isi satu pulau: batu loncatan di sungai, dari stage 1 (bawah) naik ke atas. */
import { useEffect, useRef } from 'react'
import BarAtas from '../components/BarAtas'
import { Bintang, Bunga, Jembatan, PohonBulat, PohonKelapa, RumahJamur, Semak, Teratai, Kristal, BatuKecil } from '../components/dunia/Hiasan'
import { TEMA } from '../components/dunia/Pulau'
import { IkonGembok } from '../components/Ikon'
import Nuri from '../components/Nuri'
import NuriBicara from '../components/NuriBicara'
import { hurufById } from '../data/huruf'
import { PULAU, stagesOfPulau, type Stage } from '../data/stages'
import { pop } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

const LEBAR = 400
const JARAK = 170
const X = [200, 128, 268, 150, 250, 140, 262]

function labelStage(s: Stage): string {
  if (s.jenis === 'huruf') return s.huruf.map((id) => hurufById(id).arab).join(' ')
  return s.judul
}

export default function HalamanPulau({ pulauId, onStage, onKembali }: { pulauId: number; onStage: (id: string) => void; onKembali: () => void }) {
  const { p, stageTerbuka } = useProgres()
  const pulau = PULAU.find((x) => x.id === pulauId)!
  const tema = TEMA[pulauId] ?? TEMA[1]
  const stages = stagesOfPulau(pulauId)
  const berikut = stages.find((s) => stageTerbuka(s.id) && !p.bintang[s.id])
  const refAktif = useRef<HTMLDivElement>(null)

  const TINGGI = stages.length * JARAK + 230
  const titik = (i: number) => ({ x: X[i % X.length], y: TINGGI - 130 - i * JARAK })

  useEffect(() => {
    const t = setTimeout(() => refAktif.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250)
    return () => clearTimeout(t)
  }, [])

  // sungai berliku melewati semua batu
  const pts = [{ x: 200, y: TINGGI + 20 }, ...stages.map((_, i) => titik(i)), { x: 200, y: -20 }]
  const sungai = pts
    .map((t, i) => {
      if (i === 0) return `M ${t.x} ${t.y}`
      const s = pts[i - 1]
      const tengah = (s.y + t.y) / 2
      return `C ${s.x} ${tengah}, ${t.x} ${tengah}, ${t.x} ${t.y}`
    })
    .join(' ')

  return (
    <div className="relative flex min-h-full flex-col" style={{ background: tema.rumput }}>
      <BarAtas onKembali={onKembali} judul={pulau.nama.replace('Pulau ', '')} />
      <div className="relative z-20 px-3">
        <NuriBicara
          teks={berikut ? 'Ketuk batu yang bersinar untuk mulai!' : 'MasyaAllah! Semua stage di pulau ini sudah selesai!'}
          ekspresi="senang"
          ukuran={64}
        />
      </div>

      <div className="relative -mt-6 w-full" style={{ aspectRatio: `${LEBAR} / ${TINGGI}` }}>
        <svg viewBox={`0 0 ${LEBAR} ${TINGGI}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {/* rumput bertekstur */}
          <rect width={LEBAR} height={TINGGI} fill={tema.rumput} />
          {[...Array(24)].map((_, i) => (
            <ellipse key={i} cx={(i * 83) % 400} cy={(i * 137) % TINGGI} rx="40" ry="14" fill={tema.rumputTua} opacity="0.35" />
          ))}
          {/* sungai */}
          <path d={sungai} stroke={tema.pasir} strokeWidth="96" fill="none" strokeLinecap="round" />
          <path d={sungai} stroke="#2aaad3" strokeWidth="80" fill="none" strokeLinecap="round" />
          <path d={sungai} stroke="#5fd3e6" strokeWidth="58" fill="none" strokeLinecap="round" />
          <path d={sungai} stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeDasharray="10 26" fill="none" className="ombak" />
          {/* hiasan tepi sungai */}
          {stages.map((_, i) => {
            const { x, y } = titik(i)
            const kiri = x > 200
            const bx = kiri ? 62 : 338
            return (
              <g key={i}>
                {i % 3 === 0 && (pulauId === 3 ? <Kristal x={bx} y={y + 10} s={1.6} /> : <RumahJamur x={bx} y={y + 14} s={1.4} warna={['#ef4f5f', '#ff9f43', '#b98cff', '#4cb8e8', '#ff8fab', '#ffc93c'][pulauId - 1]} />)}
                {i % 3 === 1 && (pulauId === 2 || pulauId === 4 ? <PohonKelapa x={bx} y={y + 20} s={1.3} /> : <PohonBulat x={bx} y={y + 20} s={1.5} warna={pulauId === 5 ? '#ff9fc7' : pulauId === 3 ? '#9b7be8' : '#3fae4f'} />)}
                {i % 3 === 2 && <Semak x={bx} y={y + 10} s={1.6} warna={tema.rumputTua} />}
                <Bunga x={bx + (kiri ? 30 : -30)} y={y + 40} s={1.3} warna={['#ff8fab', '#ffd166', '#fff'][i % 3]} />
                <Bunga x={bx + (kiri ? 20 : -20)} y={y - 40} s={1.1} warna={['#ffd166', '#fff', '#ff6b6b'][i % 3]} />
                <Teratai x={x + (kiri ? -46 : 46)} y={y + 52} s={1.1} />
                {i % 2 === 1 && <BatuKecil x={x + (kiri ? 50 : -50)} y={y - 30} s={1.1} />}
              </g>
            )
          })}
          {stages.length > 2 && <Jembatan x={titik(1).x + (titik(1).x > 200 ? -0 : 0)} y={(titik(1).y + titik(2).y) / 2 + 6} s={1.6} />}
        </svg>

        {stages.map((s, i) => {
          const { x, y } = titik(i)
          const buka = stageTerbuka(s.id)
          const bintang = p.bintang[s.id] ?? 0
          const aktif = berikut?.id === s.id
          return (
            <div
              key={s.id}
              ref={aktif ? refAktif : undefined}
              className="animate-masuk absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${(x / LEBAR) * 100}%`, top: `${(y / TINGGI) * 100}%`, width: '34%', animationDelay: `${i * 0.06}s` }}
            >
              {/* tiga bintang melengkung */}
              <svg viewBox="-40 -24 80 30" className="w-[70%] overflow-visible" aria-hidden>
                <Bintang x={-24} y={-2} s={0.95} isi={bintang >= 1} />
                <Bintang x={0} y={-12} s={1.2} isi={bintang >= 2} />
                <Bintang x={24} y={-2} s={0.95} isi={bintang >= 3} />
              </svg>
              <button
                onClick={() => {
                  if (!buka) return
                  pop()
                  onStage(s.id)
                }}
                disabled={!buka}
                aria-label={`Stage ${s.nomor}`}
                className={`relative w-full transition-transform active:scale-95 ${aktif ? 'animate-denyut' : ''}`}
                style={{ aspectRatio: '120 / 84' }}
              >
                <svg viewBox="0 0 120 84" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                  {aktif && <ellipse cx="60" cy="44" rx="62" ry="40" fill="#fff3b0" opacity="0.8" />}
                  <ellipse cx="60" cy="62" rx="56" ry="18" fill="#0d6f97" opacity="0.3" />
                  <ellipse cx="60" cy="56" rx="54" ry="20" fill={buka ? '#cfc6b6' : '#9aa3b2'} />
                  <ellipse cx="60" cy="44" rx="54" ry="30" fill={buka ? '#f4efe6' : '#c3cad6'} />
                  <ellipse cx="44" cy="32" rx="22" ry="8" fill="#fff" opacity="0.7" />
                  {aktif && <ellipse cx="60" cy="44" rx="54" ry="30" fill="none" stroke="#ffc93c" strokeWidth="5" />}
                </svg>
                <span className="absolute inset-x-0 top-[18%] flex flex-col items-center">
                  <span className="judul-game text-2xl leading-none" style={{ ['--g' as string]: '#9a7b4f' }}>
                    {s.nomor}
                  </span>
                  {buka ? (
                    <span className={`mt-0.5 max-w-[92%] truncate font-extrabold leading-tight text-[#6b4e24] ${s.jenis === 'huruf' ? 'arab text-xl' : 'text-[11px]'}`}>
                      {labelStage(s)}
                    </span>
                  ) : (
                    <IkonGembok ukuran={22} />
                  )}
                </span>
                {aktif && (
                  <span className="absolute -right-6 -top-12">
                    <Nuri ukuran={64} ekspresi="senang" dipakai={p.dipakai} className="animate-melayang" />
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

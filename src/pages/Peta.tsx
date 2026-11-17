/** Peta petualangan: dunia kepulauan bergambar, dari Pulau 1 (bawah) naik ke Pulau Al-Quran (atas). */
import { useEffect, useRef } from 'react'
import BarAtas from '../components/BarAtas'
import { Awan, BatuKecil, Kilau, Perahu, PohonKelapa, Teratai } from '../components/dunia/Hiasan'
import Laut from '../components/dunia/Laut'
import GambarPulau from '../components/dunia/Pulau'
import { IkonBintang, IkonGembok, IkonLemari, IkonMisi, IkonOrangTua } from '../components/Ikon'
import Nuri from '../components/Nuri'
import { PULAU, stagesOfPulau } from '../data/stages'
import { pop } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

type Props = {
  onPulau: (id: number) => void
  onLemari: () => void
  onMisi: () => void
  onOrtu: () => void
  onLatihan: () => void
}

// Ukuran "dunia" dalam satuan SVG (lebar 400). Pulau 1 di bawah, naik ke atas.
const LEBAR = 400
const JARAK = 230
const TINGGI = PULAU.length * JARAK + 160
const X = [124, 276, 126, 274, 124, 200]
const titikPulau = (i: number) => ({ x: X[i], y: TINGGI - 190 - i * JARAK })

export default function Peta({ onPulau, onLemari, onMisi, onOrtu, onLatihan }: Props) {
  const { p, misiHariIniSelesai, pulauTerbuka, latihanTersedia, latihanHariIniSelesai } = useProgres()
  const pulauAktif = [...PULAU].reverse().find((x) => pulauTerbuka(x.id))?.id ?? 1
  const refAktif = useRef<HTMLDivElement>(null)

  // gulir otomatis ke pulau yang sedang aktif
  useEffect(() => {
    const t = setTimeout(() => refAktif.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250)
    return () => clearTimeout(t)
  }, [])

  // jalan setapak berliku antar pulau
  const jalur = PULAU.map((_, i) => titikPulau(i))
    .map((t, i, arr) => {
      if (i === 0) return `M ${t.x} ${t.y + 40}`
      const s = arr[i - 1]
      const tengah = (s.y + t.y) / 2
      return `C ${s.x} ${tengah}, ${t.x} ${tengah}, ${t.x} ${t.y + 40}`
    })
    .join(' ')

  return (
    <div className="relative flex min-h-full flex-col bg-[#3cc0dc]">
      <BarAtas judul="Peta Petualangan" />

      {latihanTersedia && (
        <button
          onClick={() => {
            pop()
            onLatihan()
          }}
          className={`panel-game relative z-20 mx-3 mt-1 flex items-center gap-3 px-3 py-2 text-left ${latihanHariIniSelesai ? '' : 'animate-denyut'}`}
        >
          <span className="tombol-game ungu flex h-12 w-12 shrink-0 items-center justify-center !rounded-2xl text-2xl">{latihanHariIniSelesai ? '✓' : '🔁'}</span>
          <span className="flex-1">
            <span className="block text-lg font-extrabold leading-tight text-[#6b4e24]">Latihan Harian</span>
            <span className="block text-sm font-bold text-[#9a7b4f]">
              {latihanHariIniSelesai ? 'Sudah latihan hari ini. Mau ulang lagi?' : 'Ulang bacaan yang sudah dipelajari (2 menit)'}
            </span>
          </span>
        </button>
      )}

      {/* ===== DUNIA ===== */}
      <div className="relative -mt-24 w-full" style={{ aspectRatio: `${LEBAR} / ${TINGGI}` }}>
        <Laut />
        <svg viewBox={`0 0 ${LEBAR} ${TINGGI}`} className="absolute inset-0 h-full w-full" aria-hidden>
          {/* awan bergerak di langit atas */}
          <g className="awan-jalan" style={{ animationDuration: '70s' }}>
            <Awan x={60} y={110} s={1.4} />
          </g>
          <g className="awan-jalan" style={{ animationDuration: '95s', animationDelay: '-40s' }}>
            <Awan x={40} y={180} s={1} />
          </g>
          {/* jalan setapak */}
          <path d={jalur} stroke="#0d6f97" strokeOpacity="0.25" strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d={jalur} stroke="#ffe7b0" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d={jalur} stroke="#e8c27a" strokeWidth="14" strokeDasharray="1 22" fill="none" strokeLinecap="round" />
          {/* hiasan laut */}
          {/* pulau-pulau kecil berpohon kelapa */}
          {[
            [345, TINGGI - JARAK * 0.5 - 150],
            [55, TINGGI - JARAK * 1.5 - 150],
            [345, TINGGI - JARAK * 2.5 - 150],
            [55, TINGGI - JARAK * 3.5 - 150],
            [348, TINGGI - JARAK * 4.5 - 150],
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y + 4} rx="34" ry="10" fill="#fff" opacity="0.7" />
              <ellipse cx={x} cy={y} rx="28" ry="9" fill="#ffe3a3" />
              <ellipse cx={x - 2} cy={y - 2} rx="18" ry="5" fill="#7ad672" />
              <PohonKelapa x={x + 2} y={y} s={0.8} />
            </g>
          ))}
          <Perahu x={330} y={TINGGI - 110} s={1.3} />
          <Perahu x={52} y={TINGGI - JARAK * 3 - 60} s={1} />
          <BatuKecil x={350} y={TINGGI - JARAK - 40} s={1.6} />
          <BatuKecil x={40} y={TINGGI - JARAK * 2 + 60} s={1.3} />
          <BatuKecil x={360} y={TINGGI - JARAK * 4 + 30} s={1.4} />
          {[...Array(6)].map((_, i) => (
            <Teratai key={i} x={i % 2 ? 50 : 352} y={TINGGI - 60 - i * 235} s={1.2} />
          ))}
          {[...Array(10)].map((_, i) => (
            <Kilau key={i} x={(i * 97) % 380 + 10} y={(i * 173) % (TINGGI - 100) + 60} s={0.7} />
          ))}
        </svg>

        {PULAU.map((pl, i) => {
          const { x, y } = titikPulau(i)
          const stages = stagesOfPulau(pl.id)
          const bintang = stages.reduce((a, s) => a + (p.bintang[s.id] ?? 0), 0)
          const maks = stages.length * 3
          const terbuka = pl.tersedia && pulauTerbuka(pl.id)
          const aktif = pl.id === pulauAktif
          const lebarPulau = pl.id === 6 ? 70 : 62
          return (
            <div
              key={pl.id}
              ref={aktif ? refAktif : undefined}
              className="animate-masuk absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${(x / LEBAR) * 100}%`, top: `${(y / TINGGI) * 100}%`, width: `${lebarPulau}%`, animationDelay: `${i * 0.08}s` }}
            >
              <button
                onClick={() => {
                  if (!terbuka) return
                  pop()
                  onPulau(pl.id)
                }}
                disabled={!terbuka}
                aria-label={pl.nama}
                className="relative w-full transition-transform active:scale-95"
                style={{ aspectRatio: '240 / 180' }}
              >
                <GambarPulau id={pl.id} terkunci={!terbuka} />
                {!terbuka && (
                  <span className="absolute left-1/2 top-[40%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#8a94a6] bg-white shadow-[0_4px_0_rgba(0,0,0,0.2)]">
                    <IkonGembok ukuran={30} />
                  </span>
                )}
                {aktif && (
                  <span className="animate-lompat absolute top-[8%] right-[2%]" style={{ animationIterationCount: 'infinite', animationDuration: '1.6s' }}>
                    <Nuri ukuran={70} ekspresi="senang" dipakai={p.dipakai} />
                  </span>
                )}
              </button>

              {/* papan nama kayu */}
              <div className="-mt-3 flex flex-col items-center">
                <div
                  className="judul-game rounded-xl border-[3px] border-[#7a4e22] px-3 py-1 text-center text-[0.95rem] leading-tight shadow-[0_4px_0_#5a3612]"
                  style={{ background: 'linear-gradient(180deg,#d9a066,#b07438)', ['--g' as string]: '#5a3612' }}
                >
                  {pl.nama.replace('Pulau ', '')}
                </div>
                <div className="-mt-0.5 flex items-center gap-1 rounded-b-xl bg-white/90 px-2.5 py-0.5 text-xs font-extrabold text-[#6b4e24] shadow">
                  {!terbuka ? (
                    'Selesaikan pulau sebelumnya'
                  ) : maks === 0 ? (
                    '✨ Tujuan akhir kita!'
                  ) : (
                    <>
                      <IkonBintang ukuran={14} /> {bintang}/{maks}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ===== MENU BAWAH ===== */}
      <div className="sticky bottom-0 z-30 grid grid-cols-3 gap-3 bg-gradient-to-t from-[#1f97c6] via-[#1f97c6]/85 to-transparent px-4 pb-4 pt-8">
        <TombolMenu onClick={onLemari} label="Lemari Nuri" ikon={<IkonLemari ukuran={34} />} />
        <TombolMenu onClick={onMisi} label="Misi Hari Ini" ikon={<IkonMisi ukuran={34} />} titik={!misiHariIniSelesai} />
        <TombolMenu onClick={onOrtu} label="Orang Tua" ikon={<IkonOrangTua ukuran={34} />} />
      </div>
    </div>
  )
}

function TombolMenu({ onClick, label, ikon, titik }: { onClick: () => void; label: string; ikon: React.ReactNode; titik?: boolean }) {
  return (
    <button onClick={onClick} className="tombol-game krem relative flex flex-col items-center py-2 text-sm">
      {ikon}
      <span className="relative">{label}</span>
      {titik && <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-white bg-[#ff6b6b] shadow" />}
    </button>
  )
}

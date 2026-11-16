/** Peta petualangan: 6 pulau di jalur berliku. */
import BarAtas from '../components/BarAtas'
import { IkonBintang, IkonGembok, IkonLemari, IkonMisi, IkonOrangTua } from '../components/Ikon'
import Nuri from '../components/Nuri'
import { PULAU, stagesOfPulau } from '../data/stages'
import { useProgres } from '../lib/progres'
import { pop } from '../lib/efekSuara'

type Props = {
  onPulau: (id: number) => void
  onLemari: () => void
  onMisi: () => void
  onOrtu: () => void
}

// posisi pulau (persen lebar) di jalur zig-zag
const POSISI_X = [26, 72, 30, 70, 28, 70]
const JARAK = 170

export default function Peta({ onPulau, onLemari, onMisi, onOrtu }: Props) {
  const { p, misiHariIniSelesai, stageTerbuka } = useProgres()
  const tinggi = PULAU.length * JARAK + 140

  // titik-titik jalur untuk garis putus-putus
  const titik = PULAU.map((_, i) => ({ x: POSISI_X[i], y: i * JARAK + 90 }))
  const jalur = titik
    .map((t, i) => {
      if (i === 0) return `M ${t.x} ${t.y}`
      const s = titik[i - 1]
      const tengahY = (s.y + t.y) / 2
      return `C ${s.x} ${tengahY}, ${t.x} ${tengahY}, ${t.x} ${t.y}`
    })
    .join(' ')

  // pulau yang sedang aktif (tempat Nuri berdiri)
  const pulauAktif = stageTerbuka('k1') ? 2 : 1

  return (
    <div className="flex min-h-full flex-col">
      <BarAtas judul="Peta Petualangan" />

      <div className="relative mx-auto w-full max-w-md shrink-0 grow" style={{ minHeight: tinggi }}>
        {/* laut */}
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${tinggi}`} preserveAspectRatio="none" aria-hidden>
          <path d={jalur} stroke="#ffffff" strokeWidth="5" strokeDasharray="2 12" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" opacity="0.9" />
        </svg>

        {PULAU.map((pl, i) => {
          const stages = stagesOfPulau(pl.id)
          const bintang = stages.reduce((a, s) => a + (p.bintang[s.id] ?? 0), 0)
          const maks = stages.length * 3
          const terbuka = pl.tersedia && (pl.id === 1 || stageTerbuka(stages[0].id))
          return (
            <div
              key={pl.id}
              className="animate-masuk absolute flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${POSISI_X[i]}%`, top: i * JARAK + 20, animationDelay: `${i * 0.1}s` }}
            >
              <button
                onClick={() => {
                  if (!pl.tersedia) return
                  pop()
                  onPulau(pl.id)
                }}
                disabled={!pl.tersedia}
                className={`relative flex h-32 w-40 flex-col items-center justify-center ${pl.tersedia ? '' : 'grayscale-[70%]'}`}
                aria-label={pl.nama}
              >
                {/* bentuk pulau */}
                <svg viewBox="0 0 160 128" className="absolute inset-0 h-full w-full" aria-hidden>
                  <ellipse cx="80" cy="96" rx="76" ry="26" fill="#9fdcf7" opacity="0.6" />
                  <ellipse cx="80" cy="88" rx="70" ry="28" fill="#ffe6a7" />
                  <ellipse cx="80" cy="74" rx="62" ry="34" fill={pl.warna} />
                  <circle cx="34" cy="62" r="7" fill="#fff" opacity="0.35" />
                </svg>
                <span className="relative">
                  {pl.tersedia ? (
                    <span className="arab block text-4xl font-bold text-tinta">{pl.ikon}</span>
                  ) : (
                    <IkonGembok ukuran={40} />
                  )}
                </span>
                {pl.id === pulauAktif && (
                  <span className="animate-melayang absolute -right-6 -top-10">
                    <Nuri ukuran={64} ekspresi="senang" dipakai={p.dipakai} />
                  </span>
                )}
              </button>
              <div className="-mt-1 max-w-44 rounded-xl bg-white/90 px-3 py-1 text-center text-sm font-extrabold leading-tight shadow">
                {pl.nama}
                {pl.tersedia ? (
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                    {terbuka ? (
                      <>
                        <IkonBintang ukuran={14} /> {bintang}/{maks}
                      </>
                    ) : (
                      'Selesaikan pulau sebelumnya'
                    )}
                  </div>
                ) : (
                  <div className="text-xs font-bold text-ungu">Segera hadir</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* menu bawah */}
      <div className="sticky bottom-0 z-20 grid grid-cols-3 gap-3 bg-gradient-to-t from-[#fff8e6] via-[#fff8e6]/95 to-transparent px-4 pb-4 pt-6">
        <button onClick={onLemari} className="tombol flex flex-col items-center bg-white py-2 text-sm">
          <IkonLemari ukuran={32} />
          Lemari Nuri
        </button>
        <button onClick={onMisi} className="tombol relative flex flex-col items-center bg-white py-2 text-sm">
          <IkonMisi ukuran={32} />
          Misi Hari Ini
          {!misiHariIniSelesai && <span className="absolute right-3 top-2 h-3 w-3 rounded-full bg-jeruk" />}
        </button>
        <button onClick={onOrtu} className="tombol flex flex-col items-center bg-white py-2 text-sm">
          <IkonOrangTua ukuran={32} />
          Orang Tua
        </button>
      </div>
    </div>
  )
}

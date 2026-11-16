/** Efek visual: bintang beterbangan & konfeti. */
import { useMemo } from 'react'
import { IkonBintang } from './Ikon'

export function LedakanBintang({ pemicu }: { pemicu: number }) {
  const bintang = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const sudut = (i / 8) * Math.PI * 2
        return { dx: Math.cos(sudut) * 120, dy: Math.sin(sudut) * 120 }
      }),
    [],
  )
  if (!pemicu) return null
  return (
    <div key={pemicu} className="pointer-events-none absolute left-1/2 top-1/2 z-30">
      {bintang.map((b, i) => (
        <span key={i} className="bintang-terbang" style={{ ['--dx' as string]: `${b.dx}px`, ['--dy' as string]: `${b.dy}px` }}>
          <IkonBintang ukuran={34} />
        </span>
      ))}
    </div>
  )
}

const WARNA = ['#ff6b6b', '#ffd166', '#4cb8e8', '#5cc96b', '#9b8cf2', '#ff8fab']

export function Konfeti() {
  const potongan = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        kiri: Math.random() * 100,
        tunda: Math.random() * 1.2,
        durasi: 2.4 + Math.random() * 2,
        warna: WARNA[i % WARNA.length],
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {potongan.map((k, i) => (
        <span
          key={i}
          className="konfeti"
          style={{ left: `${k.kiri}%`, background: k.warna, animationDelay: `${k.tunda}s`, animationDuration: `${k.durasi}s` }}
        />
      ))}
    </div>
  )
}

export function BarisBintang({ jumlah, ukuran = 22, animasi = false }: { jumlah: number; ukuran?: number; animasi?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {[1, 2, 3].map((n) => (
        <span key={n} className={animasi && n <= jumlah ? 'animate-putar-masuk' : ''} style={{ animationDelay: `${0.3 + n * 0.35}s` }}>
          <IkonBintang ukuran={ukuran} isi={n <= jumlah} />
        </span>
      ))}
    </div>
  )
}

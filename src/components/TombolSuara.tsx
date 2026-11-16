/**
 * Tombol putar suara bacaan.
 * Kalau file audio belum ada → ikon speaker abu-abu + tulisan "audio belum tersedia".
 */
import { useEffect, useState } from 'react'
import { cekAudio, putar } from '../lib/audio'
import { IkonSpeaker } from './Ikon'

type Props = {
  src: string
  besar?: boolean
  otomatis?: boolean // putar otomatis saat muncul
  onPutar?: () => void
}

export default function TombolSuara({ src, besar = false, otomatis = false, onPutar }: Props) {
  const [ada, setAda] = useState<boolean | null>(null)
  const [main, setMain] = useState(false)

  useEffect(() => {
    let batal = false
    cekAudio(src).then((ok) => {
      if (batal) return
      setAda(ok)
      if (ok && otomatis) void putar(src)
    })
    return () => {
      batal = true
    }
  }, [src, otomatis])

  const tekan = async () => {
    onPutar?.()
    if (!ada) return
    setMain(true)
    await putar(src)
    setTimeout(() => setMain(false), 600)
  }

  const ukuran = besar ? 'w-20 h-20' : 'w-14 h-14'
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={tekan}
        aria-label={ada ? 'Putar suara' : 'Audio belum tersedia'}
        className={`tombol ${ukuran} flex items-center justify-center rounded-full ${
          ada ? 'bg-laut text-white' : 'bg-slate-200 text-slate-400'
        } ${main ? 'animate-denyut' : ''}`}
      >
        <IkonSpeaker ukuran={besar ? 40 : 28} mati={ada === false} />
      </button>
      {ada === false && <span className="text-[11px] leading-tight text-slate-500">audio belum tersedia</span>}
    </div>
  )
}

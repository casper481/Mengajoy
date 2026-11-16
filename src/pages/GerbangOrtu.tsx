/** Gerbang orang tua: soal perkalian sederhana untuk orang dewasa. */
import { useMemo, useState } from 'react'
import BarAtas from '../components/BarAtas'

export default function GerbangOrtu({ onLolos, onKembali }: { onLolos: () => void; onKembali: () => void }) {
  const [a, b] = useMemo(() => [6 + Math.floor(Math.random() * 4), 6 + Math.floor(Math.random() * 4)], [])
  const [isian, setIsian] = useState('')
  const [salah, setSalah] = useState(false)

  const tekan = (d: string) => {
    setSalah(false)
    if (d === '⌫') return setIsian((s) => s.slice(0, -1))
    if (d === 'OK') {
      if (Number(isian) === a * b) onLolos()
      else {
        setSalah(true)
        setIsian('')
      }
      return
    }
    setIsian((s) => (s.length < 3 ? s + d : s))
  }

  return (
    <div className="flex min-h-full flex-col">
      <BarAtas onKembali={onKembali} judul="Khusus Orang Tua" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
        <div className="text-center text-lg font-bold text-slate-600">Jawab soal ini untuk masuk:</div>
        <div className="text-5xl font-extrabold">
          {a} × {b} = ?
        </div>
        <div className={`flex h-16 w-40 items-center justify-center rounded-2xl bg-white text-4xl font-extrabold shadow ${salah ? 'animate-goyang' : ''}`}>
          {isian || <span className="text-slate-300">_</span>}
        </div>
        {salah && <div className="font-bold text-slate-500">Jawaban belum tepat, coba lagi.</div>}
        <div className="grid w-full max-w-xs grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].map((d) => (
            <button key={d} onClick={() => tekan(d)} className={`tombol py-4 text-2xl ${d === 'OK' ? 'bg-daun text-white' : 'bg-white'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

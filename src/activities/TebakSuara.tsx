/** Aktivitas 2: "Tebak Suara" — dengarkan, lalu pilih huruf yang benar. */
import { useEffect, useMemo, useState } from 'react'
import { LedakanBintang } from '../components/Efek'
import NuriBicara from '../components/NuriBicara'
import TombolSuara from '../components/TombolSuara'
import { cekAudio } from '../lib/audio'
import { sorak, ting } from '../lib/efekSuara'
import { acak } from '../lib/tanggal'
import { pujianAcak, type Item } from './tipe'
import type { Ekspresi } from '../components/Nuri'

type Props = {
  items: Item[]
  maksSoal?: number
  onSelesai: (salah: number) => void
}

function buatPilihan(target: Item, semua: Item[], jumlah: number): Item[] {
  const lain = acak(semua.filter((x) => x.id !== target.id))
  // utamakan pengecoh yang hurufnya sama (untuk latihan harakat campuran)
  lain.sort((a, b) => Number(b.huruf === target.huruf && !!target.huruf) - Number(a.huruf === target.huruf && !!target.huruf))
  return acak([target, ...lain.slice(0, jumlah - 1)])
}

export default function TebakSuara({ items, maksSoal = 4, onSelesai }: Props) {
  const soal = useMemo(() => acak(items).slice(0, maksSoal), [items, maksSoal])
  const [no, setNo] = useState(0)
  const [salahTotal, setSalahTotal] = useState(0)
  const [dicoret, setDicoret] = useState<string[]>([])
  const [benar, setBenar] = useState(false)
  const [goyang, setGoyang] = useState<string | null>(null)
  const [ledak, setLedak] = useState(0)
  const [pesan, setPesan] = useState<{ teks: string; ekspresi: Ekspresi }>({ teks: 'Dengarkan suaranya, lalu pilih yang benar!', ekspresi: 'biasa' })
  const [audioAda, setAudioAda] = useState(true)

  const target = soal[no]
  const pilihan = useMemo(() => buatPilihan(target, items, Math.min(3, items.length)), [target, items])

  useEffect(() => {
    cekAudio(target.audio).then(setAudioAda)
  }, [target])

  const pilih = (x: Item) => {
    if (benar || dicoret.includes(x.id)) return
    if (x.id === target.id) {
      ting()
      setBenar(true)
      setLedak((n) => n + 1)
      setPesan({ teks: `${pujianAcak()} Itu "${target.latin}"!`, ekspresi: 'sorak' })
      setTimeout(() => {
        if (no + 1 >= soal.length) {
          sorak()
          onSelesai(salahTotal)
          return
        }
        setNo(no + 1)
        setBenar(false)
        setDicoret([])
        setPesan({ teks: 'Dengarkan lagi, ya!', ekspresi: 'biasa' })
      }, 1400)
    } else {
      // Salah: TANPA suara negatif. Nuri memberi petunjuk dengan lembut.
      setSalahTotal((n) => n + 1)
      setDicoret((d) => [...d, x.id])
      setGoyang(x.id)
      setTimeout(() => setGoyang(null), 500)
      setPesan({ teks: `Hampir! Coba lagi ya. Petunjuk: ${target.petunjuk}.`, ekspresi: 'mikir' })
    }
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-4">
        <NuriBicara teks={pesan.teks} ekspresi={pesan.ekspresi} animasi={pesan.ekspresi === 'sorak' ? 'animate-lompat' : ''} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center-safe gap-5 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col items-center gap-2">
          <TombolSuara key={target.audio} src={target.audio} besar otomatis />
          {!audioAda && (
            <div className="rounded-2xl bg-white px-5 py-2 text-center shadow">
              <div className="text-sm font-bold text-slate-500">Cari yang dibaca:</div>
              <div className="text-4xl font-extrabold">{target.latin}</div>
            </div>
          )}
        </div>

        <div className={`grid w-full gap-3 ${pilihan.length === 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {pilihan.map((x, i) => {
            const coret = dicoret.includes(x.id)
            const iniBenar = benar && x.id === target.id
            return (
              <button
                key={x.id + no}
                onClick={() => pilih(x)}
                className={`tombol animate-masuk flex aspect-square items-center justify-center border-4 bg-white ${
                  iniBenar ? 'border-daun bg-green-50' : 'border-transparent'
                } ${coret ? '!bg-slate-100 !shadow-none' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
                aria-label={`Pilihan ${i + 1}`}
              >
                <span className={`arab text-7xl leading-none ${coret ? 'opacity-25' : ''} ${goyang === x.id ? 'animate-goyang inline-block' : ''}`}>{x.arab}</span>
              </button>
            )
          })}
        </div>

        <div className="flex gap-2">
          {soal.map((_, i) => (
            <span key={i} className={`h-3 w-3 rounded-full ${i < no || (i === no && benar) ? 'bg-bintang' : 'bg-white'}`} />
          ))}
        </div>
      </div>
      <LedakanBintang pemicu={ledak} />
    </div>
  )
}

/** Aktivitas 2 (Level 3–5): soal pilihan ganda — membaca kata, mad, atau mengenali hukum tajwid. */
import { useState } from 'react'
import { LedakanBintang } from '../components/Efek'
import NuriBicara from '../components/NuriBicara'
import type { Ekspresi } from '../components/Nuri'
import TombolSuara from '../components/TombolSuara'
import { sorak, ting } from '../lib/efekSuara'
import { pujianAcak, ukuranArab, type Soal } from './tipe'

export default function PilihJawaban({ soal, onSelesai }: { soal: Soal[]; onSelesai: (salah: number) => void }) {
  const [no, setNo] = useState(0)
  const [salah, setSalah] = useState(0)
  const [dicoret, setDicoret] = useState<number[]>([])
  const [benar, setBenar] = useState(false)
  const [goyang, setGoyang] = useState<number | null>(null)
  const [ledak, setLedak] = useState(0)
  const [pesan, setPesan] = useState<{ teks: string; ekspresi: Ekspresi } | null>(null)

  const s = soal[no]

  const pilih = (i: number) => {
    if (benar || dicoret.includes(i)) return
    if (i === s.benar) {
      ting()
      setBenar(true)
      setLedak((n) => n + 1)
      setPesan({ teks: s.pilihanArab ? `${pujianAcak()} Itu dibaca "${s.tampil}".` : `${pujianAcak()} Jawabannya "${s.pilihan[i]}".`, ekspresi: 'sorak' })
      setTimeout(() => {
        if (no + 1 >= soal.length) {
          sorak()
          onSelesai(salah)
          return
        }
        setNo(no + 1)
        setBenar(false)
        setDicoret([])
        setPesan(null)
      }, 1500)
    } else {
      // Salah: tanpa suara negatif, Nuri memberi petunjuk dengan lembut
      setSalah((n) => n + 1)
      setDicoret((d) => [...d, i])
      setGoyang(i)
      setTimeout(() => setGoyang(null), 500)
      setPesan({ teks: `Hampir! Coba lagi ya. Petunjuk: ${s.petunjuk}`, ekspresi: 'mikir' })
    }
  }

  const kolom = s.pilihan.length === 2 ? 'grid-cols-2' : s.pilihanArab ? 'grid-cols-3' : 'grid-cols-1'

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-4">
        <NuriBicara
          ukuran={64}
          teks={pesan?.teks ?? s.tanya}
          ekspresi={pesan?.ekspresi ?? 'biasa'}
          animasi={pesan?.ekspresi === 'sorak' ? 'animate-lompat' : ''}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center-safe gap-4 overflow-y-auto px-4 pb-4">
        <div key={no} className="animate-masuk flex min-h-32 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-[2rem] bg-white px-4 py-4 shadow-xl">
          {s.tampilArab ? (
            <span className={`arab ${ukuranArab(s.tampil)} text-center leading-tight`}>{s.tampil}</span>
          ) : (
            <span className="text-4xl font-extrabold">{s.tampil}</span>
          )}
          {s.audio && <TombolSuara key={s.audio} src={s.audio} otomatis />}
        </div>

        <div className={`grid w-full gap-3 ${kolom}`}>
          {s.pilihan.map((p, i) => {
            const coret = dicoret.includes(i)
            const iniBenar = benar && i === s.benar
            return (
              <button
                key={no + '-' + i}
                onClick={() => pilih(i)}
                className={`tombol animate-masuk flex min-h-16 items-center justify-center border-4 bg-white px-3 py-2 ${
                  iniBenar ? 'border-daun bg-green-50' : 'border-transparent'
                } ${coret ? '!bg-slate-100 !shadow-none' : ''}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span
                  className={`${s.pilihanArab ? `arab ${ukuranArab(p, 'pilihan')} leading-tight` : 'text-xl font-extrabold'} ${coret ? 'opacity-25' : ''} ${
                    goyang === i ? 'animate-goyang inline-block' : ''
                  }`}
                >
                  {p}
                </span>
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

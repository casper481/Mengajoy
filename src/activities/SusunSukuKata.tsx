/** Aktivitas 3 (Level 2): "Susun Suku Kata" — pilih huruf + harakat yang tepat. */
import { useMemo, useState } from 'react'
import { LedakanBintang } from '../components/Efek'
import NuriBicara from '../components/NuriBicara'
import type { Ekspresi } from '../components/Nuri'
import TombolSuara from '../components/TombolSuara'
import { HARAKAT, harakatById, type HarakatId } from '../data/harakat'
import { pop, sorak, ting } from '../lib/efekSuara'
import { acak } from '../lib/tanggal'
import { namaHuruf, pujianAcak, type Item } from './tipe'

const ARAB_HURUF: Record<string, string> = { ba: 'ب', ta: 'ت', tsa: 'ث', jim: 'ج', dal: 'د', ro: 'ر', kaf: 'ك' }

export default function SusunSukuKata({ items, onSelesai }: { items: Item[]; onSelesai: (salah: number) => void }) {
  const soal = useMemo(() => acak(items).slice(0, 4), [items])
  const semuaHuruf = useMemo(() => [...new Set(items.map((i) => i.huruf!))], [items])

  const [no, setNo] = useState(0)
  const [huruf, setHuruf] = useState<string | null>(null)
  const [harakat, setHarakat] = useState<HarakatId | null>(null)
  const [salah, setSalah] = useState(0)
  const [benar, setBenar] = useState(false)
  const [ledak, setLedak] = useState(0)
  const [pesan, setPesan] = useState<{ teks: string; ekspresi: Ekspresi }>({
    teks: 'Susun bacaannya! Pilih huruf, lalu pilih harakat.',
    ekspresi: 'biasa',
  })

  const target = soal[no]
  const pilihanHuruf = useMemo(() => {
    const lain = acak(semuaHuruf.filter((h) => h !== target.huruf)).slice(0, 2)
    return acak([target.huruf!, ...lain])
  }, [target, semuaHuruf])

  const cek = (h: string | null, k: HarakatId | null) => {
    if (!h || !k) return
    if (h === target.huruf && k === target.harakat) {
      ting()
      setBenar(true)
      setLedak((n) => n + 1)
      setPesan({ teks: `${pujianAcak()} Bacanya "${target.latin}"!`, ekspresi: 'sorak' })
      setTimeout(() => {
        if (no + 1 >= soal.length) {
          sorak()
          onSelesai(salah)
          return
        }
        setNo(no + 1)
        setHuruf(null)
        setHarakat(null)
        setBenar(false)
        setPesan({ teks: 'Ayo susun yang berikutnya!', ekspresi: 'biasa' })
      }, 1500)
      return
    }
    setSalah((n) => n + 1)
    const hk = harakatById(target.harakat as HarakatId)
    if (h !== target.huruf && k !== target.harakat) {
      setPesan({ teks: `Hampir! Coba lagi ya. Hurufnya ${namaHuruf(target.huruf!)}, bunyinya "${hk.bunyi.toLowerCase()}".`, ekspresi: 'mikir' })
      setHuruf(null)
      setHarakat(null)
    } else if (h !== target.huruf) {
      setPesan({ teks: `Harakatnya sudah benar! Sekarang cari huruf ${namaHuruf(target.huruf!)}.`, ekspresi: 'mikir' })
      setHuruf(null)
    } else {
      setPesan({ teks: `Hurufnya sudah benar! Bunyi "${hk.bunyi.toLowerCase()}" itu ${hk.nama}: ${hk.posisi.split(',')[0].toLowerCase()}.`, ekspresi: 'mikir' })
      setHarakat(null)
    }
  }

  const pilihHuruf = (h: string) => {
    if (benar) return
    pop()
    setHuruf(h)
    cek(h, harakat)
  }
  const pilihHarakat = (k: HarakatId) => {
    if (benar) return
    pop()
    setHarakat(k)
    cek(huruf, k)
  }

  const hasil = huruf ? ARAB_HURUF[huruf] + (harakat ? harakatById(harakat).tanda : '') : ''

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-4">
        <NuriBicara ukuran={64} teks={pesan.teks} ekspresi={pesan.ekspresi} animasi={pesan.ekspresi === 'sorak' ? 'animate-lompat' : ''} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center-safe gap-3 overflow-y-auto px-4 pb-4">
        <div className="flex items-center gap-4 rounded-3xl bg-white px-5 py-2 shadow">
          <div className="text-center">
            <div className="text-sm font-bold text-slate-500">Susun bacaan:</div>
            <div className="text-4xl font-extrabold">{target.latin}</div>
          </div>
          <TombolSuara key={target.audio} src={target.audio} otomatis />
        </div>

        {/* Kotak hasil susunan */}
        <div className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-[2rem] border-4 border-dashed ${benar ? 'border-daun bg-green-50' : 'border-slate-300 bg-white/70'}`}>
          <span key={hasil} className="arab animate-masuk text-7xl leading-none">{hasil}</span>
        </div>

        <div className="w-full">
          <div className="mb-1 text-center text-sm font-bold text-slate-500">1. Pilih huruf</div>
          <div className="grid grid-cols-3 gap-3">
            {pilihanHuruf.map((h) => (
              <button key={h + no} onClick={() => pilihHuruf(h)} className={`tombol flex h-16 items-center justify-center border-4 bg-white ${huruf === h ? 'border-laut' : 'border-transparent'}`}>
                <span className="arab text-4xl leading-none">{ARAB_HURUF[h]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full">
          <div className="mb-1 text-center text-sm font-bold text-slate-500">2. Pilih harakat</div>
          <div className="grid grid-cols-3 gap-3">
            {HARAKAT.map((k) => (
              <button
                key={k.id}
                onClick={() => pilihHarakat(k.id)}
                className={`tombol flex h-16 flex-col items-center justify-center border-4 bg-white ${harakat === k.id ? 'border-laut' : 'border-transparent'}`}
              >
                <span className="arab text-3xl leading-none" style={{ color: k.warna }}>{'◌' + k.tanda}</span>
                <span className="text-xs font-extrabold">{k.nama}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-4" />
      <LedakanBintang pemicu={ledak} />
    </div>
  )
}

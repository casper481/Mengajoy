/** Aktivitas 3 (Level 1): "Cari Pasangan" — memory game huruf ↔ nama. */
import { useMemo, useState } from 'react'
import { LedakanBintang } from '../components/Efek'
import NuriBicara from '../components/NuriBicara'
import type { Ekspresi } from '../components/Nuri'
import { putar } from '../lib/audio'
import { pop, sorak, ting } from '../lib/efekSuara'
import { acak } from '../lib/tanggal'
import { pujianAcak, type Item } from './tipe'

type Kartu = { kunci: string; id: string; jenis: 'arab' | 'latin'; item: Item }

export default function CariPasangan({ items, onSelesai }: { items: Item[]; onSelesai: (salah: number) => void }) {
  const kartu = useMemo<Kartu[]>(() => {
    const dipakai = acak(items).slice(0, 4)
    return acak(
      dipakai.flatMap((it) => [
        { kunci: it.id + '-a', id: it.id, jenis: 'arab' as const, item: it },
        { kunci: it.id + '-l', id: it.id, jenis: 'latin' as const, item: it },
      ]),
    )
  }, [items])

  const [terbuka, setTerbuka] = useState<string[]>([])
  const [cocok, setCocok] = useState<string[]>([])
  const [salah, setSalah] = useState(0)
  const [kunci, setKunci] = useState(false)
  const [ledak, setLedak] = useState(0)
  const [pesan, setPesan] = useState<{ teks: string; ekspresi: Ekspresi }>({
    teks: 'Balik dua kartu. Cocokkan huruf dengan namanya!',
    ekspresi: 'biasa',
  })

  const tekan = (k: Kartu) => {
    if (kunci || terbuka.includes(k.kunci) || cocok.includes(k.id)) return
    pop()
    if (k.jenis === 'arab') void putar(k.item.audio)
    const baru = [...terbuka, k.kunci]
    setTerbuka(baru)
    if (baru.length < 2) return

    const [a, b] = baru.map((x) => kartu.find((c) => c.kunci === x)!)
    if (a.id === b.id) {
      ting()
      setLedak((n) => n + 1)
      const sudah = [...cocok, a.id]
      setCocok(sudah)
      setTerbuka([])
      setPesan({ teks: `${pujianAcak()} Pasangan "${a.item.latin}" ketemu!`, ekspresi: 'sorak' })
      if (sudah.length * 2 === kartu.length) {
        setTimeout(() => {
          sorak()
          onSelesai(salah)
        }, 1300)
      }
    } else {
      setSalah((n) => n + 1)
      setKunci(true)
      setPesan({ teks: 'Hampir! Coba lagi ya. Ingat-ingat letak kartunya.', ekspresi: 'mikir' })
      setTimeout(() => {
        setTerbuka([])
        setKunci(false)
      }, 1000)
    }
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-4">
        <NuriBicara teks={pesan.teks} ekspresi={pesan.ekspresi} animasi={pesan.ekspresi === 'sorak' ? 'animate-lompat' : ''} />
      </div>
      <div className="flex min-h-0 flex-1 items-center overflow-y-auto px-4 py-2">
        <div className="grid w-full grid-cols-4 gap-2.5">
          {kartu.map((k, i) => {
            const buka = terbuka.includes(k.kunci) || cocok.includes(k.id)
            const sudahCocok = cocok.includes(k.id)
            return (
              <button
                key={k.kunci}
                onClick={() => tekan(k)}
                className={`kartu animate-masuk aspect-[3/4] ${buka ? 'terbuka' : ''}`}
                style={{ animationDelay: `${i * 0.06}s` }}
                aria-label={buka ? (k.jenis === 'arab' ? 'Kartu huruf' : k.item.latin) : 'Kartu tertutup'}
              >
                <div className="kartu-isi">
                  <div className="kartu-belakang bg-gradient-to-br from-ungu to-laut shadow-[0_5px_0_rgba(0,0,0,0.18)]">
                    <span className="text-4xl font-extrabold text-white/90">?</span>
                  </div>
                  <div className={`kartu-muka border-4 bg-white shadow-[0_5px_0_rgba(0,0,0,0.12)] ${sudahCocok ? 'border-daun' : 'border-white'}`}>
                    {k.jenis === 'arab' ? (
                      <span className="arab text-5xl leading-none">{k.item.arab}</span>
                    ) : (
                      <span className="text-lg font-extrabold">{k.item.latin}</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="h-6" />
      <LedakanBintang pemicu={ledak} />
    </div>
  )
}

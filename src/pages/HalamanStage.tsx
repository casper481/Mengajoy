/** Satu stage = Kenalan → Tebak Suara → Cari Pasangan / Susun Suku Kata → Perayaan. */
import { useMemo, useState } from 'react'
import CariPasangan from '../activities/CariPasangan'
import Kenalan from '../activities/Kenalan'
import SusunSukuKata from '../activities/SusunSukuKata'
import TebakSuara from '../activities/TebakSuara'
import { hitungBintang, itemsDariStage } from '../activities/tipe'
import { BarisBintang, Konfeti } from '../components/Efek'
import Nuri from '../components/Nuri'
import { hadiahById } from '../data/hadiah'
import { stageById } from '../data/stages'
import { perayaan } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

type Props = { stageId: string; onKembali: () => void; onUlang: () => void }

export default function HalamanStage({ stageId, onKembali, onUlang }: Props) {
  const stage = stageById(stageId)
  const items = useMemo(() => itemsDariStage(stage), [stage])
  const { selesaiStage, tandaiBelajar } = useProgres()

  const [langkah, setLangkah] = useState(0)
  const [salah, setSalah] = useState(0)
  const [hasil, setHasil] = useState<{ bintang: number; hadiah: string | null } | null>(null)

  const namaAktivitas = ['Kenalan', 'Tebak Suara', stage.jenis === 'huruf' ? 'Cari Pasangan' : 'Susun Suku Kata']

  const selesaiAktivitas = (salahBaru = 0) => {
    const total = salah + salahBaru
    setSalah(total)
    if (langkah === 0) tandaiBelajar()
    if (langkah < 2) {
      setLangkah(langkah + 1)
      return
    }
    const bintang = hitungBintang(total)
    const hadiah = selesaiStage(stageId, bintang)
    setHasil({ bintang, hadiah })
    setLangkah(3)
    setTimeout(perayaan, 200)
  }

  if (langkah === 3 && hasil) return <Perayaan bintang={hasil.bintang} hadiahId={hasil.hadiah} onLanjut={onKembali} onUlang={onUlang} />

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={onKembali} aria-label="Tutup" className="tombol flex h-12 w-12 items-center justify-center bg-white text-2xl font-extrabold">
          ✕
        </button>
        <div className="flex flex-1 gap-2">
          {namaAktivitas.map((n, i) => (
            <div key={n} className="flex-1">
              <div className={`h-3 rounded-full ${i < langkah ? 'bg-daun' : i === langkah ? 'bg-bintang' : 'bg-white'}`} />
              <div className={`mt-0.5 truncate text-center text-[11px] font-bold ${i === langkah ? 'text-tinta' : 'text-slate-400'}`}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      {langkah === 0 && <Kenalan items={items} harakat={stage.jenis === 'harakat' ? stage.fokus : undefined} onSelesai={() => selesaiAktivitas(0)} />}
      {langkah === 1 && <TebakSuara items={items} maksSoal={stage.jenis === 'harakat' && stage.fokus === 'campuran' ? 5 : 4} onSelesai={selesaiAktivitas} />}
      {langkah === 2 && stage.jenis === 'huruf' && <CariPasangan items={items} onSelesai={(s) => selesaiAktivitas(Math.floor(s / 3))} />}
      {langkah === 2 && stage.jenis === 'harakat' && <SusunSukuKata items={items} onSelesai={selesaiAktivitas} />}
    </div>
  )
}

function Perayaan({ bintang, hadiahId, onLanjut, onUlang }: { bintang: number; hadiahId: string | null; onLanjut: () => void; onUlang: () => void }) {
  const { p } = useProgres()
  const hadiah = hadiahId ? hadiahById(hadiahId) : null
  // tampilkan Nuri memakai hadiah barunya
  const dipakai = hadiah ? { ...p.dipakai, [hadiah.slot]: hadiah.id } : p.dipakai
  return (
    <div className="relative flex min-h-full flex-col items-center justify-between overflow-hidden px-6 py-8">
      <Konfeti />
      <div className="animate-masuk text-center">
        <div className="text-5xl font-extrabold text-tinta">Hebat!</div>
        <div className="text-xl font-bold text-slate-600">Stage selesai!</div>
      </div>

      <BarisBintang jumlah={bintang} ukuran={72} animasi />

      <div className="flex flex-col items-center">
        <div className="animate-lompat">
          <Nuri ukuran={180} ekspresi="sorak" dipakai={dipakai} />
        </div>
        {hadiah ? (
          <div className="animate-masuk mt-2 rounded-3xl bg-white px-6 py-3 text-center shadow-lg" style={{ animationDelay: '1.4s' }}>
            <div className="text-sm font-bold text-slate-500">🎁 Hadiah baru untuk Nuri!</div>
            <div className="text-2xl font-extrabold text-jeruk">{hadiah.nama}</div>
          </div>
        ) : (
          <div className="mt-2 rounded-3xl bg-white px-6 py-3 text-center text-lg font-bold shadow">Nuri senang kamu berlatih lagi!</div>
        )}
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <button onClick={onLanjut} className="tombol w-full bg-daun py-4 text-2xl text-white">Lanjut ➜</button>
        <button onClick={onUlang} className="tombol w-full bg-white py-3 text-lg">Main lagi</button>
      </div>
    </div>
  )
}

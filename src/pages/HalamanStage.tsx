/** Satu stage = Kenalan → Tebak Suara → Cari Pasangan / Susun Suku Kata → Perayaan. */
import { useMemo, useState } from 'react'
import CariPasangan from '../activities/CariPasangan'
import PilihJawaban from '../activities/PilihJawaban'
import Kenalan from '../activities/Kenalan'
import SusunSukuKata from '../activities/SusunSukuKata'
import TebakSuara from '../activities/TebakSuara'
import { hitungBintang, itemsDariStage, itemsPasangan, soalDariStage } from '../activities/tipe'
import { BarisBintang, Konfeti } from '../components/Efek'
import Nuri from '../components/Nuri'
import { hadiahById } from '../data/hadiah'
import { STAGES, stageById, stagesOfPulau } from '../data/stages'
import { perayaan } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

type Props = { stageId: string; onKembali: () => void; onUlang: () => void; onTamat: () => void }

export default function HalamanStage({ stageId, onKembali, onUlang, onTamat }: Props) {
  const stage = stageById(stageId)
  const items = useMemo(() => itemsDariStage(stage), [stage])
  const soal = useMemo(() => (stage.jenis === 'umum' ? soalDariStage(stage) : []), [stage])
  const pasangan = useMemo(() => (stage.jenis === 'umum' ? itemsPasangan(stage) : items), [stage, items])
  const pulauSelesai = stage.nomor === stagesOfPulau(stage.pulau).length
  const { p, selesaiStage, tandaiBelajar } = useProgres()

  const [langkah, setLangkah] = useState(0)
  const [salah, setSalah] = useState(0)
  const [hasil, setHasil] = useState<{ bintang: number; hadiah: string | null; tamat: boolean } | null>(null)

  const namaAktivitas = [
    'Kenalan',
    stage.jenis === 'umum' ? 'Latihan' : 'Tebak Suara',
    stage.jenis === 'harakat' ? 'Susun Suku Kata' : 'Cari Pasangan',
  ]

  const selesaiAktivitas = (salahBaru = 0) => {
    const total = salah + salahBaru
    setSalah(total)
    if (langkah === 0) tandaiBelajar()
    if (langkah < 2) {
      setLangkah(langkah + 1)
      return
    }
    const bintang = hitungBintang(total)
    const tamat = !p.tamatDilihat && STAGES.every((x) => x.id === stageId || (p.bintang[x.id] ?? 0) > 0)
    const hadiah = selesaiStage(stageId, bintang)
    setHasil({ bintang, hadiah, tamat })
    setLangkah(3)
    setTimeout(perayaan, 200)
  }

  if (langkah === 3 && hasil) return <Perayaan bintang={hasil.bintang} hadiahId={hasil.hadiah} pulauSelesai={pulauSelesai} onLanjut={hasil.tamat ? onTamat : onKembali} tamat={hasil.tamat} onUlang={onUlang} />

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={onKembali} aria-label="Tutup" className="tombol-game merah flex h-12 w-12 shrink-0 items-center justify-center !rounded-full text-2xl">
          ✕
        </button>
        <div className="flex flex-1 gap-2">
          {namaAktivitas.map((n, i) => (
            <div key={n} className="flex-1">
              <div className={`h-4 rounded-full border-2 border-white shadow-[0_2px_0_rgba(0,0,0,0.12)] ${i < langkah ? 'bg-daun' : i === langkah ? 'bg-bintang' : 'bg-white/70'}`} />
              <div className={`mt-0.5 truncate text-center text-[11px] font-bold ${i === langkah ? 'text-tinta' : 'text-slate-400'}`}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      {langkah === 0 && <Kenalan items={items} harakat={stage.jenis === 'harakat' ? stage.fokus : undefined} onSelesai={() => selesaiAktivitas(0)} />}
      {langkah === 1 && stage.jenis === 'umum' && <PilihJawaban soal={soal} onSelesai={selesaiAktivitas} />}
      {langkah === 2 && stage.jenis === 'umum' && <CariPasangan items={pasangan} pesanAwal={stage.materi.mode === 'hukum' ? 'Balik dua kartu. Cocokkan contoh dengan nama hukumnya!' : 'Balik dua kartu. Cocokkan tulisan dengan cara bacanya!'} onSelesai={(s) => selesaiAktivitas(Math.floor(s / 3))} />}
      {langkah === 1 && stage.jenis !== 'umum' && <TebakSuara items={items} maksSoal={stage.jenis === 'harakat' && stage.fokus === 'campuran' ? 5 : 4} onSelesai={selesaiAktivitas} />}
      {langkah === 2 && stage.jenis === 'huruf' && <CariPasangan items={items} onSelesai={(s) => selesaiAktivitas(Math.floor(s / 3))} />}
      {langkah === 2 && stage.jenis === 'harakat' && <SusunSukuKata items={items} onSelesai={selesaiAktivitas} />}
    </div>
  )
}

function Perayaan({ bintang, hadiahId, pulauSelesai, tamat, onLanjut, onUlang }: { bintang: number; hadiahId: string | null; pulauSelesai: boolean; tamat: boolean; onLanjut: () => void; onUlang: () => void }) {
  const { p } = useProgres()
  const hadiah = hadiahId ? hadiahById(hadiahId) : null
  // tampilkan Nuri memakai hadiah barunya
  const dipakai = hadiah ? { ...p.dipakai, [hadiah.slot]: hadiah.id } : p.dipakai
  return (
    <div className="relative flex min-h-full flex-col items-center justify-between overflow-hidden px-6 py-8">
      <Konfeti />
      <div className="animate-masuk relative z-10 text-center">
        <div className="judul-game text-6xl" style={{ ['--g' as string]: '#b4520e', color: '#ffc163' }}>
          Hebat!
        </div>
        <div className="panel-game mt-3 px-4 py-1.5 text-lg font-extrabold text-[#6b4e24]">{pulauSelesai ? '🏝️ Pulau selesai! Pulau berikutnya terbuka!' : 'Stage selesai!'}</div>
      </div>

      <div className="relative z-10 drop-shadow-[0_4px_0_rgba(0,0,0,0.12)]">
        <BarisBintang jumlah={bintang} ukuran={76} animasi />
      </div>

      <div className="relative flex flex-col items-center">
        <div className="sinar left-1/2 top-[38%]" style={{ marginLeft: -260, marginTop: -260 }} />
        <div className="animate-lompat relative">
          <Nuri ukuran={190} ekspresi="sorak" dipakai={dipakai} />
        </div>
        {hadiah ? (
          <div className="panel-game animate-masuk relative mt-2 px-6 py-3 text-center" style={{ animationDelay: '1.4s' }}>
            <div className="text-sm font-extrabold text-[#9a7b4f]">🎁 Hadiah baru untuk Nuri!</div>
            <div className="judul-game text-2xl" style={{ ['--g' as string]: '#b4520e', color: '#ffb347' }}>
              {hadiah.nama}
            </div>
          </div>
        ) : (
          <div className="panel-game relative mt-2 px-6 py-3 text-center text-lg font-extrabold text-[#6b4e24]">Nuri senang kamu berlatih lagi!</div>
        )}
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-3">
        <button onClick={onLanjut} className={`tombol-game w-full py-4 text-2xl ${tamat ? 'jeruk animate-denyut' : ''}`}>{tamat ? '🎓 Ada kejutan!' : 'Lanjut ➜'}</button>
        <button onClick={onUlang} className="tombol-game krem w-full py-3 text-lg">Main lagi</button>
      </div>
    </div>
  )
}

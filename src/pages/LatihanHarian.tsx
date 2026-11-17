/** Latihan Harian: 6 soal acak dari bacaan yang sudah dipelajari (murojaah). */
import { useMemo, useRef, useState } from 'react'
import PilihJawaban from '../activities/PilihJawaban'
import { Konfeti } from '../components/Efek'
import { IkonApi } from '../components/Ikon'
import Nuri from '../components/Nuri'
import { perayaan } from '../lib/efekSuara'
import { buatLatihanHarian } from '../lib/latihan'
import { useProgres } from '../lib/progres'

export default function LatihanHarian({ onKembali }: { onKembali: () => void }) {
  const { p, catatLatihan, streakAktif } = useProgres()
  // soal dibuat sekali saat halaman dibuka
  const soal = useMemo(() => buatLatihanHarian(p.bintang, p.statistik), []) // eslint-disable-line react-hooks/exhaustive-deps
  const hasil = useRef<{ kunci: string; salah: number }[]>([])
  const [selesai, setSelesai] = useState(false)

  if (!soal.length) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <Nuri ukuran={150} ekspresi="mikir" dipakai={p.dipakai} />
        <div className="text-xl font-extrabold">Selesaikan satu stage dulu, nanti kita latihan bersama!</div>
        <button onClick={onKembali} className="tombol-game px-8 py-3 text-xl">Kembali</button>
      </div>
    )
  }

  if (selesai) {
    const benarSemua = hasil.current.filter((h) => h.salah === 0).length
    return (
      <div className="relative flex min-h-full flex-col items-center justify-between overflow-hidden px-6 py-8">
        <Konfeti />
        <div className="animate-masuk text-center">
          <div className="text-4xl font-extrabold">Latihan selesai!</div>
          <div className="mt-1 text-lg font-bold text-slate-600">
            {benarSemua} dari {soal.length} langsung benar
          </div>
        </div>
        <div className="animate-lompat">
          <Nuri ukuran={180} ekspresi="sorak" dipakai={p.dipakai} />
        </div>
        <div className="flex items-center gap-2 rounded-3xl bg-white px-6 py-3 text-xl font-extrabold shadow-lg">
          <IkonApi ukuran={32} /> {streakAktif} hari berturut-turut!
        </div>
        <div className="text-center font-bold text-slate-600">Mengulang itu kunci supaya tidak lupa. Sampai besok, ya!</div>
        <button onClick={onKembali} className="tombol-game w-full max-w-sm py-4 text-2xl">Kembali ke peta</button>
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-3 px-4 pt-3 pb-2">
        <button onClick={onKembali} aria-label="Tutup" className="tombol flex h-12 w-12 items-center justify-center bg-white text-2xl font-extrabold">
          ✕
        </button>
        <div className="flex-1 text-center text-lg font-extrabold">🔁 Latihan Harian</div>
        <div className="w-12" />
      </div>
      <PilihJawaban
        soal={soal}
        onHasil={(no, salah) => {
          hasil.current[no] = { kunci: soal[no].kunci, salah }
        }}
        onSelesai={() => {
          catatLatihan(hasil.current.filter(Boolean))
          setSelesai(true)
          setTimeout(perayaan, 200)
        }}
      />
    </div>
  )
}

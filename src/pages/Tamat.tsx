/** Perayaan tamat Level 1–5: Nuri wisuda + sertifikat. */
import { useEffect } from 'react'
import BarAtas from '../components/BarAtas'
import { Konfeti } from '../components/Efek'
import Nuri from '../components/Nuri'
import Sertifikat from '../components/Sertifikat'
import { perayaan } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

export default function Tamat({ onQuran, onKembali }: { onQuran: () => void; onKembali: () => void }) {
  const { p, setNama, tandaiTamat } = useProgres()

  useEffect(() => {
    tandaiTamat()
    const t = setTimeout(perayaan, 300)
    return () => clearTimeout(t)
  }, [tandaiTamat])

  return (
    <div className="relative flex min-h-full flex-col pb-8">
      <Konfeti />
      <BarAtas onKembali={onKembali} judul="Selamat!" />
      <div className="flex flex-col items-center px-5 text-center">
        <div className="animate-lompat">
          <Nuri ukuran={170} ekspresi="sorak" dipakai={{ ...p.dipakai, kepala: 'topi-wisuda' }} />
        </div>
        <div className="animate-masuk text-4xl font-extrabold">MasyaAllah, tamat!</div>
        <div className="mt-2 text-lg font-bold leading-snug text-slate-600">
          Kamu sudah mengenal huruf, harakat, menyambung, mad, dan tajwid dasar. Nuri bangga sekali!
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 px-4">
        <label className="rounded-2xl bg-white p-3 shadow">
          <span className="block text-sm font-bold text-slate-500">Nama di sertifikat (diisi Ayah/Bunda)</span>
          <input
            value={p.namaAnak}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Tulis nama ananda"
            className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-xl font-bold outline-none focus:border-laut"
            style={{ userSelect: 'text' }}
          />
        </label>
        <Sertifikat nama={p.namaAnak} />
        <button onClick={onQuran} className="tombol-game w-full py-4 text-2xl">
          📖 Ke Pulau Al-Quran
        </button>
      </div>
    </div>
  )
}

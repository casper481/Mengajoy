/** Perjalanan Api: hadiah streak di hari 1, 3, 7, 14, 30. Tanpa hukuman bila absen. */
import BarAtas from '../components/BarAtas'
import { Konfeti } from '../components/Efek'
import { IkonApi } from '../components/Ikon'
import NuriBicara from '../components/NuriBicara'
import { HADIAH_STREAK } from '../data/dunia'
import { sorak } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'
import { useState } from 'react'

export default function Streak({ onKembali }: { onKembali: () => void }) {
  const { p, streakAktif, klaimStreak } = useProgres()
  const [rayakan, setRayakan] = useState(0)
  const terbaik = p.streak.terbaik
  return (
    <div className="flex min-h-full flex-col pb-6">
      <BarAtas onKembali={onKembali} judul="Perjalanan Api" />
      {rayakan > 0 && <Konfeti key={rayakan} />}
      <div className="mx-3 flex flex-col items-center rounded-[1.75rem] border-4 border-[#ffb36b] bg-gradient-to-b from-[#fff3dc] to-[#ffe0b8] p-4 text-center shadow-[0_6px_0_#e08a3a]">
        <IkonApi ukuran={72} menyala={streakAktif > 0} />
        <div className="judul-game text-4xl" style={{ ['--g' as string]: '#b4520e', color: '#ffc163' }}>
          {streakAktif} hari!
        </div>
        <div className="font-bold text-[#9a5a1a]">Rekor terbaikmu: {terbaik} hari</div>
      </div>
      <div className="mt-2 px-3">
        <NuriBicara
          ukuran={56}
          ekspresi="senang"
          teks="Belajar sedikit setiap hari itu hebat! Kalau terlewat sehari, aku jaga apimu (sekali seminggu). Tidak apa-apa istirahat ya."
        />
      </div>

      <div className="grid grid-cols-2 gap-3 px-3">
        {HADIAH_STREAK.map((h) => {
          const bisa = terbaik >= h.hari
          const diklaim = p.streak.diklaim.includes(h.hari)
          return (
            <div key={h.hari} className={`flex flex-col items-center overflow-hidden rounded-2xl border-4 text-center shadow-[0_5px_0_rgba(0,0,0,0.12)] ${diklaim ? 'border-[#7ee081] bg-[#effbe9]' : bisa ? 'border-[#ffc163] bg-[#fff8e6]' : 'border-[#c9b8f2] bg-[#f4efff]'} ${h.hari === 30 ? 'col-span-2' : ''}`}>
              <div className={`w-full py-1 text-sm font-extrabold text-white ${diklaim ? 'bg-[#3fb24f]' : bisa ? 'bg-[#ff8a2b]' : 'bg-[#8b63e8]'}`}>HARI {h.hari}</div>
              <div className="py-2 text-4xl">{h.ikon}</div>
              <div className="px-2 text-sm font-extrabold leading-tight text-[#6b4e24]">{h.judul}</div>
              <div className="w-full p-2">
                {diklaim ? (
                  <div className="text-sm font-extrabold text-green-700">✓ Sudah diambil</div>
                ) : bisa ? (
                  <button
                    onClick={() => {
                      sorak()
                      klaimStreak(h.hari)
                      setRayakan((n) => n + 1)
                    }}
                    className="tombol-game jeruk animate-denyut w-full py-1.5 text-sm"
                  >
                    Ambil
                  </button>
                ) : (
                  <div className="text-xs font-extrabold text-[#8b63e8]">🔒 {h.hari - terbaik} hari lagi</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Misi dunia nyata hari ini. Tombol "Sudah!" dikonfirmasi oleh orang tua. */
import { useState } from 'react'
import BarAtas from '../components/BarAtas'
import { Konfeti } from '../components/Efek'
import NuriBicara from '../components/NuriBicara'
import { MISI } from '../data/misi'
import { sorak } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'
import { nomorHari } from '../lib/tanggal'

export default function Misi({ onKembali }: { onKembali: () => void }) {
  const { p, misiHariIniSelesai, selesaiMisi } = useProgres()
  const misi = MISI[nomorHari() % MISI.length]
  const [tanya, setTanya] = useState(false)
  const [rayakan, setRayakan] = useState(false)

  return (
    <div className="flex min-h-full flex-col">
      <BarAtas onKembali={onKembali} judul="Misi Hari Ini" />
      {rayakan && <Konfeti />}
      <div className="px-4">
        <NuriBicara
          teks={misiHariIniSelesai ? 'MasyaAllah! Misi hari ini sudah selesai. Besok ada misi baru!' : 'Ini misi kita di dunia nyata. Kerjakan bersama Ayah atau Bunda ya!'}
          ekspresi={misiHariIniSelesai ? 'sorak' : 'senang'}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <div className="animate-masuk flex w-full flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-xl">
          <div className="text-7xl">{misi.ikon}</div>
          <div className="mt-3 text-2xl font-extrabold leading-snug">{misi.teks}</div>
          {misiHariIniSelesai && <div className="mt-3 rounded-full bg-green-100 px-4 py-1 text-lg font-extrabold text-green-700">✓ Sudah dikerjakan</div>}
        </div>
        <div className="text-center font-bold text-slate-500">Misi yang sudah selesai: {p.misi.total}</div>
      </div>

      {!misiHariIniSelesai && (
        <div className="p-4">
          <button onClick={() => setTanya(true)} className="tombol-game w-full py-5 text-3xl">
            Sudah!
          </button>
        </div>
      )}

      {tanya && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="animate-masuk w-full max-w-sm rounded-3xl bg-white p-6 text-center">
            <div className="text-lg font-bold text-slate-500">Untuk Ayah / Bunda</div>
            <div className="mt-1 text-xl font-extrabold">Apakah ananda sudah mengerjakan misi ini?</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setTanya(false)} className="tombol bg-slate-100 py-3 text-lg">Belum</button>
              <button
                onClick={() => {
                  selesaiMisi()
                  setTanya(false)
                  setRayakan(true)
                  sorak()
                }}
                className="tombol-game py-3 text-lg"
              >
                Ya, sudah ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

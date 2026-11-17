/** Misi Hari Ini: 3 misi belajar dinamis + peti bonus + misi dunia nyata (dikonfirmasi orang tua). */
import { useMemo, useState } from 'react'
import BarAtas from '../components/BarAtas'
import { Konfeti } from '../components/Efek'
import NuriBicara from '../components/NuriBicara'
import { MISI } from '../data/misi'
import { sorak, ting } from '../lib/efekSuara'
import { BONUS_SEMUA_MISI, buatMisiHarian, type Tujuan } from '../lib/misiHarian'
import { useProgres } from '../lib/progres'
import { nomorHari } from '../lib/tanggal'

export default function Misi({ onKembali, onPergi }: { onKembali: () => void; onPergi: (t: Tujuan) => void }) {
  const { p, harian, misiHariIniSelesai, selesaiMisi, klaim, stageTerbuka, pulauTerbuka } = useProgres()
  const daftar = useMemo(() => buatMisiHarian(p, stageTerbuka, pulauTerbuka), [harian.tanggal]) // eslint-disable-line react-hooks/exhaustive-deps
  const misiDunia = MISI[nomorHari() % MISI.length]
  const [tanya, setTanya] = useState(false)
  const [rayakan, setRayakan] = useState(0)

  const semuaDiklaim = daftar.every((m) => harian.diklaim.includes(m.id))
  const bonusDiklaim = harian.diklaim.includes('bonus')
  const ambil = (id: string, koin: number, xp = 0) => {
    ting()
    klaim(id, koin, xp)
    setRayakan((n) => n + 1)
  }

  return (
    <div className="flex min-h-full flex-col pb-6">
      <BarAtas onKembali={onKembali} judul="Misi Hari Ini" />
      {rayakan > 0 && <Konfeti key={rayakan} />}
      <div className="px-3">
        <NuriBicara ukuran={64} ekspresi="senang" teks="Ini misi kita hari ini. Pelan-pelan saja, yang penting rutin!" />
      </div>

      <div className="flex flex-col gap-3 px-3">
        {daftar.map((m, i) => {
          const nilai = Math.min(m.target, m.nilai(harian))
          const selesai = nilai >= m.target
          const diklaim = harian.diklaim.includes(m.id)
          return (
            <div key={m.id} className={`panel-game animate-masuk flex items-center gap-3 p-3 ${diklaim ? 'opacity-80' : ''}`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#e9c98f] bg-white text-3xl">{m.ikon}</div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-extrabold text-[#b89b6a]">MISI {String(i + 1).padStart(2, '0')} · ±{m.menit} menit</div>
                <div className="font-extrabold leading-tight text-[#6b4e24]">{m.judul}</div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-white bg-[#eadfc6]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#7ee081] to-[#3fb24f]" style={{ width: `${(nilai / m.target) * 100}%` }} />
                  </div>
                  <span className="text-xs font-extrabold text-[#9a7b4f]">
                    {nilai}/{m.target}
                  </span>
                </div>
              </div>
              <div className="flex w-20 shrink-0 flex-col items-center gap-1">
                <span className="text-sm font-extrabold text-[#9a6a00]">🪙 +{m.koin}</span>
                {diklaim ? (
                  <span className="text-sm font-extrabold text-green-700">✓ Diambil</span>
                ) : selesai ? (
                  <button onClick={() => ambil(m.id, m.koin, 10)} className="tombol-game jeruk animate-denyut w-full py-1.5 text-sm">
                    Ambil
                  </button>
                ) : (
                  <button onClick={() => onPergi(m.tujuan)} className="tombol-game biru w-full py-1.5 text-sm">
                    Mulai
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* peti bonus */}
        <div className="panel-biru flex items-center gap-3 p-3">
          <div className={`text-5xl ${semuaDiklaim && !bonusDiklaim ? 'animate-lompat' : ''}`} style={{ animationIterationCount: 'infinite' }}>
            {bonusDiklaim ? '📭' : '🎁'}
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[#1a5f8a]">Hadiah jika semua misi selesai</div>
            <div className="text-sm font-bold text-[#3a7fa8]">🪙 +{BONUS_SEMUA_MISI.koin} koin dan Momo makin besar</div>
          </div>
          {bonusDiklaim ? (
            <span className="font-extrabold text-green-700">✓</span>
          ) : (
            <button
              disabled={!semuaDiklaim}
              onClick={() => {
                sorak()
                ambil('bonus', BONUS_SEMUA_MISI.koin, BONUS_SEMUA_MISI.xp)
              }}
              className="tombol-game jeruk px-4 py-2 text-base"
            >
              Buka
            </button>
          )}
        </div>

        {/* misi dunia nyata */}
        <div className="mt-2 text-center text-sm font-extrabold text-[#1a5f8a]">Misi di dunia nyata</div>
        <div className="panel-game flex items-center gap-3 p-3">
          <div className="text-4xl">{misiDunia.ikon}</div>
          <div className="flex-1 font-extrabold leading-tight text-[#6b4e24]">{misiDunia.teks}</div>
          {misiHariIniSelesai ? (
            <span className="font-extrabold text-green-700">✓ Sudah</span>
          ) : (
            <button onClick={() => setTanya(true)} className="tombol-game px-4 py-2 text-lg">
              Sudah!
            </button>
          )}
        </div>
        <div className="text-center text-xs font-bold text-[#3a7fa8]">Misi yang sudah selesai: {p.misi.total} · Misi baru setiap hari, tidak harus semua dikerjakan 😊</div>
      </div>

      {tanya && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="panel-game animate-masuk w-full max-w-sm p-6 text-center">
            <div className="text-lg font-bold text-[#9a7b4f]">Untuk Ayah / Bunda</div>
            <div className="mt-1 text-xl font-extrabold text-[#6b4e24]">Apakah ananda sudah mengerjakan misi ini?</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setTanya(false)} className="tombol-game krem py-3 text-lg">
                Belum
              </button>
              <button
                onClick={() => {
                  selesaiMisi()
                  setTanya(false)
                  setRayakan((n) => n + 1)
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

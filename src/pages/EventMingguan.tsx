/** Event mingguan: tiap hari tantangan berbeda (tidak wajib). Materi tetap dari yang sudah dipelajari. */
import { useMemo, useState } from 'react'
import CariPasangan from '../activities/CariPasangan'
import { itemsDariStage } from '../activities/tipe'
import BarAtas from '../components/BarAtas'
import { Konfeti } from '../components/Efek'
import NuriBicara from '../components/NuriBicara'
import { SURAH_RENCANA, suratSiap } from '../data/ayat'
import { EVENT_MINGGUAN } from '../data/dunia'
import { STAGES } from '../data/stages'
import { sorak, ting } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'
import { acak } from '../lib/tanggal'
import type { Tujuan } from '../lib/misiHarian'
import LatihanHarian from './LatihanHarian'

const URUTAN = [1, 2, 3, 4, 5, 6, 0]

export default function EventMingguan({ onKembali, onPergi }: { onKembali: () => void; onPergi: (t: Tujuan) => void }) {
  const { p, harian, selesaiEvent, klaim, klaimPekan, hariAktifPekanIni, pulauTerbuka, latihanTersedia } = useProgres()
  const hari = new Date().getDay()
  const ev = EVENT_MINGGUAN[hari]
  const [main, setMain] = useState(false)
  const [tanya, setTanya] = useState(false)
  const [rayakan, setRayakan] = useState(0)

  const ayatSiap = pulauTerbuka(6) && SURAH_RENCANA.some((s) => suratSiap(s.nomor))
  const selesai = ev.jenis === 'hafalan' && ayatSiap ? harian.ayat > 0 || harian.event : harian.event
  const diklaim = harian.diklaim.includes('event')
  const pekanDiklaim = p.pekanDiklaim === harian.tanggal

  // kartu puzzle dari huruf yang sudah dipelajari
  const itemPuzzle = useMemo(() => {
    const selesaiHuruf = STAGES.filter((s) => s.jenis === 'huruf' && (p.bintang[s.id] ?? 0) > 0)
    const sumber = (selesaiHuruf.length ? selesaiHuruf : STAGES.filter((s) => s.jenis === 'huruf').slice(0, 1)).flatMap(itemsDariStage)
    return acak(sumber).slice(0, 4)
  }, [main]) // eslint-disable-line react-hooks/exhaustive-deps

  const tamatMain = () => {
    selesaiEvent()
    setMain(false)
    setRayakan((n) => n + 1)
    sorak()
  }

  if (main) {
    if (ev.jenis === 'puzzle')
      return (
        <div className="flex h-[100dvh] flex-col overflow-hidden">
          <div className="flex shrink-0 items-center gap-3 px-4 pt-3 pb-2">
            <button onClick={() => setMain(false)} aria-label="Tutup" className="tombol-game merah flex h-12 w-12 shrink-0 items-center justify-center !rounded-full text-2xl">✕</button>
            <div className="flex-1 text-center text-lg font-extrabold">🧩 Puzzle Hijaiyah</div>
            <div className="w-12" />
          </div>
          <CariPasangan items={itemPuzzle} onSelesai={tamatMain} />
        </div>
      )
    const pulau = ev.jenis === 'huruf' ? [1] : ev.jenis === 'suara' ? [1, 2] : ev.jenis === 'hafalan' ? [3, 4, 5] : undefined
    return <LatihanHarian onKembali={() => setMain(false)} pulau={pulau} jumlah={ev.jenis === 'ujian' ? 10 : 6} judul={`${ev.ikon} ${ev.judul}`} onSelesai={selesaiEvent} />
  }

  const mulai = () => {
    if (ev.jenis === 'jumat') return setTanya(true)
    if (ev.jenis === 'hafalan' && ayatSiap) return onPergi({ jenis: 'quran' })
    setMain(true)
  }

  return (
    <div className="flex min-h-full flex-col pb-6">
      <BarAtas onKembali={onKembali} judul="Event Pekan Ini" />
      {rayakan > 0 && <Konfeti key={rayakan} />}

      {/* kalender pekan */}
      <div className="mx-3 grid grid-cols-7 gap-1.5">
        {URUTAN.map((d) => {
          const e = EVENT_MINGGUAN[d]
          const kini = d === hari
          return (
            <div key={d} className={`flex flex-col items-center rounded-xl border-[3px] py-1 ${kini ? 'scale-105 border-[#ff8a2b] bg-[#fff3dc] shadow-[0_4px_0_#e08a3a]' : 'border-white bg-white/70'}`}>
              <span className="text-xl">{e.ikon}</span>
              <span className={`text-[10px] font-extrabold ${kini ? 'text-[#b4520e]' : 'text-[#6b7f99]'}`}>{e.hari.slice(0, 3)}</span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 px-3">
        <NuriBicara ukuran={56} ekspresi="senang" teks="Setiap hari ada tantangan berbeda. Tidak wajib, tapi seru!" />
      </div>

      <div className="panel-game mx-3 flex flex-col items-center p-5 text-center">
        <div className="text-xs font-extrabold text-[#b89b6a]">TANTANGAN HARI {ev.hari.toUpperCase()}</div>
        <div className="my-2 text-6xl">{ev.ikon}</div>
        <div className="judul-game text-3xl" style={{ ['--g' as string]: '#b4520e', color: '#ffc163' }}>
          {ev.judul}
        </div>
        <div className="mt-2 font-bold text-[#6b4e24]">{ev.deskripsi}</div>
        <div className="mt-2 rounded-full bg-yellow-100 px-3 py-0.5 font-extrabold text-[#9a6a00]">Hadiah: 🪙 +{ev.koin}</div>

        {ev.jenis === 'pekan' ? (
          <div className="mt-4 w-full">
            <div className="mb-1 font-extrabold text-[#6b4e24]">Hari belajar 7 hari terakhir: {hariAktifPekanIni}/3</div>
            <div className="mb-3 h-4 overflow-hidden rounded-full border-2 border-white bg-[#eadfc6]">
              <div className="h-full bg-gradient-to-r from-[#7ee081] to-[#3fb24f]" style={{ width: `${Math.min(100, (hariAktifPekanIni / 3) * 100)}%` }} />
            </div>
            {pekanDiklaim ? (
              <div className="font-extrabold text-green-700">✓ Peti pekan ini sudah dibuka</div>
            ) : (
              <button
                disabled={hariAktifPekanIni < 3}
                onClick={() => {
                  sorak()
                  klaimPekan(ev.koin)
                  setRayakan((n) => n + 1)
                }}
                className="tombol-game jeruk w-full py-3 text-xl"
              >
                🎁 Buka Peti
              </button>
            )}
          </div>
        ) : diklaim ? (
          <div className="mt-4 font-extrabold text-green-700">✓ Tantangan hari ini selesai. Sampai besok!</div>
        ) : selesai ? (
          <button
            onClick={() => {
              ting()
              klaim('event', ev.koin, 15)
              setRayakan((n) => n + 1)
            }}
            className="tombol-game jeruk animate-denyut mt-4 w-full py-3 text-xl"
          >
            Ambil hadiah 🪙
          </button>
        ) : !latihanTersedia && ev.jenis !== 'jumat' ? (
          <div className="mt-4 font-bold text-[#9a7b4f]">Selesaikan 1 stage dulu, lalu kembali ke sini ya!</div>
        ) : (
          <button onClick={mulai} className="tombol-game mt-4 w-full py-3 text-xl">
            Mulai
          </button>
        )}
      </div>

      {tanya && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="panel-game animate-masuk w-full max-w-sm p-6 text-center">
            <div className="text-lg font-bold text-[#9a7b4f]">Untuk Ayah / Bunda</div>
            <div className="mt-1 text-xl font-extrabold text-[#6b4e24]">Sudahkah ananda membaca shalawat dan satu surat pendek bersama keluarga?</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setTanya(false)} className="tombol-game krem py-3 text-lg">
                Belum
              </button>
              <button
                onClick={() => {
                  setTanya(false)
                  tamatMain()
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

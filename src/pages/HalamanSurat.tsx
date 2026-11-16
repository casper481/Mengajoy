/**
 * Membaca satu surat, ayat demi ayat.
 * Langkah per ayat: Dengarkan → Ikuti per kata → Baca sendiri (orang tua mengonfirmasi).
 * Sengaja tanpa permainan yang mengacak/menyusun teks ayat, demi menjaga adab terhadap Al-Quran.
 */
import { useEffect, useRef, useState } from 'react'
import BarAtas from '../components/BarAtas'
import { Konfeti } from '../components/Efek'
import Nuri from '../components/Nuri'
import NuriBicara from '../components/NuriBicara'
import TombolSuara from '../components/TombolSuara'
import { audioAyat, audioKata, ayatSurah, pembukaSurah, SURAH_RENCANA, type KataAyat } from '../data/ayat'
import { cekAudio, putar } from '../lib/audio'
import { perayaan, pop } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

/** Angka Arab untuk penanda akhir ayat */
const angkaArab = (n: number) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)])

export default function HalamanSurat({ nomor, onKembali }: { nomor: number; onKembali: () => void }) {
  const { p, tandaiAyat } = useProgres()
  const info = SURAH_RENCANA.find((s) => s.nomor === nomor)!
  const ayat = ayatSurah(nomor)
  const pembuka = pembukaSurah(nomor)
  const lancar = p.surat[nomor] ?? []

  const awal = Math.max(0, ayat.findIndex((a) => !lancar.includes(a.ayat)))
  const [idx, setIdx] = useState(awal)
  const [latin, setLatin] = useState(true)
  const [sorot, setSorot] = useState<number | null>(null)
  const [tanya, setTanya] = useState(false)
  const [selesai, setSelesai] = useState(false)
  const batal = useRef(false)

  const a = ayat[idx]
  const sudahLancar = lancar.includes(a.ayat)

  useEffect(() => {
    batal.current = true
    setSorot(null)
  }, [idx])

  /** Ikuti per kata: sorot kata satu per satu (dengan audio kata kalau ada). */
  const ikuti = async () => {
    batal.current = false
    for (let i = 0; i < a.kata.length; i++) {
      if (batal.current) return
      setSorot(i)
      const k = a.kata[i]
      const src = k.audio ? audioKata(k.audio) : ''
      const ada = src ? await cekAudio(src) : false
      if (ada) await putar(src)
      await new Promise((r) => setTimeout(r, ada ? 1100 : 1300))
    }
    if (!batal.current) setSorot(null)
  }

  const ketukKata = (k: KataAyat, i: number) => {
    pop()
    batal.current = true
    setSorot(i)
    if (k.audio) void putar(audioKata(k.audio))
  }

  const konfirmasi = () => {
    tandaiAyat(nomor, a.ayat)
    setTanya(false)
    const semua = new Set([...lancar, a.ayat])
    if (ayat.every((x) => semua.has(x.ayat))) {
      setSelesai(true)
      setTimeout(perayaan, 200)
    } else if (idx + 1 < ayat.length) {
      setIdx(idx + 1)
    }
  }

  if (selesai) {
    return (
      <div className="relative flex min-h-full flex-col items-center justify-between overflow-hidden px-6 py-8 text-center">
        <Konfeti />
        <div className="animate-masuk">
          <div className="text-4xl font-extrabold">MasyaAllah!</div>
          <div className="mt-1 text-xl font-bold text-slate-600">Kamu sudah membaca Surat {info.nama}</div>
        </div>
        <div className="animate-lompat">
          <Nuri ukuran={180} ekspresi="sorak" dipakai={p.dipakai} />
        </div>
        <div className="rounded-3xl bg-white px-6 py-3 font-bold shadow">Teruslah membacanya setiap hari, ya!</div>
        <button onClick={onKembali} className="tombol w-full max-w-sm bg-daun py-4 text-2xl text-white">
          Kembali
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col pb-6">
      <BarAtas onKembali={onKembali} judul={`Surat ${info.nama}`} />
      <div className="px-4">
        <NuriBicara
          ukuran={64}
          ekspresi="senang"
          teks={idx === 0 && lancar.length === 0 ? 'Sebelum membaca, ucapkan ta\'awudz dan basmalah bersama Ayah atau Bunda, ya.' : 'Dengarkan dulu, lalu ikuti per kata.'}
        />
      </div>

      {/* penanda ayat */}
      <div className="mt-1 flex justify-center gap-1.5 px-4">
        {ayat.map((x, i) => (
          <button
            key={x.ayat}
            onClick={() => setIdx(i)}
            aria-label={`Ayat ${x.ayat}`}
            className={`h-8 w-8 rounded-full text-sm font-extrabold ${i === idx ? 'bg-tinta text-white' : lancar.includes(x.ayat) ? 'bg-green-200 text-green-800' : 'bg-white text-slate-500'}`}
          >
            {x.ayat}
          </button>
        ))}
      </div>

      {/* basmalah di ayat pertama */}
      {idx === 0 && pembuka.length > 0 && (
        <div className="arab mt-3 text-center text-3xl text-slate-600">{pembuka.map((k) => k.arab).join(' ')}</div>
      )}

      {/* kartu ayat */}
      <div key={a.ayat} className="animate-masuk mx-4 mt-3 rounded-[2rem] bg-white px-4 py-6 shadow-xl">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-4" dir="rtl">
          {a.kata.map((k, i) => (
            <button
              key={i}
              onClick={() => ketukKata(k, i)}
              className={`flex flex-col items-center rounded-2xl px-2 py-1 transition ${sorot === i ? 'scale-110 bg-yellow-100 ring-4 ring-bintang' : ''}`}
            >
              <span className="arab text-5xl leading-tight">{k.arab}</span>
              {latin && <span className="text-sm font-bold text-slate-500" dir="ltr">{k.latin}</span>}
            </button>
          ))}
          <span className="arab flex items-center text-4xl text-daun">﴿{angkaArab(a.ayat)}﴾</span>
        </div>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center rounded-2xl bg-white/80 py-2">
          <div className="mb-1 text-sm font-extrabold">1. Dengarkan</div>
          {a.audioAyat ? <TombolSuara key={a.audioAyat} src={audioAyat(a.audioAyat)} /> : <TombolSuara src="" />}
        </div>
        <button onClick={ikuti} className="tombol flex flex-col items-center justify-center bg-white py-2">
          <span className="text-3xl">👆</span>
          <span className="text-sm font-extrabold">2. Ikuti per kata</span>
        </button>
      </div>

      <div className="mx-4 mt-3 flex items-center justify-between rounded-2xl bg-white/70 px-4 py-2">
        <span className="font-bold">Tampilkan cara baca latin</span>
        <button onClick={() => setLatin(!latin)} className={`relative h-8 w-14 rounded-full ${latin ? 'bg-daun' : 'bg-slate-300'}`} aria-label="Latin">
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${latin ? 'left-7' : 'left-1'}`} />
        </button>
      </div>

      <div className="mx-4 mt-4">
        {sudahLancar ? (
          <div className="flex gap-3">
            <div className="flex-1 rounded-2xl bg-green-100 py-3 text-center font-extrabold text-green-800">✓ Ayat ini sudah lancar</div>
            {idx + 1 < ayat.length && (
              <button onClick={() => setIdx(idx + 1)} className="tombol bg-daun px-6 text-xl text-white">
                ➜
              </button>
            )}
          </div>
        ) : (
          <button onClick={() => setTanya(true)} className="tombol w-full bg-daun py-4 text-xl text-white">
            3. Aku sudah bisa membacanya!
          </button>
        )}
      </div>

      {tanya && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="animate-masuk w-full max-w-sm rounded-3xl bg-white p-6 text-center">
            <div className="text-lg font-bold text-slate-500">Untuk Ayah / Bunda</div>
            <div className="mt-1 text-xl font-extrabold">Sudahkah ananda membaca ayat {a.ayat} dengan benar, tanpa melihat tulisan latin?</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setTanya(false)} className="tombol bg-slate-100 py-3 text-lg">Belum, ulang</button>
              <button onClick={konfirmasi} className="tombol bg-daun py-3 text-lg text-white">Ya, lancar ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

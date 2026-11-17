/**
 * Level 6 — Pulau Al-Quran.
 * Teks ayat SENGAJA belum ditampilkan: menunggu Mushaf Standar Indonesia (tashih LPMQ).
 * Halaman ini menampilkan rencana surat dan penjelasan untuk orang tua.
 */
import { useState } from 'react'
import BarAtas from '../components/BarAtas'
import { Konfeti } from '../components/Efek'
import { IkonGembok } from '../components/Ikon'
import NuriBicara from '../components/NuriBicara'
import { SURAH_RENCANA, suratSiap } from '../data/ayat'
import { pop } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

export default function HalamanQuran({ onKembali, onSertifikat, onSurat }: { onKembali: () => void; onSertifikat: () => void; onSurat: (nomor: number) => void }) {
  const { p, semuaTamat } = useProgres()
  const [info, setInfo] = useState<string | null>(null)

  return (
    <div className="flex min-h-full flex-col pb-8">
      <Konfeti />
      <BarAtas onKembali={onKembali} judul="Pulau Al-Quran" />
      <div className="px-4">
        <NuriBicara
          ekspresi="sorak"
          teks="MasyaAllah! Kamu sudah sampai di Pulau Al-Quran! Surat-suratnya sedang disiapkan dengan sangat hati-hati."
        />
      </div>

      <div className="mx-4 mt-2 rounded-3xl bg-gradient-to-br from-[#fff3c4] to-[#ffe08a] p-5 text-center shadow-lg">
        <div className="text-5xl">📖</div>
        <div className="mt-2 text-2xl font-extrabold">Kamu hebat!</div>
        <div className="mt-1 font-bold text-slate-700">
          Kamu sudah belajar huruf, harakat, menyambung, mad, dan tajwid dasar. Sebentar lagi kita membaca Al-Quran bersama!
        </div>
      </div>

      {semuaTamat && (
        <div className="mx-4 mt-3">
          <button onClick={onSertifikat} className="tombol-game jeruk w-full py-3 text-xl">🎓 Lihat sertifikatku</button>
        </div>
      )}

      <div className="mt-4 px-4">
        <div className="mb-2 text-center font-extrabold text-slate-600">Ayo membaca surat pendek!</div>
        <div className="grid grid-cols-2 gap-3">
          {SURAH_RENCANA.map((s, i) => (
            <button
              key={s.nomor}
              onClick={() => {
                pop()
                if (suratSiap(s.nomor)) onSurat(s.nomor)
                else setInfo(s.nama)
              }}
              className="tombol animate-masuk flex flex-col items-center bg-white px-2 py-3"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-1 text-lg font-extrabold">
                {!suratSiap(s.nomor) && <IkonGembok ukuran={18} />} {s.nama}
                {(p.surat[s.nomor]?.length ?? 0) === s.jumlahAyat && ' ✅'}
              </div>
              <div className="text-xs font-bold text-slate-500">
                {s.arti} · {suratSiap(s.nomor) ? `${p.surat[s.nomor]?.length ?? 0}/${s.jumlahAyat} ayat lancar` : `${s.jumlahAyat} ayat`}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-5 rounded-2xl bg-white/80 p-4 text-sm leading-relaxed text-slate-600">
        <div className="mb-1 font-extrabold text-tinta">Untuk Ayah & Bunda</div>
        Teks ayat di versi uji coba ini diambil dari <b>Tanzil Project (tanzil.net)</b>, teks Uthmani yang telah diverifikasi. Gaya tulisannya
        mengikuti Mushaf Madinah, sehingga bentuk beberapa tanda bisa sedikit berbeda dengan mushaf di TPQ. Ke depan akan diganti dengan{' '}
        <b>Mushaf Standar Indonesia</b> yang ditashih LPMQ Kemenag. Suara qari belum tersedia, jadi bacalah bersama ananda atau guru ngajinya.
      </div>

      {info && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setInfo(null)}>
          <div className="animate-masuk w-full max-w-sm rounded-3xl bg-white p-6 text-center">
            <div className="text-4xl">🌙</div>
            <div className="mt-2 text-xl font-extrabold">Surat {info}</div>
            <div className="mt-1 font-bold text-slate-600">Sedang disiapkan. Sabar ya, sebentar lagi!</div>
            <button className="tombol-game mt-4 w-full py-3 text-lg">Oke!</button>
          </div>
        </div>
      )}
    </div>
  )
}

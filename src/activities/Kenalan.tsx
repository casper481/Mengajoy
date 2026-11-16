/** Aktivitas 1: "Kenalan" — huruf besar, nama latin, tombol suara, animasi masuk. */
import { useState } from 'react'
import NuriBicara from '../components/NuriBicara'
import TombolSuara from '../components/TombolSuara'
import { HARAKAT, harakatById, type HarakatId } from '../data/harakat'
import { pop } from '../lib/efekSuara'
import type { Item } from './tipe'

type Props = {
  items: Item[]
  /** Untuk stage harakat: tampilkan kartu pengenalan harakat dulu */
  harakat?: HarakatId | 'campuran'
  onSelesai: () => void
}

export default function Kenalan({ items, harakat, onSelesai }: Props) {
  const adaPengantar = !!harakat
  const [idx, setIdx] = useState(adaPengantar ? -1 : 0)
  const total = items.length

  const lanjut = () => {
    pop()
    if (idx + 1 >= total) onSelesai()
    else setIdx(idx + 1)
  }

  if (idx === -1 && harakat) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-4">
          <NuriBicara ukuran={64} teks={harakat === 'campuran' ? 'Sekarang kita gabungkan ketiganya!' : `Ayo kenalan dengan ${harakatById(harakat).nama}!`} ekspresi="senang" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center-safe gap-5 overflow-y-auto px-4">
          {harakat === 'campuran' ? (
            <div className="grid w-full grid-cols-3 gap-3">
              {HARAKAT.map((h, i) => (
                <div key={h.id} className="animate-masuk flex flex-col items-center rounded-3xl bg-white p-3 shadow-lg" style={{ animationDelay: `${i * 0.2}s` }}>
                  <span className="arab text-7xl" style={{ color: h.warna }}>{'ب' + h.tanda}</span>
                  <span className="text-lg font-extrabold">{h.nama}</span>
                  <span className="text-2xl font-extrabold" style={{ color: h.warna }}>{h.bunyi.toLowerCase()}</span>
                </div>
              ))}
            </div>
          ) : (
            <KartuHarakat id={harakat} />
          )}
        </div>
        <div className="shrink-0 p-4">
          <button onClick={lanjut} className="tombol w-full bg-daun py-4 text-2xl text-white">Lanjut ➜</button>
        </div>
      </div>
    )
  }

  const item = items[idx]
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-4">
        <NuriBicara ukuran={64} teks={idx === 0 ? 'Ayo kenalan! Ketuk speaker untuk mendengar.' : 'Ini dia teman baru kita!'} ekspresi="senang" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center-safe gap-3 overflow-y-auto px-4">
        <div key={item.id} className="animate-putar-masuk flex aspect-square w-[min(12rem,26dvh)] shrink-0 items-center justify-center rounded-[2.5rem] bg-white shadow-xl">
          <span className="arab text-[min(7rem,15dvh)] leading-none text-tinta">{item.arab}</span>
        </div>
        <div key={item.id + 'n'} className="animate-masuk text-4xl font-extrabold text-tinta" style={{ animationDelay: '0.3s' }}>
          {item.latin}
        </div>
        <TombolSuara key={item.audio} src={item.audio} besar otomatis />

        {item.bentuk && (
          <div className="animate-muncul w-full rounded-2xl bg-white/70 px-3 py-2" style={{ animationDelay: '0.6s' }}>
            <div className="mb-1 text-center text-sm font-bold text-slate-500">Bentuk saat disambung</div>
            <div className="grid grid-cols-3 text-center">
              {(['awal', 'tengah', 'akhir'] as const).map((k) => (
                <div key={k}>
                  <div className="arab text-3xl leading-snug">{item.bentuk![k]}</div>
                  <div className="text-xs font-bold capitalize text-slate-500">{k}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 p-4">
        <div className="flex flex-1 justify-center gap-2">
          {items.map((_, i) => (
            <span key={i} className={`h-3 w-3 rounded-full ${i <= idx ? 'bg-daun' : 'bg-white'}`} />
          ))}
        </div>
        <button onClick={lanjut} className="tombol flex-[2] bg-daun py-4 text-2xl text-white">
          {idx + 1 >= total ? 'Main yuk! ➜' : 'Lanjut ➜'}
        </button>
      </div>
    </div>
  )
}

function KartuHarakat({ id }: { id: HarakatId }) {
  const h = harakatById(id)
  return (
    <div className="animate-putar-masuk flex w-full flex-col items-center rounded-[2.5rem] bg-white p-5 shadow-xl">
      <div className="arab text-[min(6rem,12dvh)] leading-none" style={{ color: h.warna }}>{'◌' + h.tanda}</div>
      <div className="mt-1 text-4xl font-extrabold">{h.nama}</div>
      <div className="mt-2 text-center text-lg font-bold text-slate-600">{h.posisi}</div>
      <div className="mt-3 flex items-center gap-2">
        <span className="arab text-6xl">ب</span>
        <span className="text-3xl font-extrabold text-slate-400">+</span>
        <span className="arab text-6xl" style={{ color: h.warna }}>{'◌' + h.tanda}</span>
        <span className="text-3xl font-extrabold text-slate-400">=</span>
        <span className="arab text-6xl">{'ب' + h.tanda}</span>
        <span className="text-3xl font-extrabold" style={{ color: h.warna }}>b{h.bunyi.toLowerCase()}</span>
      </div>
    </div>
  )
}

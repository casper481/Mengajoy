/** Koleksi: kostum Nuri, lencana pencapaian, dan kartu ilmu. */
import { useState } from 'react'
import BarAtas from '../components/BarAtas'
import { KARTU_ILMU } from '../data/dunia'
import { LENCANA } from '../lib/lencana'
import { pop } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'
import Lemari from './Lemari'

type Tab = 'kostum' | 'lencana' | 'kartu'

export default function Koleksi({ onKembali }: { onKembali: () => void }) {
  const { p, level } = useProgres()
  const [tab, setTab] = useState<Tab>('kostum')
  const [kartu, setKartu] = useState<number | null>(null)
  const lencanaDapat = LENCANA.filter((l) => l.dapat(p)).length
  const kartuTerbuka = Math.min(KARTU_ILMU.length, level)

  return (
    <div className="flex min-h-full flex-col pb-6">
      <BarAtas onKembali={onKembali} judul="Koleksiku" />
      <div className="mx-3 mb-2 grid grid-cols-3 gap-2">
        {(
          [
            ['kostum', '👒', 'Lemari Nuri'],
            ['lencana', '🏅', `Lencana ${lencanaDapat}/${LENCANA.length}`],
            ['kartu', '📜', `Kartu ${kartuTerbuka}/${KARTU_ILMU.length}`],
          ] as const
        ).map(([id, ikon, label]) => (
          <button
            key={id}
            onClick={() => {
              pop()
              setTab(id)
            }}
            className={`tombol-game flex flex-col items-center py-1.5 text-xs ${tab === id ? 'jeruk' : 'krem'}`}
          >
            <span className="text-2xl">{ikon}</span>
            {label}
          </button>
        ))}
      </div>

      {tab === 'kostum' && <Lemari tanpaBar />}

      {tab === 'lencana' && (
        <div className="grid grid-cols-3 gap-3 px-3">
          {LENCANA.map((l) => {
            const dapat = l.dapat(p)
            return (
              <div key={l.id} className={`flex flex-col items-center rounded-2xl border-4 p-2 text-center shadow-[0_4px_0_rgba(0,0,0,0.1)] ${dapat ? 'border-[#ffc163] bg-[#fff8e6]' : 'border-white bg-white/60'}`}>
                <div className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl ${dapat ? 'bg-gradient-to-b from-[#ffe58a] to-[#ffb347] shadow-[0_3px_0_#d9731a]' : 'bg-slate-200 grayscale'}`}>{dapat ? l.ikon : '🔒'}</div>
                <div className="mt-1 text-xs font-extrabold leading-tight text-[#6b4e24]">{l.nama}</div>
                <div className="text-[10px] font-bold leading-tight text-[#9a7b4f]">{l.syarat}</div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'kartu' && (
        <>
          <div className="mx-3 mb-2 text-center text-sm font-bold text-[#1a5f8a]">Setiap naik level, satu kartu ilmu baru terbuka!</div>
          <div className="grid grid-cols-3 gap-3 px-3">
            {KARTU_ILMU.map((k, i) => {
              const buka = i < kartuTerbuka
              return (
                <button
                  key={k.judul}
                  disabled={!buka}
                  onClick={() => {
                    pop()
                    setKartu(i)
                  }}
                  className={`flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border-4 p-2 text-center shadow-[0_5px_0_rgba(0,0,0,0.15)] ${buka ? 'border-[#8fd0f4] bg-gradient-to-b from-[#eaf8ff] to-[#c9ecff]' : 'border-[#c9b8f2] bg-gradient-to-b from-[#c9a8ff] to-[#8b63e8]'}`}
                >
                  <div className="text-3xl">{buka ? k.ikon : '❔'}</div>
                  <div className={`mt-1 text-xs font-extrabold leading-tight ${buka ? 'text-[#1a5f8a]' : 'text-white'}`}>{buka ? k.judul : `Level ${i + 1}`}</div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {kartu !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={() => setKartu(null)}>
          <div className="panel-biru animate-putar-masuk w-full max-w-xs p-6 text-center">
            <div className="text-6xl">{KARTU_ILMU[kartu].ikon}</div>
            <div className="mt-2 text-2xl font-extrabold text-[#1a5f8a]">{KARTU_ILMU[kartu].judul}</div>
            <div className="mt-2 text-lg font-bold leading-snug text-[#24506e]">{KARTU_ILMU[kartu].isi}</div>
            <button className="tombol-game biru mt-4 w-full py-2.5 text-lg">Tutup</button>
          </div>
        </div>
      )}
    </div>
  )
}

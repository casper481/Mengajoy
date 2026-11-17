/** Membuat karakter anak: kulit, rambut/peci/hijab, warna, dan baju. */
import { useState } from 'react'
import Avatar from '../components/Avatar'
import Nuri from '../components/Nuri'
import { AVATAR, type DataAvatar } from '../data/dunia'
import { pop, sorak } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

type Tab = 'kulit' | 'rambut' | 'kepala' | 'baju'

export default function BuatAvatar({ onSelesai }: { onSelesai: () => void }) {
  const { p, setAvatar } = useProgres()
  const [a, setA] = useState<DataAvatar>(p.avatar)
  const [tab, setTab] = useState<Tab>('kepala')
  const ubah = (x: Partial<DataAvatar>) => {
    pop()
    setA({ ...a, ...x })
  }

  const TAB: { id: Tab; ikon: string; label: string }[] = [
    { id: 'kulit', ikon: '🖐️', label: 'Kulit' },
    { id: 'kepala', ikon: '🧕', label: 'Kepala' },
    { id: 'rambut', ikon: '💇', label: 'Rambut' },
    { id: 'baju', ikon: '👕', label: 'Baju' },
  ]

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <div className="judul-game pt-4 text-center text-3xl" style={{ ['--g' as string]: '#1a5f8a' }}>
        Buat Karakter
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <div className="absolute bottom-6 h-8 w-44 rounded-[50%] bg-black/10" />
        <div className="animate-masuk relative">
          <Avatar a={a} ukuran={170} />
        </div>
        <div className="absolute right-4 top-2 flex items-end gap-1">
          <div className="panel-game max-w-[9rem] px-3 py-1.5 text-sm font-extrabold text-[#6b4e24]">Ini kamu! Mau pakai yang mana?</div>
          <Nuri ukuran={56} ekspresi="senang" dipakai={p.dipakai} />
        </div>
      </div>

      <div className="panel-biru mx-3 mb-2 p-3">
        <div className="mb-3 grid grid-cols-4 gap-2">
          {TAB.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tombol-game flex flex-col items-center py-1.5 text-xs ${tab === t.id ? 'jeruk' : 'krem'}`}>
              <span className="text-2xl">{t.ikon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="max-h-[34dvh] overflow-y-auto">
          {tab === 'kulit' && (
            <Pilihan>
              {AVATAR.kulit.map((w, i) => (
                <Bulat key={w} aktif={a.kulit === i} onClick={() => ubah({ kulit: i })} warna={w} />
              ))}
            </Pilihan>
          )}
          {tab === 'kepala' && (
            <>
              <Pilihan>
                {AVATAR.kepala.map((k) => (
                  <button key={k} onClick={() => ubah({ kepala: k })} className={`overflow-hidden rounded-full border-4 bg-white ${a.kepala === k ? 'border-[#ff8a2b]' : 'border-white'}`}>
                    <Avatar a={{ ...a, kepala: k }} ukuran={64} hanyaKepala />
                    <div className="pb-1 text-center text-[11px] font-extrabold capitalize text-[#6b4e24]">{k === 'tanpa' ? 'Rambut' : k}</div>
                  </button>
                ))}
              </Pilihan>
              {a.kepala !== 'tanpa' && (
                <Pilihan>
                  {AVATAR.warnaKepala.map((w, i) => (
                    <Bulat key={w} aktif={a.warnaKepala === i} onClick={() => ubah({ warnaKepala: i })} warna={w} />
                  ))}
                </Pilihan>
              )}
            </>
          )}
          {tab === 'rambut' && (
            <>
              <Pilihan>
                {AVATAR.rambut.map((r) => (
                  <button key={r} onClick={() => ubah({ rambut: r, kepala: a.kepala === 'hijab' ? 'tanpa' : a.kepala })} className={`overflow-hidden rounded-full border-4 bg-white ${a.rambut === r && a.kepala !== 'hijab' ? 'border-[#ff8a2b]' : 'border-white'}`}>
                    <Avatar a={{ ...a, rambut: r, kepala: 'tanpa' }} ukuran={64} hanyaKepala />
                  </button>
                ))}
              </Pilihan>
              <Pilihan>
                {AVATAR.warnaRambut.map((w, i) => (
                  <Bulat key={w} aktif={a.warnaRambut === i} onClick={() => ubah({ warnaRambut: i })} warna={w} />
                ))}
              </Pilihan>
            </>
          )}
          {tab === 'baju' && (
            <Pilihan>
              {AVATAR.baju.map((w, i) => (
                <Bulat key={w} aktif={a.baju === i} onClick={() => ubah({ baju: i })} warna={w} />
              ))}
            </Pilihan>
          )}
        </div>
      </div>

      <div className="px-3 pb-4">
        <button
          onClick={() => {
            sorak()
            setAvatar(a)
            onSelesai()
          }}
          className="tombol-game jeruk w-full py-4 text-2xl"
        >
          Selesai ✓
        </button>
      </div>
    </div>
  )
}

function Pilihan({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 flex flex-wrap justify-center gap-3">{children}</div>
}

function Bulat({ warna, aktif, onClick }: { warna: string; aktif: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-14 w-14 rounded-full border-4 shadow-[0_3px_0_rgba(0,0,0,0.15)] ${aktif ? 'scale-110 border-[#ff8a2b]' : 'border-white'}`}
      style={{ background: warna }}
      aria-label={`Warna ${warna}`}
    />
  )
}

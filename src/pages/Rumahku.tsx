/** Pulau Rumahku: pulau milik anak, berisi karakternya, Momo, dan dekorasi dari koin hasil belajar. */
import { useState } from 'react'
import Avatar from '../components/Avatar'
import BarAtas from '../components/BarAtas'
import { GambarDekorasi } from '../components/dunia/Dekorasi'
import { Awan, Bunga, Kilau, Semak } from '../components/dunia/Hiasan'
import Laut from '../components/dunia/Laut'
import { IkonGembok } from '../components/Ikon'
import Peliharaan from '../components/Peliharaan'
import { DEKORASI, SLOT_RUMAH, TAHAP_PELIHARAAN, tahapPeliharaan } from '../data/dunia'
import { pop, sorak, ting } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

const W = 400
const H = 420

export default function Rumahku({ onKembali, onAvatar }: { onKembali: () => void; onAvatar: () => void }) {
  const { p, level, beliDekorasi, pasangDekorasi, setNamaPeliharaan } = useProgres()
  const [slotDipilih, setSlotDipilih] = useState<string | null>(null)
  const [panelMomo, setPanelMomo] = useState(false)
  const [lompat, setLompat] = useState(0)
  const tahap = tahapPeliharaan(p.xp)
  const slot = SLOT_RUMAH.find((s) => s.id === slotDipilih)

  return (
    <div className="relative flex min-h-full flex-col bg-[#3cc0dc]">
      <BarAtas onKembali={onKembali} judul="Pulau Rumahku" />

      {/* papan nama */}
      <div className="relative z-20 mx-3 flex items-center gap-3">
        <button onClick={onAvatar} className="panel-game flex flex-1 items-center gap-2 px-3 py-1.5 text-left">
          <Avatar a={p.avatar} ukuran={44} hanyaKepala />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-lg font-extrabold leading-tight text-[#6b4e24]">{p.namaAnak || 'Petualang Cilik'}</span>
            <span className="block truncate text-xs font-bold text-[#9a7b4f]">{p.gelar ? `🏅 ${p.gelar}` : `Level ${level}`} · ✏️ ubah karakter</span>
          </span>
        </button>
      </div>

      {/* pulau */}
      <div className="relative mt-2 w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <Laut />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <g className="awan-jalan" style={{ animationDuration: '80s' }}>
            <Awan x={40} y={40} s={1.1} />
          </g>
          <ellipse cx="200" cy="300" rx="196" ry="100" fill="#0d6f97" opacity="0.28" />
          <ellipse cx="200" cy="290" rx="190" ry="95" fill="#fff" opacity="0.75" />
          <ellipse cx="200" cy="278" rx="182" ry="90" fill="#c98d55" />
          <ellipse cx="200" cy="262" rx="182" ry="92" fill="#ffe3a3" />
          <ellipse cx="200" cy="250" rx="164" ry="80" fill="#56b84f" />
          <ellipse cx="196" cy="244" rx="158" ry="74" fill="#7ad672" />
          <ellipse cx="150" cy="220" rx="60" ry="14" fill="#fff" opacity="0.15" />
          {/* jalan setapak */}
          <path d="M150 210 Q190 260 205 335" stroke="#f3d79a" strokeWidth="18" fill="none" strokeLinecap="round" />
          <Semak x={30} y={262} s={1.4} />
          <Semak x={372} y={270} s={1.3} />
          <Bunga x={180} y={300} s={1.5} />
          <Bunga x={240} y={320} s={1.4} warna="#ffd166" />
          {/* dekorasi di setiap tempat, diurutkan dari belakang ke depan */}
          {[...SLOT_RUMAH]
            .sort((a, b) => a.y - b.y)
            .map((s) => {
              const id = p.dekorasi.slot[s.id]
              return id ? <GambarDekorasi key={s.id} id={id} x={s.x} y={s.y} s={1} /> : null
            })}
          {level >= 5 && <Kilau x={330} y={120} />}
        </svg>

        {/* karakter & Momo */}
        <div className="pointer-events-none absolute" style={{ left: '39%', top: '49%', width: '22%' }}>
          <div key={lompat} className={lompat ? 'animate-lompat' : ''}>
            <Avatar a={p.avatar} ukuran={88} />
          </div>
        </div>
        <button
          onClick={() => {
            setPanelMomo(true)
            setLompat((n) => n + 1)
            ting()
          }}
          className="absolute"
          style={{ left: '59%', top: '63%', width: '18%' }}
          aria-label={`Momo, ${TAHAP_PELIHARAAN[tahap].nama}`}
        >
          <Peliharaan tahap={tahap} ukuran={76} senang={lompat > 0} className="animate-melayang" />
        </button>

        {/* tombol tempat dekorasi */}
        {SLOT_RUMAH.map((s) => {
          const terkunci = level < s.level
          const terisi = !!p.dekorasi.slot[s.id]
          return (
            <button
              key={s.id}
              onClick={() => {
                pop()
                if (!terkunci) setSlotDipilih(s.id)
              }}
              aria-label={`Tempat ${s.label}`}
              className={`absolute flex -translate-x-1/2 items-center justify-center rounded-full border-[3px] text-xs font-extrabold shadow-[0_3px_0_rgba(0,0,0,0.2)] ${
                terkunci ? 'border-white bg-[#8a94a6]/90 px-2 py-0.5 text-white' : terisi ? 'h-7 w-7 border-white bg-white/70 text-[#6b4e24]' : 'h-9 w-9 animate-denyut border-white bg-[#ffb347] text-xl text-white'
              }`}
              style={{ left: `${(s.x / W) * 100}%`, top: `${((s.y + 6) / H) * 100}%` }}
            >
              {terkunci ? (
                <span className="flex items-center gap-0.5">
                  <IkonGembok ukuran={12} /> Lv {s.level}
                </span>
              ) : terisi ? (
                '✏️'
              ) : (
                '+'
              )}
            </button>
          )
        })}
      </div>

      {/* info koin */}
      <div className="relative z-10 mx-3 mt-3 panel-game px-4 py-3 text-center">
        <div className="text-lg font-extrabold text-[#6b4e24]">🪙 {p.koin} koin</div>
        <div className="text-sm font-bold text-[#9a7b4f]">Koin didapat dari belajar. Ketuk tanda + untuk menghias pulaumu. Tempat baru terbuka setiap naik level!</div>
      </div>
      <div className="h-6" />

      {/* lembar pilih dekorasi */}
      {slot && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setSlotDipilih(null)}>
          <div className="panel-game animate-muncul mx-auto mb-0 max-h-[70dvh] w-full max-w-md overflow-y-auto !rounded-b-none p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 text-center text-xl font-extrabold text-[#6b4e24]">Pilih {slot.label}</div>
            <div className="grid grid-cols-3 gap-3">
              {DEKORASI.filter((d) => d.jenis === slot.jenis).map((d) => {
                const punya = p.dekorasi.dimiliki.includes(d.id) || d.gratis
                const dipasang = p.dekorasi.slot[slot.id] === d.id
                const cukup = p.koin >= d.harga
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      if (punya) {
                        pop()
                        pasangDekorasi(slot.id, dipasang ? null : d.id)
                        setSlotDipilih(null)
                      } else if (cukup && beliDekorasi(d.id)) {
                        sorak()
                        pasangDekorasi(slot.id, d.id)
                        setSlotDipilih(null)
                      }
                    }}
                    className={`tombol flex flex-col items-center gap-1 border-4 bg-white p-2 ${dipasang ? 'border-daun' : 'border-transparent'} ${!punya && !cukup ? 'opacity-60' : ''}`}
                  >
                    <svg viewBox="-46 -82 92 88" className="h-20 w-20" aria-hidden>
                      <GambarDekorasi id={d.id} s={0.95} />
                    </svg>
                    <span className="text-xs font-extrabold leading-tight text-[#6b4e24]">{d.nama}</span>
                    <span className={`rounded-full px-2 text-[11px] font-extrabold ${punya ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-[#9a6a00]'}`}>
                      {dipasang ? 'Dipasang ✓' : punya ? 'Pasang' : `🪙 ${d.harga}`}
                    </span>
                  </button>
                )
              })}
            </div>
            {DEKORASI.filter((d) => d.jenis === slot.jenis).some((d) => !p.dekorasi.dimiliki.includes(d.id) && !d.gratis && p.koin < d.harga) && (
              <div className="mt-3 text-center text-sm font-bold text-[#9a7b4f]">Koinnya belum cukup? Ayo belajar dan selesaikan misi hari ini!</div>
            )}
          </div>
        </div>
      )}

      {/* panel Momo */}
      {panelMomo && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setPanelMomo(false)}>
          <div className="panel-game animate-masuk w-full max-w-sm p-5 text-center" onClick={(e) => e.stopPropagation()}>
            <Peliharaan tahap={tahap} ukuran={130} senang className="mx-auto" />
            <input
              value={p.namaPeliharaan}
              onChange={(e) => setNamaPeliharaan(e.target.value)}
              className="mx-auto mt-1 w-40 rounded-xl border-2 border-[#e9c98f] bg-white px-2 py-1 text-center text-xl font-extrabold text-[#6b4e24] outline-none"
              style={{ userSelect: 'text' }}
              aria-label="Nama peliharaan"
            />
            <div className="mt-1 font-extrabold text-[#9a7b4f]">{TAHAP_PELIHARAAN[tahap].nama}</div>
            <div className="mt-2 text-sm font-bold text-[#6b4e24]">{TAHAP_PELIHARAAN[tahap].pesan}</div>
            {tahap < TAHAP_PELIHARAAN.length - 1 && (
              <div className="mt-3">
                <div className="h-4 overflow-hidden rounded-full border-2 border-white bg-[#e9dcc0]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ffc163] to-[#ff8a2b]"
                    style={{ width: `${Math.min(100, ((p.xp - TAHAP_PELIHARAAN[tahap].xp) / (TAHAP_PELIHARAAN[tahap + 1].xp - TAHAP_PELIHARAAN[tahap].xp)) * 100)}%` }}
                  />
                </div>
                <div className="mt-1 text-xs font-bold text-[#9a7b4f]">Terus belajar agar {p.namaPeliharaan} tumbuh ke tahap "{TAHAP_PELIHARAAN[tahap + 1].nama}"</div>
              </div>
            )}
            <button onClick={() => setPanelMomo(false)} className="tombol-game mt-4 w-full py-3 text-lg">
              Oke!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

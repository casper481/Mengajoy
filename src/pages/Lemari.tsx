/** Koleksi hadiah: pasangkan aksesoris ke Nuri. */
import BarAtas from '../components/BarAtas'
import { IkonGembok } from '../components/Ikon'
import Nuri from '../components/Nuri'
import { HADIAH } from '../data/hadiah'
import { pop } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'

export default function Lemari({ onKembali, tanpaBar = false }: { onKembali?: () => void; tanpaBar?: boolean }) {
  const { p, pakai } = useProgres()
  const jumlah = p.hadiah.length

  return (
    <div className="flex min-h-full flex-col">
      {!tanpaBar && <BarAtas onKembali={onKembali} judul="Lemari Nuri" />}
      <div className="flex flex-col items-center px-4">
        <div className="relative">
          <div className="absolute bottom-1 left-1/2 h-5 w-28 -translate-x-1/2 rounded-[50%] bg-black/10 blur-[2px]" />
          <div key={JSON.stringify(p.dipakai)} className="animate-lompat relative">
            <Nuri ukuran={200} ekspresi="senang" dipakai={p.dipakai} />
          </div>
        </div>
        <div className="rounded-full bg-white px-4 py-1 font-bold shadow">
          Koleksi: {jumlah} / {HADIAH.length}
        </div>
        {jumlah === 0 && <div className="mt-3 text-center font-bold text-slate-500">Selesaikan stage untuk mendapat hadiah pertama!</div>}
      </div>

      <div className="grid grid-cols-3 gap-3 p-4">
        {HADIAH.map((h) => {
          const punya = p.hadiah.includes(h.id)
          const dipakai = p.dipakai[h.slot] === h.id
          return (
            <button
              key={h.id}
              disabled={!punya}
              onClick={() => {
                pop()
                pakai(h.slot, dipakai ? null : h.id)
              }}
              className={`tombol flex flex-col items-center gap-1 border-4 p-2 ${punya ? 'bg-white' : 'bg-slate-100'} ${dipakai ? 'border-daun' : 'border-transparent'}`}
              aria-label={punya ? h.nama : 'Hadiah terkunci'}
            >
              <div className="h-16 w-16 overflow-hidden">
                {punya ? (
                  <Nuri ukuran={64} dipakai={{ [h.slot]: h.id }} />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <IkonGembok ukuran={30} />
                  </div>
                )}
              </div>
              <span className="text-xs font-extrabold leading-tight">{punya ? h.nama : '???'}</span>
              {dipakai && <span className="text-[11px] font-bold text-daun">Dipakai ✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

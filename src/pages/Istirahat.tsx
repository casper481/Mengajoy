/** Layar lembut saat batas waktu harian tercapai. */
import Nuri from '../components/Nuri'
import { useProgres } from '../lib/progres'

export default function Istirahat({ onOrtu }: { onOrtu: () => void }) {
  const { p } = useProgres()
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#2d3a6b] to-[#5a6fb0] px-6 py-10 text-white">
      {[...Array(14)].map((_, i) => (
        <span
          key={i}
          className="animate-denyut absolute rounded-full bg-white"
          style={{ width: 3 + (i % 3), height: 3 + (i % 3), left: `${(i * 37) % 100}%`, top: `${(i * 23) % 45}%`, animationDelay: `${i * 0.2}s`, opacity: 0.8 }}
        />
      ))}
      <div className="absolute right-8 top-10 h-16 w-16 rounded-full bg-[#ffe9a8] shadow-[0_0_40px_#ffe9a8]">
        <div className="absolute -right-1 -top-2 h-14 w-14 rounded-full bg-[#3a4a85]" />
      </div>

      <div />
      <div className="flex flex-col items-center text-center">
        <div className="animate-melayang">
          <Nuri ukuran={190} ekspresi="senang" dipakai={p.dipakai} />
        </div>
        <div className="mt-4 text-4xl font-extrabold">Hebat!</div>
        <div className="mt-2 text-2xl font-bold leading-snug">
          Waktunya istirahat,
          <br />
          sampai besok ya
        </div>
        <div className="mt-4 text-lg opacity-80">Nuri juga mau istirahat dulu 💤</div>
      </div>
      <button onClick={onOrtu} className="text-sm font-bold underline opacity-70">
        Area orang tua
      </button>
    </div>
  )
}

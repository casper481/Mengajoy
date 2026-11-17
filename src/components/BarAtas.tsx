/** Bar di atas layar ala game: tombol kembali, judul bergaris, api streak, dan bintang. */
import { useProgres } from '../lib/progres'
import { IkonApi, IkonBintang, IkonKembali } from './Ikon'

export default function BarAtas({ onKembali, judul, transparan = false }: { onKembali?: () => void; judul?: string; transparan?: boolean }) {
  const { streakAktif, totalBintang } = useProgres()
  return (
    <div className={`sticky top-0 z-30 flex items-center gap-2 px-3 pt-3 pb-2 ${transparan ? '' : 'bg-gradient-to-b from-[#3cb8de]/80 to-transparent'}`}>
      {onKembali ? (
        <button onClick={onKembali} aria-label="Kembali" className="tombol-game biru flex h-12 w-12 shrink-0 items-center justify-center !rounded-full">
          <IkonKembali />
        </button>
      ) : (
        <div className="w-1" />
      )}
      <div className="judul-game min-w-0 flex-1 truncate px-1 text-center text-[1.35rem] leading-tight" style={{ ['--g' as string]: '#1a5f8a' }}>
        {judul}
      </div>
      <Pil judul="Hari berturut-turut belajar">
        <IkonApi ukuran={24} menyala={streakAktif > 0} />
        <span>{streakAktif}</span>
      </Pil>
      <Pil judul="Total bintang">
        <IkonBintang ukuran={24} />
        <span>{totalBintang}</span>
      </Pil>
    </div>
  )
}

function Pil({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <div
      title={judul}
      className="flex shrink-0 items-center gap-1 rounded-full border-2 border-white/70 bg-[#164d73]/70 py-1 pl-1.5 pr-3 text-lg font-extrabold text-white shadow-[0_3px_0_rgba(0,0,0,0.2)] backdrop-blur-sm"
    >
      {children}
    </div>
  )
}

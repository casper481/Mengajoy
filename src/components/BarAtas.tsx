/** Bar di atas layar: tombol kembali, streak (api), dan total bintang. */
import { useProgres } from '../lib/progres'
import { IkonApi, IkonBintang, IkonKembali } from './Ikon'

export default function BarAtas({ onKembali, judul }: { onKembali?: () => void; judul?: string }) {
  const { streakAktif, totalBintang } = useProgres()
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 bg-langit/70 px-4 pt-3 pb-2 backdrop-blur-md">
      {onKembali ? (
        <button onClick={onKembali} aria-label="Kembali" className="tombol flex h-12 w-12 items-center justify-center bg-white text-tinta">
          <IkonKembali />
        </button>
      ) : (
        <div className="w-12" />
      )}
      <div className="flex-1 truncate text-center text-lg font-extrabold">{judul}</div>
      <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 shadow" title="Hari berturut-turut belajar">
        <IkonApi ukuran={22} menyala={streakAktif > 0} />
        <span className="text-lg font-extrabold">{streakAktif}</span>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 shadow" title="Total bintang">
        <IkonBintang ukuran={22} />
        <span className="text-lg font-extrabold">{totalBintang}</span>
      </div>
    </div>
  )
}

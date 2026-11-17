/** Bar atas ala game: tombol kembali, judul, lencana level + XP, api streak, dan koin. */
import { useNavigasi } from '../lib/navigasi'
import { useProgres } from '../lib/progres'
import { IkonApi, IkonKembali } from './Ikon'

export default function BarAtas({ onKembali, judul, transparan = false }: { onKembali?: () => void; judul?: string; transparan?: boolean }) {
  const { p, streakAktif, level, xpLevelIni, xpLevelBerikut } = useProgres()
  const nav = useNavigasi()
  const persen = Math.min(100, ((p.xp - xpLevelIni) / Math.max(1, xpLevelBerikut - xpLevelIni)) * 100)
  return (
    <div className={`sticky top-0 z-30 px-3 pt-3 pb-2 ${transparan ? '' : 'bg-gradient-to-b from-[#3cb8de]/85 to-transparent'}`}>
      <div className="flex items-center gap-2">
        {onKembali && (
          <button onClick={onKembali} aria-label="Kembali" className="tombol-game biru flex h-11 w-11 shrink-0 items-center justify-center !rounded-full">
            <IkonKembali />
          </button>
        )}
        {/* level + XP */}
        <div className="relative flex min-w-0 flex-1 items-center" title={`Level ${level}`}>
          <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center">
            <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]" aria-hidden>
              <path d="M12 1.5l3.2 6.4 7 1-5.1 5 1.2 7L12 17.6l-6.3 3.3 1.2-7-5.1-5 7-1z" fill="#ffd23f" stroke="#d99a00" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            <span className="relative text-sm font-extrabold text-[#8a5a00]">{level}</span>
          </div>
          <div className="-ml-3 h-6 min-w-0 flex-1 overflow-hidden rounded-full border-2 border-white/80 bg-[#164d73]/70 shadow-[0_3px_0_rgba(0,0,0,0.2)]">
            <div className="h-full rounded-full bg-gradient-to-b from-[#ffd36b] to-[#ff9a2b]" style={{ width: `${persen}%` }} />
          </div>
          {judul && <span className="sr-only">{judul}</span>}
        </div>
        <button onClick={() => nav?.keStreak()} title="Hari berturut-turut belajar" aria-label="Perjalanan api" className="flex shrink-0 items-center gap-1 rounded-full border-2 border-white/80 bg-[#164d73]/70 py-1 pl-1.5 pr-2.5 text-lg font-extrabold text-white shadow-[0_3px_0_rgba(0,0,0,0.2)]">
          <IkonApi ukuran={22} menyala={streakAktif > 0} />
          <span>{streakAktif}</span>
        </button>
        <div title="Koin" className="flex shrink-0 items-center gap-1 rounded-full border-2 border-white/80 bg-[#164d73]/70 py-1 pl-1.5 pr-2.5 text-lg font-extrabold text-white shadow-[0_3px_0_rgba(0,0,0,0.2)]">
          <span className="text-lg leading-none">🪙</span>
          <span>{p.koin}</span>
        </div>
      </div>
      {judul && (
        <div className="judul-game mt-1 truncate text-center text-[1.3rem] leading-tight" style={{ ['--g' as string]: '#1a5f8a' }}>
          {judul}
        </div>
      )}
    </div>
  )
}

/** Layar memuat dunia 3D (bergaya game). */
import Nuri from '../components/Nuri'

export default function LayarMuat() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-4" style={{ background: 'linear-gradient(180deg,#8fdcff,#3cc0dc)' }}>
      <div className="animate-lompat" style={{ animationIterationCount: 'infinite', animationDuration: '1.2s' }}>
        <Nuri ukuran={120} ekspresi="senang" />
      </div>
      <div className="judul-game text-2xl" style={{ ['--g' as string]: '#1a5f8a' }}>
        Menyiapkan dunia...
      </div>
      <div className="h-4 w-56 overflow-hidden rounded-full border-2 border-white bg-[#164d73]/50">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-[#ffd36b] to-[#ff9a2b]" />
      </div>
    </div>
  )
}

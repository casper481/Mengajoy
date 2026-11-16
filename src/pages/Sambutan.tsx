import Nuri from '../components/Nuri'
import { useProgres } from '../lib/progres'
import { sorak } from '../lib/efekSuara'

export default function Sambutan({ onMulai }: { onMulai: () => void }) {
  const { p, mulai } = useProgres()
  return (
    <div className="relative flex min-h-full flex-col items-center justify-between overflow-hidden px-6 py-10">
      {/* awan */}
      <div className="animate-melayang absolute left-[-30px] top-16 h-14 w-36 rounded-full bg-white/80" />
      <div className="animate-melayang absolute right-[-20px] top-40 h-10 w-28 rounded-full bg-white/70" style={{ animationDelay: '1s' }} />

      <div className="animate-masuk text-center">
        <div className="text-5xl font-extrabold tracking-tight text-tinta drop-shadow-sm">
          Menga<span className="text-jeruk">joy</span>
        </div>
        <div className="mt-1 text-lg font-bold text-slate-500">Belajar ngaji itu seru!</div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="animate-masuk relative rounded-3xl bg-white px-6 py-4 text-center text-2xl font-extrabold leading-snug shadow-lg" style={{ animationDelay: '0.4s' }}>
          Assalamu'alaikum!
          <br />
          <span className="text-xl text-slate-600">Yuk berpetualang bersama Nuri!</span>
          <span className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 bg-white" />
        </div>
        <div className="animate-melayang">
          <Nuri ukuran={210} ekspresi="senang" dipakai={p.dipakai} />
        </div>
      </div>

      <button
        onClick={() => {
          sorak()
          mulai()
          onMulai()
        }}
        className="tombol animate-denyut w-full max-w-sm bg-jeruk py-5 text-3xl text-white"
      >
        {p.sudahMulai ? 'Lanjut Petualangan' : 'Mulai Petualangan'}
      </button>
    </div>
  )
}

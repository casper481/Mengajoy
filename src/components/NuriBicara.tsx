/** Nuri dengan balon kata-kata. */
import { useProgres } from '../lib/progres'
import Nuri, { type Ekspresi } from './Nuri'

type Props = {
  teks: string
  ekspresi?: Ekspresi
  ukuran?: number
  animasi?: string
}

export default function NuriBicara({ teks, ekspresi = 'biasa', ukuran = 84, animasi = '' }: Props) {
  const { p } = useProgres()
  return (
    <div className="flex items-end gap-2">
      <div key={ekspresi + teks} className={animasi}>
        <Nuri ukuran={ukuran} ekspresi={ekspresi} dipakai={p.dipakai} />
      </div>
      <div
        key={teks}
        className="animate-muncul relative mb-4 flex-1 rounded-2xl bg-white px-4 py-2 text-[16px] font-bold leading-snug shadow-md"
      >
        <span className="absolute -left-2 bottom-3 h-4 w-4 rotate-45 bg-white" />
        <span className="relative">{teks}</span>
      </div>
    </div>
  )
}

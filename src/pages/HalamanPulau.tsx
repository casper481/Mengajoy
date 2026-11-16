/** Isi satu pulau: stage-stage berbentuk batu loncatan. */
import BarAtas from '../components/BarAtas'
import { BarisBintang } from '../components/Efek'
import { IkonGembok } from '../components/Ikon'
import NuriBicara from '../components/NuriBicara'
import { hurufById } from '../data/huruf'
import { PULAU, stagesOfPulau, type Stage } from '../data/stages'
import { useProgres } from '../lib/progres'
import { pop } from '../lib/efekSuara'

const POSISI_X = [22, 50, 78, 50]

function labelStage(s: Stage): string {
  if (s.jenis === 'huruf') return s.huruf.map((id) => hurufById(id).arab).join(' ')
  return s.judul
}

export default function HalamanPulau({ pulauId, onStage, onKembali }: { pulauId: number; onStage: (id: string) => void; onKembali: () => void }) {
  const { p, stageTerbuka } = useProgres()
  const pulau = PULAU.find((x) => x.id === pulauId)!
  const stages = stagesOfPulau(pulauId)
  const berikut = stages.find((s) => stageTerbuka(s.id) && !p.bintang[s.id])

  return (
    <div className="flex min-h-full flex-col">
      <BarAtas onKembali={onKembali} judul={pulau.nama} />
      <div className="px-4">
        <NuriBicara
          teks={berikut ? 'Ketuk batu yang bersinar untuk mulai!' : 'MasyaAllah! Semua stage di pulau ini sudah selesai!'}
          ekspresi="senang"
          ukuran={72}
        />
      </div>

      <div className="relative mx-auto w-full max-w-md flex-1 pb-10" style={{ minHeight: stages.length * 130 + 40 }}>
        {stages.map((s, i) => {
          const buka = stageTerbuka(s.id)
          const bintang = p.bintang[s.id] ?? 0
          const aktif = berikut?.id === s.id
          return (
            <div
              key={s.id}
              className="animate-masuk absolute flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${POSISI_X[i % 4]}%`, top: i * 130 + 10, animationDelay: `${i * 0.08}s` }}
            >
              <button
                onClick={() => {
                  if (!buka) return
                  pop()
                  onStage(s.id)
                }}
                disabled={!buka}
                aria-label={`Stage ${s.nomor}`}
                className={`tombol relative flex h-24 w-32 flex-col items-center justify-center rounded-[2rem] ${
                  buka ? 'bg-white' : 'bg-slate-200'
                } ${aktif ? 'animate-denyut ring-4 ring-bintang' : ''}`}
                style={buka ? { borderBottom: `6px solid ${pulau.warna}` } : undefined}
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-tinta px-2.5 text-sm font-extrabold text-white">{s.nomor}</span>
                {buka ? (
                  <span className={`${s.jenis === 'huruf' ? 'arab text-[1.7rem]' : 'text-xl font-extrabold'} whitespace-nowrap leading-none`}>{labelStage(s)}</span>
                ) : (
                  <IkonGembok ukuran={34} />
                )}
              </button>
              <div className="mt-1">
                <BarisBintang jumlah={bintang} ukuran={24} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

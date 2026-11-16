/**
 * Pengatur halaman: menentukan layar mana yang tampil.
 * Juga menghitung waktu belajar & memeriksa batas waktu harian.
 */
import { useEffect, useRef, useState } from 'react'
import { useProgres } from './lib/progres'
import AreaOrtu from './pages/AreaOrtu'
import GerbangOrtu from './pages/GerbangOrtu'
import HalamanPulau from './pages/HalamanPulau'
import HalamanQuran from './pages/HalamanQuran'
import LatihanHarian from './pages/LatihanHarian'
import Tamat from './pages/Tamat'
import { stageById } from './data/stages'
import HalamanStage from './pages/HalamanStage'
import Istirahat from './pages/Istirahat'
import Lemari from './pages/Lemari'
import Misi from './pages/Misi'
import Peta from './pages/Peta'
import Sambutan from './pages/Sambutan'

type Layar =
  | { nama: 'sambutan' }
  | { nama: 'peta' }
  | { nama: 'pulau'; id: number }
  | { nama: 'stage'; id: string; ulang: number }
  | { nama: 'lemari' }
  | { nama: 'misi' }
  | { nama: 'gerbang' }
  | { nama: 'ortu' }
  | { nama: 'latihan' }
  | { nama: 'tamat' }

const LAYAR_ORTU = ['gerbang', 'ortu']

export default function App() {
  const [layar, setLayar] = useState<Layar>({ nama: 'sambutan' })
  const { tambahWaktu, batasTercapai } = useProgres()
  const atas = useRef<HTMLDivElement>(null)

  // Hitung waktu belajar: hanya saat app terlihat & anak sedang di layar anak.
  const layarRef = useRef(layar.nama)
  layarRef.current = layar.nama
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      if (LAYAR_ORTU.includes(layarRef.current) || layarRef.current === 'sambutan') return
      tambahWaktu(5)
    }, 5000)
    return () => clearInterval(t)
  }, [tambahWaktu])

  useEffect(() => {
    atas.current?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
  }, [layar])

  const ke = (l: Layar) => setLayar(l)

  // Batas waktu: stage yang sedang berjalan boleh diselesaikan dulu.
  const istirahat = batasTercapai && !LAYAR_ORTU.includes(layar.nama) && layar.nama !== 'stage' && layar.nama !== 'latihan'

  let isi
  if (istirahat) {
    isi = <Istirahat onOrtu={() => ke({ nama: 'gerbang' })} />
  } else {
    switch (layar.nama) {
      case 'sambutan':
        isi = <Sambutan onMulai={() => ke({ nama: 'peta' })} />
        break
      case 'peta':
        isi = (
          <Peta
            onPulau={(id) => ke({ nama: 'pulau', id })}
            onLemari={() => ke({ nama: 'lemari' })}
            onMisi={() => ke({ nama: 'misi' })}
            onOrtu={() => ke({ nama: 'gerbang' })}
            onLatihan={() => ke({ nama: 'latihan' })}
          />
        )
        break
      case 'pulau':
        isi = layar.id === 6 ? <HalamanQuran onKembali={() => ke({ nama: 'peta' })} onSertifikat={() => ke({ nama: 'tamat' })} /> : <HalamanPulau pulauId={layar.id} onStage={(id) => ke({ nama: 'stage', id, ulang: 0 })} onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'stage': {
        const pulau = stageById(layar.id).pulau
        isi = (
          <HalamanStage
            key={layar.id + layar.ulang}
            stageId={layar.id}
            onKembali={() => ke({ nama: 'pulau', id: pulau })}
            onUlang={() => ke({ nama: 'stage', id: layar.id, ulang: layar.ulang + 1 })}
            onTamat={() => ke({ nama: 'tamat' })}
          />
        )
        break
      }
      case 'latihan':
        isi = <LatihanHarian onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'tamat':
        isi = <Tamat onQuran={() => ke({ nama: 'pulau', id: 6 })} onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'lemari':
        isi = <Lemari onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'misi':
        isi = <Misi onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'gerbang':
        isi = <GerbangOrtu onLolos={() => ke({ nama: 'ortu' })} onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'ortu':
        isi = <AreaOrtu onKembali={() => ke({ nama: 'peta' })} onSertifikat={() => ke({ nama: 'tamat' })} />
        break
    }
  }

  return (
    <div ref={atas} className="mx-auto flex min-h-full w-full max-w-md flex-col">
      {isi}
    </div>
  )
}

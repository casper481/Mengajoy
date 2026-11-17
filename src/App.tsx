/**
 * Pengatur halaman: menentukan layar mana yang tampil.
 * Juga menghitung waktu belajar & memeriksa batas waktu harian.
 */
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { dukungan3D } from './dunia3d/dukungan'
import LayarMuat from './dunia3d/LayarMuat'

const Dunia3D = lazy(() => import('./dunia3d/Dunia3D'))
import { useProgres } from './lib/progres'
import AreaOrtu from './pages/AreaOrtu'
import GerbangOrtu from './pages/GerbangOrtu'
import HalamanPulau from './pages/HalamanPulau'
import HalamanQuran from './pages/HalamanQuran'
import HalamanSurat from './pages/HalamanSurat'
import LatihanHarian from './pages/LatihanHarian'
import Tamat from './pages/Tamat'
import { stageById } from './data/stages'
import HalamanStage from './pages/HalamanStage'
import Istirahat from './pages/Istirahat'
import Lemari from './pages/Lemari'
import Misi from './pages/Misi'
import Peta from './pages/Peta'
import Sambutan from './pages/Sambutan'
import LatarLembut from './components/dunia/LatarLembut'
import BuatAvatar from './pages/BuatAvatar'
import Rumahku from './pages/Rumahku'
import Koleksi from './pages/Koleksi'
import Streak from './pages/Streak'
import EventMingguan from './pages/EventMingguan'
import { NavCtx } from './lib/navigasi'
import { Tampilan3DCtx } from './lib/tampilan3d'
import type { Tujuan } from './lib/misiHarian'

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
  | { nama: 'surat'; nomor: number }
  | { nama: 'avatar'; lanjut: 'peta' | 'rumah' }
  | { nama: 'rumah' }
  | { nama: 'koleksi' }
  | { nama: 'streak' }
  | { nama: 'event' }

const LAYAR_ORTU = ['gerbang', 'ortu']

export default function App() {
  const [layar, setLayar] = useState<Layar>({ nama: 'sambutan' })
  const { p, tambahWaktu, batasTercapai } = useProgres()
  const dukungan = useMemo(() => dukungan3D(), [])
  const [gagal3D, setGagal3D] = useState(false)
  const pakai3D = !gagal3D && (p.tampilan === '3d' || (p.tampilan === 'otomatis' && dukungan.bisa))
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
  const pergi = (t: Tujuan) => {
    if (t.jenis === 'stage') ke({ nama: 'pulau', id: t.pulau })
    else if (t.jenis === 'latihan') ke({ nama: 'latihan' })
    else if (t.jenis === 'quran') ke({ nama: 'pulau', id: 6 })
    else ke({ nama: 'peta' })
  }

  // Batas waktu: stage yang sedang berjalan boleh diselesaikan dulu.
  const istirahat = batasTercapai && !LAYAR_ORTU.includes(layar.nama) && layar.nama !== 'stage' && layar.nama !== 'latihan'

  let isi
  if (istirahat) {
    isi = <Istirahat onOrtu={() => ke({ nama: 'gerbang' })} />
  } else {
    switch (layar.nama) {
      case 'sambutan':
        isi = <Sambutan onMulai={() => ke(p.avatarDibuat ? { nama: 'peta' } : { nama: 'avatar', lanjut: 'peta' })} />
        break
      case 'peta':
        isi = pakai3D ? (
          <Suspense fallback={<LayarMuat />}>
            <Dunia3D
              kualitas={dukungan.kualitas}
              onGagal={() => setGagal3D(true)}
              onPulau={(id) => ke({ nama: 'pulau', id })}
              onRumah={() => ke({ nama: 'rumah' })}
              onKoleksi={() => ke({ nama: 'koleksi' })}
              onMisi={() => ke({ nama: 'misi' })}
              onOrtu={() => ke({ nama: 'gerbang' })}
              onLatihan={() => ke({ nama: 'latihan' })}
              onEvent={() => ke({ nama: 'event' })}
            />
          </Suspense>
        ) : (
          <Peta
            onPulau={(id) => ke({ nama: 'pulau', id })}
            onRumah={() => ke({ nama: 'rumah' })}
            onKoleksi={() => ke({ nama: 'koleksi' })}
            onEvent={() => ke({ nama: 'event' })}
            onMisi={() => ke({ nama: 'misi' })}
            onOrtu={() => ke({ nama: 'gerbang' })}
            onLatihan={() => ke({ nama: 'latihan' })}
          />
        )
        break
      case 'pulau':
        isi = layar.id === 6 ? <HalamanQuran onKembali={() => ke({ nama: 'peta' })} onSertifikat={() => ke({ nama: 'tamat' })} onSurat={(nomor) => ke({ nama: 'surat', nomor })} /> : <HalamanPulau pulauId={layar.id} onStage={(id) => ke({ nama: 'stage', id, ulang: 0 })} onKembali={() => ke({ nama: 'peta' })} />
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
      case 'surat':
        isi = <HalamanSurat key={layar.nomor} nomor={layar.nomor} onKembali={() => ke({ nama: 'pulau', id: 6 })} />
        break
      case 'avatar':
        isi = <BuatAvatar onSelesai={() => ke({ nama: layar.lanjut })} />
        break
      case 'rumah':
        isi = <Rumahku onKembali={() => ke({ nama: 'peta' })} onAvatar={() => ke({ nama: 'avatar', lanjut: 'rumah' })} />
        break
      case 'koleksi':
        isi = <Koleksi onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'streak':
        isi = <Streak onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'event':
        isi = <EventMingguan onKembali={() => ke({ nama: 'peta' })} onPergi={pergi} />
        break
      case 'lemari':
        isi = <Lemari onKembali={() => ke({ nama: 'peta' })} />
        break
      case 'misi':
        isi = <Misi onKembali={() => ke({ nama: 'peta' })} onPergi={pergi} />
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
    <NavCtx.Provider value={{ keStreak: () => ke({ nama: 'streak' }) }}>
    <Tampilan3DCtx.Provider value={{ pakai3D, kualitas: dukungan.kualitas, gagal: () => setGagal3D(true) }}>
    <div ref={atas} className="relative mx-auto flex min-h-full w-full max-w-md flex-col">
      {!istirahat && !['sambutan', 'peta', 'rumah'].includes(layar.nama) && !(layar.nama === 'pulau' && layar.id !== 6) && <LatarLembut />}
      <div className="relative z-10 flex min-h-full flex-1 flex-col">{isi}</div>
    </div>
    </Tampilan3DCtx.Provider>
    </NavCtx.Provider>
  )
}

/**
 * DUNIA 3D MENGAJOY — layar utama berbentuk dunia kepulauan 3D.
 * - Kamera isometrik yang bisa digeser (1 jari) dan di-zoom (cubit), terbang halus ke pulau yang diketuk.
 * - Pulau Rumahku berisi karakter anak, Momo, rumah sesuai dekorasi, dan peti harian.
 * - Pulau level terbuka sesuai progres (ada animasi saat pulau baru terbuka).
 * Dimuat terpisah (lazy) dan hanya dipakai bila perangkat mendukung.
 */
import { CameraControls, CameraControlsImpl, Html, PerformanceMonitor, Sparkles } from '@react-three/drei'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import BarAtas from '../components/BarAtas'
import { Konfeti } from '../components/Efek'
import { IkonMisi, IkonOrangTua } from '../components/Ikon'
import { EVENT_MINGGUAN, tahapPeliharaan, TAHAP_PELIHARAAN } from '../data/dunia'
import { PULAU, stagesOfPulau } from '../data/stages'
import { boing, bukaPeti, cicit, pop, pulauTerbuka as suaraPulauTerbuka, sorak, wuush } from '../lib/efekSuara'
import { useProgres } from '../lib/progres'
import type { Kualitas } from './dukungan'
import { Avatar3D, Momo3D, Nuri3D } from './Karakter3D'
import { JalanBatu, Laut3D, Ledakan3D, type JenisPartikel } from './Efek3D'
import {
  AirTerjun3D,
  Awan3D,
  BadanPulau,
  Batu3D,
  Bunga3D,
  Gembok3D,
  Kelapa,
  Kristal3D,
  Perahu3D,
  Peti3D,
  Pohon,
  RumahJamur3D,
  RumahKayu3D,
  RumahKubah3D,
  TEMA3D,
} from './Objek3D'

const { ACTION } = CameraControlsImpl
const ATAS = 0.66 // tinggi permukaan rumput

type PulauDunia = { id: number; x: number; z: number; r: number }
const DUNIA: PulauDunia[] = [
  { id: 0, x: 0.2, z: 8, r: 2.6 }, // Rumahku
  { id: 1, x: -2.5, z: 2.9, r: 2.1 },
  { id: 2, x: 2.6, z: -1.9, r: 2.1 },
  { id: 3, x: -2.5, z: -6.9, r: 2.1 },
  { id: 4, x: 2.6, z: -11.9, r: 2.1 },
  { id: 5, x: -2.4, z: -16.9, r: 2.1 },
  { id: 6, x: 0.6, z: -22.6, r: 2.8 },
]

const POLAR = 0.88
const AZIMUT = 0.32
const posKamera = (x: number, z: number, jarak: number): [number, number, number, number, number, number] => [
  x + jarak * Math.sin(POLAR) * Math.sin(AZIMUT),
  jarak * Math.cos(POLAR),
  z + jarak * Math.sin(POLAR) * Math.cos(AZIMUT),
  x,
  0.4,
  z,
]

const simpanAngka = (k: string, v: number) => {
  try {
    localStorage.setItem(k, String(v))
  } catch {
    /* abaikan */
  }
}
const bacaAngka = (k: string): number | null => {
  try {
    const v = localStorage.getItem(k)
    return v === null ? null : Number(v)
  } catch {
    return null
  }
}

type Props = {
  kualitas: Kualitas
  onPulau: (id: number) => void
  onRumah: () => void
  onKoleksi: () => void
  onMisi: () => void
  onOrtu: () => void
  onLatihan: () => void
  onEvent: () => void
  onGagal: () => void
}

type Ledakan = { id: number; posisi: [number, number, number]; jenis: JenisPartikel; jumlah: number }

export default function Dunia3D(props: Props) {
  const { p, pulauTerbuka, latihanTersedia, latihanHariIniSelesai, harian, klaim, apresiasiBaru, bacaApresiasi } = useProgres()
  const kamera = useRef<CameraControls>(null)
  const [pilih, setPilih] = useState<number | null>(null)
  const [ledakan, setLedakan] = useState<Ledakan[]>([])
  const [mengambang, setMengambang] = useState<{ id: number; teks: string; posisi: [number, number, number] }[]>([])
  const [pesan, setPesan] = useState<string | null>(null)
  const [membuka, setMembuka] = useState<number | null>(null)
  const [goyangKunci, setGoyangKunci] = useState<Record<number, number>>({})
  const [lompatAvatar, setLompatAvatar] = useState(0)
  const [lompatMomo, setLompatMomo] = useState(0)
  const [putarNuri, setPutarNuri] = useState(0)
  const [menetas, setMenetas] = useState(0)
  const [petiBuka, setPetiBuka] = useState(false)
  const [dpr, setDpr] = useState(props.kualitas === 'tinggi' ? 1.75 : 1.4)
  const idRef = useRef(1)
  const [kameraSiap, setKameraSiap] = useState(false)
  const pasangKamera = useCallback((c: CameraControls | null) => {
    kamera.current = c
    if (c) setKameraSiap(true)
  }, [])

  const tahap = tahapPeliharaan(p.xp)
  const terbuka = (id: number) => id === 0 || pulauTerbuka(id)
  const pulauAktif = [...PULAU].reverse().find((x) => pulauTerbuka(x.id))?.id ?? 1
  const rumah = DUNIA[0]
  const aktif = DUNIA[pulauAktif]

  const ledak = useCallback((posisi: [number, number, number], jenis: JenisPartikel, jumlah = 18) => {
    const id = idRef.current++
    setLedakan((l) => [...l, { id, posisi, jenis, jumlah }])
  }, [])
  const apung = useCallback((teks: string, posisi: [number, number, number]) => {
    const id = idRef.current++
    setMengambang((m) => [...m, { id, teks, posisi }])
    setTimeout(() => setMengambang((m) => m.filter((x) => x.id !== id)), 1800)
  }, [])
  const tampilPesan = useCallback((t: string) => {
    setPesan(t)
    setTimeout(() => setPesan((x) => (x === t ? null : x)), 2600)
  }, [])

  const terbangKe = useCallback((x: number, z: number, jarak = 10) => {
    kamera.current?.setLookAt(...posKamera(x, z, jarak), true)
  }, [])

  // atur kamera: geser dengan 1 jari, zoom dengan cubit, tanpa memutar
  useEffect(() => {
    const c = kamera.current
    if (!c || !kameraSiap) return
    c.dollyToCursor = false
    c.minDistance = 8
    c.maxDistance = 26
    c.minPolarAngle = POLAR
    c.maxPolarAngle = POLAR
    c.minAzimuthAngle = AZIMUT
    c.maxAzimuthAngle = AZIMUT
    c.smoothTime = 0.35
    c.setBoundary(new THREE.Box3(new THREE.Vector3(-4, 0, -25), new THREE.Vector3(4, 1, 9)))
    c.setLookAt(...posKamera(0, rumah.z - 3.4, 19), false)
  }, [rumah.x, rumah.z, kameraSiap])

  // animasi pulau baru terbuka & Momo menetas/tumbuh (dibandingkan dengan kunjungan sebelumnya)
  useEffect(() => {
    if (!kameraSiap) return
    const jumlahTerbuka = PULAU.filter((x) => pulauTerbuka(x.id)).length
    const dulu = bacaAngka('mengajoy:pulau-terlihat')
    const timers: number[] = []
    if (dulu !== null && jumlahTerbuka > dulu && !p.modeDemo) {
      const id = PULAU.filter((x) => pulauTerbuka(x.id))[jumlahTerbuka - 1].id
      timers.push(window.setTimeout(() => {
        const pl = DUNIA[id]
        terbangKe(pl.x, pl.z + 0.6, 15)
        wuush()
      }, 900))
      timers.push(window.setTimeout(() => {
        setMembuka(id)
        suaraPulauTerbuka()
        const pl = DUNIA[id]
        ledak([pl.x, ATAS + 1.4, pl.z], 'bintang', 30)
        tampilPesan(`🎉 Pulau baru terbuka: ${PULAU.find((x) => x.id === id)?.nama}!`)
      }, 2000))
      timers.push(window.setTimeout(() => setMembuka(null), 4200))
    }
    if (!p.modeDemo) simpanAngka('mengajoy:pulau-terlihat', jumlahTerbuka)

    const tahapDulu = bacaAngka('mengajoy:tahap-momo')
    if (tahapDulu !== null && tahap > tahapDulu) {
      timers.push(window.setTimeout(() => {
        terbangKe(rumah.x, rumah.z, 12)
        if (tahapDulu === 0) {
          setMenetas((n) => n + 1)
          timers.push(window.setTimeout(() => {
            ledak([rumah.x + 0.9, ATAS + 0.6, rumah.z + 0.35], 'pecahan', 22)
            sorak()
            tampilPesan(`🐣 ${p.namaPeliharaan} menetas!`)
          }, 1600))
        } else {
          ledak([rumah.x + 0.9, ATAS + 0.8, rumah.z + 0.35], 'bintang', 24)
          sorak()
          tampilPesan(`✨ ${p.namaPeliharaan} tumbuh menjadi "${TAHAP_PELIHARAAN[tahap].nama}"!`)
        }
      }, 700))
    }
    simpanAngka('mengajoy:tahap-momo', tahap)
    return () => timers.forEach(clearTimeout)
    // hanya sekali, saat kamera sudah siap
  }, [kameraSiap]) // eslint-disable-line react-hooks/exhaustive-deps

  const ketukPulau = (id: number) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (e.delta > 10) return // itu geseran, bukan ketukan
    const pl = DUNIA[id]
    pop()
    wuush()
    setPilih(id)
    terbangKe(pl.x, pl.z + 0.6, id === 0 ? 14 : 15)
    if (!terbuka(id)) {
      setGoyangKunci((g) => ({ ...g, [id]: (g[id] ?? 0) + 1 }))
      tampilPesan('🔒 Selesaikan pulau sebelumnya dulu, ya!')
    }
  }

  const ketukAvatar = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    boing()
    setLompatAvatar((n) => n + 1)
    ledak([rumah.x + 0.2, ATAS + 1.8, rumah.z + 0.4], 'hati', 10)
  }
  const ketukMomo = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (tahap === 0) {
      boing()
      setMenetas((n) => n) // telur bergoyang
      setLompatMomo((n) => n + 1)
      tampilPesan(`🥚 Telurnya bergoyang! Belajar terus supaya ${p.namaPeliharaan} menetas.`)
      return
    }
    cicit()
    setLompatMomo((n) => n + 1)
    ledak([rumah.x + 0.6, ATAS + 1.2, rumah.z + 0.6], 'hati', 12)
    tampilPesan(`💕 ${p.namaPeliharaan} senang kamu datang!`)
  }
  const ketukNuri = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    cicit()
    setPutarNuri((n) => n + 1)
    setPilih(pulauAktif)
    terbangKe(aktif.x, aktif.z + 0.6, 15)
    tampilPesan('🐦 Ayo lanjut petualangan di pulau ini!')
  }
  const ketukPeti = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (petiBuka) return
    setPetiBuka(true)
    bukaPeti()
    const pos: [number, number, number] = [rumah.x - 1.25, ATAS + 0.8, rumah.z + 0.8]
    if (!harian.diklaim.includes('peti')) {
      klaim('peti', 10, 5)
      ledak(pos, 'koin', 22)
      apung('+10 🪙', [pos[0], pos[1] + 0.6, pos[2]])
      tampilPesan('🎁 Hadiah harian! Datang lagi besok, ya.')
    } else {
      ledak(pos, 'bintang', 8)
      tampilPesan('Peti sudah dibuka hari ini. Besok ada hadiah lagi!')
    }
    setTimeout(() => setPetiBuka(false), 2600)
  }

  const masuk = () => {
    if (pilih === null) return
    pop()
    if (pilih === 0) props.onRumah()
    else if (terbuka(pilih)) props.onPulau(pilih)
  }

  const infoPilih = pilih === null ? null : pilih === 0 ? null : PULAU.find((x) => x.id === pilih)
  const bintangPulau = (id: number) => stagesOfPulau(id).reduce((a, s) => a + (p.bintang[s.id] ?? 0), 0)
  const ev = EVENT_MINGGUAN[new Date().getDay()]

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden" style={{ background: 'linear-gradient(180deg,#8fdcff 0%,#c8efff 45%,#bfeaff 100%)' }}>
      <PenjagaGagal onGagal={props.onGagal}>
        <Canvas
          shadows
          dpr={dpr}
          camera={{ fov: 38, near: 0.5, far: 120, position: [4, 14, 20] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.NeutralToneMapping
            gl.toneMappingExposure = 1.05
          }}
          onPointerMissed={() => setPilih(null)}
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} />
          {import.meta.env.DEV && <AlatUjiPosisi titik={{ rumah: [rumah.x, ATAS, rumah.z], peti: [rumah.x - 1.25, ATAS + 0.3, rumah.z + 0.8], avatar: [rumah.x + 0.2, ATAS + 0.8, rumah.z + 0.4] }} />}
          <fog attach="fog" args={['#bfeaff', 26, 58]} />
          <hemisphereLight args={['#dff4ff', '#5d8f5a', 1.1]} />
          <directionalLight
            position={[10, 18, 9]}
            intensity={2.4}
            color="#fff4dc"
            castShadow
            shadow-mapSize={props.kualitas === 'tinggi' ? [2048, 2048] : [1024, 1024]}
            shadow-camera-left={-16}
            shadow-camera-right={16}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-camera-near={1}
            shadow-camera-far={60}
            shadow-bias={-0.0006}
            shadow-normalBias={0.03}
          />
          <CameraControls
            ref={pasangKamera}
            makeDefault
            mouseButtons={{ left: ACTION.SCREEN_PAN, middle: ACTION.NONE, right: ACTION.NONE, wheel: ACTION.DOLLY }}
            touches={{ one: ACTION.TOUCH_SCREEN_PAN, two: ACTION.TOUCH_DOLLY, three: ACTION.NONE }}
          />

          <Suspense fallback={null}>
            <Laut3D pulau={DUNIA.map((d) => ({ x: d.x, z: d.z, r: d.r }))} />
            <JalanBatu titik={DUNIA.map((d) => new THREE.Vector3(d.x, 0, d.z))} />

            {DUNIA.map((d) => (
              <PulauDuniaMesh
                key={d.id}
                d={d}
                terbuka={terbuka(d.id)}
                membuka={membuka === d.id}
                goyang={goyangKunci[d.id] ?? 0}
                onKetuk={ketukPulau(d.id)}
                dekorasi={d.id === 0 ? p.dekorasi.slot : undefined}
                label={d.id === 0 ? 'Rumahku' : PULAU.find((x) => x.id === d.id)!.nama.replace('Pulau ', '')}
                info={d.id === 0 ? `Lv ${Math.floor(Math.sqrt(p.xp / 50)) + 1}` : terbuka(d.id) ? (d.id === 6 ? '✨' : `⭐ ${bintangPulau(d.id)}/${stagesOfPulau(d.id).length * 3}`) : '🔒'}
                dipilih={pilih === d.id}
              />
            ))}

            {/* penghuni Pulau Rumahku */}
            <Avatar3D a={p.avatar} position={[rumah.x + 0.2, ATAS, rumah.z + 0.4]} onTap={ketukAvatar} lompat={lompatAvatar} />
            <Momo3D tahap={tahap} pusat={[rumah.x + 0.2, ATAS, rumah.z + 0.4]} onTap={ketukMomo} lompat={lompatMomo} menetas={menetas} />
            <Peti3D terbuka={petiBuka} position={[rumah.x - 1.25, ATAS, rumah.z + 0.8]} onClick={ketukPeti} />
            {!harian.diklaim.includes('peti') && <Sparkles count={14} scale={[1, 1, 1]} size={4} speed={0.6} position={[rumah.x - 1.25, ATAS + 0.6, rumah.z + 0.8]} color="#ffe066" />}

            {/* Nuri menunggu di pulau aktif */}
            <Nuri3D position={[aktif.x + 1.5, ATAS + 2.1, aktif.z + 0.9]} onTap={ketukNuri} putar={putarNuri} dipakai={p.dipakai} />

            {/* suasana */}
            <AwanBerjalan />
            <BurungTerbang />
            <Perahu3D position={[4.6, 0.05, 4.5]} putar={0.6} />
            <Perahu3D position={[-5.4, 0.05, -11]} putar={-0.4} />
            <Batu3D position={[5.6, 0.1, -6.5]} s={1.4} />
            <Batu3D position={[-5.6, 0.1, -1.5]} s={1.1} />
            <Batu3D position={[4.8, 0.1, -19]} s={1.2} />
            <Batu3D position={[-4.6, 0.1, 7]} s={0.9} />
            {terbuka(6) && <Sparkles count={40} scale={[6, 4, 6]} size={5} speed={0.4} position={[DUNIA[6].x, ATAS + 2, DUNIA[6].z]} color="#fff3b0" />}

            {ledakan.map((l) => (
              <Ledakan3D key={l.id} posisi={l.posisi} jenis={l.jenis} jumlah={l.jumlah} onSelesai={() => setLedakan((x) => x.filter((y) => y.id !== l.id))} />
            ))}
            {mengambang.map((m) => (
              <Html key={m.id} position={m.posisi} center style={{ pointerEvents: 'none' }}>
                <div className="hadiah-melayang judul-game whitespace-nowrap text-3xl" style={{ ['--g' as string]: '#b4520e', color: '#ffd36b' }}>
                  {m.teks}
                </div>
              </Html>
            ))}
          </Suspense>
        </Canvas>
      </PenjagaGagal>

      {/* ===== HUD ===== */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="pointer-events-auto">
          <BarAtas transparan />
        </div>
      </div>

      {/* tombol samping */}
      <div className="absolute right-3 top-20 z-20 flex flex-col gap-3">
        <TombolBulat
          ikon={latihanHariIniSelesai ? '✓' : '🔁'}
          label="Latihan"
          warna="ungu"
          denyut={latihanTersedia && !latihanHariIniSelesai}
          mati={!latihanTersedia}
          onClick={() => (latihanTersedia ? props.onLatihan() : tampilPesan('Selesaikan 1 stage dulu, lalu latihan ya!'))}
        />
        <TombolBulat ikon={ev.ikon} label="Event" warna="jeruk" denyut={!harian.diklaim.includes('event')} onClick={props.onEvent} />
      </div>

      {/* pesan */}
      {pesan && (
        <div className="pointer-events-none absolute inset-x-0 top-28 z-30 flex justify-center px-6">
          <div key={pesan} className="panel-game animate-masuk px-4 py-2 text-center font-extrabold text-[#6b4e24]">
            {pesan}
          </div>
        </div>
      )}

      {/* panel pulau terpilih */}
      {pilih !== null && (
        <div className="absolute inset-x-3 bottom-[104px] z-20">
          <div key={pilih} className="panel-game animate-muncul flex items-center gap-3 p-3">
            <div className="min-w-0 flex-1">
              <div className="judul-game truncate text-2xl leading-tight" style={{ ['--g' as string]: '#7a4e22', color: '#ffd9a0' }}>
                {pilih === 0 ? 'Pulau Rumahku' : infoPilih?.nama}
              </div>
              <div className="text-sm font-bold text-[#9a7b4f]">
                {pilih === 0
                  ? 'Hias pulaumu & temui Momo'
                  : !terbuka(pilih)
                    ? '🔒 Selesaikan pulau sebelumnya'
                    : pilih === 6
                      ? 'Membaca surat-surat pendek'
                      : `⭐ ${bintangPulau(pilih)} / ${stagesOfPulau(pilih).length * 3} bintang`}
              </div>
            </div>
            {terbuka(pilih) && (
              <button onClick={masuk} className="tombol-game jeruk animate-denyut px-6 py-3 text-xl">
                Masuk ▶
              </button>
            )}
          </div>
        </div>
      )}

      {/* menu bawah */}
      <div className="absolute inset-x-0 bottom-0 z-20 grid grid-cols-4 gap-2 bg-gradient-to-t from-[#1f97c6]/80 to-transparent px-3 pb-4 pt-6">
        <TombolMenu onClick={props.onRumah} label="Rumahku" ikon={<span className="text-[28px] leading-[34px]">🏡</span>} />
        <TombolMenu onClick={props.onMisi} label="Misi Hari Ini" ikon={<IkonMisi ukuran={34} />} titik={!harian.diklaim.includes('bonus')} />
        <TombolMenu onClick={props.onKoleksi} label="Koleksi" ikon={<span className="text-[28px] leading-[34px]">🏅</span>} />
        <TombolMenu onClick={props.onOrtu} label="Orang Tua" ikon={<IkonOrangTua ukuran={34} />} />
      </div>

      {apresiasiBaru && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <Konfeti />
          <div className="panel-game animate-putar-masuk w-full max-w-xs p-6 text-center">
            <div className="text-sm font-extrabold text-[#b89b6a]">💌 PESAN DARI AYAH / BUNDA</div>
            <div className="my-2 text-7xl">{apresiasiBaru.stiker}</div>
            <div className="text-xl font-extrabold leading-snug text-[#6b4e24]">{apresiasiBaru.pesan}</div>
            <div className="mt-2 font-extrabold text-[#9a6a00]">🪙 +20 koin</div>
            <button onClick={bacaApresiasi} className="tombol-game jeruk mt-4 w-full py-3 text-xl">
              Terima kasih! 🤗
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ====================== Satu pulau di dunia ====================== */
function PulauDuniaMesh({
  d,
  terbuka,
  membuka,
  goyang,
  onKetuk,
  dekorasi,
  label,
  info,
  dipilih,
}: {
  d: PulauDunia
  terbuka: boolean
  membuka: boolean
  goyang: number
  onKetuk: (e: ThreeEvent<MouseEvent>) => void
  dekorasi?: Record<string, string>
  label: string
  info: string
  dipilih: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  const awan = useRef<THREE.Group>(null)
  const mulaiBuka = useRef<number | null>(null)
  const bentuk = useMemo(() => [1 + ((d.id * 17) % 7) / 60, 1 - ((d.id * 13) % 7) / 70] as const, [d.id])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (ref.current) {
      ref.current.position.y = Math.sin(t * 0.6 + d.id) * 0.03
      const s = dipilih ? 1.03 : 1
      ref.current.scale.x += (s * bentuk[0] - ref.current.scale.x) * 0.1
      ref.current.scale.z += (s * bentuk[1] - ref.current.scale.z) * 0.1
    }
    if (awan.current) {
      if (membuka && mulaiBuka.current === null) mulaiBuka.current = t
      const k = mulaiBuka.current === null ? 1 : Math.max(0, 1 - (t - mulaiBuka.current) / 1.4)
      awan.current.scale.setScalar(k)
      awan.current.rotation.y = t * 0.1
      awan.current.visible = k > 0.01
    }
  })
  const tema = TEMA3D[d.id]
  const tampilIsi = terbuka || membuka
  const tampilKabut = !terbuka || membuka
  return (
    <group position={[d.x, 0, d.z]}>
      <group ref={ref} onClick={onKetuk}>
        <BadanPulau r={d.r} tema={tema} abu={!tampilIsi} />
        {tampilIsi && <IsiPulau id={d.id} dekorasi={dekorasi} />}
      </group>
      {tampilKabut && (
        <group ref={awan}>
          <Awan3D position={[-1.1, ATAS + 0.6, 0.6]} s={0.9} />
          <Awan3D position={[1.2, ATAS + 0.8, -0.2]} s={1} />
          <Awan3D position={[0, ATAS + 1.0, -1.1]} s={0.85} />
          <Gembok3D position={[0, ATAS + 1.6, 0.4]} goyang={goyang} />
        </group>
      )}
      <Html position={[0, ATAS + (d.id === 6 ? 3.4 : 2.7), 0]} center distanceFactor={13} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col items-center" style={{ opacity: dipilih ? 0 : 1, transition: 'opacity .3s' }}>
          <div
            className="judul-game whitespace-nowrap rounded-xl border-[3px] border-[#7a4e22] px-3 py-0.5 text-lg leading-tight shadow-[0_4px_0_#5a3612]"
            style={{ background: terbuka ? 'linear-gradient(180deg,#d9a066,#b07438)' : 'linear-gradient(180deg,#a7b0bf,#7d8797)', ['--g' as string]: '#5a3612' }}
          >
            {label}
          </div>
          <div className="-mt-0.5 whitespace-nowrap rounded-b-xl bg-white/95 px-2.5 text-sm font-extrabold text-[#6b4e24] shadow">{info}</div>
        </div>
      </Html>
    </group>
  )
}

function IsiPulau({ id, dekorasi }: { id: number; dekorasi?: Record<string, string> }) {
  const y = ATAS
  switch (id) {
    case 0: {
      const rumah = dekorasi?.rumah
      const pohon = (slot: string, pos: [number, number, number]) => {
        const v = dekorasi?.[slot]
        if (!v) return null
        if (v === 'pohon-kelapa') return <Kelapa position={pos} s={0.9} />
        return <Pohon position={pos} s={1.05} warna={v === 'pohon-sakura' ? '#ff9fc7' : v === 'pohon-jeruk' ? '#3fae4f' : '#4fbf5a'} />
      }
      return (
        <>
          {rumah === 'rumah-jamur' ? (
            <RumahJamur3D position={[-0.4, y, -1.1]} s={1.15} />
          ) : rumah === 'rumah-kubah' ? (
            <RumahKubah3D position={[-0.4, y, -1.1]} s={0.8} bersinar={false} />
          ) : rumah ? (
            <RumahKayu3D position={[-0.4, y, -1.1]} s={1.05} />
          ) : null}
          {pohon('pohon1', [-1.8, y, -0.2])}
          {pohon('pohon2', [1.5, y, -1.2])}
          {dekorasi?.taman && [0, 1, 2, 3, 4].map((i) => <Bunga3D key={i} position={[1.4 + (i % 3) * 0.22, y, 0.3 + Math.floor(i / 3) * 0.25]} warna={['#ff8fab', '#ffd166', '#fff', '#ff6b6b', '#c8b6ff'][i]} />)}
          {dekorasi?.kolam && (
            <mesh position={[1.2, y + 0.01, 1.3]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.45, 24]} />
              <meshStandardMaterial color="#5fd3e6" roughness={0.1} />
            </mesh>
          )}
          {dekorasi?.lampu && (
            <group position={[0.9, y, -0.2]}>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
                <meshStandardMaterial color="#7a4e22" />
              </mesh>
              <mesh position={[0, 0.85, 0]}>
                <sphereGeometry args={[0.12, 12, 10]} />
                <meshStandardMaterial color="#ffe066" emissive="#ffc93c" emissiveIntensity={1.2} />
              </mesh>
            </group>
          )}
          <Bunga3D position={[-1, y, 1.4]} />
          <Bunga3D position={[-0.8, y, 1.6]} warna="#ffd166" />
          <Batu3D position={[2.1, y - 0.05, 0.9]} s={0.7} />
        </>
      )
    }
    case 1:
      return (
        <>
          <RumahJamur3D position={[-0.6, y, -0.4]} />
          <Pohon position={[0.9, y, -0.7]} s={1.1} />
          <Pohon position={[1.3, y, 0.6]} s={0.75} warna="#3fae4f" />
          <Bunga3D position={[-0.3, y, 1]} />
          <Bunga3D position={[0, y, 1.2]} warna="#ffd166" />
          <Batu3D position={[-1.4, y - 0.05, 0.6]} s={0.6} />
        </>
      )
    case 2:
      return (
        <>
          <RumahJamur3D position={[-0.4, y, -0.5]} warna="#ff9f43" s={0.95} />
          <Kelapa position={[0.9, y, -0.5]} />
          <Kelapa position={[-1.2, y, 0.5]} s={0.8} putar={2} />
          <Bunga3D position={[0.5, y, 1]} warna="#ff6b6b" />
          <Batu3D position={[1.3, y - 0.05, 0.8]} s={0.6} />
        </>
      )
    case 3:
      return (
        <>
          <Kristal3D position={[-0.7, y, 0]} s={1.2} />
          <Kristal3D position={[0.6, y, -0.6]} warna="#7fd6ff" s={1.4} />
          <Kristal3D position={[0.4, y, 0.9]} warna="#ff8fab" s={0.8} />
          <Pohon position={[1.4, y, 0.3]} s={0.75} warna="#9b7be8" />
        </>
      )
    case 4:
      return (
        <>
          <AirTerjun3D position={[0, y, -0.5]} />
          <Pohon position={[-1.3, y, 0.3]} />
          <Kelapa position={[1.3, y, 0.5]} s={0.8} />
        </>
      )
    case 5:
      return (
        <>
          <RumahJamur3D position={[-0.6, y, -0.4]} warna="#b98cff" />
          <Pohon position={[0.9, y, -0.6]} s={1.1} warna="#ff9fc7" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Bunga3D key={i} position={[-0.4 + (i % 3) * 0.35, y, 0.8 + Math.floor(i / 3) * 0.3]} warna={['#ff8fab', '#ffd166', '#fff', '#ff6b6b', '#c8b6ff', '#7fd6ff'][i]} />
          ))}
        </>
      )
    case 6:
      return (
        <>
          <RumahKubah3D position={[0, y, -0.4]} s={1.25} />
          <Kelapa position={[-2, y, 0.6]} s={0.85} />
          <Kelapa position={[2, y, 0.7]} s={0.85} putar={1.5} />
          <Bunga3D position={[-0.6, y, 1.6]} warna="#ffd166" />
          <Bunga3D position={[0.6, y, 1.6]} warna="#fff" />
        </>
      )
    default:
      return null
  }
}

/** Hanya saat pengembangan: membantu tes otomatis menemukan posisi objek di layar. */
function AlatUjiPosisi({ titik }: { titik: Record<string, [number, number, number]> }) {
  const { camera, size, gl } = useThree()
  useEffect(() => {
    ;(window as unknown as { __mjInfo?: () => unknown }).__mjInfo = () => ({ ...gl.info.render, geometri: gl.info.memory.geometries })
    ;(window as unknown as { __mjLayar?: (n: string) => [number, number] }).__mjLayar = (n: string) => {
      const v = new THREE.Vector3(...titik[n]).project(camera)
      return [((v.x + 1) / 2) * size.width, ((1 - v.y) / 2) * size.height]
    }
  }, [camera, size, titik, gl])
  return null
}

/* ====================== Suasana ====================== */
function AwanBerjalan() {
  const ref = useRef<THREE.Group>(null)
  const awan = useMemo(
    () => [
      { x: -7, y: 6.8, z: -10, s: 1.2, v: 0.25 },
      { x: 6, y: 7.2, z: -18, s: 1.4, v: 0.18 },
      { x: -2, y: 7.5, z: -26, s: 1.3, v: 0.22 },
    ],
    [],
  )
  useFrame((_, dt) => {
    ref.current?.children.forEach((c, i) => {
      c.position.x += awan[i].v * dt
      if (c.position.x > 14) c.position.x = -14
    })
  })
  return (
    <group ref={ref}>
      {awan.map((a, i) => (
        <Awan3D key={i} position={[a.x, a.y, a.z]} s={a.s} opacity={0.95} />
      ))}
    </group>
  )
}

function BurungTerbang() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current?.children.forEach((c, i) => {
      const a = t * 0.35 + i * 2.1
      c.position.set(Math.cos(a) * (3.5 + i), 4.2 + Math.sin(t + i) * 0.3, -4 + Math.sin(a) * (5 + i))
      c.rotation.y = -a
      const sayap = c.children as THREE.Object3D[]
      sayap[0].rotation.z = Math.sin(t * 10 + i) * 0.6
      sayap[1].rotation.z = -Math.sin(t * 10 + i) * 0.6
    })
  })
  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <group key={i}>
          <mesh position={[-0.12, 0, 0]}>
            <boxGeometry args={[0.24, 0.02, 0.08]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.12, 0, 0]}>
            <boxGeometry args={[0.24, 0.02, 0.08]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ====================== UI ====================== */
function TombolBulat({ ikon, label, warna, onClick, denyut, mati }: { ikon: string; label: string; warna: string; onClick: () => void; denyut?: boolean; mati?: boolean }) {
  return (
    <button onClick={onClick} aria-label={label} className={`flex flex-col items-center ${mati ? 'opacity-60' : ''}`}>
      <span className={`tombol-game ${warna} flex h-14 w-14 items-center justify-center !rounded-full text-2xl ${denyut ? 'animate-denyut' : ''}`}>{ikon}</span>
      <span className="judul-game -mt-1 text-xs" style={{ ['--g' as string]: '#1a5f8a' }}>
        {label}
      </span>
    </button>
  )
}

function TombolMenu({ onClick, label, ikon, titik }: { onClick: () => void; label: string; ikon: ReactNode; titik?: boolean }) {
  return (
    <button onClick={onClick} className="tombol-game krem relative flex flex-col items-center px-1 py-2 text-[12px] leading-tight">
      {ikon}
      <span className="relative">{label}</span>
      {titik && <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-white bg-[#ff6b6b] shadow" />}
    </button>
  )
}

/** Bila 3D gagal (mis. WebGL hilang), kembali ke peta 2D. */
class PenjagaGagal extends Component<{ onGagal: () => void; children: ReactNode }, { gagal: boolean }> {
  state = { gagal: false }
  static getDerivedStateFromError() {
    return { gagal: true }
  }
  componentDidCatch() {
    this.props.onGagal()
  }
  render() {
    return this.state.gagal ? null : this.props.children
  }
}

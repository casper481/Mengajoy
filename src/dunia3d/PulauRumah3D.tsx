/**
 * Pulau Rumahku dalam 3D: dekorasi anak, karakter, dan Momo yang bisa diajak bermain.
 * Dipakai oleh halaman Rumahku bila tampilan 3D aktif (dimuat terpisah / lazy).
 */
import { Html, OrbitControls, Sparkles } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { SLOT_RUMAH, type DataAvatar } from '../data/dunia'
import { boing, cicit } from '../lib/efekSuara'
import { Avatar3D, Momo3D } from './Karakter3D'
import { Dekorasi3D } from './Dekorasi3D'
import { Laut3D, Ledakan3D, type JenisPartikel } from './Efek3D'
import { Awan3D, BadanPulau, Batu3D, Bunga3D, TEMA3D } from './Objek3D'
import Panggung3D from './Panggung3D'

const ATAS = 0.66
const R = 3.4
type V3 = [number, number, number]
/** Ubah koordinat tempat dekorasi (SVG 2D) ke koordinat pulau 3D. */
const keDunia = (x: number, y: number): V3 => [(x - 200) / 62, ATAS, (y - 265) / 48]

export type AksiMomo = { elus: number; makan: number; main: number }

type Props = {
  slot: Record<string, string>
  level: number
  avatar: DataAvatar
  tahap: number
  aksi: AksiMomo
  kualitas: 'tinggi' | 'sedang'
  onSlot: (id: string) => void
  onMomo: () => void
  onGagal: () => void
}

export default function PulauRumah3D(props: Props) {
  return (
    <Panggung3D kamera={{ posisi: [0, 7.2, 8.6], fov: 36, lihat: [0, 0.6, 0.2] }} kualitas={props.kualitas} onGagal={props.onGagal} bayanganLuas={6}>
      <Isi {...props} />
    </Panggung3D>
  )
}

type Ledakan = { id: number; posisi: V3; jenis: JenisPartikel; jumlah: number }

function Isi({ slot, level, avatar, tahap, aksi, onSlot, onMomo }: Props) {
  const [lompatAvatar, setLompatAvatar] = useState(0)
  const [lompatMomo, setLompatMomo] = useState(0)
  const [kunyah, setKunyah] = useState(0)
  const [target, setTarget] = useState<V3 | null>(null)
  const [apel, setApel] = useState<number | null>(null)
  const [bola, setBola] = useState<{ dari: V3; ke: V3; mulai: number; pulang: boolean } | null>(null)
  const [ledakan, setLedakan] = useState<Ledakan[]>([])
  const idRef = useRef(1)
  const pusat: V3 = [0.1, ATAS, 0.3]

  const ledak = (posisi: V3, jenis: JenisPartikel, jumlah = 12) => {
    const id = idRef.current++
    setLedakan((l) => [...l, { id, posisi, jenis, jumlah }])
  }

  // --- elus ---
  const awalElus = useRef(aksi.elus)
  useEffect(() => {
    if (aksi.elus === awalElus.current) return
    setLompatMomo((n) => n + 1)
    ledak([pusat[0] + 0.9, ATAS + 1.1, pusat[2] + 0.4], 'hati', 14)
  }, [aksi.elus]) // eslint-disable-line react-hooks/exhaustive-deps

  // --- makan: apel muncul di depan Momo lalu dikunyah ---
  const awalMakan = useRef(aksi.makan)
  useEffect(() => {
    if (aksi.makan === awalMakan.current) return
    setTarget([pusat[0] + 0.9, ATAS, pusat[2] + 0.8])
    setApel(performance.now())
    const t1 = setTimeout(() => setKunyah((n) => n + 1), 700)
    const t2 = setTimeout(() => {
      setApel(null)
      setTarget(null)
      ledak([pusat[0] + 0.9, ATAS + 1, pusat[2] + 0.8], 'hati', 12)
    }, 2100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [aksi.makan]) // eslint-disable-line react-hooks/exhaustive-deps

  // --- main bola: bola dilempar, Momo mengejar, lalu bola kembali ---
  const awalMain = useRef(aksi.main)
  useEffect(() => {
    if (aksi.main === awalMain.current) return
    const sudut = Math.random() * Math.PI * 2
    const ke: V3 = [Math.cos(sudut) * 1.8, ATAS, Math.sin(sudut) * 1.2 + 0.3]
    const dari: V3 = [pusat[0] + 0.3, ATAS + 0.9, pusat[2]]
    setLompatAvatar((n) => n + 1)
    setBola({ dari, ke, mulai: performance.now(), pulang: false })
    const t1 = setTimeout(() => setTarget(ke), 500)
    const t2 = setTimeout(() => {
      boing()
      setLompatMomo((n) => n + 1)
      setBola({ dari: ke, ke: dari, mulai: performance.now(), pulang: true })
      setTarget(null)
      ledak([ke[0], ATAS + 0.8, ke[2]], 'bintang', 10)
    }, 2300)
    const t3 = setTimeout(() => setBola(null), 3300)
    return () => [t1, t2, t3].forEach(clearTimeout)
  }, [aksi.main]) // eslint-disable-line react-hooks/exhaustive-deps

  const tema = TEMA3D[0]
  return (
    <>
      <fog attach="fog" args={['#bfeaff', 14, 30]} />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.75} maxPolarAngle={0.95} minAzimuthAngle={-0.6} maxAzimuthAngle={0.6} target={[0, 0.6, 0.2]} rotateSpeed={0.5} />
      <Laut3D pulau={[{ x: 0, z: 0, r: R }]} />
      <BadanPulau r={R} tema={tema} />

      {/* dekorasi */}
      {SLOT_RUMAH.map((s) => {
        const id = slot[s.id]
        const pos = keDunia(s.x, s.y)
        const terkunci = level < s.level
        return (
          <group key={s.id}>
            {id && <Dekorasi3D id={id} position={pos} />}
            <Html position={[pos[0], pos[1] + (id ? 0.15 : 0.35), pos[2]]} center zIndexRange={[20, 0]}>
              <button
                onClick={() => onSlot(s.id)}
                aria-label={`Tempat ${s.label}`}
                className={`flex items-center justify-center whitespace-nowrap rounded-full border-[3px] border-white text-xs font-extrabold shadow-[0_3px_0_rgba(0,0,0,0.25)] ${
                  terkunci ? 'bg-[#8a94a6]/90 px-2 py-0.5 text-white' : id ? 'h-7 w-7 bg-white/75 text-[#6b4e24]' : 'h-9 w-9 animate-denyut bg-[#ffb347] text-xl text-white'
                }`}
              >
                {terkunci ? `🔒 Lv ${s.level}` : id ? '✏️' : '+'}
              </button>
            </Html>
          </group>
        )
      })}

      <Bunga3D position={[-0.6, ATAS, 2.4]} />
      <Bunga3D position={[-0.35, ATAS, 2.6]} warna="#ffd166" />
      <Bunga3D position={[1.2, ATAS, 2.3]} warna="#fff" />
      <Batu3D position={[3, ATAS - 0.05, 0.6]} s={0.8} />
      <Awan3D position={[-4.5, 3.6, -3]} s={1.1} opacity={0.95} />
      <Awan3D position={[4.5, 4, -4]} s={1.3} opacity={0.95} />
      {level >= 5 && <Sparkles count={30} scale={[6, 3, 4]} size={4} speed={0.3} position={[0, 2, 0]} color="#fff3b0" />}

      {/* karakter */}
      <Avatar3D
        a={avatar}
        position={pusat}
        lompat={lompatAvatar}
        onTap={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          boing()
          setLompatAvatar((n) => n + 1)
          ledak([pusat[0], ATAS + 1.8, pusat[2]], 'hati', 10)
        }}
      />
      <Momo3D
        tahap={tahap}
        pusat={pusat}
        lompat={lompatMomo}
        menetas={0}
        target={target}
        kunyah={kunyah}
        onTap={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          cicit()
          setLompatMomo((n) => n + 1)
          onMomo()
        }}
      />
      {apel !== null && <Apel posisi={[pusat[0] + 0.9, ATAS + 0.25, pusat[2] + 1.15]} mulai={apel} />}
      {bola && <Bola {...bola} />}

      {ledakan.map((l) => (
        <Ledakan3D key={l.id} posisi={l.posisi} jenis={l.jenis} jumlah={l.jumlah} onSelesai={() => setLedakan((x) => x.filter((y) => y.id !== l.id))} />
      ))}
    </>
  )
}

function Apel({ posisi, mulai }: { posisi: V3; mulai: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ref.current) return
    const t = (performance.now() - mulai) / 1000
    const muncul = Math.min(1, t * 4)
    const habis = t > 0.8 ? Math.max(0, 1 - (t - 0.8) / 1.1) : 1
    ref.current.scale.setScalar(muncul * habis)
    ref.current.position.y = posisi[1] + (t < 0.25 ? (0.25 - t) * 2 : 0)
  })
  return (
    <group ref={ref} position={posisi}>
      <mesh castShadow>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color="#ef4f5f" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.07, 5]} />
        <meshStandardMaterial color="#7a4e22" />
      </mesh>
      <mesh position={[0.05, 0.15, 0]} rotation={[0, 0, -0.8]} scale={[1, 0.4, 0.6]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="#5cc96b" />
      </mesh>
    </group>
  )
}

function Bola({ dari, ke, mulai }: { dari: V3; ke: V3; mulai: number; pulang: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const a = useMemo(() => new THREE.Vector3(...dari), [dari])
  const b = useMemo(() => new THREE.Vector3(...ke), [ke])
  useFrame(() => {
    if (!ref.current) return
    const t = Math.min(1, (performance.now() - mulai) / 900)
    ref.current.position.lerpVectors(a, b, t)
    ref.current.position.y = THREE.MathUtils.lerp(a.y, b.y, t) + Math.sin(t * Math.PI) * 1.2 + 0.12
    ref.current.rotation.x += 0.2
  })
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.13, 16, 12]} />
      <meshStandardMaterial color="#4cb8e8" roughness={0.4} />
    </mesh>
  )
}

/** Panggung perayaan selesai stage (3D): karakter, Momo & Nuri bersorak, peti hadiah terbuka. */
import { Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { DataAvatar } from '../data/dunia'
import { bukaPeti } from '../lib/efekSuara'
import { Avatar3D, Momo3D, Nuri3D } from './Karakter3D'
import { Ledakan3D, type JenisPartikel } from './Efek3D'
import { BadanPulau, Bunga3D, Peti3D, TEMA3D } from './Objek3D'
import Panggung3D from './Panggung3D'

const ATAS = 0.66
type V3 = [number, number, number]

type Props = { avatar: DataAvatar; tahap: number; adaHadiah: boolean; bintang: number; nuriDipakai: Partial<Record<string, string>>; kualitas: 'tinggi' | 'sedang'; onGagal: () => void }

export default function Perayaan3D(props: Props) {
  return (
    <Panggung3D kamera={{ posisi: [0, 3.1, 6.2], fov: 34, lihat: [0, 1.1, 0] }} kualitas={props.kualitas} onGagal={props.onGagal} bayanganLuas={4}>
      <Isi {...props} />
    </Panggung3D>
  )
}

type L = { id: number; posisi: V3; jenis: JenisPartikel; jumlah: number }

function Isi({ avatar, tahap, adaHadiah, bintang, nuriDipakai }: Props) {
  const [lompat, setLompat] = useState(0)
  const [petiBuka, setPetiBuka] = useState(false)
  const [ledakan, setLedakan] = useState<L[]>([])
  const id = useRef(1)
  const ledak = (posisi: V3, jenis: JenisPartikel, jumlah: number) => setLedakan((l) => [...l, { id: id.current++, posisi, jenis, jumlah }])

  useEffect(() => {
    const t: number[] = []
    // lompat gembira berulang
    for (let i = 0; i < 4; i++) t.push(window.setTimeout(() => setLompat((n) => n + 1), 300 + i * 900))
    t.push(window.setTimeout(() => ledak([0, ATAS + 2.2, 0], 'bintang', 10 + bintang * 8), 250))
    if (adaHadiah) {
      t.push(window.setTimeout(() => {
        setPetiBuka(true)
        bukaPeti()
        ledak([-1.25, ATAS + 0.7, 0.55], 'koin', 22)
      }, 1500))
    }
    return () => t.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PanggungBerputar>
        <BadanPulau r={2.1} tema={TEMA3D[0]} />
        <Bunga3D position={[1.3, ATAS, 0.9]} />
        <Bunga3D position={[1.5, ATAS, 0.6]} warna="#ffd166" />
        <Bunga3D position={[-0.4, ATAS, 1.4]} warna="#fff" />
      </PanggungBerputar>
      <Avatar3D a={avatar} position={[0, ATAS, 0.1]} lompat={lompat} />
      <Momo3D tahap={tahap} pusat={[1.0, ATAS, 0.35]} lompat={0} menetas={0} diam sorak />
      <Nuri3D position={[-0.9, ATAS + 1.9, 0.2]} putar={lompat} dipakai={nuriDipakai} />
      {adaHadiah && <Peti3D terbuka={petiBuka} position={[-1.25, ATAS, 0.55]} />}
      <Sparkles count={36} scale={[4, 3, 2]} size={5} speed={0.5} position={[0, ATAS + 1.6, 0]} color="#fff3b0" />
      {ledakan.map((l) => (
        <Ledakan3D key={l.id} posisi={l.posisi} jenis={l.jenis} jumlah={l.jumlah} onSelesai={() => setLedakan((x) => x.filter((y) => y.id !== l.id))} />
      ))}
    </>
  )
}

function PanggungBerputar({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.25
  })
  return <group ref={ref}>{children}</group>
}

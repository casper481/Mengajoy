/** Dekorasi Pulau Rumahku dalam 3D (padanan dari Dekorasi.tsx 2D). */
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Bunga3D, Kelapa, Pohon, RumahJamur3D, RumahKayu3D, RumahKubah3D } from './Objek3D'

type V3 = [number, number, number]

export function Dekorasi3D({ id, position }: { id: string; position: V3 }) {
  switch (id) {
    case 'rumah-kayu':
      return <RumahKayu3D position={position} s={1.15} />
    case 'rumah-jamur':
      return <RumahJamur3D position={position} s={1.2} />
    case 'rumah-kubah':
      return <RumahKubah3D position={position} s={0.85} bersinar={false} />
    case 'pohon-bulat':
      return <Pohon position={position} s={1.15} />
    case 'pohon-kelapa':
      return <Kelapa position={position} s={1} />
    case 'pohon-sakura':
      return <Pohon position={position} s={1.15} warna="#ff9fc7" />
    case 'pohon-jeruk':
      return <PohonJeruk position={position} />
    case 'bunga-warna':
      return (
        <group position={position}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Bunga3D key={i} position={[(i % 3) * 0.26 - 0.26, 0, Math.floor(i / 3) * 0.26 - 0.13]} warna={['#ff8fab', '#ffd166', '#fff', '#ff6b6b', '#c8b6ff', '#7fd6ff'][i]} />
          ))}
        </group>
      )
    case 'bunga-pelangi':
      return (
        <group position={position}>
          {['#ff6b6b', '#ffd166', '#5cc96b', '#4cb8e8'].map((w, i) => (
            <mesh key={w} position={[0, 0.02, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.55 - i * 0.09, 0.04, 8, 32, Math.PI]} />
              <meshStandardMaterial color={w} roughness={0.5} />
            </mesh>
          ))}
          <Bunga3D position={[-0.55, 0, 0.15]} />
          <Bunga3D position={[0.55, 0, 0.15]} warna="#ffd166" />
        </group>
      )
    case 'kolam-ikan':
      return <Kolam position={position} />
    case 'air-mancur':
      return <AirMancur position={position} />
    case 'ayunan':
      return <Ayunan position={position} />
    case 'perosotan':
      return (
        <group position={position}>
          {[-0.18, 0.18].map((x) => (
            <mesh key={x} position={[x, 0.45, -0.35]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.9, 6]} />
              <meshStandardMaterial color="#4cb8e8" />
            </mesh>
          ))}
          {[0.15, 0.4, 0.65].map((y) => (
            <mesh key={y} position={[0, y, -0.35]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.36, 6]} />
              <meshStandardMaterial color="#4cb8e8" />
            </mesh>
          ))}
          <mesh position={[0, 0.48, 0.05]} rotation={[0.85, 0, 0]} castShadow>
            <boxGeometry args={[0.36, 0.04, 1.05]} />
            <meshStandardMaterial color="#ffd166" roughness={0.4} />
          </mesh>
        </group>
      )
    case 'lentera':
      return <Lampu position={position} warna="#ffc93c" />
    case 'lampu-bintang':
      return <Lampu position={position} warna="#ffe066" bintang />
    default:
      return null
  }
}

function PohonJeruk({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <Pohon position={[0, 0, 0]} s={1.15} warna="#3fae4f" />
      {(
        [
          [0.3, 1.0, 0.25],
          [-0.3, 0.95, 0.2],
          [0.1, 1.35, 0.3],
          [-0.15, 1.15, -0.32],
          [0.35, 0.85, -0.2],
        ] as const
      ).map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshStandardMaterial color="#ff9f43" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Kolam({ position }: { position: V3 }) {
  const ikan = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ikan.current) ikan.current.rotation.y = clock.elapsedTime * 0.8
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.65, 0.08, 28]} />
        <meshStandardMaterial color="#b9b2a5" roughness={1} />
      </mesh>
      <mesh position={[0, 0.085, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 28]} />
        <meshStandardMaterial color="#5fd3e6" roughness={0.1} metalness={0.1} />
      </mesh>
      <group ref={ikan} position={[0, 0.1, 0]}>
        {[0, Math.PI].map((a, i) => (
          <mesh key={a} position={[Math.cos(a) * 0.25, 0, Math.sin(a) * 0.25]} rotation={[0, a, 0]} scale={[1, 0.5, 0.45]}>
            <sphereGeometry args={[0.09, 10, 8]} />
            <meshStandardMaterial color={i ? '#ff6b6b' : '#ff9f43'} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function AirMancur({ position }: { position: V3 }) {
  const air = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (air.current) air.current.scale.y = 1 + Math.sin(clock.elapsedTime * 6) * 0.12
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.65, 0.16, 28]} />
        <meshStandardMaterial color="#e9e1d2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52, 28]} />
        <meshStandardMaterial color="#5fd3e6" roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 12]} />
        <meshStandardMaterial color="#e9e1d2" />
      </mesh>
      <mesh position={[0, 0.76, 0]}>
        <cylinderGeometry args={[0.26, 0.18, 0.08, 20]} />
        <meshStandardMaterial color="#e9e1d2" />
      </mesh>
      <mesh ref={air} position={[0, 0.98, 0]}>
        <coneGeometry args={[0.16, 0.42, 14, 1, true]} />
        <meshStandardMaterial color="#9fe7ff" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Ayunan({ position }: { position: V3 }) {
  const kursi = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (kursi.current) kursi.current.rotation.x = Math.sin(clock.elapsedTime * 2) * 0.35
  })
  return (
    <group position={position}>
      {[-0.5, 0.5].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.55, 0.22]} rotation={[0.35, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.15, 6]} />
            <meshStandardMaterial color="#b5834b" />
          </mesh>
          <mesh position={[0, 0.55, -0.22]} rotation={[-0.35, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.15, 6]} />
            <meshStandardMaterial color="#b5834b" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.08, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.1, 8]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
      <group ref={kursi} position={[0, 1.06, 0]}>
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, -0.36, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.72, 4]} />
            <meshStandardMaterial color="#7a4e22" />
          </mesh>
        ))}
        <mesh position={[0, -0.72, 0]} castShadow>
          <boxGeometry args={[0.36, 0.04, 0.18]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      </group>
    </group>
  )
}

function Lampu({ position, warna, bintang = false }: { position: V3; warna: string; bintang?: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.9, 6]} />
        <meshStandardMaterial color={bintang ? '#5d6b80' : '#7a4e22'} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        {bintang ? <octahedronGeometry args={[0.16, 0]} /> : <sphereGeometry args={[0.13, 14, 10]} />}
        <meshStandardMaterial color={warna} emissive={warna} emissiveIntensity={1.3} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.32, 14, 10]} />
        <meshBasicMaterial color={warna} transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  )
}

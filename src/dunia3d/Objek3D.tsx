/**
 * Objek-objek 3D dunia Mengajoy, dibentuk dari geometri sederhana yang dibulatkan
 * (tanpa file model eksternal, jadi ringan dan bebas hak cipta).
 */
import { RoundedBox } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export type TemaPulau = { rumput: string; rumputTua: string; pasir: string; tebing: string; tebingTua: string }

export const TEMA3D: Record<number, TemaPulau> = {
  0: { rumput: '#86dc6c', rumputTua: '#5fbf4f', pasir: '#ffe2a0', tebing: '#c98d55', tebingTua: '#8f5d33' }, // Rumahku
  1: { rumput: '#7fd86a', rumputTua: '#56b84f', pasir: '#ffe3a3', tebing: '#c98d55', tebingTua: '#8f5d33' },
  2: { rumput: '#b4e36a', rumputTua: '#8ac84a', pasir: '#ffd88a', tebing: '#d39a5a', tebingTua: '#9a6a35' },
  3: { rumput: '#b9a8f5', rumputTua: '#9583e0', pasir: '#f3e6ff', tebing: '#8f78c9', tebingTua: '#5f4a9a' },
  4: { rumput: '#72d9a8', rumputTua: '#4cbc88', pasir: '#d9f4ff', tebing: '#9c8a73', tebingTua: '#6b5c48' },
  5: { rumput: '#a6e57e', rumputTua: '#78c656', pasir: '#ffe0ec', tebing: '#c98d9a', tebingTua: '#8f5a66' },
  6: { rumput: '#ffe48f', rumputTua: '#f2c650', pasir: '#fff6d6', tebing: '#d9a63c', tebingTua: '#9a6f1c' },
}

/** Badan pulau: tebing membulat + pantai + tutup rumput yang "meleleh" di tepinya. */
export function BadanPulau({ r, tema, abu = false }: { r: number; tema: TemaPulau; abu?: boolean }) {
  const { tebing, rumput, pasir } = useMemo(() => {
    const t = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, -1.6),
        new THREE.Vector2(r * 0.45, -1.55),
        new THREE.Vector2(r * 0.8, -0.9),
        new THREE.Vector2(r * 0.97, -0.15),
        new THREE.Vector2(r, 0.22),
        new THREE.Vector2(r * 0.96, 0.44),
        new THREE.Vector2(0, 0.44),
      ],
      40,
    )
    // urutan titik dari bawah ke atas agar sisi depan menghadap keluar/atas
    const g = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, 0.4),
        new THREE.Vector2(r * 0.88, 0.4),
        new THREE.Vector2(r * 0.95, 0.42),
        new THREE.Vector2(r * 0.97, 0.52),
        new THREE.Vector2(r * 0.93, 0.62),
        new THREE.Vector2(r * 0.84, 0.66),
        new THREE.Vector2(0, 0.66),
      ],
      40,
    )
    const p = new THREE.LatheGeometry(
      [new THREE.Vector2(r * 0.9, 0.02), new THREE.Vector2(r * 1.16, 0.0), new THREE.Vector2(r * 1.12, 0.1), new THREE.Vector2(r * 0.98, 0.22), new THREE.Vector2(r * 0.9, 0.2)],
      40,
    )
    t.computeVertexNormals()
    g.computeVertexNormals()
    p.computeVertexNormals()
    return { tebing: t, rumput: g, pasir: p }
  }, [r])
  const c = (x: string) => (abu ? new THREE.Color(x).lerp(new THREE.Color('#b8c0cc'), 0.55) : new THREE.Color(x))
  return (
    <group>
      <mesh geometry={tebing} receiveShadow>
        <meshStandardMaterial color={c(tema.tebing)} roughness={0.95} />
      </mesh>
      <mesh geometry={pasir} receiveShadow>
        <meshStandardMaterial color={c(tema.pasir)} roughness={1} />
      </mesh>
      <mesh geometry={rumput} receiveShadow castShadow>
        <meshStandardMaterial color={c(tema.rumput)} roughness={0.85} />
      </mesh>
    </group>
  )
}

export function Pohon({ position, s = 1, warna = '#4fbf5a' }: { position: [number, number, number]; s?: number; warna?: string }) {
  const ref = useRef<THREE.Group>(null)
  const fase = useMemo(() => Math.random() * 10, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.3 + fase) * 0.03
  })
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.7, 8]} />
        <meshStandardMaterial color="#9a6a3a" roughness={1} />
      </mesh>
      <group ref={ref}>
        {(
          [
            [0, 0.95, 0, 0.45],
            [-0.26, 0.78, 0.1, 0.32],
            [0.26, 0.8, -0.05, 0.34],
            [0.05, 1.25, 0, 0.3],
          ] as const
        ).map(([x, y, z, rr], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <icosahedronGeometry args={[rr, 2]} />
            <meshStandardMaterial color={warna} roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function Kelapa({ position, s = 1, putar = 0 }: { position: [number, number, number]; s?: number; putar?: number }) {
  const ref = useRef<THREE.Group>(null)
  const fase = useMemo(() => Math.random() * 10, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.8 + fase) * 0.08
  })
  const daun = [0, 1, 2, 3, 4, 5]
  return (
    <group position={position} scale={s} rotation={[0, putar, 0]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[i * 0.05, 0.2 + i * 0.32, 0]} rotation={[0, 0, -0.08 * i]} castShadow>
          <cylinderGeometry args={[0.08 - i * 0.008, 0.1 - i * 0.008, 0.34, 8]} />
          <meshStandardMaterial color={i % 2 ? '#b5834b' : '#a07040'} roughness={1} />
        </mesh>
      ))}
      <group ref={ref} position={[0.2, 1.42, 0]}>
        {daun.map((i) => (
          <mesh key={i} rotation={[0, (i / daun.length) * Math.PI * 2, -0.55]} position={[0, 0, 0]} castShadow>
            <coneGeometry args={[0.18, 1.1, 4, 1]} />
            <meshStandardMaterial color={i % 2 ? '#3fae4f' : '#5ccc66'} roughness={0.8} />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => (
          <mesh key={`k${i}`} position={[Math.cos(i * 2.1) * 0.1, -0.08, Math.sin(i * 2.1) * 0.1]}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color="#7a4e22" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function RumahJamur3D({ position, warna = '#ef4f5f', s = 1 }: { position: [number, number, number]; warna?: string; s?: number }) {
  const titik = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2
        const tinggi = 0.25 + (i % 3) * 0.12
        return [Math.cos(a) * 0.55, 0.95 + tinggi * 0.5, Math.sin(a) * 0.55, 0.07 + (i % 2) * 0.03] as const
      }),
    [],
  )
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.44, 0.76, 20]} />
        <meshStandardMaterial color="#fff4dc" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.2, 0.42]}>
        <boxGeometry args={[0.22, 0.38, 0.04]} />
        <meshStandardMaterial color="#9a6a3a" />
      </mesh>
      <mesh position={[0.26, 0.46, 0.33]} rotation={[0, 0.6, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#9fe0ff" emissive="#9fe0ff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.78, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={warna} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.78, 28]} />
        <meshStandardMaterial color={new THREE.Color(warna).multiplyScalar(0.75)} side={THREE.DoubleSide} />
      </mesh>
      {titik.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 10, 10]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

export function RumahKayu3D({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <group position={position} scale={s}>
      <RoundedBox args={[1.1, 0.8, 0.9]} radius={0.08} position={[0, 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8b778" roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 1.08, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.95, 0.6, 4]} />
        <meshStandardMaterial color="#ef6f5f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.25, 0.46]}>
        <boxGeometry args={[0.26, 0.44, 0.03]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
      {[-0.33, 0.33].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.46]}>
          <boxGeometry args={[0.2, 0.2, 0.03]} />
          <meshStandardMaterial color="#bfe9ff" emissive="#ffe9a8" emissiveIntensity={0.35} />
        </mesh>
      ))}
      <mesh position={[0.3, 1.25, -0.15]} castShadow>
        <boxGeometry args={[0.14, 0.3, 0.14]} />
        <meshStandardMaterial color="#a33b2e" />
      </mesh>
    </group>
  )
}

export function RumahKubah3D({ position, s = 1, bersinar = true }: { position: [number, number, number]; s?: number; bersinar?: boolean }) {
  const emas = { color: '#ffc93c', metalness: 0.35, roughness: 0.35, emissive: '#b37400', emissiveIntensity: bersinar ? 0.25 : 0 }
  return (
    <group position={position} scale={s}>
      <RoundedBox args={[1.5, 0.9, 1.3]} radius={0.06} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#fff7e0" roughness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.35, 0.66]}>
        <boxGeometry args={[0.36, 0.6, 0.03]} />
        <meshStandardMaterial color="#2fa6a0" />
      </mesh>
      <mesh position={[0, 0.65, 0.661]}>
        <circleGeometry args={[0.18, 20, 0, Math.PI]} />
        <meshStandardMaterial color="#2fa6a0" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.62, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...emas} />
      </mesh>
      <mesh position={[0, 1.62, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.24, 8]} />
        <meshStandardMaterial {...emas} />
      </mesh>
      <mesh position={[0.04, 1.82, 0]}>
        <torusGeometry args={[0.1, 0.03, 8, 20, Math.PI * 1.4]} />
        <meshStandardMaterial {...emas} />
      </mesh>
      {[-0.95, 0.95].map((x) => (
        <group key={x} position={[x, 0, -0.35]}>
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.14, 1.7, 14]} />
            <meshStandardMaterial color="#fff7e0" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.85, 0]}>
            <coneGeometry args={[0.16, 0.36, 14]} />
            <meshStandardMaterial {...emas} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export function Kristal3D({ position, warna = '#b58bff', s = 1 }: { position: [number, number, number]; warna?: string; s?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5 + position[0]) * 0.04
  })
  return (
    <group ref={ref} position={position} scale={s}>
      {(
        [
          [0, 0.45, 0, 0.32, 1.3, 0],
          [-0.28, 0.28, 0.1, 0.2, 0.8, -0.35],
          [0.26, 0.25, -0.05, 0.18, 0.7, 0.4],
        ] as const
      ).map(([x, y, z, r, h, rz], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, i, rz]} scale={[1, h, 1]} castShadow>
          <octahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color={warna} emissive={warna} emissiveIntensity={0.35} roughness={0.15} metalness={0.1} transparent opacity={0.92} />
        </mesh>
      ))}
    </group>
  )
}

export function AirTerjun3D({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uWaktu.value = clock.elapsedTime
  })
  const shader = useMemo(
    () => ({
      uniforms: { uWaktu: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform float uWaktu; varying vec2 vUv;
        void main(){
          float garis = step(0.8, fract(vUv.y * 6.0 + uWaktu * 1.6 + sin(vUv.x * 18.0) * 0.08));
          vec3 warna = mix(vec3(0.45,0.82,0.98), vec3(1.0), garis * 0.7);
          gl_FragColor = vec4(warna, 0.92);
        }`,
    }),
    [],
  )
  return (
    <group position={position} scale={s}>
      <RoundedBox args={[1.2, 1.6, 0.8]} radius={0.2} position={[0, 0.8, -0.2]} castShadow receiveShadow>
        <meshStandardMaterial color="#9c8a73" roughness={1} />
      </RoundedBox>
      <mesh position={[0, 1.62, -0.2]}>
        <boxGeometry args={[1.25, 0.12, 0.85]} />
        <meshStandardMaterial color="#5cc96b" />
      </mesh>
      <mesh position={[0, 0.8, 0.22]}>
        <planeGeometry args={[0.5, 1.6]} />
        <shaderMaterial ref={mat} args={[shader]} transparent />
      </mesh>
      <mesh position={[0, 0.06, 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 24]} />
        <meshStandardMaterial color="#e9fbff" transparent opacity={0.85} />
      </mesh>
    </group>
  )
}

export function Bunga3D({ position, warna = '#ff8fab' }: { position: [number, number, number]; warna?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.2, 5]} />
        <meshStandardMaterial color="#3fae4f" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.06, 0.22, Math.sin((i / 5) * Math.PI * 2) * 0.06]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color={warna} />
        </mesh>
      ))}
      <mesh position={[0, 0.23, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
    </group>
  )
}

export function Batu3D({ position, s = 1 }: { position: [number, number, number]; s?: number }) {
  return (
    <mesh position={position} scale={[s, s * 0.6, s]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.35, 1]} />
      <meshStandardMaterial color="#b9b2a5" roughness={1} />
    </mesh>
  )
}

/** Peti harta dengan tutup yang bisa membuka. */
export function Peti3D({ terbuka, position, onClick }: { terbuka: boolean; position: [number, number, number]; onClick?: (e: ThreeEvent<MouseEvent>) => void }) {
  const tutup = useRef<THREE.Group>(null)
  const badan = useRef<THREE.Group>(null)
  useFrame(({ clock }, dt) => {
    if (tutup.current) {
      const target = terbuka ? -1.9 : 0
      tutup.current.rotation.x += (target - tutup.current.rotation.x) * Math.min(1, dt * 8)
    }
    if (badan.current && !terbuka) {
      // goyang kecil mengundang untuk diketuk
      badan.current.rotation.z = Math.sin(clock.elapsedTime * 6) * 0.04 * (Math.sin(clock.elapsedTime * 0.9) > 0.6 ? 1 : 0)
    }
  })
  const kayu = { color: '#b0703a', roughness: 0.8 }
  const emas = { color: '#ffc93c', metalness: 0.5, roughness: 0.3 }
  return (
    <group position={position} onClick={onClick}>
      <group ref={badan}>
        <RoundedBox args={[0.8, 0.45, 0.55]} radius={0.06} position={[0, 0.23, 0]} castShadow>
          <meshStandardMaterial {...kayu} />
        </RoundedBox>
        {[-0.28, 0.28].map((x) => (
          <mesh key={x} position={[x, 0.23, 0]}>
            <boxGeometry args={[0.08, 0.47, 0.57]} />
            <meshStandardMaterial {...emas} />
          </mesh>
        ))}
        <mesh position={[0, 0.3, 0.29]}>
          <boxGeometry args={[0.14, 0.16, 0.03]} />
          <meshStandardMaterial {...emas} />
        </mesh>
        <group ref={tutup} position={[0, 0.45, -0.27]}>
          <mesh position={[0, 0, 0.27]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.27, 0.27, 0.8, 20, 1, false, 0, Math.PI]} />
            <meshStandardMaterial {...kayu} side={THREE.DoubleSide} />
          </mesh>
          {[-0.28, 0.28].map((x) => (
            <mesh key={x} position={[x, 0, 0.27]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.285, 0.285, 0.08, 20, 1, false, 0, Math.PI]} />
              <meshStandardMaterial {...emas} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
        {terbuka && (
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[0.66, 0.06, 0.4]} />
            <meshStandardMaterial color="#ffd23f" emissive="#ffb300" emissiveIntensity={0.8} />
          </mesh>
        )}
      </group>
    </group>
  )
}

/** Gembok emas melayang di atas pulau terkunci. */
export function Gembok3D({ position, goyang }: { position: [number, number, number]; goyang: number }) {
  const ref = useRef<THREE.Group>(null)
  const awal = useRef(0)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 1.6 + position[0]) * 0.12
    ref.current.rotation.y = Math.sin(t * 0.7) * 0.4
    if (goyang !== awal.current) {
      awal.current = goyang
      ref.current.userData.goyangMulai = t
    }
    const g = t - (ref.current.userData.goyangMulai ?? -10)
    ref.current.rotation.z = g < 0.6 ? Math.sin(g * 40) * 0.25 * (1 - g / 0.6) : 0
  })
  const emas = { color: '#ffc93c', metalness: 0.55, roughness: 0.28, emissive: '#8a5a00', emissiveIntensity: 0.15 }
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.42, 0]}>
        <torusGeometry args={[0.24, 0.07, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#d9dde3" metalness={0.7} roughness={0.25} />
      </mesh>
      <RoundedBox args={[0.7, 0.58, 0.32]} radius={0.12} position={[0, 0.12, 0]} castShadow>
        <meshStandardMaterial {...emas} />
      </RoundedBox>
      <mesh position={[0, 0.16, 0.165]}>
        <circleGeometry args={[0.07, 16]} />
        <meshStandardMaterial color="#6b4500" />
      </mesh>
      <mesh position={[0, 0.06, 0.165]}>
        <planeGeometry args={[0.05, 0.12]} />
        <meshStandardMaterial color="#6b4500" />
      </mesh>
    </group>
  )
}

/** Awan empuk dari kumpulan bola. */
export function Awan3D({ position, s = 1, opacity = 1 }: { position: [number, number, number]; s?: number; opacity?: number }) {
  const bola = useMemo(
    () => [
      [0, 0, 0, 0.7],
      [0.7, -0.1, 0.1, 0.55],
      [-0.7, -0.12, 0, 0.5],
      [0.25, 0.35, -0.1, 0.5],
      [-0.3, 0.25, 0.15, 0.45],
    ] as const,
    [],
  )
  return (
    <group position={position} scale={s}>
      {bola.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 16, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={1} transparent={opacity < 1} opacity={opacity} />
        </mesh>
      ))}
    </group>
  )
}

export function Perahu3D({ position, putar = 0 }: { position: [number, number, number]; putar?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime + position[0]
    ref.current.position.y = position[1] + Math.sin(t * 1.4) * 0.06
    ref.current.rotation.z = Math.sin(t * 1.1) * 0.06
  })
  return (
    <group ref={ref} position={position} rotation={[0, putar, 0]}>
      <mesh scale={[1, 0.45, 0.45]} castShadow>
        <sphereGeometry args={[0.6, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#b5834b" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1, 6]} />
        <meshStandardMaterial color="#7a4e22" />
      </mesh>
      <mesh position={[0.18, 0.55, 0]}>
        <coneGeometry args={[0.3, 0.75, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

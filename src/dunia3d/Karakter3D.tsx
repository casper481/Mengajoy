/** Karakter 3D: avatar anak, Momo (hewan pendamping), dan Nuri (pemandu). */
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { AVATAR, type DataAvatar } from '../data/dunia'

const mat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => <meshStandardMaterial color={color} roughness={0.7} {...extra} />

/* ======================= AVATAR ANAK ======================= */
export function Avatar3D({ a, position, onTap, lompat }: { a: DataAvatar; position: [number, number, number]; onTap?: (e: ThreeEvent<MouseEvent>) => void; lompat: number }) {
  const akar = useRef<THREE.Group>(null)
  const tanganKanan = useRef<THREE.Group>(null)
  const mata = useRef<THREE.Group>(null)
  const mulai = useRef({ id: 0, t: -10 })
  const kulit = AVATAR.kulit[a.kulit]
  const rambut = AVATAR.warnaRambut[a.warnaRambut]
  const kepalaW = AVATAR.warnaKepala[a.warnaKepala]
  const baju = AVATAR.baju[a.baju]

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (lompat !== mulai.current.id) mulai.current = { id: lompat, t }
    const j = t - mulai.current.t
    const naik = j < 0.6 ? Math.sin((j / 0.6) * Math.PI) * 0.55 : 0
    if (akar.current) {
      akar.current.position.y = position[1] + Math.abs(Math.sin(t * 2.2)) * 0.03 + naik
      akar.current.rotation.y = Math.PI / 4 + Math.sin(t * 0.6) * 0.15 + (j < 0.6 ? j * Math.PI * 3.33 : 0)
      const sq = j < 0.1 ? 1 - j * 2 : 1
      akar.current.scale.set(1 + (1 - sq) * 0.5, sq, 1 + (1 - sq) * 0.5)
    }
    if (tanganKanan.current) tanganKanan.current.rotation.z = j < 1.6 ? -2.2 + Math.sin(j * 14) * 0.4 : -0.25 + Math.sin(t * 2) * 0.05
    if (mata.current) mata.current.scale.y = Math.sin(t * 0.8) > 0.985 ? 0.15 : 1
  })

  return (
    <group ref={akar} position={position} onClick={onTap}>
      {/* kaki */}
      {[-0.13, 0.13].map((x) => (
        <group key={x} position={[x, 0.16, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.1, 0.18, 6, 12]} />
            {mat('#3d5a80')}
          </mesh>
          <mesh position={[0, -0.16, 0.05]} scale={[1, 0.6, 1.3]}>
            <sphereGeometry args={[0.12, 12, 10]} />
            {mat('#2b2b3a')}
          </mesh>
        </group>
      ))}
      {/* badan */}
      <mesh position={[0, 0.58, 0]} castShadow>
        <capsuleGeometry args={[0.27, 0.32, 8, 16]} />
        {mat(baju)}
      </mesh>
      {/* tangan */}
      <group position={[-0.3, 0.72, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.24, 6, 10]} />
          {mat(baju)}
        </mesh>
        <mesh position={[0, -0.36, 0]}>
          <sphereGeometry args={[0.085, 12, 10]} />
          {mat(kulit)}
        </mesh>
      </group>
      <group ref={tanganKanan} position={[0.3, 0.72, 0]} rotation={[0, 0, -0.3]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.24, 6, 10]} />
          {mat(baju)}
        </mesh>
        <mesh position={[0, -0.36, 0]}>
          <sphereGeometry args={[0.085, 12, 10]} />
          {mat(kulit)}
        </mesh>
      </group>

      {/* kepala */}
      <group position={[0, 1.22, 0]}>
        {a.kepala === 'hijab' && (
          <>
            <mesh position={[0, -0.18, -0.02]} castShadow>
              <coneGeometry args={[0.46, 0.55, 24, 1, true]} />
              {mat(kepalaW, { side: THREE.DoubleSide })}
            </mesh>
            {/* hijab: tudung atas menutup rambut, bagian bawah terbuka untuk wajah */}
            <mesh scale={1.12} castShadow>
              <sphereGeometry args={[0.4, 28, 10, 0, Math.PI * 2, 0, Math.PI * 0.34]} />
              {mat(kepalaW, { side: THREE.DoubleSide })}
            </mesh>
            <mesh scale={1.12} castShadow>
              <sphereGeometry args={[0.4, 28, 14, Math.PI / 2 + 0.9, Math.PI * 2 - 1.8, Math.PI * 0.34, Math.PI * 0.66]} />
              {mat(kepalaW, { side: THREE.DoubleSide })}
            </mesh>
          </>
        )}
        <mesh castShadow position={[0, -0.02, a.kepala === 'hijab' ? 0.04 : 0]} scale={a.kepala === 'hijab' ? 0.9 : 1}>
          <sphereGeometry args={[0.4, 28, 20]} />
          {mat(kulit, { roughness: 0.6 })}
        </mesh>
        {a.kepala !== 'hijab' && (
          <>
            {/* telinga */}
            {[-0.39, 0.39].map((x) => (
              <mesh key={x} position={[x, -0.02, 0]}>
                <sphereGeometry args={[0.08, 10, 10]} />
                {mat(kulit)}
              </mesh>
            ))}
            {/* rambut */}
            <mesh position={[0, 0.06, -0.03]} rotation={[-0.35, 0, 0]} castShadow>
              <sphereGeometry args={[0.43, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
              {mat(rambut, { roughness: 0.55 })}
            </mesh>
            {a.rambut === 'poni' && (
              <mesh position={[0, 0.22, 0.28]} rotation={[0.9, 0, 0]} scale={[1, 0.4, 0.6]}>
                <sphereGeometry args={[0.3, 16, 10]} />
                {mat(rambut)}
              </mesh>
            )}
            {a.rambut === 'kuncir' &&
              [-0.42, 0.42].map((x) => (
                <mesh key={x} position={[x, -0.05, -0.12]} scale={[0.8, 1.3, 0.8]} castShadow>
                  <sphereGeometry args={[0.13, 12, 10]} />
                  {mat(rambut)}
                </mesh>
              ))}
            {a.rambut === 'keriting' &&
              Array.from({ length: 9 }, (_, i) => {
                const s = (i / 9) * Math.PI * 2
                return (
                  <mesh key={i} position={[Math.cos(s) * 0.33, 0.24 + Math.sin(i) * 0.04, Math.sin(s) * 0.3 - 0.05]}>
                    <sphereGeometry args={[0.14, 10, 8]} />
                    {mat(rambut)}
                  </mesh>
                )
              })}
            {a.kepala === 'peci' && (
              <mesh position={[0, 0.4, -0.03]} rotation={[-0.2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.36, 0.39, 0.24, 24]} />
                {mat(kepalaW)}
              </mesh>
            )}
          </>
        )}
        {/* wajah */}
        <group ref={mata} position={[0, 0.0, 0.36]}>
          {[-0.13, 0.13].map((x) => (
            <mesh key={x} position={[x, 0, 0]} scale={[1, 1.25, 0.6]}>
              <sphereGeometry args={[0.055, 12, 10]} />
              {mat('#2b2b3a', { roughness: 0.2 })}
            </mesh>
          ))}
          {[-0.115, 0.145].map((x) => (
            <mesh key={x} position={[x, 0.025, 0.035]}>
              <sphereGeometry args={[0.016, 8, 6]} />
              {mat('#ffffff', { emissive: '#ffffff', emissiveIntensity: 0.6 })}
            </mesh>
          ))}
        </group>
        {[-0.24, 0.24].map((x) => (
          <mesh key={x} position={[x, -0.1, 0.31]} rotation={[0, x > 0 ? 0.6 : -0.6, 0]}>
            <circleGeometry args={[0.06, 14]} />
            {mat('#ff9aa8', { transparent: true, opacity: 0.7 })}
          </mesh>
        ))}
        <mesh position={[0, -0.14, 0.37]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.06, 0.014, 6, 14, Math.PI]} />
          {mat('#3b2f2f')}
        </mesh>
      </group>
    </group>
  )
}

/* ======================= MOMO ======================= */
export function Momo3D({
  tahap,
  pusat,
  onTap,
  lompat,
  menetas,
}: {
  tahap: number
  pusat: [number, number, number]
  onTap?: (e: ThreeEvent<MouseEvent>) => void
  lompat: number
  menetas: number // berubah nilainya untuk memainkan animasi menetas
}) {
  const akar = useRef<THREE.Group>(null)
  const sayap = useRef<THREE.Group>(null)
  const telur = useRef<THREE.Group>(null)
  const badan = useRef<THREE.Group>(null)
  const mulai = useRef({ id: 0, t: -10, tetas: 0, tt: -10 })
  const ukuran = tahap <= 1 ? 0.75 : tahap === 2 ? 0.88 : 1

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (lompat !== mulai.current.id) {
      mulai.current.id = lompat
      mulai.current.t = t
    }
    if (menetas !== mulai.current.tetas) {
      mulai.current.tetas = menetas
      mulai.current.tt = t
    }
    const j = t - mulai.current.t
    const tt = t - mulai.current.tt
    if (!akar.current) return
    // berjalan berkeliling pelan di sekitar pemain
    const sudut = t * 0.35
    const r = 1.05
    const x = pusat[0] + Math.cos(sudut) * r
    const z = pusat[2] + Math.sin(sudut) * r * 0.7
    const hop = tahap > 0 ? Math.abs(Math.sin(t * 5)) * 0.08 : 0
    const naik = j < 0.7 ? Math.sin((j / 0.7) * Math.PI) * 0.7 : 0
    akar.current.position.set(tahap > 0 ? x : pusat[0] + 0.9, pusat[1] + hop + naik, tahap > 0 ? z : pusat[2] + 0.35)
    akar.current.rotation.y = tahap > 0 ? -sudut + Math.PI : 0.6
    if (j < 0.7) akar.current.rotation.y += j * Math.PI * 2.85
    // telur bergoyang; saat menetas goyang makin kencang
    if (telur.current) {
      const kuat = tt < 1.6 ? 0.08 + tt * 0.22 : 0.07 * (Math.sin(t * 0.8) > 0.7 ? 1 : 0)
      telur.current.rotation.z = Math.sin(t * (tt < 1.6 ? 30 : 9)) * kuat
      telur.current.visible = tahap === 0 || tt < 1.6
    }
    if (badan.current) {
      const muncul = tt >= 1.6 && tt < 2.3 ? (tt - 1.6) / 0.7 : tt < 1.6 && tahap > 0 && tt >= 0 ? 0 : 1
      const pegas = muncul < 1 ? 1 + Math.sin(muncul * Math.PI * 2.5) * 0.25 * (1 - muncul) : 1
      badan.current.scale.setScalar(ukuran * Math.min(1, muncul * 1.2) * pegas)
      badan.current.visible = tahap > 0 && !(tt >= 0 && tt < 1.6)
    }
    if (sayap.current) sayap.current.rotation.z = Math.sin(t * 9) * 0.35
  })

  const kulit = '#ffd3b0'
  const garis = '#6b4a3a'
  return (
    <group ref={akar} onClick={onTap}>
      {/* telur */}
      <group ref={telur} position={[0, 0.02, 0]}>
        <mesh position={[0, 0.34, 0]} scale={[0.82, 1, 0.82]} castShadow>
          <sphereGeometry args={[0.34, 24, 18]} />
          {mat('#eef4ff', { roughness: 0.4 })}
        </mesh>
        <mesh position={[0, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.85, 0.85, 1]}>
          <torusGeometry args={[0.3, 0.025, 6, 24]} />
          {mat('#ffb3c7')}
        </mesh>
        {[
          [0.18, 0.5, 0.17, '#ffd166'],
          [-0.2, 0.25, 0.16, '#7fd6ff'],
          [0.05, 0.2, 0.27, '#c8b6ff'],
        ].map(([x, y, z, c], i) => (
          <mesh key={i} position={[x as number, y as number, z as number]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            {mat(c as string)}
          </mesh>
        ))}
      </group>

      {/* Momo */}
      <group ref={badan}>
        {tahap === 4 && (
          <group ref={sayap} position={[0, 0.45, -0.18]}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.38, 0.1, 0]} rotation={[0, 0, s * 0.6]} scale={[1, 0.55, 0.25]}>
                <sphereGeometry args={[0.3, 14, 10]} />
                {mat('#c8b6ff', { emissive: '#c8b6ff', emissiveIntensity: 0.2 })}
              </mesh>
            ))}
          </group>
        )}
        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.38, 24, 18]} />
          {mat(kulit, { roughness: 0.85 })}
        </mesh>
        <mesh position={[0, 0.33, 0.2]} scale={[1, 0.9, 0.6]}>
          <sphereGeometry args={[0.24, 18, 14]} />
          {mat('#fff3e6')}
        </mesh>
        {[-0.24, 0.24].map((x) => (
          <group key={x} position={[x, 0.74, -0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.12, 14, 10]} />
              {mat(kulit)}
            </mesh>
            <mesh position={[0, 0, 0.07]} scale={[1, 1, 0.4]}>
              <sphereGeometry args={[0.065, 10, 8]} />
              {mat('#ffb3c7')}
            </mesh>
          </group>
        ))}
        {[-0.13, 0.13].map((x) => (
          <mesh key={x} position={[x, 0.46, 0.33]} scale={[1, 1.2, 0.6]}>
            <sphereGeometry args={[0.05, 10, 8]} />
            {mat(garis, { roughness: 0.2 })}
          </mesh>
        ))}
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 0.36, 0.3]} rotation={[0, x > 0 ? 0.6 : -0.6, 0]}>
            <circleGeometry args={[0.05, 12]} />
            {mat('#ff9aa8', { transparent: true, opacity: 0.7 })}
          </mesh>
        ))}
        {tahap >= 3 && (
          <mesh position={[0, 0.66, 0.26]} rotation={[0.3, 0, 0]}>
            <octahedronGeometry args={[0.07, 0]} />
            {mat('#ffd166', { emissive: '#ffb300', emissiveIntensity: 0.6 })}
          </mesh>
        )}
        <mesh position={[0, 0.3, -0.36]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          {mat(kulit)}
        </mesh>
        {[-0.16, 0.16].map((x) => (
          <mesh key={x} position={[x, 0.06, 0.08]} scale={[1, 0.55, 1.2]}>
            <sphereGeometry args={[0.1, 10, 8]} />
            {mat(kulit)}
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ======================= NURI ======================= */
export function Nuri3D({ position, onTap, putar }: { position: [number, number, number]; onTap?: (e: ThreeEvent<MouseEvent>) => void; putar: number }) {
  const akar = useRef<THREE.Group>(null)
  const sayapKiri = useRef<THREE.Mesh>(null)
  const sayapKanan = useRef<THREE.Mesh>(null)
  const mulai = useRef({ id: 0, t: -10 })
  const fase = useMemo(() => Math.random() * 6, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (putar !== mulai.current.id) mulai.current = { id: putar, t }
    const j = t - mulai.current.t
    if (akar.current) {
      akar.current.position.set(position[0] + Math.sin(t * 0.7 + fase) * 0.4, position[1] + Math.sin(t * 2.2) * 0.18, position[2] + Math.cos(t * 0.7 + fase) * 0.3)
      akar.current.rotation.y = Math.PI / 4 + (j < 0.8 ? j * Math.PI * 2.5 : Math.sin(t * 0.9) * 0.3)
    }
    const kepak = Math.sin(t * 16) * 0.7
    if (sayapKiri.current) sayapKiri.current.rotation.z = 0.4 + kepak
    if (sayapKanan.current) sayapKanan.current.rotation.z = -0.4 - kepak
  })
  return (
    <group ref={akar} onClick={onTap} scale={0.85}>
      <mesh castShadow>
        <sphereGeometry args={[0.36, 24, 18]} />
        {mat('#5cc8f0', { roughness: 0.5 })}
      </mesh>
      <mesh position={[0, -0.08, 0.2]} scale={[1, 0.9, 0.6]}>
        <sphereGeometry args={[0.24, 16, 12]} />
        {mat('#fff4dc')}
      </mesh>
      <mesh ref={sayapKiri} position={[-0.32, 0, 0]} scale={[0.4, 0.75, 0.3]}>
        <sphereGeometry args={[0.3, 12, 10]} />
        {mat('#3aa9d6')}
      </mesh>
      <mesh ref={sayapKanan} position={[0.32, 0, 0]} scale={[0.4, 0.75, 0.3]}>
        <sphereGeometry args={[0.3, 12, 10]} />
        {mat('#3aa9d6')}
      </mesh>
      <mesh position={[0, 0.02, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.16, 8]} />
        {mat('#ff9f43')}
      </mesh>
      {[-0.13, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.3]}>
          <sphereGeometry args={[0.05, 10, 8]} />
          {mat('#2b2b3a', { roughness: 0.2 })}
        </mesh>
      ))}
      <mesh position={[0.02, 0.4, 0]} rotation={[0, 0, 0.3]} scale={[0.4, 1, 0.4]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        {mat('#3aa9d6')}
      </mesh>
    </group>
  )
}

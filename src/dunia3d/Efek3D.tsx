/** Efek 3D: laut ber-shader, ledakan partikel (koin/bintang/hati), buih di sekitar pulau. */
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

/* ---------------- Laut ---------------- */
export function Laut3D({ pulau }: { pulau: { x: number; z: number; r: number }[] }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const data = useMemo(() => {
    const arr = Array.from({ length: 8 }, (_, i) => (pulau[i] ? new THREE.Vector3(pulau[i].x, pulau[i].z, pulau[i].r) : new THREE.Vector3(999, 999, 0)))
    return arr
  }, [pulau])
  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uWaktu.value = clock.elapsedTime
  })
  const shader = useMemo(
    () => ({
      uniforms: {
        uWaktu: { value: 0 },
        uPulau: { value: data },
        uDalam: { value: new THREE.Color('#1f9fd0') },
        uDangkal: { value: new THREE.Color('#6fe3ea') },
        uKabut: { value: new THREE.Color('#bfeaff') },
      },
      vertexShader: `
        uniform float uWaktu;
        varying vec3 vPos;
        void main(){
          vec3 p = position;
          p.z += sin(p.x * 0.6 + uWaktu * 1.2) * 0.05 + cos(p.y * 0.5 + uWaktu) * 0.05;
          vec4 w = modelMatrix * vec4(p, 1.0);
          vPos = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: `
        uniform float uWaktu;
        uniform vec3 uPulau[8];
        uniform vec3 uDalam; uniform vec3 uDangkal; uniform vec3 uKabut;
        varying vec3 vPos;
        void main(){
          float dekat = 0.0;
          for (int i = 0; i < 8; i++) {
            float d = distance(vPos.xz, uPulau[i].xy) - uPulau[i].z;
            dekat = max(dekat, 1.0 - smoothstep(0.0, 2.4, d));
          }
          vec3 warna = mix(uDalam, uDangkal, dekat * 0.85);
          // kilau ombak kecil
          float pola = sin(vPos.x * 2.3 + uWaktu * 1.5) * sin(vPos.z * 2.1 - uWaktu * 1.2);
          warna += smoothstep(0.82, 1.0, pola) * 0.18;
          // buih di tepi pulau
          for (int i = 0; i < 8; i++) {
            float d = distance(vPos.xz, uPulau[i].xy) - uPulau[i].z * 1.12;
            float cincin = 1.0 - smoothstep(0.0, 0.18, abs(d - 0.15 - sin(uWaktu * 1.5 + float(i)) * 0.06));
            warna = mix(warna, vec3(1.0), cincin * 0.75);
          }
          // memudar ke kabut di kejauhan
          float jauh = smoothstep(18.0, 46.0, length(vPos.xz - vec2(0.0, -8.0)));
          warna = mix(warna, uKabut, jauh);
          gl_FragColor = vec4(warna, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
    [data],
  )
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -8]} receiveShadow>
      <planeGeometry args={[140, 140, 80, 80]} />
      <shaderMaterial ref={mat} args={[shader]} />
    </mesh>
  )
}

/* ---------------- Ledakan partikel ---------------- */
export type JenisPartikel = 'koin' | 'bintang' | 'hati' | 'pecahan'

type Partikel = { p: THREE.Vector3; v: THREE.Vector3; r: THREE.Euler; vr: number; s: number }

export function Ledakan3D({ posisi, jenis, jumlah = 18, onSelesai }: { posisi: [number, number, number]; jenis: JenisPartikel; jumlah?: number; onSelesai?: () => void }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const umur = useRef(0)
  const selesai = useRef(false)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const partikel = useMemo<Partikel[]>(
    () =>
      Array.from({ length: jumlah }, () => {
        const a = Math.random() * Math.PI * 2
        const kec = 1.5 + Math.random() * 2.2
        return {
          p: new THREE.Vector3(...posisi),
          v: new THREE.Vector3(Math.cos(a) * kec * 0.6, 3 + Math.random() * 2.5, Math.sin(a) * kec * 0.6),
          r: new THREE.Euler(Math.random() * 3, Math.random() * 3, 0),
          vr: (Math.random() - 0.5) * 12,
          s: 0.7 + Math.random() * 0.6,
        }
      }),
    [posisi, jumlah],
  )
  const geom = useMemo(() => {
    if (jenis === 'koin') return new THREE.CylinderGeometry(0.11, 0.11, 0.03, 16).rotateX(Math.PI / 2)
    if (jenis === 'bintang') return new THREE.OctahedronGeometry(0.11, 0)
    if (jenis === 'pecahan') return new THREE.TetrahedronGeometry(0.09, 0)
    return new THREE.SphereGeometry(0.08, 10, 8)
  }, [jenis])
  const warna = jenis === 'koin' ? '#ffc93c' : jenis === 'bintang' ? '#ffe066' : jenis === 'pecahan' ? '#eef4ff' : '#ff6b8f'

  useFrame((_, dt) => {
    if (!ref.current || selesai.current) return
    const d = Math.min(dt, 0.05)
    umur.current += d
    const sisa = Math.max(0, 1 - umur.current / 1.6)
    partikel.forEach((pt, i) => {
      pt.v.y -= 7 * d
      pt.p.addScaledVector(pt.v, d)
      pt.r.x += pt.vr * d
      pt.r.y += pt.vr * d * 0.7
      dummy.position.copy(pt.p)
      dummy.rotation.copy(pt.r)
      dummy.scale.setScalar(pt.s * Math.min(1, sisa * 2))
      dummy.updateMatrix()
      ref.current!.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (umur.current > 1.6) {
      selesai.current = true
      onSelesai?.()
    }
  })
  return (
    <instancedMesh ref={ref} args={[geom, undefined, jumlah]} frustumCulled={false}>
      <meshStandardMaterial color={warna} metalness={jenis === 'koin' ? 0.5 : 0} roughness={0.3} emissive={warna} emissiveIntensity={0.35} />
    </instancedMesh>
  )
}

/* ---------------- Jalan batu antar pulau ---------------- */
export function JalanBatu({ titik }: { titik: THREE.Vector3[] }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const posisi = useMemo(() => {
    const kurva = new THREE.CatmullRomCurve3(titik, false, 'catmullrom', 0.4)
    const n = Math.floor(kurva.getLength() / 0.75)
    return kurva.getSpacedPoints(n)
  }, [titik])
  useMemo(() => {
    // diatur setelah ref tersedia (lihat useFrame satu kali)
  }, [])
  const siap = useRef(false)
  useFrame(() => {
    if (siap.current || !ref.current) return
    const d = new THREE.Object3D()
    posisi.forEach((p, i) => {
      d.position.set(p.x, 0.07, p.z)
      d.rotation.set(0, i * 1.7, 0)
      const s = 0.85 + ((i * 37) % 10) / 40
      d.scale.set(s, 1, s * 0.85)
      d.updateMatrix()
      ref.current!.setMatrixAt(i, d.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
    siap.current = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, posisi.length]} receiveShadow>
      <cylinderGeometry args={[0.24, 0.27, 0.1, 10]} />
      <meshStandardMaterial color="#f1e2c0" roughness={1} />
    </instancedMesh>
  )
}

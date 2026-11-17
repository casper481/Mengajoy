/** Kanvas 3D siap pakai: cahaya, bayangan, tone mapping, dan pengaman bila 3D gagal. */
import { PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Component, Suspense, useState, type ReactNode } from 'react'
import * as THREE from 'three'

type Props = {
  children: ReactNode
  kamera: { posisi: [number, number, number]; fov?: number; lihat?: [number, number, number] }
  kualitas?: 'tinggi' | 'sedang'
  onGagal?: () => void
  className?: string
  bayanganLuas?: number
}

export default function Panggung3D({ children, kamera, kualitas = 'sedang', onGagal, className = '', bayanganLuas = 8 }: Props) {
  const [dpr, setDpr] = useState(kualitas === 'tinggi' ? 1.75 : 1.4)
  return (
    <PenjagaGagal onGagal={onGagal}>
      <Canvas
        className={className}
        shadows
        dpr={dpr}
        camera={{ position: kamera.posisi, fov: kamera.fov ?? 35, near: 0.3, far: 80 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.NeutralToneMapping
          gl.toneMappingExposure = 1.05
          camera.lookAt(...(kamera.lihat ?? [0, 0.6, 0]))
        }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <hemisphereLight args={['#dff4ff', '#5d8f5a', 1.1]} />
        <directionalLight
          position={[5, 9, 6]}
          intensity={2.3}
          color="#fff4dc"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-bayanganLuas}
          shadow-camera-right={bayanganLuas}
          shadow-camera-top={bayanganLuas}
          shadow-camera-bottom={-bayanganLuas}
          shadow-bias={-0.0006}
          shadow-normalBias={0.03}
        />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </PenjagaGagal>
  )
}

class PenjagaGagal extends Component<{ onGagal?: () => void; children: ReactNode }, { gagal: boolean }> {
  state = { gagal: false }
  static getDerivedStateFromError() {
    return { gagal: true }
  }
  componentDidCatch() {
    this.props.onGagal?.()
  }
  render() {
    return this.state.gagal ? null : this.props.children
  }
}

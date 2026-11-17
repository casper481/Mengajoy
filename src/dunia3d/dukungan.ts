/** Cek apakah perangkat cukup kuat untuk dunia 3D. Kalau tidak, app memakai peta 2D. */
export type Kualitas = 'tinggi' | 'sedang'

export function dukungan3D(): { bisa: boolean; kualitas: Kualitas; alasan?: string } {
  try {
    const c = document.createElement('canvas')
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return { bisa: false, kualitas: 'sedang', alasan: 'WebGL tidak tersedia' }
    const nav = navigator as Navigator & { deviceMemory?: number }
    const memori = nav.deviceMemory ?? 4
    const inti = nav.hardwareConcurrency ?? 4
    if (memori < 2 || inti <= 2) return { bisa: false, kualitas: 'sedang', alasan: 'Perangkat ringan' }
    const kualitas: Kualitas = memori >= 6 && inti >= 6 ? 'tinggi' : 'sedang'
    return { bisa: true, kualitas }
  } catch {
    return { bisa: false, kualitas: 'sedang', alasan: 'Gagal memeriksa WebGL' }
  }
}

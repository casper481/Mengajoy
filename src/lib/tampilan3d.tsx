/** Apakah tampilan 3D dipakai (ditentukan App dari dukungan perangkat + pilihan orang tua). */
import { createContext, useContext } from 'react'

export const Tampilan3DCtx = createContext<{ pakai3D: boolean; kualitas: 'tinggi' | 'sedang'; gagal: () => void }>({ pakai3D: false, kualitas: 'sedang', gagal: () => {} })
export const useTampilan3D = () => useContext(Tampilan3DCtx)

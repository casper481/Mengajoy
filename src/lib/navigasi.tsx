/** Navigasi sederhana yang bisa dipanggil dari komponen mana pun (misalnya bar atas). */
import { createContext, useContext } from 'react'

export type Navigasi = { keStreak: () => void }
export const NavCtx = createContext<Navigasi | null>(null)
export const useNavigasi = () => useContext(NavCtx)

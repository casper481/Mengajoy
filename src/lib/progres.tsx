/**
 * "Pusat data" app: semua halaman membaca & mengubah progres lewat sini.
 * Setiap perubahan langsung disimpan ke localStorage.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { hadiahById, type Slot } from '../data/hadiah'
import { STAGES, stageById } from '../data/stages'
import { hapusSemua, muat, PROGRES_AWAL, simpan, type Progres } from './simpan'
import { hariIni, kemarin } from './tanggal'
import { setEfekAktif } from './efekSuara'

type Aksi = {
  p: Progres
  mulai: () => void
  /** Simpan hasil stage. Mengembalikan id hadiah baru (kalau ada). */
  selesaiStage: (stageId: string, bintang: number) => string | null
  tandaiBelajar: () => void
  pakai: (slot: Slot, hadiahId: string | null) => void
  selesaiMisi: () => void
  tambahWaktu: (detik: number) => void
  setBatas: (m: 15 | 30 | 45) => void
  setEfek: (v: boolean) => void
  setDemo: (v: boolean) => void
  reset: () => void
  // nilai turunan
  streakAktif: number
  totalBintang: number
  misiHariIniSelesai: boolean
  detikHariIni: number
  batasTercapai: boolean
  stageTerbuka: (stageId: string) => boolean
}

const Ctx = createContext<Aksi | null>(null)

export function ProgresProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Progres>(() => muat())

  useEffect(() => {
    simpan(p)
    setEfekAktif(p.efekSuara)
  }, [p])

  const mulai = useCallback(() => setP((s) => ({ ...s, sudahMulai: true })), [])

  const tandaiBelajar = useCallback(() => {
    setP((s) => {
      const hi = hariIni()
      if (s.streak.terakhir === hi) return s
      const jumlah = s.streak.terakhir === kemarin() ? s.streak.jumlah + 1 : 1
      return { ...s, streak: { jumlah, terakhir: hi } }
    })
  }, [])

  const selesaiStage = useCallback(
    (stageId: string, bintang: number) => {
      const stage = stageById(stageId)
      const hadiahBaru = p.hadiah.includes(stage.hadiah) ? null : stage.hadiah
      setP((s) => {
        const lama = s.bintang[stageId] ?? 0
        const hadiah = s.hadiah.includes(stage.hadiah) ? s.hadiah : [...s.hadiah, stage.hadiah]
        // otomatis pakaikan hadiah baru kalau slotnya masih kosong
        const dipakai = { ...s.dipakai }
        const slot = hadiahById(stage.hadiah).slot
        if (hadiahBaru && !dipakai[slot]) dipakai[slot] = stage.hadiah
        return { ...s, bintang: { ...s.bintang, [stageId]: Math.max(lama, bintang) }, hadiah, dipakai }
      })
      tandaiBelajar()
      return hadiahBaru
    },
    [p.hadiah, tandaiBelajar],
  )

  const pakai = useCallback((slot: Slot, hadiahId: string | null) => {
    setP((s) => {
      const dipakai = { ...s.dipakai }
      if (hadiahId) dipakai[slot] = hadiahId
      else delete dipakai[slot]
      return { ...s, dipakai }
    })
  }, [])

  const selesaiMisi = useCallback(() => {
    setP((s) => (s.misi.tanggal === hariIni() ? s : { ...s, misi: { tanggal: hariIni(), total: s.misi.total + 1 } }))
  }, [])

  const tambahWaktu = useCallback((detik: number) => {
    setP((s) => {
      const hi = hariIni()
      const hariIniDetik = s.waktu.tanggal === hi ? s.waktu.detikHariIni : 0
      return { ...s, waktu: { tanggal: hi, detikHariIni: hariIniDetik + detik, totalDetik: s.waktu.totalDetik + detik } }
    })
  }, [])

  const setBatas = useCallback((m: 15 | 30 | 45) => setP((s) => ({ ...s, batasMenit: m })), [])
  const setEfek = useCallback((v: boolean) => setP((s) => ({ ...s, efekSuara: v })), [])
  const setDemo = useCallback((v: boolean) => setP((s) => ({ ...s, modeDemo: v })), [])
  const reset = useCallback(() => {
    hapusSemua()
    setP({ ...structuredClone(PROGRES_AWAL), waktu: { tanggal: hariIni(), detikHariIni: 0, totalDetik: 0 } })
  }, [])

  const nilai = useMemo<Aksi>(() => {
    const hi = hariIni()
    const streakAktif = p.streak.terakhir === hi || p.streak.terakhir === kemarin() ? p.streak.jumlah : 0
    const totalBintang = Object.values(p.bintang).reduce((a, b) => a + b, 0)
    const detikHariIni = p.waktu.tanggal === hi ? p.waktu.detikHariIni : 0
    const stageTerbuka = (stageId: string) => {
      if (p.modeDemo) return true
      const s = stageById(stageId)
      if (s.nomor === 1) {
        // stage pertama pulau 2 terbuka setelah semua pulau 1 selesai
        if (s.pulau === 1) return true
        return STAGES.filter((x) => x.pulau === s.pulau - 1).every((x) => (p.bintang[x.id] ?? 0) > 0)
      }
      const sebelum = STAGES.find((x) => x.pulau === s.pulau && x.nomor === s.nomor - 1)!
      return (p.bintang[sebelum.id] ?? 0) > 0
    }
    return {
      p,
      mulai,
      selesaiStage,
      tandaiBelajar,
      pakai,
      selesaiMisi,
      tambahWaktu,
      setBatas,
      setEfek,
      setDemo,
      reset,
      streakAktif,
      totalBintang,
      misiHariIniSelesai: p.misi.tanggal === hi,
      detikHariIni,
      batasTercapai: detikHariIni >= p.batasMenit * 60,
      stageTerbuka,
    }
  }, [p, mulai, selesaiStage, tandaiBelajar, pakai, selesaiMisi, tambahWaktu, setBatas, setEfek, setDemo, reset])

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>
}

export function useProgres() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useProgres harus di dalam ProgresProvider')
  return c
}

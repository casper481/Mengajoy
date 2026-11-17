/**
 * "Pusat data" app: semua halaman membaca & mengubah progres lewat sini.
 * Setiap perubahan langsung disimpan ke localStorage.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DEKORASI, HADIAH_BELAJAR, HADIAH_STREAK, dekorasiById, levelDariXp, xpUntukLevel, type DataAvatar } from '../data/dunia'
import { HADIAH, hadiahById, type Slot } from '../data/hadiah'
import { STAGES, stageById } from '../data/stages'
import { hapusSemua, harianBaru, muat, PROGRES_AWAL, simpan, type Harian, type Progres } from './simpan'
import { hariIni, kemarin } from './tanggal'
import { setEfekAktif } from './efekSuara'

export type AksiUji = 'tamatkan-semua' | 'hampir-tamat' | 'habiskan-waktu' | 'reset-waktu' | 'hari-berikutnya' | 'tambah-koin' | 'tambah-xp'

const hariLalu = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return hariIni(d)
}
const selisihHari = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)

/** Catatan harian, otomatis diganti baru saat tanggal berubah. */
const harianKini = (s: Progres): Harian => (s.harian.tanggal === hariIni() ? s.harian : harianBaru())

/** Tambahkan koin & XP. */
const beri = (s: Progres, h: { koin: number; xp: number }): Progres => ({ ...s, koin: s.koin + h.koin, xp: s.xp + h.xp })

/** Streak: +1 bila kemarin belajar. Bila terlewat tepat 1 hari, Nuri "menjaga api" (maks. sekali per 7 hari). */
function majukanStreak(s: Progres): Progres {
  const hi = hariIni()
  const st = s.streak
  if (st.terakhir === hi) return s
  let jumlah = 1
  let jagaTerakhir = st.jagaTerakhir
  if (st.terakhir === kemarin()) jumlah = st.jumlah + 1
  else if (st.terakhir && selisihHari(st.terakhir, hi) === 2 && (!st.jagaTerakhir || selisihHari(st.jagaTerakhir, hi) >= 7)) {
    jumlah = st.jumlah + 1
    jagaTerakhir = hi
  }
  return { ...s, streak: { ...st, jumlah, terakhir: hi, terbaik: Math.max(st.terbaik, jumlah), jagaTerakhir } }
}

type Aksi = {
  p: Progres
  mulai: () => void
  /** Simpan hasil stage. Mengembalikan hadiah aksesoris baru dan koin/XP yang didapat. */
  selesaiStage: (stageId: string, bintang: number) => { hadiah: string | null; koin: number; xp: number }
  tandaiBelajar: () => void
  pakai: (slot: Slot, hadiahId: string | null) => void
  selesaiMisi: () => void
  tambahWaktu: (detik: number) => void
  setBatas: (m: 15 | 30 | 45) => void
  setEfek: (v: boolean) => void
  setDemo: (v: boolean) => void
  setNama: (nama: string) => void
  tandaiTamat: () => void
  catatLatihan: (hasil: { kunci: string; salah: number }[]) => void
  tandaiAyat: (surah: number, ayat: number) => void
  // ===== Dunia Mengajoy =====
  klaim: (id: string, koin: number, xp?: number) => void
  klaimStreak: (hari: number) => void
  beliDekorasi: (id: string) => boolean
  pasangDekorasi: (slot: string, id: string | null) => void
  setAvatar: (a: DataAvatar) => void
  setNamaPeliharaan: (nama: string) => void
  kirimApresiasi: (stiker: string, pesan: string) => void
  bacaApresiasi: () => void
  selesaiEvent: () => void
  klaimPekan: (koin: number) => void
  setTampilan: (t: 'otomatis' | '3d' | '2d') => void
  reset: () => void
  uji: (aksi: AksiUji) => void
  // nilai turunan
  streakAktif: number
  totalBintang: number
  misiHariIniSelesai: boolean
  detikHariIni: number
  batasTercapai: boolean
  stageTerbuka: (stageId: string) => boolean
  pulauTerbuka: (pulauId: number) => boolean
  semuaTamat: boolean
  latihanTersedia: boolean
  latihanHariIniSelesai: boolean
  harian: Harian
  level: number
  xpLevelIni: number
  xpLevelBerikut: number
  apresiasiBaru: Progres['apresiasi'][number] | null
  hariAktifPekanIni: number
}

const Ctx = createContext<Aksi | null>(null)

export function ProgresProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Progres>(() => muat())

  useEffect(() => {
    simpan(p)
    setEfekAktif(p.efekSuara)
  }, [p])

  const mulai = useCallback(() => setP((s) => ({ ...s, sudahMulai: true })), [])
  const tandaiBelajar = useCallback(() => setP((s) => majukanStreak(s)), [])

  const selesaiStage = useCallback(
    (stageId: string, bintang: number) => {
      const stage = stageById(stageId)
      const hadiahStage = stage.hadiah
      const hadiahBaru = hadiahStage && !p.hadiah.includes(hadiahStage) ? hadiahStage : null
      const lama = p.bintang[stageId] ?? 0
      // koin penuh untuk bintang baru; mengulang tetap dapat sedikit (latihan itu baik)
      const tambahan = Math.max(0, bintang - lama)
      const koin = tambahan * HADIAH_BELAJAR.bintang.koin + 5
      const xp = tambahan * HADIAH_BELAJAR.bintang.xp + 5
      setP((s0) => {
        let s = majukanStreak(s0)
        const hadiah = hadiahBaru && !s.hadiah.includes(hadiahBaru) ? [...s.hadiah, hadiahBaru] : s.hadiah
        const dipakai = { ...s.dipakai }
        if (hadiahBaru) {
          const slot = hadiahById(hadiahBaru).slot
          if (!dipakai[slot]) dipakai[slot] = hadiahBaru
        }
        const h = harianKini(s)
        s = {
          ...s,
          bintang: { ...s.bintang, [stageId]: Math.max(s.bintang[stageId] ?? 0, bintang) },
          hadiah,
          dipakai,
          harian: { ...h, stage: h.stage + 1, bintang: h.bintang + bintang, bintang3: h.bintang3 + (bintang === 3 ? 1 : 0) },
        }
        return beri(s, { koin, xp })
      })
      return { hadiah: hadiahBaru, koin, xp }
    },
    [p.hadiah, p.bintang],
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
    setP((s) => {
      if (s.misi.tanggal === hariIni()) return s
      const h = harianKini(s)
      return beri({ ...s, misi: { tanggal: hariIni(), total: s.misi.total + 1 }, harian: { ...h, dunia: true }, keluarga: s.keluarga + 1 }, HADIAH_BELAJAR.misiDunia)
    })
  }, [])

  const tambahWaktu = useCallback((detik: number) => {
    setP((s) => {
      const hi = hariIni()
      const hariIniDetik = s.waktu.tanggal === hi ? s.waktu.detikHariIni : 0
      // catatan keaktifan 30 hari terakhir (untuk laporan orang tua)
      const aktif: Record<string, number> = {}
      const batas = hariLalu(30)
      for (const [t, v] of Object.entries(s.aktif)) if (t >= batas) aktif[t] = v
      aktif[hi] = (aktif[hi] ?? 0) + detik
      return { ...s, aktif, waktu: { tanggal: hi, detikHariIni: hariIniDetik + detik, totalDetik: s.waktu.totalDetik + detik } }
    })
  }, [])

  const setBatas = useCallback((m: 15 | 30 | 45) => setP((s) => ({ ...s, batasMenit: m })), [])
  const setEfek = useCallback((v: boolean) => setP((s) => ({ ...s, efekSuara: v })), [])
  const setDemo = useCallback((v: boolean) => setP((s) => ({ ...s, modeDemo: v })), [])
  const setNama = useCallback((nama: string) => setP((s) => ({ ...s, namaAnak: nama.slice(0, 30) })), [])
  const tandaiTamat = useCallback(() => setP((s) => (s.tamatDilihat ? s : { ...s, tamatDilihat: true })), [])

  const catatLatihan = useCallback((hasil: { kunci: string; salah: number }[]) => {
    setP((s0) => {
      const s = majukanStreak(s0)
      const statistik = { ...s.statistik }
      for (const h of hasil) {
        const lama = statistik[h.kunci] ?? { b: 0, s: 0 }
        statistik[h.kunci] = h.salah === 0 ? { ...lama, b: lama.b + 1 } : { ...lama, s: lama.s + 1 }
      }
      const hi = hariIni()
      const latihan = s.latihan.tanggal === hi ? s.latihan : { tanggal: hi, total: s.latihan.total + 1 }
      const h = harianKini(s)
      return beri({ ...s, statistik, latihan, harian: { ...h, latihan: h.latihan + 1 } }, HADIAH_BELAJAR.latihan)
    })
  }, [])

  const tandaiAyat = useCallback((surah: number, ayat: number) => {
    setP((s0) => {
      const s = majukanStreak(s0)
      const lama = s.surat[surah] ?? []
      if (lama.includes(ayat)) return s
      const h = harianKini(s)
      return beri(
        { ...s, surat: { ...s.surat, [surah]: [...lama, ayat].sort((a, b) => a - b) }, harian: { ...h, ayat: h.ayat + 1 }, keluarga: s.keluarga + 1 },
        HADIAH_BELAJAR.ayat,
      )
    })
  }, [])

  // ===== Dunia Mengajoy =====
  const klaim = useCallback((id: string, koin: number, xp = 0) => {
    setP((s) => {
      const h = harianKini(s)
      if (h.diklaim.includes(id)) return s
      return beri({ ...s, harian: { ...h, diklaim: [...h.diklaim, id] } }, { koin, xp })
    })
  }, [])

  const klaimStreak = useCallback((hari: number) => {
    setP((s) => {
      const hadiah = HADIAH_STREAK.find((x) => x.hari === hari)
      if (!hadiah || s.streak.diklaim.includes(hari) || s.streak.terbaik < hari) return s
      const dimiliki = hadiah.dekorasi && !s.dekorasi.dimiliki.includes(hadiah.dekorasi) ? [...s.dekorasi.dimiliki, hadiah.dekorasi] : s.dekorasi.dimiliki
      return {
        ...s,
        koin: s.koin + (hadiah.koin ?? 0),
        gelar: hadiah.gelar ?? s.gelar,
        dekorasi: { ...s.dekorasi, dimiliki },
        streak: { ...s.streak, diklaim: [...s.streak.diklaim, hari] },
      }
    })
  }, [])

  const beliDekorasi = useCallback(
    (id: string) => {
      const d = dekorasiById(id)
      if (!d || p.dekorasi.dimiliki.includes(id) || p.koin < d.harga) return false
      setP((s) => (s.dekorasi.dimiliki.includes(id) || s.koin < d.harga ? s : { ...s, koin: s.koin - d.harga, dekorasi: { ...s.dekorasi, dimiliki: [...s.dekorasi.dimiliki, id] } }))
      return true
    },
    [p.dekorasi.dimiliki, p.koin],
  )

  const pasangDekorasi = useCallback((slot: string, id: string | null) => {
    setP((s) => {
      const slotBaru = { ...s.dekorasi.slot }
      if (id) slotBaru[slot] = id
      else delete slotBaru[slot]
      return { ...s, dekorasi: { ...s.dekorasi, slot: slotBaru } }
    })
  }, [])

  const setAvatar = useCallback((a: DataAvatar) => setP((s) => ({ ...s, avatar: a, avatarDibuat: true })), [])
  const setNamaPeliharaan = useCallback((nama: string) => setP((s) => ({ ...s, namaPeliharaan: nama.slice(0, 14) })), [])
  const kirimApresiasi = useCallback((stiker: string, pesan: string) => {
    setP((s) => beri({ ...s, apresiasi: [{ stiker, pesan, tanggal: hariIni(), dibaca: false }, ...s.apresiasi].slice(0, 20) }, HADIAH_BELAJAR.apresiasi))
  }, [])
  const bacaApresiasi = useCallback(() => setP((s) => ({ ...s, apresiasi: s.apresiasi.map((a) => ({ ...a, dibaca: true })) })), [])
  const selesaiEvent = useCallback(() => setP((s0) => {
    const s = majukanStreak(s0)
    return { ...s, harian: { ...harianKini(s), event: true } }
  }), [])
  const klaimPekan = useCallback((koin: number) => {
    setP((s) => (s.pekanDiklaim === hariIni() ? s : { ...s, koin: s.koin + koin, pekanDiklaim: hariIni() }))
  }, [])

  const setTampilan = useCallback((t: 'otomatis' | '3d' | '2d') => setP((s) => ({ ...s, tampilan: t })), [])
  const uji = useCallback((aksi: AksiUji) => {
    setP((s) => {
      const hi = hariIni()
      const semua = (kecuali?: string) => Object.fromEntries(STAGES.filter((x) => x.id !== kecuali).map((x) => [x.id, 3]))
      switch (aksi) {
        case 'tamatkan-semua':
          return { ...s, bintang: semua(), hadiah: HADIAH.map((h) => h.id), tamatDilihat: false }
        case 'hampir-tamat': {
          const terakhir = STAGES[STAGES.length - 1]
          return { ...s, bintang: semua(terakhir.id), tamatDilihat: false, modeDemo: false }
        }
        case 'habiskan-waktu':
          return { ...s, waktu: { ...s.waktu, tanggal: hi, detikHariIni: s.batasMenit * 60 } }
        case 'reset-waktu':
          return { ...s, waktu: { ...s.waktu, tanggal: hi, detikHariIni: 0 } }
        case 'tambah-koin':
          return { ...s, koin: s.koin + 500 }
        case 'tambah-xp':
          return { ...s, xp: s.xp + 300 }
        case 'hari-berikutnya': {
          // geser semua catatan "hari ini" menjadi "kemarin", seolah-olah sekarang sudah besok
          const geser = (t: string | null) => (t === hi ? kemarin() : t)
          const aktif = { ...s.aktif }
          if (aktif[hi]) {
            aktif[kemarin()] = (aktif[kemarin()] ?? 0) + aktif[hi]
            delete aktif[hi]
          }
          return {
            ...s,
            aktif,
            streak: { ...s.streak, terakhir: geser(s.streak.terakhir), jagaTerakhir: geser(s.streak.jagaTerakhir) },
            misi: { ...s.misi, tanggal: geser(s.misi.tanggal) },
            latihan: { ...s.latihan, tanggal: geser(s.latihan.tanggal) },
            harian: { ...s.harian, tanggal: geser(s.harian.tanggal) ?? hi },
            pekanDiklaim: geser(s.pekanDiklaim),
            waktu: { ...s.waktu, tanggal: geser(s.waktu.tanggal) ?? hi, detikHariIni: 0 },
          }
        }
      }
    })
  }, [])

  const reset = useCallback(() => {
    hapusSemua()
    setP({ ...structuredClone(PROGRES_AWAL), harian: harianBaru(), waktu: { tanggal: hariIni(), detikHariIni: 0, totalDetik: 0 } })
  }, [])

  const nilai = useMemo<Aksi>(() => {
    const hi = hariIni()
    const st = p.streak
    // api tetap terlihat bila kemarin belajar, atau bila terlewat 1 hari tapi masih bisa dijaga Nuri
    const bisaDijaga = !!st.terakhir && selisihHari(st.terakhir, hi) === 2 && (!st.jagaTerakhir || selisihHari(st.jagaTerakhir, hi) >= 7)
    const streakAktif = st.terakhir === hi || st.terakhir === kemarin() || bisaDijaga ? st.jumlah : 0
    const totalBintang = Object.values(p.bintang).reduce((a, b) => a + b, 0)
    const detikHariIni = p.waktu.tanggal === hi ? p.waktu.detikHariIni : 0
    const stageTerbuka = (stageId: string) => {
      if (p.modeDemo) return true
      const s = stageById(stageId)
      if (s.nomor === 1) {
        if (s.pulau === 1) return true
        return STAGES.filter((x) => x.pulau === s.pulau - 1).every((x) => (p.bintang[x.id] ?? 0) > 0)
      }
      const sebelum = STAGES.find((x) => x.pulau === s.pulau && x.nomor === s.nomor - 1)!
      return (p.bintang[sebelum.id] ?? 0) > 0
    }
    const pulauSelesai = (id: number) => STAGES.filter((x) => x.pulau === id).every((x) => (p.bintang[x.id] ?? 0) > 0)
    const pulauTerbuka = (id: number) => p.modeDemo || id === 1 || pulauSelesai(id - 1)
    const level = levelDariXp(p.xp)
    const pekan = Array.from({ length: 7 }, (_, i) => hariLalu(i))
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
      setNama,
      tandaiTamat,
      catatLatihan,
      tandaiAyat,
      klaim,
      klaimStreak,
      beliDekorasi,
      pasangDekorasi,
      setAvatar,
      setNamaPeliharaan,
      kirimApresiasi,
      bacaApresiasi,
      selesaiEvent,
      klaimPekan,
      setTampilan,
      reset,
      uji,
      streakAktif,
      totalBintang,
      misiHariIniSelesai: p.misi.tanggal === hi,
      detikHariIni,
      batasTercapai: detikHariIni >= p.batasMenit * 60,
      stageTerbuka,
      pulauTerbuka,
      semuaTamat: STAGES.every((x) => (p.bintang[x.id] ?? 0) > 0),
      latihanTersedia: Object.values(p.bintang).some((b) => b > 0),
      latihanHariIniSelesai: p.latihan.tanggal === hi,
      harian: harianKini(p),
      level,
      xpLevelIni: xpUntukLevel(level),
      xpLevelBerikut: xpUntukLevel(level + 1),
      apresiasiBaru: p.apresiasi.find((a) => !a.dibaca) ?? null,
      hariAktifPekanIni: pekan.filter((t) => (p.aktif[t] ?? 0) > 0 || p.streak.terakhir === t).length,
    }
  }, [p, mulai, selesaiStage, tandaiBelajar, pakai, selesaiMisi, tambahWaktu, setBatas, setEfek, setDemo, setNama, tandaiTamat, catatLatihan, tandaiAyat, klaim, klaimStreak, beliDekorasi, pasangDekorasi, setAvatar, setNamaPeliharaan, kirimApresiasi, bacaApresiasi, selesaiEvent, klaimPekan, setTampilan, reset, uji])

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>
}

export function useProgres() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useProgres harus di dalam ProgresProvider')
  return c
}

export { DEKORASI }

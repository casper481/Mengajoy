/**
 * Penyimpanan progres di localStorage.
 * Semua akses dibungkus try/catch: kalau browser memblokir penyimpanan
 * (mode privat, dsb.), app tetap jalan — hanya progres tidak tersimpan.
 */
import type { Slot } from '../data/hadiah'
import { AVATAR_AWAL, type DataAvatar } from '../data/dunia'
import { hariIni } from './tanggal'

const KUNCI = 'mengajoy:v1'

export type Progres = {
  sudahMulai: boolean
  bintang: Record<string, number> // id stage → 1..3
  hadiah: string[] // id hadiah yang sudah didapat
  dipakai: Partial<Record<Slot, string>> // aksesoris yang sedang dipakai Nuri
  streak: { jumlah: number; terakhir: string | null; terbaik: number; jagaTerakhir: string | null; diklaim: number[] }
  misi: { tanggal: string | null; total: number }
  waktu: { tanggal: string; detikHariIni: number; totalDetik: number }
  batasMenit: 15 | 30 | 45
  efekSuara: boolean
  namaAnak: string // untuk sertifikat
  tamatDilihat: boolean // layar perayaan tamat sudah pernah tampil
  latihan: { tanggal: string | null; total: number } // latihan harian
  statistik: Record<string, { b: number; s: number }> // hasil latihan per bacaan: benar / salah
  surat: Record<string, number[]> // nomor surat → daftar ayat yang sudah lancar dibaca
  // ===== Dunia Mengajoy =====
  koin: number
  xp: number
  harian: Harian // catatan belajar hari ini (untuk misi harian)
  avatar: DataAvatar
  avatarDibuat: boolean
  namaPeliharaan: string
  dekorasi: { dimiliki: string[]; slot: Record<string, string> }
  gelar: string | null
  apresiasi: { stiker: string; pesan: string; tanggal: string; dibaca: boolean }[]
  aktif: Record<string, number> // tanggal → detik belajar (30 hari terakhir)
  keluarga: number // aktivitas yang dikonfirmasi orang tua
  pekanDiklaim: string | null // tanggal Minggu saat peti pekan diklaim
  tampilan: 'otomatis' | '3d' | '2d' // peta utama: dunia 3D atau peta 2D
}

export type Harian = {
  tanggal: string
  stage: number
  bintang: number
  bintang3: number
  latihan: number
  ayat: number
  dunia: boolean
  event: boolean
  diklaim: string[] // id misi/event yang hadiahnya sudah diambil
}

export const harianBaru = (): Harian => ({ tanggal: hariIni(), stage: 0, bintang: 0, bintang3: 0, latihan: 0, ayat: 0, dunia: false, event: false, diklaim: [] })

export const PROGRES_AWAL: Progres = {
  sudahMulai: false,
  bintang: {},
  hadiah: [],
  dipakai: {},
  streak: { jumlah: 0, terakhir: null, terbaik: 0, jagaTerakhir: null, diklaim: [] },
  misi: { tanggal: null, total: 0 },
  waktu: { tanggal: hariIni(), detikHariIni: 0, totalDetik: 0 },
  batasMenit: 30,
  efekSuara: true,
  namaAnak: '',
  tamatDilihat: false,
  latihan: { tanggal: null, total: 0 },
  statistik: {},
  surat: {},
  koin: 0,
  xp: 0,
  harian: harianBaru(),
  avatar: AVATAR_AWAL,
  avatarDibuat: false,
  namaPeliharaan: 'Momo',
  dekorasi: { dimiliki: ['rumah-kayu', 'pohon-bulat'], slot: { rumah: 'rumah-kayu', pohon1: 'pohon-bulat' } },
  gelar: null,
  apresiasi: [],
  aktif: {},
  keluarga: 0,
  pekanDiklaim: null,
  tampilan: 'otomatis',
}

export function muat(): Progres {
  try {
    const teks = localStorage.getItem(KUNCI)
    if (!teks) return structuredClone(PROGRES_AWAL)
    const data = JSON.parse(teks) as Partial<Progres>
    delete (data as Record<string, unknown>).modeDemo // jalan pintas uji coba sudah dihapus
    return {
      ...structuredClone(PROGRES_AWAL),
      ...data,
      streak: { ...PROGRES_AWAL.streak, ...data.streak },
      misi: { ...PROGRES_AWAL.misi, ...data.misi },
      waktu: { ...PROGRES_AWAL.waktu, ...data.waktu },
      latihan: { ...PROGRES_AWAL.latihan, ...data.latihan },
      statistik: { ...data.statistik },
      surat: { ...data.surat },
      avatar: { ...AVATAR_AWAL, ...data.avatar },
      dekorasi: { ...PROGRES_AWAL.dekorasi, ...data.dekorasi },
      harian: { ...harianBaru(), ...data.harian },
      aktif: { ...data.aktif },
    }
  } catch {
    return structuredClone(PROGRES_AWAL)
  }
}

export function simpan(p: Progres): void {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(p))
  } catch {
    /* penyimpanan tidak tersedia — abaikan */
  }
}

export function hapusSemua(): void {
  try {
    localStorage.removeItem(KUNCI)
  } catch {
    /* abaikan */
  }
}

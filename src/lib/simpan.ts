/**
 * Penyimpanan progres di localStorage.
 * Semua akses dibungkus try/catch: kalau browser memblokir penyimpanan
 * (mode privat, dsb.), app tetap jalan — hanya progres tidak tersimpan.
 */
import type { Slot } from '../data/hadiah'
import { hariIni } from './tanggal'

const KUNCI = 'mengajoy:v1'

export type Progres = {
  sudahMulai: boolean
  bintang: Record<string, number> // id stage → 1..3
  hadiah: string[] // id hadiah yang sudah didapat
  dipakai: Partial<Record<Slot, string>> // aksesoris yang sedang dipakai Nuri
  streak: { jumlah: number; terakhir: string | null }
  misi: { tanggal: string | null; total: number }
  waktu: { tanggal: string; detikHariIni: number; totalDetik: number }
  batasMenit: 15 | 30 | 45
  efekSuara: boolean
  modeDemo: boolean // buka semua stage (untuk mencoba / ustaz memeriksa)
  namaAnak: string // untuk sertifikat
  tamatDilihat: boolean // layar perayaan tamat sudah pernah tampil
  latihan: { tanggal: string | null; total: number } // latihan harian
  statistik: Record<string, { b: number; s: number }> // hasil latihan per bacaan: benar / salah
}

export const PROGRES_AWAL: Progres = {
  sudahMulai: false,
  bintang: {},
  hadiah: [],
  dipakai: {},
  streak: { jumlah: 0, terakhir: null },
  misi: { tanggal: null, total: 0 },
  waktu: { tanggal: hariIni(), detikHariIni: 0, totalDetik: 0 },
  batasMenit: 30,
  efekSuara: true,
  modeDemo: false,
  namaAnak: '',
  tamatDilihat: false,
  latihan: { tanggal: null, total: 0 },
  statistik: {},
}

export function muat(): Progres {
  try {
    const teks = localStorage.getItem(KUNCI)
    if (!teks) return structuredClone(PROGRES_AWAL)
    const data = JSON.parse(teks) as Partial<Progres>
    return {
      ...structuredClone(PROGRES_AWAL),
      ...data,
      streak: { ...PROGRES_AWAL.streak, ...data.streak },
      misi: { ...PROGRES_AWAL.misi, ...data.misi },
      waktu: { ...PROGRES_AWAL.waktu, ...data.waktu },
      latihan: { ...PROGRES_AWAL.latihan, ...data.latihan },
      statistik: { ...data.statistik },
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

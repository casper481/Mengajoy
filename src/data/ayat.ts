/**
 * ============================================================
 *  LEVEL 6 — MEMBACA AYAT
 * ============================================================
 *  TEKS AYAT SENGAJA MASIH KOSONG.
 *
 *  Teks WAJIB diambil dari Mushaf Standar Indonesia yang sudah
 *  ditashih Lajnah Pentashihan Mushaf Al-Qur'an (LPMQ) Kemenag,
 *  dan app perlu melalui proses pentashihan sebelum terbit.
 *  JANGAN mengetik teks ayat dari ingatan atau menyalin dari
 *  sumber yang tidak resmi.
 *
 *  Cara mengisi (setelah teks resmi didapat):
 *  1. Isi BASMALAH (dipakai sebagai pembuka surat selain Al-Fatihah).
 *  2. Tambahkan setiap ayat ke TEKS_AYAT, dipecah per kata, contoh bentuk:
 *     {
 *       surah: 112, ayat: 1,
 *       kata: [ { arab: '…', latin: '…', audio: '112-1-1' }, … ],
 *       audioAyat: '112-1',
 *     }
 *  3. Audio (qari berizin):
 *     - per ayat : /public/audio/ayat/<audioAyat>.mp3   (contoh 112-1.mp3)
 *     - per kata : /public/audio/kata/<audio>.mp3       (contoh 112-1-1.mp3)
 *  Surat otomatis terbuka di app begitu SEMUA ayatnya sudah diisi.
 * ============================================================
 */
import { CONTOH_UJI } from './contoh-uji'

export type KataAyat = { arab: string; latin: string; audio?: string }
export type Ayat = { surah: number; ayat: number; kata: KataAyat[]; audioAyat?: string }

/** Urutan surat yang direncanakan (dari yang terpendek, seperti di TPQ). */
export const SURAH_RENCANA: { nomor: number; nama: string; arti: string; jumlahAyat: number }[] = [
  { nomor: 1, nama: 'Al-Fatihah', arti: 'Pembukaan', jumlahAyat: 7 },
  { nomor: 112, nama: 'Al-Ikhlas', arti: 'Ikhlas', jumlahAyat: 4 },
  { nomor: 113, nama: 'Al-Falaq', arti: 'Waktu Subuh', jumlahAyat: 5 },
  { nomor: 114, nama: 'An-Nas', arti: 'Manusia', jumlahAyat: 6 },
  { nomor: 108, nama: 'Al-Kautsar', arti: 'Nikmat yang Banyak', jumlahAyat: 3 },
  { nomor: 110, nama: 'An-Nasr', arti: 'Pertolongan', jumlahAyat: 3 },
  { nomor: 111, nama: 'Al-Lahab', arti: 'Gejolak Api', jumlahAyat: 5 },
  { nomor: 109, nama: 'Al-Kafirun', arti: 'Orang-orang Kafir', jumlahAyat: 6 },
  { nomor: 103, nama: "Al-'Ashr", arti: 'Masa', jumlahAyat: 3 },
]

/** Basmalah pembuka surat. KOSONG sampai teks resmi tersedia. */
export const BASMALAH: KataAyat[] = []

/** Teks ayat. KOSONG sampai teks Mushaf Standar Indonesia (tashih LPMQ) tersedia. */
export const TEKS_AYAT: Ayat[] = []

// Hanya untuk uji coba tampilan di komputer pengembang (tidak pernah ikut ke app yang dirilis).
const SEMUA_AYAT: Ayat[] = TEKS_AYAT.length ? TEKS_AYAT : CONTOH_UJI.ayat
const PEMBUKA: KataAyat[] = BASMALAH.length ? BASMALAH : CONTOH_UJI.pembuka

export const ayatSurah = (nomor: number) => SEMUA_AYAT.filter((a) => a.surah === nomor).sort((a, b) => a.ayat - b.ayat)

export const pembukaSurah = (nomor: number) => (nomor === 1 || nomor === 9 ? [] : PEMBUKA)

/** Surat terbuka hanya jika jumlah ayat di data sama dengan jumlah ayat surat. */
export const suratSiap = (nomor: number) => {
  const r = SURAH_RENCANA.find((s) => s.nomor === nomor)
  return !!r && ayatSurah(nomor).length === r.jumlahAyat
}

export const audioAyat = (id: string) => `/audio/ayat/${id}.mp3`
export const audioKata = (id: string) => `/audio/kata/${id}.mp3`

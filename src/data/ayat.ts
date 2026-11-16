/**
 * ============================================================
 *  LEVEL 6 — MEMBACA AYAT (MENUNGGU TEKS RESMI)
 * ============================================================
 *  File ini SENGAJA belum berisi teks ayat.
 *
 *  Teks ayat WAJIB diambil dari Mushaf Standar Indonesia yang
 *  sudah ditashih Lajnah Pentashihan Mushaf Al-Qur'an (LPMQ)
 *  Kemenag, dan app perlu melalui proses pentashihan sebelum terbit.
 *  Jangan mengetik atau menyalin teks ayat dari sumber lain.
 *
 *  Setelah teks resmi didapat, isi AYAT dengan format:
 *  {
 *    surah: 112,                 // nomor surat
 *    ayat: 1,                    // nomor ayat
 *    kata: [                     // dipecah per kata
 *      { arab: '…', latin: '…', audio: '112-1-1' },
 *    ],
 *    audioAyat: '112-1',         // /public/audio/ayat/112-1.mp3 (qari berizin)
 *  }
 * ============================================================
 */

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

/** KOSONG sampai teks Mushaf Standar Indonesia (tashih LPMQ) tersedia. */
export const AYAT: Ayat[] = []

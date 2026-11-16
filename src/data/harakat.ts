/**
 * ============================================================
 *  DATA HARAKAT — MOHON DIPERIKSA USTAZ
 * ============================================================
 *  - HARAKAT        : tiga harakat dasar beserta tandanya
 *  - SUKU_KATA      : daftar huruf + harakat yang dipakai di app
 *    • id    → nama file audio: /public/audio/harakat/<id>.mp3
 *    • arab  → huruf yang sudah diberi harakat
 *    • latin → cara baca yang ditampilkan ke anak
 * ============================================================
 */

export type HarakatId = 'fathah' | 'kasrah' | 'dhammah'

export type Harakat = {
  id: HarakatId
  nama: string
  tanda: string // karakter harakat (tanpa huruf)
  bunyi: string // vokal yang dihasilkan
  posisi: string // penjelasan sederhana untuk anak
  warna: string // warna penanda di layar
}

export const HARAKAT: Harakat[] = [
  { id: 'fathah',  nama: 'Fathah',  tanda: 'َ', bunyi: 'A', posisi: 'Garis kecil di ATAS huruf, bunyinya "a"',   warna: '#ff7a59' },
  { id: 'kasrah',  nama: 'Kasrah',  tanda: 'ِ', bunyi: 'I', posisi: 'Garis kecil di BAWAH huruf, bunyinya "i"',  warna: '#4cb8e8' },
  { id: 'dhammah', nama: 'Dhammah', tanda: 'ُ', bunyi: 'U', posisi: 'Seperti angka 9 kecil di ATAS, bunyinya "u"', warna: '#7bc67b' },
]

export const harakatById = (id: HarakatId) => HARAKAT.find((h) => h.id === id)!

/** Huruf yang dipakai untuk latihan harakat, beserta bunyi konsonannya. */
const DASAR: { huruf: string; arab: string; konsonan: string }[] = [
  { huruf: 'ba',  arab: 'ب', konsonan: 'b' },
  { huruf: 'ta',  arab: 'ت', konsonan: 't' },
  { huruf: 'tsa', arab: 'ث', konsonan: 'ts' },
  { huruf: 'jim', arab: 'ج', konsonan: 'j' },
  { huruf: 'dal', arab: 'د', konsonan: 'd' },
  { huruf: 'ro',  arab: 'ر', konsonan: 'r' },
  { huruf: 'kaf', arab: 'ك', konsonan: 'k' },
]

export type SukuKata = {
  id: string // contoh: "ba-fathah"
  huruf: string // id huruf, contoh: "ba"
  hurufArab: string
  harakat: HarakatId
  arab: string // contoh: "بَ"
  latin: string // contoh: "ba"
}

export const SUKU_KATA: SukuKata[] = DASAR.flatMap((d) =>
  HARAKAT.map((h) => ({
    id: `${d.huruf}-${h.id}`,
    huruf: d.huruf,
    hurufArab: d.arab,
    harakat: h.id,
    arab: d.arab + h.tanda,
    latin: d.konsonan + h.bunyi.toLowerCase(),
  })),
)

export const sukuKata = (huruf: string, harakat: HarakatId) =>
  SUKU_KATA.find((s) => s.huruf === huruf && s.harakat === harakat)!

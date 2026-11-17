/**
 * ============================================================
 *  DUNIA MENGAJOY — aturan hadiah, level, peliharaan, koleksi
 * ============================================================
 *  Prinsip: semua hadiah HANYA didapat dari belajar.
 *  Tidak ada pembelian, iklan, atau hitung mundur yang memaksa.
 *  Kartu Ilmu (KARTU_ILMU) mohon diperiksa ustaz.
 * ============================================================
 */

/* ---------- Koin & XP yang didapat dari belajar ---------- */
export const HADIAH_BELAJAR = {
  bintang: { koin: 10, xp: 10 }, // per bintang di sebuah stage
  latihan: { koin: 10, xp: 15 }, // satu Latihan Harian
  ayat: { koin: 5, xp: 5 }, // satu ayat lancar (dikonfirmasi orang tua)
  misiDunia: { koin: 10, xp: 10 }, // misi dunia nyata
  apresiasi: { koin: 20, xp: 0 }, // apresiasi dari orang tua
}

/* ---------- Level anak ---------- */
/** XP minimal untuk mencapai level L (level 1 = 0 XP). */
export const xpUntukLevel = (L: number) => 50 * (L - 1) * (L - 1)
export const levelDariXp = (xp: number) => Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1

/* ---------- Peliharaan (Momo) ---------- */
export const TAHAP_PELIHARAAN = [
  { xp: 0, nama: 'Telur Ajaib', pesan: 'Telurnya bergoyang! Terus belajar supaya menetas.' },
  { xp: 30, nama: 'Baru Menetas', pesan: 'Momo menetas! Dia senang sekali bertemu kamu.' },
  { xp: 150, nama: 'Momo Kecil', pesan: 'Momo tumbuh karena kamu rajin belajar.' },
  { xp: 450, nama: 'Momo Remaja', pesan: 'Lihat, Momo punya bintang di dahinya!' },
  { xp: 1000, nama: 'Momo Bersayap', pesan: 'MasyaAllah! Momo sekarang punya sayap!' },
]
export const tahapPeliharaan = (xp: number) => TAHAP_PELIHARAAN.reduce((t, x, i) => (xp >= x.xp ? i : t), 0)

/* ---------- Pulau Rumahku: tempat dekorasi ---------- */
export type JenisSlot = 'rumah' | 'pohon' | 'taman' | 'kolam' | 'mainan' | 'lampu'

export const SLOT_RUMAH: { id: string; jenis: JenisSlot; x: number; y: number; level: number; label: string }[] = [
  { id: 'rumah', jenis: 'rumah', x: 140, y: 200, level: 1, label: 'Rumah' },
  { id: 'pohon1', jenis: 'pohon', x: 58, y: 222, level: 1, label: 'Pohon' },
  { id: 'taman', jenis: 'taman', x: 322, y: 262, level: 2, label: 'Taman' },
  { id: 'pohon2', jenis: 'pohon', x: 300, y: 196, level: 2, label: 'Pohon' },
  { id: 'kolam', jenis: 'kolam', x: 92, y: 312, level: 3, label: 'Kolam' },
  { id: 'mainan', jenis: 'mainan', x: 340, y: 330, level: 4, label: 'Tempat bermain' },
  { id: 'lampu', jenis: 'lampu', x: 214, y: 352, level: 5, label: 'Lampu' },
]

export type Dekorasi = { id: string; nama: string; jenis: JenisSlot; harga: number; gratis?: boolean }

export const DEKORASI: Dekorasi[] = [
  { id: 'rumah-kayu', nama: 'Rumah Kayu', jenis: 'rumah', harga: 0, gratis: true },
  { id: 'rumah-jamur', nama: 'Rumah Jamur', jenis: 'rumah', harga: 120 },
  { id: 'rumah-kubah', nama: 'Mushola Mungil', jenis: 'rumah', harga: 250 },
  { id: 'pohon-bulat', nama: 'Pohon Rindang', jenis: 'pohon', harga: 0, gratis: true },
  { id: 'pohon-kelapa', nama: 'Pohon Kelapa', jenis: 'pohon', harga: 40 },
  { id: 'pohon-sakura', nama: 'Pohon Bunga', jenis: 'pohon', harga: 60 },
  { id: 'pohon-jeruk', nama: 'Pohon Jeruk', jenis: 'pohon', harga: 80 },
  { id: 'bunga-warna', nama: 'Kebun Bunga', jenis: 'taman', harga: 30 },
  { id: 'bunga-pelangi', nama: 'Bunga Pelangi', jenis: 'taman', harga: 70 },
  { id: 'kolam-ikan', nama: 'Kolam Ikan', jenis: 'kolam', harga: 90 },
  { id: 'air-mancur', nama: 'Air Mancur', jenis: 'kolam', harga: 150 },
  { id: 'ayunan', nama: 'Ayunan', jenis: 'mainan', harga: 100 },
  { id: 'perosotan', nama: 'Perosotan', jenis: 'mainan', harga: 140 },
  { id: 'lentera', nama: 'Lentera', jenis: 'lampu', harga: 60 },
  { id: 'lampu-bintang', nama: 'Lampu Bintang', jenis: 'lampu', harga: 110 },
]
export const dekorasiById = (id: string) => DEKORASI.find((d) => d.id === id)

/* ---------- Avatar anak ---------- */
export const AVATAR = {
  kulit: ['#ffe0c7', '#f5c49c', '#d9a074', '#a86f47'],
  rambut: ['pendek', 'poni', 'kuncir', 'keriting'] as const,
  warnaRambut: ['#2b2b3a', '#6b3f22', '#a8662f'],
  kepala: ['tanpa', 'peci', 'hijab'] as const,
  warnaKepala: ['#ffffff', '#4cb8e8', '#ff8fab', '#9b8cf2', '#5cc96b', '#2b2b3a'],
  baju: ['#4cb8e8', '#ff8a5b', '#5cc96b', '#9b8cf2', '#ff8fab', '#ffd166'],
}
export type DataAvatar = {
  kulit: number
  rambut: (typeof AVATAR.rambut)[number]
  warnaRambut: number
  kepala: (typeof AVATAR.kepala)[number]
  warnaKepala: number
  baju: number
}
export const AVATAR_AWAL: DataAvatar = { kulit: 1, rambut: 'pendek', warnaRambut: 0, kepala: 'tanpa', warnaKepala: 0, baju: 0 }

/* ---------- Hadiah streak (tidak ada hukuman bila absen) ---------- */
export const HADIAH_STREAK: { hari: number; judul: string; ikon: string; koin?: number; dekorasi?: string; gelar?: string }[] = [
  { hari: 1, judul: '10 koin', ikon: '🪙', koin: 10 },
  { hari: 3, judul: 'Lentera untuk pulaumu', ikon: '🏮', dekorasi: 'lentera' },
  { hari: 7, judul: 'Peti hadiah: 100 koin + Air Mancur', ikon: '🎁', koin: 100, dekorasi: 'air-mancur' },
  { hari: 14, judul: 'Gelar "Pejuang Iqra"', ikon: '🏅', gelar: 'Pejuang Iqra' },
  { hari: 30, judul: 'Gelar "Sahabat Al-Quran" + 300 koin', ikon: '👑', koin: 300, gelar: 'Sahabat Al-Quran' },
]

/* ---------- Kartu Ilmu (terbuka satu per satu setiap naik level) — MOHON DIPERIKSA USTAZ ---------- */
export const KARTU_ILMU: { judul: string; isi: string; ikon: string }[] = [
  { ikon: '📖', judul: 'Iqra!', isi: 'Wahyu pertama yang diturunkan adalah Surat Al-\'Alaq ayat 1–5, dimulai dengan kata "Iqra" yang artinya "Bacalah".' },
  { ikon: '🔤', judul: 'Huruf Hijaiyah', isi: 'Huruf hijaiyah dasar ada 28 huruf, dimulai dari Alif dan diakhiri Ya.' },
  { ikon: '📚', judul: '114 Surat', isi: 'Al-Quran terdiri dari 114 surat. Surat pertama dalam mushaf adalah Al-Fatihah dan yang terakhir An-Nas.' },
  { ikon: '🌙', judul: 'Bulan Al-Quran', isi: 'Al-Quran pertama kali diturunkan pada bulan Ramadan.' },
  { ikon: '⭐', judul: 'Satu Huruf, Sepuluh Kebaikan', isi: 'Setiap huruf Al-Quran yang dibaca bernilai satu kebaikan, dan satu kebaikan dilipatgandakan sepuluh kali (HR. Tirmidzi).' },
  { ikon: '🛡️', judul: "Ta'awudz", isi: "Sebelum membaca Al-Quran, kita membaca ta'awudz: \"A'udzu billahi minasy-syaithanir-rajim\"." },
  { ikon: '🕌', judul: 'Rukun Islam', isi: 'Rukun Islam ada 5: syahadat, shalat, zakat, puasa Ramadan, dan haji bagi yang mampu.' },
  { ikon: '💛', judul: 'Rukun Iman', isi: 'Rukun Iman ada 6: iman kepada Allah, malaikat, kitab-kitab, rasul-rasul, hari akhir, serta qada dan qadar.' },
  { ikon: '🕐', judul: 'Shalat 5 Waktu', isi: 'Shalat wajib ada 5 waktu: Subuh, Zuhur, Asar, Magrib, dan Isya.' },
  { ikon: '🎵', judul: 'Apa itu Tajwid?', isi: 'Tajwid adalah ilmu tentang cara membaca Al-Quran dengan baik dan benar.' },
  { ikon: '🤲', judul: 'Bismillah', isi: 'Biasakan membaca "Bismillah" sebelum memulai sesuatu yang baik, termasuk sebelum belajar.' },
  { ikon: '🌟', judul: 'Rajin Itu Indah', isi: 'Amalan yang paling disukai Allah adalah yang dilakukan terus-menerus walaupun sedikit (HR. Bukhari dan Muslim).' },
]

/* ---------- Event mingguan (tidak wajib) ---------- */
export type JenisEvent = 'huruf' | 'suara' | 'puzzle' | 'hafalan' | 'jumat' | 'ujian' | 'pekan'
export const EVENT_MINGGUAN: Record<number, { jenis: JenisEvent; hari: string; judul: string; ikon: string; deskripsi: string; koin: number }> = {
  1: { jenis: 'huruf', hari: 'Senin', judul: 'Tantangan Huruf', ikon: '🔤', deskripsi: 'Ulang huruf-huruf yang sudah kamu kenal.', koin: 30 },
  2: { jenis: 'suara', hari: 'Selasa', judul: 'Tebak Bacaan', ikon: '👂', deskripsi: 'Dengar dan baca, lalu pilih tulisan yang benar.', koin: 30 },
  3: { jenis: 'puzzle', hari: 'Rabu', judul: 'Puzzle Hijaiyah', ikon: '🧩', deskripsi: 'Cocokkan kartu huruf dengan namanya.', koin: 30 },
  4: { jenis: 'hafalan', hari: 'Kamis', judul: 'Tantangan Bacaan', ikon: '📖', deskripsi: 'Ulang materi lanjutan atau baca satu ayat.', koin: 30 },
  5: { jenis: 'jumat', hari: 'Jumat', judul: 'Misi Spesial Jumat', ikon: '🕌', deskripsi: 'Baca shalawat dan satu surat pendek bersama keluarga.', koin: 40 },
  6: { jenis: 'ujian', hari: 'Sabtu', judul: 'Ujian Petualangan', ikon: '🏆', deskripsi: '10 soal campuran dari semua yang sudah kamu pelajari.', koin: 50 },
  0: { jenis: 'pekan', hari: 'Minggu', judul: 'Hadiah Pekan Ini', ikon: '🎁', deskripsi: 'Belajar minimal 3 hari minggu ini? Buka peti hadiahmu!', koin: 60 },
}

/* ---------- Stiker apresiasi dari orang tua ---------- */
export const STIKER_APRESIASI = ['🌟', '💖', '🏆', '👏', '🌈', '🤗']
export const PESAN_APRESIASI = [
  'MasyaAllah, Ayah/Bunda bangga sama kamu!',
  'Terima kasih sudah rajin belajar mengaji!',
  'Bacaanmu makin lancar, hebat!',
  'Semangat terus ya, sayang!',
]

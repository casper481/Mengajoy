/** Lencana pencapaian. Dihitung langsung dari progres (tidak perlu disimpan terpisah). */
import { STAGES } from '../data/stages'
import { SURAH_RENCANA } from '../data/ayat'
import type { Progres } from './simpan'

const pulauSelesai = (p: Progres, id: number) => STAGES.filter((s) => s.pulau === id).every((s) => (p.bintang[s.id] ?? 0) > 0)
const totalBintang = (p: Progres) => Object.values(p.bintang).reduce((a, b) => a + b, 0)

export const LENCANA: { id: string; nama: string; ikon: string; syarat: string; dapat: (p: Progres) => boolean }[] = [
  { id: 'pertama', nama: 'Langkah Pertama', ikon: '👣', syarat: 'Selesaikan 1 stage', dapat: (p) => Object.keys(p.bintang).length > 0 },
  { id: 'huruf', nama: 'Sahabat Hijaiyah', ikon: '🔤', syarat: 'Tamatkan Pulau Huruf Hijaiyah', dapat: (p) => pulauSelesai(p, 1) },
  { id: 'harakat', nama: 'Ahli Harakat', ikon: '🎵', syarat: 'Tamatkan Pulau Harakat', dapat: (p) => pulauSelesai(p, 2) },
  { id: 'sambung', nama: 'Jago Menyambung', ikon: '🔗', syarat: 'Tamatkan Pulau Menyambung Huruf', dapat: (p) => pulauSelesai(p, 3) },
  { id: 'mad', nama: 'Bacaan Panjang', ikon: '〰️', syarat: 'Tamatkan Pulau Mad & Tasydid', dapat: (p) => pulauSelesai(p, 4) },
  { id: 'tajwid', nama: 'Pemula Tajwid', ikon: '🎓', syarat: 'Tamatkan Pulau Tajwid Dasar', dapat: (p) => pulauSelesai(p, 5) },
  { id: 'bintang50', nama: 'Pengumpul Bintang', ikon: '⭐', syarat: 'Kumpulkan 50 bintang', dapat: (p) => totalBintang(p) >= 50 },
  { id: 'streak3', nama: 'Api Kecil', ikon: '🔥', syarat: 'Belajar 3 hari berturut-turut', dapat: (p) => p.streak.terbaik >= 3 },
  { id: 'streak7', nama: 'Api Semangat', ikon: '🔥', syarat: 'Belajar 7 hari berturut-turut', dapat: (p) => p.streak.terbaik >= 7 },
  { id: 'streak30', nama: 'Api Abadi', ikon: '☄️', syarat: 'Belajar 30 hari berturut-turut', dapat: (p) => p.streak.terbaik >= 30 },
  { id: 'latihan10', nama: 'Rajin Murojaah', ikon: '🔁', syarat: 'Latihan Harian 10 kali', dapat: (p) => p.latihan.total >= 10 },
  { id: 'surat1', nama: 'Pembaca Al-Quran', ikon: '📖', syarat: 'Lancar membaca 1 surat', dapat: (p) => SURAH_RENCANA.some((s) => (p.surat[s.nomor]?.length ?? 0) === s.jumlahAyat) },
  { id: 'keluarga', nama: 'Belajar Bersama Keluarga', ikon: '👨‍👩‍👧', syarat: '5 kegiatan dikonfirmasi Ayah/Bunda', dapat: (p) => p.keluarga >= 5 },
  { id: 'misi7', nama: 'Anak Shalih', ikon: '🤲', syarat: 'Selesaikan 7 misi dunia nyata', dapat: (p) => p.misi.total >= 7 },
  { id: 'dekor', nama: 'Arsitek Cilik', ikon: '🏡', syarat: 'Miliki 6 dekorasi', dapat: (p) => p.dekorasi.dimiliki.length >= 6 },
]

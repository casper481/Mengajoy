/**
 * Misi harian dinamis: 3 misi belajar yang disesuaikan dengan kemajuan anak.
 * Bukan materi acak: misi 1 selalu mengarah ke stage berikutnya yang memang perlu dipelajari.
 */
import { suratSiap, SURAH_RENCANA } from '../data/ayat'
import { STAGES, type Stage } from '../data/stages'
import type { Harian, Progres } from './simpan'
import { nomorHari } from './tanggal'

export type Tujuan = { jenis: 'stage'; pulau: number } | { jenis: 'latihan' } | { jenis: 'quran' } | { jenis: 'peta' }

export type MisiHarian = {
  id: string
  judul: string
  ikon: string
  target: number
  nilai: (h: Harian) => number
  koin: number
  menit: number
  tujuan: Tujuan
}

export const BONUS_SEMUA_MISI = { koin: 50, xp: 30 }

function stageBerikut(p: Progres, terbuka: (id: string) => boolean): Stage | undefined {
  return STAGES.find((s) => !p.bintang[s.id] && terbuka(s.id))
}

export function buatMisiHarian(p: Progres, terbuka: (id: string) => boolean, pulauTerbuka: (id: number) => boolean): MisiHarian[] {
  const berikut = stageBerikut(p, terbuka)
  const adaSelesai = Object.values(p.bintang).some((b) => b > 0)
  const belum3 = STAGES.find((s) => (p.bintang[s.id] ?? 0) > 0 && (p.bintang[s.id] ?? 0) < 3)

  const misi: MisiHarian[] = []

  // 1. Belajar hal baru (mengikuti urutan TPQ)
  if (berikut) {
    misi.push({
      id: 'baru',
      judul: berikut.jenis === 'huruf' ? 'Kenali 4 huruf baru' : `Selesaikan stage "${berikut.jenis === 'umum' || berikut.jenis === 'harakat' ? berikut.judul : ''}"`,
      ikon: '🗺️',
      target: 1,
      nilai: (h) => h.stage,
      koin: 30,
      menit: 5,
      tujuan: { jenis: 'stage', pulau: berikut.pulau },
    })
  } else {
    misi.push({ id: 'baru', judul: 'Dapatkan 3 bintang di satu stage', ikon: '⭐', target: 1, nilai: (h) => h.bintang3, koin: 30, menit: 5, tujuan: { jenis: 'peta' } })
  }

  // 2. Mengulang supaya tidak lupa
  if (adaSelesai) {
    misi.push({ id: 'ulang', judul: 'Selesaikan Latihan Harian', ikon: '🔁', target: 1, nilai: (h) => h.latihan, koin: 20, menit: 2, tujuan: { jenis: 'latihan' } })
  } else {
    misi.push({ id: 'ulang', judul: 'Kumpulkan 2 bintang', ikon: '⭐', target: 2, nilai: (h) => h.bintang, koin: 20, menit: 5, tujuan: { jenis: 'peta' } })
  }

  // 3. Tantangan, bergiliran sesuai kemampuan
  const pilihan: MisiHarian[] = []
  if (belum3)
    pilihan.push({ id: 'tantang', judul: 'Ulangi stage sampai dapat 3 bintang', ikon: '🌟', target: 1, nilai: (h) => h.bintang3, koin: 30, menit: 4, tujuan: { jenis: 'stage', pulau: belum3.pulau } })
  if (pulauTerbuka(6) && SURAH_RENCANA.some((s) => suratSiap(s.nomor)))
    pilihan.push({ id: 'tantang', judul: 'Baca 2 ayat bersama Ayah/Bunda', ikon: '📖', target: 2, nilai: (h) => h.ayat, koin: 30, menit: 4, tujuan: { jenis: 'quran' } })
  pilihan.push({ id: 'tantang', judul: 'Kumpulkan 4 bintang hari ini', ikon: '✨', target: 4, nilai: (h) => h.bintang, koin: 30, menit: 6, tujuan: { jenis: 'peta' } })
  if (adaSelesai)
    pilihan.push({ id: 'tantang', judul: 'Latihan Harian 2 kali', ikon: '💪', target: 2, nilai: (h) => h.latihan, koin: 30, menit: 4, tujuan: { jenis: 'latihan' } })
  misi.push(pilihan[nomorHari() % pilihan.length])

  return misi
}

/** Bentuk data "satu hal yang dipelajari" — bisa huruf atau suku kata berharakat. */
import { HURUF, hurufById } from '../data/huruf'
import { harakatById, SUKU_KATA } from '../data/harakat'
import { audioHuruf, audioSukuKata } from '../lib/audio'
import type { Stage, StageUmum } from '../data/stages'
import { acak } from '../lib/tanggal'

export type Item = {
  id: string
  arab: string
  latin: string
  audio: string // '' = tidak ada audio untuk kartu ini
  petunjuk: string
  keterangan?: string
  bentuk?: { awal: string; tengah: string; akhir: string }
  huruf?: string // untuk suku kata: id huruf
  harakat?: string // untuk suku kata: id harakat
}

export const audioLanjutan = (id: string) => `/audio/lanjutan/${id}.mp3`

export function itemsDariStage(stage: Stage): Item[] {
  if (stage.jenis === 'umum') {
    const m = stage.materi
    return m.kartu.map((k) => ({
      id: k.id,
      arab: k.arab,
      latin: k.latin,
      audio: k.audio ? audioLanjutan(k.id) : '',
      petunjuk: k.petunjuk ?? m.petunjukUmum ?? 'Perhatikan baik-baik, ya.',
      keterangan: k.keterangan,
    }))
  }
  if (stage.jenis === 'huruf') {
    return stage.huruf.map((id) => {
      const h = hurufById(id)
      return {
        id: h.id,
        arab: h.arab,
        latin: h.nama,
        audio: audioHuruf(h.id),
        petunjuk: h.petunjuk,
        bentuk: { awal: h.awal, tengah: h.tengah, akhir: h.akhir },
      }
    })
  }
  return stage.sukuKata.map((id) => {
    const s = SUKU_KATA.find((x) => x.id === id)!
    const hk = harakatById(s.harakat)
    return {
      id: s.id,
      arab: s.arab,
      latin: s.latin,
      audio: audioSukuKata(s.id),
      petunjuk: `Lihat tandanya: ${hk.posisi.charAt(0).toLowerCase()}${hk.posisi.slice(1)}`,
      huruf: s.huruf,
      harakat: s.harakat,
    }
  })
}

export const namaHuruf = (id: string) => HURUF.find((h) => h.id === id)?.nama ?? id

/** Hitung bintang dari jumlah kesalahan (tetap minimal 1 bintang — anak tidak pernah "gagal"). */
export function hitungBintang(salah: number): number {
  if (salah <= 1) return 3
  if (salah <= 4) return 2
  return 1
}

export const PUJIAN = ['Hebat!', 'Pintar!', 'MasyaAllah, keren!', 'Betul sekali!', 'Mantap!', 'Kamu jago!']
export const pujianAcak = () => PUJIAN[Math.floor(Math.random() * PUJIAN.length)]

/** Item untuk Cari Pasangan di stage lanjutan (mode hukum: contoh ↔ nama hukum). */
export function itemsPasangan(stage: StageUmum): Item[] {
  const items = itemsDariStage(stage)
  if (stage.materi.mode === 'baca') return items
  return stage.materi.kartu.map((k, i) => ({ ...items[i], arab: acak(k.contoh ?? [k.arab])[0], audio: '' }))
}

/** Satu soal pilihan ganda. */
export type Soal = {
  tanya: string
  tampil: string
  tampilArab: boolean
  audio: string
  pilihan: string[]
  pilihanArab: boolean
  benar: number
  petunjuk: string
}

/** Buat soal otomatis dari materi stage lanjutan (Level 3–5). */
export function soalDariStage(stage: StageUmum, jumlah = 5): Soal[] {
  const m = stage.materi
  const items = itemsDariStage(stage)
  const soal: Soal[] = []

  if (m.mode === 'baca') {
    acak(items).forEach((it, i) => {
      const lain = acak(items.filter((x) => x.id !== it.id)).slice(0, 2)
      if (i % 2 === 0) {
        // Arab → cara baca
        const pilihan = acak([it, ...lain])
        soal.push({
          tanya: 'Bagaimana cara membacanya?',
          tampil: it.arab,
          tampilArab: true,
          audio: '',
          pilihan: pilihan.map((x) => x.latin),
          pilihanArab: false,
          benar: pilihan.indexOf(it),
          petunjuk: it.petunjuk,
        })
      } else {
        // cara baca (dan suara) → tulisan Arab
        const pilihan = acak([it, ...lain])
        soal.push({
          tanya: 'Mana tulisan yang dibaca seperti ini?',
          tampil: it.latin,
          tampilArab: false,
          audio: it.audio,
          pilihan: pilihan.map((x) => x.arab),
          pilihanArab: true,
          benar: pilihan.indexOf(it),
          petunjuk: it.petunjuk,
        })
      }
    })
  } else {
    // mode hukum: tampilkan contoh, anak memilih nama hukumnya
    const nama = m.kartu.map((k) => k.latin)
    const contoh = acak(m.kartu.flatMap((k, i) => (k.contoh ?? []).map((c) => ({ c, i }))))
    // pastikan setiap hukum muncul minimal sekali
    const terpilih = m.kartu.map((_, i) => contoh.find((x) => x.i === i)!).filter(Boolean)
    for (const x of contoh) if (terpilih.length < jumlah && !terpilih.includes(x)) terpilih.push(x)
    for (const x of acak(terpilih)) {
      const k = m.kartu[x.i]
      soal.push({
        tanya: 'Ini hukum bacaan apa?',
        tampil: x.c,
        tampilArab: true,
        audio: '',
        pilihan: nama,
        pilihanArab: false,
        benar: x.i,
        petunjuk: k.petunjuk ?? k.keterangan ?? '',
      })
    }
  }

  const utama = soal.slice(0, jumlah - (m.soalTambahan?.length ?? 0))
  const tambahan: Soal[] = (m.soalTambahan ?? []).map((t) => ({
    tanya: t.tanya,
    tampil: t.tampil,
    tampilArab: true,
    audio: '',
    pilihan: t.pilihan,
    pilihanArab: false,
    benar: t.benar,
    petunjuk: t.petunjuk,
  }))
  return acak([...utama, ...tambahan])
}

/** Ukuran huruf Arab menyesuaikan panjang tulisan. */
export function ukuranArab(teks: string, besar: 'kartu' | 'pilihan' | 'kecil' = 'kartu'): string {
  const n = teks.replace(/[\u064B-\u0652\s]/g, '').length
  if (besar === 'kartu') return n <= 1 ? 'text-[min(7rem,15dvh)]' : n <= 3 ? 'text-7xl' : n <= 6 ? 'text-6xl' : 'text-4xl'
  if (besar === 'pilihan') return n <= 1 ? 'text-7xl' : n <= 3 ? 'text-5xl' : 'text-4xl'
  return n <= 1 ? 'text-5xl' : n <= 3 ? 'text-4xl' : 'text-3xl'
}

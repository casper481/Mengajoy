/** Bentuk data "satu hal yang dipelajari" — bisa huruf atau suku kata berharakat. */
import { HURUF, hurufById } from '../data/huruf'
import { harakatById, SUKU_KATA } from '../data/harakat'
import { audioHuruf, audioSukuKata } from '../lib/audio'
import type { Stage } from '../data/stages'

export type Item = {
  id: string
  arab: string
  latin: string
  audio: string
  petunjuk: string
  bentuk?: { awal: string; tengah: string; akhir: string }
  huruf?: string // untuk suku kata: id huruf
  harakat?: string // untuk suku kata: id harakat
}

export function itemsDariStage(stage: Stage): Item[] {
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

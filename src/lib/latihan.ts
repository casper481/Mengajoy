/**
 * Latihan Harian (murojaah): mengulang bacaan dari stage yang sudah selesai.
 * Bacaan yang sering salah muncul lebih sering; yang sudah lancar lebih jarang.
 */
import { itemsDariStage, type Item, type Soal } from '../activities/tipe'
import { STAGES, type Stage } from '../data/stages'
import { acak } from './tanggal'

export type SoalLatihan = Soal & { kunci: string }

type Entri = { kunci: string; label: string; buat: () => Soal }

function entriStage(stage: Stage): Entri[] {
  // Mode hukum tajwid: contoh → nama hukum
  if (stage.jenis === 'umum' && stage.materi.mode === 'hukum') {
    const kartu = stage.materi.kartu
    return kartu.map((k, i) => ({
      kunci: k.id,
      label: k.latin,
      buat: () => ({
        tanya: 'Ini hukum bacaan apa?',
        tampil: acak(k.contoh ?? [k.arab])[0],
        tampilArab: true,
        audio: '',
        pilihan: kartu.map((x) => x.latin),
        pilihanArab: false,
        benar: i,
        petunjuk: k.petunjuk ?? k.keterangan ?? '',
      }),
    }))
  }
  // Huruf, harakat, dan kata latihan: dengar/baca → pilih tulisan yang benar
  const items = itemsDariStage(stage)
  return items.map((it: Item) => ({
    kunci: it.id,
    label: `${it.latin} ${it.arab}`,
    buat: () => {
      const pilihan = acak([it, ...acak(items.filter((x) => x.id !== it.id)).slice(0, 2)])
      return {
        tanya: 'Mana tulisan yang dibaca seperti ini?',
        tampil: it.latin,
        tampilArab: false,
        audio: it.audio,
        pilihan: pilihan.map((x) => x.arab),
        pilihanArab: true,
        benar: pilihan.indexOf(it),
        petunjuk: it.petunjuk,
      }
    },
  }))
}

const SEMUA_ENTRI: Entri[] = STAGES.flatMap(entriStage)

/** Nama yang mudah dibaca untuk sebuah kunci bacaan (dipakai di Area Orang Tua). */
export const labelKunci = (kunci: string) => SEMUA_ENTRI.find((e) => e.kunci === kunci)?.label ?? kunci

/** Bobot: makin sering salah makin besar; yang sudah sering benar mengecil. */
function bobot(st?: { b: number; s: number }): number {
  if (!st) return 2 // belum pernah dilatih
  return Math.max(0.3, 1 + st.s * 2 - Math.min(st.b, 4) * 0.3)
}

export function buatLatihanHarian(
  bintang: Record<string, number>,
  statistik: Record<string, { b: number; s: number }>,
  jumlah = 6,
  pulau?: number[],
): SoalLatihan[] {
  const selesai = STAGES.filter((s) => (bintang[s.id] ?? 0) > 0)
  const terpilih0 = pulau ? selesai.filter((s) => pulau.includes(s.pulau)) : selesai
  const kumpulan = (terpilih0.length ? terpilih0 : selesai).flatMap(entriStage)
  const sisa = [...kumpulan]
  const terpilih: Entri[] = []
  while (terpilih.length < jumlah && sisa.length) {
    const total = sisa.reduce((a, e) => a + bobot(statistik[e.kunci]), 0)
    let r = Math.random() * total
    const idx = sisa.findIndex((e) => (r -= bobot(statistik[e.kunci])) <= 0)
    terpilih.push(sisa.splice(idx < 0 ? sisa.length - 1 : idx, 1)[0])
  }
  return terpilih.map((e) => ({ ...e.buat(), kunci: e.kunci }))
}

/** Bacaan yang paling perlu diulang (untuk orang tua). */
export function perluDiulang(statistik: Record<string, { b: number; s: number }>, maks = 6) {
  return Object.entries(statistik)
    .filter(([, v]) => v.s > 0)
    .sort((a, b) => b[1].s / (b[1].b + b[1].s) - a[1].s / (a[1].b + a[1].s) || b[1].s - a[1].s)
    .slice(0, maks)
    .map(([k, v]) => ({ kunci: k, label: labelKunci(k), ...v }))
}

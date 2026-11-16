/**
 * Pembagian pulau & stage.
 * Pulau 1: 7 stage × 4 huruf = 28 huruf (urutan mengikuti data huruf.ts)
 * Pulau 2: 4 stage harakat
 * Pulau 3–5: materi di materi-lanjutan.ts
 * Pulau 6: menunggu teks Mushaf Standar Indonesia (lihat ayat.ts)
 */
import { HURUF } from './huruf'
import { SUKU_KATA, type HarakatId } from './harakat'
import { LEVEL_3, LEVEL_4, LEVEL_5, type MateriStage } from './materi-lanjutan'

export type Pulau = {
  id: number
  nama: string
  ikon: string // teks besar di atas pulau
  tersedia: boolean
  warna: string
}

export const PULAU: Pulau[] = [
  { id: 1, nama: 'Pulau Huruf Hijaiyah', ikon: 'ا ب ت', tersedia: true, warna: '#7bd389' },
  { id: 2, nama: 'Pulau Harakat', ikon: 'بَ بِ بُ', tersedia: true, warna: '#ffb562' },
  { id: 3, nama: 'Pulau Menyambung Huruf', ikon: 'كَتَبَ', tersedia: true, warna: '#c3b6f5' },
  { id: 4, nama: 'Pulau Mad & Tasydid', ikon: 'بَا بِيْ', tersedia: true, warna: '#8fd3f4' },
  { id: 5, nama: 'Pulau Tajwid Dasar', ikon: 'نْ + ب', tersedia: true, warna: '#f7a6c4' },
  { id: 6, nama: 'Pulau Al-Quran', ikon: '📖', tersedia: true, warna: '#f5d76e' },
]

export type StageHuruf = {
  id: string
  pulau: 1
  nomor: number
  jenis: 'huruf'
  huruf: string[] // id huruf
  hadiah?: string // id hadiah
}

export type StageHarakat = {
  id: string
  pulau: 2
  nomor: number
  jenis: 'harakat'
  judul: string
  fokus: HarakatId | 'campuran'
  sukuKata: string[] // id suku kata
  hadiah?: string
}

export type StageUmum = {
  id: string
  pulau: 3 | 4 | 5
  nomor: number
  jenis: 'umum'
  judul: string
  materi: MateriStage
  hadiah?: string
}

export type Stage = StageHuruf | StageHarakat | StageUmum

const HADIAH_PULAU_1 = ['peci', 'syal-merah', 'kacamata', 'topi-petualang', 'dasi-kupu', 'mahkota-bunga', 'ransel']
const HADIAH_PULAU_2 = ['syal-pelangi', 'kacamata-hitam', 'topi-bintang', 'lencana']

const stageHuruf: StageHuruf[] = Array.from({ length: 7 }, (_, i) => ({
  id: `h${i + 1}`,
  pulau: 1,
  nomor: i + 1,
  jenis: 'huruf',
  huruf: HURUF.slice(i * 4, i * 4 + 4).map((h) => h.id),
  hadiah: HADIAH_PULAU_1[i],
}))

const pilih = (huruf: string[], harakat: HarakatId[]) =>
  SUKU_KATA.filter((s) => huruf.includes(s.huruf) && harakat.includes(s.harakat)).map((s) => s.id)

const HURUF_HARAKAT = ['ba', 'ta', 'tsa', 'jim']

const stageHarakat: StageHarakat[] = [
  { id: 'k1', pulau: 2, nomor: 1, jenis: 'harakat', judul: 'Fathah', fokus: 'fathah', sukuKata: pilih(HURUF_HARAKAT, ['fathah']), hadiah: HADIAH_PULAU_2[0] },
  { id: 'k2', pulau: 2, nomor: 2, jenis: 'harakat', judul: 'Kasrah', fokus: 'kasrah', sukuKata: pilih(HURUF_HARAKAT, ['kasrah']), hadiah: HADIAH_PULAU_2[1] },
  { id: 'k3', pulau: 2, nomor: 3, jenis: 'harakat', judul: 'Dhammah', fokus: 'dhammah', sukuKata: pilih(HURUF_HARAKAT, ['dhammah']), hadiah: HADIAH_PULAU_2[2] },
  { id: 'k4', pulau: 2, nomor: 4, jenis: 'harakat', judul: 'Campuran', fokus: 'campuran', sukuKata: pilih(['ba', 'dal', 'ro', 'kaf'], ['fathah', 'kasrah', 'dhammah']), hadiah: HADIAH_PULAU_2[3] },
]

// Hadiah untuk stage ke-2 dan ke-4 di setiap pulau lanjutan
const HADIAH_LANJUTAN: Record<number, [string, string]> = {
  3: ['kalung-bunga', 'tas-buku'],
  4: ['kacamata-bintang', 'medali'],
  5: ['mahkota-emas', 'topi-wisuda'],
}

const buatStageUmum = (pulau: 3 | 4 | 5, kode: string, daftar: MateriStage[]): StageUmum[] =>
  daftar.map((m, i) => ({
    id: `${kode}${i + 1}`,
    pulau,
    nomor: i + 1,
    jenis: 'umum',
    judul: m.judul,
    materi: m,
    hadiah: i === 1 ? HADIAH_LANJUTAN[pulau][0] : i === 3 ? HADIAH_LANJUTAN[pulau][1] : undefined,
  }))

export const STAGES: Stage[] = [
  ...stageHuruf,
  ...stageHarakat,
  ...buatStageUmum(3, 's', LEVEL_3),
  ...buatStageUmum(4, 'm', LEVEL_4),
  ...buatStageUmum(5, 't', LEVEL_5),
]

export const stagesOfPulau = (pulau: number) => STAGES.filter((s) => s.pulau === pulau)
export const stageById = (id: string) => STAGES.find((s) => s.id === id)!

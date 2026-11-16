/** Aksesoris Nuri. Setiap stage yang selesai pertama kali memberi 1 hadiah. */
export type Slot = 'kepala' | 'mata' | 'leher' | 'punggung' | 'dada'

export type Hadiah = {
  id: string
  nama: string
  slot: Slot
}

export const HADIAH: Hadiah[] = [
  { id: 'peci', nama: 'Peci Biru', slot: 'kepala' },
  { id: 'syal-merah', nama: 'Syal Merah', slot: 'leher' },
  { id: 'kacamata', nama: 'Kacamata Bulat', slot: 'mata' },
  { id: 'topi-petualang', nama: 'Topi Petualang', slot: 'kepala' },
  { id: 'dasi-kupu', nama: 'Dasi Kupu-kupu', slot: 'leher' },
  { id: 'mahkota-bunga', nama: 'Mahkota Bunga', slot: 'kepala' },
  { id: 'ransel', nama: 'Ransel Kecil', slot: 'punggung' },
  { id: 'syal-pelangi', nama: 'Syal Pelangi', slot: 'leher' },
  { id: 'kacamata-hitam', nama: 'Kacamata Keren', slot: 'mata' },
  { id: 'topi-bintang', nama: 'Topi Bintang', slot: 'kepala' },
  { id: 'lencana', nama: 'Lencana Juara', slot: 'dada' },
]

export const hadiahById = (id: string) => HADIAH.find((h) => h.id === id)!

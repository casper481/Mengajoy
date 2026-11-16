/**
 * ============================================================
 *  DATA 28 HURUF HIJAIYAH — MOHON DIPERIKSA USTAZ
 * ============================================================
 *  Setiap huruf berisi:
 *  - urutan   : nomor urut (1–28)
 *  - id       : nama file audio → /public/audio/huruf/<id>.mp3
 *  - arab     : huruf tunggal (berdiri sendiri)
 *  - nama     : nama latin yang ditampilkan ke anak
 *  - awal / tengah / akhir : bentuk huruf saat disambung
 *               (ـ adalah garis sambung / tatwil)
 *  - petunjuk : kalimat bantuan saat anak salah menebak
 *
 *  Catatan untuk pemeriksa:
 *  - Penulisan nama latin mengikuti kebiasaan TPQ di Indonesia.
 *    Silakan ubah jika di TPQ Anda berbeda (misal "Kho" / "Kha").
 *  - ح ditulis "Ḥa" dan ه ditulis "Ha" agar tidak tertukar.
 *  - Huruf ا د ذ ر ز و tidak bisa disambung ke huruf sesudahnya,
 *    jadi bentuk "awal"-nya sama dengan huruf tunggal.
 *  - Hamzah (ء) dan lam-alif (لا) belum dimasukkan.
 * ============================================================
 */

export type Huruf = {
  urutan: number
  id: string
  arab: string
  nama: string
  awal: string
  tengah: string
  akhir: string
  petunjuk: string
}

export const HURUF: Huruf[] = [
  { urutan: 1,  id: 'alif',  arab: 'ا', nama: 'Alif',  awal: 'ا',  tengah: 'ـا',  akhir: 'ـا', petunjuk: 'Berdiri tegak seperti tongkat' },
  { urutan: 2,  id: 'ba',    arab: 'ب', nama: 'Ba',    awal: 'بـ', tengah: 'ـبـ', akhir: 'ـب', petunjuk: 'Seperti perahu, satu titik di bawah' },
  { urutan: 3,  id: 'ta',    arab: 'ت', nama: 'Ta',    awal: 'تـ', tengah: 'ـتـ', akhir: 'ـت', petunjuk: 'Seperti perahu, dua titik di atas' },
  { urutan: 4,  id: 'tsa',   arab: 'ث', nama: 'Tsa',   awal: 'ثـ', tengah: 'ـثـ', akhir: 'ـث', petunjuk: 'Seperti perahu, tiga titik di atas' },
  { urutan: 5,  id: 'jim',   arab: 'ج', nama: 'Jim',   awal: 'جـ', tengah: 'ـجـ', akhir: 'ـج', petunjuk: 'Ada satu titik di dalam perutnya' },
  { urutan: 6,  id: 'hha',   arab: 'ح', nama: 'Ḥa',    awal: 'حـ', tengah: 'ـحـ', akhir: 'ـح', petunjuk: 'Bentuknya seperti Jim, tapi tanpa titik' },
  { urutan: 7,  id: 'kho',   arab: 'خ', nama: 'Kho',   awal: 'خـ', tengah: 'ـخـ', akhir: 'ـخ', petunjuk: 'Seperti Jim, titiknya di atas kepala' },
  { urutan: 8,  id: 'dal',   arab: 'د', nama: 'Dal',   awal: 'د',  tengah: 'ـد',  akhir: 'ـد', petunjuk: 'Kecil seperti siku, tanpa titik' },
  { urutan: 9,  id: 'dzal',  arab: 'ذ', nama: 'Dzal',  awal: 'ذ',  tengah: 'ـذ',  akhir: 'ـذ', petunjuk: 'Seperti Dal, ada satu titik di atas' },
  { urutan: 10, id: 'ro',    arab: 'ر', nama: 'Ro',    awal: 'ر',  tengah: 'ـر',  akhir: 'ـر', petunjuk: 'Melengkung ke bawah, tanpa titik' },
  { urutan: 11, id: 'za',    arab: 'ز', nama: 'Za',    awal: 'ز',  tengah: 'ـز',  akhir: 'ـز', petunjuk: 'Seperti Ro, ada satu titik di atas' },
  { urutan: 12, id: 'sin',   arab: 'س', nama: 'Sin',   awal: 'سـ', tengah: 'ـسـ', akhir: 'ـس', petunjuk: 'Punya tiga gigi, tanpa titik' },
  { urutan: 13, id: 'syin',  arab: 'ش', nama: 'Syin',  awal: 'شـ', tengah: 'ـشـ', akhir: 'ـش', petunjuk: 'Tiga gigi dan tiga titik di atas' },
  { urutan: 14, id: 'shod',  arab: 'ص', nama: 'Shod',  awal: 'صـ', tengah: 'ـصـ', akhir: 'ـص', petunjuk: 'Seperti telur rebahan, tanpa titik' },
  { urutan: 15, id: 'dhod',  arab: 'ض', nama: 'Dhod',  awal: 'ضـ', tengah: 'ـضـ', akhir: 'ـض', petunjuk: 'Seperti Shod, ada satu titik di atas' },
  { urutan: 16, id: 'tho',   arab: 'ط', nama: 'Tho',   awal: 'طـ', tengah: 'ـطـ', akhir: 'ـط', petunjuk: 'Punya tiang tegak, tanpa titik' },
  { urutan: 17, id: 'zho',   arab: 'ظ', nama: 'Zho',   awal: 'ظـ', tengah: 'ـظـ', akhir: 'ـظ', petunjuk: 'Seperti Tho, ada satu titik' },
  { urutan: 18, id: 'ain',   arab: 'ع', nama: "'Ain",  awal: 'عـ', tengah: 'ـعـ', akhir: 'ـع', petunjuk: 'Seperti mulut terbuka, tanpa titik' },
  { urutan: 19, id: 'ghoin', arab: 'غ', nama: 'Ghoin', awal: 'غـ', tengah: 'ـغـ', akhir: 'ـغ', petunjuk: "Seperti 'Ain, ada satu titik di atas" },
  { urutan: 20, id: 'fa',    arab: 'ف', nama: 'Fa',    awal: 'فـ', tengah: 'ـفـ', akhir: 'ـف', petunjuk: 'Kepala bulat, satu titik di atas' },
  { urutan: 21, id: 'qof',   arab: 'ق', nama: 'Qof',   awal: 'قـ', tengah: 'ـقـ', akhir: 'ـق', petunjuk: 'Kepala bulat, dua titik di atas' },
  { urutan: 22, id: 'kaf',   arab: 'ك', nama: 'Kaf',   awal: 'كـ', tengah: 'ـكـ', akhir: 'ـك', petunjuk: 'Ada tanda kecil berkelok di dalamnya' },
  { urutan: 23, id: 'lam',   arab: 'ل', nama: 'Lam',   awal: 'لـ', tengah: 'ـلـ', akhir: 'ـل', petunjuk: 'Tinggi seperti kail pancing' },
  { urutan: 24, id: 'mim',   arab: 'م', nama: 'Mim',   awal: 'مـ', tengah: 'ـمـ', akhir: 'ـم', petunjuk: 'Kepala bulat kecil, ekornya turun' },
  { urutan: 25, id: 'nun',   arab: 'ن', nama: 'Nun',   awal: 'نـ', tengah: 'ـنـ', akhir: 'ـن', petunjuk: 'Seperti mangkuk, satu titik di atas' },
  { urutan: 26, id: 'wau',   arab: 'و', nama: 'Wau',   awal: 'و',  tengah: 'ـو',  akhir: 'ـو', petunjuk: 'Kepala bulat, ekornya melengkung' },
  { urutan: 27, id: 'ha',    arab: 'ه', nama: 'Ha',    awal: 'هـ', tengah: 'ـهـ', akhir: 'ـه', petunjuk: 'Bulat seperti pita' },
  { urutan: 28, id: 'ya',    arab: 'ي', nama: 'Ya',    awal: 'يـ', tengah: 'ـيـ', akhir: 'ـي', petunjuk: 'Dua titik di bawah' },
]

export const hurufById = (id: string) => HURUF.find((h) => h.id === id)!

/**
 * ============================================================
 *  MATERI LEVEL 3–5 — MOHON DIPERIKSA USTAZ
 * ============================================================
 *  Level 3: Menyambung huruf, tanwin, sukun
 *  Level 4: Mad (bacaan panjang) dan tasydid
 *  Level 5: Tajwid dasar
 *
 *  PENTING: contoh di sini adalah KATA LATIHAN, bukan potongan ayat.
 *  Teks ayat Al-Quran baru dipakai di Level 6, dan wajib memakai
 *  Mushaf Standar Indonesia yang ditashih LPMQ Kemenag.
 *
 *  Setiap kartu:
 *  - id         : nama file audio → /public/audio/lanjutan/<id>.mp3
 *                 (hanya untuk kartu dengan audio: true)
 *  - arab       : tulisan Arab yang ditampilkan
 *  - latin      : cara baca (untuk mode "baca") atau nama hukum (mode "hukum")
 *  - keterangan : penjelasan singkat untuk anak
 *  - contoh     : (mode "hukum") contoh yang dipakai di soal
 *  - petunjuk   : kalimat bantuan saat anak salah
 *
 *  Penulisan latin mengikuti kebiasaan TPQ di Indonesia
 *  (ق = q, ر berharakat fathah = "ro", ح = ḥ). Silakan disesuaikan.
 * ============================================================
 */

export type KartuMateri = {
  id: string
  arab: string
  latin: string
  keterangan?: string
  audio?: boolean
  contoh?: string[]
  petunjuk?: string
}

export type SoalTambahan = {
  tanya: string
  tampil: string // teks Arab yang ditampilkan besar
  pilihan: string[] // teks pilihan (latin/Indonesia)
  benar: number // indeks pilihan yang benar
  petunjuk: string
}

export type MateriStage = {
  judul: string
  mode: 'baca' | 'hukum'
  kartu: KartuMateri[]
  petunjukUmum?: string
  soalTambahan?: SoalTambahan[]
}

const PENDEK_PANJANG = ['Pendek (1 ketukan)', 'Panjang (2 ketukan)']

/* ───────────────────────── LEVEL 3 ───────────────────────── */

export const LEVEL_3: MateriStage[] = [
  {
    judul: 'Sambung Fathah',
    mode: 'baca',
    petunjukUmum: 'Baca satu per satu dari kanan: setiap huruf berharakat fathah dibaca "a".',
    kartu: [
      { id: 'kataba', arab: 'كَتَبَ', latin: 'ka-ta-ba', keterangan: 'كَ + تَ + بَ', audio: true },
      { id: 'jalasa', arab: 'جَلَسَ', latin: 'ja-la-sa', keterangan: 'جَ + لَ + سَ', audio: true },
      { id: 'dzahaba', arab: 'ذَهَبَ', latin: 'dza-ha-ba', keterangan: 'ذَ + هَ + بَ', audio: true },
      { id: 'fataha', arab: 'فَتَحَ', latin: 'fa-ta-ḥa', keterangan: 'فَ + تَ + حَ', audio: true },
    ],
  },
  {
    judul: 'Sambung Kasrah & Dhammah',
    mode: 'baca',
    petunjukUmum: 'Lihat harakat setiap huruf: fathah "a", kasrah "i", dhammah "u".',
    kartu: [
      { id: 'samia', arab: 'سَمِعَ', latin: "sa-mi-'a", keterangan: 'سَ + مِ + عَ', audio: true },
      { id: 'alima', arab: 'عَلِمَ', latin: "'a-li-ma", keterangan: 'عَ + لِ + مَ', audio: true },
      { id: 'hasuna', arab: 'حَسُنَ', latin: 'ḥa-su-na', keterangan: 'حَ + سُ + نَ', audio: true },
      { id: 'kabura', arab: 'كَبُرَ', latin: 'ka-bu-ro', keterangan: 'كَ + بُ + رَ', audio: true },
    ],
  },
  {
    judul: 'Tanwin',
    mode: 'baca',
    petunjukUmum: 'Tanwin = harakat dobel. Bunyinya ditambah "n": an, in, un.',
    kartu: [
      { id: 'ban', arab: 'بًا', latin: 'ban', keterangan: 'Fathatain (dua garis di atas) → "an"', audio: true },
      { id: 'bin', arab: 'بٍ', latin: 'bin', keterangan: 'Kasratain (dua garis di bawah) → "in"', audio: true },
      { id: 'bun', arab: 'بٌ', latin: 'bun', keterangan: 'Dhammatain (dhammah dobel) → "un"', audio: true },
      { id: 'waladun', arab: 'وَلَدٌ', latin: 'wa-la-dun', keterangan: 'Tanwin di huruf terakhir', audio: true },
    ],
  },
  {
    judul: 'Sukun',
    mode: 'baca',
    petunjukUmum: 'Sukun (bulatan kecil di atas) = huruf mati, dibaca menempel ke huruf sebelumnya.',
    kartu: [
      { id: 'ab', arab: 'اَبْ', latin: 'ab', keterangan: 'اَ + بْ (ب mati)', audio: true },
      { id: 'ib', arab: 'اِبْ', latin: 'ib', keterangan: 'اِ + بْ', audio: true },
      { id: 'ub', arab: 'اُبْ', latin: 'ub', keterangan: 'اُ + بْ', audio: true },
      { id: 'min', arab: 'مِنْ', latin: 'min', keterangan: 'مِ + نْ', audio: true },
    ],
  },
]

/* ───────────────────────── LEVEL 4 ───────────────────────── */

export const LEVEL_4: MateriStage[] = [
  {
    judul: 'Mad Alif',
    mode: 'baca',
    petunjukUmum: 'Fathah diikuti alif → dibaca panjang 2 ketukan: "baa".',
    kartu: [
      { id: 'baa', arab: 'بَا', latin: 'baa', keterangan: 'بَ + ا → panjang', audio: true },
      { id: 'taa', arab: 'تَا', latin: 'taa', keterangan: 'تَ + ا → panjang', audio: true },
      { id: 'naama', arab: 'نَامَ', latin: 'naa-ma', keterangan: 'نَا (panjang) + مَ', audio: true },
      { id: 'qoola', arab: 'قَالَ', latin: 'qoo-la', keterangan: 'قَا (panjang) + لَ', audio: true },
    ],
    soalTambahan: [
      { tanya: 'Dibaca pendek atau panjang?', tampil: 'بَ', pilihan: PENDEK_PANJANG, benar: 0, petunjuk: 'Tidak ada alif sesudahnya, jadi pendek.' },
      { tanya: 'Dibaca pendek atau panjang?', tampil: 'بَا', pilihan: PENDEK_PANJANG, benar: 1, petunjuk: 'Ada alif sesudah fathah, jadi panjang.' },
    ],
  },
  {
    judul: 'Mad Ya',
    mode: 'baca',
    petunjukUmum: 'Kasrah diikuti ya mati (يْ) → dibaca panjang: "bii".',
    kartu: [
      { id: 'bii', arab: 'بِيْ', latin: 'bii', keterangan: 'بِ + يْ → panjang', audio: true },
      { id: 'fii', arab: 'فِيْ', latin: 'fii', keterangan: 'فِ + يْ → panjang', audio: true },
      { id: 'diinun', arab: 'دِيْنٌ', latin: 'dii-nun', keterangan: 'دِيْ (panjang) + نٌ', audio: true },
      { id: 'qiila', arab: 'قِيْلَ', latin: 'qii-la', keterangan: 'قِيْ (panjang) + لَ', audio: true },
    ],
    soalTambahan: [
      { tanya: 'Dibaca pendek atau panjang?', tampil: 'بِ', pilihan: PENDEK_PANJANG, benar: 0, petunjuk: 'Tidak ada ya mati sesudahnya, jadi pendek.' },
      { tanya: 'Dibaca pendek atau panjang?', tampil: 'بِيْ', pilihan: PENDEK_PANJANG, benar: 1, petunjuk: 'Ada ya mati sesudah kasrah, jadi panjang.' },
    ],
  },
  {
    judul: 'Mad Wau',
    mode: 'baca',
    petunjukUmum: 'Dhammah diikuti wau mati (وْ) → dibaca panjang: "buu".',
    kartu: [
      { id: 'buu', arab: 'بُوْ', latin: 'buu', keterangan: 'بُ + وْ → panjang', audio: true },
      { id: 'nuurun', arab: 'نُوْرٌ', latin: 'nuu-run', keterangan: 'نُوْ (panjang) + رٌ', audio: true },
      { id: 'yaquulu', arab: 'يَقُوْلُ', latin: 'ya-quu-lu', keterangan: 'يَ + قُوْ (panjang) + لُ', audio: true },
      { id: 'yakuunu', arab: 'يَكُوْنُ', latin: 'ya-kuu-nu', keterangan: 'يَ + كُوْ (panjang) + نُ', audio: true },
    ],
    soalTambahan: [
      { tanya: 'Dibaca pendek atau panjang?', tampil: 'بُ', pilihan: PENDEK_PANJANG, benar: 0, petunjuk: 'Tidak ada wau mati sesudahnya, jadi pendek.' },
      { tanya: 'Dibaca pendek atau panjang?', tampil: 'بُوْ', pilihan: PENDEK_PANJANG, benar: 1, petunjuk: 'Ada wau mati sesudah dhammah, jadi panjang.' },
    ],
  },
  {
    judul: 'Tasydid',
    mode: 'baca',
    petunjukUmum: 'Tasydid (tanda seperti huruf w kecil) = huruf dibaca dobel/ditekan.',
    kartu: [
      { id: 'robba', arab: 'رَبَّ', latin: 'rob-ba', keterangan: 'بّ dibaca dobel: rob-ba', audio: true },
      { id: 'inna', arab: 'اِنَّ', latin: 'in-na', keterangan: 'نّ dibaca dobel: in-na', audio: true },
      { id: 'tsumma', arab: 'ثُمَّ', latin: 'tsum-ma', keterangan: 'مّ dibaca dobel: tsum-ma', audio: true },
      { id: 'madda', arab: 'مَدَّ', latin: 'mad-da', keterangan: 'دّ dibaca dobel: mad-da', audio: true },
    ],
  },
]

/* ───────────────────────── LEVEL 5 ───────────────────────── */
/* Mode "hukum": anak mengenali hukum bacaan dari huruf yang ditemui. */

const IZHAR: KartuMateri = {
  id: 'izhar-halqi',
  arab: 'ء ه ع ح غ خ',
  latin: 'Izhar Halqi',
  keterangan: 'Nun mati (نْ) atau tanwin bertemu salah satu huruf ini → dibaca JELAS, tanpa dengung.',
  contoh: ['نْ + ء', 'نْ + ه', 'نْ + ع', 'نْ + ح', 'نْ + غ', 'نْ + خ'],
  petunjuk: 'Izhar: huruf tenggorokan ء ه ع ح غ خ',
}

export const LEVEL_5: MateriStage[] = [
  {
    judul: 'Izhar & Idgham',
    mode: 'hukum',
    kartu: [
      IZHAR,
      {
        id: 'idgham-bighunnah',
        arab: 'ي ن م و',
        latin: 'Idgham Bighunnah',
        keterangan: 'Nun mati atau tanwin bertemu ي ن م و → DILEBUR ke huruf berikutnya, DENGAN dengung.',
        contoh: ['نْ + ي', 'نْ + ن', 'نْ + م', 'نْ + و'],
        petunjuk: 'Idgham bighunnah: huruf ي ن م و',
      },
      {
        id: 'idgham-bilaghunnah',
        arab: 'ل ر',
        latin: 'Idgham Bilaghunnah',
        keterangan: 'Nun mati atau tanwin bertemu ل atau ر → DILEBUR, TANPA dengung.',
        contoh: ['نْ + ل', 'نْ + ر'],
        petunjuk: 'Idgham bilaghunnah: hanya ل dan ر',
      },
    ],
  },
  {
    judul: 'Iqlab & Ikhfa',
    mode: 'hukum',
    kartu: [
      {
        id: 'iqlab',
        arab: 'ب',
        latin: 'Iqlab',
        keterangan: 'Nun mati atau tanwin bertemu ب → bunyi نْ BERUBAH menjadi مْ, dengan dengung.',
        contoh: ['نْ + ب'],
        petunjuk: 'Iqlab hanya untuk huruf ب',
      },
      {
        id: 'ikhfa-haqiqi',
        arab: 'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك',
        latin: 'Ikhfa Haqiqi',
        keterangan: 'Nun mati atau tanwin bertemu salah satu dari 15 huruf ini → dibaca SAMAR, dengan dengung.',
        contoh: ['نْ + ت', 'نْ + ج', 'نْ + س', 'نْ + ص', 'نْ + ف', 'نْ + ق', 'نْ + ك', 'نْ + ذ'],
        petunjuk: 'Ikhfa: 15 huruf selain huruf izhar, idgham, dan iqlab',
      },
      { ...IZHAR, id: 'izhar-halqi-2' },
    ],
  },
  {
    judul: 'Mim Mati',
    mode: 'hukum',
    kartu: [
      {
        id: 'ikhfa-syafawi',
        arab: 'مْ + ب',
        latin: 'Ikhfa Syafawi',
        keterangan: 'Mim mati (مْ) bertemu ب → dibaca SAMAR di bibir, dengan dengung.',
        contoh: ['مْ + ب'],
        petunjuk: 'Ikhfa syafawi: mim mati bertemu ب',
      },
      {
        id: 'idgham-mimi',
        arab: 'مْ + م',
        latin: 'Idgham Mimi',
        keterangan: 'Mim mati bertemu م → dilebur jadi satu, dengan dengung.',
        contoh: ['مْ + م'],
        petunjuk: 'Idgham mimi: mim mati bertemu م',
      },
      {
        id: 'izhar-syafawi',
        arab: 'مْ + ت',
        latin: 'Izhar Syafawi',
        keterangan: 'Mim mati bertemu huruf SELAIN ب dan م → dibaca JELAS.',
        contoh: ['مْ + ت', 'مْ + ل', 'مْ + ع', 'مْ + ك', 'مْ + ه'],
        petunjuk: 'Izhar syafawi: mim mati bertemu huruf selain ب dan م',
      },
    ],
  },
  {
    judul: 'Qalqalah & Ghunnah',
    mode: 'hukum',
    kartu: [
      {
        id: 'qalqalah-sughra',
        arab: 'ق ط ب ج د',
        latin: 'Qalqalah Sughra',
        keterangan: 'Huruf ق ط ب ج د yang MATI di TENGAH kata → dibaca memantul ringan.',
        contoh: ['يَجْعَلُ', 'اَطْفَالٌ', 'يَدْخُلُ', 'اَبْوَابٌ'],
        petunjuk: 'Sughra: huruf qalqalah mati di tengah kata',
      },
      {
        id: 'qalqalah-kubra',
        arab: 'ق ط ب ج د',
        latin: 'Qalqalah Kubra',
        keterangan: 'Huruf ق ط ب ج د di AKHIR kata saat kita berhenti (waqaf) → pantulannya lebih kuat.',
        contoh: ['حَقْ', 'بَعِيْدْ', 'مُحِيْطْ', 'قَرِيْبْ'],
        petunjuk: 'Kubra: huruf qalqalah di akhir kata saat berhenti',
      },
      {
        id: 'ghunnah',
        arab: 'نّ مّ',
        latin: 'Ghunnah',
        keterangan: 'Nun atau mim bertasydid → dengung ditahan sekitar 2 ketukan.',
        contoh: ['اِنَّ', 'ثُمَّ', 'جَنَّةٌ', 'اُمٌّ'],
        petunjuk: 'Ghunnah: نّ atau مّ (bertasydid)',
      },
    ],
  },
]

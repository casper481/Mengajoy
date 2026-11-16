/**
 * CONTOH UJI — BUKAN AYAT AL-QURAN.
 * Kalimat latihan biasa, hanya untuk menguji tampilan "baca per kata" di komputer pengembang.
 * Aktif hanya saat mode pengembangan DAN variabel VITE_CONTOH_AYAT=1.
 * Di app yang dirilis (npm run build) bagian ini selalu kosong.
 */
import type { Ayat, KataAyat } from './ayat'

const aktif = import.meta.env.DEV && import.meta.env.VITE_CONTOH_AYAT === '1'

export const CONTOH_UJI: { pembuka: KataAyat[]; ayat: Ayat[] } = aktif
  ? {
      pembuka: [
        { arab: 'هٰذَا', latin: 'haa-dzaa' },
        { arab: 'مِثَالٌ', latin: 'mi-tsaa-lun' },
      ],
      // Surat 112 dipakai sebagai "wadah" uji: 4 baris kalimat latihan.
      ayat: [
        { surah: 112, ayat: 1, kata: [{ arab: 'كَتَبَ', latin: 'ka-ta-ba' }, { arab: 'وَلَدٌ', latin: 'wa-la-dun' }] },
        { surah: 112, ayat: 2, kata: [{ arab: 'جَلَسَ', latin: 'ja-la-sa' }, { arab: 'فِيْ', latin: 'fii' }, { arab: 'بَابٍ', latin: 'baa-bin' }] },
        { surah: 112, ayat: 3, kata: [{ arab: 'ذَهَبَ', latin: 'dza-ha-ba' }, { arab: 'اِلَى', latin: 'i-laa' }, { arab: 'مَسْجِدٍ', latin: 'mas-ji-din' }] },
        { surah: 112, ayat: 4, kata: [{ arab: 'نَامَ', latin: 'naa-ma' }, { arab: 'وَلَدٌ', latin: 'wa-la-dun' }] },
      ],
    }
  : { pembuka: [], ayat: [] }

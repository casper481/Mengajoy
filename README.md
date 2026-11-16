# Mengajoy — Prototipe

> "Anak belajar agama karena seru, bukan karena disuruh."

Mengajoy adalah web app belajar membaca Al-Quran untuk anak usia 5–10 tahun, bersama **Nuri**, burung kecil pemandu.
Prototipe ini berisi 6 pulau mengikuti urutan TPQ:

| Level | Pulau | Isi | Status |
|---|---|---|---|
| 1 | Huruf Hijaiyah | 28 huruf dalam 7 stage | ✅ Bisa dimainkan |
| 2 | Harakat | Fathah, kasrah, dhammah (4 stage) | ✅ Bisa dimainkan |
| 3 | Menyambung Huruf | Sambung fathah, sambung kasrah/dhammah, tanwin, sukun | ✅ Bisa dimainkan |
| 4 | Mad & Tasydid | Mad alif, mad ya, mad wau, tasydid | ✅ Bisa dimainkan |
| 5 | Tajwid Dasar | Izhar/idgham, iqlab/ikhfa, mim mati, qalqalah/ghunnah | ✅ Bisa dimainkan |
| 6 | Al-Quran | 9 surat pendek (42 ayat): baca per ayat & per kata | ✅ Bisa dibaca — teks dari Tanzil Project (Uthmani). ⏳ Rencana: ganti ke Mushaf Standar Indonesia + tashih LPMQ |

Setiap pulau terbuka setelah pulau sebelumnya selesai.

---

## Cara menjalankan di laptop

1. Pasang **Node.js** versi 20 atau lebih baru dari situs resmi nodejs.org (pilih versi "LTS"), lalu ikuti petunjuk pemasangannya.
2. Buka **Terminal** (Mac) atau **Command Prompt** (Windows), lalu masuk ke folder proyek ini:
   ```bash
   cd mengajoy
   ```
3. Pasang paket yang dibutuhkan (cukup sekali saja):
   ```bash
   npm install
   ```
4. Jalankan app:
   ```bash
   npm run dev
   ```
5. Buka browser ke alamat yang muncul, biasanya **http://localhost:5173**.
   Untuk membuka di **HP**, pastikan HP dan laptop memakai Wi-Fi yang sama, lalu buka alamat "Network" yang tertulis di terminal (contoh: `http://192.168.1.5:5173`).

Untuk menghentikan app, tekan `Ctrl + C` di terminal.

### Membuat versi siap-online
```bash
npm run build
```
Hasilnya ada di folder `dist/`. Isi folder ini bisa diunggah ke hosting statis apa pun, misalnya Netlify, Vercel, atau GitHub Pages.

---

## Yang bisa dicoba

Daftar cek lengkap langkah demi langkah ada di **[PANDUAN-UJI.md](PANDUAN-UJI.md)**. Di Area Orang Tua tersedia **🧪 Alat Uji Coba** untuk mencoba fitur yang bergantung waktu (streak, misi harian, batas waktu, sertifikat) tanpa menunggu.


| Fitur | Cara mencoba |
|---|---|
| Layar sambutan | Buka app, lalu tekan **Mulai Petualangan** |
| Peta pulau | 6 pulau. Pulau 1 terbuka, Pulau 2 terbuka setelah Pulau 1 selesai, Pulau 3–6 "Segera hadir" |
| Stage huruf | Pulau 1 → batu nomor 1 → Kenalan → Tebak Suara → Cari Pasangan → Perayaan |
| Jawaban salah | Pilih jawaban yang salah: tidak ada suara negatif, Nuri memberi petunjuk dengan lembut |
| Hadiah & Lemari | Setiap stage yang pertama kali selesai memberi 1 aksesoris. Pasang atau lepas di **Lemari Nuri** |
| Level 2 Harakat | Kenalan fathah/kasrah/dhammah → Tebak Suara → Susun Suku Kata |
| Streak | Ikon api di kanan atas = jumlah hari berturut-turut belajar |
| Misi harian | Tombol **Misi Hari Ini** → **Sudah!** → dikonfirmasi orang tua |
| Area orang tua | Tombol **Orang Tua** → jawab soal perkalian → lihat progres dan atur batas waktu |
| Batas waktu | Pilih 15/30/45 menit. Saat tercapai, muncul layar "Waktunya istirahat" sampai besok |
| Level 3–5 | Kenalan → Latihan (pilihan ganda: cara baca, pendek/panjang, hukum tajwid) → Cari Pasangan |
| Level 6 | Pulau Al-Quran: daftar 9 surat. Surat terbuka otomatis begitu teksnya diisi. Per ayat: **Dengarkan → Ikuti per kata** (kata disorot satu per satu) **→ Aku sudah bisa** (dikonfirmasi orang tua). Latin bisa disembunyikan. Sengaja tanpa permainan yang mengacak teks ayat, demi adab terhadap Al-Quran |
| **Latihan Harian** | Kartu di atas peta (muncul setelah 1 stage selesai): 6 soal acak dari bacaan yang sudah dipelajari. Bacaan yang sering salah lebih sering muncul |
| **Perayaan tamat** | Setelah semua stage Level 1–5 selesai: tombol "🎓 Ada kejutan!" → Nuri wisuda + **sertifikat** bernama anak yang bisa diunduh (PNG) |
| Perlu diulang | Di Area Orang Tua: daftar bacaan yang sering salah di Latihan Harian |
| **Mode coba** | Di Area Orang Tua, nyalakan "Mode coba: buka semua stage" untuk langsung mencoba semua pulau atau memeriksa materi bersama ustaz |

---

## Struktur folder

```
mengajoy/
├── public/
│   └── audio/
│       ├── huruf/        ← tempat file audio huruf (alif.mp3, ba.mp3, …)
│       ├── harakat/      ← tempat file audio harakat (ba-fathah.mp3, …)
│       └── lanjutan/     ← tempat file audio Level 3–4 (kataba.mp3, …)
├── src/
│   ├── data/             ← ★ ISI MATERI (bisa diperiksa ustaz tanpa paham kode)
│   │   ├── huruf.ts      ← 28 huruf: urutan, nama latin, bentuk awal/tengah/akhir, petunjuk
│   │   ├── harakat.ts    ← fathah/kasrah/dhammah + daftar suku kata
│   │   ├── materi-lanjutan.ts ← ★ materi Level 3–5 (kata latihan & hukum tajwid)
│   │   ├── ayat.ts       ← Level 6: daftar surat + tempat teks ayat (SENGAJA masih kosong)
│   │   ├── teks-tanzil.ts ← teks 9 surat dari Tanzil Project (verbatim, JANGAN diubah manual)
│   │   ├── stages.ts     ← pembagian pulau & stage
│   │   ├── hadiah.ts     ← daftar aksesoris Nuri
│   │   └── misi.ts       ← daftar misi harian
│   ├── activities/       ← permainan: Kenalan, TebakSuara, PilihJawaban, CariPasangan, SusunSukuKata
│   ├── pages/            ← halaman: Sambutan, Peta, Pulau, Stage, Lemari, Misi, Orang Tua, Istirahat
│   ├── components/       ← potongan tampilan: Nuri (SVG), tombol suara, bar atas, efek bintang
│   ├── lib/              ← penyimpanan progres, efek suara, pemutar audio, tanggal
│   └── App.tsx           ← pengatur halaman + penghitung waktu belajar
├── AUDIO-TODO.md         ← daftar 81 file audio yang perlu direkam
└── README.md             ← dokumen ini
```

## Cara menambahkan audio

1. Rekam sesuai daftar di **AUDIO-TODO.md**.
2. Simpan file MP3 ke `public/audio/huruf/`, `public/audio/harakat/`, atau `public/audio/lanjutan/` dengan nama **persis** seperti di daftar.
3. Muat ulang app. Tulisan "audio belum tersedia" akan hilang dan suara akan diputar.

## Catatan teknis singkat

- Dibuat dengan Vite + React + TypeScript + Tailwind CSS.
- Tanpa server dan tanpa login. Progres disimpan di **localStorage** browser (dibungkus try/catch, jadi app tidak error walaupun penyimpanan diblokir).
- Font Arab memakai **Scheherazade New** dan font latin memakai **Baloo 2**. Keduanya disertakan di dalam app, jadi tetap tampil walaupun offline.
- Efek suara (ting, sorakan) dibuat dengan Web Audio API. Bacaan Arab **tidak** memakai text-to-speech.
- Bintang: 3 bintang jika kesalahan 0–1, 2 bintang jika 2–4, dan 1 bintang jika lebih dari itu. Anak tidak pernah "gagal".

## Aturan konten yang dipatuhi

- Level 3–5 memakai kata latihan, bukan potongan ayat.
- Teks ayat Level 6 saat ini: **Tanzil Project (tanzil.net)**, teks Uthmani, salinan verbatim (tidak diubah; diperiksa otomatis) dengan sumber dicantumkan sesuai syarat lisensinya. Gaya tulisannya Mushaf Madinah, bukan Mushaf Standar Indonesia. **Sebelum app diedarkan luas**, ganti dengan Mushaf Standar Indonesia dan urus tanda tashih LPMQ Kemenag.
- Tautan ke tanzil.net (syarat lisensi) hanya ada di Area Orang Tua yang terkunci, bukan di layar anak.
- Tidak ada gambar atau visualisasi nabi, rasul, maupun keluarganya. Satu-satunya tokoh adalah Nuri, burung ciptaan sendiri.
- Tidak ada iklan, tautan keluar, atau pembelian di dalam app.
- Tidak ada hitung mundur yang memaksa dan tidak ada notifikasi. Ada batas waktu harian yang diatur orang tua.

---

## Yang belum dibuat (daftar pekerjaan berikutnya)

- [ ] **File audio**: 81 file belum direkam (lihat AUDIO-TODO.md).
- [ ] **Pemeriksaan ustaz** atas `src/data/huruf.ts`, `src/data/harakat.ts`, dan `src/data/materi-lanjutan.ts` (nama latin, petunjuk, contoh, penjelasan tajwid).
- [ ] Hamzah (ء) dan lam-alif (لا), jika TPQ Anda memasukkannya.
- [ ] **Level 6: ganti teks Tanzil dengan Mushaf Standar Indonesia** (`src/data/ayat.ts`) dan urus **tanda tashih LPMQ Kemenag** sebelum app diedarkan luas.
- [ ] Audio qari berizin di `public/audio/ayat/` dan `public/audio/kata/` (sekarang "audio belum tersedia").
- [ ] Font khusus mushaf: pertimbangkan font resmi Mushaf Standar Indonesia agar bentuk tulisan sama dengan mushaf cetak.
- [ ] Materi lanjutan yang belum ada: mad lainnya (mad wajib/jaiz, dll.), hukum lam jalalah, ra tafkhim/tarqiq, waqaf.
- [ ] Akun & sinkron antar-perangkat (sekarang progres hanya tersimpan di satu browser).
- [ ] Beberapa profil anak dalam satu perangkat.
- [ ] Laporan mingguan untuk orang tua.
- [ ] Bisa dipasang di layar HP seperti app (PWA) dan bisa dipakai offline sepenuhnya.
- [ ] Uji coba dengan anak sungguhan, termasuk ukuran tombol dan kecepatan animasi.
- [ ] Desain Nuri yang lebih final oleh ilustrator.
- [ ] Hapus **Alat Uji Coba** dan **Mode coba** sebelum dirilis ke anak-anak.
- [ ] Pemeriksaan merek "Mengajoy" di PDKI DJKI dan pendaftaran domain.

# Mengajoy — Prototipe

> "Anak belajar agama karena seru, bukan karena disuruh."

Mengajoy adalah web app belajar membaca Al-Quran untuk anak usia 5–10 tahun, bersama **Nuri**, burung kecil pemandu.
Prototipe ini berisi **Level 1 (Huruf Hijaiyah)** dan **Level 2 (Harakat)**. Level 3–6 sudah tampil di peta sebagai pulau terkunci dengan tulisan "Segera hadir".

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
| **Mode coba** | Di Area Orang Tua, nyalakan "Mode coba: buka semua stage" untuk langsung mencoba Pulau 2 atau memeriksa materi bersama ustaz |

---

## Struktur folder

```
mengajoy/
├── public/
│   └── audio/
│       ├── huruf/        ← tempat file audio huruf (alif.mp3, ba.mp3, …)
│       └── harakat/      ← tempat file audio harakat (ba-fathah.mp3, …)
├── src/
│   ├── data/             ← ★ ISI MATERI (bisa diperiksa ustaz tanpa paham kode)
│   │   ├── huruf.ts      ← 28 huruf: urutan, nama latin, bentuk awal/tengah/akhir, petunjuk
│   │   ├── harakat.ts    ← fathah/kasrah/dhammah + daftar suku kata
│   │   ├── stages.ts     ← pembagian pulau & stage
│   │   ├── hadiah.ts     ← daftar aksesoris Nuri
│   │   └── misi.ts       ← daftar misi harian
│   ├── activities/       ← 4 permainan: Kenalan, TebakSuara, CariPasangan, SusunSukuKata
│   ├── pages/            ← halaman: Sambutan, Peta, Pulau, Stage, Lemari, Misi, Orang Tua, Istirahat
│   ├── components/       ← potongan tampilan: Nuri (SVG), tombol suara, bar atas, efek bintang
│   ├── lib/              ← penyimpanan progres, efek suara, pemutar audio, tanggal
│   └── App.tsx           ← pengatur halaman + penghitung waktu belajar
├── AUDIO-TODO.md         ← daftar 49 file audio yang perlu direkam
└── README.md             ← dokumen ini
```

## Cara menambahkan audio

1. Rekam sesuai daftar di **AUDIO-TODO.md**.
2. Simpan file MP3 ke `public/audio/huruf/` atau `public/audio/harakat/` dengan nama **persis** seperti di daftar.
3. Muat ulang app. Tulisan "audio belum tersedia" akan hilang dan suara akan diputar.

## Catatan teknis singkat

- Dibuat dengan Vite + React + TypeScript + Tailwind CSS.
- Tanpa server dan tanpa login. Progres disimpan di **localStorage** browser (dibungkus try/catch, jadi app tidak error walaupun penyimpanan diblokir).
- Font Arab memakai **Scheherazade New** dan font latin memakai **Baloo 2**. Keduanya disertakan di dalam app, jadi tetap tampil walaupun offline.
- Efek suara (ting, sorakan) dibuat dengan Web Audio API. Bacaan Arab **tidak** memakai text-to-speech.
- Bintang: 3 bintang jika kesalahan 0–1, 2 bintang jika 2–4, dan 1 bintang jika lebih dari itu. Anak tidak pernah "gagal".

## Aturan konten yang dipatuhi

- Hanya huruf hijaiyah dan harakat, **tanpa teks ayat Al-Quran**. Nanti teks ayat wajib memakai Mushaf Standar Indonesia yang ditashih LPMQ Kemenag.
- Tidak ada gambar atau visualisasi nabi, rasul, maupun keluarganya. Satu-satunya tokoh adalah Nuri, burung ciptaan sendiri.
- Tidak ada iklan, tautan keluar, atau pembelian di dalam app.
- Tidak ada hitung mundur yang memaksa dan tidak ada notifikasi. Ada batas waktu harian yang diatur orang tua.

---

## Yang belum dibuat (daftar pekerjaan berikutnya)

- [ ] **File audio**: 49 file belum direkam (lihat AUDIO-TODO.md).
- [ ] **Pemeriksaan ustaz** atas `src/data/huruf.ts` dan `src/data/harakat.ts` (nama latin, petunjuk, bentuk sambung).
- [ ] Hamzah (ء) dan lam-alif (لا), jika TPQ Anda memasukkannya.
- [ ] Level 3: Menyambung huruf.
- [ ] Level 4: Mad (bacaan panjang).
- [ ] Level 5: Tajwid dasar.
- [ ] Level 6: Membaca ayat (wajib teks Mushaf Standar Indonesia yang ditashih LPMQ).
- [ ] Tanwin, sukun, dan tasydid.
- [ ] Akun & sinkron antar-perangkat (sekarang progres hanya tersimpan di satu browser).
- [ ] Beberapa profil anak dalam satu perangkat.
- [ ] Laporan mingguan untuk orang tua.
- [ ] Bisa dipasang di layar HP seperti app (PWA) dan bisa dipakai offline sepenuhnya.
- [ ] Uji coba dengan anak sungguhan, termasuk ukuran tombol dan kecepatan animasi.
- [ ] Desain Nuri yang lebih final oleh ilustrator.
- [ ] Pemeriksaan merek "Mengajoy" di PDKI DJKI dan pendaftaran domain.

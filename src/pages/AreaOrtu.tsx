/** Area orang tua: progres, waktu belajar, batas waktu, pengaturan. */
import { useState } from 'react'
import BarAtas from '../components/BarAtas'
import { HURUF } from '../data/huruf'
import { PULAU, STAGES, stagesOfPulau } from '../data/stages'
import { useProgres, type AksiUji } from '../lib/progres'
import { formatMenit } from '../lib/tanggal'
import { perluDiulang } from '../lib/latihan'
import { PESAN_APRESIASI, STIKER_APRESIASI } from '../data/dunia'
import { hariIni } from '../lib/tanggal'
import TeksCampur from '../components/TeksCampur'

export default function AreaOrtu({ onKembali, onSertifikat }: { onKembali: () => void; onSertifikat: () => void }) {
  const { p, detikHariIni, streakAktif, totalBintang, setBatas, setEfek, setDemo, setNama, reset, semuaTamat, uji, level, kirimApresiasi } = useProgres()
  const [stiker, setStiker] = useState(STIKER_APRESIASI[0])
  const [pesan, setPesan] = useState(PESAN_APRESIASI[0])
  const [terkirim, setTerkirim] = useState(false)
  const pekan = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const t = hariIni(d)
    return { t, nama: d.toLocaleDateString('id-ID', { weekday: 'short' }), menit: Math.round((p.aktif[t] ?? 0) / 60) }
  })
  const hariAktif = pekan.filter((x) => x.menit > 0).length
  const menitPekan = pekan.reduce((a, x) => a + x.menit, 0)
  const maksMenit = Math.max(5, ...pekan.map((x) => x.menit))
  const [pesanUji, setPesanUji] = useState('')
  const jalankan = (aksi: AksiUji, pesan: string) => {
    uji(aksi)
    setPesanUji(pesan)
  }
  const ulang = perluDiulang(p.statistik)
  const [konfirmasiReset, setKonfirmasiReset] = useState(false)

  const hurufDikuasai = new Set(STAGES.filter((s) => s.jenis === 'huruf' && (p.bintang[s.id] ?? 0) > 0).flatMap((s) => (s.jenis === 'huruf' ? s.huruf : [])))
  const sisa = Math.max(0, p.batasMenit * 60 - detikHariIni)

  return (
    <div className="flex min-h-full flex-col pb-8">
      <BarAtas onKembali={onKembali} judul="Area Orang Tua" />
      <div className="flex flex-col gap-4 px-4">
        {/* Ringkasan */}
        <div className="grid grid-cols-2 gap-3">
          <Kotak label="Hari berturut-turut" nilai={`${streakAktif} hari`} />
          <Kotak label="Total bintang" nilai={`${totalBintang}`} />
          <Kotak label="Belajar hari ini" nilai={formatMenit(detikHariIni)} />
          <Kotak label="Total waktu belajar" nilai={formatMenit(p.waktu.totalDetik)} />
          <Kotak label="Misi selesai" nilai={`${p.misi.total}`} />
          <Kotak label="Hadiah terkumpul" nilai={`${p.hadiah.length}`} />
          <Kotak label="Latihan harian" nilai={`${p.latihan.total} kali`} />
          <Kotak label="Status" nilai={semuaTamat ? '🎓 Tamat L1–5' : 'Sedang belajar'} />
        </div>

        {/* Huruf dikuasai */}
        <Bagian judul={`Huruf yang sudah dipelajari (${hurufDikuasai.size}/28)`}>
          <div className="grid grid-cols-7 gap-1.5">
            {HURUF.map((h) => {
              const ok = hurufDikuasai.has(h.id)
              return (
                <div key={h.id} className={`flex flex-col items-center rounded-lg py-1 ${ok ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-400'}`}>
                  <span className="arab text-2xl leading-tight">{h.arab}</span>
                  <span className="text-[9px] font-bold">{h.nama}</span>
                </div>
              )
            })}
          </div>
        </Bagian>

        <Bagian judul="Perjalanan menuju membaca Al-Quran">
          <div className="flex flex-col gap-3">
            {PULAU.filter((pl) => pl.id > 1).map((pl) => {
              const stages = stagesOfPulau(pl.id)
              const selesai = stages.filter((x) => (p.bintang[x.id] ?? 0) > 0).length
              return (
                <div key={pl.id}>
                  <div className="flex items-center justify-between text-sm font-extrabold">
                    <span>
                      Level {pl.id}: {pl.nama.replace('Pulau ', '')}
                    </span>
                    <span className="text-slate-500">{stages.length ? `${selesai}/${stages.length}` : 'menunggu teks resmi'}</span>
                  </div>
                  {stages.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {stages.map((x) => (
                        <span
                          key={x.id}
                          className={`rounded-lg px-2 py-0.5 text-xs font-bold ${(p.bintang[x.id] ?? 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-400'}`}
                        >
                          {x.jenis === 'huruf' ? `Stage ${x.nomor}` : x.judul} {p.bintang[x.id] ? '★'.repeat(p.bintang[x.id]) : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Bagian>

        <Bagian judul="📊 Laporan 7 hari terakhir">
          <div className="mb-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-slate-50 p-2">
              <div className="text-xl font-extrabold">{hariAktif}/7</div>
              <div className="text-[11px] font-bold text-slate-500">hari belajar</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2">
              <div className="text-xl font-extrabold">{menitPekan}</div>
              <div className="text-[11px] font-bold text-slate-500">menit</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-2">
              <div className="text-xl font-extrabold">Lv {level}</div>
              <div className="text-[11px] font-bold text-slate-500">🪙 {p.koin} koin</div>
            </div>
          </div>
          <div className="flex h-28 items-end gap-2">
            {pekan.map((x) => (
              <div key={x.t} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-slate-500">{x.menit || ''}</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-[#3fb24f] to-[#7ee081]" style={{ height: `${(x.menit / maksMenit) * 80}px`, minHeight: x.menit ? 6 : 2, opacity: x.menit ? 1 : 0.25 }} />
                <span className="text-[10px] font-bold text-slate-500">{x.nama}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-500">Menit belajar per hari. Rutin sedikit lebih baik daripada lama sekali-sekali.</div>
        </Bagian>

        <Bagian judul="💌 Kirim apresiasi untuk ananda">
          <div className="mb-2 text-sm text-slate-600">Pesan akan muncul di peta saat ananda membuka app (+20 koin).</div>
          <div className="mb-2 flex flex-wrap gap-2">
            {STIKER_APRESIASI.map((s) => (
              <button key={s} onClick={() => setStiker(s)} className={`h-12 w-12 rounded-xl border-4 text-2xl ${stiker === s ? 'border-[#ff8a2b] bg-orange-50' : 'border-slate-100 bg-white'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {PESAN_APRESIASI.map((m) => (
              <button key={m} onClick={() => setPesan(m)} className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-bold ${pesan === m ? 'border-[#ff8a2b] bg-orange-50' : 'border-slate-100 bg-white'}`}>
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              kirimApresiasi(stiker, pesan)
              setTerkirim(true)
              setTimeout(() => setTerkirim(false), 2500)
            }}
            className="tombol-game jeruk mt-3 w-full py-3 text-lg"
          >
            {terkirim ? '✓ Terkirim!' : `Kirim ${stiker}`}
          </button>
        </Bagian>

        <Bagian judul="Perlu diulang">
          {ulang.length === 0 ? (
            <div className="text-sm text-slate-500">Belum ada catatan. Daftar ini terisi dari hasil Latihan Harian: bacaan yang sering salah akan muncul di sini.</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {ulang.map((u) => (
                <div key={u.kunci} className="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-1.5">
                  <span className="font-bold"><TeksCampur teks={u.label} /></span>
                  <span className="text-sm font-bold text-slate-500">salah {u.s}× · benar {u.b}×</span>
                </div>
              ))}
              <div className="mt-1 text-xs text-slate-500">Bantu ananda mengulang bacaan ini, atau sampaikan ke guru ngajinya.</div>
            </div>
          )}
        </Bagian>

        <Bagian judul="Sertifikat">
          <label className="block">
            <span className="text-sm font-bold text-slate-500">Nama ananda (untuk sertifikat)</span>
            <input
              value={p.namaAnak}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Tulis nama ananda"
              className="mt-1 w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-lg font-bold outline-none focus:border-laut"
              style={{ userSelect: 'text' }}
            />
          </label>
          {semuaTamat ? (
            <button onClick={onSertifikat} className="tombol-game jeruk mt-3 w-full py-3 text-lg">🎓 Lihat & simpan sertifikat</button>
          ) : (
            <div className="mt-2 text-sm text-slate-500">Sertifikat terbuka setelah ananda menyelesaikan semua stage Level 1–5.</div>
          )}
        </Bagian>

        {/* Batas waktu */}
        <Bagian judul="Batas waktu harian">
          <div className="grid grid-cols-3 gap-2">
            {([15, 30, 45] as const).map((m) => (
              <button key={m} onClick={() => setBatas(m)} className={`tombol py-3 text-lg ${p.batasMenit === m ? 'bg-laut text-white' : 'bg-slate-100'}`}>
                {m} menit
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Sisa waktu hari ini: <b>{formatMenit(sisa)}</b>. Jika batas tercapai di tengah stage, anak boleh menyelesaikan stage itu dulu, lalu layar istirahat muncul sampai besok.
          </div>
        </Bagian>

        <Bagian judul="Pengaturan">
          <Saklar label="Efek suara (ting, sorakan)" nilai={p.efekSuara} onUbah={setEfek} />
          <Saklar label="Mode coba: buka semua stage" nilai={p.modeDemo} onUbah={setDemo} keterangan="Untuk orang tua/ustaz memeriksa materi. Matikan untuk anak." />
          {!konfirmasiReset ? (
            <button onClick={() => setKonfirmasiReset(true)} className="mt-3 w-full rounded-xl border-2 border-slate-200 py-2 font-bold text-slate-500">
              Hapus semua progres
            </button>
          ) : (
            <div className="mt-3 rounded-xl bg-red-50 p-3 text-center">
              <div className="font-bold">Yakin hapus semua progres, bintang, dan hadiah?</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => setKonfirmasiReset(false)} className="tombol bg-white py-2">Batal</button>
                <button
                  onClick={() => {
                    reset()
                    setKonfirmasiReset(false)
                  }}
                  className="tombol bg-red-400 py-2 text-white"
                >
                  Ya, hapus
                </button>
              </div>
            </div>
          )}
        </Bagian>

        <Bagian judul="🧪 Alat Uji Coba (khusus prototipe)">
          <div className="mb-2 text-xs text-slate-500">Untuk mencoba fitur dengan cepat. Akan dihapus sebelum app dirilis ke anak-anak.</div>
          <div className="grid gap-2">
            <TombolUji onClick={() => jalankan('hampir-tamat', 'Semua stage selesai kecuali stage terakhir (Pulau Tajwid, stage 4). Mainkan stage itu untuk melihat "Ada kejutan!".')}>
              🎓 Hampir tamat (sisa 1 stage)
            </TombolUji>
            <TombolUji onClick={() => jalankan('tamatkan-semua', 'Semua stage selesai (3 bintang) dan semua hadiah didapat. Sertifikat sudah bisa dibuka.')}>
              🏆 Tamatkan semua + semua hadiah
            </TombolUji>
            <TombolUji onClick={() => jalankan('hari-berikutnya', 'Sekarang dianggap sudah besok: misi dan latihan harian terbuka lagi, waktu belajar kembali 0. Belajar lagi supaya streak naik.')}>
              📅 Lompat ke hari berikutnya
            </TombolUji>
            <TombolUji onClick={() => jalankan('habiskan-waktu', 'Batas waktu hari ini dianggap habis. Kembali ke peta untuk melihat layar istirahat.')}>
              ⏰ Habiskan waktu hari ini
            </TombolUji>
            <TombolUji onClick={() => jalankan('reset-waktu', 'Waktu belajar hari ini kembali ke 0.')}>↩️ Kembalikan waktu hari ini</TombolUji>
            <TombolUji onClick={() => jalankan('tambah-koin', '+500 koin untuk mencoba menghias Pulau Rumahku.')}>🪙 Tambah 500 koin</TombolUji>
            <TombolUji onClick={() => jalankan('tambah-xp', '+300 XP: level naik, Momo tumbuh, tempat dekorasi & kartu ilmu terbuka.')}>⭐ Tambah 300 XP</TombolUji>
          </div>
          {pesanUji && <div className="mt-3 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-800">✓ {pesanUji}</div>}
        </Bagian>

        <Bagian judul="Sumber teks Al-Quran">
          <div className="text-sm text-slate-600">
            Teks ayat di Level 6: <b>Tanzil Project</b>, teks Uthmani (salinan verbatim, tidak diubah).{' '}
            <a href="https://tanzil.net" target="_blank" rel="noreferrer" className="font-bold text-laut underline">
              tanzil.net
            </a>
          </div>
        </Bagian>

        <div className="text-center text-xs text-slate-500">
          Mengajoy — prototipe. Tanpa iklan, tanpa pembelian, tanpa tautan keluar. Data hanya disimpan di perangkat ini.
        </div>
      </div>
    </div>
  )
}

function TombolUji({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="tombol w-full bg-slate-100 px-3 py-2.5 text-left text-base">
      {children}
    </button>
  )
}

function Kotak({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow">
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className="text-xl font-extrabold">{nilai}</div>
    </div>
  )
}

function Bagian({ judul, children }: { judul: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="mb-2 font-extrabold">{judul}</div>
      {children}
    </div>
  )
}

function Saklar({ label, nilai, onUbah, keterangan }: { label: string; nilai: boolean; onUbah: (v: boolean) => void; keterangan?: string }) {
  return (
    <button onClick={() => onUbah(!nilai)} className="flex w-full items-center justify-between gap-3 py-2 text-left">
      <span>
        <span className="block font-bold">{label}</span>
        {keterangan && <span className="block text-xs text-slate-500">{keterangan}</span>}
      </span>
      <span className={`relative h-8 w-14 shrink-0 rounded-full transition ${nilai ? 'bg-daun' : 'bg-slate-300'}`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${nilai ? 'left-7' : 'left-1'}`} />
      </span>
    </button>
  )
}

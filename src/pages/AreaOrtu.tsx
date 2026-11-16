/** Area orang tua: progres, waktu belajar, batas waktu, pengaturan. */
import { useState } from 'react'
import BarAtas from '../components/BarAtas'
import { HURUF } from '../data/huruf'
import { PULAU, STAGES, stagesOfPulau } from '../data/stages'
import { useProgres } from '../lib/progres'
import { formatMenit } from '../lib/tanggal'
import { perluDiulang } from '../lib/latihan'
import TeksCampur from '../components/TeksCampur'

export default function AreaOrtu({ onKembali, onSertifikat }: { onKembali: () => void; onSertifikat: () => void }) {
  const { p, detikHariIni, streakAktif, totalBintang, setBatas, setEfek, setDemo, setNama, reset, semuaTamat } = useProgres()
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
            <button onClick={onSertifikat} className="tombol mt-3 w-full bg-jeruk py-3 text-lg text-white">🎓 Lihat & simpan sertifikat</button>
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

        <div className="text-center text-xs text-slate-500">
          Mengajoy — prototipe. Tanpa iklan, tanpa pembelian, tanpa tautan keluar. Data hanya disimpan di perangkat ini.
        </div>
      </div>
    </div>
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

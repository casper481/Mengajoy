/**
 * Sertifikat tamat Level 1–5. Digambar di <canvas> supaya bisa diunduh sebagai gambar PNG.
 */
import { useEffect, useRef } from 'react'
import Nuri from './Nuri'

const LEBAR = 1200
const TINGGI = 850

function tanggalIndonesia(d = new Date()) {
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function gambar(canvas: HTMLCanvasElement, nama: string, nuriSvg: SVGSVGElement | null) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  try {
    await document.fonts.ready
  } catch {
    /* abaikan */
  }
  // latar
  const g = ctx.createLinearGradient(0, 0, 0, TINGGI)
  g.addColorStop(0, '#e4f6ff')
  g.addColorStop(1, '#fff6dc')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, LEBAR, TINGGI)
  // bingkai
  ctx.strokeStyle = '#ffc93c'
  ctx.lineWidth = 18
  ctx.strokeRect(30, 30, LEBAR - 60, TINGGI - 60)
  ctx.strokeStyle = '#5cc8f0'
  ctx.lineWidth = 4
  ctx.strokeRect(58, 58, LEBAR - 116, TINGGI - 116)
  // bintang sudut
  const bintang = (x: number, y: number, r: number) => {
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI / 5) * i - Math.PI / 2
      const rr = i % 2 ? r * 0.45 : r
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
    }
    ctx.closePath()
    ctx.fillStyle = '#ffc93c'
    ctx.fill()
  }
  ;[[110, 110], [LEBAR - 110, 110], [110, TINGGI - 110], [LEBAR - 110, TINGGI - 110]].forEach(([x, y]) => bintang(x, y, 26))

  ctx.textAlign = 'center'
  ctx.fillStyle = '#33415c'
  ctx.font = '800 64px "Baloo 2", sans-serif'
  ctx.fillText('SERTIFIKAT', LEBAR / 2, 150)
  ctx.font = '600 30px "Baloo 2", sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText('Petualangan Mengaji Mengajoy', LEBAR / 2, 195)
  ctx.font = '600 30px "Baloo 2", sans-serif'
  ctx.fillText('Diberikan kepada', LEBAR / 2, 270)
  ctx.fillStyle = '#ff9f43'
  ctx.font = '800 76px "Baloo 2", sans-serif'
  ctx.fillText(nama.trim() || 'Ananda Hebat', LEBAR / 2, 360)
  ctx.fillStyle = '#33415c'
  ctx.font = '600 30px "Baloo 2", sans-serif'
  ctx.fillText('karena telah menyelesaikan petualangan belajar:', LEBAR / 2, 430)
  ctx.font = '700 28px "Baloo 2", sans-serif'
  ctx.fillText('Huruf Hijaiyah · Harakat · Menyambung Huruf', LEBAR / 2, 480)
  ctx.fillText('Mad & Tasydid · Tajwid Dasar', LEBAR / 2, 520)
  ctx.font = '600 26px "Baloo 2", sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText(tanggalIndonesia(), LEBAR / 2, 600)
  ctx.fillText('Langkah berikutnya: membaca Al-Quran bersama guru ngaji', LEBAR / 2, 700)

  // Nuri bertopi wisuda
  if (!nuriSvg) return
  const salinan = nuriSvg.cloneNode(true) as SVGSVGElement
  salinan.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(salinan))
  await new Promise<void>((ok) => {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 80, 420, 170, 170)
      ok()
    }
    img.onerror = () => ok()
    img.src = src
  })
}

export default function Sertifikat({ nama }: { nama: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const nuri = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) void gambar(ref.current, nama, nuri.current?.querySelector('svg') ?? null)
  }, [nama])

  const unduh = () => {
    const c = ref.current
    if (!c) return
    try {
      c.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'sertifikat-mengajoy.png'
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 5000)
      }, 'image/png')
    } catch {
      /* abaikan */
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div ref={nuri} className="hidden" aria-hidden>
        <Nuri ukuran={220} ekspresi="sorak" dipakai={{ kepala: 'topi-wisuda', dada: 'medali' }} />
      </div>
      <canvas ref={ref} width={LEBAR} height={TINGGI} className="w-full rounded-2xl shadow-xl" aria-label="Sertifikat" />
      <button onClick={unduh} className="tombol w-full bg-jeruk py-3 text-xl text-white">
        ⬇ Simpan sertifikat
      </button>
    </div>
  )
}

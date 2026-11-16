/** Tanggal lokal dalam format YYYY-MM-DD. */
export function hariIni(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function kemarin(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return hariIni(d)
}

/** Nomor hari sejak 1970 (dipakai untuk memilih misi harian bergiliran). */
export function nomorHari(): number {
  const d = new Date()
  return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000)
}

export function acak<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function formatMenit(detik: number): string {
  const m = Math.floor(detik / 60)
  if (m < 60) return `${m} menit`
  return `${Math.floor(m / 60)} jam ${m % 60} menit`
}

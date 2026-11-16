/**
 * Efek suara sederhana dengan Web Audio API (tanpa file).
 * Catatan: TIDAK ada suara untuk jawaban salah — sesuai aturan app.
 */
let ctx: AudioContext | null = null
let aktif = true

export function setEfekAktif(v: boolean) {
  aktif = v
}

function audio(): AudioContext | null {
  if (!aktif) return null
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function nada(freq: number, mulai: number, durasi: number, volume = 0.18, tipe: OscillatorType = 'sine') {
  const c = audio()
  if (!c) return
  const t = c.currentTime + mulai
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = tipe
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(volume, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + durasi)
  osc.connect(g).connect(c.destination)
  osc.start(t)
  osc.stop(t + durasi + 0.05)
}

/** "Ting!" untuk jawaban benar */
export function ting() {
  nada(1318.5, 0, 0.35, 0.2)
  nada(1975.5, 0.07, 0.45, 0.14)
}

/** Sorakan kecil (arpeggio ceria) */
export function sorak() {
  const not = [523.25, 659.25, 783.99, 1046.5, 1318.5]
  not.forEach((f, i) => nada(f, i * 0.09, 0.4, 0.16, 'triangle'))
}

/** Bunyi lembut saat kartu dibalik / tombol ditekan */
export function pop() {
  nada(660, 0, 0.12, 0.08, 'sine')
}

/** Perayaan akhir stage */
export function perayaan() {
  const not = [523.25, 659.25, 783.99, 659.25, 783.99, 1046.5]
  not.forEach((f, i) => nada(f, i * 0.13, 0.5, 0.15, 'triangle'))
}

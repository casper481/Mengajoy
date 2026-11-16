/**
 * Pemutar audio bacaan (huruf & harakat).
 * - TIDAK memakai text-to-speech.
 * - Mengecek dulu apakah file benar-benar ada (dan memang file audio).
 *   Kalau belum ada, kembalikan false — tampilan akan menulis
 *   "audio belum tersedia", tanpa error.
 */
const cache = new Map<string, Promise<boolean>>()

export function cekAudio(src: string): Promise<boolean> {
  let p = cache.get(src)
  if (!p) {
    p = fetch(src, { method: 'HEAD' })
      .then((r) => r.ok && (r.headers.get('content-type') ?? '').startsWith('audio'))
      .catch(() => false)
    cache.set(src, p)
  }
  return p
}

let sedangDiputar: HTMLAudioElement | null = null

export async function putar(src: string): Promise<boolean> {
  if (!(await cekAudio(src))) return false
  try {
    sedangDiputar?.pause()
    const a = new Audio(src)
    sedangDiputar = a
    await a.play()
    return true
  } catch {
    return false
  }
}

export const audioHuruf = (id: string) => `/audio/huruf/${id}.mp3`
export const audioSukuKata = (id: string) => `/audio/harakat/${id}.mp3`

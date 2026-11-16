/** Teks Indonesia yang berisi potongan huruf Arab: bagian Arab diberi font Arab & arah baca yang benar. */
const ARAB = /([؀-ۿ][؀-ۿً-ْ\s+]*[؀-ۿً-ْ]|[؀-ۿ][ً-ْ]*)/g

export default function TeksCampur({ teks }: { teks: string }) {
  const bagian = teks.split(ARAB)
  return (
    <span dir="auto">
      {bagian.map((b, i) =>
        i % 2 === 1 ? (
          <bdi key={i} className="arab mx-0.5 align-middle text-[1.5em] leading-none" dir="rtl">
            {b}
          </bdi>
        ) : (
          <span key={i}>{b}</span>
        ),
      )}
    </span>
  )
}

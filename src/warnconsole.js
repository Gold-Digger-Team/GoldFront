// warn-console.js
export function warnConsole() {
  const styleTitle = [
    'font-size: 32px',
    'font-weight: bold',
    'color: #b91c1c',
    'text-shadow: 1px 1px 0 #fff',
    'padding: 8px 0'
  ].join(';')

  const styleText = [
    'font-size: 14px',
    'color: #334155',
    'padding: 4px 0'
  ].join(';')

  // Tampilkan peringatan besar
  // (Note: ini bukan proteksi; hanya edukasi agar user tidak jadi korban self-XSS)
  if (typeof window !== 'undefined') {
    console.log('%cPERINGATAN!', styleTitle)
    console.log(
      "%cJangan tempelkan kode apapun di sini kalau Anda tidak paham. " +
      "Kode berbahaya dapat mencuri data Anda (self-XSS).",
      styleText
    )
  }
}

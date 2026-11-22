# J-Learn SMKN 1 Lahat — Static Edition 3.1

Versi ini disiapkan untuk GitHub Pages. Seluruh halaman berjalan sebagai HTML, CSS, dan JavaScript statis; tidak membutuhkan Flask, server Python, Render, atau kartu pembayaran.

## Publikasi di GitHub Pages
1. Ekstrak ZIP ini.
2. Unggah **isi folder** ke root repository `repal18/jlearn-smkn1lahat` (sejajar dengan folder `static`).
3. Buka Settings → Pages.
4. Pilih Deploy from a branch → `main` → `/(root)` → Save.
5. Tunggu proses publikasi, lalu buka `https://repal18.github.io/jlearn-smkn1lahat/`.

## Batasan Static Edition
- Tidak menggunakan backend Flask atau API server.
- Progres/XP disimpan lokal di browser/perangkat masing-masing melalui localStorage, bukan database terpusat.
- Fitur yang membutuhkan backend telah diganti dengan interaksi frontend lokal.
- Audio menggunakan Web Speech API browser; ketersediaan suara Jepang bergantung pada perangkat/browser.

## Struktur
- `index.html` dan halaman `.html` lain: halaman pembelajaran
- `static/css/style.css`: tampilan
- `static/js/main.js`: interaksi
- `static/images/`: aset gambar

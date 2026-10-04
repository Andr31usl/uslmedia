# Ciornă: blocul „Rezultate reale” pe Home

Aprobat din demo, de pus pe site **când cifrele din `REZULTATE`
(assets/rezultate.js) sunt reale** — pe Home nu intră cifre demonstrative.

Nimic de aici nu e încă legat de site. Pași la integrare:

1. `teaser.html` → în `index.html`, imediat după `</div><!-- /clients-strip -->`
   (înainte de `.testimoniale-section`).
2. `teaser.css` → la finalul lui `assets/styles.css`.
3. `teaser.js` → la finalul lui `assets/rezultate.js` (folosește obiectul
   `REZULTATE` de acolo; adună cifrele pe toate platformele).
4. `node tools/build-pages.mjs`, test desktop + telefon, commit.

Pe telefon graficul e ascuns intenționat (secțiunea completă vine oricum mai
jos în scroll); rămân cele 3 cifre și butoanele.

Opțional, discutat: link „Vezi rezultate” în hero, lângă „Vezi pachetele”.

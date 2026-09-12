# Librăria de clipuri

Aici stau toate videoclipurile din portofoliu, plus lista lor: `clipuri.mjs`.
Grila cu previewuri de pe www.uslmedia.ro/portofoliu/ se generează din lista
asta, deci un proiect nou înseamnă un fișier urcat aici și o intrare în listă.

## Cum adaugi un clip

1. Urcă fișierul video în folderul ăsta: **Add file** → **Upload files**.
   Nume fără spații și fără diacritice (`cafenea-reel.mp4`, nu
   `Reel cafenea final.mp4`). GitHub respinge fișiere peste 100 MB.
2. Deschide `clipuri.mjs` și adaugă la finalul listei `CLIPURI`:

   ```js
   {
     titlu: 'Cafenea-Nume Client',
     categorie: 'horeca',
     fisier: 'cafenea-reel.mp4'
   },
   ```

   Pentru un clip găzduit pe Vimeo, în loc de `fisier` pui `vimeo: '1222439482'`
   (doar numărul din adresa clipului).
3. Rulează `node tools/build-pages.mjs` și comite tot.

Ordinea din listă e ordinea din grilă. Categoriile posibile sunt cele din
`CATEGORII`, tot în `clipuri.mjs` — o categorie nouă adăugată acolo își
primește singură butonul de filtrare și numărul de proiecte.

Generatorul se oprește cu eroare și spune exact ce e greșit dacă un clip n-are
titlu, arată spre un fișier care nu există sau folosește o categorie inexistentă.

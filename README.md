# uslmedia.ro

Site-ul USL Media — agenție de marketing digital și producție video din București.
Găzduit pe GitHub Pages, domeniu `www.uslmedia.ro` (vezi `CNAME`).

## Structura

```
index.html            sursa de adevăr: markup-ul tuturor secțiunilor
assets/styles.css     tot CSS-ul
assets/app.js         navigația, formularele, modalele, newsletterul
despre/               \
servicii/              |
portofoliu/            |  generate din index.html — NU se editează manual
pachete/               |
colaboram/             |
colaboram-custom/      |
contact/              /
formular/             chestionarul de client (pagină separată, independentă)
tools/build-pages.mjs generatorul paginilor pe secțiuni
```

## Cum funcționează navigația

Site-ul rămâne o aplicație pe o singură pagină: toate secțiunile sunt în DOM
și comutarea între ele se face client-side, cu animația de tranziție intactă.
Diferența e că fiecare secțiune are și un **URL real** (`/servicii/`,
`/pachete/` etc.), servit ca fișier static propriu.

Asta înseamnă că:

- Google poate indexa fiecare secțiune separat, cu titlu și descriere proprii;
- un link către `/pachete/` deschide direct secțiunea corectă, chiar și cu
  JavaScript dezactivat (clasa `.active` e deja pusă în fișierul servit);
- pe telefon, unde secțiunile curg într-un scroll continuu, adresa se
  actualizează la fiecare click de meniu, iar intrarea directă pe un URL face
  scroll fix la secțiunea respectivă.

Maparea secțiune ↔ URL e în `PAGE_PATHS`, în `assets/app.js`. Dacă adaugi o
secțiune nouă, actualizeaz-o în ambele locuri: `PAGE_PATHS` și lista
`SECTIONS` din `tools/build-pages.mjs`.

## După orice modificare în index.html

Paginile din `despre/`, `servicii/` etc. sunt copii generate ale lui
`index.html`. Dacă modifici markup-ul, regenerează-le și comite rezultatul:

```bash
node tools/build-pages.mjs
```

Generatorul se oprește cu eroare dacă un tipar pe care se bazează (titlu,
canonical, clasa `.active`) nu mai există în `index.html` — în acest caz
actualizează întâi `tools/build-pages.mjs`.

Modificările făcute doar în `assets/styles.css` sau `assets/app.js` **nu**
necesită regenerare, fiindcă toate paginile le încarcă din același loc.

## SEO

- `robots.txt` și `sitemap.xml` sunt în rădăcină; sitemap-ul listează doar
  URL-uri care răspund real (fără `/colaboram-custom/`, marcat `noindex`).
- URL-ul canonic e `https://www.uslmedia.ro/`, ca să corespundă cu `CNAME`.
- Datele structurate (`ProfessionalService`, `WebSite`, `BreadcrumbList`) sunt
  în `<head>`; cele de breadcrumb sunt injectate de generator.
- `.nojekyll` dezactivează procesarea Jekyll pe GitHub Pages.

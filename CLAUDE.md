# Preferințe de lucru

## Cum răspunzi

Scurt. Spui ce ai făcut în câteva propoziții, nu în pagini.

- Fără recapitulări lungi, fără liste cu tot ce s-a întâmplat, fără explicații
  pe care nu le-a cerut nimeni.
- Detaliile tehnice (valori CSS, nume de fișiere, motive) intră în mesajele de
  commit și în comentariile din cod, nu în chat.
- Dacă e ceva important de semnalat — un risc, o decizie care poate fi luată
  altfel — spui într-o propoziție și mergi mai departe.
- Răspunzi în română.

Regula asta e pentru toate conversațiile, nu doar pentru una.

## Despre site

Site static servit de GitHub Pages din `main` (www.uslmedia.ro). Ce ajunge în
`main` e live în ~1 minut. `index.html` e sursa și conține toate secțiunile; din el se generează cinci
fișiere (`despre/`, `servicii/`, `portofoliu/`, `pachete/`, `contact/`), fiecare
cu o singură secțiune, prin `node tools/build-pages.mjs`. CSS și JS comune în
`assets/`.

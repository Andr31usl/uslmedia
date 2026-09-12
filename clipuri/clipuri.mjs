/**
 * LIBRĂRIA DE CLIPURI — aici se adaugă proiectele din portofoliu.
 *
 * Fiecare intrare din CLIPURI devine, la build, un card cu preview în grila de
 * pe /portofoliu/. După orice modificare în fișierul ăsta rulează:
 *
 *     node tools/build-pages.mjs
 *
 * și comite tot. Nu edita grila direct în index.html: e generată de aici și se
 * rescrie la fiecare build.
 *
 * Câmpurile unei intrări:
 *
 *   titlu      (obligatoriu) textul afișat sub preview
 *   categorie  (obligatoriu) un `id` din CATEGORII, mai jos
 *   fisier     numele fișierului video din folderul clipuri/
 *              — sau —
 *   vimeo      id-ul numeric al clipului, dacă e găzduit pe Vimeo
 *   poster     opțional: imagine arătată până se încarcă videoul
 *   slug       opțional: adresa de share (#clip=...). Se calculează singur din
 *              titlu; îl scrii doar ca să păstrezi un link mai vechi.
 *
 * Fișierele video se urcă în clipuri/, cu nume fără spații și fără diacritice.
 * GitHub respinge fișiere peste 100 MB — comprimă înainte dacă e cazul.
 */

/** Categoriile devin butoanele de filtrare. Numărul de pe buton se calculează singur. */
export const CATEGORII = [
  { id: 'evenimente', nume: 'Evenimente' },
  { id: 'imobiliare', nume: 'Imobiliare & Amenajări' },
  { id: 'horeca',     nume: 'Restaurante & Cafenele' },
  { id: 'social',     nume: 'Reels & Social Media' }
];

/** Ordinea de aici e ordinea din grilă. */
export const CLIPURI = [
  {
    titlu: 'Workshop-Rotary Cismigiu',
    categorie: 'evenimente',
    fisier: 'workshop-rotary-cismigiu.mp4'
  },
  {
    titlu: 'Cupa LazarxIoanid',
    categorie: 'evenimente',
    fisier: 'cupa-lazar-ioanid.mp4',
    slug: 'cupa-lazar-x-ioanid' // link vechi, dat mai departe — nu-l schimba
  },
  {
    titlu: 'Apartament-Renovision Design',
    categorie: 'imobiliare',
    fisier: 'apartament-renovision.mov'
  },
  {
    titlu: 'Real estate',
    categorie: 'imobiliare',
    vimeo: '1222439482'
  },
  {
    titlu: 'Teaser imobil',
    categorie: 'imobiliare',
    vimeo: '1222439487'
  },
  {
    titlu: 'Dynamic Reel',
    categorie: 'social',
    fisier: 'dynamic-reel.mp4'
  },
  {
    titlu: 'Restaurant-Corks',
    categorie: 'horeca',
    fisier: 'restaurant-corks.mp4'
  },
  {
    titlu: 'Cafenea-Lee Coffee',
    categorie: 'horeca',
    fisier: 'cafenea-lee-coffee.mp4'
  },
  {
    titlu: 'Latte Art-Lee Coffee',
    categorie: 'horeca',
    fisier: 'latte-art-lee-coffee.mp4'
  },
  {
    titlu: 'Reel-Lee Coffee',
    categorie: 'horeca',
    fisier: 'reel-lee-coffee.mp4'
  }
];

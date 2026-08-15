/*
 * /colaboram/ si /colaboram-custom/ NU sunt in lista: sunt pagini statice de
 * redirectare catre /formular/, scrise manual. Nu le regenera de aici.
 */

/**
 * Generează paginile pe secțiuni din index.html.
 *
 * index.html este singura sursă de adevăr pentru markup, CSS și JS. Fișierele
 * din /despre/, /servicii/ etc. sunt copii ale lui, cu <head>-ul rescris și cu
 * secțiunea corespunzătoare marcată ca activă, ca URL-ul să fie corect servit
 * și fără JavaScript. După orice modificare în index.html, rulează:
 *
 *     node tools/build-pages.mjs
 *
 * și comite fișierele regenerate.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://www.uslmedia.ro';

/** Secțiunile care primesc URL propriu. `id` este id-ul din DOM, fără "page-". */
const SECTIONS = [
  {
    id: 'despre',
    slug: 'despre',
    navId: 'nav-despre',
    breadcrumb: 'Despre',
    title: 'Despre USL Media | Agenție Video & Marketing Digital București',
    description:
      'Cine e în spatele USL Media: Ușurelu Radu Andrei, videograf și specialist marketing digital din București. Certificat HubSpot, peste 10 proiecte livrate pentru branduri locale.'
  },
  {
    id: 'servicii',
    slug: 'servicii',
    navId: 'nav-servicii',
    breadcrumb: 'Servicii',
    title: 'Servicii Marketing Digital & Producție Video București | USL Media',
    description:
      'Filmare video București, editare video, Reels & TikTok, social media growth, creare site-uri web și campanii Meta Ads. Servicii complete de marketing digital pentru afaceri din București.'
  },
  {
    id: 'portofoliu',
    slug: 'portofoliu',
    navId: 'nav-portofoliu',
    breadcrumb: 'Portofoliu',
    title: 'Portofoliu Video & Campanii | USL Media București',
    description:
      'Proiecte video realizate de USL Media pentru branduri, restaurante și afaceri din București: filmare cinematică, Reels, TikTok și conținut pentru social media.'
  },
  {
    id: 'preturi',
    slug: 'pachete',
    navId: 'nav-preturi',
    breadcrumb: 'Pachete & Prețuri',
    title: 'Pachete & Prețuri Marketing Video București | USL Media',
    description:
      'Pachete de producție video și marketing digital în București: abonament lunar cu 15 materiale, proiecte punctuale și colaborări personalizate. Ofertă în aceeași zi.'
  },
  {
    id: 'contact',
    slug: 'contact',
    navId: null,
    breadcrumb: 'Contact',
    title: 'Contact | USL Media — Agenție Marketing Digital București',
    description:
      'Contactează USL Media, agenție de marketing digital și producție video din București. Telefon 0771 300 127, email uslmedia.contact@gmail.com.'
  }
];

/**
 * GitHub Pages servește /assets/ cu un cache de zece minute, iar în fața lui
 * mai stă și CDN-ul. Fără o versiune în URL, un vizitator care a deschis
 * site-ul înainte de ultima modificare primește foaia de stil veche până îi
 * expiră cache-ul — și niciun refresh din browser nu ajută, pentru că nu
 * cache-ul lui e problema.
 *
 * Versiunea se calculează din conținutul fișierelor, deci se schimbă singură
 * exact când se schimbă ele și rămâne aceeași dacă nu s-a atins nimic.
 */
function assetVersion(...files) {
  const hash = createHash('sha256');
  for (const file of files) hash.update(readFileSync(join(ROOT, file)));
  return hash.digest('hex').slice(0, 8);
}

/** Înlocuiește exact o apariție; aruncă dacă tiparul nu mai există în sursă. */
function replaceOnce(html, pattern, replacement, label) {
  const matches = html.match(pattern);
  if (!matches) {
    throw new Error(
      `build-pages: tiparul "${label}" nu mai există în index.html. ` +
      `Actualizează tools/build-pages.mjs înainte de a regenera paginile.`
    );
  }
  return html.replace(pattern, replacement);
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Pune (sau actualizează) ?v=… pe foaia de stil și pe scriptul comun. */
function versionAssets(html, version) {
  html = replaceOnce(
    html,
    /href="\/assets\/styles\.css(\?v=[^"]*)?"/,
    `href="/assets/styles.css?v=${version}"`,
    'link către styles.css'
  );
  return replaceOnce(
    html,
    /src="\/assets\/app\.js(\?v=[^"]*)?"/,
    `src="/assets/app.js?v=${version}"`,
    'script app.js'
  );
}

/* index.html e sursa pentru toate celelalte pagini, deci primește versiunea
   întâi și se rescrie pe disc — altfel doar paginile generate ar fi corecte. */
const version = assetVersion('assets/styles.css', 'assets/app.js');
const src = versionAssets(readFileSync(join(ROOT, 'index.html'), 'utf8'), version);
writeFileSync(join(ROOT, 'index.html'), src);

function buildPage(section) {
  const url = `${ORIGIN}/${section.slug}/`;
  const title = escapeAttr(section.title);
  const description = escapeAttr(section.description);
  let html = src;

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, '<title>');

  html = replaceOnce(
    html,
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${description}">`,
    'meta description'
  );

  html = replaceOnce(
    html,
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${url}">`,
    'canonical'
  );

  html = replaceOnce(
    html,
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${title}">`,
    'og:title'
  );
  html = replaceOnce(
    html,
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${description}">`,
    'og:description'
  );
  html = replaceOnce(
    html,
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${url}">`,
    'og:url'
  );
  html = replaceOnce(
    html,
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${title}">`,
    'twitter:title'
  );
  html = replaceOnce(
    html,
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${description}">`,
    'twitter:description'
  );

  if (section.noindex) {
    html = replaceOnce(
      html,
      /<meta name="robots" content="[^"]*">/,
      '<meta name="robots" content="noindex, follow">',
      'meta robots'
    );
  }

  // Breadcrumb, ca Google să afișeze ierarhia în rezultate.
  const breadcrumb = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "${ORIGIN}/" },
        { "@type": "ListItem", "position": 2, "name": ${JSON.stringify(section.breadcrumb)}, "item": "${url}" }
      ]
    }
    </script>
`;
  html = replaceOnce(html, /(\r?\n\s*<\/head>)/, `${breadcrumb}$1`, '</head>');

  // Secțiunea corectă devine cea activă, ca pagina să fie corectă fără JS.
  html = replaceOnce(
    html,
    /<div class="page active" id="page-home">/,
    '<div class="page" id="page-home">',
    'page-home active'
  );
  html = replaceOnce(
    html,
    new RegExp(`<div class="page" id="page-${section.id}">`),
    `<div class="page active" id="page-${section.id}">`,
    `page-${section.id}`
  );

  // Link-ul de meniu marcat ca activ trebuie să corespundă secțiunii.
  html = replaceOnce(
    html,
    /(id="nav-home") class="active"/,
    '$1',
    'nav-home active'
  );
  if (section.navId) {
    html = replaceOnce(
      html,
      new RegExp(`(id="${section.navId}")`),
      '$1 class="active"',
      section.navId
    );
  }

  return html;
}

let count = 0;
for (const section of SECTIONS) {
  const dir = join(ROOT, section.slug);
  mkdirSync(dir, { recursive: true });
  // index.html folosește CRLF; păstrăm aceeași convenție în fișierele generate.
  const html = buildPage(section).replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`  /${section.slug}/  ${section.title}`);
  count++;
}
console.log(`\nGenerate ${count} pagini din index.html.`);

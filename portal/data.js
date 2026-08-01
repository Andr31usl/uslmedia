/*
  Baza de date a portalului USL Media.
  Acest fișier e "sursa de adevăr" pentru clienți — Claude îl editează direct
  când îi trimiți date noi în chat. Poți edita și tu manual dacă vrei,
  respectând structura de mai jos.

  Structură client:
  {
    id: "identificator-unic-fara-spatii",
    name: "Nume afacere",
    industry: "Domeniu",
    status: "activ" | "pauza" | "incheiat",
    startDate: "YYYY-MM-DD",
    contact: { person, phone, email, instagram, website, address },
    notes: "Observații libere despre client",
    pillars: [ { id, name, color, description } ],
    posts: [ { id, date: "YYYY-MM-DD", time: "HH:MM", location, pillarId, title, platform, status: "planificat"|"filmat"|"postat", notes } ]
  }
*/

const CLIENTS = [
  {
    id: "client-exemplu",
    name: "Client Exemplu (poți șterge)",
    industry: "HoReCa",
    status: "activ",
    startDate: "2026-06-01",
    contact: {
      person: "Nume Prenume",
      phone: "07xx xxx xxx",
      email: "contact@exemplu.ro",
      instagram: "@exemplu",
      website: "https://exemplu.ro",
      address: "Str. Exemplu nr. 1, București"
    },
    notes: "Acesta e un client demonstrativ ca să vezi cum arată portalul. Spune-mi datele clienților tăi reali și îi adaug eu aici.",
    pillars: [
      { id: "p1", name: "Educațional", color: "#2563EB", description: "Sfaturi și informații utile pentru audiență" },
      { id: "p2", name: "Behind the scenes", color: "#F59E0B", description: "Culise, echipă, proces de lucru" },
      { id: "p3", name: "Promo / Ofertă", color: "#10B981", description: "Produse, servicii, promoții" },
      { id: "p4", name: "Social proof", color: "#EC4899", description: "Recenzii, testimoniale, rezultate" }
    ],
    posts: [
      { id: "c1", date: "2026-08-05", time: "18:00", location: "Locație filmare, București", pillarId: "p1", title: "Idee postare / Reel", platform: "Instagram", status: "planificat", notes: "" },
      { id: "c2", date: "2026-08-08", time: "12:00", location: "Sediu client", pillarId: "p3", title: "Ofertă lună august", platform: "Instagram", status: "planificat", notes: "" }
    ]
  },
  {
    id: "piata-matache-food-trucks",
    name: "Piața Matache Food Trucks",
    industry: "Food Truck / Piață / Food",
    status: "activ",
    startDate: "2026-08-01",
    contact: {
      person: "Gianina Nica",
      phone: "0722417961",
      email: "nica.gianina@gmail.com",
      instagram: "",
      website: "",
      address: ""
    },
    notes: "Obiectiv: atragere clienți noi, vizibilitate & reach organic.\nPlatforme: Instagram, TikTok (conținut organic).\nPerioadă strategie: Aug 2026 – Ian 2027 (6 luni).\nPrezență actuală: postează ocazional, fără strategie clară.\nTip filmare: ambele — interior și exterior.\nPachet: 8 video / lună (Standard — 199€/lună).\nScript: Claude/USL Media recomandă, pe baza experienței.\n\nContext client: se diferențiază prin produse premium, preparate cu grijă și servite rapid. Clientul ideal e persoana care apreciază calitatea, revine pentru gust și consumă cafea, limonade, cocktailuri și gustări. Își doresc videoclipuri dinamice, apetisante și moderne, care să aducă oameni în locație și să vândă.\n\nSUMAR LUNAR PILONI (18 clipuri/lună, 108 în 6 luni, 10/lună IG, 8/lună TikTok):\n- Lifestyle & Vibe: 6/lună (IG 3, TT 3)\n- Educational & Info: 5/lună (IG 3, TT 2)\n- Story-telling: 4/lună (IG 2, TT 2)\n- Promotional: 3/lună (IG 2, TT 1)\n\nFORMATE DE REEL (14 formate testate, audiențe: Travelers, Families, Teens):\n01. POV Budget Challenge — \"Am venit cu X lei. Iată ce am luat.\" — fast-cut, cifra mare în thumbnail\n02. Day-in-the-life la Matache — Dimineață → prânz → după-amiaza. Atmosferă + mâncare + oameni\n03. Ce-am comandat? Rate my order — Creator comandă, arată totul, cere opinia în comments\n04. Before & After — Piața — Arhivă foto/video vs. prezent. Storytelling vizual al transformării\n05. Hidden gem reveal — \"Nu știai că există asta în București\" — hook puternic, final cu locație\n06. Meniu breakdown — Fiecare prep prezentat 3–5 sec. Preț vizibil. Voiceover simplu\n07. Family outing vlog-style — Familie reală, ieșire reală. UGC sau filmat de brand cu acordul lor\n08. Trend sound + food — Audio viral adaptat la preparatele din Matache. Editare pe beat\n09. Testimonial pe stradă — \"Te-am prins — ce ai mâncat și cum a fost?\" Răspuns sincer, neregizat\n10. Comparație: food truck vs. restaurant — \"Aceeași bani, experiențe diferite.\" Rezultat favorabil food truck-ului\n11. Collab cu micro-creator — Creator invitat (1k–20k) filmează propria experiență la Matache\n12. Sezon / ocazie specială — Halloween, Crăciun, Revelion — prep specific + decor + atmosferă\n13. Behind the scenes — Pregătire dimineață, mise-en-place, echipa. Umanizare brand\n14. \"Ce recomand\" — staff pick — Angajatul food truck-ului recomandă preferatul lui personal\n\nNotă strategie: distribuția IG/TT poate fi ajustată lunar în funcție de performanță. Audit lunar al engagement-ului per format recomandat. Formatele din Pillar 1 (Lifestyle) pot fi refolosite cross-platform fără refilmare.",
    pillars: [
      { id: "p1", name: "Lifestyle & Vibe", color: "#F59E0B", description: "Audiență: Travelers · Teens · 6 clipuri/lună (IG 3 / TT 3). Subiecte: atmosfera pieței dimineața vs. seara, POV mâncat în aer liber la Matache, \"hidden gem\" reveal, aesthetic shots cu mâncarea, vibe check (muzică live, weekend crowd, sezon), fast-cut cu trending audio pe TikTok." },
      { id: "p2", name: "Educational & Info", color: "#10B981", description: "Audiență: Families · Travelers · 5 clipuri/lună (IG 3 / TT 2). Subiecte: meniu breakdown cu preț vizibil, \"Cât costă o masă completă la Matache?\", istoria Pieței Matache, ghid pentru prima vizită, comparație cinstită food truck vs. restaurant." },
      { id: "p3", name: "Story-telling", color: "#EF4444", description: "Audiență: toate 3 audiențele · 4 clipuri/lună (IG 2 / TT 2). Subiecte: testimoniale reale filmate pe loc, behind the scenes (pregătire dimineață, mise-en-place, echipa), \"staff pick\", UGC repost cu context, transformarea Pieței (before & after)." },
      { id: "p4", name: "Promotional", color: "#8B5CF6", description: "Audiență: Teens · Families · 3 clipuri/lună (IG 2 / TT 1). Subiecte: ofertă specială de weekend cu CTA clar, giveaway / challenge, collab cu micro-creator local (1k–20k), sezon / ocazie specială (Halloween, Crăciun, Revelion)." }
    ],
    posts: []
  }
];

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
    notes: "Obiectiv: atragere clienți noi, vizibilitate & reach organic.\nPlatforme: Instagram, TikTok (conținut organic).\nPerioadă strategie: Aug 2026 – Ian 2027 (6 luni).\nPrezență actuală: postează ocazional, fără strategie clară.\nTip filmare: ambele — interior și exterior.\nPachet: 8 video / lună (Standard — 199€/lună).\nScript: Claude/USL Media recomandă, pe baza experienței.\n\nContext client: se diferențiază prin produse premium, preparate cu grijă și servite rapid. Clientul ideal e persoana care apreciază calitatea, revine pentru gust și consumă cafea, limonade, cocktailuri și gustări. Își doresc videoclipuri dinamice, apetisante și moderne, care să aducă oameni în locație și să vândă.\n\nSUMAR LUNAR PILONI (18 clipuri/lună, 108 în 6 luni, 10/lună IG, 8/lună TikTok):\n- Lifestyle & Vibe: 6/lună (IG 3, TT 3)\n- Educational & Info: 5/lună (IG 3, TT 2)\n- Story-telling: 4/lună (IG 2, TT 2)\n- Promotional: 3/lună (IG 2, TT 1)\n\nFORMATE DE REEL (14 formate testate, audiențe: Travelers, Families, Teens):\n01. POV Budget Challenge — \"Am venit cu X lei. Iată ce am luat.\" — fast-cut, cifra mare în thumbnail\n02. Day-in-the-life la Matache — Dimineață → prânz → după-amiaza. Atmosferă + mâncare + oameni\n03. Ce-am comandat? Rate my order — Creator comandă, arată totul, cere opinia în comments\n04. Before & After — Piața — Arhivă foto/video vs. prezent. Storytelling vizual al transformării\n05. Hidden gem reveal — \"Nu știai că există asta în București\" — hook puternic, final cu locație\n06. Meniu breakdown — Fiecare prep prezentat 3–5 sec. Preț vizibil. Voiceover simplu\n07. Family outing vlog-style — Familie reală, ieșire reală. UGC sau filmat de brand cu acordul lor\n08. Trend sound + food — Audio viral adaptat la preparatele din Matache. Editare pe beat\n09. Testimonial pe stradă — \"Te-am prins — ce ai mâncat și cum a fost?\" Răspuns sincer, neregizat\n10. Comparație: food truck vs. restaurant — \"Aceeași bani, experiențe diferite.\" Rezultat favorabil food truck-ului\n11. Collab cu micro-creator — Creator invitat (1k–20k) filmează propria experiență la Matache\n12. Sezon / ocazie specială — Halloween, Crăciun, Revelion — prep specific + decor + atmosferă\n13. Behind the scenes — Pregătire dimineață, mise-en-place, echipa. Umanizare brand\n14. \"Ce recomand\" — staff pick — Angajatul food truck-ului recomandă preferatul lui personal\n\nNotă strategie: distribuția IG/TT poate fi ajustată lunar în funcție de performanță. Audit lunar al engagement-ului per format recomandat. Formatele din Pillar 1 (Lifestyle) pot fi refolosite cross-platform fără refilmare.\n\nCALENDAR DE POSTĂRI · Aug–Oct 2026 (14 postări/lună, 42 total, detaliu în calendarul clientului):\n- August 2026 — Lansare & Awareness: creștem awareness, facem lumea să știe că Piața Matache există și merită vizitată. (6 Lifestyle, 4 Educational, 2 Story-telling, 2 Promo · 9 IG / 9 TT)\n- Septembrie 2026 — Engagement & Comunitate: creștem engagement și construim comunitate, îi facem pe oameni să interacționeze. (5 Lifestyle, 4 Educational, 3 Story-telling, 2 Promo · 9 IG / 9 TT)\n- Octombrie 2026 — Fidelizare & Sezon: fidelizăm comunitatea și profităm de sezonul de toamnă cu content emoțional și campanii tematice. (5 Lifestyle, 3 Educational, 4 Story-telling, 2 Promo · 10 IG / 9 TT)\n\nNotă: datele exacte din calendar au fost distribuite uniform în cadrul fiecărei săptămâni (planul original a specificat doar S1–S4, nu ziua exactă) — pot fi ajustate oricând la cerere.",
    pillars: [
      { id: "p1", name: "Lifestyle & Vibe", color: "#F59E0B", description: "Audiență: Travelers · Teens · 6 clipuri/lună (IG 3 / TT 3). Subiecte: atmosfera pieței dimineața vs. seara, POV mâncat în aer liber la Matache, \"hidden gem\" reveal, aesthetic shots cu mâncarea, vibe check (muzică live, weekend crowd, sezon), fast-cut cu trending audio pe TikTok." },
      { id: "p2", name: "Educational & Info", color: "#10B981", description: "Audiență: Families · Travelers · 5 clipuri/lună (IG 3 / TT 2). Subiecte: meniu breakdown cu preț vizibil, \"Cât costă o masă completă la Matache?\", istoria Pieței Matache, ghid pentru prima vizită, comparație cinstită food truck vs. restaurant." },
      { id: "p3", name: "Story-telling", color: "#EF4444", description: "Audiență: toate 3 audiențele · 4 clipuri/lună (IG 2 / TT 2). Subiecte: testimoniale reale filmate pe loc, behind the scenes (pregătire dimineață, mise-en-place, echipa), \"staff pick\", UGC repost cu context, transformarea Pieței (before & after)." },
      { id: "p4", name: "Promotional", color: "#8B5CF6", description: "Audiență: Teens · Families · 3 clipuri/lună (IG 2 / TT 1). Subiecte: ofertă specială de weekend cu CTA clar, giveaway / challenge, collab cu micro-creator local (1k–20k), sezon / ocazie specială (Halloween, Crăciun, Revelion)." }
    ],
    posts: [
      { id: "aug1", date: "2026-08-02", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Reel – Hidden gem reveal", platform: "Instagram + TikTok", status: "planificat", notes: "\"Nu știam că are Bucureștiul colțul ăsta\" — primele imagini din piață, atmosferă de dimineață" },
      { id: "aug2", date: "2026-08-04", time: "", location: "Piața Matache, București", pillarId: "p1", title: "POV Budget Challenge", platform: "TikTok", status: "planificat", notes: "\"Am venit cu 50 lei la Matache. Iată ce am luat.\" — fast-cut, cifra mare în thumbnail" },
      { id: "aug3", date: "2026-08-06", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Carousel – Ghid prima vizită", platform: "Instagram", status: "planificat", notes: "Unde parchezi, ce food truck-uri găsești, ce ore sunt deschise — util pentru familii și turiști" },
      { id: "aug4", date: "2026-08-09", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Trend sound + food shots", platform: "TikTok", status: "planificat", notes: "Audio viral + tranziții rapide între preparate — editare pe beat, fără voiceover" },
      { id: "aug5", date: "2026-08-11", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Reel – Meniu breakdown", platform: "Instagram", status: "planificat", notes: "\"Ce poți mânca la Matache?\" — fiecare prep prezentat 4 sec, preț vizibil pe ecran" },
      { id: "aug6", date: "2026-08-13", time: "", location: "Piața Matache, București", pillarId: "p3", title: "Behind the scenes", platform: "Instagram + TikTok", status: "planificat", notes: "Pregătire dimineață: cheful aprinde grătarul la 7:00 AM — umanizare brand, fără filtre" },
      { id: "aug7", date: "2026-08-15", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Day-in-the-life la Matache", platform: "TikTok", status: "planificat", notes: "Dimineață → prânz → după-amiaza în piață — atmosferă completă, voiceover relaxat" },
      { id: "aug8", date: "2026-08-17", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Carousel – Comparație", platform: "Instagram", status: "planificat", notes: "\"Aceiași bani: restaurant vs. food truck Matache\" — rezultat favorabil food truck-ului" },
      { id: "aug9", date: "2026-08-19", time: "", location: "Piața Matache, București", pillarId: "p3", title: "Testimonial pe stradă", platform: "Instagram + TikTok", status: "planificat", notes: "\"Te-am prins la Matache — ce ai mâncat?\" — reacții sincere, neregizate, 3 persoane" },
      { id: "aug10", date: "2026-08-21", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Aesthetic shots", platform: "TikTok", status: "planificat", notes: "Close-up: aburi, textură, culori vii — fără voiceover, muzică ambient, 15 sec" },
      { id: "aug11", date: "2026-08-23", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Reel – Istoria Pieței", platform: "Instagram", status: "planificat", notes: "De ce e specială Piața Matache — de la piața veche la food truck-uri moderne, 30 sec" },
      { id: "aug12", date: "2026-08-25", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Hidden gem – turist surprins", platform: "TikTok", status: "planificat", notes: "Turist filmat în timp ce descoperă locul — reacție autentică, fără script" },
      { id: "aug13", date: "2026-08-27", time: "", location: "Piața Matache, București", pillarId: "p4", title: "Rate my order – audiență", platform: "Instagram", status: "planificat", notes: "\"Am lăsat urmăritorii să-mi aleagă comanda\" — Stories poll + reveal Reel, 3 comenzi diferite, reacții autentice" },
      { id: "aug14", date: "2026-08-29", time: "", location: "Piața Matache, București", pillarId: "p4", title: "Giveaway – weekend special", platform: "Instagram + TikTok", status: "planificat", notes: "\"Votează preparatul preferat în comments și câștigă o masă pentru 2\" — CTA clar" },
      { id: "sep1", date: "2026-09-02", time: "", location: "Piața Matache, București", pillarId: "p1", title: "POV Budget Challenge v2", platform: "TikTok", status: "planificat", notes: "\"50 lei vs. 100 lei la Matache — ce diferență face?\" — comparație amuzantă, fast-cut" },
      { id: "sep2", date: "2026-09-04", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Carousel – Top 5 preparate", platform: "Instagram", status: "planificat", notes: "\"Top 5 lucruri de mâncat la Matache toamna asta\" — ranking cu poze, saved content" },
      { id: "sep3", date: "2026-09-06", time: "", location: "Piața Matache, București", pillarId: "p3", title: "Staff pick – recomandare angajat", platform: "Instagram + TikTok", status: "planificat", notes: "Cheful de la food truck preferat prezintă mâncarea lui preferată din meniu — autentic" },
      { id: "sep4", date: "2026-09-09", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Trend sound – sezon toamnă", platform: "TikTok", status: "planificat", notes: "Audio trending septembrie + preparate calde de toamnă — prime imagini de sezon" },
      { id: "sep5", date: "2026-09-11", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Reel – \"Cât costă o masă completă\"?", platform: "Instagram", status: "planificat", notes: "\"Intrare, fel principal, desert, băutură — total: X lei\" — transparență totală, fără surprize" },
      { id: "sep6", date: "2026-09-13", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Family outing vlog-style", platform: "Instagram + TikTok", status: "planificat", notes: "Familie reală: primul lor weekend la Matache — 60 sec, copii entuziasmați, prețuri vizibile" },
      { id: "sep7", date: "2026-09-15", time: "", location: "Piața Matache, București", pillarId: "p3", title: "Before & After – transformare", platform: "TikTok", status: "planificat", notes: "Arhivă foto piața veche vs. cum arată azi — storytelling emoțional, muzică nostalgică" },
      { id: "sep8", date: "2026-09-17", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Carousel – Kid-friendly guide", platform: "Instagram", status: "planificat", notes: "\"Ce mănâncă copiii la Matache?\" — ghid pentru părinți, 5 preparate recomandate cu prețuri" },
      { id: "sep9", date: "2026-09-19", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Vibe check – weekend crowd", platform: "Instagram + TikTok", status: "planificat", notes: "Sâmbătă la 12:00 în piață — energie, muzică, mulțime — fără script, 30 sec real footage" },
      { id: "sep10", date: "2026-09-21", time: "", location: "Piața Matache, București", pillarId: "p1", title: "\"Ce recomand\" challenge", platform: "TikTok", status: "planificat", notes: "\"Întreb 5 oameni la întâmplare ce recomandă\" — format rapid, răspunsuri diverse și amuzante" },
      { id: "sep11", date: "2026-09-23", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Reel – Ghid turist București", platform: "Instagram", status: "planificat", notes: "\"Ești turist în București? Skip restaurantele turistice, vino aici\" — hook puternic, locație tag" },
      { id: "sep12", date: "2026-09-25", time: "", location: "Piața Matache, București", pillarId: "p3", title: "UGC repost cu context", platform: "TikTok", status: "planificat", notes: "Repost cel mai bun UGC primit luna trecută + context din spatele filmării — comunitate" },
      { id: "sep13", date: "2026-09-27", time: "", location: "Piața Matache, București", pillarId: "p4", title: "Story poll – votează meniul", platform: "Instagram", status: "planificat", notes: "\"Care e preparatul pe care vreți să-l vedeți permanent pe meniu?\" — poll IG Stories + reel" },
      { id: "sep14", date: "2026-09-29", time: "", location: "Piața Matache, București", pillarId: "p4", title: "Ofertă specială weekend", platform: "Instagram + TikTok", status: "planificat", notes: "\"Sâmbătă și duminică: desert gratuit la orice comandă peste 45 lei\" — vizual clar, CTA simplu" },
      { id: "oct1", date: "2026-10-02", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Reel – Toamnă la Matache", platform: "Instagram + TikTok", status: "planificat", notes: "Primele frunze căzute în piață + preparate calde de toamnă — cinematic, muzică slow" },
      { id: "oct2", date: "2026-10-04", time: "", location: "Piața Matache, București", pillarId: "p1", title: "POV – Dimineață rece la Matache", platform: "TikTok", status: "planificat", notes: "\"E frig afară dar e cald la Matache\" — aburi, cafea, supă caldă — hook senzorial" },
      { id: "oct3", date: "2026-10-06", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Carousel – Meniu de toamnă", platform: "Instagram", status: "planificat", notes: "Preparatele noi de sezon explicate: ingrediente, gust, preț — saved content garantat" },
      { id: "oct4", date: "2026-10-09", time: "", location: "Piața Matache, București", pillarId: "p3", title: "Testimonial – client fidel", platform: "Instagram + TikTok", status: "planificat", notes: "\"Vin la Matache în fiecare weekend de 3 luni\" — portret scurt al unui client real, emoțional" },
      { id: "oct5", date: "2026-10-11", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Trend sound – toamnă", platform: "TikTok", status: "planificat", notes: "Audio viral octombrie + footage toamnă în piață — editare pe beat, frunze și mâncare" },
      { id: "oct6", date: "2026-10-13", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Reel – \"De ce food truck, nu restaurant\"", platform: "Instagram", status: "planificat", notes: "5 motive concrete în 30 sec — preț, atmosferă, autenticitate, viteză, experiență" },
      { id: "oct7", date: "2026-10-15", time: "", location: "Piața Matache, București", pillarId: "p3", title: "Behind the scenes – rețetă secretă", platform: "Instagram + TikTok", status: "planificat", notes: "\"Cum se face [preparatul iconic]\" — process video, cheful explică 45 sec fără să dezvăluie tot" },
      { id: "oct8", date: "2026-10-17", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Rate my order – Gen Z", platform: "TikTok", status: "planificat", notes: "\"Am lăsat 3 oameni să-mi aleagă comanda la Matache\" — format haios, reaction video" },
      { id: "oct9", date: "2026-10-19", time: "", location: "Piața Matache, București", pillarId: "p2", title: "Carousel – Ghid weekend București", platform: "Instagram", status: "planificat", notes: "\"Sâmbătă perfectă în București: Matache + plimbare + X\" — itinerariu, saved garantat" },
      { id: "oct10", date: "2026-10-21", time: "", location: "Piața Matache, București", pillarId: "p3", title: "UGC compilation", platform: "Instagram + TikTok", status: "planificat", notes: "\"Voi la Matache\" — compilație din cele mai bune stories/reels primite de la clienți în 3 luni" },
      { id: "oct11", date: "2026-10-23", time: "", location: "Piața Matache, București", pillarId: "p1", title: "Halloween special content", platform: "TikTok", status: "planificat", notes: "\"Matache de Halloween: decoruri, prep special, atmosferă\" — trend sezonier, reach organic" },
      { id: "oct12", date: "2026-10-25", time: "", location: "Piața Matache, București", pillarId: "p3", title: "3 luni la Matache – recap", platform: "Instagram", status: "planificat", notes: "\"Ce am construit în 3 luni\" — storytelling brand, numere, comunitate, mulțumire — emoțional" },
      { id: "oct13", date: "2026-10-27", time: "", location: "Piața Matache, București", pillarId: "p4", title: "Behind the scenes – rețetă surpriză", platform: "Instagram", status: "planificat", notes: "\"Cum se face preparatul iconic de la Matache?\" — cheful gătește 60 sec fără script, process video autentic" },
      { id: "oct14", date: "2026-10-29", time: "", location: "Piața Matache, București", pillarId: "p4", title: "Campanie Halloween giveaway", platform: "Instagram + TikTok", status: "planificat", notes: "\"Poartă un costum la Matache pe 31 oct și primești desertul gratis\" — UGC trigger garantat" }
    ]
  }
];

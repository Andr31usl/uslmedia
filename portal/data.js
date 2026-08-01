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
    id: "the-bar",
    name: "The bar",
    industry: "Restaurant / Cafenea / Food",
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
    notes: "Obiectiv: atragere clienți noi, vizibilitate & reach organic.\nPlatforme: TikTok, Instagram Reels, YouTube Shorts.\nPrezență actuală: postează ocazional, fără strategie clară.\nTip filmare: ambele — interior și exterior.\nPachet: 8 video / lună (Standard — 199€/lună).\nScript: Claude/USL Media recomandă, pe baza experienței.\n\nContext client: se diferențiază prin produse premium, preparate cu grijă și servite rapid. Clientul ideal e persoana care apreciază calitatea, revine pentru gust și consumă cafea, limonade, cocktailuri și gustări. Își doresc videoclipuri dinamice, apetisante și moderne, care să aducă oameni în locație și să vândă.",
    pillars: [],
    posts: []
  }
];

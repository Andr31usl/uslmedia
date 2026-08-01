/* ================= Config ================= */
const DATA_VERSION = 1; // bump asta când editezi manual data.js și vrei să anunți portalul
const PASSWORD_HASH = "0b089d81e1f2fd7f6d70cd74e206c7f638c037232ad8d6930d1847a9a50a0c6e";
const STORAGE_KEY = "usl_portal_data_v1";
const VERSION_KEY = "usl_portal_data_version";
const AUTH_KEY = "usl_portal_auth";

const PALETTE = ["#2563EB", "#F59E0B", "#10B981", "#EC4899", "#8B5CF6", "#06B6D4", "#EF4444", "#84CC16"];
const DOW = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
const MONTHS = ["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie"];

/* ================= State ================= */
let state = {
  clients: [],
  currentClientId: null,
  view: "dashboard", // dashboard | client
  clientView: "calendar", // calendar | list
  search: "",
  calYear: new Date().getFullYear(),
  calMonth: new Date().getMonth(),
};

/* ================= Utils ================= */
function uid(prefix) { return prefix + "_" + Math.random().toString(36).slice(2, 9); }
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function fmtDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ================= Auth ================= */
const loginScreen = document.getElementById("login-screen");
const appRoot = document.getElementById("app");
const loginForm = document.getElementById("login-form");
const loginInput = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

function isAuthed() { return localStorage.getItem(AUTH_KEY) === "1"; }

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const val = loginInput.value;
  const hash = await sha256(val);
  if (hash === PASSWORD_HASH) {
    localStorage.setItem(AUTH_KEY, "1");
    startApp();
  } else {
    loginError.textContent = "Parolă greșită.";
    loginInput.value = "";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem(AUTH_KEY);
  location.reload();
});

if (isAuthed()) {
  startApp();
} else {
  loginScreen.hidden = false;
}

/* ================= Data load / sync ================= */
function seedFromBase() {
  return JSON.parse(JSON.stringify(CLIENTS));
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    state.clients = seedFromBase();
    saveData();
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  } else {
    try {
      state.clients = JSON.parse(raw);
    } catch (e) {
      state.clients = seedFromBase();
    }
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.clients));
}

function checkVersionBanner() {
  const storedVersion = Number(localStorage.getItem(VERSION_KEY) || "0");
  const banner = document.getElementById("sync-banner");
  if (storedVersion !== DATA_VERSION) {
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }
}

document.getElementById("sync-reload-btn").addEventListener("click", () => {
  if (confirm("Sigur vrei să încarci datele actualizate din fișier? Orice modificări făcute doar în acest browser și netrimise mie se vor pierde.")) {
    state.clients = seedFromBase();
    saveData();
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
    document.getElementById("sync-banner").hidden = true;
    renderSidebar();
    if (state.view === "client" && !state.clients.find(c => c.id === state.currentClientId)) {
      state.view = "dashboard";
    }
    render();
  }
});

document.getElementById("sync-dismiss-btn").addEventListener("click", () => {
  localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  document.getElementById("sync-banner").hidden = true;
});

document.getElementById("export-btn").addEventListener("click", () => {
  const jsonStr = "const CLIENTS = " + JSON.stringify(state.clients, null, 2) + ";";
  openModal(`
    <h2>Export date (JSON)</h2>
    <p style="color:var(--text-dim);font-size:0.85rem;margin-bottom:0.9rem;">Copiază tot textul de mai jos și trimite-mi-l în chat ca să salvez permanent aceste modificări în fișierul de bază.</p>
    <textarea readonly style="width:100%;height:280px;background:var(--bg-alt);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:0.75rem;font-size:0.75rem;font-family:monospace;">${escapeHtml(jsonStr)}</textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="close-export">Închide</button>
    </div>
  `);
  document.getElementById("close-export").addEventListener("click", closeModal);
});

/* ================= App start ================= */
function startApp() {
  loginScreen.hidden = true;
  appRoot.hidden = false;
  loadData();
  checkVersionBanner();
  renderSidebar();
  render();
}

/* ================= Sidebar ================= */
const clientListEl = document.getElementById("client-list");
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
  state.search = searchInput.value.trim().toLowerCase();
  renderSidebar();
});

document.getElementById("add-client-btn").addEventListener("click", () => openClientModal());
document.getElementById("dashboard-link").addEventListener("click", () => {
  state.view = "dashboard";
  state.currentClientId = null;
  renderSidebar();
  render();
});

function renderSidebar() {
  const filtered = state.clients.filter(c => c.name.toLowerCase().includes(state.search));
  clientListEl.innerHTML = filtered.map(c => {
    const nextPost = upcomingPostsForClient(c)[0];
    return `
    <li class="client-list-item ${c.id === state.currentClientId ? "active" : ""}" data-id="${c.id}">
      <span class="name">${escapeHtml(c.name)}</span>
      <span class="meta">
        <span class="badge badge-${c.status}">${c.status}</span>
        <span>${escapeHtml(c.industry || "")}</span>
      </span>
      ${nextPost ? `<span class="meta">📅 ${fmtDate(nextPost.date)}</span>` : ""}
    </li>`;
  }).join("") || `<li class="empty-state">Niciun client găsit.</li>`;

  clientListEl.querySelectorAll(".client-list-item[data-id]").forEach(el => {
    el.addEventListener("click", () => {
      state.currentClientId = el.dataset.id;
      state.view = "client";
      state.clientView = "calendar";
      const now = new Date();
      state.calYear = now.getFullYear();
      state.calMonth = now.getMonth();
      renderSidebar();
      render();
    });
  });
}

/* ================= Helpers on data ================= */
function getClient(id) { return state.clients.find(c => c.id === id); }

function allPostsFlat() {
  const out = [];
  state.clients.forEach(c => {
    (c.posts || []).forEach(p => out.push({ ...p, clientId: c.id, clientName: c.name, pillar: (c.pillars || []).find(pl => pl.id === p.pillarId) }));
  });
  return out;
}

function upcomingPostsForClient(client, fromDate) {
  const today = fromDate || new Date().toISOString().slice(0, 10);
  return (client.posts || [])
    .filter(p => p.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

function upcomingPostsAll() {
  const today = new Date().toISOString().slice(0, 10);
  return allPostsFlat()
    .filter(p => p.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

/* ================= Render root ================= */
const mainContent = document.getElementById("main-content");

function render() {
  if (state.view === "client" && state.currentClientId) {
    renderClientDetail();
  } else {
    renderDashboard();
  }
}

/* ================= Dashboard ================= */
function renderDashboard() {
  const active = state.clients.filter(c => c.status === "activ").length;
  const totalPosts = allPostsFlat().length;
  const upcoming = upcomingPostsAll().slice(0, 8);

  mainContent.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Panou general</h1>
        <div class="sub">Toți clienții și postările programate, la un loc.</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" id="dash-add-client">+ Client nou</button>
      </div>
    </div>

    <div class="dash-grid">
      <div class="stat-card"><div class="label">Clienți activi</div><div class="value">${active}</div></div>
      <div class="stat-card"><div class="label">Total clienți</div><div class="value">${state.clients.length}</div></div>
      <div class="stat-card"><div class="label">Postări programate</div><div class="value">${totalPosts}</div></div>
      <div class="stat-card"><div class="label">Următoarele 7 zile</div><div class="value">${upcoming.filter(p => p.date <= addDays(new Date(), 7)).length}</div></div>
    </div>

    <div class="section-title">Postări viitoare (toți clienții)</div>
    <div class="upcoming-list">
      ${upcoming.length ? upcoming.map(postRowHtml).join("") : `<div class="empty-state">Nu ai postări viitoare programate.</div>`}
    </div>
  `;

  document.getElementById("dash-add-client").addEventListener("click", () => openClientModal());
  mainContent.querySelectorAll(".upcoming-item[data-client]").forEach(el => {
    el.addEventListener("click", () => {
      state.currentClientId = el.dataset.client;
      state.view = "client";
      state.clientView = "calendar";
      const [y, m] = el.dataset.date.split("-").map(Number);
      state.calYear = y;
      state.calMonth = m - 1;
      renderSidebar();
      render();
    });
  });
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function postRowHtml(p) {
  const [, m, d] = p.date.split("-");
  const color = p.pillar ? p.pillar.color : "#666";
  return `
    <div class="upcoming-item" data-client="${p.clientId}" data-date="${p.date}">
      <div class="date-chip"><div class="d">${d}</div><div class="m">${MONTHS[Number(m) - 1].slice(0, 3)}</div></div>
      <div class="info">
        <div class="title"><span class="pillar-dot" style="background:${color}"></span> ${escapeHtml(p.title)}</div>
        <div class="meta">
          <span class="client-tag">${escapeHtml(p.clientName)}</span>
          <span>🕒 ${escapeHtml(p.time || "-")}</span>
          <span>📍 ${escapeHtml(p.location || "-")}</span>
          <span class="status-tag status-${p.status}">${p.status}</span>
        </div>
      </div>
    </div>`;
}

/* ================= Client detail ================= */
function renderClientDetail() {
  const c = getClient(state.currentClientId);
  if (!c) { state.view = "dashboard"; render(); return; }
  const contact = c.contact || {};

  mainContent.innerHTML = `
    <div class="page-header">
      <div>
        <button class="btn btn-ghost btn-sm" id="back-btn">&larr; Toți clienții</button>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost btn-sm" id="edit-client-btn">Editează client</button>
        <button class="btn btn-danger btn-sm" id="delete-client-btn">Șterge client</button>
      </div>
    </div>

    <div class="client-header">
      <div class="top-row">
        <div>
          <h1>${escapeHtml(c.name)}</h1>
          <div class="industry">${escapeHtml(c.industry || "")} · <span class="badge badge-${c.status}">${c.status}</span> · client din ${fmtDate(c.startDate)}</div>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="label">Persoană contact</div><div class="val">${escapeHtml(contact.person || "-")}</div></div>
        <div class="info-item"><div class="label">Telefon</div><div class="val">${escapeHtml(contact.phone || "-")}</div></div>
        <div class="info-item"><div class="label">Email</div><div class="val">${escapeHtml(contact.email || "-")}</div></div>
        <div class="info-item"><div class="label">Instagram</div><div class="val">${escapeHtml(contact.instagram || "-")}</div></div>
        <div class="info-item"><div class="label">Website</div><div class="val">${escapeHtml(contact.website || "-")}</div></div>
        <div class="info-item"><div class="label">Adresă</div><div class="val">${escapeHtml(contact.address || "-")}</div></div>
      </div>
      ${c.notes ? `<div class="notes-box">${escapeHtml(c.notes)}</div>` : ""}
    </div>

    <div class="section-title">
      Piloni de conținut
      <button class="btn btn-ghost btn-sm" id="add-pillar-btn">+ Pilon nou</button>
    </div>
    <div class="pillars-row">
      ${(c.pillars || []).map(p => `
        <span class="pillar-chip" style="border-color:${p.color}55;">
          <span class="pillar-dot" style="background:${p.color}"></span>
          ${escapeHtml(p.name)}
          <span class="del" data-pillar="${p.id}" title="Șterge pilon">✕</span>
        </span>`).join("") || `<span style="color:var(--text-dim);font-size:0.85rem;">Niciun pilon definit încă.</span>`}
    </div>

    <div class="section-title">
      Calendar postări
      <div style="display:flex;gap:0.6rem;align-items:center;">
        <div class="view-toggle">
          <button data-view="calendar" class="${state.clientView === "calendar" ? "active" : ""}">Calendar</button>
          <button data-view="list" class="${state.clientView === "list" ? "active" : ""}">Listă</button>
        </div>
        <button class="btn btn-primary btn-sm" id="add-post-btn">+ Postare</button>
      </div>
    </div>

    <div id="client-calendar-area"></div>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    state.view = "dashboard"; state.currentClientId = null; renderSidebar(); render();
  });
  document.getElementById("edit-client-btn").addEventListener("click", () => openClientModal(c));
  document.getElementById("delete-client-btn").addEventListener("click", () => {
    if (confirm(`Ștergi definitiv clientul "${c.name}" și toate postările lui?`)) {
      state.clients = state.clients.filter(x => x.id !== c.id);
      saveData();
      state.view = "dashboard"; state.currentClientId = null;
      renderSidebar(); render();
    }
  });
  document.getElementById("add-pillar-btn").addEventListener("click", () => openPillarModal(c));
  document.getElementById("add-post-btn").addEventListener("click", () => openPostModal(c));
  mainContent.querySelectorAll(".pillar-chip .del").forEach(el => {
    el.addEventListener("click", () => {
      const pillarId = el.dataset.pillar;
      if (confirm("Ștergi acest pilon de conținut?")) {
        c.pillars = c.pillars.filter(p => p.id !== pillarId);
        saveData();
        renderClientDetail();
      }
    });
  });
  mainContent.querySelectorAll(".view-toggle button").forEach(el => {
    el.addEventListener("click", () => {
      state.clientView = el.dataset.view;
      renderClientContentArea(c);
      mainContent.querySelectorAll(".view-toggle button").forEach(b => b.classList.toggle("active", b === el));
    });
  });

  renderClientContentArea(c);
}

function renderClientContentArea(c) {
  const area = document.getElementById("client-calendar-area");
  if (state.clientView === "calendar") {
    area.innerHTML = calendarHtml(c, state.calYear, state.calMonth);
    wireCalendarNav(c);
  } else {
    const posts = [...(c.posts || [])].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    area.innerHTML = posts.length ? posts.map(p => postCardHtml(c, p)).join("") : `<div class="empty-state">Nicio postare programată pentru acest client.</div>`;
    wirePostCardActions(c);
  }
}

/* ================= Calendar ================= */
function calendarHtml(c, year, month) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const todayIso = new Date().toISOString().slice(0, 10);

  const postsByDay = {};
  (c.posts || []).forEach(p => {
    (postsByDay[p.date] = postsByDay[p.date] || []).push(p);
  });

  let cells = "";
  for (let i = 0; i < startOffset; i++) {
    const d = daysInPrevMonth - startOffset + i + 1;
    cells += `<div class="cal-cell outside"><div class="daynum">${d}</div></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const posts = (postsByDay[iso] || []).sort((a, b) => a.time.localeCompare(b.time));
    const shown = posts.slice(0, 3);
    cells += `
      <div class="cal-cell ${iso === todayIso ? "today" : ""}" data-date="${iso}">
        <div class="daynum">${d}</div>
        <div class="posts">
          ${shown.map(p => {
            const pillar = (c.pillars || []).find(pl => pl.id === p.pillarId);
            const color = pillar ? pillar.color : "#555";
            return `<div class="cal-post-pill" style="background:${color}" title="${escapeHtml(p.title)}">${escapeHtml(p.time)} ${escapeHtml(p.title)}</div>`;
          }).join("")}
          ${posts.length > 3 ? `<div class="cal-more">+${posts.length - 3} altele</div>` : ""}
        </div>
      </div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= trailing; i++) {
    cells += `<div class="cal-cell outside"><div class="daynum">${i}</div></div>`;
  }

  return `
    <div class="calendar-wrap">
      <div class="cal-nav">
        <button id="cal-prev">&larr;</button>
        <div class="cal-title">${MONTHS[month]} ${year}</div>
        <button id="cal-next">&rarr;</button>
      </div>
      <div class="cal-grid">
        ${DOW.map(d => `<div class="cal-dow">${d}</div>`).join("")}
        ${cells}
      </div>
    </div>
  `;
}

function wireCalendarNav(c) {
  document.getElementById("cal-prev").addEventListener("click", () => {
    state.calMonth--; if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
    renderClientContentArea(c);
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    state.calMonth++; if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
    renderClientContentArea(c);
  });
  mainContent.querySelectorAll(".cal-cell[data-date]").forEach(el => {
    el.addEventListener("click", () => {
      const iso = el.dataset.date;
      const postsThatDay = (c.posts || []).filter(p => p.date === iso);
      if (postsThatDay.length === 1) {
        openPostModal(c, postsThatDay[0]);
      } else if (postsThatDay.length > 1) {
        openDayModal(c, iso, postsThatDay);
      } else {
        openPostModal(c, null, iso);
      }
    });
  });
}

function openDayModal(c, iso, posts) {
  openModal(`
    <h2>${fmtDate(iso)}</h2>
    ${posts.map(p => postCardHtml(c, p)).join("")}
    <div class="modal-actions">
      <button class="btn btn-primary" id="day-add-post">+ Postare nouă în această zi</button>
      <button class="btn btn-ghost" id="day-close">Închide</button>
    </div>
  `);
  wirePostCardActions(c);
  document.getElementById("day-add-post").addEventListener("click", () => { closeModal(); openPostModal(c, null, iso); });
  document.getElementById("day-close").addEventListener("click", closeModal);
}

/* ================= Post cards (list view) ================= */
function postCardHtml(c, p) {
  const pillar = (c.pillars || []).find(pl => pl.id === p.pillarId);
  return `
    <div class="post-card" style="border-left-color:${pillar ? pillar.color : "#555"}" data-post="${p.id}">
      <div class="main">
        <div class="title">${escapeHtml(p.title)}</div>
        <div class="meta">
          <span>📅 ${fmtDate(p.date)}</span>
          <span>🕒 ${escapeHtml(p.time || "-")}</span>
          <span>📍 ${escapeHtml(p.location || "-")}</span>
          ${pillar ? `<span><span class="pillar-dot" style="background:${pillar.color}"></span> ${escapeHtml(pillar.name)}</span>` : ""}
          ${p.platform ? `<span>${escapeHtml(p.platform)}</span>` : ""}
          <span class="status-tag status-${p.status}">${p.status}</span>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-ghost btn-sm" data-edit="${p.id}">Editează</button>
        <button class="btn btn-danger btn-sm" data-del="${p.id}">Șterge</button>
      </div>
    </div>`;
}

function wirePostCardActions(c) {
  mainContent.querySelectorAll("[data-edit]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      const p = (c.posts || []).find(x => x.id === el.dataset.edit);
      openPostModal(c, p);
    });
  });
  mainContent.querySelectorAll("[data-del]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("Ștergi această postare?")) {
        c.posts = c.posts.filter(x => x.id !== el.dataset.del);
        saveData();
        closeModal();
        renderClientContentArea(c);
      }
    });
  });
}

/* ================= Modal generic ================= */
const modalRoot = document.getElementById("modal-root");
function openModal(html) {
  modalRoot.innerHTML = `<div class="modal-backdrop" id="modal-backdrop"><div class="modal">${html}</div></div>`;
  document.getElementById("modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "modal-backdrop") closeModal();
  });
}
function closeModal() { modalRoot.innerHTML = ""; }

/* ================= Client modal ================= */
function openClientModal(existing) {
  const c = existing || { id: "", name: "", industry: "", status: "activ", startDate: new Date().toISOString().slice(0, 10), contact: {}, notes: "", pillars: [], posts: [] };
  const contact = c.contact || {};
  openModal(`
    <h2>${existing ? "Editează client" : "Client nou"}</h2>
    <form id="client-form">
      <div class="form-row"><label>Nume afacere *</label><input name="name" required value="${escapeHtml(c.name)}"></div>
      <div class="form-grid-2">
        <div class="form-row"><label>Domeniu</label><input name="industry" value="${escapeHtml(c.industry)}"></div>
        <div class="form-row"><label>Status</label>
          <select name="status">
            <option value="activ" ${c.status === "activ" ? "selected" : ""}>Activ</option>
            <option value="pauza" ${c.status === "pauza" ? "selected" : ""}>Pauză</option>
            <option value="incheiat" ${c.status === "incheiat" ? "selected" : ""}>Încheiat</option>
          </select>
        </div>
      </div>
      <div class="form-row"><label>Client din data</label><input type="date" name="startDate" value="${escapeHtml(c.startDate)}"></div>
      <div class="form-grid-2">
        <div class="form-row"><label>Persoană contact</label><input name="person" value="${escapeHtml(contact.person)}"></div>
        <div class="form-row"><label>Telefon</label><input name="phone" value="${escapeHtml(contact.phone)}"></div>
      </div>
      <div class="form-grid-2">
        <div class="form-row"><label>Email</label><input name="email" value="${escapeHtml(contact.email)}"></div>
        <div class="form-row"><label>Instagram</label><input name="instagram" value="${escapeHtml(contact.instagram)}"></div>
      </div>
      <div class="form-grid-2">
        <div class="form-row"><label>Website</label><input name="website" value="${escapeHtml(contact.website)}"></div>
        <div class="form-row"><label>Adresă</label><input name="address" value="${escapeHtml(contact.address)}"></div>
      </div>
      <div class="form-row"><label>Notițe</label><textarea name="notes">${escapeHtml(c.notes)}</textarea></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" id="client-cancel">Anulează</button>
        <button type="submit" class="btn btn-primary">${existing ? "Salvează" : "Adaugă client"}</button>
      </div>
    </form>
  `);
  document.getElementById("client-cancel").addEventListener("click", closeModal);
  document.getElementById("client-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const contactObj = { person: data.person, phone: data.phone, email: data.email, instagram: data.instagram, website: data.website, address: data.address };
    if (existing) {
      Object.assign(existing, { name: data.name, industry: data.industry, status: data.status, startDate: data.startDate, notes: data.notes, contact: contactObj });
    } else {
      const newClient = {
        id: uid("client"), name: data.name, industry: data.industry, status: data.status,
        startDate: data.startDate, contact: contactObj, notes: data.notes, pillars: [], posts: []
      };
      state.clients.push(newClient);
      state.currentClientId = newClient.id;
      state.view = "client";
    }
    saveData();
    closeModal();
    renderSidebar();
    render();
  });
}

/* ================= Pillar modal ================= */
function openPillarModal(c) {
  let selectedColor = PALETTE[(c.pillars || []).length % PALETTE.length];
  openModal(`
    <h2>Pilon de conținut nou</h2>
    <form id="pillar-form">
      <div class="form-row"><label>Nume pilon *</label><input name="name" required placeholder="Ex: Educațional"></div>
      <div class="form-row"><label>Descriere</label><textarea name="description" placeholder="Despre ce e vorba în acest tip de conținut"></textarea></div>
      <div class="form-row">
        <label>Culoare</label>
        <div class="color-swatches">
          ${PALETTE.map(col => `<span class="swatch ${col === selectedColor ? "selected" : ""}" data-color="${col}" style="background:${col}"></span>`).join("")}
        </div>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" id="pillar-cancel">Anulează</button>
        <button type="submit" class="btn btn-primary">Adaugă pilon</button>
      </div>
    </form>
  `);
  mainContent; // no-op to keep linter calm
  modalRoot.querySelectorAll(".swatch").forEach(sw => {
    sw.addEventListener("click", () => {
      selectedColor = sw.dataset.color;
      modalRoot.querySelectorAll(".swatch").forEach(s => s.classList.toggle("selected", s === sw));
    });
  });
  document.getElementById("pillar-cancel").addEventListener("click", closeModal);
  document.getElementById("pillar-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    c.pillars = c.pillars || [];
    c.pillars.push({ id: uid("p"), name: data.name, description: data.description, color: selectedColor });
    saveData();
    closeModal();
    renderClientDetail();
  });
}

/* ================= Post modal ================= */
function openPostModal(c, existing, defaultDate) {
  const p = existing || { id: "", date: defaultDate || new Date().toISOString().slice(0, 10), time: "12:00", location: "", pillarId: "", title: "", platform: "Instagram", status: "planificat", notes: "" };
  const pillars = c.pillars || [];
  openModal(`
    <h2>${existing ? "Editează postare" : "Postare nouă"}</h2>
    <form id="post-form">
      <div class="form-row"><label>Titlu / idee *</label><input name="title" required value="${escapeHtml(p.title)}"></div>
      <div class="form-grid-2">
        <div class="form-row"><label>Data *</label><input type="date" name="date" required value="${escapeHtml(p.date)}"></div>
        <div class="form-row"><label>Ora</label><input type="time" name="time" value="${escapeHtml(p.time)}"></div>
      </div>
      <div class="form-row"><label>Locație</label><input name="location" value="${escapeHtml(p.location)}" placeholder="Ex: Sediu client, Str. Exemplu 1"></div>
      <div class="form-grid-2">
        <div class="form-row"><label>Pilon de conținut</label>
          <select name="pillarId">
            <option value="">— fără —</option>
            ${pillars.map(pl => `<option value="${pl.id}" ${p.pillarId === pl.id ? "selected" : ""}>${escapeHtml(pl.name)}</option>`).join("")}
          </select>
        </div>
        <div class="form-row"><label>Platformă</label>
          <select name="platform">
            ${["Instagram","TikTok","Facebook","YouTube","LinkedIn","Altele"].map(pl => `<option ${p.platform === pl ? "selected" : ""}>${pl}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="form-row"><label>Status</label>
        <select name="status">
          <option value="planificat" ${p.status === "planificat" ? "selected" : ""}>Planificat</option>
          <option value="filmat" ${p.status === "filmat" ? "selected" : ""}>Filmat</option>
          <option value="postat" ${p.status === "postat" ? "selected" : ""}>Postat</option>
        </select>
      </div>
      <div class="form-row"><label>Notițe</label><textarea name="notes">${escapeHtml(p.notes)}</textarea></div>
      <div class="modal-actions">
        <button type="button" class="btn btn-ghost" id="post-cancel">Anulează</button>
        <button type="submit" class="btn btn-primary">${existing ? "Salvează" : "Adaugă postare"}</button>
      </div>
    </form>
  `);
  document.getElementById("post-cancel").addEventListener("click", closeModal);
  document.getElementById("post-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    c.posts = c.posts || [];
    if (existing) {
      Object.assign(existing, data);
    } else {
      c.posts.push({ id: uid("post"), ...data });
    }
    saveData();
    closeModal();
    state.currentClientId = c.id;
    state.view = "client";
    renderSidebar();
    renderClientDetail();
  });
}

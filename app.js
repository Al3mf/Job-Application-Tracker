// Job Application Tracker - prototype
// Data lives in memory + localStorage (no backend yet).

// Only logged-in users can see the dashboard.
const currentUser = getCurrentUser();
if (!currentUser) window.location.replace("index.html");

// Each user has their own list of applications.
const LEGACY_KEY = "job-tracker-apps-v3"; // data saved before accounts existed
const STORAGE_KEY = `job-tracker-apps:${currentUser?.email}`;

const STATUS_LABELS = {
  "in-progress": "In Progress",
  "in-review": "In Review",
  "interview": "Interview",
  "closed": "Closed",
};

// Icons for "Applied via". Job sites use a letter badge in the site's color;
// the rest use simple line icons.
function letterIcon(letter, bg, fg = "#fff") {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="${bg}"/>` +
    `<text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="700" font-family="Arial, sans-serif" fill="${fg}">${letter}</text></svg>`;
}
function lineIcon(paths) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

const SOURCE_ICONS = {
  "LinkedIn": letterIcon("in", "#0A66C2"),
  "Indeed": letterIcon("i", "#2164F3"),
  "Handshake": letterIcon("H", "#D3FB52", "#1A1A1A"),
  "Glassdoor": letterIcon("G", "#0CAA41"),
  "Company website": lineIcon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  "Email": lineIcon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  "Career fair": lineIcon('<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.8 6 5.5"/>'),
  "Other": lineIcon('<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'),
};

function sourceIcon(source) {
  const span = document.createElement("span");
  span.className = "source-icon";
  span.innerHTML = SOURCE_ICONS[source] || "";
  return span;
}

let apps = load();

function load() {
  if (!currentUser) return []; // redirecting to the start screen
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
    // First login on this browser: keep the applications saved before accounts existed.
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY));
    if (Array.isArray(legacy)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
      localStorage.removeItem(LEGACY_KEY);
      return legacy;
    }
  } catch (e) { /* ignore */ }
  return []; // dashboard starts empty
}

// Only allow http(s) links so a saved link can never run code.
function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch (e) {
    return null;
  }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(apps)); } catch (e) { /* ignore */ }
}

function render() {
  document.querySelectorAll(".column").forEach((column) => {
    const status = column.dataset.status;
    const list = column.querySelector(".card-list");
    const items = apps.filter((a) => a.status === status);

    column.querySelector(".count").textContent = items.length;
    list.innerHTML = "";

    if (items.length === 0) {
      list.innerHTML = '<p class="empty">No applications</p>';
      return;
    }
    items.forEach((app) => list.appendChild(createCard(app)));
  });
}

function createCard(app) {
  const card = document.createElement("article");
  card.className = `card status-${app.status}`;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${app.position} at ${app.company}`);

  const title = document.createElement("h3");
  title.textContent = app.position;
  const company = document.createElement("p");
  company.className = "company";
  company.textContent = app.company;
  card.append(title, company);

  const tags = document.createElement("div");
  tags.className = "tags";
  [app.jobType, app.jobMode].forEach((text) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = text;
    tags.appendChild(tag);
  });
  const sourceTag = document.createElement("span");
  sourceTag.className = "tag tag-source";
  sourceTag.append(sourceIcon(app.source), app.source);
  tags.appendChild(sourceTag);
  if (app.referral === "yes") {
    const tag = document.createElement("span");
    tag.className = "tag tag-referral";
    tag.textContent = "Referral";
    tags.appendChild(tag);
  }
  card.appendChild(tags);

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `Applied ${app.date}`;
  card.appendChild(meta);

  card.addEventListener("click", () => openDetails(app.id));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetails(app.id);
    }
  });

  return card;
}

// ---------- New application modal ----------
const newDialog = document.getElementById("app-dialog");
const newForm = document.getElementById("app-form");
const sourcePreview = document.getElementById("source-preview");

document.getElementById("new-app-btn").addEventListener("click", () => {
  newForm.reset();
  newForm.date.value = new Date().toISOString().slice(0, 10);
  sourcePreview.innerHTML = "";
  newDialog.showModal();
});

newForm.source.addEventListener("change", () => {
  sourcePreview.innerHTML = SOURCE_ICONS[newForm.source.value] || "";
});

document.getElementById("cancel-btn").addEventListener("click", () => newDialog.close());

newForm.addEventListener("submit", () => {
  const data = new FormData(newForm);
  apps.push({
    id: Date.now(),
    position: data.get("position").trim(),
    company: data.get("company").trim(),
    jobType: data.get("jobType"),
    jobMode: data.get("jobMode"),
    date: data.get("date"),
    referral: data.get("referral"),
    source: data.get("source"),
    status: data.get("status"),
    link: safeUrl(data.get("link").trim()) || "",
  });
  save();
  // ---------- User menu ----------
if (currentUser) {
  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("user-avatar").textContent = currentUser.name
    .split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
document.getElementById("logout-btn").addEventListener("click", () => {
  logOut();
  window.location.replace("index.html");
});

render();
});

// ---------- Application details modal ----------
// Shows all the data read-only; only the status can be changed here.
const detailsDialog = document.getElementById("details-dialog");
const detailsForm = document.getElementById("details-form");
let currentId = null;

function openDetails(id) {
  const app = apps.find((a) => a.id === id);
  if (!app) return;
  currentId = id;

  document.getElementById("details-position").textContent = app.position;
  document.getElementById("details-company").textContent = app.company;
  document.getElementById("details-jobType").textContent = app.jobType;
  document.getElementById("details-jobMode").textContent = app.jobMode;
  document.getElementById("details-date").textContent = app.date;
  document.getElementById("details-referral").textContent = app.referral === "yes" ? "Yes" : "No";
  const sourceEl = document.getElementById("details-source");
  sourceEl.replaceChildren(sourceIcon(app.source), app.source);
  const linkEl = document.getElementById("details-link");
  const href = app.link && safeUrl(app.link);
  if (href) {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "job-link";
    a.textContent = "Open job posting ↗";
    linkEl.replaceChildren(a);
  } else {
    linkEl.replaceChildren(Object.assign(document.createElement("span"), { className: "muted", textContent: "—" }));
  }

  detailsForm.status.value = app.status;
  detailsDialog.showModal();
}

detailsForm.addEventListener("submit", () => {
  const app = apps.find((a) => a.id === currentId);
  if (app) {
    app.status = detailsForm.status.value;
    save();
    // ---------- User menu ----------
if (currentUser) {
  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("user-avatar").textContent = currentUser.name
    .split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
document.getElementById("logout-btn").addEventListener("click", () => {
  logOut();
  window.location.replace("index.html");
});

render();
  }
});

document.getElementById("details-close-btn").addEventListener("click", () => detailsDialog.close());

document.getElementById("delete-btn").addEventListener("click", () => {
  const app = apps.find((a) => a.id === currentId);
  if (!app || !confirm(`Delete "${app.position}" at ${app.company}?`)) return;
  apps = apps.filter((a) => a.id !== currentId);
  save();
  // ---------- User menu ----------
if (currentUser) {
  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("user-avatar").textContent = currentUser.name
    .split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
document.getElementById("logout-btn").addEventListener("click", () => {
  logOut();
  window.location.replace("index.html");
});

render();
  detailsDialog.close();
});

// ---------- User menu ----------
if (currentUser) {
  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("user-avatar").textContent = currentUser.name
    .split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
document.getElementById("logout-btn").addEventListener("click", () => {
  logOut();
  window.location.replace("index.html");
});

render();

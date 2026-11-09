// Job Application Tracker - prototype
// Data lives in memory + localStorage (no backend yet).

const STORAGE_KEY = "job-tracker-apps-v2";

const sampleApps = [
  { id: 1, position: "Software Engineer Intern", company: "Google", jobType: "Internship", jobMode: "Hybrid", date: "2026-10-28", referral: "yes", source: "LinkedIn", status: "in-progress" },
  { id: 2, position: "Frontend Developer", company: "Spotify", jobType: "Full-time", jobMode: "Remote", date: "2026-10-20", referral: "no", source: "Company website", status: "in-review" },
  { id: 3, position: "Web Developer", company: "Microsoft", jobType: "Full-time", jobMode: "On-site", date: "2026-10-15", referral: "no", source: "Handshake", status: "interview" },
  { id: 4, position: "UX Designer", company: "Amazon", jobType: "Part-time", jobMode: "Remote", date: "2026-09-30", referral: "no", source: "Indeed", status: "closed" },
];

let apps = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) { /* ignore */ }
  return sampleApps;
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
  card.className = "card";
  card.draggable = true;
  card.dataset.id = app.id;

  const title = document.createElement("h3");
  title.textContent = app.position;
  const company = document.createElement("p");
  company.className = "company";
  company.textContent = app.company;
  card.append(title, company);

  const tags = document.createElement("div");
  tags.className = "tags";
  [app.jobType, app.jobMode, app.source].forEach((text) => {
    if (!text) return;
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = text;
    tags.appendChild(tag);
  });
  if (app.referral === "yes") {
    const tag = document.createElement("span");
    tag.className = "tag tag-referral";
    tag.textContent = "Referral";
    tags.appendChild(tag);
  }
  card.appendChild(tags);

  const meta = document.createElement("div");
  meta.className = "meta";
  const date = document.createElement("span");
  date.textContent = app.date ? `Applied ${app.date}` : "No date";
  const del = document.createElement("button");
  del.className = "delete";
  del.title = "Delete";
  del.textContent = "×";
  del.addEventListener("click", () => {
    apps = apps.filter((a) => a.id !== app.id);
    save();
    render();
  });
  meta.append(date, del);
  card.appendChild(meta);

  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", app.id);
    card.classList.add("dragging");
  });
  card.addEventListener("dragend", () => card.classList.remove("dragging"));

  return card;
}

// Drag & drop between columns
document.querySelectorAll(".column").forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("drag-over");
  });
  column.addEventListener("dragleave", () => column.classList.remove("drag-over"));
  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over");
    const id = Number(e.dataTransfer.getData("text/plain"));
    const app = apps.find((a) => a.id === id);
    if (app) {
      app.status = column.dataset.status;
      save();
      render();
    }
  });
});

// New application modal
const dialog = document.getElementById("app-dialog");
const form = document.getElementById("app-form");

document.getElementById("new-app-btn").addEventListener("click", () => {
  form.reset();
  form.date.value = new Date().toISOString().slice(0, 10);
  dialog.showModal();
});

document.getElementById("cancel-btn").addEventListener("click", () => dialog.close());

form.addEventListener("submit", () => {
  const data = new FormData(form);
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
  });
  save();
  render();
});

render();

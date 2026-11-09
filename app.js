// Job Application Tracker - prototype
// Data lives in memory + localStorage (no backend yet).

const STORAGE_KEY = "job-tracker-apps";

const sampleApps = [
  { id: 1, company: "Google", position: "Software Engineer Intern", date: "2026-10-28", status: "in-progress", notes: "Finish cover letter" },
  { id: 2, company: "Spotify", position: "Frontend Developer", date: "2026-10-20", status: "in-review", notes: "" },
  { id: 3, company: "Microsoft", position: "Web Developer", date: "2026-10-15", status: "interview", notes: "Technical interview Nov 12" },
  { id: 4, company: "Amazon", position: "UX Designer", date: "2026-09-30", status: "closed", notes: "Rejected" },
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

  if (app.notes) {
    const notes = document.createElement("p");
    notes.className = "notes";
    notes.textContent = app.notes;
    card.appendChild(notes);
  }

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
    company: data.get("company").trim(),
    position: data.get("position").trim(),
    date: data.get("date"),
    status: data.get("status"),
    notes: data.get("notes").trim(),
  });
  save();
  render();
});

render();

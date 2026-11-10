# Job Application Tracker

A web dashboard to organize and follow up on job applications, from the moment you apply until the process is closed.

> Web Programming and Design project.

🔗 **Live demo:** <https://al3mf.github.io/Job-Application-Tracker/>

![Status](https://img.shields.io/badge/status-prototype-orange)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Dashboard](#dashboard)
- [Application fields](#application-fields)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Tech stack](#tech-stack)
- [Roadmap](#roadmap)
- [Team](#team)

---

## About

Looking for a job or internship means sending many applications through different platforms, and it is easy to lose track of where you applied, which stage each one is in, and who referred you. **Job Application Tracker** puts all of that in one board so you can see your whole job search at a glance.

## Features

- **Kanban board** with four stages: In Progress, In Review, Interview and Closed.
- **Starts empty**: the board has no sample data, you add your own applications.
- **+ New Application** button that opens a form to register a new application. Every dropdown starts on **"-"**, so you must pick a value before saving.
- **Application details**: click a card to open a menu with all its data.
- **Status changes only from the details menu**, so cards can't be moved by accident.
- **Delete** an application from its details menu (asks for confirmation).
- **Platform icons** for "Applied via" (LinkedIn, Indeed, Handshake, Glassdoor, company website, email, career fair).
- **Counters** on each column showing how many applications it holds.
- **Tags** on each card for job type, job mode, platform and referral.
- **Saved in the browser** with `localStorage`, so data stays after reloading the page.
- **Responsive** layout: columns stack vertically on phones.

## Screenshots

| Dashboard | Application details |
| --- | --- |
| ![Dashboard](docs/dashboard.png) | ![Application details](docs/details.png) |

## Dashboard

| Column | Meaning |
| --- | --- |
| 🟠 **In Progress** | You are preparing or just sent the application. |
| 🟣 **In Review** | The company is reviewing your application. |
| 🟢 **Interview** | You have been invited to one or more interviews. |
| ⚫ **Closed** | The process ended (offer, rejection or withdrawn). |

To move an application to another stage, click its card, choose the new **Status** and press **Save**.

## Application fields

When you click **+ New Application**, the form asks for the following. All fields are required, and every dropdown starts empty (**-**).

| Field | Type | Options |
| --- | --- | --- |
| Job position | Text | — |
| Company | Text | — |
| Job type | Dropdown | Full-time, Part-time, Internship |
| Job mode | Dropdown | Hybrid, Remote, On-site |
| Application date | Date | Defaults to today |
| Referral | Dropdown | Yes, No |
| Applied via | Dropdown | LinkedIn, Indeed, Handshake, Glassdoor, Company website, Email, Career fair, Other |
| Status | Dropdown | In Progress, In Review, Interview, Closed |

## Getting started

No installation or build step is needed.

1. Clone the repository:

   ```bash
   git clone https://github.com/Al3mf/Job-Application-Tracker.git
   ```

2. Open `index.html` in your browser.

Optionally, serve it locally (for example with the VS Code **Live Server** extension, or):

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

> To delete all your data at once, clear the site's `localStorage` from your browser's developer tools.

## Project structure

```
Job-Application-Tracker/
├── index.html   # Page layout: top bar, board columns, New Application and details menus
├── styles.css   # Styles for the dashboard, cards, tags, icons and menus
├── app.js       # Logic: rendering, forms, details menu, icons, localStorage
├── docs/        # Screenshots used in this README
└── README.md
```

## Tech stack

- **HTML5**: page structure and the native `<dialog>` element for the form.
- **CSS3**: Grid and Flexbox layout, CSS variables, media queries.
- **IBM Plex Sans** font (Google Fonts).
- **JavaScript (vanilla)**: DOM manipulation, form validation, `localStorage`.
- **Inline SVG** icons for the application platforms.

## Roadmap

- [x] Dashboard with four columns
- [x] New Application form
- [x] Application details menu with status update
- [x] Platform icons for "Applied via"
- [x] Published with GitHub Pages
- [ ] Edit the other fields of an application
- [ ] Search and filters (by company, job type, platform…)
- [ ] Notes and job posting link per application
- [ ] Statistics (applications per week, response rate)
- [ ] Backend and user accounts

## Team

| Name | Role |
| --- | --- |
| Alex | Developer |
| _Add your name_ | _Role_ |

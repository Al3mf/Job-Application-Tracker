# Job Application Tracker

A web dashboard to organize and follow up on job applications, from the moment you apply until the process is closed.

> Web Programming and Design project.

![Status](https://img.shields.io/badge/status-prototype-orange)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## Table of contents

- [About](#about)
- [Features](#features)
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
- **+ New Application** button that opens a form to register a new application.
- **Drag and drop** cards between columns to update their stage.
- **Counters** on each column showing how many applications it holds.
- **Tags** on each card for job type, job mode, platform and referral.
- **Delete** applications with the **×** button on each card.
- **Saved in the browser** with `localStorage`, so data stays after reloading the page.
- **Responsive** layout: columns stack vertically on phones.

## Dashboard

| Column | Meaning |
| --- | --- |
| 🟠 **In Progress** | You are preparing or just sent the application. |
| 🟣 **In Review** | The company is reviewing your application. |
| 🟢 **Interview** | You have been invited to one or more interviews. |
| ⚫ **Closed** | The process ended (offer, rejection or withdrawn). |

## Application fields

When you click **+ New Application**, the form asks for:

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

> To reset the sample data, clear the site's `localStorage` from your browser's developer tools.

## Project structure

```
Job-Application-Tracker/
├── index.html   # Page layout: top bar, board columns and New Application form
├── styles.css   # Styles for the dashboard, cards, tags and modal
├── app.js       # Logic: rendering, drag and drop, form handling, localStorage
└── README.md
```

## Tech stack

- **HTML5**: page structure and the native `<dialog>` element for the form.
- **CSS3**: Grid and Flexbox layout, CSS variables, media queries.
- **JavaScript (vanilla)**: DOM manipulation, HTML Drag and Drop API, `localStorage`.

## Roadmap

- [x] Dashboard with four columns
- [x] New Application form
- [x] Drag and drop between columns
- [ ] Edit an existing application
- [ ] Search and filters (by company, job type, platform…)
- [ ] Notes and job posting link per application
- [ ] Statistics (applications per week, response rate)
- [ ] Backend and user accounts

## Team

| Name | Role |
| --- | --- |
| Alex | Developer |
| _Add your name_ | _Role_ |

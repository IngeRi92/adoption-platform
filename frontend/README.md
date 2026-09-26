# Dog Adoption Platform

## Description

This project aims to create Europe's first centralized webpage and database with all European shelter dogs. The aim is to create a simple tool for people all over Europe to find the perfect dog for them and to promote adoption instead of buying a dog. Once the webpage is up and running effectively, we hope to offer more services to Europe's dog community.

## Features

* Search and browse available dogs in all of Europe
* Filter by sex, age, size, country and breed (search by ID number is planned)
* See information and photos of each dog
* Get the shelter's contact details
* Get general info from the top menu
* Donate (planned)
* Share happy dog stories in our blog (planned)

## Getting Started

Extensive documentation of this project can be found on the project's Confluence wiki:

https://getopet.atlassian.net/wiki/spaces/gp/pages/6193169/About+the+Get+a+pet+IT+project

The workflow of the project and all tasks can be found on the Trello Kanban board: https://trello.com/b/dNE3a02w/gp-kanban

## How the frontend was built

I developed the frontend step by step so I could learn the technology along the way. Each step has its own folder:

| Folder | Step |
|---|---|
| `1-html-css/` | The original design in plain HTML and CSS: structure, content, layout, spacing, fonts, colours |
| `2-tailwind/` | The same design rebuilt with Tailwind CSS. This is the design reference for the Next.js version |
| `3-javascript/` | Placeholder (empty); JavaScript and React are learned directly in the Next.js version |
| `web/` | The Next.js app — the version that will go live |

Separate pages for each menu item (Our Mission, Dog Tips & Info, etc.) will be added after the MVP.

## Frontend app (Next.js) — `frontend/web`

The Next.js version of the frontend, ported from the static Tailwind design in `frontend/2-tailwind` (issue #2).

### Tech stack

- Next.js 16.3.6 (App Router, Turbopack, `src/` folder)
- React, JavaScript (no TypeScript)
- Tailwind CSS v4 — theme colours and animations are in `src/app/globals.css` (moved from `2-tailwind/2-src/input.css`; no `tailwind.config.js` needed)
- ESLint
- Fonts via `next/font`: Poppins (main font) and Kalam (dog names)

### Requirements

- Node.js 24 LTS (developed with 24.19.0). Check with `node -v`.

### Commands

Run these from `frontend/web`:

| Command | What it does |
|---|---|
| `npm ci` | Install the exact dependency versions from `package-lock.json` |
| `npm run dev` | Start the development server at http://localhost:3000 (stop with `Ctrl + C`) |
| `npm run build` | Create a production build and check for errors |
| `npm run start` | Run the production build locally (after `npm run build`) |
| `npm run lint` | Check the code with ESLint (warnings about `<img>` are expected for now) |

### Data

This is a preview with sample data from `src/data/sampleDogs.js`. The field names match `backend/API_CONTRACT.md`, and the search filters are applied to the sample dogs. Connecting to the Django API comes in issue #1.

Online adoption inquiries are not available in the preview; the dog page shows the shelter's contact details and a note instead.

### Pages

| URL | Page |
|---|---|
| `/` | Home with the dog search form |
| `/dogs` | Search results; filters are in the URL, e.g. `/dogs?sex=female&size=small` |
| `/dogs/[id]` | Dog detail page, e.g. `/dogs/1` (unknown IDs show "Dog not found") |
| `/upload` | Placeholder — shelter login and uploads come after the MVP |

### Folder structure

| Folder | Contents |
|---|---|
| `src/app/` | Pages, layout, global styles, favicon |
| `src/components/` | Header, Footer, SearchForm, DogCard, DogImage |
| `src/data/` | Sample dog data |
| `src/lib/` | Search filters, data access, formatting helpers |
| `public/images/` | Images copied from `2-tailwind/4-images` |

### Changes from the static version (search form and fixes)

- "All Countries" sends no country filter (the static version sent `estonia`)
- Age groups are 0–1, 2–5 and 6+ years, plus an "All" option
- X-Large size removed (the backend supports small, medium and large)
- The Keyword field searches by breed
- ID Number search is hidden until #5 decides on an ID field
- The header's unclosed `<div>` is fixed and the Kalam font is now actually loaded
- The header no longer makes the page wider than the screen on phones

### Notes

- `next.config.mjs` sets `turbopack.root`, because the main project folder has its own `package-lock.json` and Next.js otherwise picks the wrong root folder.
- `create-next-app` also added `AGENTS.md` and `CLAUDE.md` (guidance for AI coding assistants).
- Not yet fully mobile-friendly: the pages fit the phone screen, but the header menu is cut off on small screens. This is planned for the UI/UX redesign.
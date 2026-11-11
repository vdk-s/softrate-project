# Softrate™ — Full-Stack Technology Blog Platform (MERN)

A production-ready corporate Technology Blog platform replicating the clean typography, generous spacing, and minimalist design language of the **Zoho Blog**.

---

## Key Architectural Highlights

- **Branding & Corporate Identity:**
  - Softrate wing mark and dark navy wordmark (`Softrate™`) with SVG and PNG fallbacks at `client/public/assets/softrate-logo.png`.
  - Zoho aesthetic: Crisp white cards (`#ffffff`), subtle borders (`#e8ebf0`), deep slate text (`#0f172a`), muted body copy (`#334155`), and signature red accents (`#e42525`).
  - Fluid responsive grid container (max 1200px) across desktop, tablet, and mobile.

- **Zero-Dependency Database Fallback:**
  - Auto-connects to any external MongoDB URI if provided via `MONGO_URI`.
  - If no external MongoDB daemon is active, it seamlessly starts an embedded persistent database engine and auto-seeds the data within 3 seconds.

- **Frontend Features (React + Vite):**
  - **Asymmetrical Featured Hero:** 1 primary spotlight article + 2 secondary stacked highlights.
  - **Dynamic Placeholder Thumbnails:** Zero broken image fallbacks! Category-colored minimalist geometric patterns with the Softrate wing mark watermark.
  - **Instant Live Search:** Debounced modal with `⌘K` / `Ctrl+K` global keyboard shortcut.
  - **Blog Detail Experience:** Sticky auto-generated Table of Contents (TOC), social share bar (LinkedIn, Twitter/X, Email, Copy Link), Markdown rendering with syntax-styled code blocks and copy buttons, Next/Prev article footer, and related posts.
  - **Editorial CMS Admin Panel (`/admin`):** Secure JWT auth, overview analytics, full post editor with live Markdown preview and Google SERP snippet preview, plus taxonomy management.

---

## Seeded Publications (From Research Papers)

1. *A Systematic Review of Digital Transformation Literature (2013-2021)* — Industry Insights
2. *Cloud-Native Computing: A Survey from the Perspective of Services* — Cloud Computing
3. *AI-Driven Cybersecurity Threats: Emerging Risks and Defensive Strategies* — Cybersecurity
4. *Robotic Process Automation as a Driver for Sustainable Innovation* — Technology & Innovation
5. *Software Engineering for Mobile Applications: Challenges and Solutions* — Web and Mobile App Development
6. *Data Quality Dimensions and Tools for Machine Learning* — Artificial Intelligence & Machine Learning
7. *Towards a Theory of Software Development Expertise* — Software Development

---

## Quick Start Commands

### 1. Start Server & Production UI (Single Port)
```bash
cd server
node server.js
```
The server serves both the REST API and the compiled React frontend at **`http://localhost:5000`**.

### 2. Run React in Hot-Reload Development Mode
```bash
cd client
npm run dev
```
Available at **`http://localhost:5173`** (proxied to `http://localhost:5000`).

### 3. Re-seed Database
```bash
cd server
node seed.js
```

### 4. Admin Credentials
- **Email:** `admin@softrate.com`
- **Password:** `admin123`
*(A 1-click "Autofill Demo Admin Credentials" button is also present on `/admin/login`)*


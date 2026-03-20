# Expiro — Design Document

**Authors:** Aarya Patil & Kanad Motiwale
**Class:** CS5610 Web Development — Northeastern University

---

## Project Description

Expiro is a store inventory and expiry tracking app built for grocery store staff. The idea came from a simple problem — stores lose money on expired products, and most of the time it happens because nobody caught it in time.

The app gives managers a live dashboard showing exactly which products have expired, which are expiring today, and which are coming up in the next few days. Employees get a focused view of what needs to come off the shelf during their shift and can log waste reports directly from the app.

Everything is role-based. Managers and employees log in with separate credentials and see different things. A manager can see waste trends and manage the full product list. An employee can view the expiry dashboard, browse products by category, and log or edit waste reports.

The backend is built with Node.js and Express, the database is MongoDB Atlas using the native driver, and the frontend is React 18 with hooks. Authentication is handled with Passport.js using a local strategy.

---

## User Personas

### Maria — Store Manager

Maria is 38 and manages a mid-sized grocery store. She's comfortable with technology and already uses spreadsheets and a point-of-sale system day to day, but neither of those tools give her visibility into expiry risk across the store.

Her biggest frustration is finding out about expired stock after the fact. She wants to know at the start of each day which products are close to expiring so she can put them on discount before they become a write-off. She also wants to track waste over time so she can make smarter ordering decisions.

> "I need to know at a glance which products are about to expire so I can act before they become a loss."

---

### Jay — Stock Room Employee

Jay is 24 and works part-time stocking shelves. He's comfortable with his phone and picks up new apps quickly. Right now he gets a printed sheet at the start of his shift listing products to pull, but it's often already outdated by the time he reads it.

Logging waste is even worse — it's a paper form that nobody seems to read. He wants something fast and digital that he can check and update without having to track down a manager.

> "I just want to open the app, see what needs to come off the shelf today, and mark it done."

---

## User Stories

### Manager Stories

**Reviewing the dashboard**
Maria arrives at work and opens Expiro on the store tablet. She logs in and lands on the Expiry Dashboard. She can immediately see 44 expired items, 14 expiring today, and 38 expiring in the next 3 days. She clicks "View Critical" to focus on the most urgent items first.

**Logging waste from the dashboard**
While reviewing the table, Maria notices 81 units of Romaine Lettuce expired 4 days ago. She clicks "Waste" directly from the row. The waste report modal opens with the product already filled in, so she just confirms the quantity and submits.

**Adding new stock**
A delivery arrives. Maria goes to Product Lookup, finds the Dairy category, and adds 200 units of Whole Milk with an expiry date of April 2. The product shows up in the dashboard immediately.

**Reviewing waste trends**
At the end of the week, Maria opens Waste Reports and filters by category. Produce accounts for most of the waste logged that week. She decides to reduce the standing order for Romaine Lettuce going forward.

---

### Employee Stories

**Starting a shift**
Jay logs in as an employee. The Expiry Dashboard greets him with today's date and a summary of what needs attention. He filters by Produce since that's his section, and works through the list of expired items to pull.

**Logging waste**
Jay pulls 30 units of expired Cucumber from Aisle 1. He clicks "Waste" on that row, confirms the quantity, selects "Expired" as the reason, enters his name, and submits. The record is saved and he moves on.

**Looking up a product**
A customer asks where the Frozen Meals are. Jay opens Product Lookup, clicks the Frozen Foods category card, and finds the shelf location in a few seconds.

**Fixing a mistake**
Jay realises he logged 30 units instead of 13 on a waste report. He goes to Waste Reports, finds his entry, and clicks Edit. The modal opens with the existing data pre-filled and he corrects the quantity and saves.

---

## Design Mockups

The app has six main screens. Wireframes for each are included below.

**Screen 1 — Login page**
A simple login form with username and password fields. No role selector — the role is determined server-side based on the credentials.

**Screen 2 — Expiry Dashboard**
The main screen for both roles. Shows three summary cards at the top (expired, expiring today, expiring in 3 days) followed by a filterable and searchable table. Each row shows the product name, category, shelf location, quantity, time left, waste risk level, and action buttons.

**Screen 3 — Expiry table rows**
Rows are color coded by urgency. Red background for expired items, orange for expiring today, yellow for items expiring within 3 days. Each row has a "Log Sale" and a "Waste" button.

**Screen 4 — Product Lookup**
A grid of category cards. Each card shows a category icon, name, and product count. There is also a search bar at the top for finding products by name or shelf location.

**Screen 5 — Waste Reports**
A table of all logged waste entries sorted by most recent. Each row shows the product, quantity removed, reason, who reported it, and the date. Employees can edit or delete their own entries. Managers can edit or delete any entry.

**Screen 6 — Log Waste and Edit Waste modals**
A modal form that opens over the current page. For logging new waste it starts blank. For editing an existing entry the fields are pre-filled with the current data. Fields include product, quantity removed, reason, reported by, and optional notes.

---

## Color System

The color choices were deliberately tied to urgency and food context.

| Element | Color | Reason |
|---|---|---|
| Expired items | Red / pink | Immediate action needed |
| Expiring today | Orange / peach | High priority |
| Expiring in 3 days | Yellow | Worth monitoring |
| Navigation and buttons | Dark green | Freshness, grocery context |
| Delete / destructive actions | Red | Standard danger convention |

---

## MongoDB Collections

**products**
Stores product name, category, shelf location, quantity, expiry date, and batch ID. Supports full CRUD — products can be added, viewed, updated, and deleted.

**waste_reports**
Stores a reference to the product, quantity removed, reason for removal, who reported it, the date, and optional notes. Also supports full CRUD — employees can log, view, edit, and delete their waste entries.
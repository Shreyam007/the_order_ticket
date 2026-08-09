# The Order Ticket — Antigravity Build Plan

Paste this entire file into Antigravity as the project brief. Tell Antigravity explicitly:

> "Implement this file phase by phase, in order. Do not start a new phase until the previous one is verified against its checklist. Do not deviate from the design system in Section 2 at any point in the project — every screen, in every phase, must visually match the 16 reference Stitch mockups exactly (colors, type, spacing, components). Re-read Section 2 before building any new screen."

The 16 reference screens (screenshots + exported HTML) are provided alongside this file — use them as the visual source of truth, not just the written description below.

---

## 0. PROJECT OVERVIEW

**The Order Ticket** — a full-stack, multi-restaurant food ordering platform with two roles (Customer, Restaurant Partner), JWT auth, and a live order-status pipeline (Fired → Preparing → Out for delivery → Delivered).

### Tech Stack (fixed — do not substitute)
- **Frontend:** React 18 + Vite, TailwindCSS (configured with the exact design tokens in Section 2 — no default Tailwind palette), React Router, `date-fns`
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas via Mongoose ODM
- **Auth:** JWT (access token + refresh token), bcrypt for password hashing, role-based middleware (`customer` / `restaurant`). Restaurant-partner accounts are provisioned separately from customer self-signup (a restaurant applies/is onboarded — do not expose restaurant signup on the same public form as customer signup).
- **Real-time:** Server-Sent Events (SSE) for live order status — one `/api/events` stream per authenticated user; no WebSockets, no polling.
- **File uploads:** Multer for dish photos / restaurant cover images (disk or S3-compatible bucket); store only the reference/URL in MongoDB.

### Environment variables (backend `.env`, never hardcoded, never committed)
```
MONGODB_URI=<your connection string — set locally, never pasted into any source file>
JWT_ACCESS_SECRET=<generate a strong random secret>
JWT_REFRESH_SECRET=<generate a strong random secret>
PORT=5000
CLIENT_URL=http://localhost:5173
```
`.env` must be in `.gitignore` from the very first commit. A `.env.example` may exist in the repo but must contain placeholders only, never a real value.

---

## 1. FOLDER STRUCTURE

```
order-ticket/
├── client/
│   ├── src/
│   │   ├── components/ui/        # shared design-system components (Section 2)
│   │   ├── components/layout/    # BulldogRail (top nav), ChartBar-equivalent header, ExpoColumn
│   │   ├── pages/customer/
│   │   ├── pages/restaurant/
│   │   ├── pages/auth/
│   │   ├── hooks/useSSE.js
│   │   ├── context/AuthContext.jsx
│   │   ├── context/CartContext.jsx
│   │   ├── api/
│   │   └── styles/tokens.css
├── server/
│   ├── models/     # User, Restaurant, Dish, Order, Address, Review
│   ├── routes/
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── middleware/roleGuard.js
│   ├── sse/eventBus.js
│   └── server.js
├── .env
├── .gitignore
└── README.md
```

---

## 2. DESIGN SYSTEM — "Industrial Kitchen Utilitarian" (LOCKED — replicate exactly on every screen)

Build this once as a shared component + token library in Phase 1, then reuse everywhere. Never redefine colors/fonts/spacing inline in a page component. These are the exact tokens Stitch generated — use them verbatim, not the earlier approximations.

### 2.1 Color tokens
```css
--background: #FCF9F0;
--surface-container-lowest: #FFFFFF;   /* card/ticket surfaces */
--surface-container-low: #F6F3EA;
--surface-container: #F1EEE5;
--surface-container-high: #EBE8DF;
--on-surface: #1C1C17;                 /* primary ink */
--on-surface-variant: #4D4540;         /* secondary text */
--outline: #7F756F;
--outline-variant: #D0C4BD;            /* hairline borders */

--primary: #15100D;                    /* near-black, primary buttons */
--on-primary: #FFFFFF;

--secondary: #7A5900;                  /* mustard, deep (text-on-tint use) */
--secondary-container: #FDC74D;        /* mustard, fill — "Preparing/Fired" status */
--on-secondary-container: #725300;

--tertiary: #001602;
--tertiary-container: #002E08;         /* herb green family — "Ready/Completed" status; use #2E4F2D/#3F6B3E as the practical fill for UI elements per the mockups */

--error: #BA1A1A;                      /* brick red — urgent/spicy/cancelled */
--error-container: #FFDAD6;
--on-error-container: #93000A;

--plum: #5C3A5C;                       /* logistics/out-for-delivery status (not in Stitch's Material tokens above but used consistently across the mockups — keep it) */
```
Status color mapping (do not deviate): **New/Fired = mustard, Preparing = mustard (darker/deep variant), Ready/Completed = herb green, Out for delivery = plum, Cancelled/Urgent/Spicy = brick red.**

### 2.2 Typography
```css
--font-display: 'Barlow Condensed';   /* headlines, nav, uppercase labels — 600-700 weight */
--font-body: 'Karla';                 /* descriptions, paragraphs — 400-500 weight */
--font-mono: 'JetBrains Mono';        /* prices, order IDs, timestamps, quantities */
```
Type scale (from the generated DESIGN.md — use these exact sizes):
- `display-xl`: 48px / 700 / Barlow Condensed
- `headline-lg`: 32px / 700
- `headline-md`: 24px / 600
- `body-lg`: 18px / 400 / Karla
- `body-md`: 16px / 400 / Karla
- `data-mono`: 14px / 500 / JetBrains Mono, letter-spacing -0.02em
- `price-lg`: 20px / 700 / JetBrains Mono

### 2.3 Shape & elevation rules (strict — these are what make the system read as "industrial kitchen," not generic)
- **No shadows, no blurs, no glassmorphism, anywhere.** Depth comes from borders and flat tonal layers only.
- Corner radius: 2px on small elements (inputs, tags), 6px on larger containers (cards, tickets). No fully-rounded "pill/bubble" shapes except where explicitly noted (none, currently).
- Borders: 1px `outline-variant` (hairline) for subtle separation, thickens to 2px `on-surface` (ink) on focus/active states.
- **The Cut Edge:** any "ticket" surface (order card, receipt, confirmation ticket) gets a zigzag torn-paper bottom edge via `clip-path` polygon — this is a signature element, not optional decoration.
- **Luggage-tag status tags:** one clipped/angled corner + a small punched-hole circle on the opposite side.
- **Bulldog Rail:** the primary horizontal nav — each tab looks like a paper slip with a small bulldog-clip icon holding it to the top bar.
- **Section dividers:** dashed rule with a scissors icon and mono caption, e.g. `- - - ✂ - - - ORDER SUMMARY - - - ✂ - - -`.
- **Checkboxes:** simple squares with a heavy "X" mark (not a checkmark) — a chef's quick mark on a ticket.
- **Quantity steppers:** large thick square minus/plus blocks flanking a mono-font count in the center.
- **Buttons:** 2px border, square-ish corners, Barlow Condensed uppercase label. Hover/active state inverts colors (ink background, light text) rather than changing shadow/elevation.

### 2.4 Shared components to build first (Phase 1)
- `<BulldogRail>` — top navigation with clip-icon active-tab treatment (customer variant: Home/Orders/Cart/Profile; restaurant variant: left vertical rail — Orders/Menu/Analytics/Settings, per the `expo_rail_dashboard` mockup).
- `<TicketCard>` — white/`surface-container-lowest` card, 1px strong border, zigzag bottom edge, optional luggage-tag status in the top-right corner. Used for cart, receipts, confirmation, order-history rows, expo-rail order cards.
- `<StatusTag status="fired|preparing|ready|out_for_delivery|delivered|cancelled">` — luggage-tag shape, ward-color mapping from 2.1, bold uppercase Barlow Condensed text.
- `<QtyStepper>` — thick square minus/plus + mono count.
- `<ScissorsDivider label="...">` — dashed rule + scissors icon + mono caption.
- `<PriceLine item qty price>` — mono receipt-style line with dot-leaders (`×2  Margherita Pizza .......... ₹380`).
- `<StatusFlow currentStage>` — the 4-stage horizontal progress strip used on confirmation + tracking screens.

---

## 3. SCREENS (16 reference mockups provided — build to match exactly)

| # | Screen (source folder) | Route | Role |
|---|---|---|---|
| 1 | `login_the_order_ticket` | `/login` | public |
| 2 | `sign_up_the_order_ticket` | `/signup` | public |
| 3 | `discover_the_order_ticket` | `/` | customer |
| 4 | `search_results_the_order_ticket` | `/search` | customer |
| 5 | `the_burger_joint_menu` (restaurant detail + menu) | `/restaurant/:id` | customer |
| 6 | `dish_customization_the_order_ticket` | modal over `/restaurant/:id` | customer |
| 7 | `shopping_cart_the_order_ticket` | `/cart` | customer |
| 8 | `checkout_the_order_ticket` | `/checkout` | customer |
| 9 | `order_confirmation_the_order_ticket` | `/order/:id/confirmation` | customer |
| 10 | `live_order_tracking_the_order_ticket` | `/order/:id/track` | customer |
| 11 | `order_history_the_order_ticket` | `/orders` | customer |
| 12 | `full_receipt_the_order_ticket` | `/orders/:id/receipt` | customer |
| 13 | `customer_profile_settings_the_order_ticket` | `/profile` | customer |
| 14 | `expo_rail_dashboard_the_order_ticket` | `/restaurant/orders` | restaurant |
| 15 | `menu_management_the_order_ticket` | `/restaurant/menu` | restaurant |
| 16 | `restaurant_analytics_the_order_ticket` | `/restaurant/analytics` | restaurant |

**Screen 1 (Login) — security note:** any sample text shown in the reference mockup's fields is placeholder content for visual reference only. On a real page load: both fields empty, no `defaultValue`, sample text as `placeholder` attribute only, `autoComplete="email"` / `autoComplete="current-password"` set correctly, no hardcoded demo credentials anywhere in the component.

---

## 4. DATA MODELS (high-level — Antigravity should refine exact schemas during Phase 0/1)

- **User** — role (`customer`|`restaurant`), name, email, passwordHash, phone, addresses[] (customer), restaurantId (restaurant role only)
- **Restaurant** — name, cuisine[], coverImage, rating, avgPrepTime, isOpen (bool — drives the "Kitchen Open/Closed" pill on Screen 14), ownerId
- **Dish** — restaurantId, name, description, price, category, isVeg, spiceLevel (0-3), addOns[], isAvailable
- **Order** — customerId, restaurantId, items[] (dishId, qty, addOns, price snapshot), status (`new`|`preparing`|`ready`|`out_for_delivery`|`delivered`|`cancelled`), orderNumber (e.g. `FT-9012` matching the mockup format), placedAt, riderInfo, deliveryAddress, paymentMethod, subtotal/deliveryFee/tax/total
- **Review** — orderId, customerId, restaurantId, rating, foodQuality, text, createdAt
- **Address** — customerId, label (home/work/other), full address, isDefault

---

## 5. REAL-TIME (SSE) SPEC

Single endpoint: `GET /api/events` (JWT-authenticated, kept-open stream).

Events:
- `order:created` → notifies the restaurant's Orders dashboard (Screen 14) so a new ticket appears in the "New" column live.
- `order:statusChanged` → payload `{ orderId, status }` — drives: customer's live tracking screen (10) status-flow update, order history (11) status tag, restaurant's expo-rail column move (new → preparing → ready), all without a page refresh.
- `order:riderAssigned` → updates the rider info card on Screen 10.
- `review:new` → appears on the restaurant analytics screen's "Recent reviews" feed.

Backend: `sse/eventBus.js` maintains `userId → response stream(s)`; any relevant DB write calls `eventBus.emit(...)` targeting both the customer and the restaurant owner as appropriate (an order status change matters to both sides).

Frontend: single `useSSE()` hook per session; a lightweight event context lets any subscribed component (expo-rail columns, tracking status strip, notification bell) react without polling.

---

## 6. AUTH SPEC

- `POST /api/auth/signup` — customer self-signup (Screen 2)
- `POST /api/auth/login` — role-aware; returns access token (~15min) + refresh token (httpOnly cookie, ~7 days)
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password` / `POST /api/auth/reset-password`
- Restaurant-partner accounts: seed/create via a separate admin-provisioning route or a seed script — not exposed on the public signup form (this matches a real multi-restaurant marketplace, where restaurants are onboarded, not self-registered like customers).
- `roleGuard('customer' | 'restaurant')` middleware on every protected route.
- Passwords hashed with bcrypt (cost factor 12). Never log or return password hashes.

---

## 7. PHASED BUILD PLAN — execute strictly in order

For every phase: **build → run locally → self-verify against the checklist → report a short summary of what was built and the verification result → wait for go-ahead before the next phase** (or proceed automatically only if explicitly told to run all phases unattended).

### **Phase 0 — Scaffold**
- Init `client/` (Vite + React + Tailwind) and `server/` (Express + Mongoose) per the folder structure in Section 1.
- Set up `.env`, `.gitignore` (must include `.env`, `node_modules`, `dist`).
- Connect to MongoDB Atlas using `MONGODB_URI` from `.env`; log only "MongoDB connected" on success, never the URI itself.
- Configure Tailwind with every token from Section 2.1/2.2 as custom theme values.
- Install/configure Google Fonts (Barlow Condensed, Karla, JetBrains Mono).

**Verify:** server boots and logs "MongoDB connected"; client boots on Vite dev server; a blank page renders using `--background` and all three fonts load correctly. No secrets in any committed file.

### **Phase 1 — Design system + Auth**
- Build every shared component in Section 2.4.
- Build Screens 1 & 2 (Login, Sign up) wired to real `/api/auth` endpoints.
- Implement JWT issuing/verification, `AuthContext`, protected route wrapper, `roleGuard` middleware.

**Verify:** can sign up a new customer end-to-end (lands in MongoDB `users` collection), can log in and receive a valid JWT, protected routes redirect unauthenticated users to `/login`. Visually diff Login + Sign up against the reference screenshots — flag any deviation (torn-edge card, Barlow Condensed headline, mustard CTA, etc.) before continuing.

### **Phase 2 — Discovery & browsing (Screens 3, 4, 5)**
- Models: `Restaurant`, `Dish`.
- Endpoints: list/search restaurants (with cuisine/rating/price filters matching Screen 4's filter sidebar), get restaurant detail + menu grouped by category.
- Seed a handful of realistic restaurants + dishes for development/testing.

**Verify:** Discover screen pulls real restaurants from MongoDB (not hardcoded), search + filters actually filter the query server-side, restaurant detail page renders the real menu grouped by category with working category-jump nav.

### **Phase 3 — Cart & customization (Screens 6, 7)**
- Client-side `CartContext` (persisted appropriately — not localStorage per the artifact rules if this ever becomes an artifact, but fine as normal React app state/sessionStorage on a real deployed site) holding selected dishes, quantities, add-ons, special instructions.
- Dish customization modal wired to real add-on data from the `Dish` model; live price recalculation as options change.
- Cart screen renders real line items in the receipt-style `<PriceLine>` format with a real subtotal/delivery/tax/total breakdown.

**Verify:** adding items with different customizations correctly reflects in cart quantities/pricing; removing/adjusting quantity updates totals live; promo code field is at least stubbed with a couple of test codes that apply a real discount.

### **Phase 4 — Checkout, orders, confirmation (Screens 8, 9)**
- Models: `Order`, `Address`.
- Endpoints: create address, list customer addresses, create order (from cart), generate order number in the `FT-XXXX` format shown in the mockups.
- Build `<PaymentMethodSelect>` per the checkout mockup: Card / UPI / COD / Wallet as an accordion — selecting a method smoothly expands its fields below (height-animated, not an abrupt show/hide), only one panel open at a time.
- Wire SSE: `order:created` fires to the relevant restaurant on submission.
- Confirmation screen: real order data, `<StatusFlow>` showing "Fired" as current stage, animated status-tag entrance (scale/rotate-in with slight overshoot, matches the chalk-circle-mark motion used across the whole app for confirmations).
- "Place order" button loading state: label → "Placing order…", disabled, small flame-flicker/pulse icon instead of a generic spinner.

**Verify:** checkout creates a real `Order` document tied to the correct restaurant and customer; order number format matches; the new order appears live (via SSE) on that restaurant's dashboard (Phase 6) without a refresh once built; payment method accordion expands/collapses smoothly with no layout jump.

### **Phase 5 — Live tracking, history, receipts (Screens 10, 11, 12)**
- Endpoints: get order by ID (with live status), list customer's past orders, get full receipt detail.
- Wire SSE: `order:statusChanged` and `order:riderAssigned` update the tracking screen live.
- Order history list uses `<TicketCard>` mini-receipt rows with working "Reorder" (repopulates cart from that order's items) and "View receipt" actions.
- Receipt detail screen: full itemized `<PriceLine>` breakdown + a review form (rating, food-quality, text) that POSTs to `Review` and is read-only once submitted.

**Verify:** placing a test order and then manually changing its status (e.g. via a quick admin/test route or the restaurant dashboard once built) reflects live on the tracking screen without refresh; reorder correctly repopulates the cart; review submission persists and displays correctly on repeat visits to that receipt.

### **Phase 6 — Restaurant partner module (Screens 14, 15, 16)**
- Endpoints: restaurant's order queue (grouped by status for the expo-rail columns), accept/mark-ready/hand-to-rider status transitions, CRUD dishes (menu management), toggle dish availability, toggle restaurant open/closed, analytics aggregates (orders over time, revenue, top-selling items, avg rating).
- Wire SSE: incoming `order:created` animates a new ticket into the "New" column live; status-transition buttons emit `order:statusChanged` to the customer side.
- Menu management: photo upload via Multer, add-on builder (repeatable name+price rows), veg/non-veg + spice-level fields matching the customization modal's options.
- Analytics: real aggregate queries against `Order`/`Review` — not hardcoded numbers.

**Verify:** a restaurant partner can accept a real incoming order and move it through New → Preparing → Ready → Handed to rider, with each transition reflected live on the corresponding customer's tracking screen. Adding/editing a dish in menu management immediately affects what customers see on that restaurant's public menu (Phase 2). Analytics numbers change correctly as new test orders are placed.

### **Phase 7 — Cross-cutting polish + hardening**
- Notification bell (customer + restaurant) wired to relevant SSE events.
- Loading/skeleton states for all data-fetching screens (never freeze the UI with no feedback beyond ~300ms).
- Empty states in the same visual language (e.g. "No orders yet" as a torn-edge card, not a generic centered message).
- Form validation styled consistently (bordered input + mono label, inline error text in brick red).
- Responsive check across all 16 screens at mobile/tablet/desktop breakpoints.
- Full re-audit: open all 16 screens side-by-side with the reference screenshots and confirm zero drift in colors, fonts, status-tag shapes, torn edges, and the bulldog-rail nav treatment.

**Verify:** run a full user journey per role with zero console errors and zero visual inconsistencies: customer signs up → browses → customizes a dish → checks out → tracks the order → reviews it afterward; restaurant partner logs in → accepts the order → manages the menu → checks analytics.

### **Phase 8 — Deployment readiness**
- Production build for client (`vite build`), served via Express static or a separate host.
- Environment-based config documented in README; no secrets in the repo, ever.
- `.gitignore` audit — confirm `.env` was never committed (`git log -p -- .env` returns nothing).
- Health-check endpoint (`/api/health`).

**Verify:** production build runs cleanly, MongoDB connects using env var only, health check responds.

---

## 8. STANDING RULES FOR ANTIGRAVITY (apply throughout, every phase)

1. Never hardcode the MongoDB URI, JWT secrets, or any credential in a source file — env vars only.
2. Never restyle or introduce new colors/fonts outside Section 2 — derive any new UI need from existing tokens.
3. Every screen uses the shared `<BulldogRail>` + relevant header/`<TicketCard>` components — no bespoke page chrome.
4. After each phase, give a short written verification report before moving on.
5. Status-color mapping never changes: mustard=new/preparing, herb green=ready/completed, plum=out for delivery, brick red=cancelled/urgent/spicy. Never default to generic blue/purple/red-orange food-app colors.
6. SSE only for real-time — no polling, no WebSockets.
7. Every success/confirmation moment (order placed, status updated, dish saved, review submitted) reuses the same stamp-style animation (scale/rotate-in with slight overshoot) and the same loading-button pattern (label change + themed pulse icon, disabled state) — don't invent a new animation per feature.
8. Depth comes from borders and flat tonal layers only — no shadows, no blur, no glassmorphism, anywhere in the app.

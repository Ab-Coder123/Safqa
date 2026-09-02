# Phase 08 — Product & Marketplace Capability Roadmap

---

## 📌 Phase Overview & Purpose

Phase 08 is the **core value engine** of the Safqa platform. It transforms Safqa into a production-ready, user-to-user marketplace where buyers can seamlessly discover and inspect items, and sellers can publish, manage, and modify their listings.

This phase is governed strictly by the following domain workflows:
* `documents/WorkFlows/Marketplace/Product_Discovery_Workflow.md`
* `documents/WorkFlows/Marketplace/Product_Management_Workflow.md`
* `documents/WorkFlows/Marketplace/Product_Lifecycle_Workflow.md`
* `documents/WorkFlows/System/File_Upload_Workflow.md`
* `documents/WorkFlows/System/Media_Workflow.md`
* `documents/WorkFlows/System/Frontend_Architecture_Workflow.md`
* `documents/WorkFlows/System/Backend_Architecture_Workflow.md`
* `documents/WorkFlows/System/Performance_Engineering_Workflow.md`

---

## 🧱 Implementation Strategy: Vertical Slice Execution

Each Tier in this phase is a standalone **Vertical Slice** implementing full functionality across:
`Requirements ➔ UI Design ➔ Frontend ➔ Backend ➔ Integration ➔ Testing ➔ Quality Gate ➔ Git Release`.

```text
               TIER LIFECYCLE
                     │
      ┌──────────────┼──────────────┐
      ↓              ↓              ↓
UI Components    Backend API    Data Models
      │              │              │
      └──────────────┼──────────────┘
                     ↓
             Testing (Unit & Component)
                     ↓
          Performance & Build Verification
                     ↓
               Tier Report
                     ↓
             Git Commit & Push
                     ↓
               TIER COMPLETE ✅
```

---

# 🚀 Initial 4 Core Implementation Tiers

```text
PHASE 08 (PART 1) — CORE PRODUCT & MARKETPLACE TIERS
       │
       ├── TIER 01: Product Discovery & Products Page (/products)
       │     └── Search, multi-criteria filtering, paginated grid & UI states
       │
       ├── TIER 02: Product Details Page (/products/[id])
       │     └── Media gallery, seller card, WhatsApp direct action & report hook
       │
       ├── TIER 03: Create Product Flow (/products/create)
       │     └── Multi-image upload, daily limit check (max 3), form validation
       │
       └── TIER 04: Edit Product Capability (/products/edit/[id])
             └── Ownership verification, pre-filled form, update mutation & cache sync
```

---

## 🔹 TIER 01 — Product Discovery & Products Page (`/products`)

### 1. Requirements & Architecture
* **Route:** `/products`
* **Access:** Public (Guests + Authenticated Users).
* **Goal:** Enable buyers to search and filter active products (`status === 'PUBLISHED'`) with instant responsive feedback.
* **Filter Capabilities:**
  * Keyword Search (Debounced on `title` and `description`).
  * Category filter (by `category_id` / slug).
  * Condition filter (`NEW`, `LIKE_NEW`, `USED_GOOD`, `USED_FAIR`).
  * Price range (`min_price`, `max_price`).
  * Location / Governorate filter.
  * Sorting (`NEWEST`, `PRICE_ASC`, `PRICE_DESC`).
* **Pagination:** Limit `20` items per page.

### 2. UI Design & States
* **Desktop / Tablet / Mobile Responsive:** Grid layout adapting from 1 col (mobile) to 4 cols (desktop).
* **Loading State:** Skeleton cards matching exact ProductCard dimensions.
* **Empty State:** Friendly Arabic empty illustration when zero matches are found.
* **Error State:** Retry button with user-friendly error banner.

### 3. Frontend Architecture
* **Page:** `apps/web/src/app/products/page.tsx` (Thin page).
* **Components:**
  * `features/products/components/product-card.tsx`
  * `features/products/components/product-filters.tsx`
  * `features/products/components/product-grid-skeleton.tsx`
* **Hook:** `features/products/hooks/use-products.ts` (consuming `productKeys.list(filters)`).
* **API:** `features/products/api/products.api.ts` -> `getProducts(filters)`.

### 4. Backend & API Contract
* **Endpoint:** `GET /products`
* **Query DTO:** `GetProductsFilterDto` (validating `search`, `category_id`, `condition`, `min_price`, `max_price`, `page`, `limit`).
* **Service:** `ProductsService.findAllPublished(filters)` with Prisma indexed queries.

### 5. Testing & Verification
* **Frontend Component Tests:** `product-filters.test.tsx`, `products-page.test.tsx`.
* **Backend Unit Tests:** `products.service.spec.ts` (testing filtering, pagination, price range normalization).

### Definition of Done (Tier 01)
- [ ] Product discovery filtering and search work end-to-end.
- [ ] Debounced search prevents query flooding.
- [ ] Loading skeletons and empty states rendered properly.
- [ ] Frontend tests pass (`pnpm --filter @safqa/web test`).
- [ ] Backend tests pass (`pnpm --filter @safqa/backend test`).
- [ ] Next.js build passes with zero errors.

---

## 🔹 TIER 02 — Product Details Page (`/products/[id]`)

### 1. Requirements & Architecture
* **Route:** `/products/[id]`
* **Access:** Public (Guests + Authenticated Users).
* **Goal:** Present full product specifications, image gallery, seller verification badge, and direct communication triggers.
* **Key Features:**
  * Multi-image interactive gallery with thumbnail carousel.
  * Product condition and category badges.
  * Direct **WhatsApp Action Button** formatting `https://wa.me/{phone}?text={encoded_message}`.
  * Seller profile summary card with avatar, join date, and active listings count.
  * Bookmark / Favorite toggle button (`useToggleFavorite`).
  * "Report Listing" trigger modal (`useSubmitReport`).
  * Related products carousel / recommendation strip.

### 2. UI Design & States
* **Layout:** Two-column split on desktop (Sticky gallery on right, details & action box on left), single column on mobile with fixed bottom contact bar.
* **Loading State:** Detailed skeleton for gallery and info panels.
* **Not Found State (404):** Clean Arabic error banner if product is archived or deleted.

### 3. Frontend Architecture
* **Page:** `apps/web/src/app/products/[id]/page.tsx`.
* **Components:**
  * `features/products/components/product-gallery.tsx`
  * `features/products/components/product-seller-card.tsx`
  * `features/products/components/product-action-bar.tsx`
  * `features/reports/components/report-modal.tsx`
* **Hook:** `features/products/hooks/use-product.ts` (`productKeys.detail(id)`).
* **API:** `features/products/api/products.api.ts` -> `getProductById(id)`.

### 4. Backend & API Contract
* **Endpoint:** `GET /products/:id`
* **Service:** `ProductsService.findById(id)` including `category`, `media`, `user` (sanitized: id, name, phone, created_at, avatar).

### 5. Testing & Verification
* **Frontend Tests:** `product-gallery.test.tsx`, `product-details.test.tsx`.
* **Backend Tests:** `products.service.spec.ts` (test public access, not found exceptions, media inclusion).

### Definition of Done (Tier 02)
- [ ] Interactive media gallery supports multiple images.
- [ ] WhatsApp button initiates direct chat with pre-filled product title.
- [ ] Favorite toggle updates server and local UI state optimistically.
- [ ] All unit/component tests pass.
- [ ] Production build succeeds.

---

## 🔹 TIER 03 — Create Product Flow (`/products/create`)

### 1. Requirements & Architecture
* **Route:** `/products/create`
* **Access:** Protected (Authenticated Users only via `<AuthGuard>`).
* **Goal:** Enable sellers to publish items with enforced validations and spam prevention limits.
* **Business Rules (from `Product_Management_Workflow.md`):**
  * **Daily Limit:** Max 3 published products per calendar day per user.
  * **Media Requirements:** Minimum 1 photo, maximum 5 photos.
  * **Mandatory Fields:** Title (min 10 chars), Description (min 20 chars), Price (> 0), Condition, WhatsApp number, Category.
  * **Prohibited Items:** Automated check preventing banned category listings.

### 2. UI Design & Multi-Step / Form States
* **Image Uploader:** Drag-and-drop zone with instant local image preview, upload progress indicators, and re-ordering/deletion.
* **Validation Feedback:** Real-time field errors with localized Arabic hints.
* **Submission State:** Button spinner with mutation protection.

### 3. Frontend Architecture
* **Page:** `apps/web/src/app/products/create/page.tsx` (wrapped in `<AuthGuard>`).
* **Components:**
  * `features/products/components/create-product-form.tsx`
  * `features/products/components/image-upload-zone.tsx`
* **Schema:** `features/products/schemas/create-product.schema.ts` (Zod validation).
* **Hook:** `features/products/hooks/use-create-product.ts`.
* **API:** `features/products/api/products.api.ts` -> `createProduct(input)` & `uploadMedia(files)`.

### 4. Backend & API Contract
* **Endpoints:**
  * `POST /media/upload` (Multipart file processing, WEBP conversion, storage URL generation).
  * `POST /products` (Creates product record, links media, validates daily limit <= 3).
* **DTO:** `CreateProductDto` (class-validator decorators).
* **Guards:** `JwtAuthGuard` extracting `@CurrentUser()`.

### 5. Testing & Verification
* **Frontend Tests:** `create-product-form.test.tsx` (validation checks, file drop, successful submission).
* **Backend Tests:** `products.service.spec.ts` (test daily limit enforcement, category existence check, unauthorized denial).

### Definition of Done (Tier 03)
- [ ] Authenticated sellers can upload up to 5 photos and submit listings.
- [ ] Daily limit of 3 listings is strictly enforced server-side.
- [ ] Success redirects to the newly created `/products/:id` page.
- [ ] Cache invalidations refresh `my-listings` and `products.list()`.

---

## 🔹 TIER 04 — Edit Product Capability (`/products/edit/[id]` / Modal)

### 1. Requirements & Architecture
* **Route / Flow:** `/products/[id]/edit` or Edit Listing dialog.
* **Access:** Protected (Listing Owner OR `SUPER_ADMIN`).
* **Goal:** Allow sellers to adjust listing price, update description, replace photos, or update condition.
* **Security & Ownership Lock:**
  * Non-owners attempting to update receive strict `403 Forbidden`.
  * IDs extracted from JWT token claims, never from client request bodies.

### 2. UI Design & States
* **Pre-population:** Automatically populate form with existing product values fetched from server cache.
* **Diff Tracking:** Only submit modified fields or complete valid DTO.
* **Success Feedback:** Toast notification and immediate cache update.

### 3. Frontend Architecture
* **Components:**
  * `features/products/components/edit-product-form.tsx`
* **Hook:** `features/products/hooks/use-update-product.ts`.
* **API:** `features/products/api/products.api.ts` -> `updateProduct(id, input)`.

### 4. Backend & API Contract
* **Endpoint:** `PATCH /products/:id` (or `PUT /products/:id`).
* **DTO:** `UpdateProductDto` (all fields optional, validated).
* **Service:** `ProductsService.update(id, userId, dto)` (verifies `product.user_id === userId || user.role === 'SUPER_ADMIN'`).

### 5. Testing & Verification
* **Frontend Tests:** `edit-product-form.test.tsx` (form pre-filling, mutation call).
* **Backend Tests:** `products.service.spec.ts` (test owner allowed, non-owner 403 Forbidden, admin override allowed).

### Definition of Done (Tier 04)
- [ ] Owner can edit price, title, description, and images.
- [ ] Ownership security check verified by unit tests.
- [ ] Product detail and list query caches invalidated on update.
- [ ] All test suites and builds pass cleanly.

---

## 📊 Summary of Subsequent Phase 08 Tiers (Part 2 — Upcoming)

* **TIER 05:** My Listings Management (`/my-listings`) & Mark as Sold / Archive.
* **TIER 06:** Favorites System (`/favorites`) & Synchronization.
* **TIER 07:** Categories Directory & Subcategory Navigation (`/categories`).
* **TIER 08:** Marketplace Polish, Error Boundaries, SEO Metadata & Edge Cases.

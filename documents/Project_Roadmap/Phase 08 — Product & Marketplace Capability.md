# Phase 08 — Product & Marketplace Capability

## Status
PLANNED

## Previous Phase
Phase 07 — Authentication System

## Objective

Phase 08 focuses on completing, standardizing, and hardening
the user-facing Product and Marketplace capabilities of SAFQA.

The phase must follow the established frontend and backend
architecture and must not introduce architectural patterns
that conflict with the existing system.

---

# 1. Mandatory References

Before starting any Tier, the implementation agent MUST review:

1. agent/SKILL.md
2. documents/WorkFlows/System/Frontend_Architecture_Workflow.md
3. documents/WorkFlows/System/Backend_Architecture_Workflow.md
4. documents/WorkFlows/System/Permission_Workflow.md
5. documents/WorkFlows/User/Authentication_Workflow.md
6. This document

The agent must verify the current repository state before
implementing any task.

---

# 2. Architecture Rules

Frontend:

Page
→ Feature Component
→ Feature Hook
→ TanStack Query
→ Feature API Service
→ Shared API Client
→ Backend API

Backend:

Request
→ Guard
→ Controller
→ DTO / Validation
→ Service
→ Prisma
→ Database

No direct fetch() calls are allowed outside the shared API client.

No direct tokenStorage access is allowed inside pages or UI components.

Server state must be managed through TanStack Query.

Feature-specific business logic must remain inside the feature boundary.

---

# 3. Tier Execution Model

Every Tier MUST follow:

1. Architecture Review
2. Existing Code Audit
3. UI/UX Review
4. Frontend Implementation
5. Backend Review
6. Backend Implementation if required
7. Integration
8. Testing
9. Performance Validation
10. Documentation
11. Production Build
12. Git Commit
13. Tier Completion Report

A Tier cannot be marked complete if one of the mandatory
validation steps fails.

---

# 4. Backend Change Policy

Backend changes are conditional.

The agent MUST NOT modify backend code unless the current
capability requires a backend change.

If the existing API already satisfies the capability:

Backend Status:
NO CHANGES REQUIRED

The agent must document the API endpoints verified and explain
why no backend modification was necessary.

---

# 5. Required Testing

Every Tier must include:

Frontend:
- Component behavior
- Loading state
- Error state
- Empty state
- Authentication behavior where applicable
- Responsive behavior

Backend:
- Unit tests for new business logic
- Existing tests must continue passing

Integration:
- Frontend ↔ Backend API behavior

Validation:
- TypeScript
- ESLint where configured
- Production build

---

# 6. Documentation

Every Tier must produce:

- Implementation summary
- Architecture impact
- Frontend changes
- Backend changes
- API changes
- Testing results
- Build results
- Known limitations
- Git commit hash

---

# 7. Git Policy

Each completed Tier must produce a focused Git commit.

Commit format:

feat(phase-08): complete <capability>

or

fix(phase-08): <description>

The commit must only contain changes related to the current Tier.

---

# 🟢 Tier 01 — Marketplace Discovery

### الهدف

بناء تجربة **اكتشاف المنتجات والبحث عنها** بشكل production-ready.

الـ Tier ده مسؤول عن:

> المستخدم يدخل `/products` ويقدر يتصفح المنتجات، يبحث، يفلتر، يرتب، ويفهم حالة النتائج بسهولة.

### Route

```text
/products
```

---

## 01.1 Marketplace Page Structure

بناء الصفحة باستخدام الـ Design System الحالي:

```text
Marketplace
│
├── Page Header
│   ├── Title
│   └── Description
│
├── Search
│
├── Categories
│
├── Filters
│
├── Sort
│
├── Results Summary
│
└── Products Grid
```

لا نعمل UI system جديد مخصوص للـ Marketplace.

---

## 01.2 Product Discovery

المستخدم يقدر:

* يشوف المنتجات
* يدخل Product Details
* يشوف الصورة الرئيسية
* الاسم
* السعر
* الموقع
* حالة المنتج
* معلومات البائع الأساسية
* Favorite action
* أي metadata موجودة بالفعل في الـ API

والـ Product Card تكون **feature-owned** داخل:

```text
features/products/components/
```

مش نرجع تاني لفكرة generic marketplace components.

---

## 01.3 Search

دعم البحث في المنتجات:

```text
/search?q=
```

أو حسب الـ API الحالي.

لا نعمل API جديد لو الـ backend الحالي يوفر البحث.

المطلوب:

* search input
* submit
* query synchronization
* loading state
* empty state
* error state

والـ search state اللي يؤثر على server data يكون متوافق مع TanStack Query.

---

## 01.4 Filtering

الـ Tier يشمل filters الموجودة فعليًا في الـ domain.

مثل:

* Category
* Price range
* Condition
* Location
* أي filter مدعوم حاليًا من الـ backend

لكن **ممنوع نخترع filters غير مدعومة** لمجرد إنها موجودة في التصميم.

---

## 01.5 Sorting

لو الـ API يدعم sorting:

```text
Newest
Price: Low → High
Price: High → Low
```

يتم ربطها بالـ query.

ولو الـ backend لا يدعم نوع sorting معين:

> نوثق إن الـ backend change مطلوب بدل ما نعمل fake client-side sorting على dataset ناقص.

---

## 01.6 URL State

الـ filters/search/sort المهمة يفضل تكون قابلة للتمثيل في URL.

مثال:

```text
/products?category=cars&condition=used&sort=newest
```

الهدف:

* refresh يحافظ على البحث
* shareable URLs
* browser back/forward
* predictable state

---

## 01.7 States

لازم نغطي:

### Loading

Skeletons حقيقية بدل:

```text
Loading...
```

### Empty

مثلاً:

```text
لا توجد منتجات تطابق بحثك
```

مع CTA لمسح الفلاتر.

### Error

رسالة واضحة + Retry.

### Success

Grid طبيعي.

### Authentication

لو Favorite يحتاج authentication:

المستخدم غير المسجل لا يتكسر عند الضغط.

---

## 01.8 Responsive

Desktop:

```text
Filters | Products
```

Mobile:

```text
Search
Filters Button
Sort
Products
```

بدون horizontal overflow.

---

## 01.9 Performance

نراعي:

* Next Image
* lazy loading
* stable query keys
* pagination/infinite loading حسب الموجود حاليًا
* عدم تحميل بيانات غير ضرورية
* عدم استخدام `useMemo/useCallback` بدون سبب حقيقي

---

## Tier 01 Completion Gate

لا نعتبر Tier مكتمل إلا لما:

* [ ] `/products` شغال
* [ ] Search شغال
* [ ] Filters شغالة حسب الـ API
* [ ] Sorting شغال حسب الـ API
* [ ] Product cards سليمة
* [ ] URL state مضبوط
* [ ] Loading
* [ ] Empty
* [ ] Error
* [ ] Responsive
* [ ] Light/Dark
* [ ] RTL
* [ ] Accessibility
* [ ] TypeScript clean
* [ ] Build/Test clean
* [ ] Existing features لم تتكسر

### Commit

```text
feat(phase-08): complete marketplace discovery
```

---

# 🔵 Tier 02 — Product Details Experience

### الهدف

بناء تجربة المنتج الكاملة:

> المستخدم يشوف المنتج → يفهم تفاصيله → يتفاعل مع البائع → يعمل Favorite/Report حسب الصلاحيات.

### Route

```text
/products/[id]
```

---

## 02.1 Product Data

الصفحة تعتمد على الـ existing product API.

نحدد بوضوح:

```text
Product
├── Images
├── Title
├── Price
├── Description
├── Category
├── Condition
├── Location
├── Created At
├── Seller
└── Available actions
```

ونستخدم الـ actual backend contract، مش types مخترعة في الصفحة.

---

## 02.2 Image Gallery

Gallery production-ready:

* Main image
* thumbnails
* active image
* responsive behavior
* fallback لو مفيش صورة
* proper alt text

Mobile تكون سهلة الاستخدام بالـ touch.

---

## 02.3 Product Information

الـ information hierarchy تكون واضحة:

```text
Title
Price
Condition
Location
Description
Metadata
```

السعر يكون visual priority عالية.

---

## 02.4 Seller Section

إظهار معلومات البائع المتاحة حاليًا.

مثلاً:

```text
Seller
Avatar
Name
Profile
```

ولو messaging endpoint موجود:

```text
Contact Seller
```

لو مش موجود:

> لا نخترع interaction وهمي.

---

## 02.5 Favorites

ربط Favorite مع:

```text
features/favorites
```

مع:

* authenticated state
* optimistic update لو مناسب
* loading state
* error rollback لو optimistic
* correct query invalidation

وممنوع يبقى فيه duplicate favorite logic داخل Product Details.

---

## 02.6 Reporting

لو الـ report functionality موجودة:

```text
Report Product
```

مع modal/dialog:

```text
Reason
Description
Submit
```

مع:

* validation
* loading
* success
* error

والـ permission/auth rules لازم تتبع الـ existing Permission Workflow.

---

## 02.7 Not Found

لو المنتج غير موجود:

```text
Product Not Found
```

مش runtime error.

---

## 02.8 Loading / Error

لازم يكون فيه:

```text
Product Skeleton
```

و:

```text
Retry
```

والـ page لا تعتمد على `undefined` assumptions.

---

## 02.9 Responsive

Desktop:

```text
Gallery | Product Info
```

Mobile:

```text
Gallery
Product Info
Seller
Actions
```

---

## Tier 02 Completion Gate

* [ ] Product Details تعمل
* [ ] Gallery
* [ ] Product information
* [ ] Seller information
* [ ] Favorite
* [ ] Report حسب الـ existing capability
* [ ] Contact Seller حسب الـ existing API
* [ ] Loading
* [ ] Error
* [ ] Not Found
* [ ] Auth states
* [ ] RTL
* [ ] Responsive
* [ ] Light/Dark
* [ ] Accessibility
* [ ] Query/cache behavior صحيح
* [ ] No duplicated domain logic
* [ ] Tests/build clean

### Commit

```text
feat(phase-08): complete product details experience
```

---

# 🟠 Tier 03 — Listing Creation & Editing

وده Tier مهم جدًا لأنه أول Capability فيها **write operation حقيقية من المستخدم**.

### الهدف

تمكين المستخدم من:

```text
Create Product
       ↓
Validate
       ↓
Submit
       ↓
Success
       ↓
Product Details / My Products
```

مع إمكانية تعديل المنتج.

### Routes

```text
/products/create
/products/[id]/edit
```

وده متوافق مع الـ roadmap الحالي اللي بيفصل Create وEdit عن باقي product flow.

---

# 03.1 Create Listing Form

الـ form يحتوي فقط على fields الموجودة في domain/API.

مثلاً حسب الـ existing model:

```text
Title
Description
Price
Category
Condition
Location
Images
```

---

## 03.2 Form Architecture

نستخدم form architecture مناسبة للمشروع.

مثلاً:

```text
features/products/
│
├── components/
├── hooks/
├── api/
├── types/
└── ...
```

والـ form logic لا يتحط كله داخل:

```text
app/products/create/page.tsx
```

الـ page تكون composition layer.

---

## 03.3 Validation

Validation لازم تكون:

### Client-side

لـ UX.

### Server-side

لـ security/correctness.

يعني:

> Client validation ليست بديلًا عن backend validation.

---

## 03.4 Image Handling

نتعامل مع الصور بناءً على الـ current backend contract.

ندعم:

* preview
* remove
* validation
* upload state
* failed upload
* empty state

ولا نعمل fake upload mechanism لو الـ backend/storage flow مختلف.

---

## 03.5 Submit State

أثناء submit:

```text
Create Product...
```

ويتم منع duplicate submissions.

---

## 03.6 Success

بعد النجاح:

```text
Product created successfully
```

ثم navigation للـ appropriate destination.

---

# 03.7 Edit Listing

نفس الـ architecture لكن:

```text
GET existing product
        ↓
Populate form
        ↓
User edits
        ↓
PATCH/PUT
        ↓
Success
```

ممنوع نعمل Create وEdit forms منفصلين بالكامل لو نفس domain logic.

الأفضل shared form:

```text
ProductForm
```

مع mode:

```text
create
edit
```

---

## 03.8 Authorization

المستخدم لا يستطيع تعديل:

```text
/product/[id]
```

إلا لو هو صاحب المنتج أو عنده permission مناسبة.

والـ frontend لا يعتمد على ownership وحده.

Backend هو authority.

---

## 03.9 Unsaved Changes

لو form طويل:

لو المستخدم كتب بيانات وحاول يخرج، نحاول نحميه من فقدان البيانات حسب UX المناسب.

مش لازم نعمل complex global state.

---

## 03.10 States

لازم:

* Initial loading
* Form loading
* Validation errors
* Upload errors
* Submit loading
* API error
* Success
* Unauthorized
* Forbidden
* Not found

---

## Tier 03 Completion Gate

* [x] ✅ Create Listing
* [x] ✅ Edit Listing
* [x] ✅ Shared form architecture
* [x] ✅ Validation
* [x] ✅ Image handling
* [x] ✅ Submit states
* [x] ✅ Error handling
* [x] ✅ Auth
* [x] ✅ Ownership/permission
* [x] ✅ Success navigation
* [x] ✅ Responsive
* [x] ✅ RTL
* [x] ✅ Light/Dark
* [x] ✅ Accessibility
* [x] ✅ No duplicated create/edit logic
* [x] ✅ Backend contract verified
* [x] ✅ Tests/build clean

### Commit

```text
feat(phase-08): complete listing creation and editing
```

---

# 🟣 Tier 04 — My Products / Seller Workspace

### الهدف

إنشاء مساحة المستخدم لإدارة المنتجات التي نشرها.

### Route

```text
/my-products
```

دي مش مجرد Grid تاني.

دي **Management Capability**.

---

## 04.1 My Products Overview

المستخدم يشوف:

```text
My Products

Total
Active
Pending
Sold / Inactive
```

**فقط لو الـ backend فعليًا يوفر statuses دي.**

---

## 04.2 Product Management List

كل product يعرض:

```text
Image
Title
Price
Status
Created Date
Actions
```

Actions حسب الموجود:

```text
View
Edit
Delete
```

وأي action إضافي لازم يكون backed by API.

---

## 04.3 Filtering

مثلاً:

```text
All
Active
Pending
Sold
```

لكن زي ما اتفقنا:

> لا نضيف status filter إلا لو الـ domain الحالي بيدعم الـ status.

---

## 04.4 Delete

Delete لازم يكون UX محترم:

```text
Delete Product?

This action cannot be undone.
```

ثم:

```text
Cancel
Delete
```

مع:

* loading
* success
* error
* query invalidation

---

## 04.5 Empty State

لو المستخدم ملوش منتجات:

```text
You haven't listed anything yet.

[ Create Listing ]
```

وده مهم جدًا لأن الصفحة لأول مرة هتكون empty عند معظم المستخدمين.

---

## 04.6 Authorization

الـ `/my-products` نفسها protected.

والـ API هو اللي يحدد المنتجات المملوكة للمستخدم.

مش:

```text
GET all products
filter by user on frontend
```

لو الـ backend يوفر endpoint مخصص للمستخدم، نستخدمه.

---

## 04.7 Query Management

Query key تكون feature-owned:

```text
features/products/...
```

ولا نرجع للـ centralized:

```text
lib/query/query-keys.ts
```

لأن architecture foundation نقلت ownership للـ features.

---

## 04.8 Responsive

Desktop:

```text
Table / Grid
```

Mobile:

```text
Cards
```

بحيث actions تفضل usable.

---

## Tier 04 Completion Gate

* [ ] `/my-products`
* [ ] Current user's products
* [ ] Correct authorization
* [ ] Product status حسب الـ actual domain
* [ ] View
* [ ] Edit
* [ ] Delete حسب الـ API
* [ ] Delete confirmation
* [ ] Loading
* [ ] Empty
* [ ] Error
* [ ] Success
* [ ] Query invalidation
* [ ] Responsive
* [ ] RTL
* [ ] Light/Dark
* [ ] Accessibility
* [ ] Performance
* [ ] Tests/build clean

### Commit

```text
feat(phase-08): complete my products workspace
```

---

# 🧩 شكل أول 4 Tiers كـ Flow

```text
                    PHASE 08
                       │
                       ▼
          Product & Marketplace Experience
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     TIER 01         TIER 02        TIER 03
   Discovery      Product Details   Listing
                                      │
                                      ▼
                                   TIER 04
                                My Products
```

والـ user journey يبقى:

```text
/products
    │
    ├── Search
    ├── Filter
    ├── Sort
    │
    ▼
/products/[id]
    │
    ├── Favorite
    ├── Contact Seller
    └── Report
    │
    ▼
/products/create
    │
    ▼
/my-products
    │
    ├── View
    ├── Edit
    └── Delete
```

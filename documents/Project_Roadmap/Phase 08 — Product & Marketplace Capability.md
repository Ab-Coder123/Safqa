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

* [x] ✅ `/my-products`
* [x] ✅ Current user's products
* [x] ✅ Correct authorization
* [x] ✅ Product status حسب الـ actual domain (PUBLISHED / SOLD / ARCHIVED)
* [x] ✅ View
* [x] ✅ Edit
* [x] ✅ Delete حسب الـ API (soft-delete → ARCHIVED)
* [x] ✅ Delete confirmation
* [x] ✅ Loading (Skeleton)
* [x] ✅ Empty
* [x] ✅ Error
* [x] ✅ Success
* [x] ✅ Query invalidation
* [x] ✅ Responsive
* [x] ✅ RTL
* [x] ✅ Light/Dark
* [x] ✅ Accessibility
* [x] ✅ Performance
* [x] ✅ Tests/build clean

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

# 🟡 Tier 05 — Favorites & Saved Products

### الهدف

تحويل الـ Favorite من مجرد button في Product Details إلى **تجربة كاملة لإدارة المنتجات المحفوظة**.

### Route

```text
/favorites
```

### Scope

#### 05.1 Favorites Page

```text
Favorites
│
├── Header
├── Results count
└── Favorite Products Grid
```

#### 05.2 Favorite State

التعامل مع:

* Add favorite
* Remove favorite
* Already favorited
* Authentication required
* Mutation loading
* Mutation error
* Cache synchronization

والـ favorite logic يفضل يظل داخل:

```text
features/favorites/
```

بدل ما يبقى duplicated داخل:

```text
ProductCard
ProductDetails
FavoritesPage
```

#### 05.3 Empty State

```text
You haven't saved any products yet.

[ Browse Products ]
```

#### 05.4 Product Removal

المستخدم يقدر يشيل المنتج من favorites بدون refresh كامل للصفحة.

#### 05.5 States

* Loading
* Empty
* Error
* Success
* Unauthorized
* Responsive

### Completion Gate

* [x] ✅ `/favorites`
* [x] ✅ Favorite products
* [x] ✅ Add/remove synchronization
* [x] ✅ Correct Query invalidation
* [x] ✅ Empty state
* [x] ✅ Error state
* [x] ✅ Auth handling
* [x] ✅ Responsive
* [x] ✅ RTL
* [x] ✅ Dark mode
* [x] ✅ Accessibility
* [x] ✅ Tests/build

### Commit

```text
feat(phase-08): complete favorites experience
```

---

# 🔴 Tier 06 — Messaging & Conversations

### الهدف

بناء الـ communication flow بين buyer وseller.

وده Capability مستقلة، مش مجرد `/messages` page.

### Routes

```text
/messages
/messages/[id]
```

### Flow

```text
Product Details
      │
      │ Contact Seller
      ▼
Create/Open Conversation
      │
      ▼
/messages/[id]
      │
      ▼
Send Message
```

---

## 06.1 Messages Inbox

```text
Messages
│
├── Conversation Search
├── Conversation List
│
└── Selected Conversation
```

Desktop ممكن يبقى:

```text
┌──────────────┬─────────────────────────┐
│ Conversations│ Conversation            │
│              │                         │
│ Ahmed        │ Ahmed                   │
│ Mohamed      │                         │
│ Ali          │ Message                 │
│              │ Message                 │
│              │                         │
│              │ [ Type message... ]     │
└──────────────┴─────────────────────────┘
```

Mobile:

```text
Conversations
      ↓
Conversation
```

---

## 06.2 Conversation

لازم يظهر:

* participant
* messages
* timestamps
* unread state
* input
* send button

---

## 06.3 Message States

كل message محتاج state واضح:

```text
sending
sent
failed
```

لو الـ backend لا يدعم delivery/read status، لا نخترعها.

---

## 06.4 Sending

عند إرسال message:

```text
Input
 ↓
Validate
 ↓
Mutation
 ↓
Update Conversation
```

مع منع duplicate submissions.

---

## 06.5 Empty State

لو مفيش conversations:

```text
No conversations yet.

Start by contacting a seller.
```

---

## 06.6 Real-time

هنا لازم نراجع الـ backend architecture.

لو المشروع حاليًا **لا يحتوي WebSocket/SSE infrastructure**:

لا نضيف WebSocket لمجرد إن messaging "المفروض real-time".

ننفذ messaging بالـ current supported architecture ونوثق:

```text
Real-time messaging → future capability
```

إلا لو الـ backend workflow الحالي يطلبه.

---

## 06.7 Auth / Permissions

المستخدم لا يقدر:

* يدخل conversation لا تخصه
* يرسل باسم مستخدم آخر
* يقرأ conversation غير مصرح له بها

الـ backend يظل authority.

### Completion Gate

* [x] ✅ Messages inbox
* [x] ✅ Conversation route
* [x] ✅ Send message
* [x] ✅ Message states
* [x] ✅ Unread state حسب API
* [x] ✅ Empty
* [x] ✅ Loading
* [x] ✅ Error
* [x] ✅ Authorization
* [x] ✅ Responsive
* [x] ✅ RTL
* [x] ✅ Accessibility
* [x] ✅ Query/cache synchronization
* [x] ✅ Tests/build

### Commit

```text
feat(phase-08): complete messaging experience
```

---

# 🔵 Tier 07 — Notifications Center

### الهدف

تحويل notifications الموجودة إلى تجربة كاملة ومتسقة.

### Route

```text
/notifications
```

---

## 07.1 Notification List

```text
Notifications
│
├── All
├── Unread
└── Notification Items
```

كل item يعرض حسب الـ actual notification contract:

```text
Icon
Title
Message
Time
Read state
```

---

## 07.2 Read / Unread

دعم:

```text
Mark as read
Mark all as read
```

والـ unread count يكون متزامن مع الـ notification query.

خصوصًا إن الـ notifications API عندك يستخدم payload بالشكل:

```ts
{
  notifications,
  unread_count
}
```

فـ component لازم يتعامل مع object، مش يعمل `.filter()` مباشرة على `data`.

---

## 07.3 Notification Navigation

لو notification مرتبطة بـ:

* product
* conversation
* report
* account action

فالضغط عليها يروح للـ relevant destination حسب الـ payload.

---

## 07.4 Header Integration

لو الـ Header عنده notification indicator:

```text
🔔 3
```

لازم الرقم يتزامن مع:

```text
/notifications
```

بدون duplicate fetching غير ضروري.

---

## 07.5 States

* Loading
* Empty
* Error
* Unread
* Read
* Marking as read
* Mark all
* Navigation

### Completion Gate

* [x] ✅ Notification center
* [x] ✅ Correct API payload handling
* [x] ✅ Unread count
* [x] ✅ Mark read
* [x] ✅ Mark all
* [x] ✅ Header synchronization
* [x] ✅ Related navigation
* [x] ✅ Empty/error/loading
* [x] ✅ Responsive
* [x] ✅ RTL
* [x] ✅ Dark mode
* [x] ✅ Accessibility
* [x] ✅ Tests/build

### Commit

```text
feat(phase-08): complete notifications experience
```

---

# 🟣 Tier 08 — Public Profile & Profile Management

### الهدف

بناء هوية المستخدم داخل الـ marketplace.

### Routes

```text
/profile
/profile/edit
```

ولو الـ domain يدعم public profiles لاحقًا:

```text
/users/[id]
```

لكن **ما نضيفش route مش موجود في الـ current product contract بدون سبب**.

---

## 08.1 Profile

```text
Profile
│
├── Avatar
├── Name
├── Basic Information
├── Joined Date
│
├── My Products
├── Favorites
└── Account Actions
```

حسب البيانات الموجودة بالفعل.

---

## 08.2 Edit Profile

```text
Edit Profile
│
├── Avatar
├── Name
├── Email
├── Phone
└── Save
```

فقط fields التي الـ backend يسمح بتعديلها.

---

## 08.3 Update Flow

```text
Edit
 ↓
Validate
 ↓
Mutation
 ↓
Update current-user cache
 ↓
Success
```

مهم جدًا إن تعديل profile ينعكس في:

* Header
* Profile
* other user UI

بدون refresh إجباري.

---

## 08.4 States

* Initial loading
* Editing
* Validation error
* API error
* Success
* Unauthorized

### Completion Gate

* [x] ✅ Profile
* [x] ✅ Edit Profile
* [x] ✅ Avatar handling
* [x] ✅ Update mutation
* [x] ✅ Current-user cache synchronization
* [x] ✅ Validation
* [x] ✅ Error/success
* [x] ✅ Responsive
* [x] ✅ RTL
* [x] ✅ Accessibility
* [x] ✅ Tests/build


### Commit

```text
feat(phase-08): complete profile experience
```

---

# 🟠 Tier 09 — Settings & Account Preferences

### الهدف

بناء account settings بشكل منفصل عن profile editing.

### Route

```text
/settings
```

---

## 09.1 Settings Structure

```text
Settings
│
├── Account
├── Appearance
├── Notifications
├── Security
└── Danger Zone
```

لكن sections تعتمد على capabilities الموجودة بالفعل.

---

## 09.2 Appearance

Integration مع:

```text
next-themes
```

والـ existing:

```text
light
dark
system
```

مش نعمل theme state جديد.

---

## 09.3 Account

Actions مثل:

```text
Edit Profile
Change Password
```

فقط لو الـ backend يدعمها.

---

## 09.4 Security

Authentication-related controls الموجودة فعليًا.

ممنوع نحط UI لـ feature غير موجودة backend-side.

---

## 09.5 Danger Zone

لو account deletion موجود:

```text
Delete Account
```

مع confirmation قوية.

---

### Completion Gate

* [ ] Settings page
* [ ] Existing preferences
* [ ] Theme integration
* [ ] Account actions
* [ ] Security actions
* [ ] Danger Zone حسب API
* [ ] Loading/error/success
* [ ] Responsive
* [ ] RTL
* [ ] Accessibility
* [ ] Tests/build

### Commit

```text
feat(phase-08): complete account settings
```

---

# 🔴 Tier 10 — User Reports & Trust & Safety

### الهدف

إكمال user-facing moderation/reporting flow.

### Route

```text
/reports
```

---

## 10.1 My Reports

المستخدم يشوف التقارير اللي عملها:

```text
My Reports
│
├── Report
├── Target
├── Reason
├── Status
└── Created At
```

---

## 10.2 Report Details

لو الـ current routing/API يدعم التفاصيل:

```text
/reports/[id]
```

نعرض:

* reason
* target
* status
* submitted date
* moderation result حسب الـ actual API

---

## 10.3 Status

مثلاً:

```text
Pending
Reviewed
Resolved
Rejected
```

**فقط لو هذه statuses موجودة فعليًا في backend contract.**

---

## 10.4 Security

المستخدم يشوف:

> تقاريره هو فقط.

مش كل reports الموجودة في النظام.

---

### Completion Gate

* [ ] Reports page
* [ ] User-owned reports
* [ ] Status
* [ ] Details حسب API
* [ ] Loading
* [ ] Empty
* [ ] Error
* [ ] Authorization
* [ ] Responsive
* [ ] RTL
* [ ] Accessibility
* [ ] Tests/build

### Commit

```text
feat(phase-08): complete user reports experience
```

---

# ⚫ Tier 11 — Super Admin Moderation Experience

وده هنخليه Tier كبير لأنه مختلف عن الـ User Flow.

الـ roadmap الحالي محدد 8 Admin capabilities: Dashboard، Users، User Details، Products، Product Review، Categories، Reports، Report Details.

### Routes

```text
/admin
/admin/users
/admin/users/[id]
/admin/products
/admin/products/[id]
/admin/categories
/admin/reports
/admin/reports/[id]
```

---

## 11.1 Admin Dashboard

KPIs حسب البيانات المتاحة:

```text
Users
Products
Reports
Pending Moderation
```

لا نعمل fake statistics.

---

## 11.2 Users Management

```text
Search
Filter
Users Table
Actions
```

مع pagination حسب API.

---

## 11.3 User Details

عرض:

* user information
* account status
* products
* relevant moderation information

---

## 11.4 Products Management

Admin product moderation:

```text
Search
Filter
Status
Product list
```

---

## 11.5 Product Review

Admin يقدر يراجع المنتج ويأخذ actions المتاحة فعليًا.

---

## 11.6 Categories

إدارة:

```text
Create
Edit
Delete
```

حسب API permissions.

---

## 11.7 Reports

Admin report queue:

```text
Pending
Reviewed
Resolved
```

حسب actual domain.

---

## 11.8 Report Details

Admin يشوف:

```text
Reporter
Target
Reason
Evidence
Status
Actions
```

والـ authorization لازم تكون server-enforced.

### Completion Gate

* [ ] Admin dashboard
* [ ] Users
* [ ] User details
* [ ] Products
* [ ] Product review
* [ ] Categories
* [ ] Reports
* [ ] Report details
* [ ] SUPER_ADMIN protection
* [ ] Loading/error/empty
* [ ] Responsive
* [ ] Accessibility
* [ ] RTL
* [ ] Tests/build

### Commit

```text
feat(phase-08): complete super admin moderation experience
```

---

# 🟤 Tier 12 — Marketplace UX Hardening

ده **مش Page جديدة**.

ده Tier أخير نرجع فيه على كل الـ capabilities اللي بنيناها.

```text
Tier 01 ─┐
Tier 02 ─┤
Tier 03 ─┤
Tier 04 ─┤
Tier 05 ─┤
Tier 06 ─┤
Tier 07 ─┤──► UX Hardening
Tier 08 ─┤
Tier 09 ─┤
Tier 10 ─┤
Tier 11 ─┘
```

## 12.1 UX Audit

نراجع:

* consistency
* spacing
* typography
* buttons
* dialogs
* forms
* cards
* empty states
* error messages

---

## 12.2 Responsive Audit

نختبر:

```text
Mobile
Tablet
Desktop
Large Desktop
```

---

## 12.3 Accessibility Audit

نراجع:

* keyboard navigation
* focus
* labels
* aria
* contrast
* semantic HTML
* dialogs
* forms

---

## 12.4 Performance Audit

نراجع:

* unnecessary client components
* image optimization
* query behavior
* duplicate requests
* bundle impact
* loading UX

---

## 12.5 Architecture Audit

نتأكد إننا ما رجعناش للمشاكل اللي Architecture Foundation عالجتها:

```text
Feature ownership
Query key ownership
Shared UI ownership
API boundaries
Server state
UI state
```

---

## 12.6 Final Regression

```text
Landing
Auth
Home
Marketplace
Product
Create
Edit
My Products
Favorites
Messages
Notifications
Profile
Settings
Reports
Admin
```

كلهم يتراجعوا بعد انتهاء Phase 08.

### Completion Gate

* [ ] UX audit
* [ ] Responsive audit
* [ ] Accessibility audit
* [ ] Performance audit
* [ ] Architecture audit
* [ ] Regression
* [ ] TypeScript
* [ ] Tests
* [ ] Production build

### Commit

```text
chore(phase-08): harden marketplace experience
```

---

# 🧭 Phase 08 كاملة بعد التقسيم

| Tier   | Capability                     |
| ------ | ------------------------------ |
| **01** | Marketplace Discovery          |
| **02** | Product Details                |
| **03** | Listing Creation & Editing     |
| **04** | My Products Workspace          |
| **05** | Favorites & Saved Products     |
| **06** | Messaging & Conversations      |
| **07** | Notifications Center           |
| **08** | Profile & Profile Management   |
| **09** | Settings & Account Preferences |
| **10** | User Reports & Trust & Safety  |
| **11** | Super Admin Moderation         |
| **12** | Marketplace UX Hardening       |


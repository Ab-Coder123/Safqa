# Phase 2 — Database Design & System Modeling

> **Purpose:** Define the business entities, their relationships, business rules, and database structure before writing any backend or frontend code.
> **Note:** For general architectural guidelines, product philosophy, and codebase workflows, refer to `Safqa_Architecture_Decisions.md`.

---

# Design Principles

The database design of Safqa is guided by the following principles:

- **Keep the MVP Simple:** Avoid over-engineering and premature optimization.
- **Normalize Data:** Store each piece of information only once to prevent anomalies.
- **Keep Entities Independent:** Maintain clear bounded contexts between domains.
- **Junction Tables for N:N:** Explicitly model many-to-many relationships using junction entities.
- **Design for Scalability:** Ensure the schema can accommodate future extensions without breaking changes.

---

# Key Database Design Decisions

## Why only USER and ADMIN roles?
The MVP intentionally supports only two roles:
- `USER`: Can both buy and sell using the single account.
- `ADMIN`: Manages the platform, moderation, and categories.

This design simplifies authentication, authorization, database relationships, API endpoints, and UI routing while allowing post-MVP expansion (e.g., Moderators).

## Conversation Neutrality
Instead of `buyer_id` and `seller_id`, conversations use `user_one_id` and `user_two_id`. This prevents hardcoded business semantics regarding who is buying or selling, since a user can buy and sell across different interactions.

---

# Step 1 — Business Domain Overview

```text
User Registration / Authentication
                │
                ▼
        Publish Product
                │
                ▼
    Search & Filter Products
                │
                ▼
  Start Messaging / Engagement
                │
                ▼
      Status Updates / Sold
```

---

# Step 2 — Entity Discovery & Domain Grouping

Entities are grouped by their business domain to improve clarity and maintainability.

## 1. Core Business Entities
- **User**: Represents any registered user on the platform.
- **Product**: Marketplace items listed for sale.
- **Category**: Product taxonomy and grouping.

## 2. Communication Entities
- **Conversation**: Chat session between two users.
- **Message**: Individual message exchanged within a conversation.

## 3. Interaction Entities
- **Favorite**: Saved products per user (Junction Entity).
- **Notification**: Alerts delivered to users.
- **Report**: Content moderation submissions filed by users.

## 4. Supporting Entities
- **Media**: Uploaded image and video assets.

## 5. Future / Post-MVP Entities
- **Review**: Product/seller rating and feedback.
- **Address**: User location and delivery data.

---

# Step 3 — Detailed Entity Modeling

Every entity follows a consistent template: Description, Purpose, Responsibilities, Core Attributes, Relationships, Business Rules, Lifecycle, and Future Scalability.

---

## 1. User Entity
- **Description**: Represents every registered person on Safqa.
- **Purpose**: Central entity for authentication, profile management, and platform activity.
- **Responsibilities**: Publishes products, sends messages, saves favorites, files reports.
- **Core Attributes**:
  - `id`: UUID (Primary Key)
  - `full_name`: String
  - `email`: String (Unique)
  - `password_hash`: String
  - `phone_number`: String (Unique)
  - `gender`: Enum (`MALE` | `FEMALE`)
  - `birth_date`: Date
  - `avatar_url`: String (Optional)
  - `role`: Enum (`USER` | `ADMIN`) - Default: `USER`
  - `status`: Enum (`ACTIVE` | `SUSPENDED` | `DELETED`) - Default: `ACTIVE`
  - `created_at`: Timestamp
  - `updated_at`: Timestamp
- **Relationships**: Owns Products, Conversations, Messages, Favorites, Notifications, Reports.
- **Business Rules**: Unique Email and Phone. Encrypted passwords. Suspended users cannot post.
- **Lifecycle**: `Registered` → `Verified` → `Active` → `Suspended` → `Deleted`
- **Future Scalability**: Two-Factor Authentication (2FA), Social Login, Verification Badges, User Reputation score.

---

## 2. Product Entity
- **Description**: Represents an item listed for sale inside the marketplace.
- **Purpose**: Holds all business information related to a listing.
- **Responsibilities**: Displays item info, price, media, condition, and availability status.
- **Core Attributes**:
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key → User)
  - `category_id`: UUID (Foreign Key → Category)
  - `title`: String
  - `description`: Text
  - `price`: Decimal
  - `currency`: String (Default: 'EGP')
  - `condition`: Enum (`NEW` | `USED` | `REFURBISHED`)
  - `whatsapp_number`: String
  - `status`: Enum (`DRAFT` | `PUBLISHED` | `SOLD` | `ARCHIVED`) - Default: `PUBLISHED`
  - `created_at`: Timestamp
  - `updated_at`: Timestamp
- **Relationships**: Belongs to User and Category. Has Media, Favorites, and Reports.
- **Business Rules**: Price cannot be negative. Must belong to a valid User and Category. Maximum 3 daily posts for standard accounts.
- **Lifecycle**: `Draft` → `Published` → `Updated` → `Sold` → `Archived`
- **Future Scalability**: Product Promotions / Featured listings, Item Variants (color, size), View Counter Analytics.

---

## 3. Category Entity
- **Description**: Classification structure for grouping marketplace products.
- **Purpose**: Enables effective search, filtering, and browsing by category.
- **Responsibilities**: Defines hierarchy and category taxonomy.
- **Core Attributes**:
  - `id`: UUID (Primary Key)
  - `name`: String
  - `slug`: String (Unique)
  - `icon_url`: String (Optional)
  - `parent_id`: UUID (Foreign Key → Category, Optional for subcategories)
  - `created_at`: Timestamp
- **Relationships**: Has many Products. Self-referencing parent/child hierarchy.
- **Business Rules**: Categories are managed exclusively by Admins.
- **Lifecycle**: `Active` → `Archived`
- **Future Scalability**: Dynamic custom attributes per category (e.g., Mileage for Cars, RAM for Laptops).

---

## 4. Conversation Entity
- **Description**: Represents a chat room between two users regarding a product or general inquiry.
- **Purpose**: Groups messages between participants neutral of buyer/seller roles.
- **Responsibilities**: Maintains participant links and tracks recent activity timestamps.
- **Core Attributes**:
  - `id`: UUID (Primary Key)
  - `user_one_id`: UUID (Foreign Key → User)
  - `user_two_id`: UUID (Foreign Key → User)
  - `product_id`: UUID (Foreign Key → Product, Optional)
  - `last_message_at`: Timestamp
  - `created_at`: Timestamp
- **Relationships**: Belongs to User One & User Two. Contains many Messages.
- **Business Rules**: A user cannot start a conversation with themselves. `(user_one_id, user_two_id, product_id)` combination should be unique.
- **Lifecycle**: `Active` → `Archived`
- **Future Scalability**: Group Conversations, Voice Messages, System System-generated Deal Milestones.

---

## 5. Message Entity
- **Description**: A single communication entry inside a Conversation.
- **Purpose**: Stores text content and read status.
- **Responsibilities**: Delivers communication between conversation participants.
- **Core Attributes**:
  - `id`: UUID (Primary Key)
  - `conversation_id`: UUID (Foreign Key → Conversation)
  - `sender_id`: UUID (Foreign Key → User)
  - `content`: Text
  - `is_read`: Boolean - Default: `false`
  - `created_at`: Timestamp
- **Relationships**: Belongs to a Conversation and Sender (User).
- **Business Rules**: Sender must be a participant in the conversation.
- **Lifecycle**: `Sent` → `Delivered` → `Read`
- **Future Scalability**: Image/File Attachments, Location Pin Sharing, Message Deletion/Editing.

---

## 6. Favorite Entity
- **Description**: Saved product entries marked by users.
- **Purpose**: Junction entity connecting Users and Products for quick bookmark access.
- **Responsibilities**: Tracks saved items per user.
- **Core Attributes**:
  - `user_id`: UUID (Foreign Key → User)
  - `product_id`: UUID (Foreign Key → Product)
  - `created_at`: Timestamp
- **Primary Key**: Composite (`user_id`, `product_id`)
- **Relationships**: Junction entity connecting User ↔ Product.
- **Business Rules**: User cannot favorite the same product multiple times.
- **Lifecycle**: `Created` → `Deleted`
- **Future Scalability**: Price-drop notifications for favorited items.

---

## 7. Notification Entity
- **Description**: System alerts delivered to a user.
- **Purpose**: Inform users about comments, moderation updates, or system announcements.
- **Responsibilities**: Delivers real-time and persistent alerts to target users.
- **Core Attributes**:
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key → User)
  - `title`: String
  - `body`: Text
  - `type`: Enum (`COMMENT` | `SYSTEM` | `MODERATION` | `PROMOTION`)
  - `is_read`: Boolean - Default: `false`
  - `created_at`: Timestamp
- **Relationships**: Belongs to User.
- **Business Rules**: Automatically expires after 3 days if configured by system background jobs.
- **Lifecycle**: `Unread` → `Read` → `Expired/Deleted`
- **Future Scalability**: Push Notifications (FCM), Email Alerts, SMS notifications.

---

## 8. Report Entity
- **Description**: Abuse or policy violation reports submitted by users.
- **Purpose**: Moderation tracking for inappropriate products or users.
- **Responsibilities**: Collects user reports for Admin review.
- **Core Attributes**:
  - `id`: UUID (Primary Key)
  - `reporter_id`: UUID (Foreign Key → User)
  - `target_type`: Enum (`PRODUCT` | `USER` | `COMMENT`)
  - `target_id`: UUID
  - `reason`: Text
  - `status`: Enum (`PENDING` | `RESOLVED` | `DISMISSED`) - Default: `PENDING`
  - `created_at`: Timestamp
- **Relationships**: Filed by User (Reporter). Can target a Product, User, or Comment.
- **Business Rules**: Pending reports are reviewed exclusively by Admins.
- **Lifecycle**: `Pending` → `In_Review` → `Resolved / Dismissed`
- **Future Scalability**: Automated spam/AI toxicity filtering before manual admin review.

---

## 9. Media Entity
- **Description**: Uploaded image or video assets.
- **Purpose**: Centralized storage mapping for files attached to products or profiles.
- **Responsibilities**: Stores file URLs and order sequences.
- **Core Attributes**:
  - `id`: UUID (Primary Key)
  - `entity_type`: Enum (`PRODUCT` | `USER`)
  - `entity_id`: UUID
  - `url`: String
  - `type`: Enum (`IMAGE` | `VIDEO`) - Default: `IMAGE`
  - `order`: Integer - Default: `0`
  - `created_at`: Timestamp
- **Relationships**: Belongs to Product or User.
- **Business Rules**: Media files must belong to a valid owner entity.
- **Lifecycle**: `Uploaded` → `Active` → `Orphaned/Deleted`
- **Future Scalability**: Video processing, Thumbnail generation, Cloud CDN optimization.

---

# Step 4 — Relationship Design & Matrix

This step details foreign key placement and business cardinalities across all entities.

## Relationship Matrix

| Entity A | Cardinality | Entity B | Foreign Key Location | Business Meaning |
|---|---|---|---|---|
| **User** | 1 : N | **Product** | `Product.user_id` | User owns multiple published products |
| **Category** | 1 : N | **Product** | `Product.category_id` | Product belongs to one category |
| **User** | N : N | **Product** | `Favorite` table (`user_id`, `product_id`) | Favorite is a junction entity (User ↔ Product) |
| **User (One)** | 1 : N | **Conversation** | `Conversation.user_one_id` | Participant 1 in chat session |
| **User (Two)** | 1 : N | **Conversation** | `Conversation.user_two_id` | Participant 2 in chat session |
| **Conversation** | 1 : N | **Message** | `Message.conversation_id` | Messages are grouped inside a conversation |
| **User** | 1 : N | **Notification** | `Notification.user_id` | System notifies specific user |
| **User** | 1 : N | **Report** | `Report.reporter_id` | User files a moderation report |
| **Product** | 1 : N | **Report** | `Report.target_id` (when `target_type = PRODUCT`) | A product can receive multiple reports |
| **Product** | 1 : N | **Media** | `Media.entity_id` (when `entity_type = PRODUCT`) | Product has multiple uploaded media assets |

---

# Step 5 — Conceptual ER Diagram

```text
                               ┌──────────────┐
                               │     User     │
                               └──────┬───────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         │ 1:N                        │ 1:N                        │ 1:N
         ▼                            ▼                            ▼
  ┌──────────────┐            ┌──────────────┐            ┌──────────────┐
  │   Product    │            │ Conversation │            │ Notification │
  └──────┬───────┘            └──────┬───────┘            └──────────────┘
         │                           │
         ├───► 1:N Category          └───► 1:N Message
         │
         ├───► Favorite (Junction: User ↔ Product)
         │
         ├───► 1:N Media (Type: IMAGE | VIDEO)
         │
         └───► 1:N Report
```

---

# Summary & Phase 3 Transition

The conceptual database model is now complete and fully aligned with the project's architectural decisions.

This document intentionally focuses on **conceptual design**.

Implementation details including:
- SQL DDL Scripts
- Prisma Schema Generation
- Primary / Foreign Key Constraints & Cascade Rules
- Database Indexing Strategies (e.g., `category_id`, `status`, `created_at`)
- Database Migrations
- Performance Optimization & Soft Delete Filters

will be fully documented in **Phase 3**.
# Safqa Workflows Overview

This directory contains the explicit Domain-Driven workflows governing feature behavior, data flow, error handling, and authorization rules across the Safqa ecosystem.

Every workflow defines how a business capability executes end-to-end between Frontend, Backend, and Database layers.

## Workflow Structure

- **User Domain**: `Authentication`, `Profile Management`, `Settings`
- **Marketplace Domain**: `Product Management`, `Product Discovery`, `Favorites`, `Product Lifecycle`
- **Communication Domain**: `Messaging`, `Notifications`
- **Administration Domain**: `Admin Overview`, `Content Moderation / Reports`, `Category Management`
- **System Layer**: `Frontend Architecture`, `Backend Architecture`, `Media Assets`, `File Uploads`, `Error Handling`, `Permissions / Authorization`, `Logging & Audit`, `Performance Engineering`

## Mandatory Architecture Workflows

Before implementing any future frontend feature, read:

1. `System/Frontend_Architecture_Workflow.md`
2. `System/Performance_Engineering_Workflow.md`
3. the relevant domain workflow
4. `System/Error_Handling_Workflow.md`
5. `System/Permission_Workflow.md` when authentication, ownership, roles, or protected resources are involved
6. `documents/Project_Roadmap/01_Safqa_Architecture_Decisions.md`

Before implementing any future backend feature, read:

1. `System/Backend_Architecture_Workflow.md`
2. the relevant domain workflow
3. `System/Error_Handling_Workflow.md`
4. `System/Permission_Workflow.md` when authentication, ownership, roles, or protected resources are involved
5. `documents/Project_Roadmap/01_Safqa_Architecture_Decisions.md`

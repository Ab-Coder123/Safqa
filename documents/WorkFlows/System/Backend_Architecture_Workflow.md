# Backend Architecture Workflow

## Purpose
This workflow defines how backend modules, controllers, DTOs, services, Prisma access, validation, errors, authorization, and tests must remain organized in Safqa.

## Required Flow
```text
Domain
   |
Controller
   |
DTO / Validation
   |
Service
   |
Business Logic
   |
Repository / Prisma
   |
Database
   |
Testing
   |
Definition of Done
```

## Module Boundaries
Each backend domain owns its module under `apps/backend/src/modules`.

Current modules:
- `auth`
- `users`
- `media`
- `categories`
- `products`
- `favorites`
- `notifications`
- `conversations`
- `reports`
- `admin`

Do not create a new module unless the capability is a real domain boundary. Do not put unrelated business logic into an existing service for convenience.

## Controllers
Controllers receive HTTP requests, apply guards/decorators, bind DTOs, and call services. Controllers must not contain business rules, Prisma queries, or multi-step domain workflows.

## DTOs and Validation
Request validation belongs in DTOs using the existing NestJS `ValidationPipe`, `class-validator`, and `class-transformer` setup. DTOs should reject unknown fields and express transport-level validation.

## Services
Services own business decisions for their module. They may coordinate Prisma calls and other module services when the domain workflow requires it. Keep services cohesive; split private helpers before a service becomes a mixed-domain class.

## Prisma Boundary
Database access currently uses `PrismaService`. Keep Prisma calls in services or a justified module-local repository if complexity grows. Do not access Prisma directly from controllers.

## Authentication and Authorization
Protected endpoints must use the existing JWT guard and role/ownership checks described in:
- `documents/WorkFlows/User/Authentication_Workflow.md`
- `documents/WorkFlows/System/Permission_Workflow.md`

Use token claims from verified requests, not request body user IDs, for ownership-sensitive actions.

## Error Handling
Throw NestJS HTTP exceptions from services/controllers and let the global `HttpExceptionFilter` normalize responses. Do not return raw database errors or stack traces.

## Frontend Contract
Backend responses are the source of truth for frontend contracts. Shared reusable enums and entity shapes belong in `packages/types` when used across applications.

## Testing
Use the existing Jest setup for module/service behavior. Add tests when changing business logic, authorization, validation, or error behavior.

## Definition of Done
- Controller remains thin.
- DTO validation is explicit.
- Business logic stays in the module service/domain layer.
- Prisma access does not leak to controllers.
- Errors follow the standardized response workflow.
- Authorization follows authentication and permission workflows.
- Backend tests and build commands pass when available.

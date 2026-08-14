# Admin Workflow

## Purpose
The Admin Workflow defines the management capabilities and control panels reserved for Super Admins in Safqa. It provides system metrics, user moderation tools, category controls, and report resolution dashboards to keep the platform safe and functional.

## Business Overview
Admin oversight keeps a peer-to-peer marketplace trustworthy:
1. Super Admins monitor active listings, registered users, and report queues.
2. Admins review reported content to identify fraud or terms violations.
3. Admins can suspend users or archive listings violating community rules.
4. Administrative actions resolve disputes and prevent spam.

## Actors
- **SUPER ADMIN**: Platform manager with unrestricted system permissions.
- **System**: Validates admin credentials, updates dashboard metrics, and applies moderation commands.

## Preconditions
- The user is authenticated and possesses the `SUPER ADMIN` role claim.
- The Admin dashboard app is running.

## Trigger
- Super Admin opens the Admin Console.
- Super Admin performs a moderation action (suspending a user, archiving a listing).

## Main Workflow (Happy Path)
1. **Access Console**: Super Admin log in and opens the admin dashboard.
2. **Read System metrics**: The System retrieves platform indicators (total users, total published listings, pending report counts).
3. **Inspect Violator**: Admin views the profile and listings of a user with multiple reports.
4. **Moderate Account**: Admin selects "Suspend Account" on the user's details page.
5. **Input Reason**: Admin inputs the suspension reason and sets a duration (e.g., 7 days).
6. **Submit Action**: Admin submits the moderation request.
7. **Apply Suspend**: The System changes the user's status to `SUSPENDED`, archives their active listings, and writes an audit log entry.
8. **Notify User**: The System sends a notification to the suspended user's registered email/notifications.

## Alternative Flows
### Lift User Suspension
1. Super Admin navigates to the "Suspended Users" tab.
2. Admin clicks "Activate Account" on a user profile.
3. The System resets the user's status to `ACTIVE`.
4. The user's listings remain archived, but they can now log in and post new listings.

## Exception Flows
### Unauthorized Dashboard Access Attempt
- **Trigger**: A standard user with `role === 'USER'` attempts to call admin API endpoints.
- **System Behavior**: The System blocks the request, returns a `403 Forbidden` error, and logs a security exception with the user's details.

## Business Rules
- **Role Control**: Only users with the `SUPER ADMIN` role can access moderation tools. Standard users are blocked from calling admin APIs.
- **Cascade Archival**: Suspending a user automatically archives all their published products to prevent buyers from interacting with a suspended account.
- **Audit Trails**: All administrative actions must be logged with the admin's user ID, target entity, action description, and timestamp.

## State Changes
```text
  User: Active ──────────► Suspended (Actioned by Admin)
  Product: Published ────► Archived (Cascade effect on suspension)
```
- **Suspended**: Restricts login access and active sessions. Set by Super Admin.
- **Archived**: Hidden from search results. Set automatically during user suspension.

## Database Impact
- **User Entity**: Reads details and updates status attributes.
- **Product Entity**: Updates statuses of linked products to `ARCHIVED` on suspension.
- **Report Entity**: Updates moderation report statuses.

## Notifications
- **Moderation Notification**: The System sends an email or push notification to the target user when their account is suspended or a listing is removed, detailing the violation.

## Permissions
- **Authenticated USER**: Completely blocked from accessing admin functions.
- **SUPER ADMIN**: Full access to suspend users, manage categories, resolve reports, and inspect logs.

## Security Considerations
- **IP Restrictions / Rate Limiting**: Limit access rates to admin endpoints to protect against brute-force attacks.
- **Role Verification**: Enforce NestJS authorization guards on every endpoint prefix matching `/admin/*`.
- **Sensitive Operations**: Require password re-entry for high-risk actions (e.g., deleting a category or permanently banning a user).

## Audit & Logging
- **Mod Log**: Log all administrative actions (Admin ID, Target User ID/Product ID, Action, Reason, timestamp).
- **Console Sign-ins**: Log all successful and failed admin logins.

## Future Improvements
- **Automated Moderation**: Use AI keyword filtering to automatically flag or hide listings containing restricted terms.
- **Moderator Roles**: Introduce lesser administrator roles with restricted permissions (e.g., view reports but cannot delete categories).

## Related Workflows
- **Report Workflow**: Admin actions are often triggered by user reports.
- **Category Management Workflow**: Admin updates taxonomies.

## Summary
The Admin Workflow acts as the dashboard of Safqa. By securing admin controls, automating cascade updates, and maintaining comprehensive audit trails, it helps Super Admins protect the marketplace community and preserve catalog quality.

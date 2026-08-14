# Report Workflow

## Purpose
The Report Workflow handles the submission and resolution of content violations, scams, or abuse reports. It enables users to flag inappropriate listings or accounts, populates the moderation queue, and supports Super Admin reviews.

## Business Overview
Community-driven moderation is essential for a safe marketplace:
1. Users can report any product listing or user profile that violates platform rules (e.g., scams, forbidden items).
2. Submitted reports go into a pending moderation queue.
3. Super Admins review reports in the queue and decide whether to resolve (take action) or dismiss them.
4. This flow prevents platform abuse and helps maintain listing quality.

## Actors
- **USER (Reporter)**: Submits reports against a listing or another user.
- **SUPER ADMIN**: Reviews reports in the moderation queue and takes resolution actions.
- **System**: Registers reports, builds queues, and updates status values.

## Preconditions
- The reporting User is authenticated.
- The target Entity (Product, User) exists in the database.

## Trigger
- User clicks "Report" on a product card or user profile and submits a report reason.
- Super Admin opens the pending reports queue.

## Main Workflow (Happy Path)
1. **Initiate Report**: User A views Product B and clicks "Report Listing".
2. **Submit Details**: User A selects a reason (e.g., "Scam/Fake listing") and provides additional details.
3. **Write Report**: The System inserts a `Report` record with status `PENDING`, linking the reporter's ID, target type (`PRODUCT`), target ID, and reason.
4. **Queue Update**: The report is added to the Admin moderation console queue.
5. **Inspect**: Super Admin reviews the report and inspects Product B.
6. **Resolve Report**: Super Admin clicks "Resolve - Delete Product" on the report dashboard.
7. **Action**: The System updates the report status to `RESOLVED`, sets the target Product B status to `ARCHIVED`, and notifies the owner.
8. **Log Audit**: The System logs the moderation action in the audit database.

## Alternative Flows
### Dismiss Report
1. Super Admin reviews a report and determines that the product does not violate any rules.
2. Admin clicks "Dismiss Report".
3. The System updates the report status to `DISMISSED`.
4. The product remains live, and the report is removed from the active moderation queue.

## Exception Flows
### Double Reporting
- **Trigger**: User A attempts to report Product B multiple times.
- **System Behavior**: The System blocks duplicate submissions, returning an error: "You have already reported this listing."

### Reporting Deleted Content
- **Trigger**: User attempts to report a product that has just been archived or sold.
- **System Behavior**: The System returns a `404 Not Found` error, preventing the report from being created.

## Business Rules
- **Authentication Required**: Only authenticated users can file reports.
- **Duplicate Prevention**: A user can only submit one active report per target to prevent spamming the admin queue.
- **Admin Lock**: Only users with the `SUPER ADMIN` role can view and manage the reports queue.
- **No Self-Reporting**: Users cannot file reports against themselves or their own products.

## State Changes
```text
  Pending
    │
    ▼ (Admin starts review)
  In_Review
    │
    ├─────────────────────────┐
    ▼ (Admin resolves report) ▼ (Admin dismisses report)
  Resolved                 Dismissed
```
- **Pending**: Default state on submission. Visible in the admin queue.
- **In_Review**: (Optional / Post-MVP) Set when an admin opens a report to prevent concurrent reviews.
- **Resolved**: Moderation action was taken on the target.
- **Dismissed**: Report rejected. Target remains unchanged.

## Database Impact
- **Report Entity**: Writes new report records, updates status values.
- **Product Entity**: Updates status to `ARCHIVED` if the product is removed.
- **User Entity**: Reads reporter details, updates status to `SUSPENDED` if the user is banned.

## Notifications
- **Moderation Notification**: The System sends an email or notification alert to the listing owner when a product is removed due to a report resolution.

## Permissions
- **Guest / Unauthenticated User**: Forbidden from submitting reports.
- **Authenticated USER**: Can submit reports against other users or listings.
- **SUPER ADMIN**: Full access to view the reports queue, transition report states, and take moderation actions.

## Security Considerations
- **Verify Target Existence**: Validate that the target ID and target type exist before creating a report.
- **Spam Control**: Rate limit report submissions (e.g., maximum 5 reports per user per hour) to prevent queue flooding.

## Audit & Logging
- **Report Submissions**: Log when a report is filed (Reporter ID, Target Type, Target ID, timestamp).
- **Mod Resolutions**: Log report resolutions (Admin ID, Report ID, Status, Action, timestamp).

## Future Improvements
- **Automated Flagging**: Automatically hide products that receive more than 5 reports from different users until an admin reviews them.
- **Reputation Integration**: Reduce user reputation scores when their listings are repeatedly reported and resolved.

## Related Workflows
- **Admin Workflow**: Admin dashboard provides the reports console.
- **Product Lifecycle Workflow**: Intersects when products are archived due to report resolutions.

## Summary
The Report Workflow is the primary moderation tool in Safqa. By managing user reports, organizing the admin queue, and enabling structured resolutions, it helps Super Admins identify violations, keep the catalog safe, and maintain community trust.

# Notification Workflow

## Purpose
The Notification Workflow manages system alerts, activity updates, and moderation messages delivered to users. It keeps users engaged by informing them about new messages, product reports, and administrative decisions.

## Business Overview
Timely updates improve user retention and trust:
1. Users receive alerts for events requiring their attention.
2. Notifications are categorized by type (Messages, Moderation, System updates).
3. Notifications are stored locally and accessible via an alert inbox.
4. Old or read alerts expire automatically to keep databases clean.

## Actors
- **USER**: Target recipient who views and marks alerts as read.
- **SUPER ADMIN**: Initiates system-wide alerts or triggers moderation notices.
- **System**: Automatically creates notifications and purges expired records.

## Preconditions
- The target User must exist and be registered.
- The triggering event must be successfully committed to the database.

## Trigger
- A user receives an offline message.
- A Super Admin takes action on a reported product (moderation event).
- A product listing is successfully published or marked as sold.

## Main Workflow (Happy Path)
1. **Trigger Alert Event**: System detects an event (e.g., User A receives a message from User B while offline).
2. **Compile Alert**: The System formats the notification title, body, type (`COMMENT`), and links it to the recipient's `user_id`.
3. **Write to Database**: The System inserts a `Notification` record with status `is_read = false`.
4. **Push Update**: The System pushes the alert to the client interface (via WebSockets if online).
5. **View Notifications**: The user opens their notifications panel.
6. **Mark as Read**: The User clicks on the notification.
7. **Update Database**: The System sets `is_read = true` for that notification ID.
8. **UI Refresh**: The notification count badge updates, and the alert is marked as read in the UI.

## Alternative Flows
### System-wide Admin Announcement
1. Super Admin drafts an announcement (e.g., "Scheduled platform maintenance tonight").
2. The System writes notification records for all registered active users with type `SYSTEM`.
3. Users receive the notification when they log in.

## Exception Flows
### Recipient Account Suspended or Deleted
- **Trigger**: System attempts to generate a notification for an account that is currently suspended or deleted.
- **System Behavior**: The System bypasses notification creation, logging the event as skipped.

## Business Rules
- **Automatic Expiration**: Notifications expire and are deleted automatically 3 days after creation to prevent database bloat.
- **Owner Access Control**: A user can only view, modify, or delete notifications linked to their own user ID.
- **Type Restrictions**: Notification types must match allowed enums (`COMMENT` | `SYSTEM` | `MODERATION` | `PROMOTION`).

## State Changes
```text
  Unread
    │
    ▼ (User opens notification)
   Read
    │
    ▼ (3 days pass / system purge)
  Expired (Deleted)
```
- **Unread**: Default state on creation. Shows red count badge.
- **Read**: Set when user opens or clicks "Mark all as read".
- **Expired/Deleted**: Cleaned up automatically by scheduler routines.

## Database Impact
- **Notification Entity**: Writes new alerts, updates read statuses, deletes expired rows.
- **User Entity**: Reads metadata to verify recipient status.

## Notifications
This workflow coordinates the creation and delivery of all platform notifications.

## Permissions
- **Guest / Unauthenticated User**: Forbidden from accessing notification APIs.
- **Authenticated USER**: Can view, mark as read, and delete notifications they own.
- **SUPER ADMIN**: Can send notification broadcasts to any user or group of users.

## Security Considerations
- **Scope Verification**: Verify that the authenticated user ID matches `notification.user_id` before processing read or delete requests.
- **WebSocket Security**: Verify JWT handshake credentials before allowing client connections to the notification push stream.

## Audit & Logging
- **Alert Dispatches**: Log notification dispatches (ID, Recipient User ID, Type, timestamp).
- **System Purges**: Log database cleanup counts during nightly purge routines.

## Future Improvements
- **Mobile Push Integration**: Integrate Firebase Cloud Messaging (FCM) for native mobile push updates.
- **Email Digest**: Send weekly summaries of listings and messages to offline users.

## Related Workflows
- **Messaging Workflow**: Triggers notifications for offline chat messages.
- **Report Workflow**: Triggers moderation notifications for resolved reports.

## Summary
The Notification Workflow keeps users connected to platform activity in Safqa. By managing real-time dispatches, enforcing 3-day expirations, and categorizing notifications, it provides timely updates without overloading system resources.

# User Settings Workflow

## Purpose
The User Settings Workflow manages personal account controls, password modifications, localization preferences, and account deletion requests. It serves as the user-facing administration center for managing settings and privacy options.

## Business Overview
Every modern marketplace must offer tools for users to manage their security settings, configure notifications, and request data deletion. 

The business processes involved are:
1. Enabling password rotation.
2. Allowing users to view system terms of service and strict compliance guidelines.
3. Enabling users to disable notifications.
4. Offering an account closure/deletion path.

## Actors
- **USER**: Authenticated user managing their account settings.
- **System**: Enforces security constraints, processes password hashing updates, and handles soft-delete cleanups.

## Preconditions
- The User is fully authenticated.
- Active session JWT token is valid.

## Trigger
- User navigates to the "Settings" page in the navigation bar.
- User submits a password update form.
- User clicks "Deactivate/Delete Account".

## Main Workflow (Happy Path)
1. **Access Settings**: User opens the settings screen.
2. **Review Options**: The UI displays password update forms, notification preferences, compliance rules, and deletion options.
3. **Change Password**: User fills out `current_password`, `new_password`, and `confirm_new_password`.
4. **Validation**: The System checks that the `current_password` matches the stored hash. It ensures the `new_password` meets safety complexity checks.
5. **Update Hash**: The System hashes the new password and updates the database record.
6. **Confirmation**: User is notified of a successful password change and is asked to re-login on their next session.

## Alternative Flows
### Deactivate/Delete Account (Soft Delete)
1. User clicks "Delete Account".
2. The UI displays a warning popup highlighting that all active listings will be archived.
3. User confirms deletion.
4. The System updates `User.status = 'DELETED'`.
5. The System updates all corresponding products owned by the user to `ARCHIVED`.
6. The System revokes all active JWT tokens, logs out the user, and redirects them to the landing page.

## Exception Flows
### Incorrect Current Password
- **Trigger**: User inputs a wrong current password during change password request.
- **System Behavior**: The System rejects the request with an "Incorrect current password" error, keeping the password hash unchanged, and increments a security audit counter.

### Weak New Password
- **Trigger**: User tries to set a common or short password.
- **System Behavior**: Client-side or Server-side validators reject the update with a password validation warning.

## Business Rules
- **No Direct Recovery**: Standard users cannot access another user's security configuration page.
- **Soft Deletion Policy**: Account deletions are soft-deleted (`DELETED` status) to preserve platform logs, prevent fraud review bypasses, and retain transactional history.
- **Linked Archival**: When a user's status becomes `DELETED`, all products they have listed must automatically transition to `ARCHIVED` status to prevent orphan postings.

## State Changes
```text
  Active
    │
    ▼ (User deletes account)
  Deleted
```
*   **Active**: Standard operating state.
*   **Deleted**: Set when settings workflow deletion is completed, disabling login capability.

## Database Impact
- **User Entity**: Reads password hash. Writes updated password hash, status changes, and refresh tokens.
- **Product Entity**: Writes status updates to `ARCHIVED` for all products matching the deleted user ID.

## Notifications
This workflow does not send public notifications, but does record security log logs for audit purposes.

## Permissions
- **Authenticated USER**: Can modify their own settings, change their password, and delete their account.
- **SUPER ADMIN**: Can review user status changes but cannot access plain-text passwords or settings of other users.

## Security Considerations
- **Current Password Validation**: Changing passwords must always require inputting the current password to prevent unauthorized modifications by active session hijackers.
- **JWT Invalidation**: Changing passwords or deleting accounts must invalidate all existing refresh tokens associated with that user to terminate active rogue sessions on other devices.

## Audit & Logging
- **Password Changes**: Log password change actions (User ID, IP address, timestamp).
- **Account Deletions**: Log account soft-deletions (User ID, timestamp) for moderation tracking.

## Future Improvements
- **Account Export**: Allow users to download all personal data saved in the system.
- **Session Manager**: View active IP locations currently logged into the account.

## Related Workflows
- **Authentication Workflow**: Provides authentication status and handles token validations.
- **Product Lifecycle Workflow**: Intersected when product listings are automatically archived due to account deletion.

## Summary
The User Settings Workflow gives Safqa users full control over their account security, preferences, and data privacy. It ensures strict credential security while managing account cleanups in compliance with deletion requests.

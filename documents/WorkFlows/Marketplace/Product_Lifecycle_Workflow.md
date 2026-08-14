# Product Lifecycle Workflow

## Purpose
The Product Lifecycle Workflow manages the operational states of product listings in Safqa. It defines how a listing progresses from creation to transaction completion, ensuring listings are accurately indexed based on availability.

## Business Overview
Correct listing status is crucial for marketplace freshness:
1. Product status transitions guide user browsing and interactions.
2. Listings start as active (Published).
3. Once sold, listings are marked as Sold to signify deal completion and stop inquiries.
4. Listings can be archived (Archived) to hide them without deleting historical data.

## Actors
- **USER**: Listing owner who updates the product's operational state.
- **SUPER ADMIN**: Platform manager who can override states or archive listings.
- **System**: Automatically applies indexing updates and notifies observers.

## Preconditions
- The Product listing must exist in the database.
- The user requesting state changes must be authenticated.

## Trigger
- Listing owner clicks "Mark as Sold" on their dashboard.
- Listing owner deletes a product (triggering Archival).
- Super Admin suspends a listing for rule violations.

## Main Workflow (Happy Path)
1. **Browse Own Listings**: User opens their product inventory panel.
2. **Select Mark as Sold**: User clicks "Mark as Sold" on an active product.
3. **Verify Request**: The System validates that the authenticated user is the owner.
4. **Transition State**: The System updates `Product.status = 'SOLD'`.
5. **Update Index**: The search index is updated to label the product as sold, and active chat capabilities are disabled.
6. **Confirmation**: UI displays "Sold" badge on the product dashboard.

## Alternative Flows
### Product Archival (Delete)
1. User clicks "Delete" on their product.
2. The System validates ownership.
3. The System sets `Product.status = 'ARCHIVED'`.
4. The product is removed from public search results and category directory counts.

## Exception Flows
### Unauthorized State Update Attempt
- **Trigger**: User A attempts to update the status of User B's product listing.
- **System Behavior**: The System blocks the request, flags a forbidden permission exception, and logs a security alert.

## Business Rules
- **One-Way sold Transition**: Once a product is marked as `SOLD`, it cannot be reverted to `PUBLISHED`. This prevents seller confusion and ensures accurate marketplace reporting.
- **Archival Visibility**: Products with status `ARCHIVED` are hidden from public discovery and search APIs.
- **Automated Deactivation**: If a user account is deleted/suspended, the system automatically transitions all linked products to `ARCHIVED` status.

## State Changes
```text
  Draft (Optional)
     │
     ▼ (Owner publishes listing)
  Published ◄──────────► Updated (Attributes modified)
     │
     ├──────────────────────────┐
     ▼ (Owner marks as sold)    ▼ (Owner/Admin archives listing)
   Sold                      Archived
```
- **Draft**: (Optional / Post-MVP) Local state before listing submission.
- **Published**: Set upon creation. Item is visible in search.
- **Updated**: Tracking timestamps for modifications.
- **Sold**: Transitioned by owner upon deal completion.
- **Archived**: Soft-deleted state. Hidden from all public APIs.

## Database Impact
- **Product Entity**: Writes status attribute changes and timestamps.
- **Favorite Entity**: Cleans up favorites linked to archived products.
- **Conversation Entity**: Blocks new conversation creations when status is not `PUBLISHED`.

## Notifications
- **Status Alerts**: If a product is archived by a `SUPER ADMIN` due to reports, a notification is sent to the owner detailing the violation reason.

## Permissions
- **Guest / Unauthenticated User**: Read-only views of `PUBLISHED` and `SOLD` products.
- **Authenticated USER**: Can transition state parameters (`SOLD`, `ARCHIVED`) of products they own.
- **SUPER ADMIN**: Can transition states (`ARCHIVED`) of any product listing.

## Security Considerations
- **Strict Ownership Checks**: Ownership verification (`current_user.id === product.user_id`) is mandatory before processing state updates.
- **Input Validation**: Block invalid state inputs (e.g. attempting to set status to `PENDING` if it doesn't exist).

## Audit & Logging
- **Lifecycle Events**: Log all status transitions (Product ID, User ID, old status, new status, timestamp).
- **Admin Actions**: Log administrative overrides of product states.

## Future Improvements
- **Auto-Archiving**: Auto-archive listings active for more than 45 days with no user activity.
- **Sold Analytics**: Provide sellers with dashboards detailing duration from publish to sold.

## Related Workflows
- **Product Management Workflow**: Handles initial publication state.
- **Product Discovery Workflow**: Excludes archived listings.

## Summary
The Product Lifecycle Workflow maintains catalog health in Safqa. By managing status transitions, enforcing ownership constraints, and updating search indexes, it ensures buyers browse available products while preserving historical transaction data.

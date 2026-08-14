# Product Management Workflow

## Purpose
The Product Management Workflow governs the creation, update, and deletion of product listings inside the Safqa marketplace. It enforces listing parameters, media attachments, and posting limits to maintain the marketplace's quality and prevent database abuse.

## Business Overview
In a user-to-user marketplace, listing creation must be simple yet constrained to prevent fraud and spam:
1. Standard users can create listings, detailing title, description, price, WhatsApp contact, condition, and uploading multiple photos.
2. Users can modify their listings to update prices or descriptions.
3. Users can remove products when they are sold or no longer available.
4. Posting limits are enforced to protect storage and server resources.

## Actors
- **USER**: Acts as a seller to publish, update, or archive listings they own.
- **SUPER ADMIN**: Can review listings, update details, or delete violating products.
- **System**: Enforces daily listing limits, processes media mappings, and updates indexes.

## Preconditions
- The User must be authenticated.
- The User's account status must be `ACTIVE` (not suspended).
- The Category chosen for the product must exist and be active.

## Trigger
- User clicks "Publish Product" and submits the listing form.
- User requests to edit a product they own and submits modifications.
- User deletes a product listing.

## Main Workflow (Happy Path)
1. **Access Posting Form**: The user opens the product creation screen.
2. **Input Information**: User enters the title, description, price, condition (`NEW`, `USED`, `REFURBISHED`), WhatsApp phone number, and selects a category.
3. **Upload Media**: User uploads between 1 and 5 product photos.
4. **Limit Validation**: The System checks the database for products published by this user in the current calendar day. If count < 3, the transaction proceeds.
5. **Verify Input**: The System validates fields (price is positive, mandatory fields are populated, content has no forbidden terms).
6. **Upload Process**: The System processes media uploads and returns storage URLs.
7. **Write to Database**: The System inserts a `Product` entity with status `PUBLISHED` and links the media URLs.
8. **Confirmation**: The listing goes live immediately, and the user is redirected to the product details screen.

## Alternative Flows
### Edit Active Listing
1. User navigates to their product detail page and clicks "Edit".
2. The System checks ownership credentials.
3. User updates fields (e.g., lowers the price) and saves.
4. The System updates the `Product` entity and sets `updated_at`.

### Archive Listing (Delete)
1. User opens their listings page and clicks "Delete" on a product.
2. The System validates ownership.
3. The System sets the product's status to `ARCHIVED` (soft delete).
4. The product is removed from public search indexes.

## Exception Flows
### Daily Posting Limit Exceeded
- **Trigger**: User attempts to post a 4th listing in a single day.
- **System Behavior**: The System blocks the posting action, returns an error message: "Daily posting limit of 3 listings reached. Upgrade to premium for more listings," and keeps the input cached locally so the user doesn't lose data.

### Unauthorized Modification Attempt
- **Trigger**: User A attempts to edit User B's product by guessing the product ID API endpoint.
- **System Behavior**: The System performs an ownership check, flags a forbidden permission exception, and logs a security warning.

### Prohibited Products (Future AI check / Manual Admin check)
- **Trigger**: User selects a category containing forbidden items (like medications/food) or posts content flagged as abuse.
- **System Behavior**: The listing is blocked during validation or hidden automatically for Admin inspection.

## Business Rules
- **Posting Limits**: Standard accounts are limited to a maximum of 3 product listings per day to prevent automated spam and server storage flooding.
- **Ownership Lock**: Only the user who created the product (or a `SUPER ADMIN`) can edit or delete it.
- **Required Fields**: Listing title, description, price, condition, WhatsApp number, and at least one image are strictly mandatory.
- **Category Restrictions**: Food items and medications are completely blocked from listing.

## State Changes
```text
  (Creation) ──► Draft (Optional)
                  │
                  ▼
              Published ◄──► Updated
                  │
                  ├──► Sold
                  │
                  └──► Archived
```
*   **Published**: Default status on submission. Active in search.
*   **Updated**: Retains published status but tracks update timestamp.
*   **Sold**: Marked by owner when deal is closed. Inactive for new chats.
*   **Archived**: Hidden from all search queries (soft-deleted).

## Database Impact
- **Product Entity**: Writes new records, updates attributes/status.
- **User Entity**: Reads user data for limit verification.
- **Media Entity**: Writes links linking media files to the product ID.
- **Category Entity**: Reads to confirm category validation.

## Notifications
- **Moderation Notification**: If a `SUPER ADMIN` archives a user's product due to report violations, a notification is generated and sent to the product owner detailing the reason.

## Permissions
- **Guest / Unauthenticated User**: Forbidden from calling creation, modification, or deletion endpoints.
- **Authenticated USER**: Can create listings, edit their own listings, and delete their own listings.
- **SUPER ADMIN**: Can edit, update, or archive any listing across the entire platform.

## Security Considerations
- **Content Sanitization**: Strip dangerous HTML tags from title and description inputs to prevent XSS.
- **Ownership Verification**: Implement NestJS guards verifying `current_user.id === product.user_id` before processing edits or deletes.
- **Rate Limiting**: Enforce API rate limits on file uploads and listing creation endpoints.

## Audit & Logging
- **Product Creation**: Log product creation events (product ID, user ID, price, category, timestamp).
- **Product Updates**: Log modification actions including changed values (old price vs new price).
- **Product Archival**: Log deletions (who archived, product ID, timestamp).

## Future Improvements
- **Premium Account Upgrades**: Offer subscriptions allowing users to post up to 20 products per day.
- **Auto-archiving**: Automatically archive products that have been active for more than 30 days without updates.

## Related Workflows
- **File Upload Workflow**: Uploads images to storage before writing to product entity.
- **Product Discovery Workflow**: Consumes the products created in this workflow.
- **Report Workflow**: Deals with reporting products created here.

## Summary
The Product Management Workflow is the core data engine of Safqa. By enforcing posting limits, input validations, and strict ownership guards, it maintains listing quality, protects platform resources, and guarantees a secure, reliable marketplace catalog.

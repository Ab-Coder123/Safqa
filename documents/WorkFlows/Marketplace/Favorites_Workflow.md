# Favorites Workflow

## Purpose
The Favorites Workflow enables users to bookmark product listings for quick access later. It acts as a personal catalog builder, helping buyers save products they are interested in without initiating immediate communication.

## Business Overview
Saving products is a standard customer behavior in e-commerce:
1. Authenticated users can bookmark any published listing from search pages or details screens.
2. Saved products appear in a dedicated "Favorites" tab in the user profile navigation.
3. Users can remove products from their favorites list at any time.
4. Users are notified if a favorited product's status changes (e.g., marked as Sold).

## Actors
- **USER**: Authenticated user bookmarking or removing products.
- **System**: Updates favorite links, validates constraints, and retrieves user bookmark lists.

## Preconditions
- The User is fully authenticated.
- The Product exists and is currently in `PUBLISHED` status.

## Trigger
- User clicks the "Heart" / "Favorite" button on a product card or details page.
- User requests to view their "Favorites" folder.

## Main Workflow (Happy Path)
1. **Browse Listings**: User views a product card in the marketplace.
2. **Click Favorite**: User clicks the "Favorite" heart icon.
3. **Send Request**: Client sends a toggle request containing the user ID and product ID.
4. **Uniqueness Validation**: The System checks if the `Favorite` record already exists. If not, it creates a new `Favorite` junction entry linking `user_id` and `product_id`.
5. **Confirmation**: The System returns a success status, and the UI changes the heart icon to an active state.

## Alternative Flows
### Remove from Favorites
1. User clicks the active heart icon on a favorited product or inside their Favorites screen.
2. The System detects that the `Favorite` record exists in the database.
3. The System deletes the `Favorite` junction record.
4. The UI updates, removing the item from the user's favorites display grid.

## Exception Flows
### Product Not Found or Archived
- **Trigger**: User attempts to favorite a product that has been deleted or archived by the owner/admin.
- **System Behavior**: The System blocks the request, returns a `404 Not Found` error, and removes any dead references from active cache.

### Unauthorized Favorite Attempt
- **Trigger**: An unauthenticated guest user clicks the favorite button.
- **System Behavior**: The client interface prompts a sign-in redirect, blocking the API request before transmission.

## Business Rules
- **Authentication Locked**: Saving favorites is strictly restricted to authenticated users. Guests cannot save listings.
- **No Self-Favoriting**: A user cannot favorite a product listing that they own. This prevents artificial interest manipulation.
- **Cascade Deletion**: If a product is deleted/archived, all corresponding `Favorite` rows matching that product ID must be deleted from the junction table.

## State Changes
```text
  (Not Favorited)
         │
         ▼ (User clicks heart)
     Favorited
         │
         ▼ (User clicks heart again)
  (Not Favorited)
```
*   Favorites are represented as link associations; they do not transition states of the Product entity itself, but update the user's bookmarks junction map.

## Database Impact
- **Favorite Entity**: Writes/deletes junction records linking User and Product tables.
- **Product Entity**: Reads attributes to verify item existence and active status.
- **User Entity**: Reads attributes to verify active login session.

## Notifications
This workflow does not generate active push notifications, but is designed to trigger notifications in the future if a favorited product changes status (e.g., price drop).

## Permissions
- **Guest / Unauthenticated User**: Denied permission to create or delete favorite links.
- **Authenticated USER**: Can view their own favorites list, add favorites, and remove favorites.
- **SUPER ADMIN**: Can query favorites analytics but does not manipulate standard user bookmarks lists.

## Security Considerations
- **Composite Key Integrity**: Enforce composite primary key constraints (`user_id`, `product_id`) on the `Favorite` table to prevent duplicate link creations.
- **SQL Parameter Validation**: Ensure user ID claims are read from verified JWT payloads rather than client-supplied form inputs.

## Audit & Logging
- **Favorite Actions**: Log when a user bookmarks a product (User ID, Product ID, timestamp).
- **Unfavorite Actions**: Log removals for search demand analysis.

## Future Improvements
- **Price Drop Alerts**: Automatically notify users if a favorited product's price is updated.
- **List Sharing**: Allow users to share their favorites folder links with friends.

## Related Workflows
- **Product Discovery Workflow**: Search page provides the favorite triggers.
- **Product Lifecycle Workflow**: Intersects when products are sold/archived, updating favorite statuses.

## Summary
The Favorites Workflow helps users build a personal connection with listings on Safqa. By organizing junction relations, enforcing ownership rules, and supporting public catalogs, it improves user engagement and sets the stage for future value updates (like price-change alerts).

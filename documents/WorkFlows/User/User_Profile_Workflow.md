# User Profile Workflow

## Purpose
The User Profile Workflow manages the public presence and personal profile inventories of Safqa users. It allows users to control how they are viewed by others, present their listings in a single unified view, and update their personal metadata.

## Business Overview
In a peer-to-peer marketplace, profile pages build trust. A user's profile is their store. It displays their active listings, name, avatar, account history (join date), and ratings/moderation status. 

From a business standpoint:
1. Every user has a public store page showing all active listings they have published.
2. Users can manage their personal information (name, phone number, bio, avatar) from a private profile page.
3. Trust is enhanced by displaying active, verified information without introducing complex seller account types.

## Actors
- **USER**: Can view their own profile, edit profile details, and browse other users' public profile stores.
- **SUPER ADMIN**: Can inspect any user profile, override details if they violate platform rules, and view moderation logs.
- **System**: Processes updates, coordinates media validation for avatar updates, and indexes listings.

## Preconditions
- To view another user's public profile, the profile must exist.
- To update details, the requesting User must be authenticated and own the profile.

## Trigger
- A user clicks on a seller's name in a product listing page (triggering Public Profile View).
- A user accesses the "Profile" option in their account navigation (triggering Private Profile View).
- A user submits updates to their profile form.

## Main Workflow (Happy Path)
1. **Request Profile View**: An authenticated user clicks on their profile link.
2. **Retrieve Data**: The System queries the database to fetch the `User` details: full name, phone number, gender, bio, avatar URL, and registration date.
3. **Retrieve Inventory**: The System queries the database for all `Product` records owned by this user where `status === 'PUBLISHED'`.
4. **Display Profile**: The user interface presents the metadata and the product inventory grid to the user.
5. **Modify Profile**: The user changes their biography and uploads a new avatar image.
6. **Submit Updates**: The user clicks "Save Changes".
7. **Process Updates**: The System validates the uploaded image, updates the `User` record, updates linked `Media` assets, and saves the new biography.
8. **Confirmation**: The interface displays a success toast and updates the cached profile data.

## Alternative Flows
### Public Profile View (By another user)
1. User A clicks on User B's name on a product card.
2. The System queries User B's public metadata (omitting sensitive fields like email, status, role, and birth date) and active published listings.
3. The interface displays User B's store page, allowing User A to browse and navigate User B's active listings.

## Exception Flows
### Missing Profile
- **Trigger**: A user attempts to navigate to a User ID that does not exist in the database (e.g., via a manual URL change).
- **System Behavior**: The System blocks the query and returns a `404 Not Found` error. The UI displays an empty/missing profile screen.

### Avatar Upload File Too Large or Invalid Format
- **Trigger**: User uploads a profile image that is not a JPEG/PNG or exceeds size constraints (e.g., > 5MB).
- **System Behavior**: The file validation pipeline rejects the request, returns a validation exception, and alerts the user to upload a smaller, compatible image.

## Business Rules
- **Privacy Enforcement**: Private data such as birth date, email address, password hash, account role, and moderation status must never be returned in public profile responses.
- **Listing Visibility**: Public profile views only display products with status `PUBLISHED`. Private profile owner views display all statuses including `DRAFT`, `SOLD`, and `ARCHIVED`.
- **Identity Integrity**: Users can change their display names and bios, but their unique ID remains immutable.

## State Changes
This workflow does not transition the state of the User entity unless a SUPER ADMIN suspends it (which redirects profile requests to a block screen). It modifies attributes but not state machines.

## Database Impact
- **User Entity**: Reads attributes for display. Writes updated name, bio, and avatar fields.
- **Product Entity**: Reads listings owned by the user matching visibility status criteria.
- **Media Entity**: Updates avatar media references on upload.

## Notifications
This workflow does not generate active notifications, as it is a direct read/write action on personal assets.

## Permissions
- **Guest / Unauthenticated User**: Can view public profiles and active listings of other users.
- **Authenticated USER**: Can view public profiles, view their own private profile, and edit their own profile fields.
- **SUPER ADMIN**: Can view all profile levels and force updates or removals of profile fields containing offensive terms.

## Security Considerations
- **SQL Injection Prevention**: All queries filtering listings by `user_id` must use parameterized queries or TypeORM/Prisma bindings.
- **XSS Prevention**: User-supplied biographies and names must be sanitized on input and escaped on output in HTML pages.
- **Ownership Verification**: Before editing a profile, the System must verify that the requesting user's token ID matches the target user's database ID.

## Audit & Logging
- **Profile Updates**: Log profile update events (user ID, updated fields, IP address).
- **Abuse Detections**: Log validation failures (e.g., users uploading invalid file structures repeatedly).

## Future Improvements
- **Seller Stats**: Add metrics like "response time", "number of products sold", and "member since" badges.
- **Social Media Badging**: Links to verified Facebook or WhatsApp business accounts.

## Related Workflows
- **Authentication Workflow**: Populates initial user profile parameters.
- **File Upload Workflow**: Manages the avatar image upload stream.
- **Product Management Workflow**: Handles the inventory shown inside the profile page.

## Summary
The User Profile Workflow serves as the personal showcase and storefront for users in Safqa. It balances privacy protection with transaction transparency, helping users manage their details while building trust within the marketplace.

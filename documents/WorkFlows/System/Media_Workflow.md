# Media Workflow

## Purpose
The Media Workflow manages uploaded media assets, including sizing constraints, database associations, and display order for user profiles and product listings. It ensures uploaded assets are linked, processed, and optimized.

## Business Overview
Visual content drives transactions in online marketplaces:
1. Users upload images to show product condition or set profile avatars.
2. The System stores media links separately to allow multiple photos per listing.
3. Media is associated with a parent entity (Product, User).
4. Sellers can configure the order in which product images are displayed.

## Actors
- **USER**: Listing owner who uploads photos and manages display order.
- **SUPER ADMIN**: Reviews and removes violating media assets.
- **System**: Processes image compression, maps database records, and validates sizes.

## Preconditions
- The User is authenticated and active.
- The parent entity (Product, User) exists in the database.

## Trigger
- User uploads files during product publication or profile updates.
- User adjusts image sorting order in the listing editor.

## Main Workflow (Happy Path)
1. **Request Upload**: User uploads product images.
2. **File Processing**: The System compresses images, validates sizes (e.g., max 5MB), and uploads files to storage.
3. **Database Entry**: The System inserts a `Media` record for each image, linking `entity_id = Product ID`, `entity_type = PRODUCT`, `url = Storage URL`, and `order = Index`.
4. **Link Confirmation**: The System returns public URLs and ordering details to the client interface.
5. **Reorder**: User swaps the order of two photos.
6. **Update DB**: Client sends the new ordering list, and the System updates the `order` values of the corresponding records.

## Alternative Flows
### Media Removal
1. User clicks "Remove Photo" while editing a listing.
2. The System marks the target `Media` record as deleted and unlinks it from the parent product ID.
3. The image is removed from public display.

## Exception Flows
### Missing Parent Entity (Orphaned Media)
- **Trigger**: User uploads photos, but the product creation fails or is aborted.
- **System Behavior**: The System isolates the upload and schedules the temporary media record for cleanup by background routines.

## Business Rules
- **Size Limitations**: Individual files are limited to a maximum size of 5MB.
- **Image Limits**: Product listings can have a minimum of 1 and a maximum of 5 images.
- **Ownership Verification**: Users can only modify or reorder media records associated with entities they own.

## State Changes
```text
  Uploaded
    │
    ▼ (Linked to parent entity)
   Active
    │
    ▼ (Owner removes media / deletes listing)
  Orphaned (Deleted)
```
- **Uploaded**: Temporary state on storage upload.
- **Active**: Linked to a product or user profile.
- **Orphaned**: Unlinked from entities; scheduled for deletion.

## Database Impact
- **Media Entity**: Writes new records, updates ordering indexes, deletes records.
- **Product Entity**: Reads to map image arrays.
- **User Entity**: Reads to map profile avatars.

## Notifications
This workflow does not generate active user notifications.

## Permissions
- **Authenticated USER**: Can manage media for their own profile and listings.
- **SUPER ADMIN**: Can review all media files and delete violating images.

## Security Considerations
- **Metadata Stripping**: Strip EXIF location metadata from uploaded images on input to protect user privacy.
- **Verify Ownership**: Enforce authorization checks before processing media reorders or deletions.

## Audit & Logging
- **Media Actions**: Log media uploads, reorders, and deletions (User ID, File URL, timestamp).

## Future Improvements
- **Video Attachments**: Support short videos (up to 15 seconds) for premium products.
- **Automated Image Checking**: Integrate AI tools to automatically reject photos containing adult content or text overlay spam.

## Related Workflows
- **File Upload Workflow**: Handles raw file upload streams.
- **Product Management Workflow**: Integrates product images.

## Summary
The Media Workflow manages visual content in Safqa. By validation, separate database tracking, and supporting ordering structures, it keeps listing pages visual and engaging while optimizing server resources.

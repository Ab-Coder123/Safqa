# Category Management Workflow

## Purpose
The Category Management Workflow handles category and subcategory directories. It allows Super Admins to define, modify, and archive categories to organize marketplace listings.

## Business Overview
Consistent taxonomy is essential for marketplace usability:
1. Product categories organize products so buyers can browse and search effectively.
2. Super Admins create, update, and manage categories.
3. Categories are organized hierarchically (categories and subcategories).
4. Admins can disable categories that are no longer needed.

## Actors
- **SUPER ADMIN**: Platform manager who configures the category tree.
- **System**: Enforces uniqueness, maintains hierarchy trees, and updates database records.

## Preconditions
- The user is authenticated as a `SUPER ADMIN`.
- The parent category must exist if creating a subcategory.

## Trigger
- Super Admin opens the Category Management console.
- Super Admin submits a create, update, or archive category form.

## Main Workflow (Happy Path)
1. **Access Panel**: Super Admin logs in and opens the category settings panel.
2. **Create Request**: Admin clicks "Add Category".
3. **Input details**: Admin inputs category name, unique slug (e.g., "smart-phones"), upload an icon image, and optionally selects a parent category ID.
4. **Validation**: The System checks that the category slug is unique.
5. **Write Database**: The System inserts a `Category` record.
6. **Confirmation**: The new category appears in public search directories immediately.

## Alternative Flows
### Update Category
1. Super Admin selects an existing category and clicks "Edit".
2. Admin updates the category name or icon and saves.
3. The System updates the database record.

### Archive Category
1. Super Admin selects a category and clicks "Archive".
2. The System marks the category's status as archived (inactive).
3. The category is hidden from selection forms for new listings but remains in the database to support existing product relations.

## Exception Flows
### Duplicate Slug Error
- **Trigger**: Super Admin attempts to create a category with a slug that already exists.
- **System Behavior**: The System blocks creation, returning an error: "Category slug must be unique."

### Parent Category Deletion Violation
- **Trigger**: Super Admin attempts to delete a parent category that has active subcategories.
- **System Behavior**: The System blocks deletion, returning an error: "Cannot delete category containing active subcategories. Remove subcategories first."

## Business Rules
- **Admin Only**: Only users with the `SUPER ADMIN` role can create or modify categories.
- **No Food/Meds**: Categories related to food items or medications are prohibited.
- **Archive Over Delete**: Inactive categories are archived rather than hard-deleted to prevent breaking database integrity for existing listings.

## State Changes
```text
  Active
    │
    ▼ (Admin archives category)
  Archived
```
- **Active**: Visible in search filters and new listing forms.
- **Archived**: Hidden from forms and public browsing. Existing listings retain category IDs but are labeled.

## Database Impact
- **Category Entity**: Writes new categories, updates slugs/names, updates parent IDs.
- **Product Entity**: Reads category IDs to display listings.

## Notifications
This workflow does not generate user notifications.

## Permissions
- **Authenticated USER**: Read-only access to active categories in filters and posting forms.
- **SUPER ADMIN**: Full permission to create, edit, and archive categories.

## Security Considerations
- **Verify Roles**: Ensure category creation endpoints are secured with admin authorization guards.
- **Slug Generation**: Sanitize slug inputs to contain only lowercase letters, numbers, and dashes.

## Audit & Logging
- **Category Modifications**: Log all changes to the category tree (Admin ID, Category ID, Action, timestamp).

## Future Improvements
- **Bulk Import**: Import category trees from JSON templates.
- **Dynamic Attributes**: Define custom metadata attributes per category (e.g., car mileage, laptop RAM) to support advanced product listings.

## Related Workflows
- **Product Management Workflow**: Listing creation reads categories created here.
- **Product Discovery Workflow**: Search page uses categories for filtering.

## Summary
The Category Management Workflow provides the classification system for Safqa. By securing taxonomy controls, supporting parent/child hierarchies, and using archival states, it maintains catalog organization and supports future advanced listings.

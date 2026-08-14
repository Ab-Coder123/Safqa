# Product Discovery Workflow

## Purpose
The Product Discovery Workflow handles search query execution, filtering options, category directory browsing, and pagination. It is designed to help buyers locate listings quickly based on multiple criteria including text, categories, price range, condition, and location.

## Business Overview
Discovery is the primary entry point for consumers:
1. Users enter the marketplace and can browse all listed products chronologically.
2. Users can filter listings by Category, Condition (`NEW`, `USED`, `REFURBISHED`), Price Range, and location (Governorate).
3. Search queries execute full-text matching on product titles and descriptions.
4. Users get paginated blocks to guarantee fast page loads even on slower mobile networks.

## Actors
- **Guest / Unauthenticated User**: Can search, filter, and browse products without limitations.
- **USER**: Can search, filter, browse, and save products to favorites.
- **System**: Processes search queries, applies DB index filters, and paginated outputs.

## Preconditions
- Products must be stored in the database.
- Database indexes for search criteria (title, price, category, status) must be active.

## Trigger
- User opens the landing homepage.
- User submits a text query in the search bar.
- User selects a category in the sidebar directory.
- User modifies filters (price range, condition, governorate) and clicks search.

## Main Workflow (Happy Path)
1. **Initiate Browse**: User opens the main search/home screen.
2. **Apply Text Query**: User types "laptop" in the search input and presses enter.
3. **Select Category Filter**: User clicks "Electronics" category in the navigation panel.
4. **Define Price Range**: User sets price filters between `10000` and `25000` EGP.
5. **Set Condition**: User checks the "Used" condition filter.
6. **Set Location**: User selects "Cairo" governorate.
7. **Submit Filters**: Client sends the compiled filter request containing text, category, price range, condition, location, and page parameter.
8. **Execute Query**: The System executes a parameterized SQL query containing indexing filters, excluding `status !== 'PUBLISHED'`.
9. **Return Results**: The System returns a JSON list of products along with total page counts.
10. **Render Page**: The UI renders the product grid, displaying images, title, price, and location.

## Alternative Flows
### Category Directory Navigation
1. User clicks on a specific category (e.g., "Clothing").
2. The System queries for all listings matching that `category_id` (and its subcategories if applicable) with status `PUBLISHED`.
3. The UI presents the filtered listings.

## Exception Flows
### No Matches Found
- **Trigger**: User inputs a search query that yields zero results (e.g., "xyzabc").
- **System Behavior**: The System returns an empty list `[]`. The UI displays a friendly "No results found" screen and suggests broadening the search filters.

### Invalid Filter Ranges
- **Trigger**: User inputs a minimum price that is greater than the maximum price (e.g., Min: 500, Max: 100).
- **System Behavior**: The System validates parameters, rejects the search request with a `400 Bad Request` validation error, or automatically normalizes the range (swapping Min and Max) before querying the database.

## Business Rules
- **Active Listings Only**: Search and discovery processes must strictly exclude products with status values other than `PUBLISHED`. Listings marked as `DRAFT`, `SOLD`, or `ARCHIVED` are hidden.
- **Pagination Limits**: To protect server performance, the maximum page size (limit) is set to `20` records per request.
- **No authentication required**: Product discovery is entirely public; guest users can search and filter without logging in.

## State Changes
This workflow is strictly read-only and does not modify the state of database entities.

## Database Impact
- **Product Entity**: Reads listings matching search queries and filters.
- **Category Entity**: Reads category slugs and titles to map hierarchies.
- **Media Entity**: Reads linked media URLs to show image thumbnails in search results.

## Notifications
This workflow does not generate system notifications.

## Permissions
- **Guest / Unauthenticated User**: Full search, browse, and filter permissions.
- **Authenticated USER**: Full search, browse, filter, and access to toggle favorite statuses directly from search results.
- **SUPER ADMIN**: Full access, including viewing non-public products (Drafts/Archived) through administrative dashboards.

## Security Considerations
- **SQL Injection Prevention**: All queries, text inputs, and filter values must be processed using secure SQL query parameters or ORM binding methods.
- **Database Performance**: Appropriate indexes must be defined on `category_id`, `price`, `status`, `condition`, and `created_at` fields to prevent full table scans.
- **Full-Text Search Rate Limiting**: Limit search API invocation rates to prevent denial-of-service (DoS) attempts via heavy text parsing.

## Audit & Logging
- **Search Analytics**: Log anonymized search terms (queries, selected categories) to analyze user interests and improve platform search relevance.
- **Performance Logging**: Log queries taking longer than 500ms for optimization reviews.

## Future Improvements
- **Fuzzy Search & Auto-complete**: Suggest products/search terms as the user types.
- **Geo-location Proximity Search**: Sort listings by geographical distance from the user.
- **AI Recommendation Engine**: Recommend listings based on user search history.

## Related Workflows
- **Product Management Workflow**: Creates the listings discovered in this workflow.
- **Favorites Workflow**: Allows bookmarking discovered listings.

## Summary
The Product Discovery Workflow provides the interface between buyers and listings in Safqa. By optimizing indexing, enforcing pagination, and enabling multi-filter lookups, it ensures users find products instantly while protecting database performance.

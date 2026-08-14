# File Upload Workflow

## Purpose
The File Upload Workflow manages the technical pipeline for file uploads. It processes binary data streams, validates file types, compresses assets, and saves them to local or cloud storage.

## Business Overview
Clean asset storage is crucial for platform speed and storage costs:
1. Users upload files when updating profiles or creating listings.
2. The System intercepts files, performs format checks, and reduces resolution to optimize load times.
3. Files are stored in secure buckets, and public URLs are returned for DB mapping.

## Actors
- **USER**: Listing owner who uploads images.
- **System**: Validates formats, compresses images, and uploads files to storage.

## Preconditions
- The User is authenticated and active.
- Storage bucket configurations (local or cloud) are active.

## Trigger
- User selects a file and clicks upload.
- Client application initiates a multipart form upload request.

## Main Workflow (Happy Path)
1. **Initialize Upload**: Client sends a POST request containing binary image data.
2. **File Check**: The System intercepts the file stream and verifies the mime-type (JPEG, PNG, WEBP) and size (<= 5MB).
3. **Compression**: The System resizes the image to a maximum resolution (e.g., 1200px width) and converts it to WEBP format to save space.
4. **Write to Storage**: The System uploads the file to the target storage container.
5. **Return Link**: The System returns the public CDN URL to the client.

## Alternative Flows
- **Avatar Upload**: Profile avatars are cropped to a square (e.g., 400x400px) during the compression step.

## Exception Flows
### Invalid Mime-Type
- **Trigger**: User uploads a PDF or executable file.
- **System Behavior**: The System rejects the upload, returning a `400 Bad Request` error: "Unsupported file format. Please upload JPEG, PNG, or WEBP."

### Storage Connection Failure
- **Trigger**: The cloud storage API returns a connection timeout.
- **System Behavior**: The System logs a critical error, returns a `503 Service Unavailable` error, and asks the user to try again.

## Business Rules
- **Size Limits**: Max upload size is 5MB.
- **Format Restrictions**: Only JPEG, PNG, and WEBP formats are allowed in the MVP.
- **Auto-WEBP Conversion**: Compress and convert all uploaded images to WEBP format to reduce storage and load times.

## State Changes
Files do not change states; they are written to disk/storage and mapped via the `Media` entity.

## Database Impact
No direct database writes occur during file uploads. Links are saved in the database by corresponding entity workflows.

## Notifications
This workflow does not generate notifications.

## Permissions
- **Authenticated USER**: Can upload files.
- **SUPER ADMIN**: Can review storage bucket contents directly.

## Security Considerations
- **Content Validation**: Inspect file headers (magic bytes) to verify mime-types, preventing users from bypassing filters by renaming file extensions.
- **Malicious Upload Prevention**: Store files using random UUID filenames (e.g., `a7d8f9.webp`) instead of their original filenames to prevent directory traversal attacks.

## Audit & Logging
- **Storage Metrics**: Log upload size, duration, and output URL.
- **Failures**: Log failed uploads with error details.

## Future Improvements
- **CDN Integration**: Use AWS CloudFront or Cloudflare CDN to cache images near users.
- **Video Processing**: Process short videos using transcoding services (like FFmpeg).

## Related Workflows
- **Media Workflow**: Maps upload URLs to database records.
- **Product Management Workflow**: Calls file uploads during listing creation.

## Summary
The File Upload Workflow manages media assets in Safqa. By enforcing type checks, compressing files to WEBP, and renaming assets for security, it optimizes storage and ensures fast page loads.

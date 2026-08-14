# Error Handling Workflow

## Purpose
The Error Handling Workflow standardizes API exception handling, error responses, and client-side notifications across Safqa. It prevents information leakage (like database trace logs) while providing useful errors to users.

## Business Overview
Consistent error handling builds a premium user experience:
1. Users receive clear, localized error messages instead of system crashes.
2. The System sanitizes backend error details before returning them.
3. System errors return standard HTTP codes and messages.
4. Developers track error logs to identify and fix issues.

## Actors
- **USER**: Receives clear, friendly error messages in the UI.
- **SUPER ADMIN**: Reviews detailed server error logs to identify bugs.
- **System**: Catches exceptions, sanitizes response structures, and logs errors.

## Preconditions
- The application runtime (NestJS / Next.js) is active.
- Error interception mechanisms (global filters) are configured.

## Trigger
- An unhandled exception occurs in backend code (e.g., database disconnect, validation error, permission denied).
- The client receives a non-2xx HTTP response status.

## Main Workflow (Happy Path)
1. **Detect Error**: A database timeout occurs during listing creation.
2. **Intercept Exception**: The global exception filter catches the error.
3. **Log Internally**: The System logs the detailed error stack trace to the system log file.
4. **Sanitize Response**: The System replaces the technical database trace with a user-friendly error: "An unexpected error occurred. Please try again later."
5. **Format Response**: The System builds a standardized JSON error response body.
6. **Send Response**: The System returns the response with an appropriate status code (e.g., `500 Internal Server Error`).
7. **Render Error**: The client interface parses the JSON response and displays the error message to the user.

## Alternative Flows
- **Validation Errors**: Return a `400 Bad Request` code along with a list of invalid fields so the user can correct their input.

## Exception Flows
This workflow is the exception handler; it does not generate exception loops.

## Business Rules
- **No Stack Traces**: Stack traces and raw SQL queries must never be returned in API responses to prevent exposing database structures.
- **Standardized Format**: Every error response must follow the same structure containing status code, error type, message, and timestamp.

## State Changes
This workflow does not modify entity states.

## Database Impact
This workflow does not write to business database tables (it may write to logging tables).

## Notifications
This workflow does not generate user notifications.

## Permissions
- **Authenticated USER**: Receives standardized sanitized error messages.
- **SUPER ADMIN**: Accesses detailed server logs and traces.

## Security Considerations
- **Data Leakage Prevention**: Strip database credentials and server paths from error logs.
- **Sanitize Input**: Validate all error response parameters to prevent XSS.

## Audit & Logging
- **Log Exceptions**: Log all uncaught exceptions (status, endpoint, message, trace, timestamp).

## Future Improvements
- **Automatic Alerting**: Integrate monitoring tools (like Sentry) to notify the dev team when 500 errors occur.
- **Localized Errors**: Return error messages in Arabic or English based on user settings.

## Related Workflows
- **Logging Workflow**: Tracks error events in detail.
- **Authentication Workflow**: Handles login validation errors.

## Summary
The Error Handling Workflow standardizes error responses in Safqa. By separating internal logs from client responses and returning clear, sanitized errors, it improves security and ensures a smooth user experience.

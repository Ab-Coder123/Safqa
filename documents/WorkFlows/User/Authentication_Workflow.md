# Authentication Workflow

## Purpose
The Authentication Workflow handles the registration, identification, credential verification, and session management of all system actors. It acts as the gatekeeper of the Safqa platform, ensuring that only authenticated users can publish products, manage profiles, save favorites, send messages, and submit reports, while verifying administrative privileges for system-level controls.

## Business Overview
In a modern marketplace like Safqa, trust and simple access are paramount. To protect the platform from spam, fraudulent postings, and server abuse, any participant who wishes to interact with the marketplace (other than search and discovery) must possess a verified identity. 

The business process is designed to be as simple as possible for users:
1. Registration requires name, email, phone number, gender, birth date, and an avatar.
2. Login is performed via email and password credentials.
3. Authenticated sessions allow full marketplace interactions.
4. Logout securely terminates the active session.

No guest user is allowed to post listings, favorite products, or communicate.

## Actors
- **USER**: Represents the standard buyer and seller who registers an account, logs in, and authenticates to perform active transactions.
- **SUPER ADMIN**: The platform manager with complete system access, validated via administrative claims during authentication.
- **System**: The underlying infrastructure that processes validation rules, hashes credentials, generates tokens, and enforces security constraints.

## Preconditions
- The user has a device connected to the internet.
- The platform application (Web or Mobile) is operational.

## Trigger
- A guest user requests access to an authentication-restricted feature (e.g., clicking "Publish Product" or "Favorites").
- A user clicks "Register" or "Login" in the navigation area.
- An authenticated user clicks "Logout".

## Main Workflow (Happy Path)
1. **Request Registration**: The user accesses the registration form on the client interface.
2. **Provide Details**: The user inputs their full name, unique email address, unique mobile phone number, gender selection, birth date, and uploads an avatar image.
3. **Submit Form**: The user submits the registration request.
4. **Server Validation**: The System checks that the email and phone number are not already registered. It validates that the password meets complexity requirements and hashes it using Argon2/bcrypt.
5. **Entity Creation**: The System inserts a new `User` record into the database with the role of `USER` and status `ACTIVE`.
6. **Token Issuance**: The System generates a JWT Access Token (short-lived) and a JWT Refresh Token (long-lived) and returns them to the client.
7. **Session Established**: The client stores the tokens securely, and the user is redirected to the home screen as an authenticated USER.

## Alternative Flows
### User Login (Existing Account)
1. The user requests the login screen.
2. The user inputs their registered email and password.
3. The System verifies the email exists and compares the input password against the stored password hash.
4. Upon successful validation, the System updates the last login timestamp, issues fresh JWT tokens, and establishes the session.

### Session Refresh (Automatic)
1. The client-side application detects that the short-lived JWT Access Token is near expiration.
2. The client sends the stored JWT Refresh Token to the token refresh endpoint.
3. The System validates the refresh token against database records.
4. Upon successful validation, the System issues a new JWT Access Token, avoiding user interruption.

## Exception Flows
### Email or Phone Number Already Exists
- **Trigger**: The user attempts to register with an email or phone number that is already associated with an active or suspended account.
- **System Behavior**: The System blocks the registration transaction, logs a validation failure warning, and returns a detailed validation error message (e.g., "The email address is already in use") to the client interface.

### Invalid Login Credentials
- **Trigger**: User inputs a wrong password or unregistered email.
- **System Behavior**: The System denies access, returns a generic "Invalid email or password" error (to prevent user enumeration attacks), and blocks session establishment.

### Suspended Account Access Attempt
- **Trigger**: A user with account status `SUSPENDED` attempts to log in.
- **System Behavior**: The System verifies the login credentials, detects the `SUSPENDED` status, terminates the session creation process, and returns a block message indicating the account is suspended and directing them to contact support.

## Business Rules
- **Unique Identifiers**: Email and phone number must be unique across the entire database to maintain clear entity mapping.
- **Role Control**: The default registration role is always `USER`. The role of `SUPER ADMIN` cannot be self-registered and must be configured directly in the database.
- **Required Avatar**: Unlike standard marketplaces, uploading an avatar image is mandatory during registration to foster a community of trust.
- **Password Protection**: Plaintext passwords must never be logged, processed in memory longer than necessary, or stored in the database.

## State Changes
```text
(Non-existent)
      │
      ▼ (User submits registration)
  Registered
      │
      ▼ (Email/Phone uniqueness verified)
    Active
      │
      ├─────────────────────────┐
      ▼ (Admin suspends user)   ▼ (User requests deletion)
  Suspended                  Deleted
```
*   **Active**: Set automatically on successful validation and database insertion.
*   **Suspended**: Set by a `SUPER ADMIN` when a user violates rules.
*   **Deleted**: Set when a user requests account deletion, triggering a soft-delete process.

## Database Impact
- **User Entity**: Reads email/phone for uniqueness checks. Writes new user rows, updates status and refresh tokens.
- **Media Entity**: Registers the uploaded avatar URL and links it to the newly created User ID.

## Notifications
- **Moderation Notification**: If an account status is updated to `SUSPENDED`, the system generates an email notification containing the reason and suspension duration.

## Permissions
- **Guest / Unauthenticated User**: Can only call the `register`, `login`, and `refresh` authentication endpoints.
- **Authenticated USER**: Can request token refresh and perform log out.
- **SUPER ADMIN**: Can query user authentication statuses and update user status values to suspend or activate accounts.

## Security Considerations
- **Password Hashing**: Done via Argon2id / bcrypt with strong salt parameters.
- **Token Security**: JWT Access Tokens should be stored in memory, and Refresh Tokens must be stored in secure HttpOnly, SameSite, and Secure cookies to protect against XSS and CSRF attacks.
- **Rate Limiting**: The login and registration endpoints must be rate-limited (e.g., maximum 5 attempts per IP per minute) to prevent brute-force and credential-stuffing attacks.

## Audit & Logging
- **Success Events**: Log successful user registrations and logins (storing user ID, IP address, and timestamp).
- **Failure Events**: Log failed login attempts with IP addresses and input emails (omitting passwords) to monitor for malicious scanning activity.
- **Audit Trails**: Log administrative role elevations or user status suspensions (who did it, when, why).

## Future Improvements
- **Two-Factor Authentication (2FA)**: Adding SMS or TOTP verification to enhance security.
- **Social Auth Integration**: Google and Facebook authentication options for faster onboarding.
- **Active Sessions Management**: Allow users to view and revoke active sessions from other devices.

## Related Workflows
- **User Profile Workflow**: Consumes user metadata established during authentication.
- **User Settings Workflow**: Handles password changes and account deletion.
- **Permission Workflow**: Consumes authentication token claims to check access rights.

## Summary
The Authentication Workflow guarantees that every active user on Safqa possesses a validated, secure identity. By establishing clean session controls, it forms the security foundation upon which the rest of the marketplace interactions depend.

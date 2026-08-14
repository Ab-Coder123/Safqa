# Messaging Workflow

## Purpose
The Messaging Workflow handles secure chat sessions and message delivery between buyers and sellers regarding listings. It enables negotiations and deal agreements directly on the platform, while offering direct redirection to WhatsApp.

## Business Overview
Direct communication is the heart of peer-to-peer negotiations:
1. Buyers discover products and can start a chat regarding a specific product listing.
2. Conversations group messages between two participants.
3. Message logs are retained so participants can track negotiation terms.
4. Users can transition to WhatsApp to finalize arrangements.
5. Inappropriate messages can be reported for moderation review.

## Actors
- **USER (One / Participant One)**: User who initiates or receives messages in a chat.
- **USER (Two / Participant Two)**: User who initiates or receives messages in a chat.
- **SUPER ADMIN**: Platform manager who can review reported message logs.
- **System**: Routes messages, handles read states, and triggers notifications.

## Preconditions
- Both users are authenticated and possess `ACTIVE` account statuses.
- The target Product exists, belongs to one of the users, and has `PUBLISHED` status.

## Trigger
- A user clicks "Send Message" on a product details page.
- A user submits a message form in an active conversation.
- A user clicks "Contact via WhatsApp".

## Main Workflow (Happy Path)
1. **Initiate Conversation**: User A clicks "Send Message" on User B's product listing.
2. **Find/Create Conversation**: The System searches for an active `Conversation` between User A and User B regarding the product. If not found, it creates a new `Conversation` record with participants `user_one_id = User A` and `user_two_id = User B`.
3. **Open Chat View**: The interface loads the conversation history.
4. **Send Message**: User A types a message and clicks send.
5. **Write Message**: The System validates input, writes a new `Message` record, updates `last_message_at`, and returns the message.
6. **Real-time Delivery**: The System delivers the message to User B (e.g., via WebSocket) and sends a notification if User B is offline.
7. **Read Confirmation**: When User B opens the chat, the System sets `is_read = true` for User A's sent messages.

## Alternative Flows
### Redirect to WhatsApp (External communication)
1. User A clicks "Contact via WhatsApp" on a listing.
2. The System retrieves the product's `whatsapp_number`.
3. The client opens a WhatsApp link formatted with the number and a pre-filled message (e.g., "Hi, I'm interested in your product: [Title] listed on Safqa").
4. Communication transitions to WhatsApp, bypasses platform chat, and completes externally.

## Exception Flows
### Product Not Available for Chat
- **Trigger**: User tries to start a chat regarding a product that is `SOLD` or `ARCHIVED`.
- **System Behavior**: The System blocks conversation initialization, returns an error message: "New conversations cannot be started for unavailable products," and disables chat buttons.

### Message Sending Blocked (Suspended User)
- **Trigger**: A participant is suspended during an active chat.
- **System Behavior**: The System blocks message insertion, returns an error: "Unable to send message. Account suspended," and archives the conversation.

## Business Rules
- **Role Neutrality**: Conversations use participant references `user_one_id` and `user_two_id` instead of buyer/seller roles. Either participant can buy or sell across different interactions.
- **No Self-Messaging**: A user cannot start a conversation with themselves.
- **Message Integrity**: Once sent, messages cannot be deleted or modified by users in the MVP to preserve negotiation history for dispute review.

## State Changes
```text
  (Non-existent)
         │
         ▼ (Conversation initiated)
       Active
         │
         ▼ (Owner deletes account)
      Archived
```
*   Conversations are created as `Active` and transitioned to `Archived` only if a participant's account is deleted.

## Database Impact
- **Conversation Entity**: Creates or updates conversation timestamps.
- **Message Entity**: Writes new messages, updates read statuses.
- **User Entity**: Reads details of participants.
- **Product Entity**: Reads details to map the conversation subject.

## Notifications
- **New Message Notification**: If a message is sent and the recipient is offline (no active WebSocket session), the system generates a `Notification` with type `COMMENT/SYSTEM` and alerts the recipient.

## Permissions
- **Guest / Unauthenticated User**: Blocked from accessing chat pages or sending messages.
- **Authenticated USER**: Can view their conversations, send messages, and view received messages.
- **SUPER ADMIN**: Can review messages linked to reported conversations for platform safety.

## Security Considerations
- **Participant Verification**: The System must verify that the requesting user's ID matches `user_one_id` or `user_two_id` of the target conversation before retrieving messages.
- **Input Sanitization**: Escape message contents to prevent XSS payloads.
- **Rate Limiting**: Limit message send frequency (e.g., max 30 messages/minute) to prevent chat script spam.

## Audit & Logging
- **Conversation Initiations**: Log new conversations (ID, User One, User Two, Product ID, timestamp).
- **Security Interventions**: Log attempts to access conversations by non-participants.

## Future Improvements
- **Attachment Support**: Send product photos or audio clips.
- **Auto-translate**: Automatic translation for multi-lingual users.

## Related Workflows
- **Product Lifecycle Workflow**: Intersects when a product's state changes, blocking new chats.
- **Notification Workflow**: Delivers alerts when messages are received offline.

## Summary
The Messaging Workflow enables buyer-seller communication in Safqa. By maintaining role neutrality, providing WhatsApp options, and securing chat logs, it supports successful deals while keeping interactions clean and reliable.

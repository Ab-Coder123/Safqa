# Logging Workflow

## Purpose
The Logging Workflow manages system logging, request monitoring, and security audit trails across Safqa. It records platform activity to help developers troubleshoot issues and monitor administrative changes.

## Business Overview
Consistent logging is essential for system maintenance and security:
1. System logs record API calls, errors, and system events.
2. Audit logs record administrative changes (user bans, listing removals).
3. Logging standards prevent sensitive data (like passwords) from being recorded.
4. Logs help developers locate and resolve system issues quickly.

## Actors
- **SUPER ADMIN**: Reviews audit logs to monitor platform activity.
- **System**: Automatically records request logs and errors.

## Preconditions
- The logging framework (NestJS Logger / Winston) is active.
- Log storage configurations (files or database) are active.

## Trigger
- An HTTP request is received by the API.
- An unhandled error occurs.
- A Super Admin performs an administrative action.

## Main Workflow (Happy Path)
1. **Receive Request**: An HTTP request is sent to the backend.
2. **Log Request**: The System records request details: method, URL, client IP, and timestamp.
3. **Execute Controller**: The endpoint logic processes the request.
4. **Log Action**: If it's a creation or update, the System logs the action (e.g. "Listing ID 123 published by User 456").
5. **Log Response**: The System logs the response status code and latency (in ms).
6. **Log Storage**: The log entry is formatted and written to the log file or monitoring stream.

## Alternative Flows
### Administrative Action Logging
1. Super Admin suspends a user account.
2. The System writes an audit log entry: "Admin 101 suspended User 456 for reason: Spam".
3. The log is flagged as an audit trail entry for long-term storage.

## Exception Flows
This workflow is the logger; it does not generate exception loops.

## Business Rules
- **No Sensitive Logs**: Plaintext passwords, credit card details, and raw JWT tokens must never be written to logs.
- **Structured Logs**: All logs must be written in JSON format to support indexing and searches.
- **Retention Policy**: Log files are rotated daily and kept for 30 days before deletion.

## State Changes
This workflow does not transition entity states.

## Database Impact
This workflow does not affect business database tables (it may write to logging tables).

## Notifications
This workflow does not generate user notifications.

## Permissions
- **Authenticated USER**: No access to system logs.
- **SUPER ADMIN**: Access to view audit logs and error metrics.

## Security Considerations
- **Log Injection Protection**: Sanitize log inputs to prevent attackers from injecting fake log entries.
- **Data Protection**: Store log files securely with restricted directory permissions.

## Audit & Logging
This workflow defines the platform's logging and audit trail standards.

## Future Improvements
- **Log Indexing Integration**: Integrate search tools (like Elasticsearch / Logstash / Kibana) for real-time log analysis.
- **Anomaly Detection**: Automatically alert the team when error rates spike.

## Related Workflows
- **Error Handling Workflow**: Generates error logs during exceptions.
- **Admin Workflow**: Triggers audit logs for admin actions.

## Summary
The Logging Workflow monitors platform activity in Safqa. By recording request details, tracking admin actions, and protecting sensitive data, it keeps the system secure and easy to troubleshoot.

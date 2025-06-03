# Project Workflow - Data Flow Diagram

## Level 0 DFD (System Overview)
```mermaid
graph TD
    User((User/Client))
    NextApp[Next.js Application]
    EmailService[Email Service]
    MongoDB[(MongoDB Database)]

    User -->|Requests/Forms| NextApp
    NextApp -->|Store Data| MongoDB
    NextApp -->|Send Emails| EmailService
    EmailService -->|Email Notifications| User
    MongoDB -->|Fetch Data| NextApp
    NextApp -->|Responses/UI| User
```

## Level 1 DFD (Detailed Process Flow)
```mermaid
graph TD
    User((User/Client))
    
    %% Authentication Flow
    Auth[Authentication]
    AuthDB[(Auth Store)]
    Auth -->|Store Session| AuthDB
    AuthDB -->|Validate Session| Auth
    User -->|Login/Register| Auth
    Auth -->|Session Token| User

    %% Contact Form Flow
    Contact[Contact Form]
    MessageDB[(Message Store)]
    EmailQueue[Email Queue]
    User -->|Submit Form| Contact
    Contact -->|Store Message| MessageDB
    Contact -->|Queue Email| EmailQueue
    EmailQueue -->|Send Notification| User

    %% Message Management Flow
    Admin[Admin Dashboard]
    MessageList[Message List]
    MessageDB -->|Fetch Messages| MessageList
    MessageList -->|Display| Admin
    Admin -->|Reply| MessageDB
    MessageDB -->|Update Status| MessageList

    %% Email Processing
    EmailProcessor[Email Processor]
    EmailQueue -->|Process| EmailProcessor
    EmailProcessor -->|Send| User
    EmailProcessor -->|Update Status| MessageDB
```

## Data Stores
```mermaid
erDiagram
    MESSAGES {
        string id
        string name
        string email
        string subject
        string message
        boolean replied
        timestamp created_at
        timestamp updated_at
        string status
    }
    
    EMAIL_QUEUE {
        string id
        string to
        string from
        string subject
        string content
        string status
        timestamp scheduled_for
        timestamp sent_at
    }
    
    USERS {
        string id
        string email
        string name
        string role
        timestamp last_login
    }
```

## Process Flows

### 1. Contact Form Submission
- User fills out contact form
- Form data validated client-side
- Data sent to Next.js API
- Message stored in MongoDB
- Email notification queued
- Confirmation sent to user

### 2. Message Management
- Admin views message list
- Messages fetched from MongoDB
- Filtered and sorted as needed
- Status updates tracked
- Replies processed and sent
- History maintained

### 3. Email Processing
- Emails queued for sending
- Processed through Resend API
- Delivery status tracked
- Failed sends retried
- Success/failure logged

### 4. Admin Operations
- Dashboard access control
- Message status management
- Reply composition and sending
- Email template management
- Analytics and reporting

## Security Implementation

1. **User Authentication**
   - Session-based auth
   - Secure cookie handling
   - Role-based access control

2. **Data Protection**
   - Input sanitization
   - XSS prevention
   - CSRF protection
   - Rate limiting

3. **Email Security**
   - SPF records
   - DKIM signing
   - Email validation
   - Spam prevention

## Error Handling

1. **Form Submission**
   - Input validation
   - Rate limiting
   - Duplicate prevention
   - Error feedback

2. **Email Processing**
   - Delivery retries
   - Bounce handling
   - Invalid email detection
   - Queue management

3. **System Errors**
   - Error logging
   - Monitoring
   - Alerting
   - Recovery procedures

## API Endpoints

### Contact API
```typescript
POST /api/contact
GET /api/messages
POST /api/messages/reply
GET /api/messages/status
```

### Email API
```typescript
POST /api/email/send
GET /api/email/status
POST /api/email/retry
```

### Admin API
```typescript
GET /api/admin/dashboard
POST /api/admin/settings
GET /api/admin/analytics
``` 
# Customer Support Chatbot - Backend

A real-time customer support chat backend built with Node.js, Express, TypeScript, Sequelize, PostgreSQL, and Socket.IO.

## Tech Stack

* **Node.js** & **Express** - Server framework
* **TypeScript** - Type-safe development
* **PostgreSQL** - Database
* **Sequelize** - ORM for database management
* **Socket.IO** - Real-time WebSocket communication
* **JWT** - Authentication
* **bcryptjs** - Password hashing

## Features

* ✅ Admin authentication (signup/login)
* ✅ Real-time chat with WebSocket support
* ✅ Session management for customer conversations
* ✅ Message history and persistence
* ✅ Typing indicators
* ✅ RESTful API endpoints
* ✅ JWT-based authentication

## Project Structure

```
backend/
├── src/
│   ├── index.ts           # Main server file
│   ├── types/             # TypeScript interfaces
│   ├── middleware/        # Auth middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   │   ├── auth.ts        # Authentication endpoints
│   │   ├── sessions.ts    # Session management
│   │   └── chat.ts        # Message endpoints
│   └── socket.ts          # Socket.IO event handlers
├── config/
│   └── database.ts        # Sequelize database config
├── .env                   # Environment variables
├── package.json
└── tsconfig.json
```

## Prerequisites

* Node.js (v16 or higher)
* PostgreSQL (v12 or higher)
* npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgres://postgres:vidhi123@localhost:5434/chatApp"
JWT_SECRET="jwt-secret"
PORT=3001
NODE_ENV="development"
```

**Important:** Replace `username`, `password`, and `chatApp` with your PostgreSQL credentials.

### 4. Set up the database

Create a PostgreSQL database:

```bash
# Access PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE chatApp;

# Exit
\q
```

### 5. Run Sequelize migrations (if any)

```bash
npx sequelize-cli db:migrate
```

## Running the Application

### Development mode

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

#### Register Admin

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword",
  "fullName": "Admin Name"
}
```

#### Login Admin

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

### Sessions

#### Get All Sessions

```http
GET /api/sessions
Authorization: Bearer <token>
```

#### Create Session

```http
POST /api/sessions
Content-Type: application/json

{
  "userId": "user-123",
  "userName": "John Doe",
  "userEmail": "john@example.com"
}
```

#### Update Session Status

```http
PATCH /api/sessions/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed"
}
```

### Messages

#### Get Messages by Session

```http
GET /api/chat/messages/:sessionId
Authorization: Bearer <token>
```

#### Create Message

```http
POST /api/chat/messages
Content-Type: application/json

{
  "sessionId": "session-id",
  "senderType": "user",
  "content": "Hello, I need help!"
}
```

#### Mark Message as Read

```http
PATCH /api/chat/messages/:id/read
Authorization: Bearer <token>
```

## WebSocket Events

### Client to Server

#### Join Session

```javascript
socket.emit('join_session', sessionId);
```

#### Leave Session

```javascript
socket.emit('leave_session', sessionId);
```

#### Send Message

```javascript
socket.emit('send_message', {
  sessionId: 'session-id',
  senderType: 'user',
  content: 'Hello!',
  senderId: 'user-id' // optional
});
```

#### Send Typing Status

```javascript
socket.emit('typing', {
  sessionId: 'session-id',
  userType: 'user',
  isTyping: true
});
```

### Server to Client

#### New Message

```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

#### User Typing

```javascript
socket.on('user_typing', (data) => {
  console.log('Typing:', data);
});
```

## Database Models (Sequelize)

### Admin

* `id` (UUID, Primary Key)
* `email` (String, Unique)
* `password` (String, Hashed)
* `fullName` (String, Optional)
* `createdAt` (DateTime)

### ChatSession

* `id` (UUID, Primary Key)
* `userId` (String)
* `userName` (String, Optional)
* `userEmail` (String, Optional)
* `status` (String: 'active' | 'closed')
* `createdAt` (DateTime)
* `updatedAt` (DateTime)

### Message

* `id` (UUID, Primary Key)
* `sessionId` (UUID, Foreign Key)
* `senderType` (String: 'user' | 'admin')
* `senderId` (String, Optional)
* `content` (Text)
* `isRead` (Boolean)
* `createdAt` (DateTime)

### TypingIndicator

* `id` (UUID, Primary Key)
* `sessionId` (UUID, Foreign Key)
* `userType` (String: 'user' | 'admin')
* `isTyping` (Boolean)
* `updatedAt` (DateTime)

## Testing

### Create an admin user

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123","fullName":"Admin User"}'
```

### Test WebSocket connection

Use a WebSocket client or the frontend application to test real-time features.

## Troubleshooting

### Database connection issues

1. Verify PostgreSQL is running:

```bash
sudo service postgresql status
```

2. Check `DATABASE_URL` in `.env` is correct

3. Ensure database exists:

```bash
psql -U postgres -l
```

### Port already in use

Change the `PORT` in `.env` or kill the process:

```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>
```

## Security Notes

* Always use strong `JWT_SECRET`
* Never commit `.env` file to version control
* Sanitize user inputs
* Implement rate limiting for API endpoints

## License

MIT

## Support

For issues and questions, please open an issue in the repository.

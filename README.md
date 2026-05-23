# Hospital Management System

Enterprise hospital management system with Node.js, Express, MongoDB, JWT, EJS, Socket.io, and Docker.

## Features

- Authentication and authorization with JWT, roles, email verification, password reset, session tracking
- Patient management, doctor scheduling, appointment workflow, billing and payment processing
- Real-time appointment updates using Socket.io
- Modular architecture with controllers, services, repositories, middleware, validators, routes
- Production-ready Docker + MongoDB support
- REST APIs with validation, error handling, rate limiting

## Getting Started

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:4000`

## Docker

```bash
docker compose up --build
```

## Testing

```bash
npm test
```

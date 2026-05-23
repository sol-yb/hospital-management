# Architecture Overview

## Layers

- `src/controllers` — route handlers and request orchestration.
- `src/services` — business logic, rules, and workflows.
- `src/models` — MongoDB schema definitions for users, patients, appointments, invoices, sessions and audit logs.
- `src/routes` — RESTful endpoints organized by domain.
- `src/middleware` — authentication, authorization, validation, error handling, file upload, and rate limiting.
- `src/utils` — reusable helpers, response shaping, email templates, PDF generation, and sanitization.
- `src/sockets` — real-time appointment update channels via Socket.io.
- `src/jobs` — background reminder jobs for appointment notifications.

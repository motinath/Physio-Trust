# PhysioTrust API Design Standards

## 1. REST Endpoint Conventions
- Version prefix: `/api/v1/`
- Naming convention: plural nouns for resources (e.g. `/api/v1/signals`, `/api/v1/users`).

## 2. Standard Envelope JSON Format

```json
{
  "success": true,
  "message": "Operation executed successfully",
  "data": {},
  "timestamp": "2026-08-02T14:22:40Z"
}
```

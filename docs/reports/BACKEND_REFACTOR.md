# PhysioTrust Backend Refactoring Specifications

This document outlines the layering cleanup, service isolation, and OpenAPI metadata standards of the backend.

---

## 1. Request Lifecycle Mappings

```
[HTTP REST Request]  ──>  FastAPI Router (routes.py)  ──>  JWT Middleware (auth.py)
                                                                 │
                                                                 ▼
[ORM SQL Results]   ◄──   Repository CRUD   ◄──   DB Service   ◄─┘
```

---

## 2. Refactored Configurations

- **FastAPI Metadata**: Configured with the definitive identity statement.
- **Service Isolation**: All business logic (e.g. database transactions for signals) is fully isolated in `backend/app/services/` to prevent tight coupling within routers.

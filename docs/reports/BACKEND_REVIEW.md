# PhysioTrust Backend Layering & Security Review

This review documents the structural architecture, middleware orchestration, and authentication patterns of the FastAPI backend.

---

## 1. Modular Backend Layers

The backend follows a strict **Controller-Service-Repository** pattern under `backend/app/`:

- **Controller Layer (`api/routes.py`)**: Defines REST endpoint paths, parses query/request bodies, and validates input structures.
- **Service Layer (`services/`)**: Implements database logic for managing user profiles and recorded signals.
- **Repository Layer (`repositories/`)**: Performs database queries using SQLAlchemy.
- **Dependency Layer (`dependencies/auth.py`)**: Implements dependency injection for user authentication and JWT validation.

---

## 2. Authentication & Middleware Verification

- **JWT Tokens**: Bearer tokens are issued dynamically and validated using FastAPI security scopes.
- **CORS Config**: Active, allowing secure cross-origin requests from Vite development servers.

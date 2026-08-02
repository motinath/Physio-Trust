from typing import Generator
from backend.app.db.session import get_db


def get_db_session() -> Generator:
    """Dependency injection helper for database sessions."""
    return get_db()

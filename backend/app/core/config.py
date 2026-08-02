import os


class Settings:
    PROJECT_NAME: str = "PhysioTrust AI Platform"
    VERSION: str = "1.0.0-RC1"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./physiotrust.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "physiotrust_internal_secret_key_v8")


settings = Settings()

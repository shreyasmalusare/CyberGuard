from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str
    APP_VERSION: str
    APP_DESCRIPTION: str

    API_PREFIX: str

    HOST: str
    PORT: int

    DEBUG: bool
    LOG_LEVEL: str

    DATABASE_URL: str

    class Config:
        env_file = ".env"
        extra = "ignore"


# IMPORTANT: safe initialization
def get_settings():
    return Settings()


settings = get_settings()
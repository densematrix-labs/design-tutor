from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Design Tutor"
    LLM_PROXY_URL: str = "https://llm-proxy.densematrix.ai"
    LLM_PROXY_KEY: str = ""
    TOOL_NAME: str = "design-tutor"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

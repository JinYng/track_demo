from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    """应用配置"""
    
    # 基础配置
    APP_NAME: str = "AI Genomics Assistant"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # CORS配置
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # AI服务配置
    DEFAULT_AI_MODEL: str = "Qwen/Qwen3-VL-8B-Instruct"
    DEFAULT_AI_BASE_URL: str = "https://api-inference.modelscope.cn/v1"
    
    # Groq配置
    GROQ_API_BASE_URL: str = "https://api.groq.com/openai/v1"
    GROQ_API_KEY: str = ""
    GROQ_MODEL_NAME: str = "llama-3.1-8b-instant"
    
    # ModelScope配置
    MODELSCOPE_API_BASE_URL: str = "https://api-inference.modelscope.cn/v1"
    MODELSCOPE_API_KEY: str = ""
    MODELSCOPE_MODEL_NAME: str = "ZhipuAI/GLM-4.5"
    
    # JBrowse配置
    JBROWSE_CONFIG_PATH: str = "./data/jbrowse"
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
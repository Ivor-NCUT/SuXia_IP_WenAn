import os
from dotenv import load_dotenv

load_dotenv()

PLACEHOLDER_VALUES = {
    "your_api_key_here",
    "your_api_secret_here",
    "your_dashscope_api_key",
    "your_bailian_api_key",
}

def _clean_env_value(value: str | None) -> str:
    if not value:
        return ""

    cleaned = value.strip()
    if cleaned.lower() in PLACEHOLDER_VALUES:
        return ""

    return cleaned

class Config:
    DASHSCOPE_API_KEY = _clean_env_value(os.getenv("DASHSCOPE_API_KEY")) or _clean_env_value(os.getenv("BAILIAN_API_KEY"))
    BAILIAN_API_KEY = DASHSCOPE_API_KEY
    BAILIAN_MODEL = _clean_env_value(os.getenv("BAILIAN_MODEL")) or "kimi-k2.6"
    BAILIAN_BASE_URL = _clean_env_value(os.getenv(
        "BAILIAN_BASE_URL",
        "https://dashscope.aliyuncs.com/compatible-mode/v1",
    )) or "https://dashscope.aliyuncs.com/compatible-mode/v1"
    
config = Config()

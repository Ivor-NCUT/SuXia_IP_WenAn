import os
from dotenv import load_dotenv

load_dotenv()

PLACEHOLDER_VALUES = {
    "your_api_key_here",
    "your_api_secret_here",
    "your_dashscope_api_key",
    "your_bailian_api_key",
    "your_tokendance_api_key",
}

def _clean_env_value(value: str | None) -> str:
    if not value:
        return ""

    cleaned = value.strip()
    if cleaned.lower() in PLACEHOLDER_VALUES:
        return ""

    return cleaned

class Config:
    TOKENDANCE_API_KEY = (
        _clean_env_value(os.getenv("TOKENDANCE_API_KEY"))
        or _clean_env_value(os.getenv("DASHSCOPE_API_KEY"))
        or _clean_env_value(os.getenv("BAILIAN_API_KEY"))
    )
    TOKENDANCE_MODEL = (
        _clean_env_value(os.getenv("TOKENDANCE_MODEL"))
        or _clean_env_value(os.getenv("BAILIAN_MODEL"))
        or "kimi-k2.6"
    )
    TOKENDANCE_BASE_URL = _clean_env_value(os.getenv(
        "TOKENDANCE_BASE_URL",
        "https://tokendance.space/gateway/v1",
    )) or "https://tokendance.space/gateway/v1"
    TOKENDANCE_PROVIDER = _clean_env_value(os.getenv("TOKENDANCE_PROVIDER")) or "infini-ai"

    # Backward-compatible aliases for older deployment variables.
    DASHSCOPE_API_KEY = TOKENDANCE_API_KEY
    BAILIAN_API_KEY = TOKENDANCE_API_KEY
    BAILIAN_MODEL = TOKENDANCE_MODEL
    BAILIAN_BASE_URL = TOKENDANCE_BASE_URL
    
config = Config()

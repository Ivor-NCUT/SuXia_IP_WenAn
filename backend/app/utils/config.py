import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY", "") or os.getenv("BAILIAN_API_KEY", "")
    BAILIAN_API_KEY = DASHSCOPE_API_KEY
    BAILIAN_MODEL = os.getenv("BAILIAN_MODEL", "kimi-k2.6")
    BAILIAN_BASE_URL = os.getenv(
        "BAILIAN_BASE_URL",
        "https://dashscope.aliyuncs.com/compatible-mode/v1",
    )
    
config = Config()

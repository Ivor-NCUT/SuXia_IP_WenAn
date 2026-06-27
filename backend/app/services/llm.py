from typing import AsyncIterator, Dict

from app.utils.config import config


def get_llm_client():
    """
    创建词元跳动 OpenAI 兼容客户端。
    """
    if not config.TOKENDANCE_API_KEY:
        raise ValueError("请配置 TOKENDANCE_API_KEY 环境变量")

    from openai import AsyncOpenAI

    return AsyncOpenAI(
        api_key=config.TOKENDANCE_API_KEY,
        base_url=config.TOKENDANCE_BASE_URL,
    )


async def stream_llm(prompt: str) -> AsyncIterator[str]:
    """
    流式调用词元跳动 kimi-k2.6 生成文案。
    """
    client = get_llm_client()
    stream = await client.chat.completions.create(
        model=config.TOKENDANCE_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.6,
        max_tokens=4000,
        stream=True,
        extra_body={
            "enable_thinking": False,
            "provider": {
                "only": [config.TOKENDANCE_PROVIDER],
                "allow_fallbacks": False,
            },
        },
    )

    async for chunk in stream:
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta
        content = getattr(delta, "content", None)
        if content:
            yield content


async def call_llm(prompt: str) -> str:
    """
    调用模型 API 生成完整文案。
    """
    chunks = []
    async for chunk in stream_llm(prompt):
        chunks.append(chunk)
    return "".join(chunks)


call_bailian = call_llm
stream_bailian = stream_llm


def parse_llm_response(response: str) -> Dict[str, str]:
    """
    解析 LLM 返回的文案。
    """
    persona_start = response.find("【人设文案】")
    business_start = response.find("【业务文案】")

    persona = ""
    business = ""

    if persona_start != -1:
        start = persona_start + len("【人设文案】")
        end = business_start if business_start != -1 else len(response)
        persona = response[start:end].strip()

    if business_start != -1:
        start = business_start + len("【业务文案】")
        business = response[start:].strip()

    if not persona and not business:
        persona = response.strip()

    return {
        "persona": persona,
        "business": business,
    }

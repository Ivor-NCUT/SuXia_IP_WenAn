import os
import tempfile
import json
from collections.abc import AsyncIterator
from typing import Dict
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from app.services.document import docx_to_markdown, parse_markdown_to_fields, generate_prompt
from app.services.llm import call_llm, parse_llm_response, stream_llm

router = APIRouter()

async def process_document(file: UploadFile) -> Dict[str, str]:
    """
    处理上传的文档并生成文案
    
    Args:
        file: 上传的文件
        
    Returns:
        生成的文案字典
    """
    suffix = os.path.splitext(file.filename or "")[1].lower()
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    temp_path = temp_file.name
    
    try:
        with temp_file:
            temp_file.write(await file.read())
        
        md_content = docx_to_markdown(temp_path)
        fields = parse_markdown_to_fields(md_content)
        prompt = generate_prompt(fields, md_content)
        llm_response = await call_llm(prompt)
        result = parse_llm_response(llm_response)
        
        return result
    
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

async def stream_document(file: UploadFile) -> AsyncIterator[dict]:
    """
    处理上传文档并以增量形式返回模型输出。
    """
    suffix = os.path.splitext(file.filename or "")[1].lower()
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    temp_path = temp_file.name

    try:
        with temp_file:
            temp_file.write(await file.read())

        yield {"type": "status", "message": "正在解析文档..."}
        md_content = docx_to_markdown(temp_path)
        fields = parse_markdown_to_fields(md_content)
        prompt = generate_prompt(fields, md_content)

        yield {"type": "status", "message": "正在生成文案..."}
        full_response = []
        async for chunk in stream_llm(prompt):
            full_response.append(chunk)
            yield {"type": "delta", "content": chunk}

        result = parse_llm_response("".join(full_response))
        yield {
            "type": "done",
            "data": result,
            "message": "文案生成成功",
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def encode_stream_event(event: dict) -> bytes:
    return (json.dumps(event, ensure_ascii=False) + "\n").encode("utf-8")

@router.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    上传 Word 文档并生成文案
    
    Args:
        file: Word 文档文件 (.docx)
        
    Returns:
        生成的人设文案和业务文案
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="请选择文件")
    
    ext = file.filename.split('.')[-1].lower()
    if ext != 'docx':
        raise HTTPException(status_code=400, detail="仅支持 .docx 格式")
    
    try:
        result = await process_document(file)
        return {
            "status": "success",
            "data": result,
            "message": "文案生成成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理失败: {str(e)}")


@router.post("/api/upload/stream")
async def upload_file_stream(file: UploadFile = File(...)):
    """
    上传 Word 文档并流式生成文案。
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="请选择文件")

    ext = file.filename.split('.')[-1].lower()
    if ext != 'docx':
        raise HTTPException(status_code=400, detail="仅支持 .docx 格式")

    async def event_stream() -> AsyncIterator[bytes]:
        try:
            async for event in stream_document(file):
                yield encode_stream_event(event)
        except Exception as e:
            yield encode_stream_event({
                "type": "error",
                "message": f"处理失败: {str(e)}",
            })

    return StreamingResponse(
        event_stream(),
        media_type="application/x-ndjson; charset=utf-8",
        headers={"Cache-Control": "no-cache"},
    )

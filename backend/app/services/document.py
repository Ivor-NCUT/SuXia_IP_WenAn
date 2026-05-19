import re
from typing import Dict
from fastapi import HTTPException

DOCX_STYLE_MAP = """
p[style-name='Heading 1'] => h1:fresh
p[style-name='Heading 2'] => h2:fresh
p[style-name='Heading 3'] => h3:fresh
"""

FIELD_MAPPING = {
    "姓名": "name",
    "年龄": "age",
    "学历": "education",
    "头衔": "title",
    "职位": "position",
    "性格特质": "personality",
    "兴趣爱好": "interests",
    "穿衣风格与喜欢的品牌": "style",
    "荣誉资质": "honor",
    "记忆标签": "memoryTag",
    "主打产品": "product",
    "目标客户": "customers",
    "差异化优势": "advantage",
    "使命/愿景": "mission",
    "核心技能": "skill",
    "覆盖城市": "cities",
    "客单区间": "price",
    "最骄傲的事": "proud",
    "最痛的经历": "hurt",
    "家庭影响": "familyInfluence",
    "事业塑造": "careerInfluence",
    "个人/企业经历": "experience",
    "企业在行业中的优势与差异化": "advantage",
    "公司主打产品": "product",
    "核心客单价区间": "price",
    "分布主要城市": "cities",
    "用户画像": "customers",
    "月营业额多少": "monthlyRevenue",
    "老客户的复购比率是多少": "repurchaseRate",
    "对标的相似品牌": "brandBenchmarks",
    "对标同行业帐号": "industryBenchmarks",
    "个人喜欢的帐号": "favoriteAccounts",
}

FIELD_ALIASES = {
    "性格": "personality",
    "荣誉": "honor",
    "最擅长专业技能（个人)": "skill",
    "最擅长专业技能（个人）": "skill",
}

def docx_to_markdown(file_path: str) -> str:
    """
    将 DOCX 文件转换为 Markdown 文本，供 LLM 理解和抽取。

    转换链路：
    1. mammoth 将 docx 转成语义化 HTML，保留标题、列表、表格等结构。
    2. html2text 将语义化 HTML 转成 Markdown，减少直接把 HTML 交给后续解析的噪音。
    """
    try:
        import html2text
        import mammoth
    except ImportError as exc:
        raise HTTPException(
            status_code=500,
            detail="未安装文档转换依赖，请安装 mammoth 和 html2text"
        ) from exc

    try:
        with open(file_path, "rb") as docx_file:
            result = mammoth.convert_to_html(
                docx_file,
                style_map=DOCX_STYLE_MAP,
            )

        converter = html2text.HTML2Text()
        converter.body_width = 0
        converter.ignore_links = False
        converter.ignore_images = True
        converter.protect_links = True
        converter.unicode_snob = True

        markdown = converter.handle(result.value)
        return markdown.strip()
    except Exception:
        return _docx_to_markdown_with_python_docx(file_path)

def _docx_to_markdown_with_python_docx(file_path: str) -> str:
    """
    mammoth 处理异常文档失败时的兜底转换。

    兜底方案不追求精确版式，只保留段落、标题和表格文本，避免上传流程被少数 Word
    结构异常阻断。
    """
    try:
        from docx import Document
    except ImportError as exc:
        raise HTTPException(
            status_code=500,
            detail="文档转换失败，且未安装兜底依赖 python-docx"
        ) from exc

    try:
        document = Document(file_path)
        parts = []

        for block in _iter_docx_blocks(document):
            if hasattr(block, "rows"):
                parts.append(_table_to_markdown(block))
            else:
                text = block.text.strip()
                if not text:
                    continue

                style_name = getattr(block.style, "name", "")
                if style_name.startswith("Heading"):
                    level_text = style_name.replace("Heading", "").strip()
                    level = int(level_text) if level_text.isdigit() else 2
                    parts.append(f"{'#' * min(level, 6)} {text}")
                else:
                    parts.append(text)

        return "\n\n".join(part for part in parts if part).strip()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"文档转换失败: {str(exc)}") from exc

def _iter_docx_blocks(document):
    from docx.table import Table
    from docx.text.paragraph import Paragraph
    from docx.oxml.table import CT_Tbl
    from docx.oxml.text.paragraph import CT_P

    for child in document.element.body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, document)
        elif isinstance(child, CT_Tbl):
            yield Table(child, document)

def _table_to_markdown(table) -> str:
    rows = []
    for row in table.rows:
        cells = [" ".join(cell.text.split()) for cell in row.cells]
        rows.append(cells)

    if not rows:
        return ""

    max_columns = max(len(row) for row in rows)
    normalized_rows = [
        row + [""] * (max_columns - len(row))
        for row in rows
    ]
    header = normalized_rows[0]
    separator = ["---"] * max_columns
    body = normalized_rows[1:]

    markdown_rows = [
        "| " + " | ".join(header) + " |",
        "| " + " | ".join(separator) + " |",
    ]
    markdown_rows.extend(
        "| " + " | ".join(row) + " |"
        for row in body
    )

    return "\n".join(markdown_rows)

def _clean_field_value(value: str) -> str:
    value = _strip_markdown_inline(value)
    value = re.sub(r"^例[：:]?\s*[\(（][^\)）]*[\)）][：:]?\s*", "", value)
    value = re.sub(r"^例[：:]?\s*", "", value)
    return value.strip()

def _parse_markdown_table_row(line: str) -> Dict[str, str]:
    stripped = line.strip()
    if not stripped.startswith("|") or not stripped.endswith("|"):
        return {}

    cells = [cell.strip() for cell in stripped.strip("|").split("|")]
    if not cells or all(re.fullmatch(r"[-:\s]+", cell) for cell in cells):
        return {}

    fields = {}
    for index, cell in enumerate(cells):
        label = _strip_markdown_inline(cell).rstrip("：:")
        key = FIELD_MAPPING.get(label) or FIELD_ALIASES.get(label)
        if key:
            value = cells[index + 1].strip() if index + 1 < len(cells) else ""
            if value and not re.fullmatch(r"[-:\s]+", value):
                cleaned_value = _clean_field_value(value)
                if cleaned_value:
                    fields[key] = cleaned_value

    return fields

def _strip_markdown_inline(text: str) -> str:
    return re.sub(r"^[*_`~\s]+|[*_`~\s]+$", "", text).strip()

def parse_markdown_to_fields(md_content: str) -> Dict[str, str]:
    """
    从 Markdown 内容中提取表单字段
    
    Args:
        md_content: Markdown 格式的文档内容
        
    Returns:
        字段键值对字典
    """
    fields: Dict[str, str] = {}
    lines = md_content.split('\n')
    
    current_field = None
    current_value = []
    
    for line in lines:
        line = line.strip()
        normalized_line = _strip_markdown_inline(line)

        table_fields = _parse_markdown_table_row(line)
        if table_fields:
            if current_field and current_value:
                fields[current_field] = '\n'.join(current_value).strip()
                current_field = None
                current_value = []
            fields.update(table_fields)
            continue
        
        if not line:
            if current_field and current_value:
                fields[current_field] = '\n'.join(current_value).strip()
            current_field = None
            current_value = []
            continue
        
        matched = False
        for label, key in {**FIELD_MAPPING, **FIELD_ALIASES}.items():
            pattern = rf'^\s*(?:[-*•●]?\s*)?(?:\(?\d+\)?[.、]?\s*)?(?:{re.escape(label)}[：:]|{re.escape(label)})\s*(.+)?$'
            match = re.match(pattern, normalized_line)
            if match:
                if current_field and current_value:
                    fields[current_field] = '\n'.join(current_value).strip()
                
                current_field = key
                current_value = []
                
                if match.group(1):
                    cleaned_value = _clean_field_value(match.group(1))
                    if cleaned_value:
                        current_value.append(cleaned_value)
                matched = True
                break
        
        if not matched and current_field:
            current_value.append(line)
    
    if current_field and current_value:
        fields[current_field] = '\n'.join(current_value).strip()
    
    return fields

def generate_prompt(fields: Dict[str, str], source_markdown: str = "") -> str:
    """
    根据字段生成 LLM 提示词
    
    Args:
        fields: 字段键值对字典
        source_markdown: 从 Word 文档转换得到的 Markdown 原文
        
    Returns:
        完整的提示词字符串
    """
    ordered_fields = [
        ("姓名", "name"),
        ("年龄", "age"),
        ("学历", "education"),
        ("头衔", "title"),
        ("职位", "position"),
        ("性格特质", "personality"),
        ("兴趣爱好", "interests"),
        ("荣誉资质", "honor"),
        ("核心技能", "skill"),
        ("个人/企业经历", "experience"),
        ("主打产品", "product"),
        ("目标客户", "customers"),
        ("差异化优势", "advantage"),
        ("使命/愿景", "mission"),
        ("覆盖城市", "cities"),
        ("客单区间", "price"),
        ("月营业额", "monthlyRevenue"),
        ("老客户复购", "repurchaseRate"),
        ("最骄傲的事", "proud"),
        ("最痛的经历", "hurt"),
        ("家庭影响", "familyInfluence"),
        ("事业塑造", "careerInfluence"),
        ("对标品牌", "brandBenchmarks"),
        ("同行账号", "industryBenchmarks"),
        ("喜欢账号", "favoriteAccounts"),
    ]

    user_info = "\n".join(
        f"- {label}：{value}"
        for label, key in ordered_fields
        if (value := fields.get(key, "").strip())
    ) or "未抽取到结构化字段，请以原始 Markdown 为准。"

    prompt = f"""你是大鱼文化的资深短视频 IP 文案总监，擅长把客户填写的《IP 塑造自审表》改写成可直接口播的一条人设文案和一条业务文案。

你要先理解客户真实经历、业务事实、价值观和目标客户，再写成自然、有张力、有信任感的中文口播稿。不要写成简历、广告页、提纲、公众号文章或 AI 总结。

【已抽取的关键信息】
{user_info}

【客户上传 Word 转换后的 Markdown 原文】
{source_markdown}

【输出格式】
必须只输出以下两个一级标题，标题文字必须完全一致：

【人设文案】
这里写一条完整口播稿

【业务文案】
这里写一条完整口播稿

【人设文案写法】
1. 开头用一句强钩子，格式接近：从 A 到 B / 曾经 A 后来 B / 花了 N 年从 A 走到 B。
2. 主线必须是人物故事，不是能力清单。优先使用客户原文里的时间、地点、职业转折、低谷、高光、家庭影响、关键选择和可量化成果。
3. 结构参考：钩子和结果 → 自我介绍 → 早期背景 → 关键低谷或转折 → 选择与行动 → 代表性成绩 → 价值观沉淀 → 现在的身份与关注引导。
4. 语气要像真人面对镜头说话，允许有短句、停顿和情绪，但不要夸张煽情。
5. 不要虚构客户没有提供的地点、数字、奖项、公司名、客户案例；信息不足时用更稳妥的概括。
6. 长度控制在 900 到 1400 个中文字符左右。

【业务文案写法】
1. 开头要像创始人解释业务：很多人看了我很久，可能还不知道我到底做什么，今天我系统讲清楚。
2. 先讲合作原则或价值观，再讲业务板块、适合谁、解决什么问题、为什么是我、产品/服务路径、如何链接。
3. 必须把客户的主打产品、目标客户、差异化优势、客单价/城市/成果等事实自然放进去。
4. 语气参考创始人口播，不要写成官网服务介绍，不要堆 bullet，不要说“我们致力于”这类空话。
5. 业务可以分层讲，但要用自然口语串起来，比如“第一类人”“第二个业务”“最后一种合作方式”。
6. 长度控制在 1000 到 1600 个中文字符左右。

【硬性要求】
- 只写成稿，不解释你的思路。
- 两条文案都必须是连续自然段，不要使用 Markdown 列表。
- 不要使用“根据您提供的信息”“以下是”等 AI 口吻。
- 不要编造事实；如果原文有矛盾，以更保守、更可信的表达为准。
- 保留客户行业的专业感，但必须让普通短视频观众听得懂。
"""
    
    return prompt

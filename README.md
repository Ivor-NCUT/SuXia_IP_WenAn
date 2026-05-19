# 【大鱼】IP 塑造自审表

轻量 Vite + React 单页应用。

## 后端运行

后端默认运行在 `http://127.0.0.1:8000`，本地前端会把 `/api` 请求代理到这个地址。

```bash
cd backend
python3 -m venv ../.venv
../.venv/bin/pip install -r requirements.txt
../.venv/bin/uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

需要在 `.env` 中配置：

```bash
DASHSCOPE_API_KEY=你的百炼 API Key
```

## 前端运行

```bash
npm install
npm run dev
```

本地地址默认是 `http://127.0.0.1:5173/` 或 Vite 输出的地址。

## 构建

```bash
npm run build
```

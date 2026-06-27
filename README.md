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
TOKENDANCE_API_KEY=你的词元跳动 API Key
TOKENDANCE_MODEL=kimi-k2.6
TOKENDANCE_PROVIDER=infini-ai
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

## 部署

本项目不再使用 InsForge 部署。线上发布请走飞书妙搭。

当前妙搭应用：

- App ID：`app_17900rf48z6`
- 线上地址：https://twoj0037lkv.aiforce.cloud/app/app_17900rf48z6

妙搭运行环境需要配置：

```bash
TOKENDANCE_API_KEY=词元跳动 API Key
TOKENDANCE_MODEL=kimi-k2.6
TOKENDANCE_PROVIDER=infini-ai
```

本地开发仍然使用 Vite 代理，前端请求 `/api` 会转发到 `http://127.0.0.1:8000`。

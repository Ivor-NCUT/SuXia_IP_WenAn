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

## GitHub 推送后自动部署

仓库已配置 GitHub Actions：推送到 `main` 后会先部署 `backend/` 到 InsForge compute，再把返回的后端地址注入前端构建并部署到 InsForge frontend hosting。

需要在 GitHub 仓库中配置这些 Secrets：

```bash
INSFORGE_ACCESS_TOKEN=InsForge CLI 访问令牌
INSFORGE_PROJECT_ID=888fdeeb-8165-4701-894d-1d9e8959187a
TOKENDANCE_API_KEY=词元跳动 API Key
```

可选配置：

```bash
TOKENDANCE_MODEL=kimi-k2.6
TOKENDANCE_PROVIDER=infini-ai
```

本地开发仍然使用 Vite 代理，前端请求 `/api` 会转发到 `http://127.0.0.1:8000`。线上部署时，`VITE_API_BASE_URL` 会由 GitHub Actions 自动设置为 InsForge compute 返回的后端地址。

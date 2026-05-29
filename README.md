# DaKeBox - 极简开发者小工具箱

DaKeBox 是一个现代、高性能、采用暗黑主题风格的开发者小工具箱网站，灵感来源于 [tool.lu](https://tool.lu/)。它致力于为您日常的本地开发和调试提供丰富、便捷的实用小工具，支持快速格式化、转换、加密和模式测试等多种功能。

项目采用轻量化的 **Python-only** 单语言架构，完全移除了重型的 Node.js / npm 构建步骤，前端静态资源直接由 FastAPI 托管，数据持久化依托轻量的 **SQLite3** 文件数据库，实现了开箱即用、一键拉起的高效开发体验。

---

## ✨ 核心功能

1. **JSON 格式化与校验**
   - 快速对原始 JSON 数据结构进行格式化、美化或压缩，支持智能语法检查与校验。
2. **密码哈希与 Base64 编码/解码**
   - 安全地计算 MD5、SHA-256 哈希摘要，或对字符串进行 Base64 双向编码与解码。
3. **UNIX 时间戳转换**
   - 显示实时系统 Epoch 时间戳，支持时间戳（秒/毫秒）与 UTC 日期时间字符串的双向互转。
4. **正则表达式测试与分组解析**
   - 实时匹配测试，可视化高亮展示匹配细节，并智能提取解析子表达式捕获分组。
5. **🛠️ 实用工具运行流水账 (SQLite3 存储)**
   - 主界面下方集成实时数据库流水账展示，记录工具最近的运行记录，提供真实的数据库 CRUD 开发上下文。

---

## 🛠️ 项目目录结构

```text
/Users/idark/project/c/
├── README.md                    # 项目说明书
├── dakebox.db                   # SQLite3 本地数据库文件 (自动生成)
├── main.py                      # 统一的 Python FastAPI 服务入口 (包含路由、数据库连接与静态文件挂载)
├── pyproject.toml               # uv 现代 Python 项目包声明与依赖配置
├── requirements.txt             # 导出的依赖声明文件
├── dev.sh                       # 极简一键启动脚本
└── static/                      # 前端静态资源 (FastAPI 托管目录)
    ├── index.html               # 科技感暗黑毛玻璃主页 (Outfit / Share Tech Mono 字体)
    ├── index.css                # 赛博朋克风样式表，霓虹呼吸彩条，数据库日志行样式
    └── index.js                 # 响应式 Vanilla JS 引擎，处理 API 请求、正则高亮与数字时钟
```

---

## 🚀 本地开发快速上手

项目使用 **uv** 进行极速依赖同步与服务拉起，无需配置任何 Node/npm 环境。

### 前置准备

请确保您的系统中已安装：
- **Python 3.10+**
- **uv** (极速 Python 包管理器)

### 启动服务

1. **为启动脚本赋予执行权限**：
   ```bash
   chmod +x dev.sh
   ```

2. **一键拉起后端、数据库与静态网页**：
   ```bash
   ./dev.sh
   ```
   或者直接使用 `uv` 运行：
   ```bash
   uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **访问服务**：
   - 网页控制台：`http://localhost:8000`
   - 交互式 API 接口文档：`http://localhost:8000/docs`

按下 `Ctrl+C` 即可安全退出，`uvicorn` 会自动释放系统端口。

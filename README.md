# AI Genomics Assistant

一个基于AI的基因组学分析助手，集成JBrowse 2基因组浏览器，提供智能化的基因组数据分析和可视化功能。

## 项目架构

这是一个现代化的全栈基因组学分析平台，采用清晰的分层架构设计：

### 架构特点

- **前后端分离**: 前端React应用与后端FastAPI服务独立部署
- **模块化设计**: 共享模块提供类型定义和工具函数
- **容器化部署**: 支持Docker容器化部署和编排
- **开发友好**: 完整的开发工具链和自动化脚本

### 核心组件

### 前端应用 (frontend/)

- React + TypeScript + Vite
- 集成JBrowse 2基因组浏览器
- 响应式UI设计
- 现代化的用户界面

### 后端应用 (backend/)

- **FastAPI**: 现代、高性能的 Python Web 框架
- **AI 分析**: 集成 AI/ML 模型进行基因组数据分析
- **数据管理**: 支持多种基因组文件格式 (VCF, BAM, FASTA 等)
- **知识库**: 基因组学知识检索和管理
- **会话管理**: 分析会话的创建和管理
- **自动文档**: OpenAPI/Swagger 自动生成 API 文档

### 共享模块 (shared/)

- **types**: TypeScript类型定义
- **utils**: 共享工具函数
- **components**: 可复用组件

### 容器化部署 (docker/)

- Docker配置文件
- 开发和生产环境配置
- 服务编排配置

## 快速开始

### 环境要求

- **WSL2** (推荐) 或 Linux 环境
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose

### WSL2 环境设置

如果使用 Windows，建议在 WSL2 中运行：

```bash
# 1. 安装 WSL2 (如果还没有)
wsl --install

# 2. 在 WSL2 中安装 Docker
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
# 重新登录 WSL

# 3. 启动 Docker 服务
sudo service docker start
```

### 一键设置开发环境

```bash
# 运行自动设置脚本
make setup
# 或者
./scripts/setup-dev.sh
```

### 手动设置

```bash
# 1. 安装依赖
npm install

# 2. 构建共享包
npm run build

# 3. 复制环境变量配置
cp .env.example .env

# 4. 启动开发环境
make dev
```

### 常用命令

```bash
# 开发相关
make dev              # 启动开发服务器
make dev-frontend     # 仅启动前端
make dev-backend      # 仅启动后端网关
make build            # 构建所有包
make lint             # 代码检查
make clean            # 清理构建产物

# 数据库相关
make db-up            # 启动开发数据库
make db-down          # 停止开发数据库

# Docker 相关
make docker-build     # 构建 Docker 镜像
make docker-up        # 启动完整 Docker 环境
make docker-down      # 停止 Docker 环境
make docker-logs      # 查看 Docker 日志

# 工具命令
make help             # 显示所有可用命令
make audit            # 安全审计
make check-deps       # 检查过期依赖
```

### 构建项目

```bash
npm run build
```

### Docker部署

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up -d

# 生产环境
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 开发工具

### 代码质量

- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型检查

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix
```

### 项目结构

```
ai-genomics-assistant/
├── frontend/             # React前端应用
│   ├── src/             # 源代码
│   ├── public/          # 静态资源
│   └── package.json     # 前端依赖
├── backend/             # FastAPI后端应用
│   ├── app/             # 应用代码
│   ├── requirements.txt # Python依赖
│   └── Dockerfile       # 后端容器配置
├── shared/              # 共享模块
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   └── components/      # 共享组件
├── docker/              # Docker配置
│   ├── docker-compose.yml     # 生产环境配置
│   └── docker-compose.dev.yml # 开发环境配置
├── docs/                # 项目文档
├── scripts/             # 构建和部署脚本
├── .kiro/               # Kiro AI助手配置
└── package.json         # 根package.json
```

## 环境变量

复制 `.env.example` 到 `.env` 并配置相应的环境变量：

```bash
cp .env.example .env
```

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

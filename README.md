# AI Genomics Assistant

一个基于 AI 的基因组学分析助手，集成 JBrowse 2 基因组浏览器，提供智能化的基因组数据分析和可视化功能。

## 项目状态

**当前版本**: v1.0.0-beta  
**开发状态**: 🟢 核心功能已完成，架构优化完毕  
**最后更新**: 2025-10-16

## 核心特性

### 🤖 **智能 AI 对话系统**

- **实时通信**: 基于 WebSocket 的低延迟双向通信
- **专业知识**: 内置基因组学专业知识库
- **多模型支持**: 兼容 OpenAI API 标准的所有模型
- **上下文管理**: 智能的对话历史管理和状态同步
- **思考动画**: 优雅的 AI 思考过程可视化

### 🧬 **基因组浏览器集成**

- **JBrowse 2**: 业界领先的基因组可视化工具
- **多数据格式**: 支持 GFF、BAM、VCF 等标准格式
- **交互式操作**: 缩放、导航、轨道管理
- **数据同步**: AI 分析结果与可视化实时同步

### 🖥️ **用户界面设计**

- **分屏布局**: 可拖拽调整的响应式界面
- **专业风格**: 无 emoji 的严肃科学界面
- **组件化**: 模块化的 UI 组件，易于扩展
- **主题一致**: 统一的设计语言和交互规范

### ⚙️ **配置与管理**

- **模型配置**: 灵活的 AI 模型参数设置
- **连接测试**: 自动化的 API 连接验证
- **环境切换**: 测试模式与生产模式无缝切换
- **状态持久化**: 用户配置和会话状态保存

### 🔧 **开发者友好**

- **TypeScript**: 完整的类型安全保障
- **模块化**: 清晰的代码组织和依赖管理
- **测试支持**: 完善的测试框架和工具
- **文档完整**: 详细的 API 文档和使用指南

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- Python >= 3.9
- Conda (推荐)

### 启动应用

#### 1. 启动后端服务

```bash
# 激活conda环境
conda activate gene

# 启动后端
cd backend
python start_dev.py
```

#### 2. 启动前端应用

```bash
# 启动前端
cd frontend
npm install  # 首次运行
npm run dev
```

### 访问应用

- **前端界面**: http://localhost:5173
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs

## 使用指南

### 测试模式

- 前端默认使用 `test-key` 进行快速测试
- 提供即时响应（~100ms）
- 包含基因组学专业知识

### 真实 AI 模式

1. 点击左上角"模型设置"
2. 配置真实的 API Key 和模型
3. 享受完整的 AI 对话体验

### WebSocket 测试

```bash
cd backend
python test_websocket.py
```

## 项目架构

### 整体架构设计

本项目采用现代化的前后端分离架构，结合 AI 服务和基因组浏览器，提供完整的基因组学分析解决方案。

```
ai-genomics-assistant/
├── frontend/                          # 前端应用 (React + TypeScript)
│   ├── src/
│   │   ├── components/                # 组件库
│   │   │   ├── SplitLayout/          # 分屏布局组件
│   │   │   │   ├── SplitLayout.tsx   # 可拖拽分屏实现
│   │   │   │   ├── SplitLayout.css   # 布局样式
│   │   │   │   └── index.ts          # 组件导出
│   │   │   ├── ChatInterface/        # AI 对话主界面
│   │   │   │   ├── ChatInterface.tsx # 对话状态管理
│   │   │   │   ├── ChatInterface.css # 界面样式
│   │   │   │   └── index.ts
│   │   │   ├── ModelConfiguration/   # AI 模型配置
│   │   │   │   ├── ModelConfiguration.tsx # 配置面板
│   │   │   │   ├── ModelConfiguration.css # 配置样式
│   │   │   │   └── index.ts
│   │   │   ├── ChatHistory/          # 聊天历史显示
│   │   │   │   ├── ChatHistory.tsx   # 消息列表管理
│   │   │   │   ├── ChatHistory.css   # 历史样式
│   │   │   │   └── index.ts
│   │   │   ├── MessageBubble/        # 消息气泡组件
│   │   │   │   ├── MessageBubble.tsx # 消息渲染逻辑
│   │   │   │   ├── MessageBubble.css # 气泡样式
│   │   │   │   └── index.ts
│   │   │   ├── ThinkingIndicator/    # AI 思考动画
│   │   │   │   ├── ThinkingIndicator.tsx # 动画组件
│   │   │   │   ├── ThinkingIndicator.css # 动画样式
│   │   │   │   └── index.ts
│   │   │   ├── UserInput/            # 用户输入组件
│   │   │   │   ├── UserInput.tsx     # 输入框逻辑
│   │   │   │   ├── UserInput.css     # 输入样式
│   │   │   │   └── index.ts
│   │   │   └── index.ts              # 统一组件导出
│   │   ├── services/                 # 服务层
│   │   │   └── websocket.ts          # WebSocket 通信服务
│   │   ├── App.tsx                   # 主应用组件
│   │   ├── main.tsx                  # 应用入口
│   │   ├── config.ts                 # JBrowse 配置
│   │   ├── index.css                 # 全局样式
│   │   └── vite-env.d.ts            # TypeScript 类型定义
│   ├── package.json                  # 前端依赖配置
│   ├── vite.config.ts               # Vite 构建配置
│   ├── tsconfig.json                # TypeScript 配置
│   └── eslint.config.js             # ESLint 代码规范
├── backend/                          # 后端服务 (FastAPI + Python)
│   ├── app/
│   │   ├── api/                     # API 路由层
│   │   │   └── routes.py            # RESTful API 端点
│   │   ├── core/                    # 核心配置
│   │   │   └── config.py            # 应用配置管理
│   │   ├── services/                # 业务服务层
│   │   │   ├── ai_service.py        # AI 服务集成
│   │   │   └── websocket_manager.py # WebSocket 连接管理
│   │   ├── tools/                   # 工具包
│   │   │   └── jbrowse_tools.py     # JBrowse 控制工具
│   │   └── main.py                  # FastAPI 应用入口
│   ├── requirements.txt             # Python 依赖
│   ├── start_dev.py                 # 开发服务器启动脚本
│   ├── test_websocket.py           # WebSocket 测试脚本
│   └── .env                        # 环境变量配置
├── .kiro/                           # Kiro AI 助手配置
│   └── specs/                      # 项目规范文档
│       └── ai-genomics-assistant/  # 项目规范
│           ├── requirements.md     # 需求文档
│           ├── design.md          # 设计文档
│           ├── tasks.md           # 任务管理
│           └── todo.md            # 开发任务
├── .vscode/                        # VS Code 配置
│   └── settings.json              # 编辑器设置
├── package.json                    # 项目根配置
├── .gitignore                      # Git 忽略规则
├── PROJECT_STATUS.md               # 详细项目状态
└── README.md                       # 项目说明文档
```

### 架构特点

#### 🏗️ **前端架构 (React + TypeScript)**

- **组件化设计**: 每个功能模块独立封装，便于维护和复用
- **TypeScript 严格模式**: 完整的类型安全，减少运行时错误
- **模块化样式**: 每个组件独立的 CSS 文件，避免样式冲突
- **服务层分离**: WebSocket 通信逻辑独立封装
- **状态管理优化**: 应用配置与聊天状态完全分离

#### ⚡ **后端架构 (FastAPI + Python)**

- **分层架构**: API 层、服务层、工具层清晰分离
- **异步处理**: 基于 FastAPI 的高性能异步框架
- **WebSocket 支持**: 实时双向通信，支持并发连接
- **AI 服务集成**: LangChain 框架，支持多种 AI 模型
- **工具扩展**: 模块化的基因组学工具包

#### 🔄 **通信架构**

- **WebSocket 实时通信**: 低延迟的双向数据传输
- **消息格式标准化**: JSON 格式的结构化消息协议
- **状态同步**: 前后端状态实时同步
- **错误处理**: 完善的异常处理和重连机制

#### 🧬 **基因组学集成**

- **JBrowse 2 集成**: 专业的基因组浏览器
- **分屏界面**: AI 对话与基因组可视化并行显示
- **工具链支持**: 基因组数据处理和分析工具

## 技术栈

### 前端技术栈

| 技术           | 版本   | 用途                       |
| -------------- | ------ | -------------------------- |
| **React**      | 19.x   | 现代化前端框架，组件化开发 |
| **TypeScript** | 5.x    | 静态类型检查，提高代码质量 |
| **Vite**       | 6.x    | 快速构建工具，热更新开发   |
| **JBrowse 2**  | Latest | 专业基因组浏览器集成       |
| **WebSocket**  | Native | 实时双向通信               |
| **ESLint**     | 9.x    | 代码质量检查               |
| **Prettier**   | 3.x    | 代码格式化                 |

### 后端技术栈

| 技术           | 版本         | 用途                   |
| -------------- | ------------ | ---------------------- |
| **FastAPI**    | 0.104+       | 高性能 Python Web 框架 |
| **LangChain**  | 0.1+         | AI 应用开发框架        |
| **WebSocket**  | FastAPI 内置 | 实时通信支持           |
| **OpenAI API** | Compatible   | AI 模型接口标准        |
| **Uvicorn**    | 0.24+        | ASGI 服务器            |
| **Pydantic**   | 2.x          | 数据验证和序列化       |

### 开发工具

| 工具        | 用途              |
| ----------- | ----------------- |
| **Conda**   | Python 环境管理   |
| **Node.js** | JavaScript 运行时 |
| **Git**     | 版本控制          |
| **VS Code** | 开发环境          |
| **Kiro AI** | AI 辅助开发       |

## 文档

- [详细项目状态](./PROJECT_STATUS.md) - 完整的功能清单和技术细节
- [设计规范](./.kiro/specs/ai-genomics-assistant/design-requirements.md) - UI/UX 设计标准
- [任务管理](./.kiro/specs/ai-genomics-assistant/tasks.md) - 开发任务和进度

## 开发状态

### ✅ **已完成功能**

#### 核心架构 (100%)

- ✅ 前后端分离架构设计
- ✅ TypeScript 严格模式配置
- ✅ 组件化开发框架
- ✅ 模块化样式管理
- ✅ 状态管理优化（配置与聊天状态分离）

#### 用户界面 (100%)

- ✅ 分屏布局组件（可拖拽调整）
- ✅ AI 对话界面（消息气泡、输入框）
- ✅ 模型配置面板（API 设置、连接测试）
- ✅ 思考动画组件（优雅的加载指示器）
- ✅ 响应式设计适配

#### 通信系统 (100%)

- ✅ WebSocket 实时通信
- ✅ 消息格式标准化
- ✅ 连接状态管理
- ✅ 自动重连机制
- ✅ 错误处理和用户反馈

#### AI 服务集成 (100%)

- ✅ LangChain 框架集成
- ✅ OpenAI 兼容接口支持
- ✅ 测试模式快速响应
- ✅ 多模型配置支持
- ✅ 上下文管理优化

#### 基因组浏览器 (90%)

- ✅ JBrowse 2 界面集成
- ✅ 基础可视化功能
- ✅ 配置文件管理
- 🔄 AI 控制工具开发中

### 🚧 **开发中功能**

#### 智能分析工具 (30%)

- 🔄 基因信息查询 API
- 🔄 JBrowse 控制工具集
- 🔄 基因组数据分析功能
- 📋 变异注释和解释

#### 高级功能 (10%)

- 📋 用户会话管理
- 📋 数据上传和处理
- 📋 批量分析功能
- 📋 结果导出和分享

### 📋 **计划功能**

#### 系统优化

- 性能监控和优化
- 缓存机制实现
- 并发处理优化
- 安全性增强

#### 功能扩展

- 更多基因组学工具
- 自定义分析流程
- 团队协作功能
- 云端部署支持

**图例**: ✅ 已完成 | 🔄 开发中 | 📋 计划中

## 贡献

欢迎提交 Issue 和 Pull Request！请遵循项目的代码规范和设计原则。

## 许可证

MIT License

---

**快速体验**: 启动服务后访问 http://localhost:5173，使用默认的测试模式即可开始对话！

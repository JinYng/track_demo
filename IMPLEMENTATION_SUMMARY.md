# GenoVerse 实现方式总结

## 🏗️ 整体架构

### 分层结构
```
┌─────────────────────────────────────────────────────┐
│                    App.tsx                          │
│         (Router + ThemeProvider)                    │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   DashboardPage         WorkspacePage
   (会话管理)           (AI+浏览器工作区)
        │                     │
        │                     ▼
        │            SessionProvider
        │                     │
        │        ┌────────────┴────────────┐
        │        │                         │
        │        ▼                         ▼
        │    ChatInterface            GenomeBrowser
        │    (AI对话)               (基因组浏览器)
        │        │                         │
        │        ▼                         ▼
        │   SplitLayout (40:60 分屏)
        │
        └──────────────────────────────────────────
                   │
                   ▼
            ThemeContext
         (统一主题管理)
```

## 📑 核心实现

### 1. 路由系统 (App.tsx)
```tsx
- "/" → DashboardPage (会话管理和创建)
- "/workspace/:sessionId" → WorkspacePage (工作区)
```

**特点：**
- 使用 React Router 7.9.4 进行页面路由
- ThemeProvider 在全局包装，所有页面共享主题
- i18n 全局初始化（英文UI + 中文注释）

### 2. 主题系统 (ThemeContext)

#### 颜色方案
```tsx
lightTheme {
  background: '#FFFFFF'      // 纯白背景
  surface: '#F8F9FA'         // 浅灰表面
  primary: '#1A73E8'         // Google蓝主色
  text: '#202124'            // 深灰文本
  secondaryText: '#5F6368'   // 中灰辅助文本
  border: '#E0E0E0'          // 浅灰边框
  hover: '#E8F0FE'           // 蓝色悬停背景
}
```

#### 排版系统
```tsx
fontSizes {
  h1: '32px'    // 大标题
  h2: '24px'    // 副标题
  h3: '18px'    // 小标题
  body: '16px'  // 正文
  caption: '14px'  // 说明文本
}

spacing {
  xs: '8px'     // 极小
  sm: '16px'    // 小
  md: '24px'    // 中等（默认）
  lg: '32px'    // 大
  xl: '48px'    // 特大
  xxl: '64px'   // 超大
}
```

### 3. 会话管理系统 (SessionContext)

#### 会话配置结构
```tsx
interface SessionConfig {
  sessionId: string              // 会话唯一ID
  name: string                   // 会话名称
  organism: string               // 生物体（如 Human）
  referenceGenome: string        // 参考基因组（hg38/hg37/mm10）
  tracks: any[]                  // 选择的轨道列表
  currentLocation?: string       // 当前显示位置（chr:start-end）
}
```

#### 上下文提供方式
```tsx
<SessionProvider initialConfig={config}>
  <ChatInterface />
  <GenomeBrowser />
</SessionProvider>
```

**特点：**
- 使用 React Context API 管理会话状态
- 支持部分更新：`updateConfig({ currentLocation: 'chr1:1-1000' })`
- 所有订阅组件自动响应配置变化

### 4. 工作区页面 (WorkspacePage)

#### 布局组成
```
┌─ Header ─────────────────────────────────────────┐
│ GenoVerse > Session {id}  Save Export Settings   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─ Left Panel (40%) ────┐  ┌─ Right Panel (60%) ┐
│  │                        │  │                    │
│  │  ChatInterface         │  │ GenomeBrowser      │
│  │  - 模型配置             │  │ - 控制栏            │
│  │  - 消息历史             │  │ - 浏览器显示        │
│  │  - 输入框               │  │ - 位置展示          │
│  │                        │  │                    │
│  └────────────────────────┘  └────────────────────┘
│  <──────── SplitLayout ──────>
│                                                  │
└──────────────────────────────────────────────────┘
```

#### 数据流
```
1. 用户访问 /workspace/session123
2. WorkspacePage 从 URL 提取 sessionId
3. 从 sessionStorage 读取会话配置（如有）
4. SessionProvider 初始化上下文
5. ChatInterface 和 GenomeBrowser 订阅会话配置
6. 组件通过 useSession() 访问和更新配置
```

### 5. AI 对话系统 (ChatInterface)

#### 核心功能
```tsx
<ChatInterface viewState={null} />

包含：
- ModelConfiguration
  - API Base URL 配置
  - API Key 管理
  - 模型选择（Qwen3-VL-8B-Instruct）
  
- ChatHistory
  - 消息展示
  - 自动滚动到最新
  
- UserInput
  - 文本输入框
  - Shift+Enter 换行
  - Enter 发送
  
- MessageBubble
  - 用户消息气泡
  - AI响应气泡
  - 支持 Markdown
  
- ThinkingIndicator
  - 加载动画
  - "AI is thinking..."
```

#### WebSocket 集成
```tsx
const handleWebSocketMessage = useCallback((response: any) => {
  // 处理后端返回的 AI 响应
  setChatState(prev => ({
    messages: [...prev.messages, aiMessage]
  }))
})
```

### 6. 基因组浏览器系统 (GenomeBrowser)

#### 组件结构
```tsx
GenomeBrowser
├─ BrowserControls
│  ├─ Navigation: < > (左右导航)
│  ├─ Zoom: + - (放大缩小)
│  ├─ Location Display (位置展示)
│  └─ Tracks Button (轨道管理)
│
└─ Browser View Area
   └─ Placeholder (Phase 4 集成 JBrowse)
```

#### 控制栏功能（当前）
```tsx
handleNavigation('left') → 向左移动视图
handleNavigation('right') → 向右移动视图
handleZoom('in') → 放大
handleZoom('out') → 缩小
updateConfig({ currentLocation: 'chr1:1-1000000' }) → 更新位置
```

**注：** Phase 4 才会实现真正的 JBrowse 集成

### 7. 分屏布局 (SplitLayout)

#### 特性
```tsx
<SplitLayout 
  defaultSplitPercentage={40}    // 初始40:60分割
  leftPanel={<ChatInterface />}
  rightPanel={<GenomeBrowser />}
/>

特点：
- 可拖动分隔符调整比例
- 平滑的过渡动画
- 响应式设计
```

## 🔄 数据流示例

### 场景1：用户修改基因组位置

```
用户在 BrowserControls 输入新位置
        │
        ▼
handleLocationChange('chr1:1-1000000')
        │
        ▼
useSession().updateConfig({ currentLocation: ... })
        │
        ▼
SessionContext 更新内部状态
        │
        ▼
订阅该配置的所有组件自动重新渲染
        │
        ├─ GenomeBrowser 更新显示
        └─ ChatInterface 可读取当前位置用于 AI 分析
```

### 场景2：AI 响应用户查询

```
用户在 ChatInterface 输入查询
        │
        ▼
handleSendMessage()
        │
        ▼
发送到后端 WebSocket
        │
        ▼
后端 AI 服务处理
        │
        ▼
返回响应 → handleWebSocketMessage()
        │
        ▼
ChatHistory 显示新消息
        │
        ▼
AI 可能修改 sessionConfig (如改变位置)
        │
        ▼
GenomeBrowser 自动更新
```

## 📦 项目文件结构

```
frontend/src/
├─ App.tsx                          // 根组件，路由定义
├─ main.tsx                         // 应用入口
├─ theme.ts                         // 主题配置
├─ i18n.ts                          // 国际化配置
│
├─ contexts/
│  ├─ ThemeContext.tsx              // 主题上下文
│  └─ SessionContext.tsx            // 会话上下文 ✨ NEW
│
├─ components/
│  ├─ ChatInterface/                // AI 对话组件
│  ├─ GenomeBrowser/                // 基因组浏览器 ✨ NEW
│  │  ├─ GenomeBrowser.tsx
│  │  ├─ BrowserControls.tsx
│  │  └─ GenomeBrowser.css
│  ├─ SplitLayout/                  // 分屏布局
│  ├─ ChatHistory/                  // 消息历史
│  ├─ UserInput/                    // 输入框
│  ├─ MessageBubble/                // 消息气泡
│  ├─ ModelConfiguration/           // 模型配置
│  └─ ThinkingIndicator/            // 思考指示器
│
├─ pages/
│  ├─ DashboardPage.tsx             // 首页/会话管理
│  └─ WorkspacePage.tsx             // 工作区页面 ✨ REFACTORED
│
└─ services/
   └─ websocket.ts                  // WebSocket 通信
```

## ✨ Phase 1 核心贡献

### 新增
1. **SessionContext** - 会话状态管理
2. **GenomeBrowser** - 基因组浏览器容器
3. **BrowserControls** - 浏览器控制栏
4. **WorkspacePage 重构** - 集成 AI + 浏览器

### 改进
1. 分屏布局 - ChatInterface 和 GenomeBrowser 并排
2. 会话配置系统 - 全局状态共享
3. 主题一致性 - 所有组件使用统一主题

## 🚀 运行状态

```bash
npm run dev
# → http://localhost:5173/

导航流程：
1. 首页: http://localhost:5173/
   └─ DashboardPage (会话列表)

2. 创建新会话: 
   └─ /workspace/{sessionId}
      └─ WorkspacePage (AI + 浏览器)
         ├─ ChatInterface (左 40%)
         └─ GenomeBrowser (右 60%)
```

## 🔐 主要特性总结

| 特性 | 实现方式 | 状态 |
|------|--------|------|
| 主题管理 | ThemeContext | ✅ 完成 |
| 路由 | React Router | ✅ 完成 |
| 会话管理 | SessionContext | ✅ NEW |
| AI 对话 | WebSocket + ChatInterface | ✅ 完成 |
| 基因组浏览 | GenomeBrowser (占位符) | ✅ 框架完成 |
| 分屏布局 | SplitLayout | ✅ 完成 |
| 国际化 | i18n (en/zh) | ✅ 完成 |
| 类型安全 | TypeScript | ✅ 完成 |

## 📝 下一步（Phase 2+）

1. **Phase 2** - 配置持久化
   - DashboardPage 保存会话配置到 sessionStorage
   - SetupWizard 传递完整配置
   
2. **Phase 3** - 轨道管理
   - 实现 TrackSelectionForm
   - 支持添加/删除轨道
   
3. **Phase 4** - JBrowse 集成
   - 安装 @jbrowse/react-linear-genome-view
   - 替换占位符，显示真实基因组浏览器

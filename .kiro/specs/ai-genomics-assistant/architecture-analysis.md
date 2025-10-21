# GenoVerse 项目架构分析

## 当前架构概览

### 1. 应用层级结构

```
App.tsx (路由根组件)
├── ThemeProvider (主题上下文)
└── Router
    ├── DashboardPage (首页/会话管理)
    │   └── SetupWizard (创建新会话向导)
    └── WorkspacePage (工作区/分析页面)
        ├── AI Assistant Panel (左侧)
        └── JBrowse Browser (右侧 - 目前是模拟)
```

### 2. 现有组件清单

#### 页面组件 (Pages)
- **DashboardPage**: 首页，展示会话列表，启动新会话
- **WorkspacePage**: 工作区页面，包含AI助手和基因组浏览器

#### 布局组件 (Layout)
- **SplitLayout**: 可调整大小的左右分屏布局
  - 支持拖拽调整分割比例
  - 限制在10%-90%之间

#### 功能组件 (Features)
- **SetupWizard**: 三步向导，用于创建新会话
  - 步骤1: 基础设置 (名称、生物体、参考基因组)
  - 步骤2: 数据源配置 (待实现)
  - 步骤3: 分析选项 (待实现)

- **ChatInterface**: AI对话界面
  - WebSocket连接管理
  - 消息历史管理
  - 模型配置
  
- **ModelConfiguration**: 模型配置组件
- **ChatHistory**: 聊天历史显示
- **UserInput**: 用户输入框
- **MessageBubble**: 消息气泡
- **ThinkingIndicator**: AI思考指示器

#### 服务层 (Services)
- **websocket.ts**: WebSocket通信服务
- **config.ts**: JBrowse配置 (静态配置)

#### 上下文 (Contexts)
- **ThemeContext**: 主题管理 (支持亮色/暗色模式)

### 3. 数据流分析

#### 当前数据流
```
DashboardPage
  └─> SetupWizard (收集会话配置)
      └─> onComplete(sessionData) 
          └─> navigate(/workspace/:sessionId)
              └─> WorkspacePage (显示静态内容)
```

#### 问题点
1. **配置传递断层**: SetupWizard收集的配置没有真正传递到WorkspacePage
2. **JBrowse未集成**: WorkspacePage右侧是模拟内容，没有真正的JBrowse实例
3. **状态管理缺失**: 没有全局状态管理方案 (会话配置、轨道数据等)

### 4. JBrowse集成现状

#### 已有的JBrowse相关代码
- **App.tsx**: 有注释掉的JBrowse代码示例
- **config.ts**: 完整的JBrowse配置对象 (assemblies, tracks, defaultSession)
- **package.json**: 已安装 `@jbrowse/core` 和 `@jbrowse/react-app2`

#### 缺失的部分
1. WorkspacePage中没有实际渲染JBrowse组件
2. 没有动态配置JBrowse的机制
3. 没有AI与JBrowse的交互桥梁

---

## 需要解决的核心问题

### 问题1: 如何在不使用JBrowse UI的情况下使用其引擎？

**现状**: 
- JBrowse 2提供了`@jbrowse/react-app2`包，其中`JBrowseApp`是完整的UI
- 我们需要使用JBrowse的引擎（数据处理、渲染轨道），但要自定义UI

**可能的方案**:
1. **使用JBrowse React Linear Genome View**: 
   - 使用`@jbrowse/react-linear-genome-view`包
   - 这是一个无UI chrome的纯视图组件
   - 可以完全自定义外围UI

2. **使用ViewState API直接操作**:
   - 通过`createViewState`创建状态
   - 使用mobx观察和修改状态
   - 自定义渲染层

3. **封装并样式覆盖**:
   - 继续使用`JBrowseApp`但深度定制CSS
   - 隐藏不需要的UI元素
   - 可能维护成本高

**推荐方案**: 方案1 - 使用react-linear-genome-view

### 问题2: 如何管理会话配置和状态？

**需要管理的状态**:
```typescript
interface SessionState {
  // 基础信息
  sessionId: string
  name: string
  organism: string
  referenceGenome: string
  
  // JBrowse配置
  assembly: AssemblyConfig
  tracks: TrackConfig[]
  currentLocation: string
  
  // AI对话
  messages: Message[]
  
  // 视图状态
  viewState: JBrowseViewState
}
```

**可能的方案**:
1. **React Context**: 轻量级，适合中小型应用
2. **Zustand**: 现代化、简单、类型安全
3. **Redux**: 功能强大但较重
4. **URL + localStorage**: 简单但有限制

**推荐方案**: React Context + sessionStorage (符合当前架构)

### 问题3: 如何实现SetupWizard的轨道添加功能？

**tasks.md中的方案**: 复用JBrowse的AddTrackWidget

**挑战**:
- AddTrackWidget依赖JBrowse的session和view
- 需要在没有完整JBrowse实例的情况下使用
- 需要UI定制

**可能的方案**:
1. **直接使用JBrowse组件** (tasks.md方案):
   ```tsx
   // 创建临时的JBrowse实例用于配置
   // 提取配置后销毁
   ```
   - 优点: 功能完整、已测试
   - 缺点: 依赖重、难以定制

2. **手动实现表单**:
   ```tsx
   // 自己实现文件选择、URL输入等
   // 使用JBrowse的guessAdapter工具
   ```
   - 优点: 轻量、可控
   - 缺点: 需要重新实现逻辑

3. **混合方案**:
   ```tsx
   // 基础表单自己实现
   // 复杂的适配器检测使用JBrowse工具
   ```
   - 优点: 平衡
   - 缺点: 需要理解JBrowse内部

**推荐方案**: 方案2 - 手动实现 (更符合我们的架构理念)

---

## 重构建议架构

### 方案A: 最小改动方案 (保守) ⭐ 推荐

```
App.tsx
├── ThemeProvider
└── Router
    ├── DashboardPage
    │   └── SetupWizard (改进Step2/3，完整配置传递)
    │
    └── WorkspacePage (重构 - 使用现有组件库)
        ├── SessionProvider (新增)
        │   └── SessionContext
        │
        ├── 顶部导航栏 (保持不变)
        │
        └── SplitLayout
            ├── 左侧: ChatInterface ✅ (复用现有)
            │   ├── ModelConfiguration ✅
            │   ├── ChatHistory ✅
            │   └── UserInput ✅
            │
            └── 右侧: GenomeBrowser (新增)
                ├── BrowserControls (新增)
                └── JBrowseView (新增)
```

**核心优势**:
- ✅ 复用已完整实现的组件库 (ChatInterface、ModelConfiguration等)
- ✅ 改动范围最小 (只改WorkspacePage和添加3个新组件)
- ✅ 渐进式集成，每阶段都可验证
- ✅ 低风险，可随时回滚
- ✅ 充分利用现有投入

**缺点**:
- 可能需要多次迭代
- 某些设计可能不够优雅

### 方案B: 架构重构方案 (激进)

```
App.tsx
├── AppStateProvider (新增 - Zustand/Redux)
├── Router
    ├── DashboardPage
    │   └── SessionWizard (重写)
    │       └── WizardSteps (动态步骤)
    └── WorkspacePage (完全重构)
        ├── WorkspaceLayout (新增)
        │   ├── TopBar (新增)
        │   ├── SidePanel (可折叠)
        │   │   └── AIChatPanel
        │   ├── MainPanel
        │   │   ├── GenomeBrowser (新增)
        │   │   └── CustomControls (新增)
        │   └── BottomPanel (可选 - 数据表格等)
        └── AIJBrowseController (新增 - 核心逻辑)
```

**优点**:
- 架构清晰
- 扩展性好
- 符合最佳实践

**缺点**:
- 改动大
- 风险高
- 需要更多时间

---

## 推荐实施路径 (方案A 详细版)

**详见**: `refactor-plan.md` 中的详细实施方案

### 快速总结

**第一阶段: 基础架构 (1-2天)**
- 创建`SessionContext`管理会话配置
- 创建`GenomeBrowser`和`BrowserControls`组件
- 安装`@jbrowse/react-linear-genome-view`

**第二阶段: 页面重构 (1天)**
- 改进SetupWizard (Step2/3可选)
- 重构WorkspacePage使用SplitLayout
- 集成ChatInterface和GenomeBrowser

**第三阶段: 配置传递 (1天)**
- 修改DashboardPage保存配置到sessionStorage
- 修改WorkspacePage读取配置
- 验证配置传递流程

**第四阶段: JBrowse集成 (2-3天)**
- 在GenomeBrowser中真正集成JBrowse
- 实现JBrowse控制器
- 实现AI与JBrowse的交互

**总耗时**: 4-6天 (比方案B节省50%时间)

---

## 关键技术决策点

### 决策1: 使用哪个JBrowse包?

**选项**:
- `@jbrowse/react-app2`: 完整应用
- `@jbrowse/react-linear-genome-view`: 纯视图
- `@jbrowse/core`: 底层API

**建议**: `@jbrowse/react-linear-genome-view`
- 理由: 符合"用引擎不用UI"的需求

### 决策2: 状态管理方案?

**选项**:
- React Context
- Zustand
- Redux

**建议**: React Context (现阶段)
- 理由: 项目已在使用，简单够用
- 后续如果复杂度增加可迁移到Zustand

### 决策3: SetupWizard的实现方式?

**选项**:
- 复用JBrowse AddTrackWidget
- 自己实现表单

**建议**: 自己实现简单表单
- 理由: 更可控、更符合极简设计
- 可以使用JBrowse的工具函数辅助

---

## 下一步行动建议

1. **确认方向**: 选择方案A (最小改动) 还是方案B (架构重构)

2. **技术验证**: 
   - 创建一个简单的demo页面
   - 验证`@jbrowse/react-linear-genome-view`能正常工作

3. **制定详细计划**:
   - 列出具体的文件和组件
   - 确定修改顺序
   - 设置里程碑

4. **开始实施**:
   - 从最小可验证的改动开始
   - 逐步迭代

---

## 附录: 代码示例

### 示例1: 使用react-linear-genome-view

```tsx
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view'

function GenomeBrowser({ assembly, tracks, location }) {
  const [viewState, setViewState] = useState()

  useEffect(() => {
    const state = createViewState({
      assembly,
      tracks,
      location,
    })
    setViewState(state)
  }, [assembly, tracks, location])

  if (!viewState) return <div>Loading...</div>

  return <JBrowseLinearGenomeView viewState={viewState} />
}
```

### 示例2: SessionContext

```tsx
interface SessionConfig {
  sessionId: string
  assembly: string
  tracks: TrackConfig[]
  location: string
}

const SessionContext = createContext<{
  config: SessionConfig
  updateConfig: (config: Partial<SessionConfig>) => void
} | null>(null)

export function SessionProvider({ children }) {
  const [config, setConfig] = useState<SessionConfig>(defaultConfig)
  
  const updateConfig = (partial: Partial<SessionConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }))
  }
  
  return (
    <SessionContext.Provider value={{ config, updateConfig }}>
      {children}
    </SessionContext.Provider>
  )
}
```

### 示例3: 简化的TrackSelector

```tsx
function TrackSelector({ onTracksChange }) {
  const [tracks, setTracks] = useState([])
  
  const handleAddTrack = () => {
    const newTrack = {
      type: selectedType,
      url: trackUrl,
      name: trackName,
      // ... JBrowse会自动推断adapter
    }
    setTracks([...tracks, newTrack])
    onTracksChange([...tracks, newTrack])
  }
  
  return (
    <div>
      <input placeholder="Track name" />
      <input placeholder="File URL" />
      <select>{/* track types */}</select>
      <button onClick={handleAddTrack}>Add Track</button>
    </div>
  )
}
```

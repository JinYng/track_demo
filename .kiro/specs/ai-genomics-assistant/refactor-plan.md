# 方案A：最小改动的重构计划

## 核心思想

**现有优势**: WorkspacePage已经构建了完整的AI对话界面（虽然是硬编码的模拟内容），包括模型配置、聊天历史、用户输入等完整功能。

**重构策略**: 
- 不是从零开始，而是**复用App.tsx中现有的ChatInterface组件库**
- SetupWizard继续保留（只需微调）
- WorkspacePage改为使用SplitLayout + ChatInterface + GenomeBrowser

---

## 现有组件库梳理

### ✅ 可以直接复用的组件

| 组件 | 位置 | 功能 | 状态 |
|------|------|------|------|
| **ChatInterface** | `components/ChatInterface/` | 完整的AI对话界面 | ✅ 已完整实现 |
| **ModelConfiguration** | `components/ModelConfiguration/` | 模型配置（URL、Key、Model） | ✅ 已完整实现 |
| **ChatHistory** | `components/ChatHistory/` | 消息历史显示 | ✅ 已完整实现 |
| **UserInput** | `components/UserInput/` | 用户输入框 | ✅ 已完整实现 |
| **MessageBubble** | `components/MessageBubble/` | 单条消息显示 | ✅ 已完整实现 |
| **ThinkingIndicator** | `components/ThinkingIndicator/` | 思考动画 | ✅ 已完整实现 |
| **SplitLayout** | `components/SplitLayout/` | 左右分屏布局 | ✅ 已完整实现 |

### 🔄 需要创建的新组件

| 组件 | 目的 | 优先级 |
|------|------|--------|
| **GenomeBrowser** | 包装JBrowse相关UI | 高 |
| **BrowserControls** | 浏览器控制栏（导航、缩放、轨道） | 高 |
| **SessionContext** | 会话状态管理 | 中 |

---

## 详细实施方案

### 第一阶段：基础架构 (1-2天)

#### 1.1 创建SessionContext (状态管理)

**文件**: `src/contexts/SessionContext.tsx`

```tsx
import { createContext, useContext, useState } from 'react'

interface SessionConfig {
  sessionId: string
  name: string
  organism: string
  referenceGenome: string
  tracks: any[]
  currentLocation?: string
}

interface SessionContextType {
  config: SessionConfig
  updateConfig: (partial: Partial<SessionConfig>) => void
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children, initialConfig }: any) {
  const [config, setConfig] = useState<SessionConfig>(initialConfig)
  
  const updateConfig = (partial: Partial<SessionConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }))
  }
  
  return (
    <SessionContext.Provider value={{ config, updateConfig }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}
```

#### 1.2 安装JBrowse包

```bash
npm install @jbrowse/react-linear-genome-view
```

#### 1.3 创建GenomeBrowser组件

**文件**: `src/components/GenomeBrowser/GenomeBrowser.tsx`

这个组件将是JBrowse相关UI的容器。根据选择可以用：
- `@jbrowse/react-linear-genome-view` (推荐 - 无UI chrome)
- 或继续用`@jbrowse/react-app2`但隐藏不需要的UI

```tsx
import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useSession } from '../../contexts/SessionContext'
import BrowserControls from './BrowserControls'
import './GenomeBrowser.css'

interface GenomeBrowserProps {
  sessionId: string
}

export default function GenomeBrowser({ sessionId }: GenomeBrowserProps) {
  const { theme } = useTheme()
  const { config } = useSession()
  const [currentLocation, setCurrentLocation] = useState(config.currentLocation || 'chr10:29,838,565..29,838,850')

  // TODO: 集成JBrowse
  // const [viewState, setViewState] = useState()
  // useEffect(() => { ... createJBrowseView ... }, [config.assembly, config.tracks])

  return (
    <div className="genome-browser">
      {/* 浏览器控制栏 */}
      <BrowserControls 
        location={currentLocation}
        onLocationChange={setCurrentLocation}
      />

      {/* JBrowse视图区域 */}
      <div className="genome-browser__view">
        <div style={{
          flex: 1,
          backgroundColor: theme.colors.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* JBrowse组件将在这里渲染 */}
          <div style={{
            fontSize: theme.fontSizes.h3,
            color: theme.colors.secondaryText,
          }}>
            JBrowse Genome Browser
            <br />
            <span style={{ fontSize: theme.fontSizes.body }}>
              (Integration in progress)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### 1.4 创建BrowserControls组件

**文件**: `src/components/GenomeBrowser/BrowserControls.tsx`

```tsx
import { useTheme } from '../../contexts/ThemeContext'

interface BrowserControlsProps {
  location: string
  onLocationChange: (location: string) => void
}

export default function BrowserControls({
  location,
  onLocationChange,
}: BrowserControlsProps) {
  const { theme } = useTheme()

  return (
    <div style={{
      padding: theme.spacing.md,
      borderBottom: `1px solid ${theme.colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
      }}>
        {/* 导航按钮 */}
        {['<', '>', '+', '-'].map(btn => (
          <button
            key={btn}
            style={{
              background: 'none',
              border: 'none',
              fontSize: theme.fontSizes.body,
              cursor: 'pointer',
              color: theme.colors.text,
              padding: theme.spacing.sm,
            }}
            onClick={() => {
              // TODO: 实现对应功能
              console.log(`${btn} clicked`)
            }}
          >
            {btn}
          </button>
        ))}
        <span style={{
          fontSize: theme.fontSizes.body,
          color: theme.colors.text,
          marginLeft: theme.spacing.md,
        }}>
          {location}
        </span>
      </div>
      <button
        style={{
          background: 'none',
          border: 'none',
          color: theme.colors.primary,
          fontSize: theme.fontSizes.body,
          cursor: 'pointer',
        }}
      >
        Tracks
      </button>
    </div>
  )
}
```

### 第二阶段：页面重构 (1天)

#### 2.1 改进SetupWizard

**目标**: 完成步骤2和步骤3

目前的SetupWizard已经有步骤1（基础信息），需要添加：

**Step 2 - 数据源配置** (可选简化版):
```tsx
{currentStep === 2 && (
  <div>
    <p>Choose reference genome and optional tracks</p>
    <div>
      {/* 简单的轨道预设选择 */}
      <label>
        <input type="checkbox" /> Include Gene Annotations
      </label>
      <label>
        <input type="checkbox" /> Include Variants
      </label>
    </div>
  </div>
)}
```

**Step 3 - 分析选项** (可选):
```tsx
{currentStep === 3 && (
  <div>
    <p>Additional settings and initial location</p>
    {/* 初始位置输入框 */}
  </div>
)}
```

> **注意**: 如果觉得太复杂，可以先只保留Step1，跳过2和3。后续在WorkspacePage中添加"Add Track"按钮。

#### 2.2 改进WorkspacePage

**新的流程**:

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { ChatInterface } from '../components/ChatInterface'
import GenomeBrowser from '../components/GenomeBrowser/GenomeBrowser'
import { SplitLayout } from '../components/SplitLayout'
import { SessionProvider, useSession } from '../contexts/SessionContext'

function WorkspacePageContent() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { theme } = useTheme()
  const { config } = useSession()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 - 保持不变 */}
      <header style={{...}}>
        {/* 现有代码 */}
      </header>

      {/* 主工作区 - 使用SplitLayout */}
      <SplitLayout
        defaultSplitPercentage={40}
        leftPanel={
          <ChatInterface viewState={null} /> {/* 复用现有组件 */}
        }
        rightPanel={
          <GenomeBrowser sessionId={sessionId!} /> {/* 新的基因组浏览器 */}
        }
      />
    </div>
  )
}

export default function WorkspacePage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  // 初始化会话配置
  const initialConfig = {
    sessionId: sessionId || 'default',
    name: `Session ${sessionId}`,
    organism: 'Human',
    referenceGenome: 'hg38',
    tracks: [],
  }

  return (
    <SessionProvider initialConfig={initialConfig}>
      <WorkspacePageContent />
    </SessionProvider>
  )
}
```

### 第三阶段：SetupWizard配置传递 (1天)

#### 3.1 修改DashboardPage

```tsx
const handleCreateSession = (sessionData: SessionData) => {
  const newSessionId = Date.now().toString()
  
  // 保存会话配置到localStorage或sessionStorage
  sessionStorage.setItem(`session_${newSessionId}`, JSON.stringify(sessionData))
  
  navigate(`/workspace/${newSessionId}`)
}
```

#### 3.2 修改WorkspacePage读取配置

```tsx
export default function WorkspacePage() {
  const { sessionId } = useParams<{ sessionId: string }>()

  // 从sessionStorage读取配置
  const savedConfig = sessionStorage.getItem(`session_${sessionId}`)
  const initialConfig = savedConfig 
    ? JSON.parse(savedConfig)
    : { /* 默认配置 */ }

  return (
    <SessionProvider initialConfig={initialConfig}>
      <WorkspacePageContent />
    </SessionProvider>
  )
}
```

### 第四阶段：JBrowse集成 (2-3天)

#### 4.1 在GenomeBrowser中实现JBrowse

```tsx
import { createViewState, JBrowseLinearGenomeView } from '@jbrowse/react-linear-genome-view'

export default function GenomeBrowser({ sessionId }: GenomeBrowserProps) {
  const { config } = useSession()
  const [viewState, setViewState] = useState()

  useEffect(() => {
    const state = createViewState({
      assembly: {
        name: config.referenceGenome,
        // ... assembly配置
      },
      tracks: config.tracks,
      location: config.currentLocation,
    })
    setViewState(state)
  }, [config.referenceGenome, config.tracks, config.currentLocation])

  if (!viewState) return <div>Loading...</div>

  return (
    <div className="genome-browser">
      <BrowserControls location={currentLocation} onLocationChange={setCurrentLocation} />
      <div className="genome-browser__view">
        <JBrowseLinearGenomeView viewState={viewState} />
      </div>
    </div>
  )
}
```

#### 4.2 实现JBrowse控制方法

```tsx
// src/services/jbrowseController.ts

export function createJBrowseController(viewState: any) {
  return {
    // 导航到特定位置
    goToLocation: (location: string) => {
      // viewState操作
    },
    
    // 添加轨道
    addTrack: (trackConfig: any) => {
      // viewState操作
    },
    
    // 移除轨道
    removeTrack: (trackId: string) => {
      // viewState操作
    },
    
    // 高亮区域
    highlight: (region: string) => {
      // viewState操作
    },
    
    // 缩放
    zoom: (level: number) => {
      // viewState操作
    },
  }
}
```

#### 4.3 AI与JBrowse交互

在ChatInterface或AIJBrowseController中实现AI命令解析：

```tsx
// 示例：AI说"show me TP53"
// 后端返回: { action: 'navigate', location: 'chr17:7661779-7687550' }
// 前端执行: jbrowseController.goToLocation('chr17:7661779-7687550')
```

---

## 文件结构总览

```
frontend/src/
├── contexts/
│   ├── ThemeContext.tsx          (已有)
│   └── SessionContext.tsx        (新建)    ← 第一阶段
│
├── components/
│   ├── ChatInterface/            (已有 ✅)
│   ├── ModelConfiguration/       (已有 ✅)
│   ├── ChatHistory/              (已有 ✅)
│   ├── UserInput/                (已有 ✅)
│   ├── MessageBubble/            (已有 ✅)
│   ├── ThinkingIndicator/        (已有 ✅)
│   ├── SplitLayout/              (已有 ✅)
│   ├── SetupWizard.tsx           (改进)   ← 第二阶段
│   └── GenomeBrowser/            (新建)   ← 第一阶段
│       ├── GenomeBrowser.tsx
│       ├── BrowserControls.tsx
│       └── GenomeBrowser.css
│
├── services/
│   ├── websocket.ts              (已有)
│   ├── jbrowseController.ts      (新建)   ← 第四阶段
│   └── aiJBrowseAdapter.ts       (新建)   ← 第四阶段
│
├── pages/
│   ├── DashboardPage.tsx         (改进)   ← 第三阶段
│   └── WorkspacePage.tsx         (重构)   ← 第二阶段
│
└── App.tsx                       (改进)   ← 第二阶段
```

---

## 修改清单

### DashboardPage
- [ ] 修改`handleCreateSession`保存配置到sessionStorage

### SetupWizard
- [ ] 添加Step 2: 数据源配置 (可选)
- [ ] 添加Step 3: 分析选项 (可选)
- [ ] 完成时传递完整的sessionData

### WorkspacePage
- [ ] ❌ 删除硬编码的HTML模拟内容
- [ ] ✅ 添加SessionProvider包装
- [ ] ✅ 使用SplitLayout布局
- [ ] ✅ 左侧使用ChatInterface（复用现有组件）
- [ ] ✅ 右侧使用GenomeBrowser（新组件）
- [ ] ✅ 从sessionStorage读取会话配置

### 新增文件
- [ ] `src/contexts/SessionContext.tsx`
- [ ] `src/components/GenomeBrowser/GenomeBrowser.tsx`
- [ ] `src/components/GenomeBrowser/BrowserControls.tsx`
- [ ] `src/components/GenomeBrowser/GenomeBrowser.css`
- [ ] `src/services/jbrowseController.ts`
- [ ] `src/services/aiJBrowseAdapter.ts`

---

## 关键实施要点

### ✅ 优势
1. **复用已有组件**: ChatInterface、UserInput等已完整实现，直接用
2. **最小化改动**: 只改WorkspacePage和添加新组件，不触及现有逻辑
3. **渐进式集成**: 每个阶段都可以独立验证
4. **低风险**: 可随时回滚

### ⚠️ 注意事项
1. **配置持久化**: 使用sessionStorage还是localStorage？
   - 建议: sessionStorage (会话级别) 或 URL state
   
2. **状态同步**: ChatInterface和GenomeBrowser需要共享viewState吗？
   - 建议: 通过SessionContext或回调函数通信

3. **JBrowse包选择**: 
   - 前期可以继续用`@jbrowse/react-app2`但隐藏UI
   - 后期考虑迁移到`@jbrowse/react-linear-genome-view`

---

## 验收标准

### 第一阶段完成
- [ ] SessionContext可以正常创建和更新配置
- [ ] GenomeBrowser组件能在WorkspacePage中显示

### 第二阶段完成
- [ ] WorkspacePage使用SplitLayout布局
- [ ] 左侧ChatInterface正常显示
- [ ] 右侧GenomeBrowser正常显示

### 第三阶段完成
- [ ] SetupWizard的配置能传到WorkspacePage
- [ ] 刷新页面能保留配置

### 第四阶段完成
- [ ] JBrowse在GenomeBrowser中显示
- [ ] 浏览器控制栏能控制JBrowse
- [ ] AI命令能触发JBrowse操作


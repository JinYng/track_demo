# 快速开始指南 - 方案A实施

## 📋 预备检查

在开始实施之前，请确认以下几点：

- [ ] 当前代码都在main分支，且已commit
- [ ] 已安装Node.js 18+和npm 9+
- [ ] 能正常运行 `npm run dev`
- [ ] 后端服务正在运行

## 🎯 实施目标

### 总体目标
将当前**模拟的WorkspacePage**重构为**真正的AI+JBrowse协作界面**

### 具体目标
1. 复用现有的AI对话组件库 (ChatInterface等)
2. 创建基因组浏览器容器 (GenomeBrowser)
3. 实现会话配置传递 (SetupWizard → WorkspacePage)
4. 集成JBrowse引擎 (逐步集成)

---

## 📂 现有可复用资源

### 已完整实现的组件 ✅

```
ChatInterface (完整)
├── ModelConfiguration       ✅ 模型配置UI
├── ChatHistory             ✅ 消息历史显示
├── UserInput               ✅ 输入框+发送
├── MessageBubble           ✅ 消息展示
└── ThinkingIndicator       ✅ 思考动画

SplitLayout                 ✅ 可拖拽分屏

SetupWizard                 ✅ 三步向导框架
└── Step1已实现               ✅ 基础信息
```

### 已有的配置资源 ✅

```
config.ts
├── assemblies (hg38 + 其他)  ✅
├── tracks (预定义)           ✅
└── defaultSession            ✅

ThemeContext                 ✅ 设计系统
```

---

## 🚀 四个阶段实施

### 第一阶段：基础架构 (1-2天)

#### 步骤1.1: 创建SessionContext

**文件**: `frontend/src/contexts/SessionContext.tsx`

关键点：
- 定义SessionConfig接口
- 提供useSession hook
- 初始化默认值

**预期结果**: 能导入并使用 `useSession()` hook

```bash
# 验证
npx tsc --noEmit  # 检查类型错误
```

#### 步骤1.2: 创建GenomeBrowser组件结构

**文件**:
- `frontend/src/components/GenomeBrowser/GenomeBrowser.tsx`
- `frontend/src/components/GenomeBrowser/BrowserControls.tsx`
- `frontend/src/components/GenomeBrowser/GenomeBrowser.css`

**预期结果**: 能在WorkspacePage右侧显示基因组浏览器占位符

```tsx
// 简单版本 - 只是占位符UI
export default function GenomeBrowser() {
  return <div>基因组浏览器占位符</div>
}
```

#### 步骤1.3: 安装JBrowse包 (可选延后)

```bash
npm install @jbrowse/react-linear-genome-view
```

**注意**: 这一步可以延后到第四阶段，不必现在做

---

### 第二阶段：页面重构 (1天)

#### 步骤2.1: 改进SetupWizard

**当前状态**: 只有Step1 (基础设置)

**需要做的**: 
- [ ] Step2: 数据源配置 (可简化为可选配置)
- [ ] Step3: 分析选项 (可简化)

**最小化改动**:
```tsx
{currentStep === 2 && (
  <div>
    <h3>数据源配置 (可选)</h3>
    <label>
      <input type="checkbox" /> 包含基因注释
    </label>
  </div>
)}

{currentStep === 3 && (
  <div>
    <h3>其他设置</h3>
    {/* 或直接跳过，点击Create就完成 */}
  </div>
)}
```

**预期结果**: SetupWizard能3步完成并传递完整sessionData

#### 步骤2.2: 重构WorkspacePage

**重构策略**:

1. **删除**硬编码的HTML模拟内容
2. **添加**SessionProvider包装
3. **导入**ChatInterface和GenomeBrowser
4. **使用**SplitLayout布局

**预期结果**: WorkspacePage显示左右分屏，左侧AI、右侧基因组浏览器占位符

```tsx
// 简化版本
import { ChatInterface } from '../components/ChatInterface'
import GenomeBrowser from '../components/GenomeBrowser'
import { SplitLayout } from '../components/SplitLayout'
import { SessionProvider } from '../contexts/SessionContext'

export default function WorkspacePage() {
  return (
    <SessionProvider initialConfig={{}}>
      <SplitLayout
        leftPanel={<ChatInterface viewState={null} />}
        rightPanel={<GenomeBrowser />}
        defaultSplitPercentage={40}
      />
    </SessionProvider>
  )
}
```

#### 步骤2.3: 验证

```bash
npm run dev

# 验证清单
[ ] 页面能加载
[ ] 左侧能看到ChatInterface
[ ] 右侧能看到GenomeBrowser占位符
[ ] 分割线可拖拽
[ ] 没有console错误
```

---

### 第三阶段：配置传递 (1天)

#### 步骤3.1: 修改DashboardPage

**目标**: SaveSetupWizard的配置

**修改点**:
```tsx
const handleCreateSession = (sessionData: SessionData) => {
  const newSessionId = Date.now().toString()
  
  // 保存配置
  sessionStorage.setItem(`session_${newSessionId}`, JSON.stringify(sessionData))
  
  // 导航
  navigate(`/workspace/${newSessionId}`)
}
```

#### 步骤3.2: 修改WorkspacePage读取配置

**修改点**:
```tsx
const savedConfig = sessionStorage.getItem(`session_${sessionId}`)
const initialConfig = savedConfig ? JSON.parse(savedConfig) : defaultConfig
```

#### 步骤3.3: 验证

```bash
# 验证清单
[ ] 创建新Session后能跳转
[ ] 刷新页面配置不丢失
[ ] 多个Session配置互不影响
```

---

### 第四阶段：JBrowse集成 (2-3天) [可延后]

#### 步骤4.1: 安装JBrowse包

```bash
npm install @jbrowse/react-linear-genome-view
```

#### 步骤4.2: 在GenomeBrowser中使用

```tsx
import { createViewState, JBrowseLinearGenomeView } from '@jbrowse/react-linear-genome-view'

export default function GenomeBrowser() {
  const [viewState, setViewState] = useState()

  useEffect(() => {
    const state = createViewState({
      // 配置
    })
    setViewState(state)
  }, [])

  if (!viewState) return <div>Loading...</div>
  return <JBrowseLinearGenomeView viewState={viewState} />
}
```

#### 步骤4.3: 实现JBrowse控制

创建 `frontend/src/services/jbrowseController.ts`:
```tsx
export function createJBrowseController(viewState: any) {
  return {
    goToLocation: (location: string) => { /* ... */ },
    addTrack: (config: any) => { /* ... */ },
    // ... 其他方法
  }
}
```

---

## 📊 阶段检查清单

### ✅ 第一阶段验收

- [ ] SessionContext能正常导入和使用
- [ ] GenomeBrowser组件存在且能导入
- [ ] 没有TypeScript编译错误
- [ ] 没有运行时错误

### ✅ 第二阶段验收

- [ ] WorkspacePage能正常加载
- [ ] 看到左右分屏布局
- [ ] 左侧ChatInterface显示正常
- [ ] 右侧GenomeBrowser显示正常
- [ ] 分割线可拖拽
- [ ] 没有console错误

### ✅ 第三阶段验收

- [ ] SetupWizard能保存配置到sessionStorage
- [ ] WorkspacePage能读取配置
- [ ] 页面刷新配置不丢失
- [ ] 多个Session互不干扰

### ✅ 第四阶段验收 (可选)

- [ ] JBrowse能在GenomeBrowser中显示
- [ ] 浏览器控制栏能控制JBrowse
- [ ] AI命令能调用JBrowse控制器
- [ ] 完整流程无错误

---

## 🛠️ 开发技巧

### 快速调试

```typescript
// 在SessionContext中打印状态
console.log('Session Config:', config)

// 在浏览器DevTools中检查sessionStorage
window.sessionStorage.getItem('session_123')

// 观察状态变化
useEffect(() => {
  console.log('Config changed:', config)
}, [config])
```

### 遇到问题

| 问题 | 解决方案 |
|------|--------|
| SessionContext报错 | 检查是否在SessionProvider内部使用 |
| GenomeBrowser不显示 | 检查SplitLayout的rightPanel prop |
| 配置丢失 | 检查sessionStorage是否在存储数据 |
| 导入错误 | 运行 `npm run dev` 重新编译 |

### 逐步测试

```bash
# 第一阶段
npm run dev
# 手动打开DevTools，检查SessionContext

# 第二阶段
# 检查WorkspacePage是否显示SplitLayout

# 第三阶段
# 创建Session，检查localStorage/sessionStorage

# 第四阶段
# 集成JBrowse包，检查是否能渲染
```

---

## 📝 代码片段参考

### SessionContext基础框架

```typescript
import { createContext, useContext, useState, ReactNode } from 'react'

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

export function SessionProvider({
  children,
  initialConfig,
}: {
  children: ReactNode
  initialConfig: SessionConfig
}) {
  const [config, setConfig] = useState(initialConfig)

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

### GenomeBrowser基础框架

```typescript
import { useTheme } from '../../contexts/ThemeContext'
import { useSession } from '../../contexts/SessionContext'

export default function GenomeBrowser() {
  const { theme } = useTheme()
  const { config } = useSession()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 控制栏 */}
      <div style={{
        padding: theme.spacing.md,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}>
        {/* 控制按钮等 */}
      </div>

      {/* 浏览器区域 */}
      <div style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        {/* JBrowse将在这里 */}
      </div>
    </div>
  )
}
```

---

## 📞 常见问题

### Q: 为什么不用Redux或Zustand？
A: 当前数据量小，React Context足够。后续如果复杂度增加可迁移。

### Q: SetupWizard的Step2/3是必须的吗？
A: 不必须。如果觉得复杂，可以先只保留Step1，后续在WorkspacePage中添加"Add Track"按钮。

### Q: 配置用sessionStorage还是localStorage？
A: sessionStorage (会话级)，因为每次打开都是新会话。如果需要跨浏览器标签页共享，改用localStorage。

### Q: JBrowse什么时候集成？
A: 第四阶段是可选的。可以先完成前三阶段验证架构可行性，再决定何时集成JBrowse。

### Q: 如何同时开发前端和后端？
A: 
```bash
# 终端1: 前端
cd frontend
npm run dev

# 终端2: 后端
cd backend
python start_dev.py
```

---

## ✨ 预期收益

完成这四个阶段后，你将获得：

1. ✅ **现代化的Web架构**: 使用React Context进行状态管理
2. ✅ **清晰的数据流**: SetupWizard → WorkspacePage → JBrowse
3. ✅ **可复用的组件库**: ChatInterface等能在其他页面复用
4. ✅ **基础的JBrowse集成**: 可进一步扩展
5. ✅ **AI+JBrowse交互框架**: 为后续功能奠定基础

---

## 下一步

1. **确认** 是否按此方案实施
2. **阅读** `refactor-plan.md` 获取详细代码示例
3. **开始** 第一阶段: 创建SessionContext
4. **定期验证** 每个阶段的完成情况

祝实施顺利！🚀

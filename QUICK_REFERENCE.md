# 🎯 JBrowse API 快速参考卡

## ⚡ 30 秒速览

```
Q: 能通过公开 API 实现侧拉框轨道选择器吗？
A: ✅ 是的，100% 可行

Q: 需要多长时间？
A: 3-4 小时

Q: 有什么风险？
A: 极低风险

Q: 从哪里开始？
A: 创建 ViewStateContext (下面有代码)
```

---

## 🔧 核心 API (5 分钟必读)

### 获取轨道

```typescript
// 在任何需要轨道信息的地方
const viewState = useViewState(); // 从 Context 获取

// 所有可用轨道
const allTracks = viewState.config.tracks;
// [{trackId: 'genes', name: 'Genes', ...}, ...]

// 当前显示的轨道
const displayedTracks = viewState.session.views[0].tracks;
// [TrackObject, TrackObject, ...]
```

### 控制轨道

```typescript
const view = viewState.session.views[0];

// 显示轨道
view.showTrack("genes");

// 隐藏轨道
view.hideTrack("genes");

// 切换轨道显示/隐藏
view.toggleTrack("genes");

// 获取轨道对象
const track = view.getTrack("genes");

// 轨道排序
view.trackToTop("genes"); // 置顶
view.trackToBottom("genes"); // 置底
view.trackUp("genes"); // 上移
view.trackDown("genes"); // 下移
```

---

## 📦 4 步快速实现

### 第 1 步：创建 ViewStateContext

```typescript
// src/contexts/JBrowseViewStateContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import { createViewState } from '@jbrowse/react-linear-genome-view'
import viewConfig from '../config'

const ViewStateContext = createContext<any>(null)

export function JBrowseViewStateProvider({ children }: { children: ReactNode }) {
  const state = createViewState({
    assembly: viewConfig.assembly,
    tracks: viewConfig.tracks,
    location: viewConfig.location,
    defaultSession: viewConfig.defaultSession,
  })

  return (
    <ViewStateContext.Provider value={state}>
      {children}
    </ViewStateContext.Provider>
  )
}

export function useViewState() {
  const ctx = useContext(ViewStateContext)
  if (!ctx) throw new Error('useViewState must be inside JBrowseViewStateProvider')
  return ctx
}
```

### 第 2 步：创建 Drawer 组件

```typescript
// src/components/ui/Drawer/Drawer.tsx
import { useTheme } from '../../../contexts/ThemeContext'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  const { theme } = useTheme()

  return (
    <>
      {/* 背景遮罩 */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={onClose}
        />
      )}

      {/* 抽屉 */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '400px',
          backgroundColor: theme.colors.background,
          borderLeft: `1px solid ${theme.colors.border}`,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1000,
          overflow: 'auto',
          padding: theme.spacing.md,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
          <h2>Tracks</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>
            ×
          </button>
        </div>
        {children}
      </div>
    </>
  )
}
```

### 第 3 步：创建 TrackSelector 组件

```typescript
// src/components/TrackSelector/TrackSelector.tsx
import { useViewState } from '../../contexts/JBrowseViewStateContext'
import { useTheme } from '../../contexts/ThemeContext'

export default function TrackSelector() {
  const viewState = useViewState()
  const { theme } = useTheme()

  const view = viewState.session.views[0]
  const allTracks = viewState.config.tracks || []

  // 获取当前显示的轨道 ID
  const displayedTrackIds = new Set(
    view.tracks.map((t: any) => t.configuration?.trackId)
  )

  const handleToggleTrack = (trackId: string) => {
    if (displayedTrackIds.has(trackId)) {
      view.hideTrack(trackId)
    } else {
      view.showTrack(trackId)
    }
  }

  return (
    <div>
      {allTracks.map((track: any) => (
        <label
          key={track.trackId}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing.sm,
            marginBottom: theme.spacing.xs,
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLLabelElement).style.backgroundColor = theme.colors.surface
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLLabelElement).style.backgroundColor = 'transparent'
          }}
        >
          <input
            type="checkbox"
            checked={displayedTrackIds.has(track.trackId)}
            onChange={() => handleToggleTrack(track.trackId)}
            style={{ marginRight: theme.spacing.sm, cursor: 'pointer' }}
          />
          <span>{track.name || track.trackId}</span>
        </label>
      ))}
    </div>
  )
}
```

### 第 4 步：集成到 WorkspacePage

```typescript
// src/pages/WorkspacePage.tsx - 修改关键部分
import { useState } from 'react'
import Drawer from '../components/ui/Drawer/Drawer'
import TrackSelector from '../components/TrackSelector/TrackSelector'

function WorkspacePageContent() {
  const [isTrackSelectorOpen, setIsTrackSelectorOpen] = useState(false)

  return (
    <>
      {/* 现有内容 */}
      <header>
        {/* ... 现有代码 ... */}
        <button onClick={() => setIsTrackSelectorOpen(true)}>
          Tracks
        </button>
      </header>

      {/* Drawer 组件 */}
      <Drawer isOpen={isTrackSelectorOpen} onClose={() => setIsTrackSelectorOpen(false)}>
        <TrackSelector />
      </Drawer>

      {/* ... 其他内容 ... */}
    </>
  )
}
```

---

## 🔑 关键要点

| 概念              | 说明                                     |
| ----------------- | ---------------------------------------- |
| **ViewState**     | JBrowse 的全局状态对象，包含轨道信息     |
| **Context**       | React 的状态共享机制，用来传递 viewState |
| **Drawer**        | 从右侧滑出的面板，显示轨道选择器         |
| **TrackSelector** | 轨道列表 UI，支持复选框切换              |

---

## 🆘 常见问题

**Q: useViewState() 报错 "not inside provider"？**
A: 确保 WorkspacePage 被 JBrowseViewStateProvider 包裹

**Q: 轨道没有更新？**
A: JBrowse 使用 MobX 状态管理，React 组件可能需要强制更新

**Q: 怎样添加搜索功能？**
A: 添加 `<input onChange={...} />` 过滤 allTracks 数组

**Q: 怎样支持拖拽排序？**
A: 使用 react-beautiful-dnd 或类似库，结合 trackUp/trackDown 方法

---

## 📖 详细文档

| 文档                                 | 阅读时间 | 内容                   |
| ------------------------------------ | -------- | ---------------------- |
| API_INVESTIGATION_COMPLETE.md        | 10 min   | 总体总结和建议         |
| JBROWSE_API_INVESTIGATION_FINAL.md   | 15 min   | 完整调查结果           |
| JBROWSE_API_INVESTIGATION_SUMMARY.md | 10 min   | 执行摘要               |
| JBROWSE_API_INVESTIGATION.md         | 30 min   | 深度参考（需要时查看） |

---

**快速参考版本：** 1.0
**最后更新：** 2025-10-27
**难度：** ⭐⭐⭐ (中等)
**时间：** 3-4 小时
**风险：** 🟢 极低

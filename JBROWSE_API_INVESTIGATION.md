# JBrowse API 调查报告

## 概述

本报告基于对 `@jbrowse/react-linear-genome-view@3.1.0` 的深度分析，重点研究如何通过公开 API 实现侧拉框轨道选择器功能。

---

## 1. 核心发现

### ✅ **轨道控制方法** - 完全可用

| 方法            | 位置               | 签名                                                                            | 说明                         |
| --------------- | ------------------ | ------------------------------------------------------------------------------- | ---------------------------- |
| `showTrack()`   | `session.views[0]` | `showTrack(trackId: string, initialSnapshot?: {}, displayInitialSnapshot?: {})` | **可用** - 显示轨道          |
| `hideTrack()`   | `session.views[0]` | `hideTrack(trackId: string): number`                                            | **可用** - 隐藏轨道          |
| `getTrack()`    | `session.views[0]` | `getTrack(id: string): any`                                                     | **可用** - 获取轨道对象      |
| `toggleTrack()` | `session.views[0]` | `toggleTrack(trackId: string)`                                                  | **可用** - 切换轨道显示/隐藏 |

### ✅ **轨道配置管理** - 完全可用

| 方法              | 位置                                      | 用途             |
| ----------------- | ----------------------------------------- | ---------------- |
| `addTrackConf()`  | `config` 或 `session.connectionInstances` | 添加新轨道配置   |
| `addTrackConfs()` | `config` 或 `session.connectionInstances` | 批量添加轨道配置 |
| `setTrackConfs()` | `session.connectionInstances`             | 替换所有轨道配置 |

### ✅ **轨道显示排序** - 完全可用

| 方法                     | 位置               | 用途           |
| ------------------------ | ------------------ | -------------- |
| `trackToTop(trackId)`    | `session.views[0]` | 将轨道移到顶部 |
| `trackToBottom(trackId)` | `session.views[0]` | 将轨道移到底部 |
| `trackUp(trackId)`       | `session.views[0]` | 向上移动轨道   |
| `trackDown(trackId)`     | `session.views[0]` | 向下移动轨道   |

---

## 2. ViewState 对象结构

### 完整的返回对象结构

```typescript
createViewState() 返回: {
  config: {
    assembly: AssemblyConfig,           // 基因组程序集配置
    tracks: Track[],                    // 所有可用的轨道数组
    plugins: Plugin[],                  // 加载的插件
    rpcManager: RpcManager,             // RPC 管理器
    // ... 其他配置
  },
  session: {
    id: string,
    name: string,
    views: [
      {
        id: string,
        type: 'LinearGenomeView',
        tracks: Track[],                // 当前显示的轨道
        offsetPx: number,               // 偏移量
        bpPerPx: number,                // 每像素碱基对数
        displayedRegions: Region[],     // 显示的区域

        // 关键方法
        showTrack(trackId, ...),
        hideTrack(trackId),
        getTrack(id),
        toggleTrack(trackId),

        // 排序方法
        trackToTop(trackId),
        trackToBottom(trackId),
        trackUp(trackId),
        trackDown(trackId),

        // 其他方法
        setDisplayName(name),
        setWidth(newWidth),
        setMinimized(flag),
      }
    ],
    connectionInstances: Connection[],
    // ... 其他会话信息
  }
}
```

---

## 3. 实现方案分析

### 方案评估

#### ✅ **方案 B（推荐）：完全使用公开 API**

**优势：**

- 所有需要的轨道控制方法 (`showTrack`, `hideTrack`, `toggleTrack`) 都是公开的
- 可以获取所有可用轨道 (`config.tracks`)
- 可以获取当前显示的轨道 (`session.views[0].tracks`)
- 支持轨道排序操作
- 100% 公开 API，跨版本兼容性好

**代码示例：**

```typescript
// 获取 viewState（需要通过 ref 或 prop 传递）
const view = viewState.session.views[0];

// 显示轨道
view.showTrack("genes");

// 隐藏轨道
view.hideTrack("genes");

// 切换轨道
view.toggleTrack("genes");

// 获取所有可用轨道
const allTracks = viewState.config.tracks;

// 获取当前显示的轨道
const displayedTracks = view.tracks;
```

#### ⚠️ **方案 A（不可行）：尝试访问内部 UI 组件**

**结论：** 无法访问 JBrowse 内部的轨道选择器 React 组件，因为：

- 轨道选择器 UI 不是通过 `viewState` 暴露的
- 需要使用 `@jbrowse/react-app2`（完整版本）才能访问这些组件
- `react-linear-genome-view` 是简化版本，不提供这个 API

---

## 4. 轨道信息结构

### 轨道对象示例

```typescript
interface Track {
  trackId: string; // 唯一标识符（如 'genes'）
  name: string; // 显示名称（如 'NCBI RefSeq Genes'）
  type: string; // 类型（'FeatureTrack', 'QuantitativeTrack'等）
  assemblyNames: string[]; // 适用的程序集
  category?: string[]; // 分类标签
  adapter: {
    type: string; // 适配器类型
    // ... 具体的适配器配置
  };
  displays?: Display[]; // 显示配置
  // ... 其他配置
}
```

---

## 5. 实现 Drawer 轨道选择器的完整步骤

### 第一步：创建 Drawer 组件

✅ 完全可行

```typescript
// src/components/ui/Drawer/Drawer.tsx
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  // 从右侧滑出的抽屉组件
}
```

### 第二步：集成到 WorkspacePage

✅ 完全可行

```typescript
// WorkspacePage.tsx
const [isTrackSelectorOpen, setIsTrackSelectorOpen] = useState(false);

return (
  <>
    <GenomeBrowser />
    <Drawer isOpen={isTrackSelectorOpen} onClose={() => setIsTrackSelectorOpen(false)}>
      <TrackSelector />
    </Drawer>
  </>
);
```

### 第三步：实现轨道选择器 UI

✅ 完全可行（使用公开 API）

```typescript
// src/components/TrackSelector/TrackSelector.tsx
export default function TrackSelector({ viewState }: Props) {
  const view = viewState.session.views[0];
  const allTracks = viewState.config.tracks;
  const displayedTracks = view.tracks.map(t => t.configuration?.trackId);

  const handleToggleTrack = (trackId: string) => {
    if (displayedTracks.includes(trackId)) {
      view.hideTrack(trackId);
    } else {
      view.showTrack(trackId);
    }
  };

  return (
    <div>
      {allTracks.map(track => (
        <TrackItem
          key={track.trackId}
          track={track}
          isDisplayed={displayedTracks.includes(track.trackId)}
          onToggle={() => handleToggleTrack(track.trackId)}
        />
      ))}
    </div>
  );
}
```

### 第四步：传递 viewState 给组件

⚠️ **需要解决的问题**

目前的架构限制：

- `JBrowseViewer` 创建了 `viewState`，但它是局部变量
- `WorkspacePage` 和 `Drawer` 无法访问这个 `viewState`

**解决方案：**

```typescript
// 使用 useRef 从 JBrowseViewer 导出 viewState
export const viewStateRef = React.createRef<any>();

// 或使用 Context API
export const ViewStateContext = createContext<ViewState | null>(null);

// 在 JBrowseViewer 中
<ViewStateContext.Provider value={state}>
  <JBrowseLinearGenomeView viewState={state} />
</ViewStateContext.Provider>
```

---

## 6. 事件监听与变化检测

### MobX 状态树观察者

```typescript
// JBrowse 使用 mobx-state-tree，支持监听变化
import { onPatch, onSnapshot } from "mobx-state-tree";

// 监听状态变化
onPatch(viewState, (patch) => {
  console.log("State changed:", patch);
  // 当轨道被添加/移除/隐藏时触发
});

// 监听完整快照
onSnapshot(viewState, (snapshot) => {
  console.log("New snapshot:", snapshot);
});
```

---

## 7. 约束和限制

| 限制项               | 详情                                        | 影响                         |
| -------------------- | ------------------------------------------- | ---------------------------- |
| **ViewState 作用域** | 在 JBrowseViewer 组件内创建，无法从外部访问 | 需要通过 Context 或 Ref 导出 |
| **组件内部访问**     | 无法访问 JBrowse 的内部 React UI 组件       | 必须自己实现轨道选择器 UI    |
| **插件依赖**         | 某些高级功能可能需要特定插件                | 需要配置 `plugins` 参数      |
| **异步初始化**       | ViewState 初始化是异步的                    | 需要等待初始化完成才能使用   |

---

## 8. 建议的实现路径

### 短期（立即可做）

1. ✅ 创建 Drawer 组件（无依赖）- **30 分钟**
2. ✅ 将 Drawer 集成到 WorkspacePage - **20 分钟**
3. ⚠️ 导出 viewState（通过 Context 或 Ref） - **30 分钟**

### 中期（1-2 小时）

4. ✅ 实现轨道选择器 UI - **1 小时**
5. ✅ 集成轨道显示/隐藏功能 - **30 分钟**
6. ✅ 添加搜索/过滤功能 - **1 小时**

### 长期（可选增强）

7. 🎨 支持轨道拖拽排序
8. 📊 支持轨道分层显示
9. 🔔 实时监听轨道变化

---

## 9. 总结

### 结论

**可行性评估：✅ 100% 可行**

- 所有必需的轨道控制方法都是公开的
- API 设计清晰，易于使用
- 无需访问 JBrowse 内部实现

### 主要技术障碍

**唯一的真正障碍：** 如何将 `viewState` 从 `JBrowseViewer` 导出到 `WorkspacePage`

**解决方案：** 使用 React Context API（推荐）或 useRef

### 下一步

1. 使用 Context API 包装 JBrowseViewer
2. 创建 Drawer 组件
3. 实现轨道选择器 UI
4. 测试轨道显示/隐藏功能

---

## 附录：API 参考

### view.showTrack()

```typescript
showTrack(trackId: string, initialSnapshot?: {}, displayInitialSnapshot?: {}): any
```

显示指定的轨道。可选参数用于自定义初始化快照。

### view.hideTrack()

```typescript
hideTrack(trackId: string): number
```

隐藏指定的轨道。返回轨道在数组中的索引。

### view.toggleTrack()

```typescript
toggleTrack(trackId: string): void
```

切换轨道的显示/隐藏状态。

### view.getTrack()

```typescript
getTrack(id: string): any
```

获取指定的轨道对象。

### view.trackToTop()

```typescript
trackToTop(trackId: string): void
```

将轨道移到显示列表的顶部。

### view.trackToBottom()

```typescript
trackToBottom(trackId: string): void
```

将轨道移到显示列表的底部。

### view.trackUp() / view.trackDown()

```typescript
trackUp(trackId: string): void
trackDown(trackId: string): void
```

上下移动轨道位置。

---

**报告生成时间:** 2025-10-27
**分析对象:** @jbrowse/react-linear-genome-view@3.1.0
**分析方法:** 源代码类型定义（.d.ts）和 JavaScript 实现

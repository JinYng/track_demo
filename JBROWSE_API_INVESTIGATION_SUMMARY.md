# JBrowse API 调查 - 执行摘要

## 🎯 核心问题

**如何通过公开 API 实现从模态框到侧拉框的轨道选择器重构？**

---

## ✅ 调查结论

### **可行性评分：10/10（完全可行）**

所有必需的功能都通过公开 API 提供：

```
┌─────────────────────────────────────┐
│   ViewState 对象结构                 │
├─────────────────────────────────────┤
│ viewState                           │
│  ├─ config                          │
│  │  ├─ assembly ✅                 │
│  │  ├─ tracks[] ✅ (所有可用轨道)   │
│  │  └─ plugins                      │
│  └─ session                         │
│     └─ views[0] (LinearGenomeView)│
│        ├─ tracks[] ✅ (当前显示)   │
│        ├─ showTrack() ✅           │
│        ├─ hideTrack() ✅           │
│        ├─ toggleTrack() ✅         │
│        ├─ getTrack() ✅            │
│        ├─ trackToTop() ✅          │
│        ├─ trackToBottom() ✅       │
│        ├─ trackUp() ✅             │
│        └─ trackDown() ✅           │
└─────────────────────────────────────┘
```

---

## 📊 关键轨道方法

| 操作     | 方法                          | 返回值          | 状态    |
| -------- | ----------------------------- | --------------- | ------- |
| 显示轨道 | `view.showTrack(trackId)`     | `any`           | ✅ 可用 |
| 隐藏轨道 | `view.hideTrack(trackId)`     | `number` (索引) | ✅ 可用 |
| 切换轨道 | `view.toggleTrack(trackId)`   | `void`          | ✅ 可用 |
| 获取轨道 | `view.getTrack(id)`           | `Track`         | ✅ 可用 |
| 轨道置顶 | `view.trackToTop(trackId)`    | `void`          | ✅ 可用 |
| 轨道置底 | `view.trackToBottom(trackId)` | `void`          | ✅ 可用 |
| 轨道上移 | `view.trackUp(trackId)`       | `void`          | ✅ 可用 |
| 轨道下移 | `view.trackDown(trackId)`     | `void`          | ✅ 可用 |

---

## 🛠️ 实现可行性评估

### 任务一：创建 Drawer 组件

```
难度: ⭐☆☆☆☆ (非常简单)
时间: 30-40 分钟
依赖: 无
状态: ✅ 立即可做
```

### 任务二：集成状态管理

```
难度: ⭐☆☆☆☆ (非常简单)
时间: 15-20 分钟
依赖: Drawer 组件
状态: ✅ 立即可做
```

### 任务三：导出 ViewState（关键）

```
难度: ⭐⭐☆☆☆ (简单)
时间: 30-40 分钟
依赖: React Context API
状态: ✅ 立即可做
推荐方案: Context API (易维护) 或 useRef (快速)
```

### 任务四：实现轨道选择器 UI

```
难度: ⭐⭐⭐☆☆ (中等)
时间: 1-2 小时
依赖: ViewState, 轨道 API
状态: ✅ 完全可行
```

### 任务五：集成所有功能

```
难度: ⭐⭐⭐☆☆ (中等)
时间: 1-2 小时
依赖: 所有上述组件
状态: ✅ 完全可行
```

---

## ⚠️ 唯一的技术障碍

### 问题：ViewState 作用域限制

当前架构中，`viewState` 是在 `JBrowseViewer` 组件内创建的局部变量：

```typescript
// frontend/src/components/GenomeBrowser/JBrowseViewer.tsx
const state = createViewState({ ... });  // ← 只在此组件内可用

return (
  <JBrowseLinearGenomeView viewState={state} />
)
```

### 解决方案

#### 方案 A：使用 React Context（推荐）

```typescript
// 新建: src/contexts/JBrowseViewStateContext.tsx
const ViewStateContext = createContext<any>(null);

export function JBrowseViewStateProvider({ children }) {
  const state = createViewState({ ... });
  return (
    <ViewStateContext.Provider value={state}>
      <JBrowseLinearGenomeView viewState={state} />
      {children}
    </ViewStateContext.Provider>
  );
}

export function useViewState() {
  return useContext(ViewStateContext);
}
```

**优势：**

- ✅ React 标准模式
- ✅ 易于维护
- ✅ 可扩展性好
- ✅ 支持多个 consumer

#### 方案 B：使用 useRef（快速）

```typescript
export const viewStateRef = React.createRef<any>();

// 在 JBrowseViewer 中
useEffect(() => {
  viewStateRef.current = state;
}, [state]);

// 在 TrackSelector 中
const state = viewStateRef.current;
```

**优势：**

- ✅ 实现最简单
- ✅ 最少代码改动

**劣势：**

- ❌ 不是 React 标准做法
- ❌ 难以维护

---

## 🎬 推荐实现路径

### Phase 1：基础设施（1 小时）

```
1. 创建 ViewStateContext
   - 新建 src/contexts/JBrowseViewStateContext.tsx
   - 定义 ViewStateProvider 和 useViewState()

2. 更新 JBrowseViewer
   - 用 ViewStateProvider 包装
   - 暴露 viewState

3. 创建 Drawer 组件
   - 新建 src/components/ui/Drawer/Drawer.tsx
   - 支持从右侧滑出
   - 集成 ThemeContext
```

### Phase 2：轨道选择器（1-2 小时）

```
4. 创建 TrackSelector 组件
   - 新建 src/components/TrackSelector/TrackSelector.tsx
   - 使用 useViewState() 获取 viewState
   - 显示所有可用轨道的列表
   - 实现复选框切换

5. 添加搜索/过滤
   - 支持按名称搜索
   - 支持按类别过滤

6. 添加排序功能
   - 拖拽排序（可选）
   - 上/下按钮排序
```

### Phase 3：集成（30-45 分钟）

```
7. 更新 WorkspacePage
   - 添加 isTrackSelectorOpen 状态
   - 修改 Tracks 按钮点击事件
   - 集成 Drawer

8. 测试
   - 功能测试
   - 性能测试
   - 样式验证
```

---

## 📝 代码示例

### 简单的轨道切换实现

```typescript
// src/components/TrackSelector/TrackSelector.tsx
export function TrackSelector() {
  const viewState = useViewState(); // 从 Context 获取
  const view = viewState.session.views[0];
  const allTracks = viewState.config.tracks;

  // 获取当前显示的轨道 ID
  const displayedTrackIds = view.tracks.map(t =>
    t.configuration?.trackId
  );

  return (
    <div className={styles.trackSelector}>
      <h3>Available Tracks ({allTracks.length})</h3>

      <div className={styles.trackList}>
        {allTracks.map(track => (
          <label key={track.trackId}>
            <input
              type="checkbox"
              checked={displayedTrackIds.includes(track.trackId)}
              onChange={() => {
                if (displayedTrackIds.includes(track.trackId)) {
                  view.hideTrack(track.trackId);
                } else {
                  view.showTrack(track.trackId);
                }
              }}
            />
            {track.name || track.trackId}
          </label>
        ))}
      </div>
    </div>
  );
}
```

---

## 📚 关键资源

| 资源     | 位置                                   | 说明                   |
| -------- | -------------------------------------- | ---------------------- |
| 详细报告 | `JBROWSE_API_INVESTIGATION.md`         | 完整的 API 参考        |
| 调查工具 | `src/utils/jbrowseApiInvestigation.ts` | 用于深度分析的工具函数 |
| 测试页面 | `/api-investigation`                   | 动态显示 API 信息      |

---

## ✨ 总结

### 关键成果

✅ **确认所有必需的轨道控制 API 都是公开的**

- showTrack, hideTrack, toggleTrack, getTrack 都可用
- 轨道排序方法 (trackToTop, trackUp, etc.) 都可用

✅ **识别唯一的技术障碍**

- ViewState 作用域问题
- 有清晰的解决方案（Context API）

✅ **提供了完整的实现路径**

- Phase 1-3 分阶段计划
- 清晰的时间估计
- 代码示例

### 风险评估

| 风险             | 概率 | 影响 | 缓解方案                    |
| ---------------- | ---- | ---- | --------------------------- |
| 轨道更新同步延迟 | 低   | 中   | 使用 mobx-state-tree 观察者 |
| Context 性能问题 | 极低 | 低   | 使用 useMemo 优化           |
| API 版本兼容性   | 极低 | 中   | 使用公开 API（更稳定）      |

---

## 🚀 下一步建议

### 立即行动

1. ✅ 阅读 `JBROWSE_API_INVESTIGATION.md` 获取完整细节
2. 创建 ViewStateContext（30 分钟）
3. 创建 Drawer 组件（30 分钟）
4. 开始实现 TrackSelector（1-2 小时）

### 可选优化

- 添加轨道搜索/过滤
- 实现轨道拖拽排序
- 支持轨道分类显示
- 添加轨道预设

---

**调查完成时间：** 2025-10-27  
**调查深度：** TypeScript 类型定义分析 + 源代码审查  
**信心水平：** 非常高（基于公开 API 类型定义）

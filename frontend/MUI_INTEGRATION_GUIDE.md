# MUI 集成指南

## 概述

本项目采用**混合主题方案**，既保持原有的自定义主题系统，也逐步集成 Material-UI (MUI) 组件库。

## 架构

### 1. 主题系统

```
┌─────────────────────────────────┐
│  CombinedThemeProvider          │
├─────────────────────────────────┤
│  ├─ CustomThemeProvider         │  （保持原有主题系统）
│  └─ MuiThemeProvider            │  （MUI 主题提供者）
│     └─ createMuiThemeFromCustom │  （自动转换）
└─────────────────────────────────┘
```

### 2. 使用流程

#### App.tsx 中：
```tsx
import { CombinedThemeProvider } from './providers/CombinedThemeProvider'

function App() {
  return (
    <CombinedThemeProvider>
      {/* 应用内容 */}
    </CombinedThemeProvider>
  )
}
```

## 已迁移的组件

### 1. GlobalNavbarMUI
**位置**: `src/components/layout/GlobalNavbar/GlobalNavbarMUI.tsx`

**使用示例**:
```tsx
import { GlobalNavbarMUI } from './components'

export default function App() {
  return (
    <>
      <GlobalNavbarMUI />
      {/* 其他内容 */}
    </>
  )
}
```

**特点**:
- 使用 MUI 的 AppBar 和 Toolbar
- 自动响应主题变化
- 保持与原导航栏相同的功能

### 2. FileInputMUI
**位置**: `src/components/ui/FileInput/FileInputMUI.tsx`

**使用示例**:
```tsx
import { FileInputMUI } from './components/ui/FileInput'
import { useState } from 'react'

export function MyComponent() {
  const [url, setUrl] = useState('')

  return (
    <FileInputMUI
      value={url}
      onChange={setUrl}
      label="Select Data Source"
      placeholder="Enter URL or select file..."
      accept=".bam,.vcf,.bed"
      description="Supported formats: BAM, VCF, BED"
    />
  )
}
```

**特点**:
- URL 和 File 两种模式
- 集成 i18n 支持
- 自动适配主题

## 添加新的 MUI 组件

### 步骤

1. **导入 MUI 组件**
```tsx
import { Button, Dialog, TextField } from '@mui/material'
import SomeIcon from '@mui/icons-material/SomeIcon'
```

2. **使用主题**
```tsx
import { useTheme } from '../contexts/ThemeContext'

export function MyComponent() {
  const { theme } = useTheme()
  
  return (
    <div style={{ color: theme.colors.text }}>
      {/* 内容 */}
    </div>
  )
}
```

3. **将样式属性转换为 MUI sx prop**
```tsx
// 之前（inline style）
<div style={{
  padding: theme.spacing.md,
  backgroundColor: theme.colors.surface,
  borderRadius: '8px',
}}>

// 现在（MUI sx）
<Box sx={{
  padding: theme.spacing.md,
  backgroundColor: theme.colors.surface,
  borderRadius: '8px',
}}>
```

## 主题转换规则

自定义主题自动转换为 MUI 主题的规则：

| 自定义主题 | MUI 主题 |
|----------|---------|
| `colors.primary` | `palette.primary.main` |
| `colors.background` | `palette.background.default` |
| `colors.surface` | `palette.background.paper` |
| `colors.text` | `palette.text.primary` |
| `colors.secondaryText` | `palette.text.secondary` |
| `fontSizes.*` | `typography.*` |
| `spacing.*` | `spacing()` 函数 |

## 常用 MUI 组件

### 布局
- `Box` - 基础容器
- `Container` - 限制宽度容器
- `Stack` - 弹性布局（替代 flexbox）
- `Grid` - 网格布局

### 输入
- `TextField` - 文本输入
- `Button` - 按钮
- `Select` - 下拉选择
- `Checkbox`, `Radio` - 复选框和单选框
- `Switch` - 开关

### 反馈
- `Alert` - 警告提示
- `Dialog` - 弹窗
- `Snackbar` - 消息提示
- `LinearProgress`, `CircularProgress` - 进度条

### 显示
- `Table` - 表格
- `Card` - 卡片
- `Chip` - 标签
- `Avatar` - 头像

## 与 JBrowse 的兼容性

MUI 主题已配置以与 JBrowse 组件兼容：
- 颜色调色板同步
- 字体系列一致
- 组件样式不冲突

## 常见问题

### Q: 为什么需要两个主题系统？
A: 这是渐进式迁移的策略，可以逐步替换组件而不必一次性重构整个应用。

### Q: 可以同时使用自定义组件和 MUI 组件吗？
A: 完全可以，这正是混合方案的优点。

### Q: 如何处理新的样式需求？
A: 优先使用 MUI 的 sx prop，如果 MUI 组件不满足需求，再使用 inline styles 或 CSS modules。

## 下一步计划

- [ ] 将 ModelConfiguration 迁移到 MUI
- [ ] 创建 MUI 版本的通用 Button 组件
- [ ] 将 Dialog/Modal 迁移到 MUI Dialog
- [ ] 创建 MUI 主题定制指南
- [ ] 完整迁移到 MUI（方案 A）

## 参考资源

- [MUI 官方文档](https://mui.com/material-ui/getting-started/)
- [MUI 组件库](https://mui.com/material-ui/all-components/)
- [MUI sx prop 用法](https://mui.com/system/the-sx-prop/)
- [JBrowse 官方文档](https://jbrowse.org/jb2/)

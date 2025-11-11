# 方案 B 集成验证清单

## 前置条件检查

- [ ] **依赖已安装**
  - [ ] `@mui/material` 已添加到 package.json
  - [ ] `@mui/icons-material` 已添加
  - [ ] `@emotion/react` 已添加
  - [ ] `@emotion/styled` 已添加
  - [ ] 运行了 `npm install --legacy-peer-deps`

## 文件结构检查

- [ ] **新增文件存在**
  - [ ] `src/config/muiTheme.ts`
  - [ ] `src/providers/CombinedThemeProvider.tsx`
  - [ ] `src/components/layout/GlobalNavbar/GlobalNavbarMUI.tsx`
  - [ ] `src/components/ui/FileInput/FileInputMUI.tsx`
  - [ ] `MUI_INTEGRATION_GUIDE.md`
  - [ ] `MIGRATION_SUMMARY.md`

- [ ] **文件已修改**
  - [ ] `src/App.tsx` - 使用 CombinedThemeProvider 和 GlobalNavbarMUI
  - [ ] `src/components/layout/GlobalNavbar/index.ts` - 导出 GlobalNavbarMUI
  - [ ] `src/components/ui/FileInput/index.ts` - 导出 FileInputMUI
  - [ ] `src/components/index.ts` - 更新导出

## 编译检查

- [ ] **TypeScript 编译通过**
  ```bash
  cd frontend
  npm run build
  ```

- [ ] **ESLint 检查通过**
  ```bash
  npm run lint
  ```

## 运行时检查

- [ ] **应用启动成功**
  ```bash
  npm run dev
  ```

- [ ] **页面加载正常**
  - [ ] 导航栏显示正确
  - [ ] 样式应用正确
  - [ ] 没有控制台错误

- [ ] **导航栏功能**
  - [ ] 链接可点击
  - [ ] 活跃状态显示正确
  - [ ] 响应式设计工作

- [ ] **主题切换**
  - [ ] 深色/浅色主题切换正常
  - [ ] MUI 组件随主题变化

## 与 JBrowse 集成检查

- [ ] **没有样式冲突**
  - [ ] JBrowse 组件显示正确
  - [ ] MUI 样式没有冲突
  - [ ] 颜色匹配

- [ ] **功能完整**
  - [ ] 基因组浏览器正常工作
  - [ ] 所有轨道显示正确
  - [ ] 交互功能正常

## 浏览器兼容性检查

- [ ] **Chrome/Edge 最新版**
- [ ] **Firefox 最新版**
- [ ] **Safari 最新版**

## 性能检查

- [ ] **页面加载速度** < 3 秒
- [ ] **无内存泄漏** （DevTools 检查）
- [ ] **响应正常** （无卡顿）

## 代码质量检查

- [ ] **没有 TypeScript 错误**
- [ ] **没有 ESLint 警告** （关键的）
- [ ] **命名规范一致**
- [ ] **注释完整清晰**

## 文档检查

- [ ] **MUI_INTEGRATION_GUIDE.md 准确**
- [ ] **MIGRATION_SUMMARY.md 完整**
- [ ] **代码注释充分**

## 测试用例

### 导航栏测试
```tsx
// 验证导航栏工作
import { GlobalNavbarMUI } from './components'

// 在应用中使用
// 检查：
// 1. 所有链接可见
// 2. 点击时路由更新
// 3. 活跃链接高亮
// 4. 响应式工作
```

### FileInput 测试
```tsx
// 验证文件输入工作
import { FileInputMUI } from './components/ui/FileInput'
import { useState } from 'react'

export function TestComponent() {
  const [value, setValue] = useState('')
  
  return (
    <FileInputMUI
      value={value}
      onChange={setValue}
      label="Test Input"
    />
  )
}
// 检查：
// 1. URL 模式工作
// 2. 文件选择工作
// 3. 值正确传递
// 4. i18n 显示正确
```

### 主题测试
```tsx
// 验证主题同步
import { useTheme } from './contexts/ThemeContext'
import { Box } from '@mui/material'

export function ThemeTest() {
  const { theme, isDark, toggleTheme } = useTheme()
  
  return (
    <Box sx={{ backgroundColor: theme.colors.background }}>
      <button onClick={toggleTheme}>
        切换主题 {isDark ? '(深色)' : '(浅色)'}
      </button>
    </Box>
  )
}
// 检查：
// 1. 主题切换正常
// 2. MUI 组件颜色随之变化
// 3. 自定义样式也更新
```

## 通过标准

✅ 所有检查项通过
✅ 无 TypeScript 错误
✅ 无关键 ESLint 警告
✅ 应用正常运行
✅ 与 JBrowse 兼容
✅ 文档完整

## 后续步骤

- [ ] 可以继续迁移其他组件（按 MUI_INTEGRATION_GUIDE.md）
- [ ] 考虑完全迁移到方案 A（如有需要）
- [ ] 收集用户反馈
- [ ] 优化性能

# CreateAnalysisModal 实现总结

## 📋 项目概述

已成功将旧的**三步骤向导流程** (`SetupWizard`) 重构为**统一的单页面配置模态框** (`CreateAnalysisModal`)，参考 JBrowse 2 的设计理念。

---

## ✅ 完成的工作

### 1. **目录结构创建** ✨

```
frontend/src/components/
├── SessionSetup/                           # 新建
│   ├── CreateAnalysisModal/                # 新建
│   │   ├── CreateAnalysisModal.tsx         # 主组件
│   │   ├── CreateAnalysisModal.module.css  # 样式
│   │   └── index.ts                        # 导出
│   └── index.ts                            # 导出
```

### 2. **CreateAnalysisModal 组件** 🎨

#### **UI 结构（4 个主要区块）：**

**Part A: 核心设置**

- 📝 会话名称输入框 (Session Name)
- 🧬 参考基因组下拉选择
  - Human (hg38)
  - Human (hg19)
  - Mouse (mm10)
  - Rat (rn6)
  - ✨ **+ Add Custom Genome...** (条件渲染下一区块)

**Part B: 自定义基因组表单** (条件渲染)

- 只在选择 "Add Custom Genome" 时显示
- 组件：
  - Assembly Name \* (必填)
  - Assembly Display Name (可选)
  - Adapter Type (下拉：IndexedFastaAdapter, TwoBitAdapter, BgzipFastaAdapter)
  - Sequence File \* (必填，支持本地文件/URL)
  - Index File (.fai)
  - 🔧 **Advanced Options** (可折叠)
    - Reference Name Aliases
    - Cytobands

**Part C: 数据轨道** (动态列表)

- "+ Add Track" 按钮
- 轨道卡片（每个包含）：
  - Track Name
  - Track Type (Variant, Alignments, Quantitative, Annotation)
  - Track Source (本地文件/URL)
  - Remove 按钮

**Part D: 页脚**

- Cancel 按钮 (取消操作)
- Create Session 按钮 (提交，验证表单)

---

### 3. **国际化支持** 🌍

更新 `frontend/public/locales/en/translation.json`：

```json
{
  "createAnalysis": {
    "title": "Create New Analysis",
    "sessionNameLabel": "Session Name",
    "referenceGenomeLabel": "Reference Genome",
    "addCustomGenome": "+ Add Custom Genome...",
    "customGenomeForm": "Custom Genome Configuration",
    "assemblyName": "Assembly Name",
    "adapterType": "Adapter Type",
    "sequenceFile": "Sequence File",
    "indexFile": "Index File (.fai)",
    "advancedOptions": "Advanced Options",
    "dataTracksLabel": "Data Tracks",
    "addTrack": "+ Add Track",
    "trackName": "Track Name",
    "trackType": "Track Type",
    "trackSource": "Track Source",
    "removeTrack": "Remove",
    "cancel": "Cancel",
    "createSession": "Create Session"
    // ... 更多文本
  }
}
```

---

### 4. **样式设计** 🎨

- ✅ 使用 CSS Modules (`CreateAnalysisModal.module.css`)
- ✅ 所有样式值从 `useTheme()` 获取（无硬编码颜色/间距）
- ✅ 响应式布局（宽度 600px，最大 90vw）
- ✅ 条件渲染的折叠菜单
- ✅ 动态轨道卡片样式

---

### 5. **状态管理** 🔄

使用单一 `FormState` 对象：

```typescript
interface FormState {
  sessionName: string;
  referenceGenome: string;
  customGenome?: {
    /* 自定义基因组配置 */
  };
  tracks: Array<{
    /* 轨道列表 */
  }>;
}
```

**核心方法：**

- `handleInputChange()` - 更新核心字段
- `handleCustomGenomeChange()` - 更新自定义基因组字段
- `handleAddTrack()` - 添加新轨道
- `handleRemoveTrack()` - 删除轨道
- `handleTrackChange()` - 更新轨道属性
- `handleSubmit()` - 表单提交

---

### 6. **表单验证** ✔️

- ✅ "Create Session" 按钮**仅在会话名称非空时启用**
- ✅ 视觉反馈：禁用时按钮变灰

---

### 7. **集成到 DashboardPage** 🔗

**更新内容：**

- ❌ 删除：`import SetupWizard`
- ✅ 添加：`import { CreateAnalysisModal } from '../components/SessionSetup'`
- ✅ 替换：条件渲染组件使用 `isOpen` 属性

---

## 📦 文件清单

| 文件                             | 状态      | 说明                |
| -------------------------------- | --------- | ------------------- |
| `CreateAnalysisModal.tsx`        | ✅ 新建   | 主组件（265 行）    |
| `CreateAnalysisModal.module.css` | ✅ 新建   | 样式模块（~150 行） |
| `SessionSetup/index.ts`          | ✅ 新建   | 导出                |
| `CreateAnalysisModal/index.ts`   | ✅ 新建   | 组件导出            |
| `translation.json`               | ✅ 更新   | 添加 i18n 键值      |
| `DashboardPage.tsx`              | ✅ 更新   | 导入新组件          |
| `SetupWizard.tsx`                | ❌ 已删除 | 旧向导组件          |

---

## 🎯 当前状态

### 完成项 ✅

- [x] UI 设计（静态布局）
- [x] CSS 样式（使用 Theme）
- [x] i18n 集成
- [x] 状态管理框架
- [x] 条件渲染逻辑
- [x] 动态轨道列表
- [x] 表单验证基础

### 待实现项 ⏳

- [ ] 数据转换逻辑 → JBrowse 配置对象
- [ ] 文件上传功能
- [ ] URL 验证
- [ ] 高级选项的完整功能
- [ ] 错误处理和用户提示

---

## 🚀 使用方式

```tsx
import { CreateAnalysisModal } from "../components/SessionSetup";

// 在页面中使用
<CreateAnalysisModal
  isOpen={showWizard}
  onClose={() => setShowWizard(false)}
  onSubmit={(config) => {
    // config 是表单状态对象
    console.log(config);
  }}
/>;
```

---

## 💡 关键特性

1. **单页面设计**：所有配置在一个模态框完成
2. **条件渲染**：自定义基因组表单和高级选项按需显示
3. **动态列表**：轨道可动态添加/删除
4. **主题集成**：100% 使用 Theme 变量
5. **i18n 就绪**：所有文本都可国际化
6. **模块化**：易于扩展和维护

---

## 📝 下一步行动

1. **测试 UI**：在浏览器中验证视觉效果
2. **实现数据转换**：创建 `transformToJBrowseConfig()` 方法
3. **添加文件处理**：实现文件选择和 URL 验证
4. **错误提示**：添加表单验证反馈和错误消息
5. **中文本地化**：完成翻译（后续）

---

## 🔗 相关文件

- 主题配置：`src/contexts/ThemeContext.tsx`
- 国际化：`src/config/i18n.ts`
- 仪表板：`src/pages/DashboardPage.tsx`
- 样式规范：`src/components/SessionSetup/CreateAnalysisModal/CreateAnalysisModal.module.css`

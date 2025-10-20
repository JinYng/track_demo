
### **精炼版开发策略：复用与封装**

1.  **侦察与识别 (Investigate & Identify)**: 我们需要像“考古”一样，在 JBrowse 2 的代码库中找到那些可供我们复用的核心组件。它们很可能是一些名为 `AddTrackWidget`, `AddAssemblyWidget`, `TrackSelector` 之类的 React 组件。
2.  **创建自定义封装器 (Create Custom Wrappers)**: 我们不会直接在我们的向导中使用这些 JBrowse 组件。相反，我们会创建自己的中间组件，例如 `src/components/wizards/JBrowseTrackSelector.tsx`。这个组件内部会导入并渲染 JBrowse 的 `AddTrackWidget`，但它的作用是“隔离墙”和“化妆师”。
3.  **UI/UX 改造 (Restyle & Adapt)**: 在我们的封装器组件中，我们将集中处理样式的覆盖。利用我们强大的主题系统和 CSS-in-JS (或 CSS Modules)，我们可以精准地覆盖 JBrowse 组件的默认样式，使其无缝融入我们应用的极简设计风格。
4.  **集成到工作流 (Integrate into the Wizard)**: 最后，我们将这些经过“改装”的、功能强大的组件，嵌入到我们的 `SetupWizard.tsx` 的不同步骤中。

---

### **【修订版开发任务书】“创建新分析”向导 (SetupWizard.tsx)**

**致：AI 前端开发者**

**项目**: GenoVerse AI “创建新分析”向导的功能实现

**核心策略变更**: 我们将放弃从零构建表单，转而复用 JBrowse 2 内置的功能组件，并对其进行 UI 定制，以大幅提升开发效率和功能健壮性。

**指令**:

#### **任务一：实现一个基于 JBrowse 组件的“添加数据”步骤**

1.  **侦察 JBrowse 组件**:
    *   请研究 `@jbrowse/core` 和其他 JBrowse 插件包，找到用于“添加新轨道”（Add New Track）的核心 React 组件。这个组件应该支持从本地文件和 URL 添加数据。它可能被称为 `AddTrackWidget` 或类似名称。

2.  **创建封装器组件**:
    *   创建一个新的 TSX 组件：`src/components/wizards/AddTrackStep.tsx`。
    *   在这个组件内部，导入并渲染你找到的 JBrowse `AddTrackWidget`。

3.  **UI 定制与样式覆盖**:
    *   **关键任务**: 使用我们的 `ThemeContext` 和样式化方法，**全面覆盖** `AddTrackWidget` 的默认 UI，使其与我们应用的整体设计（如截图所示的模态框和按钮风格）保持一致。
    *   你可能需要检查 JBrowse 组件渲染出的 HTML 结构，并编写针对性的 CSS 选择器来覆盖其样式。移除或隐藏我们不需要的 UI 元素。

4.  **状态管理**:
    *   `AddTrackStep` 组件需要能够捕获用户通过 `AddTrackWidget` 成功添加的轨道配置（这通常是一个 JSON 对象）。
    *   组件需要提供一个回调函数（例如 `onTracksChange`），将用户添加的轨道配置数组传递给父组件 `SetupWizard`。

#### **任务二：重构 `SetupWizard.tsx` 以集成新组件**

1.  **修改步骤**:
    *   请修改 `SetupWizard` 的步骤流程。例如，“步骤 2: 加载数据” 的内容区域，现在应该直接渲染我们新创建的 `<AddTrackStep />` 组件。
    *   “步骤 1: 基础设置” 仍然可以保留我们之前设计的简单表单（用于选择基因组和命名会话），因为这部分的逻辑相对简单。

2.  **管理向导状态**:
    *   `SetupWizard` 作为父组件，需要管理整个配置过程的状态。它需要：
        *   从步骤 1 获取 `assembly` 配置。
        *   从步骤 2 (`<AddTrackStep />`) 获取 `tracks` 配置数组。
        *   从步骤 3 获取 `initialLocation`。

3.  **完成与数据传递**:
    *   当用户在最后一步点击“Create”按钮时，`SetupWizard` 需要将收集到的完整配置（`assembly`, `tracks`, `initialLocation` 等）传递给 `WorkspacePage`。

---

**最终验收标准**:

1.  “创建新分析”向导的第二步，展示的是一个经过我们 UI 美化的、功能强大的 JBrowse “添加轨道”界面。
2.  用户可以通过这个界面成功地从 URL 或本地文件添加轨道，并且这些轨道的配置被正确捕获。
3.  当向导完成后，工作区页面能够接收到这些配置，并**在未来**（下一步任务）用这些配置来动态初始化 `JBrowseViewer`。



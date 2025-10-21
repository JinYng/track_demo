
### **【开发任务书】GenoVerse AI 前端改造计划 - 第一阶段**

**致：AI 前端开发者**

**项目**: GenoVerse AI 前端改造

**目标**: 我们需要对现有的 React 项目进行一次全面的 UI/UX 升级，将其从一个单页工具，改造成一个拥有清晰工作流、专业设计系统的多页面应用。请遵循以下高级别指令来完成开发。

---

#### **任务一：搭建项目的基础架构**

**指令**:

1.  **引入页面路由**:
    *   请为我们的 React 应用集成 `react-router-dom` 库。
    *   建立一个基础的页面路由结构。我们需要三个主要的页面组件，请先创建它们的骨架文件：
        *   `src/pages/DashboardPage.tsx` (路径: `/`)
        *   `src/pages/WorkspacePage.tsx` (路径: `/workspace/:sessionId`)
        *   `src/components/SetupWizard.tsx` (这是一个模态框组件，暂时无需路由)

2.  **建立设计与主题系统**:
    *   创建一个 `src/theme.ts` 文件。在该文件中，请设计并导出一个 `lightTheme` 和一个 `darkTheme` 对象。每个对象都需要包含以下结构：
        *   `colors`: (包含 background, surface, primary, text, secondaryText, border 等颜色)
        *   `fonts`, `fontSizes`, `fontWeights`, `spacing` 等基础设计规范。
    *   创建一个 `src/contexts/ThemeContext.jsx` 文件。请在其中实现一个 `ThemeProvider`，它需要具备以下功能：
        *   管理当前的主题状态（`light` 或 `dark`）。
        *   向下层组件提供当前的主题配置对象。
        *   提供一个 `toggleTheme` 函数来切换主题。

3.  **建立国际化 (i18n) 框架**:
    *   请集成 `react-i18next` 库。
    *   创建一个 `src/i18n.ts` 配置文件，并配置它以从 `public/locales/{lng}/translation.json` 路径加载翻译文件。
    *   创建一个基础的英语翻译文件 `public/locales/en/translation.json`，并为接下来的页面设计添加一些占位键值对。

4.  **全局应用配置**:
    *   最后，请修改应用的入口文件（可能是 `App.tsx` 或 `main.tsx`），使用你创建的 `ThemeProvider` 和 i18n Provider 来包裹整个应用。

**验收标准**:
*   项目能够正常运行，并且可以通过 URL 访问 `/` 和 `/workspace/test` 路径，分别显示对应的页面骨架。
*   应用顶层已经集成了主题和 i18n 的 Provider。

---

#### **任务二：设计并实现欢迎页 (DashboardPage)**

**指令**:

现在，请专注于 `DashboardPage.tsx` 组件的开发。

1.  **页面布局**:
    *   请设计一个简洁、居中的布局。
2.  **核心内容**:
    *   **主标题和副标题**: 内容应来自 i18n 文件（例如 `t('dashboard.title')`）。
    *   **主操作按钮**: 一个醒目的 "Start New Analysis" 按钮。点击此按钮后，应**打开 `SetupWizard` 模态框**。
    *   **最近会话区**:
        *   标题为 "Recent Sessions"。
        *   下方应设计一个卡片网格，用于显示用户的历史会话。
        *   请先用一些**静态的假数据**来填充这个区域，每个卡片应显示会话名称、基因组信息和上次打开时间。
        *   每个卡片上需要有一个 "Open" 按钮和一个 "More" (...) 菜单。
3.  **样式**:
    *   **请严格使用我们之前创建的 `ThemeContext` 来为所有元素应用样式**。不要使用独立的 CSS 文件或内联的硬编码颜色/字体。所有样式值（颜色、间距、字体大小）都应来自 `themeConfig` 对象。

**验收标准**:
*   欢迎页的视觉风格符合极简主义、内容优先的设计哲学。
*   页面上的所有文本都已国际化。
*   所有样式都通过主题系统动态应用。
*   点击 "Start New Analysis" 按钮可以正常触发 `SetupWizard` 模态框的显示。

---


在进入更复杂的动态功能开发之前，我们必须将已经讨论和确定的所有设计规则和准则进行一次**正式的、清晰的汇总**。

这份文档将成为我们项目的**“设计圣经”**和**“开发宪法”**。它将确保我们（以及 AI 开发者）在后续的每一次代码提交中，都能保持风格的统一、体验的一致和架构的健壮。

---

### **GenoVerse AI: 前端设计与开发准则 (V1.0)**

#### **第一部分：核心设计哲学 (Core Design Philosophy)**

1.  **极简主义 (Minimalism)**: 我们的设计灵感源自 **Google AI Studio**。界面应干净、开阔，避免任何不必要的装饰性元素。
2.  **内容优先 (Content-First)**: 设计的唯一目的是**突出内容**（基因组数据、AI 对话），而不是 UI 元素本身。
3.  **功能驱动 (Function-Driven)**: 每一个 UI 元素的存在都必须有明确的功能目的。**排版即是界面**，我们依赖强大的字体、间距和色彩来引导用户，而非图标。
4.  **专业与聚焦 (Professional & Focused)**: 整体感觉应是冷静、专业、值得信赖的，为科研人员创造一个可以深度聚焦的分析环境。

---

#### **第二部分：视觉设计系统 (Visual Design System)**

1.  **色彩 (Color Palette)**:
    *   **浅色主题 (Light Theme)**:
        *   `background`: `#FFFFFF` (纯白)
        *   `surface`: `#F8F9FA` (卡片等表面)
        *   `primary`: `#1A73E8` (Google 蓝，用于所有交互元素)
        *   `text`: `#202124` (主要文字)
        *   `secondaryText`: `#5F6368` (次要文字)
        *   `border`: `#E0E0E0` (边框和分割线)
    *   **深色主题 (Dark Theme)**:
        *   `background`: `#202124` (深灰)
        *   `surface`: `#303134` (卡片等表面)
        *   `primary`: `#8AB4F8` (适应深色背景的蓝色)
        *   `text`: `#E8EAED` (主要文字)
        *   `secondaryText`: `#9AA0A6` (次要文字)
        *   `border`: `#5F6368` (边框和分割线)

2.  **字体 (Typography)**:
    *   **字体族**: `Inter` 或 `Roboto` (全局使用无衬线字体)。
    *   **字阶系统**:
        *   `H1 (页面主标题)`: 32px, Bold
        *   `H2 (区域标题)`: 24px, Bold
        *   `H3 (卡片/模态框标题)`: 18px, Medium
        *   `Body (正文/按钮)`: 16px, Regular
        *   `Caption (次要信息)`: 14px, Regular

3.  **间距 (Spacing)**:
    *   **8px 网格系统**: 所有内外边距、元素间距都必须是 `8px` 的倍数 (e.g., 8, 16, 24, 32px)，确保布局的节奏感和一致性。

4.  **组件风格 (Component Style)**:
    *   **按钮 (Buttons)**:
        *   主按钮: `primary` 色背景，白色文字。
        *   次要按钮: 透明背景，`primary` 色文字，可能有细边框。
    *   **输入框 (Inputs)**: 极简风格，优先使用**底线**样式，而非四周边框。
    *   **卡片 (Cards)**: 使用极细的 `border` 或 subtle 的阴影与背景区分，内部拥有充足的 `padding` (e.g., 16px or 24px)。

5.  **图标 (Iconography)**:
    *   **原则：无图标**。尽可能用清晰的文字（如 "Save", "Settings", "Tracks"）来传达功能。唯一的例外是表示折叠/展开的 `>` 或 `+`/`-` 等极简符号。

---

#### **第三部分：页面布局与信息架构 (Layout & Information Architecture)**

1.  **三大核心视图**:
    *   **欢迎页 (Dashboard)**: 单栏居中，突出“开始新分析”的核心操作。
    *   **设置向导 (Setup Wizard)**: 必须是**模态框 (Modal)** 形式，引导用户分步完成配置，降低认知负荷（渐进式披露）。
    *   **工作区 (Workspace)**: **全屏高度的三区布局**（顶部全局导航，左侧AI面板，右侧浏览器主区域）。AI 面板必须是**可拖拽调整宽度**和**可折叠**的。

2.  **关键 UX 原则**:
    *   **清晰的上下文**: 必须时刻在顶部导航栏清晰地展示当前会话的有意义的名称和基因组信息，例如 `GenoVerse > TP53 Analysis (Human - hg38)`。
    *   **逻辑分区**: 功能按钮必须放置在最符合其上下文的位置。例如，管理轨道的 "Tracks" 按钮属于浏览器面板，而不是全局导航。

---

#### **第四部分：技术实现准则 (Technical Implementation Guidelines)**

1.  **主题化 (Theming)**:
    *   所有视觉样式（颜色、字体、间距）**必须**从统一的 `theme.ts` 文件中通过 `ThemeProvider` (Context API) 获取。
    *   **严禁**在组件中硬编码任何颜色值或像素值。
    *   JBrowse 实例的样式也必须通过其 `theme` 配置项来接收我们的主题变量，以保证视觉统一。

2.  **国际化 (i18n)**:
    *   所有面向用户的字符串（包括按钮文字、标题、提示信息）**必须**通过 `react-i18next` 的 `t()` 函数调用。
    *   **严禁**在代码中硬编码任何英文或其他语言的文本。
    *   开发阶段先以英语为主，但代码架构必须**时刻保持国际化就绪**。

3.  **文件结构 (File Structure)**:
    *   严格遵循我们最终确定的**模块化、分层**的文件结构。
    *   通用 UI 组件 (`/components/ui`) 与业务功能组件 (`/components/features` 或 `/components/[FeatureName]`) 必须严格分离。
    *   每个组件都应遵循“组件文件夹”规范 (`/ComponentName/index.ts`, `ComponentName.tsx`, `ComponentName.module.css`)。


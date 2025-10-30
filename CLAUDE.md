# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GenoVerse AI** - A bilingual (Chinese/English) AI-powered genomics analysis platform integrating JBrowse 2 genome browser with real-time AI chat capabilities.

**Architecture**: Monorepo with frontend (React + TypeScript) and backend (FastAPI + Python) in separate directories.

**Key Features**:
- Multi-session workspace management with persistent state
- Real-time AI chat interface with WebSocket communication
- Interactive genome browser (JBrowse 2) with AI-controlled navigation
- Dark/Light theme support
- Bilingual UI (Chinese/English) with i18next

## Development Commands

### Backend (FastAPI + Python)

```bash
# Activate conda environment (required)
conda activate gene

# Start backend server (recommended method)
cd backend
python start_dev.py

# Alternative: Direct uvicorn
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run WebSocket test
cd backend
python test_websocket.py
```

**Backend runs on**: `http://localhost:8000`
**API docs**: `http://localhost:8000/docs`
**WebSocket endpoint**: `ws://localhost:8000/ws`

### Frontend (React + Vite)

```bash
# Install dependencies (first time)
cd frontend
npm install

# Start dev server
cd frontend
npm run dev

# Build for production
cd frontend
npm run build

# Lint code
cd frontend
npm run lint
```

**Frontend runs on**: `http://localhost:5173`

### Root-level Commands

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Start frontend only
npm run dev:frontend

# Start backend only (requires conda environment)
npm run dev:backend

# Build frontend
npm run build:frontend

# Lint frontend
npm run lint
```

## Architecture Overview

### Application Structure

The application follows a **multi-page architecture** with 10 distinct pages:

**Core Pages**:
1. **Genomes Page** (`/`): Landing page featuring:
   - Popular species selection (Human, Mouse, Zebrafish, Fruitfly, Yeast)
   - Genome assembly search across thousands of genomes
   - Position search with assembly selector (hg38, hg19, mm10, mm9)
   - Recent sessions display with quick access
   - "Start New Analysis" button to launch setup wizard

2. **Browser Config Page** (`/browser`): Session creation page with:
   - New session form (session name, reference genome selection)
   - Recent sessions quick load (displays 3 most recent)
   - "View All Sessions" link to return to Genomes page

3. **Workspace Page** (`/browser/:sessionId`): Main analysis workspace with:
   - Split-panel layout (AI chat + genome browser)
   - Real-time AI chat interface
   - Interactive JBrowse 2 genome browser
   - Model configuration panel

**Navigation & Additional Pages**:
- **Global Navigation Bar**: Persistent across all pages with left-side navigation (Genomes, Genome Browser, Tools, 3D Genomics, Spatial-Omics, Downloads) and right-side links (Help, About)
- **Tools Page** (`/tools`): Genomics tools hub (placeholder)
- **3D Genomics Page** (`/3d-genomics`): 3D genome visualization (placeholder)
- **Spatial-Omics Page** (`/spatial-omics`): Spatial transcriptomics analysis (placeholder)
- **Downloads Page** (`/downloads`): Data and resource downloads (placeholder)
- **Help Page** (`/help`): Documentation and help resources (placeholder)
- **About Page** (`/about`): Project information and credits (placeholder)

### Core Communication Pattern

The application uses **WebSocket-based real-time bidirectional communication** between frontend and backend:

- **Frontend WebSocket Service** (`frontend/src/services/websocket.ts`): Singleton service managing WebSocket connections with automatic reconnection, message handling, and connection state management
- **Backend WebSocket Manager** (`backend/app/services/websocket_manager.py`): Manages multiple concurrent WebSocket connections
- **Message Flow**: User query → WebSocket → AI Service (LangChain) → WebSocket → Chat Interface

### State Management Architecture

**React Context-based architecture with three layers:**

1. **Theme Context** (`ThemeContext`): Global theme state (dark/light mode), theme tokens (colors, fonts, spacing)
2. **Session Context** (`SessionContext`): Workspace-level state (session config, organism, reference genome, tracks)
3. **Component State**: Local UI state in components (chat history, input values, etc.)

**Critical separation of concerns:**

1. **Application Configuration State** (`ModelConfiguration` component): API keys, base URLs, model names - stored in component state, NOT passed through chat history
2. **Chat State** (`ChatInterface` component): Pure conversation history (user/assistant messages only)
3. **Session State** (`SessionContext`): Workspace metadata (organism, genome assembly, tracks, location)

The WebSocket message format sends:
- `query`: Current user message
- `messages`: Array of `{role: 'user'|'assistant', content: string}` for chat history
- `ai_model_config`: Model configuration object (apiBaseUrl, apiKey, modelName)

**Never mix configuration with chat history** - they are separate data flows.

### Session Management

- Sessions are identified by `sessionId` (timestamp-based unique ID)
- Session configs are persisted in `sessionStorage` with key `session_{sessionId}`
- Each workspace has independent chat history and genome browser state
- Sessions can be created from:
  - `GenomesPage` (/): "Start New Analysis" button launches `CreateAnalysisModal`
  - `BrowserConfigPage` (/browser): Session creation form
- Recent sessions displayed on:
  - `GenomesPage`: Full list with detailed cards (mock data)
  - `BrowserConfigPage`: Quick access to 3 most recent sessions
- Session routing: `/browser/:sessionId` opens the workspace for that session

### Backend Service Layers

```
app/
├── main.py              # FastAPI app, CORS, WebSocket endpoint
├── api/routes.py        # RESTful API endpoints
├── core/config.py       # Application settings
├── services/
│   ├── ai_service.py          # AI query processing with LangChain
│   └── websocket_manager.py   # WebSocket connection pool
└── tools/
    └── jbrowse_tools.py       # JBrowse control toolkit (future)
```

**AI Service Flow**:
1. Receives query + model config via WebSocket
2. If API key is `"test-key"` → return instant mock response (~100ms)
3. Otherwise → create ChatOpenAI instance → invoke with system prompt → return response
4. Tool extraction/execution logic exists but not yet implemented

### Frontend Component Architecture

**Current component structure**:

```
frontend/src/
├── pages/
│   ├── GenomesPage.tsx           # Landing page (/) - species selection, session management
│   ├── BrowserConfigPage.tsx     # Session creation (/browser)
│   ├── WorkspacePage.tsx          # Main workspace (/browser/:sessionId)
│   ├── ToolsPage.tsx              # Tools hub (/tools) - placeholder
│   ├── ThreeDGenomicsPage.tsx     # 3D visualization (/3d-genomics) - placeholder
│   ├── SpatialOmicsPage.tsx       # Spatial transcriptomics (/spatial-omics) - placeholder
│   ├── DownloadsPage.tsx          # Downloads (/downloads) - placeholder
│   ├── HelpPage.tsx               # Help docs (/help) - placeholder
│   ├── AboutPage.tsx              # About (/about) - placeholder
│   └── APIInvestigationPage.tsx   # (not in router, dev/testing)
├── contexts/
│   ├── ThemeContext.tsx           # Theme provider (dark/light mode)
│   └── SessionContext.tsx         # Session state provider
├── components/
│   ├── layout/
│   │   └── GlobalNavbar/          # Persistent navigation bar across all pages
│   │       ├── GlobalNavbar.tsx
│   │       └── GlobalNavbar.css
│   ├── chat/
│   │   ├── ChatInterface/         # Main chat container, state management
│   │   ├── ChatHistory/           # Message list display
│   │   └── UserInput/             # Input box with send button
│   ├── ui/
│   │   ├── MessageBubble/         # Individual message rendering
│   │   ├── ThinkingIndicator/     # AI loading animation
│   │   ├── SplitLayout/           # Resizable split pane (horizontal)
│   │   └── FileInput/             # File upload component
│   ├── GenomeBrowser/
│   │   ├── GenomeBrowser.tsx      # JBrowse 2 integration wrapper
│   │   ├── JBrowseViewer.tsx      # JBrowse viewer component
│   │   └── BrowserControls.tsx    # Browser control panel
│   ├── ModelConfiguration/        # AI model settings panel
│   └── SessionSetup/
│       └── CreateAnalysisModal/   # Modal for creating new analysis sessions
└── config/
    ├── i18n.ts                    # i18next configuration
    └── theme.ts                   # Theme tokens (legacy, now in ThemeContext)
```

**Key components**:
- `GenomesPage`: Landing page with species selector, genome search, position finder, and recent sessions display
- `BrowserConfigPage`: Simple session creation form with recent sessions quick access
- `WorkspacePage`: Uses `SessionProvider` to wrap workspace, manages sessionStorage persistence
- `GlobalNavbar`: Persistent navigation with 8 links (Genomes, Genome Browser, Tools, 3D Genomics, Spatial-Omics, Downloads, Help, About)
- `SplitLayout`: Draggable horizontal divider for chat/browser split (10%-90% range, default 25%/75%)
- `ChatInterface`: Manages WebSocket connection, chat history, model config state
- `GenomeBrowser`: Embeds JBrowse 2 using `@jbrowse/react-linear-genome-view`
- `CreateAnalysisModal`: Multi-step modal for creating new analysis sessions (launched from GenomesPage)
- `ThemeProvider`: Wraps entire app, provides theme tokens and toggle function

### JBrowse 2 Integration

- Uses `@jbrowse/react-linear-genome-view` (v3.1.0) and `@jbrowse/react-app2` (v3.0.0)
- Configuration in `frontend/src/config.ts` (assembly, tracks, theme)
- Genome browser renders in right pane of split layout
- Future: AI will control browser via backend JBrowse tools

### Test Mode

Frontend defaults to `test-key` for instant testing without real API keys. Backend detects this and returns genomics-specific mock responses with domain knowledge (gene info, DNA analysis concepts, etc.).

## Technology Stack

**Frontend**:
- React 19 + TypeScript 5
- Vite 6 (build tool)
- JBrowse 2 for genome visualization
- Native WebSocket for real-time communication
- react-markdown for message rendering
- i18next for internationalization (Chinese/English)

**Backend**:
- FastAPI (async Python web framework)
- LangChain (AI orchestration)
- OpenAI-compatible API support
- Uvicorn (ASGI server)
- Pydantic for data validation

**Development Environment**:
- WSL2 optimizations in Vite config (polling enabled for file watching)
- Conda for Python environment management
- Node.js >= 18.0.0 required

## Important Implementation Notes

### WebSocket Message Handling

When processing WebSocket messages in backend (`app/main.py`):
- Message type `"test_connection"` triggers connection test
- Message type `"ai_query"` OR presence of `"query"` field triggers AI processing
- Always use `json.dumps()` with `.isoformat()` for datetime serialization

### Frontend WebSocket Service

The `WebSocketService` class is a singleton (`websocketService` export). Key methods:
- `connect()`: Establishes WebSocket connection
- `sendMessage(query, modelConfig, chatHistory)`: Sends structured message
- `onMessage(handler)`: Subscribe to incoming messages
- `onConnectionChange(handler)`: Subscribe to connection state

### Component Communication

- `ChatInterface` owns both model configuration and chat history state
- `ModelConfiguration` receives config/setters as props (controlled component)
- WebSocket service is imported and used directly (singleton pattern)
- No global state management library (useState + props)

### Styling Approach

- Each component has its own CSS file (e.g., `ChatInterface.css`)
- Professional, emoji-free scientific interface design
- Dark theme optimized for genomics work
- Consistent spacing and typography

## Common Development Tasks

### Adding a New Page

1. Create new page component in `frontend/src/pages/` (e.g., `NewPage.tsx`)
2. Import the page in `frontend/src/App.tsx`
3. Add route to `<Routes>` in App.tsx: `<Route path="/new-page" element={<NewPage />} />`
4. Add navigation link to `GlobalNavbar.tsx`:
   - Add to `leftNavItems` array for main navigation
   - Add to `rightNavItems` array for utility links (Help, About)
5. Use `useTheme()` hook for consistent styling
6. Follow existing page structure patterns (GenomesPage, ToolsPage as references)

### Adding a New Chat Feature

1. Modify `ChatInterface` state if needed
2. Update WebSocket message structure in `websocket.ts` if new fields required
3. Add backend message handler in `app/main.py` if new message type
4. Update AI service processing in `ai_service.py` if logic changes

### Adding a JBrowse Tool

1. Define tool in `backend/app/tools/jbrowse_tools.py`
2. Update AI system prompt in `ai_service.py` to include tool description
3. Implement tool action extraction in `_extract_tool_actions()`
4. Add execution logic in `_execute_tool_action()`

### Testing API Changes

1. Start backend: `cd backend && python start_dev.py`
2. Visit API docs: `http://localhost:8000/docs`
3. Test WebSocket: `cd backend && python test_websocket.py`
4. Use test mode in frontend with `test-key` for rapid iteration

## Project Status

- ✅ Core architecture (frontend/backend separation, WebSocket communication)
- ✅ Multi-page navigation system with GlobalNavbar
- ✅ AI chat interface with test mode
- ✅ JBrowse 2 basic integration
- ✅ Component refactoring complete (chat/, ui/, layout/ structure)
- ✅ Session management across multiple pages (Genomes, BrowserConfig, Workspace)
- 🚧 AI-controlled JBrowse tools (in progress)
- 📋 Tools, 3D Genomics, Spatial-Omics pages (placeholders, awaiting implementation)
- 📋 Advanced genomics analysis features (planned)

## Code Conventions

- TypeScript strict mode enabled
- No emojis in UI (professional scientific interface)
- Bilingual support (Chinese primary, English secondary)
- Component-scoped CSS (no global styles except index.css)
- Async/await for all async operations
- Comprehensive error handling with user-friendly messages

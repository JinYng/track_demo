import { useParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useSession, SessionProvider, defaultSessionConfig, SessionConfig } from '../contexts/SessionContext'
import { ChatInterface } from '../components/chat/ChatInterface'
import { GenomeBrowser } from '../components/GenomeBrowser'
import { SplitLayout } from '../components/ui/SplitLayout'

/**
 * WorkspacePageContent 组件
 * 实际的工作区内容，使用SessionProvider提供的上下文
 */
function WorkspacePageContent() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { theme } = useTheme()
  const { config } = useSession()

  return (
    <div
      style={{
        height: '100%',
        flex: 1,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.primary,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 顶部导航栏 */}
      <header
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md,
          }}
        >
          <div
            style={{
              fontSize: '20px',
              fontWeight: theme.fontWeights.bold,
            }}
          >
            GenoVerse
          </div>
          <span style={{ color: theme.colors.secondaryText }}>{'>'}</span>
          <span style={{ fontSize: theme.fontSizes.body }}>
            {config.name} ({config.organism} - {config.referenceGenome})
          </span>
        </div>
        <div style={{ display: 'flex', gap: theme.spacing.md }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.text,
              fontSize: theme.fontSizes.body,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.text,
              fontSize: theme.fontSizes.body,
              cursor: 'pointer',
            }}
          >
            Export
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.text,
              fontSize: theme.fontSizes.body,
              cursor: 'pointer',
            }}
          >
            Settings
          </button>
        </div>
      </header>

      {/* 主工作区：使用SplitLayout分屏 */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <SplitLayout
          defaultSplitPercentage={25}
          leftPanel={
            // 左侧: AI助手 (复用现有ChatInterface组件)
            <ChatInterface viewState={null} />
          }
          rightPanel={
            // 右侧: 基因组浏览器 (新的GenomeBrowser组件)
            <GenomeBrowser sessionId={sessionId!} />
          }
        />
      </div>
    </div>
  )
}

/**
 * WorkspacePage 组件
 * 应用工作区页面
 * 使用SessionProvider包装以提供会话上下文
 */
export default function WorkspacePage() {
  const { sessionId } = useParams<{ sessionId: string }>()

  // 从sessionStorage读取已保存的会话配置，如果没有则使用默认配置
  let initialConfig: SessionConfig = defaultSessionConfig
  if (sessionId) {
    try {
      const savedConfig = sessionStorage.getItem(`session_${sessionId}`)
      if (savedConfig) {
        initialConfig = {
          ...JSON.parse(savedConfig),
          sessionId: sessionId,
        }
      } else {
        // 如果没有保存的配置，使用默认值但设置sessionId
        initialConfig = {
          ...defaultSessionConfig,
          sessionId: sessionId,
          name: `Session ${sessionId}`,
        }
      }
    } catch (error) {
      console.error('Failed to load session config:', error)
      // 如果解析失败，使用默认配置
      initialConfig = {
        ...defaultSessionConfig,
        sessionId: sessionId || 'default',
      }
    }
  }

  return (
    <SessionProvider initialConfig={initialConfig}>
      <WorkspacePageContent />
    </SessionProvider>
  )
}

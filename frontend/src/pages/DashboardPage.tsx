import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import SetupWizard from '../components/wizards/SetupWizard'

interface Session {
  id: string
  name: string
  organism: string
  genome: string
  lastOpen: string
}

// 模拟数据
const mockSessions: Session[] = [
  {
    id: '1',
    name: 'Patient A WES Variant Screening',
    organism: 'Human',
    genome: 'hg38',
    lastOpen: '2 hours ago',
  },
  {
    id: '2',
    name: 'TP53 Region Analysis',
    organism: 'Human',
    genome: 'hg38',
    lastOpen: '1 day ago',
  },
  {
    id: '3',
    name: 'Mouse Knockout Study',
    organism: 'Mouse',
    genome: 'mm10',
    lastOpen: '3 days ago',
  },
]

export default function DashboardPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [showWizard, setShowWizard] = useState(false)

  const handleOpenSession = (sessionId: string) => {
    navigate(`/workspace/${sessionId}`)
  }

  const handleCreateSession = (_sessionData: any) => {
    // 这里会创建新的会话并导航到工作区
    const newSessionId = Date.now().toString()
    navigate(`/workspace/${newSessionId}`)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: theme.fonts.primary,
      }}
    >
      {/* 顶部导航 */}
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
            fontSize: '20px',
            fontWeight: theme.fontWeights.bold,
          }}
        >
          GenoVerse
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
            {t('dashboard.help')}
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
            {t('dashboard.about')}
          </button>
        </div>
      </header>

      {/* 主要内容 */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: theme.spacing.xxl,
        }}
      >
        {/* 欢迎区域 */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: theme.spacing.xxl,
          }}
        >
          <h1
            style={{
              fontSize: theme.fontSizes.h1,
              fontWeight: theme.fontWeights.bold,
              margin: `0 0 ${theme.spacing.sm} 0`,
            }}
          >
            {t('dashboard.title')}
          </h1>
          <p
            style={{
              fontSize: theme.fontSizes.body,
              color: theme.colors.secondaryText,
              margin: `0 0 ${theme.spacing.lg} 0`,
            }}
          >
            {t('dashboard.subtitle')}
          </p>
          <button
            onClick={() => setShowWizard(true)}
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              fontSize: theme.fontSizes.body,
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: theme.fontWeights.medium,
            }}
          >
            {t('dashboard.startAnalysis')}
          </button>
        </div>

        {/* 分割线 */}
        <div
          style={{
            height: '1px',
            backgroundColor: theme.colors.border,
            margin: `${theme.spacing.xxl} 0`,
          }}
        />

        {/* 最近会话 */}
        <section>
          <h2
            style={{
              fontSize: theme.fontSizes.h2,
              fontWeight: theme.fontWeights.bold,
              margin: `0 0 ${theme.spacing.lg} 0`,
            }}
          >
            {t('dashboard.recentSessions')}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.lg,
            }}
          >
            {mockSessions.map(session => (
              <div
                key={session.id}
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '4px',
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background,
                }}
              >
                <h3
                  style={{
                    fontSize: theme.fontSizes.h3,
                    fontWeight: theme.fontWeights.medium,
                    margin: `0 0 ${theme.spacing.xs} 0`,
                  }}
                >
                  {session.name}
                </h3>
                <p
                  style={{
                    fontSize: theme.fontSizes.caption,
                    color: theme.colors.secondaryText,
                    margin: `0 0 ${theme.spacing.xs} 0`,
                  }}
                >
                  {session.organism} - {session.genome}
                </p>
                <p
                  style={{
                    fontSize: theme.fontSizes.caption,
                    color: theme.colors.secondaryText,
                    margin: `0 0 ${theme.spacing.sm} 0`,
                  }}
                >
                  Last open: {session.lastOpen}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <button
                    onClick={() => handleOpenSession(session.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.colors.primary,
                      fontSize: theme.fontSizes.body,
                      cursor: 'pointer',
                    }}
                  >
                    {t('session.open')}
                  </button>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.colors.secondaryText,
                      fontSize: theme.fontSizes.body,
                      cursor: 'pointer',
                    }}
                  >
                    ...
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.primary,
              fontSize: theme.fontSizes.body,
              cursor: 'pointer',
            }}
          >
            {t('dashboard.importSession')}
          </button>
        </section>

        {/* 页脚 */}
        <footer
          style={{
            textAlign: 'center',
            marginTop: theme.spacing.xxl,
            fontSize: theme.fontSizes.caption,
            color: theme.colors.secondaryText,
          }}
        >
          © 2025 GenoVerse AI
        </footer>
      </main>

      {/* 设置向导模态框 */}
      {showWizard && (
        <SetupWizard
          onClose={() => setShowWizard(false)}
          onComplete={handleCreateSession}
        />
      )}
    </div>
  )
}

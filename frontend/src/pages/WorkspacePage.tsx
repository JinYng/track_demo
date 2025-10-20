import { useParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function WorkspacePage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { theme } = useTheme()

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
            Session {sessionId} (Human - hg38)
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

      {/* 主要工作区 */}
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* AI 助手面板 */}
        <div
          style={{
            width: '400px',
            borderRight: `1px solid ${theme.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* AI 助手标题 */}
          <div
            style={{
              padding: theme.spacing.md,
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <h3
              style={{
                fontSize: theme.fontSizes.h3,
                fontWeight: theme.fontWeights.bold,
                margin: 0,
              }}
            >
              AI Assistant
            </h3>
          </div>

          {/* 聊天区域 */}
          <div
            style={{
              flex: 1,
              padding: theme.spacing.md,
              overflowY: 'auto',
            }}
          >
            <div style={{ marginBottom: theme.spacing.md }}>
              <div
                style={{
                  textAlign: 'right',
                  marginBottom: theme.spacing.sm,
                }}
              >
                <span
                  style={{
                    fontSize: theme.fontSizes.body,
                    color: theme.colors.text,
                  }}
                >
                  User: Show me TP53 gene.
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: theme.fontSizes.body,
                    color: theme.colors.text,
                  }}
                >
                  AI: Navigating. I have highlighted all pathogenic variants
                  from ClinVar in the{' '}
                  <span
                    style={{
                      backgroundColor: '#E8F0FE',
                      color: theme.colors.primary,
                      padding: '2px 6px',
                      borderRadius: '12px',
                      fontSize: theme.fontSizes.caption,
                    }}
                  >
                    TP53
                  </span>{' '}
                  region.
                </span>
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          <div
            style={{
              padding: theme.spacing.md,
              borderTop: `1px solid ${theme.colors.border}`,
            }}
          >
            <div style={{ display: 'flex', gap: theme.spacing.sm }}>
              <input
                type="text"
                placeholder="Ask AI anything..."
                style={{
                  flex: 1,
                  padding: theme.spacing.sm,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '4px',
                  fontSize: theme.fontSizes.body,
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                }}
              />
              <button
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  border: 'none',
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: theme.fontSizes.body,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* 基因组浏览器区域 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 浏览器控制栏 */}
          <div
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
                gap: theme.spacing.sm,
              }}
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: theme.fontSizes.body,
                  cursor: 'pointer',
                  color: theme.colors.text,
                }}
              >
                {'<'}
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: theme.fontSizes.body,
                  cursor: 'pointer',
                  color: theme.colors.text,
                }}
              >
                {'>'}
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: theme.fontSizes.body,
                  cursor: 'pointer',
                  color: theme.colors.text,
                }}
              >
                +
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: theme.fontSizes.body,
                  cursor: 'pointer',
                  color: theme.colors.text,
                }}
              >
                -
              </button>
              <span
                style={{
                  fontSize: theme.fontSizes.body,
                  color: theme.colors.text,
                  marginLeft: theme.spacing.md,
                }}
              >
                chr17:7,661,779-7,687,550
              </span>
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
              Tracks
            </button>
          </div>

          {/* JBrowse 视图区域 */}
          <div
            style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: theme.fontSizes.h3,
                color: theme.colors.secondaryText,
              }}
            >
              JBrowse Genome Browser
              <br />
              <span style={{ fontSize: theme.fontSizes.body }}>
                (Integration in progress)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

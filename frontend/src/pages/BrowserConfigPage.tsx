import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

interface Session {
    id: string
    name: string
    organism: string
    genome: string
    lastOpen: string
}

// 模拟最近会话数据（取前3个）
const recentSessions: Session[] = [
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

export default function BrowserConfigPage() {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [sessionName, setSessionName] = useState('')
    const [referenceGenome, setReferenceGenome] = useState('hg38')

    const handleCreateSession = (e: React.FormEvent) => {
        e.preventDefault()
        const newSessionId = Date.now().toString()
        navigate(`/browser/${newSessionId}`)
    }

    const handleOpenSession = (sessionId: string) => {
        navigate(`/browser/${sessionId}`)
    }

    return (
        <div
            style={{
                minHeight: 'calc(100vh - 64px)',
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.fonts.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing.lg,
            }}
        >
            <div
                style={{
                    maxWidth: '600px',
                    width: '100%',
                }}
            >
                {/* 标题 */}
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
                        Welcome to Genome Browser
                    </h1>
                </div>

                {/* 新建会话表单 */}
                <div
                    style={{
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        padding: theme.spacing.lg,
                        backgroundColor: theme.colors.surface,
                        marginBottom: theme.spacing.lg,
                    }}
                >
                    <h2
                        style={{
                            fontSize: theme.fontSizes.h3,
                            fontWeight: theme.fontWeights.medium,
                            margin: `0 0 ${theme.spacing.md} 0`,
                        }}
                    >
                        Start New Session
                    </h2>

                    <form onSubmit={handleCreateSession}>
                        <div style={{ marginBottom: theme.spacing.md }}>
                            <label
                                htmlFor="sessionName"
                                style={{
                                    display: 'block',
                                    fontSize: theme.fontSizes.body,
                                    marginBottom: theme.spacing.xs,
                                    fontWeight: theme.fontWeights.medium,
                                }}
                            >
                                Session Name
                            </label>
                            <input
                                id="sessionName"
                                type="text"
                                value={sessionName}
                                onChange={(e) => setSessionName(e.target.value)}
                                placeholder="Enter session name..."
                                required
                                style={{
                                    width: '100%',
                                    padding: theme.spacing.sm,
                                    fontSize: theme.fontSizes.body,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '4px',
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.text,
                                    fontFamily: theme.fonts.primary,
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: theme.spacing.lg }}>
                            <label
                                htmlFor="referenceGenome"
                                style={{
                                    display: 'block',
                                    fontSize: theme.fontSizes.body,
                                    marginBottom: theme.spacing.xs,
                                    fontWeight: theme.fontWeights.medium,
                                }}
                            >
                                Reference Genome
                            </label>
                            <select
                                id="referenceGenome"
                                value={referenceGenome}
                                onChange={(e) => setReferenceGenome(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: theme.spacing.sm,
                                    fontSize: theme.fontSizes.body,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '4px',
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.text,
                                    fontFamily: theme.fonts.primary,
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="hg38">Human (hg38)</option>
                                <option value="hg19">Human (hg19)</option>
                                <option value="mm10">Mouse (mm10)</option>
                                <option value="mm9">Mouse (mm9)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                backgroundColor: theme.colors.primary,
                                color: 'white',
                                border: 'none',
                                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                                fontSize: theme.fontSizes.body,
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: theme.fontWeights.medium,
                                transition: 'opacity 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.opacity = '1'
                            }}
                        >
                            Create & Open Session
                        </button>
                    </form>
                </div>

                {/* 或者加载最近会话 */}
                <div>
                    <h3
                        style={{
                            fontSize: theme.fontSizes.body,
                            fontWeight: theme.fontWeights.medium,
                            color: theme.colors.secondaryText,
                            margin: `0 0 ${theme.spacing.md} 0`,
                        }}
                    >
                        Or load a recent session:
                    </h3>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: theme.spacing.sm,
                        }}
                    >
                        {recentSessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => handleOpenSession(session.id)}
                                style={{
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '4px',
                                    padding: theme.spacing.md,
                                    backgroundColor: theme.colors.background,
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: theme.fontSizes.body,
                                        fontWeight: theme.fontWeights.medium,
                                        marginBottom: theme.spacing.xs,
                                    }}
                                >
                                    ► {session.name}
                                </div>
                                <div
                                    style={{
                                        fontSize: theme.fontSizes.caption,
                                        color: theme.colors.secondaryText,
                                    }}
                                >
                                    {session.organism} - {session.genome}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: theme.spacing.md, textAlign: 'center' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: theme.colors.primary,
                                fontSize: theme.fontSizes.body,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                        >
                            View All Sessions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { CreateAnalysisModal } from '../components/SessionSetup'

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

export default function GenomesPage() {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [showWizard, setShowWizard] = useState(false)
    const [selectedAssembly, setSelectedAssembly] = useState('hg38')
    const [positionSearch, setPositionSearch] = useState('')
    const [genomeSearch, setGenomeSearch] = useState('')

    const handleOpenSession = (sessionId: string) => {
        navigate(`/browser/${sessionId}`)
    }

    const handleCreateSession = (_sessionData: any) => {
        // 创建新会话并导航到浏览器页面
        const newSessionId = Date.now().toString()
        navigate(`/browser/${newSessionId}`)
    }

    const handleGoPosition = () => {
        // 占位符：后续实现位置跳转功能
        console.log('Navigate to:', selectedAssembly, positionSearch)
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

                {/* Part 2: 物种与位置查询区 (新增) */}
                <section
                    style={{
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        padding: theme.spacing.lg,
                        backgroundColor: theme.colors.surface,
                        marginBottom: theme.spacing.xxl,
                    }}
                >
                    <h2
                        style={{
                            fontSize: theme.fontSizes.h2,
                            fontWeight: theme.fontWeights.bold,
                            margin: `0 0 ${theme.spacing.lg} 0`,
                        }}
                    >
                        Select Species & Position
                    </h2>

                    {/* 热门物种 */}
                    <div style={{ marginBottom: theme.spacing.lg }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: theme.fontSizes.body,
                                fontWeight: theme.fontWeights.medium,
                                marginBottom: theme.spacing.sm,
                            }}
                        >
                            Popular Species
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                gap: theme.spacing.md,
                                flexWrap: 'wrap',
                            }}
                        >
                            {['Human', 'Mouse', 'Zebrafish', 'Fruitfly', 'Yeast'].map((species) => (
                                <div
                                    key={species}
                                    style={{
                                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                        border: `1px solid ${theme.colors.border}`,
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        backgroundColor: theme.colors.background,
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = theme.colors.primary
                                            ; (e.currentTarget as HTMLDivElement).style.backgroundColor = theme.colors.surface
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = theme.colors.border
                                            ; (e.currentTarget as HTMLDivElement).style.backgroundColor = theme.colors.background
                                    }}
                                >
                                    {species}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 基因组搜索 */}
                    <div style={{ marginBottom: theme.spacing.lg }}>
                        <label
                            htmlFor="genomeSearch"
                            style={{
                                display: 'block',
                                fontSize: theme.fontSizes.body,
                                fontWeight: theme.fontWeights.medium,
                                marginBottom: theme.spacing.sm,
                            }}
                        >
                            Search through thousands of genomes
                        </label>
                        <input
                            id="genomeSearch"
                            type="text"
                            value={genomeSearch}
                            onChange={(e) => setGenomeSearch(e.target.value)}
                            placeholder="Search for genome assemblies..."
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

                    {/* 位置搜索 */}
                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: theme.fontSizes.body,
                                fontWeight: theme.fontWeights.medium,
                                marginBottom: theme.spacing.sm,
                            }}
                        >
                            Find Position
                        </label>
                        <div
                            style={{
                                display: 'flex',
                                gap: theme.spacing.sm,
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}
                        >
                            <select
                                value={selectedAssembly}
                                onChange={(e) => setSelectedAssembly(e.target.value)}
                                style={{
                                    padding: theme.spacing.sm,
                                    fontSize: theme.fontSizes.body,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '4px',
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.text,
                                    fontFamily: theme.fonts.primary,
                                    cursor: 'pointer',
                                    minWidth: '300px',
                                }}
                            >
                                <option value="hg38">Human Assembly Dec. 2013 (GRCh38/hg38)</option>
                                <option value="hg19">Human Assembly Feb. 2009 (GRCh37/hg19)</option>
                                <option value="mm10">Mouse Assembly Dec. 2011 (GRCm38/mm10)</option>
                                <option value="mm9">Mouse Assembly July 2007 (NCBI37/mm9)</option>
                            </select>
                            <input
                                type="text"
                                value={positionSearch}
                                onChange={(e) => setPositionSearch(e.target.value)}
                                placeholder="Position/Search Term"
                                style={{
                                    flex: 1,
                                    minWidth: '200px',
                                    padding: theme.spacing.sm,
                                    fontSize: theme.fontSizes.body,
                                    border: `1px solid ${theme.colors.border}`,
                                    borderRadius: '4px',
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.text,
                                    fontFamily: theme.fonts.primary,
                                }}
                            />
                            <button
                                onClick={handleGoPosition}
                                style={{
                                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                                    fontSize: theme.fontSizes.body,
                                    backgroundColor: theme.colors.primary,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: theme.fontWeights.medium,
                                    minWidth: '80px',
                                }}
                            >
                                GO
                            </button>
                        </div>
                    </div>
                </section>

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
                                    cursor: 'pointer',
                                    transition: 'box-shadow 0.2s',
                                }}
                                onClick={() => handleOpenSession(session.id)}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
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
                                        margin: 0,
                                    }}
                                >
                                    Last open: {session.lastOpen}
                                </p>
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
                    © 2025 CNCB Genome Browser
                </footer>
            </main>

            {/* 创建分析模态框 */}
            <CreateAnalysisModal
                isOpen={showWizard}
                onClose={() => setShowWizard(false)}
                onSubmit={handleCreateSession}
            />
        </div>
    )
}

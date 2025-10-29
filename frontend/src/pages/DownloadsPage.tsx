import { useTheme } from '../contexts/ThemeContext'

export default function DownloadsPage() {
    const { theme } = useTheme()

    return (
        <div
            style={{
                minHeight: 'calc(100vh - 64px)',
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                fontFamily: theme.fonts.primary,
                padding: theme.spacing.xxl,
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1
                    style={{
                        fontSize: theme.fontSizes.h1,
                        fontWeight: theme.fontWeights.bold,
                        marginBottom: theme.spacing.lg,
                    }}
                >
                    Downloads
                </h1>
                <p
                    style={{
                        fontSize: theme.fontSizes.body,
                        color: theme.colors.secondaryText,
                        marginBottom: theme.spacing.xl,
                    }}
                >
                    Download genomic data and analysis results
                </p>

                {/* 下载分类示例 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
                    <section>
                        <h2
                            style={{
                                fontSize: theme.fontSizes.h2,
                                fontWeight: theme.fontWeights.bold,
                                marginBottom: theme.spacing.md,
                            }}
                        >
                            Reference Genomes
                        </h2>
                        <div
                            style={{
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                padding: theme.spacing.md,
                            }}
                        >
                            <p style={{ color: theme.colors.secondaryText }}>
                                Reference genome data will be available for download here.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2
                            style={{
                                fontSize: theme.fontSizes.h2,
                                fontWeight: theme.fontWeights.bold,
                                marginBottom: theme.spacing.md,
                            }}
                        >
                            Analysis Results
                        </h2>
                        <div
                            style={{
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                padding: theme.spacing.md,
                            }}
                        >
                            <p style={{ color: theme.colors.secondaryText }}>
                                Export your analysis results and session data.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2
                            style={{
                                fontSize: theme.fontSizes.h2,
                                fontWeight: theme.fontWeights.bold,
                                marginBottom: theme.spacing.md,
                            }}
                        >
                            Sample Data
                        </h2>
                        <div
                            style={{
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius: '4px',
                                padding: theme.spacing.md,
                            }}
                        >
                            <p style={{ color: theme.colors.secondaryText }}>
                                Download sample datasets for testing and tutorials.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

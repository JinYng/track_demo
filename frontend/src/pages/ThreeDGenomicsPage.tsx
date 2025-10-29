import { useTheme } from '../contexts/ThemeContext'

export default function ThreeDGenomicsPage() {
    const { theme } = useTheme()

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
            }}
        >
            <h1
                style={{
                    fontSize: theme.fontSizes.h1,
                    fontWeight: theme.fontWeights.bold,
                }}
            >
                3D Genomics
            </h1>
        </div>
    )
}

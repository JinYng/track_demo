import { useTheme } from '../contexts/ThemeContext'

export default function AboutPage() {
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
                About
            </h1>
        </div>
    )
}

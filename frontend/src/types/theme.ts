// Theme type definitions
export interface CustomTheme {
    colors: {
        background: string
        surface: string
        primary: string
        text: string
        secondaryText: string
        border: string
        hover: string
        accent: string
    }
    fonts: {
        primary: string
        fallback: string
    }
    fontSizes: {
        h1: string
        h2: string
        h3: string
        body: string
        caption: string
    }
    fontWeights: {
        regular: number
        medium: number
        bold: number
    }
    spacing: {
        xs: string
        sm: string
        md: string
        lg: string
        xl: string
        xxl: string
    }
}

export interface ThemeContextValue {
    theme: CustomTheme
    isDark: boolean
    toggleTheme: () => void
}

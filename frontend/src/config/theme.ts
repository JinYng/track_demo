// GenoVerse 视觉设计系统 (VDS)
export interface Theme {
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

export const lightTheme: Theme = {
    colors: {
        background: '#FFFFFF',
        surface: '#F8F9FA',
        primary: '#1A73E8',
        text: '#202124',
        secondaryText: '#5F6368',
        border: '#E0E0E0',
        hover: '#E8F0FE',
        accent: '#1A73E8'
    },
    fonts: {
        primary: 'Inter, -apple-system, BlinkMacSystemFont',
        fallback: 'Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    fontSizes: {
        h1: '32px',
        h2: '24px',
        h3: '18px',
        body: '16px',
        caption: '14px'
    },
    fontWeights: {
        regular: 400,
        medium: 500,
        bold: 700
    },
    spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '48px',
        xxl: '64px'
    }
}

export const darkTheme: Theme = {
    ...lightTheme,
    colors: {
        background: '#1F1F1F',
        surface: '#2D2D2D',
        primary: '#4285F4',
        text: '#E8EAED',
        secondaryText: '#9AA0A6',
        border: '#3C4043',
        hover: '#1E3A8A',
        accent: '#4285F4'
    }
}
import { createContext, useContext, useState, ReactNode } from 'react'

// 主题类型定义
interface Theme {
  colors: {
    background: string
    surface: string
    primary: string
    text: string
    secondaryText: string
    border: string
  }
  fonts: {
    primary: string
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

// 浅色主题
export const lightTheme: Theme = {
  colors: {
    background: '#ffffffff',
    surface: '#ffffffff',
    primary: '#092d5cff',
    text: '#202124',
    secondaryText: '#5F6368',
    border: '#E0E0E0',
  },
  fonts: {
    primary:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSizes: {
    h1: '32px',
    h2: '24px',
    h3: '18px',
    body: '16px',
    caption: '14px',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
}

// 深色主题
export const darkTheme: Theme = {
  colors: {
    background: '#1F1F1F',
    surface: '#2D2D2D',
    primary: '#4285F4',
    text: '#E8EAED',
    secondaryText: '#9AA0A6',
    border: '#3C4043',
  },
  fonts: {
    primary:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSizes: {
    h1: '32px',
    h2: '24px',
    h3: '18px',
    body: '16px',
    caption: '14px',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
}

// Context 类型定义
interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

// 创建 Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Provider 组件
interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook for using theme
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

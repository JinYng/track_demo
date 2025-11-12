import { ReactNode, useMemo } from 'react'
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from '../contexts/ThemeContext'
import { ThemeErrorBoundary } from './ThemeErrorBoundary'

interface CombinedThemeProviderProps {
  children: ReactNode
}

/**
 * Wrapper component that converts custom theme to MUI theme
 * This component must be inside CustomThemeProvider to access theme context
 */
function MuiThemeWrapper({ children }: { children: ReactNode }) {
  const { theme, isDark } = useTheme()

  // Create MUI theme based on custom theme values
  // useMemo ensures theme object is only recreated when dependencies change
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: {
            main: theme.colors.primary,
          },
          background: {
            default: theme.colors.background,
            paper: theme.colors.surface,
          },
          text: {
            primary: theme.colors.text,
            secondary: theme.colors.secondaryText,
          },
          divider: theme.colors.border,
        },
        typography: {
          fontFamily: theme.fonts.primary,
          h1: {
            fontSize: theme.fontSizes.h1,
            fontWeight: theme.fontWeights.bold,
          },
          h2: {
            fontSize: theme.fontSizes.h2,
            fontWeight: theme.fontWeights.bold,
          },
          h3: {
            fontSize: theme.fontSizes.h3,
            fontWeight: theme.fontWeights.medium,
          },
          body1: {
            fontSize: theme.fontSizes.body,
            fontWeight: theme.fontWeights.regular,
          },
          caption: {
            fontSize: theme.fontSizes.caption,
            fontWeight: theme.fontWeights.regular,
          },
        },
        spacing: 8, // Base spacing unit (8px)
      }),
    [theme, isDark],
  )

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

/**
 * Combined theme provider that wraps both custom theme and MUI theme
 * Provides theme context to all child components
 */
export function CombinedThemeProvider({
  children,
}: CombinedThemeProviderProps) {
  return (
    <ThemeErrorBoundary>
      <CustomThemeProvider>
        <MuiThemeWrapper>{children}</MuiThemeWrapper>
      </CustomThemeProvider>
    </ThemeErrorBoundary>
  )
}

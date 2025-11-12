import { NavLink, useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Box, Button } from '@mui/material'
import { useTheme } from '../../../contexts/ThemeContext'

const leftNavItems = [
  { path: '/', label: 'Genomes' },
  { path: '/browser', label: 'Genome Browser' },
  { path: '/tools', label: 'Tools' },
  { path: '/3d-genomics', label: '3D Genomics' },
  { path: '/spatial-omics', label: 'Spatial-Omics' },
  { path: '/downloads', label: 'Downloads' },
]

const rightNavItems = [
  { path: '/help', label: 'Help' },
  { path: '/about', label: 'About' },
]

/**
 * Global navigation bar using MUI components
 * Uses MUI AppBar, Toolbar, Box, and Button components
 * All styling done via sx prop for consistency with MUI theme system
 */
export function GlobalNavbarMUI() {
  const { theme } = useTheme()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: theme.colors.background,
        borderBottom: `1px solid ${theme.colors.border}`,
        boxShadow: 'none',
        fontFamily: theme.fonts.primary,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 4,
          px: 4,
          height: '64px',
          minHeight: '64px',
        }}
      >
        {/* Logo / Brand */}
        <Box
          component={NavLink}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: theme.colors.text,
            fontSize: theme.fontSizes.h3,
            fontWeight: theme.fontWeights.bold,
            flexShrink: 0,
            transition: 'opacity 0.2s',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          CNCB Genome Browser
        </Box>

        {/* Left Navigation Links */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 4,
            flex: 1,
          }}
        >
          {leftNavItems.map(item => {
            const active = isActive(item.path)
            return (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === '/'}
                disableRipple
                sx={{
                  color: theme.colors.text,
                  fontSize: theme.fontSizes.body,
                  fontWeight: theme.fontWeights.regular,
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 0,
                  borderRadius: 0,
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  textShadow: active ? '0 0 0.5px currentColor' : 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: active ? theme.colors.text : 'transparent',
                  },
                }}
              >
                {item.label}
              </Button>
            )
          })}
        </Box>

        {/* Right Navigation Links */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'stretch',
            gap: 4,
            ml: 'auto',
          }}
        >
          {rightNavItems.map(item => {
            const active = isActive(item.path)
            return (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                disableRipple
                sx={{
                  color: theme.colors.text,
                  fontSize: theme.fontSizes.body,
                  fontWeight: theme.fontWeights.regular,
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 0,
                  borderRadius: 0,
                  position: 'relative',
                  whiteSpace: 'nowrap',
                  textShadow: active ? '0 0 0.5px currentColor' : 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: active ? theme.colors.text : 'transparent',
                  },
                }}
              >
                {item.label}
              </Button>
            )
          })}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default GlobalNavbarMUI

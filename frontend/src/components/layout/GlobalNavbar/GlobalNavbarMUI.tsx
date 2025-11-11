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
 * 改进的全局导航栏
 * 使用 MUI AppBar 和 Toolbar 组件
 * 同时保持与自定义主题的兼容性
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
            position="static"
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
                    justifyContent: 'space-between',
                    gap: '24px',
                    padding: `0 ${theme.spacing.lg}`,
                }}
            >
                {/* Logo / Brand */}
                <NavLink
                    to="/"
                    style={{
                        textDecoration: 'none',
                        color: theme.colors.text,
                        fontSize: theme.fontSizes.h3,
                        fontWeight: theme.fontWeights.bold,
                        minWidth: 'fit-content',
                    }}
                >
                    CNCB Genome Browser
                </NavLink>

                {/* Left Navigation Links */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: theme.spacing.md,
                        flex: 1,
                    }}
                >
                    {leftNavItems.map((item) => {
                        const active = isActive(item.path)
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={{
                                    textDecoration: 'none',
                                    color: theme.colors.text,
                                    fontSize: theme.fontSizes.body,
                                    fontWeight: theme.fontWeights.regular,
                                    paddingBottom: '8px',
                                    borderBottom: active
                                        ? `2px solid ${theme.colors.primary}`
                                        : '2px solid transparent',
                                    transition: 'border-color 0.2s',
                                }}
                            >
                                {item.label}
                            </NavLink>
                        )
                    })}
                </Box>

                {/* Right Navigation Links */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: theme.spacing.md,
                    }}
                >
                    {rightNavItems.map((item) => {
                        const active = isActive(item.path)
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                style={{
                                    textDecoration: 'none',
                                    color: theme.colors.text,
                                    fontSize: theme.fontSizes.body,
                                    fontWeight: theme.fontWeights.regular,
                                    paddingBottom: '8px',
                                    borderBottom: active
                                        ? `2px solid ${theme.colors.primary}`
                                        : '2px solid transparent',
                                    transition: 'border-color 0.2s',
                                }}
                            >
                                {item.label}
                            </NavLink>
                        )
                    })}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default GlobalNavbarMUI

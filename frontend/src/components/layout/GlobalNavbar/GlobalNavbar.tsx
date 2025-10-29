import { NavLink } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'
import './GlobalNavbar.css'

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

export function GlobalNavbar() {
    const { theme } = useTheme()

    return (
        <nav
            className="global-navbar"
            style={{
                backgroundColor: theme.colors.background,
                borderBottom: `1px solid ${theme.colors.border}`,
                fontFamily: theme.fonts.primary,
            }}
        >
            <div className="navbar-container">
                {/* Logo / Brand */}
                <NavLink
                    to="/"
                    className="navbar-brand"
                    style={{
                        color: theme.colors.text,
                        fontSize: theme.fontSizes.h3,
                        fontWeight: theme.fontWeights.bold,
                        textDecoration: 'none',
                    }}
                >
                    CNCB Geno Browser
                </NavLink>

                {/* Left Navigation Links */}
                <div className="navbar-links">
                    {leftNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? 'navbar-link--active' : ''}`
                            }
                            style={({ isActive }) => ({
                                color: theme.colors.text,
                                fontSize: theme.fontSizes.body,
                                fontWeight: theme.fontWeights.regular,
                                borderBottom: isActive
                                    ? `2px solid ${theme.colors.text}`
                                    : '2px solid transparent',
                                textShadow: isActive ? '0 0 0.01px currentColor' : 'none',
                            })}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                {/* Right Navigation Links */}
                <div className="navbar-links navbar-links--right">
                    {rightNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? 'navbar-link--active' : ''}`
                            }
                            style={({ isActive }) => ({
                                color: theme.colors.text,
                                fontSize: theme.fontSizes.body,
                                fontWeight: theme.fontWeights.regular,
                                borderBottom: isActive
                                    ? `2px solid ${theme.colors.text}`
                                    : '2px solid transparent',
                                textShadow: isActive ? '0 0 0.01px currentColor' : 'none',
                            })}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    )
}

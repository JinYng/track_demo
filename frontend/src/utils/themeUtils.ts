import { useTheme as useMuiTheme } from '@mui/material/styles'
import { useTheme as useCustomTheme } from '../contexts/ThemeContext'

/**
 * Combined hook to access both MUI and custom theme
 */
export function useAppTheme() {
    const muiTheme = useMuiTheme()
    const customTheme = useCustomTheme()

    return {
        mui: muiTheme,
        custom: customTheme,
    }
}

/**
 * Converts custom spacing string to MUI spacing units
 * MUI uses 8px as base unit
 * @param customSpacing - Spacing value like "16px"
 * @returns Number of MUI spacing units
 */
export function convertSpacing(customSpacing: string): number {
    const value = parseInt(customSpacing)
    return value / 8
}

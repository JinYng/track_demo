import { memo } from 'react'
import { Button } from '@mui/material'
import type { GoButtonProps } from './types'

/**
 * GoButton component triggers navigation to the browser page
 * Disabled when no assembly is selected
 * Memoized to prevent unnecessary re-renders
 */
function GoButton({ disabled, onClick }: GoButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled}
      onClick={onClick}
      size="small"
      sx={{ minWidth: 80, height: 40 }}
    >
      GO
    </Button>
  )
}

export default memo(GoButton)

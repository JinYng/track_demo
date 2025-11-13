import { memo } from 'react'
import { TextField } from '@mui/material'
import type { PositionInputProps } from './types'

/**
 * PositionInput component for entering chromosome position or search term
 * Examples: chr1:1000-2000, TP53, rs123456
 * Memoized to prevent unnecessary re-renders
 */
function PositionInput({
  value,
  onChange,
  disabled = false,
}: PositionInputProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Position/Search Term"
      disabled={disabled}
      variant="outlined"
      size="small"
    />
  )
}

export default memo(PositionInput)

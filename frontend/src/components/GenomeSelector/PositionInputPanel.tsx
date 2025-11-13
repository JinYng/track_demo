import React from 'react'
import { Box } from '@mui/material'

interface PositionInputPanelProps {
  children: React.ReactNode
}

export const PositionInputPanel: React.FC<PositionInputPanelProps> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: { xs: 'stretch', md: 'flex-end' },
      }}
    >
      {children}
    </Box>
  )
}

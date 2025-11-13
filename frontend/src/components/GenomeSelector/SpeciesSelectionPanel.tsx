import React from 'react'
import { Box } from '@mui/material'

interface SpeciesSelectionPanelProps {
  children: React.ReactNode
}

export const SpeciesSelectionPanel: React.FC<SpeciesSelectionPanelProps> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 3,
        bgcolor: 'background.paper',
        mb: 3,
      }}
    >
      {children}
    </Box>
  )
}

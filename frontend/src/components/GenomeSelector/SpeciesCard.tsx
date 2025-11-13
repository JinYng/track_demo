import { memo } from 'react'
import { Card, CardActionArea, Typography, Box } from '@mui/material'
import type { SpeciesCardProps } from './types'

/**
 * SpeciesCard component displays a single species option
 * Supports selected/unselected states with visual feedback
 * Memoized to prevent unnecessary re-renders
 */
function SpeciesCard({ species, selected, onClick }: SpeciesCardProps) {
  return (
    <Card
      sx={{
        border: 2,
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'action.selected' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 1.5, minHeight: 70 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1" component="div" gutterBottom>
            {species.name}
          </Typography>
          {species.scientificName && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              {species.scientificName}
            </Typography>
          )}
        </Box>
      </CardActionArea>
    </Card>
  )
}

export default memo(SpeciesCard)

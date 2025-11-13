import { Grid } from '@mui/material'
import SpeciesCard from './SpeciesCard'
import type { PopularSpeciesCardsProps } from './types'

/**
 * PopularSpeciesCards component displays a grid of popular species cards
 * Implements responsive layout: xs: 6 (2 columns), sm: 4 (3 columns), md: 3 (4 columns)
 */
export default function PopularSpeciesCards({
  species,
  selectedSpeciesId,
  onSelectSpecies,
}: PopularSpeciesCardsProps) {
  return (
    <Grid container spacing={2}>
      {species.map(speciesItem => (
        <Grid item xs={6} sm={4} md={3} key={speciesItem.id}>
          <SpeciesCard
            species={speciesItem}
            selected={speciesItem.id === selectedSpeciesId}
            onClick={() => onSelectSpecies(speciesItem.id)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

/**
 * GenomeSelector - Main component for species and genome selection
 * Manages state and coordinates all child components
 */

import { useState, useCallback } from 'react'
import { Box, Typography } from '@mui/material'
import { useSpeciesData } from '../../hooks/useSpeciesData'
import { SpeciesSelectionPanel } from './SpeciesSelectionPanel'
import { PositionInputPanel } from './PositionInputPanel'
import PopularSpeciesCards from './PopularSpeciesCards'
import GlobalSearch from './GlobalSearch'
import AssemblyDropdown from './AssemblyDropdown'
import PositionInput from './PositionInput'
import GoButton from './GoButton'
import type { GenomeSelectorProps } from './types'

/**
 * GenomeSelector component
 * Provides a complete interface for selecting species, assembly, and position
 * Default state: Human species with hg38 assembly selected
 * Uses useCallback for performance optimization
 */
export default function GenomeSelector({ onNavigate }: GenomeSelectorProps) {
  // Get species and assembly data
  const { popularSpecies, allAssemblies, getSpeciesById, getAssemblyById } =
    useSpeciesData()

  // Core state management
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>('human')
  const [currentAssemblyId, setCurrentAssemblyId] = useState<string>('hg38')
  const [positionInput, setPositionInput] = useState<string>('')

  // Get current species data
  const currentSpecies = getSpeciesById(selectedSpeciesId)

  /**
   * Handle species card selection
   * Automatically updates assembly to the species' default
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleSpeciesSelect = useCallback(
    (speciesId: string) => {
      setSelectedSpeciesId(speciesId)
      const species = getSpeciesById(speciesId)
      if (species) {
        setCurrentAssemblyId(species.defaultAssemblyId)
      }
    },
    [getSpeciesById],
  )

  /**
   * Handle assembly dropdown selection
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleAssemblySelect = useCallback((assemblyId: string) => {
    setCurrentAssemblyId(assemblyId)
  }, [])

  /**
   * Handle global search selection
   * Synchronizes both species and assembly state
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleSearchSelect = useCallback(
    (assemblyId: string) => {
      const assembly = getAssemblyById(assemblyId)
      if (assembly) {
        setSelectedSpeciesId(assembly.speciesId)
        setCurrentAssemblyId(assemblyId)
      }
    },
    [getAssemblyById],
  )

  /**
   * Handle position input changes
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handlePositionChange = useCallback((value: string) => {
    setPositionInput(value)
  }, [])

  /**
   * Handle GO button click
   * Triggers navigation callback with current assembly and position
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleGoClick = useCallback(() => {
    if (currentAssemblyId && onNavigate) {
      onNavigate(currentAssemblyId, positionInput.trim() || undefined)
    }
  }, [currentAssemblyId, positionInput, onNavigate])

  return (
    <Box>
      {/* Species Selection Panel */}
      <SpeciesSelectionPanel>
        <Typography variant="h6" gutterBottom>
          Popular Species
        </Typography>
        <PopularSpeciesCards
          species={popularSpecies}
          selectedSpeciesId={selectedSpeciesId}
          onSelectSpecies={handleSpeciesSelect}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Search All Genomes
          </Typography>
          <GlobalSearch
            assemblies={allAssemblies}
            onSelectAssembly={handleSearchSelect}
          />
        </Box>
      </SpeciesSelectionPanel>

      {/* Position Input Panel */}
      <PositionInputPanel>
        <Box sx={{ flex: { xs: 1, md: 0.3 } }}>
          <AssemblyDropdown
            speciesName={currentSpecies?.name || ''}
            assemblies={currentSpecies?.commonAssemblies || []}
            currentAssemblyId={currentAssemblyId}
            onSelectAssembly={handleAssemblySelect}
            disabled={!currentSpecies}
          />
        </Box>

        <Box sx={{ flex: { xs: 1, md: 0.5 } }}>
          <PositionInput
            value={positionInput}
            onChange={handlePositionChange}
          />
        </Box>

        <Box sx={{ flex: { xs: 1, md: 0.2 } }}>
          <GoButton disabled={!currentAssemblyId} onClick={handleGoClick} />
        </Box>
      </PositionInputPanel>
    </Box>
  )
}

/**
 * GlobalSearch component
 * Provides a search interface to find species and assemblies across all available genomes
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Autocomplete, TextField, Box, Typography } from '@mui/material'
import { GlobalSearchProps, AssemblyInfo } from './types'

/**
 * Custom hook for debouncing input values
 * Delays updating the value until after the specified delay
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * GlobalSearch component for searching through all available species and assemblies
 * Uses MUI Autocomplete with custom filtering and rendering
 * Implements 300ms debouncing for search input
 */
export default function GlobalSearch({
  assemblies,
  onSelectAssembly,
}: GlobalSearchProps) {
  const [inputValue, setInputValue] = useState('')
  const debouncedInputValue = useDebounce(inputValue, 300)
  /**
   * Custom filter function for fuzzy matching
   * Searches across species name, assembly name, and assembly ID
   * Uses debounced input value for better performance
   */
  const filterOptions = useCallback(
    (options: AssemblyInfo[]) => {
      const searchTerm = debouncedInputValue.toLowerCase().trim()

      // Return all options if search is empty
      if (!searchTerm) {
        return options
      }

      // Filter by species name, assembly name, or assembly ID
      return options.filter(
        option =>
          option.speciesName.toLowerCase().includes(searchTerm) ||
          option.name.toLowerCase().includes(searchTerm) ||
          option.id.toLowerCase().includes(searchTerm),
      )
    },
    [debouncedInputValue],
  )

  // Memoize filtered options to avoid recalculation on every render
  const filteredOptions = useMemo(
    () => filterOptions(assemblies),
    [assemblies, filterOptions],
  )

  /**
   * Format option label for display
   * Shows "Species Name - Assembly Name"
   */
  const getOptionLabel = useCallback((option: AssemblyInfo) => {
    return `${option.speciesName} - ${option.name}`
  }, [])

  /**
   * Custom render for each option in the dropdown
   * Displays species name and assembly name with proper styling
   */
  const renderOption = useCallback(
    (props: React.HTMLAttributes<HTMLLIElement>, option: AssemblyInfo) => (
      <Box component="li" {...props} sx={{ py: 0.5 }}>
        <Box>
          <Typography variant="body2" component="div">
            {option.speciesName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {option.name}
          </Typography>
        </Box>
      </Box>
    ),
    [],
  )

  /**
   * Handle selection from search results
   * Triggers the callback with the selected assembly ID
   */
  const handleChange = useCallback(
    (_event: React.SyntheticEvent, value: AssemblyInfo | null) => {
      if (value) {
        onSelectAssembly(value.id)
      }
    },
    [onSelectAssembly],
  )

  /**
   * Handle input value changes
   * Updates the input value state for debouncing
   */
  const handleInputChange = useCallback(
    (_event: React.SyntheticEvent, value: string) => {
      setInputValue(value)
    },
    [],
  )

  return (
    <Autocomplete
      options={filteredOptions}
      filterOptions={options => options} // No filtering needed, already filtered
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      noOptionsText="No results found"
      onChange={handleChange}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      size="small"
      renderInput={params => (
        <TextField
          {...params}
          placeholder="Search through thousands of genomes"
          variant="outlined"
          fullWidth
          size="small"
        />
      )}
      // Clear selection after choosing to allow multiple searches
      value={null}
      // Disable clearing the input when an option is selected
      clearOnBlur
      // Show dropdown on focus
      openOnFocus={false}
    />
  )
}

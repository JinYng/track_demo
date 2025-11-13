/**
 * Type definitions for GenomeSelector component
 */

// Basic species information for display in cards
export interface SpeciesInfo {
    id: string
    name: string
    scientificName?: string
}

// Assembly information with species context for search
export interface AssemblyInfo {
    id: string
    name: string
    speciesId: string
    speciesName: string
}

// Assembly option for dropdown
export interface AssemblyOption {
    id: string
    name: string
    description?: string
}

// Main GenomeSelector component props
export interface GenomeSelectorProps {
    onNavigate?: (assembly: string, position?: string) => void
}

// SpeciesSelectionPanel props
export interface SpeciesSelectionPanelProps {
    children: React.ReactNode
}

// PopularSpeciesCards props
export interface PopularSpeciesCardsProps {
    species: SpeciesInfo[]
    selectedSpeciesId: string
    onSelectSpecies: (speciesId: string) => void
}

// SpeciesCard props
export interface SpeciesCardProps {
    species: SpeciesInfo
    selected: boolean
    onClick: () => void
}

// GlobalSearch props
export interface GlobalSearchProps {
    assemblies: AssemblyInfo[]
    onSelectAssembly: (assemblyId: string) => void
}

// PositionInputPanel props
export interface PositionInputPanelProps {
    children: React.ReactNode
}

// AssemblyDropdown props
export interface AssemblyDropdownProps {
    speciesName: string
    assemblies: AssemblyOption[]
    currentAssemblyId: string
    onSelectAssembly: (assemblyId: string) => void
    disabled?: boolean
}

// PositionInput props
export interface PositionInputProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

// GoButton props
export interface GoButtonProps {
    disabled: boolean
    onClick: () => void
}

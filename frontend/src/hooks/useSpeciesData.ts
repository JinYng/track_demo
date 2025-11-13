/**
 * Custom hook for accessing species and assembly data
 * Currently uses mock data, but provides a clean interface for future API integration
 */

import { MOCK_SPECIES_DATA, SpeciesData } from '../data/mockSpeciesData'
import { SpeciesInfo, AssemblyInfo } from '../components/GenomeSelector/types'

export interface UseSpeciesDataReturn {
    popularSpecies: SpeciesInfo[]
    allAssemblies: AssemblyInfo[]
    getSpeciesById: (id: string) => SpeciesData | undefined
    getAssemblyById: (id: string) => AssemblyInfo | undefined
}

/**
 * Hook to access species and assembly data
 * Provides transformed data structures optimized for different use cases
 */
export function useSpeciesData(): UseSpeciesDataReturn {
    // Transform species data for popular species cards
    const popularSpecies: SpeciesInfo[] = MOCK_SPECIES_DATA.map((species) => ({
        id: species.id,
        name: species.name,
        scientificName: species.scientificName,
    }))

    // Flatten all assemblies with species context for global search
    const allAssemblies: AssemblyInfo[] = MOCK_SPECIES_DATA.flatMap((species) =>
        species.commonAssemblies.map((assembly) => ({
            id: assembly.id,
            name: assembly.name,
            speciesId: species.id,
            speciesName: species.name,
        }))
    )

    // Get species data by ID
    const getSpeciesById = (id: string): SpeciesData | undefined => {
        return MOCK_SPECIES_DATA.find((species) => species.id === id)
    }

    // Get assembly info by ID
    const getAssemblyById = (id: string): AssemblyInfo | undefined => {
        return allAssemblies.find((assembly) => assembly.id === id)
    }

    return {
        popularSpecies,
        allAssemblies,
        getSpeciesById,
        getAssemblyById,
    }
}

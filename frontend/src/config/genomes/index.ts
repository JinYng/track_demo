// frontend/src/config/genomes/index.ts
// Genome configuration loader and registry

import { GenomeConfig, GenomeMetadata } from './types';
import hg38Config from './hg38';
import hg38UcscConfig from './hg38-ucsc';
import jbrowseTheme from './theme';

/**
 * Available genomes registry
 * Lists all genome assemblies supported by the application
 */
export const availableGenomes: GenomeMetadata[] = [
    {
        id: 'hg38',
        name: 'Human (GRCh38/hg38)',
        description: 'Human genome assembly GRCh38 (hg38) - JBrowse demo data',
        defaultLocation: '10:29,838,565..29,838,850',
    },
    {
        id: 'hg38-ucsc',
        name: 'Human (GRCh38/hg38) - UCSC',
        description: 'Human genome assembly GRCh38 (hg38) - UCSC data sources',
        defaultLocation: 'chr7:155,799,529..155,812,871',
    },
    // Future genomes can be added here:
    // {
    //     id: 'hg19',
    //     name: 'Human (GRCh37/hg19)',
    //     description: 'Human genome assembly GRCh37 (hg19)',
    //     defaultLocation: '10:29,838,565..29,838,850',
    // },
];

/**
 * Genome configuration registry
 * Maps genome IDs to their configuration loaders
 */
const genomeConfigs: Record<string, () => Omit<GenomeConfig, 'theme'>> = {
    hg38: () => hg38Config,
    'hg38-ucsc': () => hg38UcscConfig,
    // Future genomes can be added here:
    // hg19: () => hg19Config,
};

/**
 * Get configuration for a specific genome
 * 
 * @param genomeId - The genome identifier (e.g., 'hg38', 'hg19')
 * @returns Complete genome configuration with theme applied
 * @throws Error if genome ID is not found
 * 
 * @example
 * const config = getGenomeConfig('hg38');
 * // Returns complete hg38 configuration with theme
 */
export function getGenomeConfig(genomeId: string): GenomeConfig {
    const configLoader = genomeConfigs[genomeId];

    if (!configLoader) {
        throw new Error(`Genome configuration not found for: ${genomeId}`);
    }

    const config = configLoader();

    // Apply global theme to the genome configuration
    return {
        ...config,
        theme: jbrowseTheme,
    };
}

/**
 * Get the default genome configuration
 * Currently returns hg38 as the default genome
 * 
 * @returns Complete genome configuration for the default genome (hg38)
 * 
 * @example
 * const config = getDefaultGenomeConfig();
 * // Returns hg38 configuration with theme
 */
export function getDefaultGenomeConfig(): GenomeConfig {
    return getGenomeConfig('hg38');
}

// Re-export all types for convenience
export * from './types';

// frontend/src/config/genomes/types.ts
// TypeScript type definitions for JBrowse genome configuration

/**
 * Location configuration for remote resources
 */
export interface LocationConfig {
    uri: string;
    locationType?: string;
}

/**
 * Adapter configuration for reference sequences
 */
export interface ReferenceSequenceAdapter {
    type: string;
    fastaLocation: LocationConfig;
    faiLocation: LocationConfig;
    gziLocation: LocationConfig;
}

/**
 * Reference name aliases adapter configuration
 */
export interface RefNameAliasAdapter {
    type: string;
    location: LocationConfig;
}

/**
 * JBrowse Assembly configuration type
 * Defines the genome assembly including reference sequence and aliases
 */
export interface AssemblyConfig {
    name: string;
    sequence: {
        type: string;
        trackId: string;
        adapter: ReferenceSequenceAdapter;
    };
    refNameAliases?: {
        adapter: RefNameAliasAdapter;
    };
}

/**
 * Generic adapter configuration
 * Different track types have different adapter structures
 */
export interface TrackAdapter {
    type: string;
    [key: string]: any;
}

/**
 * JBrowse Track configuration type
 * Defines a data track (genes, variants, alignments, etc.)
 */
export interface TrackConfig {
    type: string;
    trackId: string;
    name: string;
    assemblyNames: string[];
    category?: string[];
    adapter: TrackAdapter;
}

/**
 * Display configuration for tracks in a session
 */
export interface DisplayConfig {
    id: string;
    type: string;
    height: number;
}

/**
 * Track configuration within a session view
 */
export interface SessionTrackConfig {
    id: string;
    type: string;
    configuration: string;
    displays: DisplayConfig[];
}

/**
 * Linear genome view configuration
 */
export interface LinearGenomeViewConfig {
    id: string;
    type: string;
    tracks: SessionTrackConfig[];
}

/**
 * Default session configuration type
 * Defines which tracks are loaded by default
 */
export interface DefaultSessionConfig {
    name: string;
    view: LinearGenomeViewConfig;
}

/**
 * JBrowse theme configuration
 */
export interface ThemeConfig {
    palette: {
        primary: { main: string };
        secondary: { main: string };
        tertiary: { main: string };
        quaternary: { main: string };
    };
    shadows: string[];
}

/**
 * JBrowse global configuration
 */
export interface JBrowseConfiguration {
    logoPath: LocationConfig;
    [key: string]: any;
}

/**
 * Complete genome configuration type
 * This is the full configuration object passed to JBrowse component
 */
export interface GenomeConfig {
    assembly: AssemblyConfig;
    tracks: TrackConfig[];
    location: string;
    theme: ThemeConfig;
    configuration: JBrowseConfiguration;
    defaultSession: DefaultSessionConfig;
}

/**
 * Genome metadata for listing available genomes
 */
export interface GenomeMetadata {
    id: string;
    name: string;
    description: string;
    defaultLocation: string;
}

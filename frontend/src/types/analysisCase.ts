/**
 * Represents a predefined genome analysis case
 */
export interface AnalysisCase {
    /** Unique identifier for the case */
    id: string

    /** Display title of the analysis case */
    title: string

    /** Species name (e.g., "Human", "Mouse") */
    speciesName: string

    /** Assembly/genome version ID (e.g., "hg38", "mm10") */
    assemblyId: string

    /** Target genomic position or gene name
     * Examples: "chr17:7668400-7688200", "TP53", "chr1:100000-200000"
     */
    targetPosition: string

    /** Optional description for future use */
    description?: string
}

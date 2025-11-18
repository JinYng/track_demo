import { AnalysisCase } from '../types/analysisCase'

/**
 * Validates an analysis case has all required fields
 */
function validateAnalysisCase(analysisCase: AnalysisCase): boolean {
    if (!analysisCase.id || !analysisCase.title) return false
    if (!analysisCase.speciesName || !analysisCase.assemblyId) return false
    if (!analysisCase.targetPosition) return false
    return true
}

/**
 * Predefined example analysis cases
 * These cases showcase different features and use cases of the platform
 */
export const EXAMPLE_CASES: AnalysisCase[] = [
    /**
     * Demo analysis case showcasing the complete genome browser functionality
     * Includes 5 pre-loaded tracks at a meaningful genomic location
     */
    {
        id: 'demo-hg38-default',
        title: 'Human Genome Browser Demo',
        speciesName: 'Human',
        assemblyId: 'hg38',
        targetPosition: 'chr10:29838565-29838850',
        description: 'Complete demonstration of genome browser features with 5 pre-loaded tracks: reference sequence, gene annotations, conservation scores, variants, and alignments',
    },
    {
        id: 'case-wes-variant',
        title: 'Patient A WES Variant Screening',
        speciesName: 'Human',
        assemblyId: 'hg38',
        targetPosition: 'chr1:100000-200000',
        description: 'Whole exome sequencing variant analysis example',
    },
    {
        id: 'case-tp53',
        title: 'TP53 Region Analysis',
        speciesName: 'Human',
        assemblyId: 'hg38',
        targetPosition: 'TP53',
        description: 'Focus on a critical tumor suppressor locus',
    },
    {
        id: 'case-mouse-knockout',
        title: 'Mouse Knockout Study',
        speciesName: 'Mouse',
        assemblyId: 'mm10',
        targetPosition: 'Gapdh',
        description: 'Mouse model gene knockout analysis',
    },
    {
        id: 'case-brca1',
        title: 'BRCA1 Mutation Hotspot',
        speciesName: 'Human',
        assemblyId: 'hg38',
        targetPosition: 'BRCA1',
        description: 'Breast cancer susceptibility gene analysis',
    },
    {
        id: 'case-zebrafish-dev',
        title: 'Zebrafish Development Study',
        speciesName: 'Zebrafish',
        assemblyId: 'danRer11',
        targetPosition: 'sox2',
        description: 'Developmental biology research example',
    },
    {
        id: 'case-apoe',
        title: 'APOE Alzheimer Risk Variants',
        speciesName: 'Human',
        assemblyId: 'hg38',
        targetPosition: 'APOE',
        description: 'Alzheimer disease genetic risk factor',
    },
]

// Validate all cases in development environment
if (import.meta.env.DEV) {
    EXAMPLE_CASES.forEach((analysisCase) => {
        if (!validateAnalysisCase(analysisCase)) {
            console.error('Invalid analysis case:', analysisCase)
        }
    })
}

// frontend/src/config/genomes/hg38-ucsc/defaultSession.ts
// Default session configuration for hg38 UCSC demo

import { DefaultSessionConfig } from '../types';

/**
 * Default session for hg38 UCSC configuration
 * Defines the initial view location and which tracks are visible by default
 * 
 * Pre-loaded tracks showcase key UCSC data sources:
 * - Reference sequence (TwoBit format for fast loading)
 * - RefSeq genes (curated gene annotations)
 * - phyloP conservation (evolutionary conservation scores)
 * - ClinVar variants (clinical significance)
 */
const defaultSession: DefaultSessionConfig = {
    name: 'hg38 UCSC Demo',
    view: {
        id: 'linearGenomeView',
        type: 'LinearGenomeView',
        tracks: [
            // Reference sequence track
            {
                id: 'ref-seq-track',
                type: 'ReferenceSequenceTrack',
                configuration: 'hg38-refseq',
                displays: [
                    {
                        id: 'ref-seq-display',
                        type: 'LinearReferenceSequenceDisplay',
                        height: 100,
                    },
                ],
            },
            // NCBI RefSeq genes
            {
                id: 'refseq-genes-track',
                type: 'FeatureTrack',
                configuration: 'hg38-ncbiRefSeqSelect',
                displays: [
                    {
                        id: 'refseq-genes-display',
                        type: 'LinearBasicDisplay',
                        height: 100,
                    },
                ],
            },
            // Conservation track
            {
                id: 'phylop-track',
                type: 'QuantitativeTrack',
                configuration: 'hg38-phyloP100way',
                displays: [
                    {
                        id: 'phylop-display',
                        type: 'LinearWiggleDisplay',
                        height: 100,
                    },
                ],
            },
            // ClinVar variants
            {
                id: 'clinvar-track',
                type: 'FeatureTrack',
                configuration: 'hg38-clinvarMain',
                displays: [
                    {
                        id: 'clinvar-display',
                        type: 'LinearBasicDisplay',
                        height: 100,
                    },
                ],
            },
        ],
    },
};

export default defaultSession;

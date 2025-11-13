// frontend/src/config/genomes/hg38/defaultSession.ts
// Default session configuration for hg38 genome

import { DefaultSessionConfig } from '../types';

/**
 * Default session for hg38 genome
 * Defines which tracks are loaded by default and their display settings
 * Track configuration IDs must match trackIds from assembly.ts and tracks.ts
 */
const defaultSession: DefaultSessionConfig = {
    name: 'My session',
    view: {
        id: 'linearGenomeView',
        type: 'LinearGenomeView',
        tracks: [
            {
                id: 'ref-seq-track',
                type: 'ReferenceSequenceTrack',
                configuration: 'GRCh38-ReferenceSequenceTrack',
                displays: [
                    {
                        id: 'ref-seq-display',
                        type: 'LinearReferenceSequenceDisplay',
                        height: 100,
                    },
                ],
            },
            {
                id: 'genes-track',
                type: 'FeatureTrack',
                configuration: 'genes',
                displays: [
                    {
                        id: 'genes-display',
                        type: 'LinearBasicDisplay',
                        height: 100,
                    },
                ],
            },
            {
                id: 'conservation-track',
                type: 'QuantitativeTrack',
                configuration: 'hg38.100way.phyloP100way',
                displays: [
                    {
                        id: 'conservation-display',
                        type: 'LinearWiggleDisplay',
                        height: 100,
                    },
                ],
            },
            {
                id: 'variants-track',
                type: 'VariantTrack',
                configuration: 'hg38_1000_genomes_variants',
                displays: [
                    {
                        id: 'variants-display',
                        type: 'LinearVariantDisplay',
                        height: 100,
                    },
                ],
            },
            {
                id: 'alignments-track',
                type: 'AlignmentsTrack',
                configuration: 'NA12878_exome_alignments',
                displays: [
                    {
                        id: 'alignments-display',
                        type: 'LinearAlignmentsDisplay',
                        height: 100,
                    },
                ],
            },
        ],
    },
};

export default defaultSession;

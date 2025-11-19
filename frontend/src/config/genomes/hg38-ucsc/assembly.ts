// frontend/src/config/genomes/hg38-ucsc/assembly.ts
// Assembly configuration for human genome GRCh38/hg38 using UCSC data

import { AssemblyConfig } from '../types';

/**
 * hg38 (GRCh38) assembly configuration using UCSC TwoBit format
 * This provides faster loading compared to FASTA format
 */
const assembly: AssemblyConfig = {
    name: 'hg38',
    sequence: {
        type: 'ReferenceSequenceTrack',
        trackId: 'hg38-refseq',
        adapter: {
            type: 'TwoBitAdapter',
            twoBitLocation: {
                uri: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.2bit',
                locationType: 'UriLocation',
            },
            chromSizesLocation: {
                uri: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/bigZips/hg38.chrom.sizes',
                locationType: 'UriLocation',
            },
        },
    },
};

export default assembly;

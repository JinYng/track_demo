// frontend/src/config/genomes/hg38/assembly.ts
// Assembly configuration for human genome GRCh38/hg38

import { AssemblyConfig } from '../types';

/**
 * hg38 (GRCh38) assembly configuration
 * Includes reference sequence track and chromosome name aliases
 */
const assembly: AssemblyConfig = {
    name: 'hg38',
    sequence: {
        type: 'ReferenceSequenceTrack',
        trackId: 'GRCh38-ReferenceSequenceTrack',
        adapter: {
            type: 'BgzipFastaAdapter',
            fastaLocation: {
                uri: 'https://jbrowse.org/genomes/GRCh38/fasta/hg38.prefix.fa.gz',
            },
            faiLocation: {
                uri: 'https://jbrowse.org/genomes/GRCh38/fasta/hg38.prefix.fa.gz.fai',
            },
            gziLocation: {
                uri: 'https://jbrowse.org/genomes/GRCh38/fasta/hg38.prefix.fa.gz.gzi',
            },
        },
    },
    refNameAliases: {
        adapter: {
            type: 'RefNameAliasAdapter',
            location: {
                uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/hg38_aliases.txt',
            },
        },
    },
};

export default assembly;

// frontend/src/config/genomes/hg38/index.ts
// Entry point for hg38 genome configuration

import { GenomeConfig } from '../types';
import assembly from './assembly';
import tracks from './tracks';
import defaultSession from './defaultSession';

/**
 * Complete hg38 genome configuration (without theme)
 * Theme is applied at the genome loader level (genomes/index.ts)
 */
const hg38Config: Omit<GenomeConfig, 'theme'> = {
    assembly,
    tracks,
    location: '10:29,838,565..29,838,850',
    configuration: {
        logoPath: {
            uri: '',
            locationType: 'UriLocation',
        },
        chromosomeFormat: 'ensembl', // JBrowse demo data uses Ensembl format (1, 2, X)
    },
    defaultSession,
};

export default hg38Config;

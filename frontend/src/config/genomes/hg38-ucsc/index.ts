// frontend/src/config/genomes/hg38-ucsc/index.ts
// Entry point for hg38 UCSC genome configuration

import { GenomeConfig } from '../types';
import assembly from './assembly';
import tracks from './tracks';
import defaultSession from './defaultSession';

/**
 * Complete hg38 UCSC genome configuration (without theme)
 * Theme is applied at the genome loader level (genomes/index.ts)
 * 
 * This configuration uses UCSC data sources for faster loading
 */
const hg38UcscConfig: Omit<GenomeConfig, 'theme'> = {
    assembly,
    tracks,
    location: 'chr7:155,799,529..155,812,871', // Default position from UCSC metadata
    configuration: {
        logoPath: {
            uri: '',
            locationType: 'UriLocation',
        },
    },
    defaultSession,
};

export default hg38UcscConfig;

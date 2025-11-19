// frontend/src/config/genomes/hg38-ucsc/tracks.ts
// Track configurations for human genome GRCh38/hg38 using UCSC data

import { TrackConfig } from '../types';

/**
 * UCSC-based tracks for hg38 genome
 */
const tracks: TrackConfig[] = [
    // Conservation track - phyloP 100-way vertebrate alignment
    {
        type: 'QuantitativeTrack',
        trackId: 'hg38-phyloP100way',
        name: 'Basewise Conservation (phyloP) - 100-way vertebrate alignment',
        assemblyNames: ['hg38'],
        category: ['Comparative Genomics'],
        adapter: {
            type: 'BigWigAdapter',
            bigWigLocation: {
                uri: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/phyloP100way/hg38.phyloP100way.bw',
                locationType: 'UriLocation',
            },
        },
    },
    // NCBI RefSeq Select and MANE genes
    {
        type: 'FeatureTrack',
        trackId: 'hg38-ncbiRefSeqSelect',
        name: 'NCBI RefSeq - RefSeq Select and MANE',
        assemblyNames: ['hg38'],
        category: ['Genes and Gene Predictions'],
        adapter: {
            type: 'Gff3TabixAdapter',
            gffGzLocation: {
                uri: 'https://jbrowse.org/ucsc/hg38/ncbiRefSeqSelect.gff.gz',
                locationType: 'UriLocation',
            },
            index: {
                indexType: 'CSI',
                location: {
                    uri: 'https://jbrowse.org/ucsc/hg38/ncbiRefSeqSelect.gff.gz.csi',
                    locationType: 'UriLocation',
                },
            },
        },
    },
    // CADD 1.7 - Variant deleteriousness scores
    {
        type: 'MultiQuantitativeTrack',
        trackId: 'hg38-cadd1_7',
        name: 'CADD 1.7',
        assemblyNames: ['hg38'],
        category: ['Phenotypes, Variants, and Literature'],
        adapter: {
            type: 'MultiWiggleAdapter',
            subadapters: [
                {
                    type: 'BigWigAdapter',
                    bigWigLocation: {
                        uri: 'https://hgdownload.soe.ucsc.edu/gbdb/hg38/cadd1.7/a.bw',
                        locationType: 'UriLocation',
                    },
                    source: 'Mutation: A',
                },
                {
                    type: 'BigWigAdapter',
                    bigWigLocation: {
                        uri: 'https://hgdownload.soe.ucsc.edu/gbdb/hg38/cadd1.7/c.bw',
                        locationType: 'UriLocation',
                    },
                    source: 'Mutation: C',
                },
                {
                    type: 'BigWigAdapter',
                    bigWigLocation: {
                        uri: 'https://hgdownload.soe.ucsc.edu/gbdb/hg38/cadd1.7/g.bw',
                        locationType: 'UriLocation',
                    },
                    source: 'Mutation: G',
                },
                {
                    type: 'BigWigAdapter',
                    bigWigLocation: {
                        uri: 'https://hgdownload.soe.ucsc.edu/gbdb/hg38/cadd1.7/t.bw',
                        locationType: 'UriLocation',
                    },
                    source: 'Mutation: T',
                },
            ],
        },
    },
    // ClinVar Variants - Short nucleotide variants
    {
        type: 'FeatureTrack',
        trackId: 'hg38-clinvarMain',
        name: 'ClinVar Variants - ClinVar SNVs',
        assemblyNames: ['hg38'],
        category: ['Phenotypes, Variants, and Literature'],
        adapter: {
            type: 'BigBedAdapter',
            bigBedLocation: {
                uri: 'https://hgdownload.soe.ucsc.edu/gbdb/hg38/bbi/clinvar/clinvarMain.bb',
                locationType: 'UriLocation',
            },
        },
    },
    // ENCODE Transcription Factor binding sites
    {
        type: 'FeatureTrack',
        trackId: 'hg38-TFrPeakClusters',
        name: 'ENCODE Regulation - TF rPeak Clusters',
        assemblyNames: ['hg38'],
        category: ['Regulation'],
        adapter: {
            type: 'BigBedAdapter',
            bigBedLocation: {
                uri: 'https://hgdownload.soe.ucsc.edu/gbdb/hg38/bbi/ENCODE4/TFrPeakClusters.bb',
                locationType: 'UriLocation',
            },
        },
    },
    // GTEx expression quantitative trait loci
    {
        type: 'FeatureTrack',
        trackId: 'hg38-gtexEqtlCaviar',
        name: 'GTEx cis-eQTLs - GTEx CAVIAR eQTLs',
        assemblyNames: ['hg38'],
        category: ['Regulation'],
        adapter: {
            type: 'BigBedAdapter',
            bigBedLocation: {
                uri: 'https://hgdownload.soe.ucsc.edu/gbdb/hg38/gtex/eQtl/gtexCaviar.bb',
                locationType: 'UriLocation',
            },
        },
    },
];

export default tracks;

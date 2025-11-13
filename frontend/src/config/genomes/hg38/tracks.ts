// frontend/src/config/genomes/hg38/tracks.ts
// Track configurations for human genome GRCh38/hg38

import { TrackConfig } from '../types';

/**
 * All available tracks for hg38 genome
 * Includes genes, conservation, variants, and alignment tracks
 */
const tracks: TrackConfig[] = [
    // Gene annotation track
    {
        type: 'FeatureTrack',
        trackId: 'genes',
        name: 'NCBI RefSeq Genes',
        assemblyNames: ['hg38'],
        category: ['Genes'],
        adapter: {
            type: 'Gff3TabixAdapter',
            gffGzLocation: {
                uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/ncbi_refseq/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz',
            },
            index: {
                location: {
                    uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/ncbi_refseq/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz.tbi',
                },
            },
        },
    },
    // Conservation track
    {
        type: 'QuantitativeTrack',
        trackId: 'hg38.100way.phyloP100way',
        name: 'Conservation (phyloP100way)',
        category: ['Conservation'],
        assemblyNames: ['hg38'],
        adapter: {
            type: 'BigWigAdapter',
            bigWigLocation: {
                uri: 'https://hgdownload.cse.ucsc.edu/goldenpath/hg38/phyloP100way/hg38.phyloP100way.bw',
            },
        },
    },
    // Variants track
    {
        type: 'VariantTrack',
        trackId: 'hg38_1000_genomes_variants',
        name: '1000 Genomes Variants',
        assemblyNames: ['hg38'],
        category: ['Variants'],
        adapter: {
            type: 'VcfTabixAdapter',
            vcfGzLocation: {
                uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/variants/ALL.wgs.shapeit2_integrated_snvindels_v2a.GRCh38.27022019.sites.vcf.gz',
            },
            index: {
                location: {
                    uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/variants/ALL.wgs.shapeit2_integrated_snvindels_v2a.GRCh38.27022019.sites.vcf.gz.tbi',
                },
            },
        },
    },
    // Alignments track
    {
        type: 'AlignmentsTrack',
        trackId: 'NA12878_exome_alignments',
        name: 'NA12878 Exome Alignments',
        assemblyNames: ['hg38'],
        category: ['Alignments'],
        adapter: {
            type: 'CramAdapter',
            cramLocation: {
                uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/alignments/NA12878/NA12878.alt_bwamem_GRCh38DH.20150826.CEU.exome.cram',
            },
            craiLocation: {
                uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/alignments/NA12878/NA12878.alt_bwamem_GRCh38DH.20150826.CEU.exome.cram.crai',
            },
            sequenceAdapter: {
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
    },
];

export default tracks;

// frontend/src/config.ts

// JBrowse 2 线性基因组浏览器视图的配置文件
// 这个配置是为 @jbrowse/react-linear-genome-view2 组件特别准备的

// 1. 定义基因组程序集 (Assembly)
const assembly = {
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

// 2. 定义所有可用的基因轨道 (Tracks)
const tracks = [
  {
    type: 'FeatureTrack',
    trackId: 'genes',
    name: 'NCBI RefSeq Genes',
    assemblyNames: ['hg38'],
    category: ['Genes'],
    adapter: {
      type: 'Gff3TabixAdapter',
      // 最佳实践：明确提供 gffGz 和 tbi 文件的位置
      gffGzLocation: {
        uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/ncbi_refseq/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz',
      },
      index: {
        location: {
          uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/ncbi_refseq/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz.tbi'
        }
      }
    },
  },
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
          uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/variants/ALL.wgs.shapeit2_integrated_snvindels_v2a.GRCh38.27022019.sites.vcf.gz.tbi'
        }
      }
    },
  },
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

// 3. 定义 JBrowse 主题 (遵循官方文档格式)
const jbrowseTheme = {
  palette: {
    primary: {
      main: '#202124'
    },
    secondary: {
      main: '#ffffffff'
    },
    tertiary: {
      main: '#F1F3F4'
    },
    quaternary: {
      main: '#092d5cff'
    }
  }
};

// 4. 组合成最终给 JBrowseLinearGenomeView 组件使用的配置对象
const viewConfig = {
  assembly,
  tracks,
  // 定义默认加载的基因组位置
  location: '10:29,838,565..29,838,850',
  // 应用自定义主题
  theme: jbrowseTheme,
  // 定义默认会话
  defaultSession: {
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
              height: 100
            }
          ]
        },
        {
          id: 'genes-track',
          type: 'FeatureTrack',
          configuration: 'genes',
          displays: [
            {
              id: 'genes-display',
              type: 'LinearBasicDisplay',
              height: 100
            }
          ]
        },
        {
          id: 'conservation-track',
          type: 'QuantitativeTrack',
          configuration: 'hg38.100way.phyloP100way',
          displays: [
            {
              id: 'conservation-display',
              type: 'LinearWiggleDisplay',
              height: 100
            }
          ]
        },
        {
          id: 'variants-track',
          type: 'VariantTrack',
          configuration: 'hg38_1000_genomes_variants',
          displays: [
            {
              id: 'variants-display',
              type: 'LinearVariantDisplay',
              height: 100
            }
          ]
        },
        {
          id: 'alignments-track',
          type: 'AlignmentsTrack',
          configuration: 'NA12878_exome_alignments',
          displays: [
            {
              id: 'alignments-display',
              type: 'LinearAlignmentsDisplay',
              height: 100
            }
          ]
        }
      ],
    },
  },
};

export default viewConfig;
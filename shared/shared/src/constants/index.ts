// Application constants
export const API_ENDPOINTS = {
  AI_SERVICE: '/api/ai',
  DATA_SERVICE: '/api/data',
  KNOWLEDGE_SERVICE: '/api/knowledge',
  SESSION_SERVICE: '/api/session'
} as const;

export const FILE_TYPES = {
  VCF: 'vcf',
  BAM: 'bam',
  FASTA: 'fasta',
  GFF: 'gff'
} as const;
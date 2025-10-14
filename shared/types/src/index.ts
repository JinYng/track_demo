// Core types and interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'researcher' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface GenomicFile {
  id: string;
  name: string;
  type: 'vcf' | 'bam' | 'fasta' | 'gff';
  size: number;
  path: string;
  uploadedAt: Date;
  userId: string;
}

export interface AnalysisSession {
  id: string;
  name: string;
  description?: string;
  files: GenomicFile[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIQuery {
  id: string;
  sessionId: string;
  query: string;
  response: string;
  timestamp: Date;
  userId: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
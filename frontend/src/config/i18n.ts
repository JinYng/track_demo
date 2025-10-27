import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 英语翻译资源
const resources = {
    en: {
        translation: {
            dashboard: {
                title: 'Welcome to CNCB Geno Browser',
                subtitle: 'Your AI-powered genomics navigator',
                startAnalysis: 'Start New Analysis',
                recentSessions: 'Recent Sessions',
                help: 'Help',
                about: 'About',
                importSession: 'Import Session from File...',
            },
            session: {
                open: 'Open',
                more: 'More',
            },
            wizard: {
                title: 'Create New Analysis',
                step1: 'Step 1 of 3: Basic Setup',
                step2: 'Step 2 of 3: Data Sources',
                step3: 'Step 3 of 3: Analysis Options',
                sessionName: 'Session Name',
                organism: 'Organism',
                referenceGenome: 'Reference Genome',
                cancel: 'Cancel',
                next: 'Next',
                previous: 'Previous',
                create: 'Create',
            },
            createAnalysis: {
                title: 'Create New Analysis',
                sessionNameLabel: 'Session Name',
                sessionNamePlaceholder: 'Enter a descriptive name for this analysis session',
                referenceGenomeLabel: 'Reference Genome',
                addCustomGenome: '+ Add Custom Genome...',
                customGenomeConfiguration: 'Custom Genome Configuration',
                assemblyNameLabel: 'Assembly Name *',
                assemblyNamePlaceholder: 'e.g., my_hg38_custom',
                assemblyDisplayNameLabel: 'Assembly Display Name',
                assemblyDisplayNamePlaceholder: 'e.g., My Custom Human Genome (optional)',
                adapterTypeLabel: 'Adapter Type',
                fastaFileLabel: 'FASTA File *',
                fastaFileDescription: 'Standard FASTA sequence file (.fa, .fasta)',
                twoBitFileLabel: '2bit File *',
                twoBitFileDescription: 'Binary 2bit format file (.2bit)',
                faiFileLabel: 'FAI Index File (.fai) *',
                gziFileLabel: 'GZI Index File (.gzi) *',
                sequenceFilePlaceholder: 'Paste URL or select file...',
                chromSizesLabel: 'Chrom Sizes (optional)',
                chromSizesPlaceholder: 'Paste URL or select file...',
                refNameAliasesLabel: 'Reference Name Aliases',
                cytobandsLabel: 'Cytobands',
                advancedOptions: 'Advanced Options',
                cancel: 'Cancel',
                createSession: 'Create Session',
            },
            common: {
                cancel: 'Cancel',
                advancedOptions: 'Advanced Options',
            },
            fileInput: {
                url: 'URL',
                file: 'File',
                selectFile: 'Select File',
                selected: 'Selected',
            },
        },
    },
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
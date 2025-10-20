import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 英语翻译资源
const resources = {
    en: {
        translation: {
            dashboard: {
                title: 'Welcome to GenoVerse AI',
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
// frontend/src/config/genomes/theme.ts
// JBrowse theme configuration

import { ThemeConfig } from './types';

/**
 * JBrowse theme configuration
 * Defines the color palette and visual styling for the genome browser
 * 
 * Color scheme aligned with CNCB Genome Browser theme:
 * - Primary: Main brand color (blue)
 * - Secondary: Background/surface color
 * - Tertiary: Accent color for highlights
 * - Quaternary: Secondary accent for contrast
 */
const jbrowseTheme: ThemeConfig = {
    palette: {
        primary: {
            main: '#003366', // Deep navy blue - matches application buttons
        },
        secondary: {
            main: '#F8F9FA', // Light surface - matches application surface
        },
        tertiary: {
            main: '#004080', // Slightly lighter navy for accents
        },
        quaternary: {
            main: '#5F6368', // Secondary text color for contrast
        },
    },
    // Remove shadow effects for a flatter, cleaner interface
    shadows: Array(25).fill('none'),
};

export default jbrowseTheme;

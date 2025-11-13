// frontend/src/config/genomes/theme.ts
// JBrowse theme configuration

import { ThemeConfig } from './types';

/**
 * JBrowse theme configuration
 * Defines the color palette and visual styling for the genome browser
 */
const jbrowseTheme: ThemeConfig = {
    palette: {
        primary: {
            main: '#202124',
        },
        secondary: {
            main: '#ffffffff',
        },
        tertiary: {
            main: '#F1F3F4',
        },
        quaternary: {
            main: '#092d5cff',
        },
    },
    // Remove shadow effects for a flatter interface
    shadows: Array(25).fill('none'),
};

export default jbrowseTheme;

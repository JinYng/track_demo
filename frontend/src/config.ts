/**
 * @deprecated This file is deprecated and maintained only for backward compatibility.
 * 
 * Please use the new configuration system instead:
 * 
 * ```typescript
 * import { getDefaultGenomeConfig } from './config/genomes';
 * const config = getDefaultGenomeConfig();
 * ```
 * 
 * For specific genome configurations:
 * 
 * ```typescript
 * import { getGenomeConfig } from './config/genomes';
 * const hg38Config = getGenomeConfig('hg38');
 * ```
 * 
 * This file will be removed in a future version.
 */

import { getDefaultGenomeConfig } from './config/genomes';

// Thin wrapper that delegates to the new configuration system
const viewConfig = getDefaultGenomeConfig();

export default viewConfig;
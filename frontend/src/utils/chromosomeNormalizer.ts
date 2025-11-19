/**
 * 染色体名称标准化工具
 * 处理不同的染色体命名约定（chr1 vs 1）
 */

/**
 * 染色体别名映射
 * 基于 UCSC/Ensembl/NCBI 等不同数据源的命名约定
 */
const CHROMOSOME_ALIASES: Record<string, string[]> = {
    // 常染色体 1-22
    '1': ['chr1', '1'],
    '2': ['chr2', '2'],
    '3': ['chr3', '3'],
    '4': ['chr4', '4'],
    '5': ['chr5', '5'],
    '6': ['chr6', '6'],
    '7': ['chr7', '7'],
    '8': ['chr8', '8'],
    '9': ['chr9', '9'],
    '10': ['chr10', '10'],
    '11': ['chr11', '11'],
    '12': ['chr12', '12'],
    '13': ['chr13', '13'],
    '14': ['chr14', '14'],
    '15': ['chr15', '15'],
    '16': ['chr16', '16'],
    '17': ['chr17', '17'],
    '18': ['chr18', '18'],
    '19': ['chr19', '19'],
    '20': ['chr20', '20'],
    '21': ['chr21', '21'],
    '22': ['chr22', '22'],

    // 性染色体
    'X': ['chrX', 'X'],
    'Y': ['chrY', 'Y'],

    // 线粒体
    'M': ['chrM', 'M', 'MT', 'chrMT'],
    'MT': ['chrM', 'M', 'MT', 'chrMT'],
}

/**
 * 标准化染色体名称
 * 将各种格式统一转换为指定格式
 * 
 * @param chromosome 输入的染色体名称
 * @param format 目标格式 ('ucsc' = 带chr前缀, 'ensembl' = 不带chr前缀)
 * @returns 标准化后的染色体名称
 */
export function normalizeChromosome(
    chromosome: string,
    format: 'ucsc' | 'ensembl' = 'ucsc'
): string {
    // 移除空格并转大写
    const cleaned = chromosome.trim().toUpperCase()

    // 移除 chr 前缀用于查找
    const withoutChr = cleaned.replace(/^CHR/i, '')

    // 在别名映射中查找
    for (const [key, aliases] of Object.entries(CHROMOSOME_ALIASES)) {
        const aliasesUpper = aliases.map(a => a.toUpperCase())
        if (aliasesUpper.includes(cleaned) || aliasesUpper.includes(withoutChr)) {
            // 根据目标格式返回
            if (format === 'ucsc') {
                // UCSC 格式: chr1, chr2, chrX, chrM
                if (key === 'M' || key === 'MT') {
                    return 'chrM'
                }
                return `chr${key}`
            } else {
                // Ensembl 格式: 1, 2, X, MT
                if (key === 'M') {
                    return 'MT'
                }
                return key
            }
        }
    }

    // 如果没找到，返回原始输入（可能是非标准染色体）
    return chromosome
}

/**
 * 检测 JBrowse assembly 使用的染色体命名格式
 * 
 * @param viewState JBrowse view state
 * @returns 'ucsc' 或 'ensembl'
 */
export function detectChromosomeFormat(viewState: any): 'ucsc' | 'ensembl' {
    try {
        const { session } = viewState
        const view = session?.views?.[0]

        if (!view) {
            return 'ucsc' // 默认使用 UCSC 格式
        }

        // 检查当前显示的染色体名称
        const currentRegion = view.displayedRegions?.[0]
        if (currentRegion?.refName) {
            const refName = currentRegion.refName
            // 如果以 chr 开头，使用 UCSC 格式
            if (refName.toLowerCase().startsWith('chr')) {
                return 'ucsc'
            } else {
                return 'ensembl'
            }
        }

        // 检查 assembly 的参考序列名称
        const assembly = viewState.assemblyManager?.get?.(view.displayedRegions?.[0]?.assemblyName)
        if (assembly?.regions) {
            const firstRegion = assembly.regions[0]
            if (firstRegion?.refName?.toLowerCase().startsWith('chr')) {
                return 'ucsc'
            } else {
                return 'ensembl'
            }
        }

        return 'ucsc' // 默认
    } catch (error) {
        console.warn('Failed to detect chromosome format:', error)
        return 'ucsc'
    }
}

/**
 * 智能标准化染色体名称
 * 自动检测 JBrowse 使用的格式并转换
 * 
 * @param chromosome 输入的染色体名称
 * @param viewState JBrowse view state
 * @returns 标准化后的染色体名称
 */
export function smartNormalizeChromosome(
    chromosome: string,
    viewState: any
): string {
    const format = detectChromosomeFormat(viewState)
    return normalizeChromosome(chromosome, format)
}

/**
 * 验证染色体名称是否有效
 * 
 * @param chromosome 染色体名称
 * @returns 是否有效
 */
export function isValidChromosome(chromosome: string): boolean {
    const cleaned = chromosome.trim().toUpperCase().replace(/^CHR/i, '')

    // 检查是否在别名映射中
    for (const aliases of Object.values(CHROMOSOME_ALIASES)) {
        const aliasesUpper = aliases.map(a => a.toUpperCase())
        if (aliasesUpper.includes(cleaned) || aliasesUpper.includes(`CHR${cleaned}`)) {
            return true
        }
    }

    return false
}

/**
 * 获取染色体的所有别名
 * 
 * @param chromosome 染色体名称
 * @returns 所有别名数组
 */
export function getChromosomeAliases(chromosome: string): string[] {
    const cleaned = chromosome.trim().toUpperCase().replace(/^CHR/i, '')

    for (const aliases of Object.values(CHROMOSOME_ALIASES)) {
        const aliasesUpper = aliases.map(a => a.toUpperCase())
        if (aliasesUpper.includes(cleaned) || aliasesUpper.includes(`CHR${cleaned}`)) {
            return aliases
        }
    }

    return [chromosome]
}

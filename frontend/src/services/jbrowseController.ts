/**
 * JBrowse Controller
 * 控制 JBrowse 视图的导航和状态管理
 */

export interface LocationInfo {
    chromosome: string
    start: number
    end: number
}

export interface NavigationResult {
    success: boolean
    message: string
    location?: LocationInfo
    error?: string
}

export class JBrowseController {
    private viewState: any

    constructor(viewState: any) {
        this.viewState = viewState
    }

    /**
     * 导航到指定位置
     */
    async navigateToLocation(
        chromosome: string,
        start: number,
        end: number
    ): Promise<NavigationResult> {
        try {
            console.log(`🧭 Navigating to ${chromosome}:${start}-${end}`)

            const { session } = this.viewState
            if (!session) {
                return {
                    success: false,
                    message: 'Session not found',
                    error: 'viewState.session is undefined'
                }
            }

            const views = session.views
            if (!views || views.length === 0) {
                return {
                    success: false,
                    message: 'No views found',
                    error: 'session.views is empty'
                }
            }

            const view = views[0]

            // 检测当前使用的染色体命名格式
            let chromosomeFormat: 'ucsc' | 'ensembl' = 'ucsc'
            try {
                const configFormat = this.viewState.config?.configuration?.chromosomeFormat
                if (configFormat === 'ucsc' || configFormat === 'ensembl') {
                    chromosomeFormat = configFormat
                    console.log(`📋 Using chromosome format from config: ${chromosomeFormat}`)
                }
            } catch (error) {
                console.warn('Failed to read chromosomeFormat from config:', error)
            }

            // 如果配置中没有，则从当前显示的染色体检测
            if (!chromosomeFormat) {
                const currentRegion = view.displayedRegions?.[0]
                chromosomeFormat = currentRegion?.refName?.toLowerCase().startsWith('chr') ? 'ucsc' : 'ensembl'
                console.log(`📋 Detected chromosome format from view: ${chromosomeFormat}`)
            }

            // 标准化染色体名称以匹配格式
            let normalizedChromosome = chromosome
            if (chromosomeFormat === 'ucsc' && !chromosome.toLowerCase().startsWith('chr')) {
                normalizedChromosome = `chr${chromosome}`
                console.log(`🔄 Normalized: ${chromosome} -> ${normalizedChromosome}`)
            } else if (chromosomeFormat === 'ensembl' && chromosome.toLowerCase().startsWith('chr')) {
                normalizedChromosome = chromosome.replace(/^chr/i, '')
                console.log(`🔄 Normalized: ${chromosome} -> ${normalizedChromosome}`)
            }

            // 尝试导航方法 1: navToLocString
            if (typeof view.navToLocString === 'function') {
                const locString = `${normalizedChromosome}:${start}..${end}`
                console.log(`✅ Using navToLocString: ${locString}`)
                view.navToLocString(locString)

                // 等待导航完成
                await new Promise(resolve => setTimeout(resolve, 300))

                // 验证导航是否成功
                const currentRegion = view.displayedRegions?.[0]
                if (currentRegion) {
                    return {
                        success: true,
                        message: `Successfully navigated to ${locString}`,
                        location: {
                            chromosome: currentRegion.refName,
                            start: currentRegion.start,
                            end: currentRegion.end
                        }
                    }
                }
            }

            // 尝试导航方法 2: setDisplayedRegions
            if (typeof view.setDisplayedRegions === 'function') {
                console.log(`✅ Using setDisplayedRegions`)
                view.setDisplayedRegions([
                    {
                        refName: normalizedChromosome,
                        start: start,
                        end: end,
                        assemblyName: view.displayedRegions?.[0]?.assemblyName || 'hg38'
                    }
                ])

                await new Promise(resolve => setTimeout(resolve, 300))

                const currentRegion = view.displayedRegions?.[0]
                if (currentRegion) {
                    return {
                        success: true,
                        message: `Successfully navigated using setDisplayedRegions`,
                        location: {
                            chromosome: currentRegion.refName,
                            start: currentRegion.start,
                            end: currentRegion.end
                        }
                    }
                }
            }

            // 如果都不可用
            return {
                success: false,
                message: 'No suitable navigation method found',
                error: 'Neither navToLocString nor setDisplayedRegions available'
            }

        } catch (error: any) {
            console.error('❌ Navigation failed:', error)
            return {
                success: false,
                message: 'Navigation failed',
                error: error.message || String(error)
            }
        }
    }

    /**
     * 获取当前位置
     */
    getCurrentLocation(): NavigationResult {
        try {
            const { session } = this.viewState
            const view = session?.views?.[0]

            if (!view) {
                return {
                    success: false,
                    message: 'View not found'
                }
            }

            const currentRegion = view.displayedRegions?.[0]
            if (currentRegion) {
                return {
                    success: true,
                    message: 'Current location retrieved',
                    location: {
                        chromosome: currentRegion.refName,
                        start: currentRegion.start,
                        end: currentRegion.end
                    }
                }
            }

            return {
                success: false,
                message: 'No displayed regions found'
            }
        } catch (error: any) {
            return {
                success: false,
                message: 'Failed to get current location',
                error: error.message
            }
        }
    }

    /**
     * 更新 viewState（用于重新初始化）
     */
    updateViewState(viewState: any) {
        this.viewState = viewState
    }
}

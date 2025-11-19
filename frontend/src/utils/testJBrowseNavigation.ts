/**
 * JBrowse 导航功能测试脚本
 * 用于验证 JBrowse API 是否可以被程序化控制
 */

export interface NavigationTestResult {
    success: boolean
    message: string
    currentLocation?: {
        chromosome: string
        start: number
        end: number
    }
    error?: string
}

/**
 * 测试 JBrowse 导航功能
 * @param viewState JBrowse view state 对象
 * @param chromosome 目标染色体
 * @param start 起始位置
 * @param end 结束位置
 */
export async function testJBrowseNavigation(
    viewState: any,
    chromosome: string,
    start: number,
    end: number
): Promise<NavigationTestResult> {
    try {
        console.log('🧪 Testing JBrowse navigation...')
        console.log(`Target: ${chromosome}:${start}-${end}`)

        // 获取 session 和 view
        const { session } = viewState
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
        console.log('📍 Current view:', view)

        // 1. 优先从配置中读取染色体格式
        let chromosomeFormat: 'ucsc' | 'ensembl' = 'ucsc'
        try {
            const configFormat = viewState.config?.configuration?.chromosomeFormat
            if (configFormat === 'ucsc' || configFormat === 'ensembl') {
                chromosomeFormat = configFormat
                console.log(`📋 Chromosome format from config: ${chromosomeFormat}`)
            }
        } catch (error) {
            console.warn('Failed to read chromosomeFormat from config:', error)
        }

        // 2. 如果配置中没有，则从当前显示的染色体检测
        if (!chromosomeFormat) {
            const currentRegion = view.displayedRegions?.[0]
            chromosomeFormat = currentRegion?.refName?.toLowerCase().startsWith('chr') ? 'ucsc' : 'ensembl'
            console.log(`📋 Detected chromosome format from view: ${chromosomeFormat}`)
        }

        // 3. 标准化染色体名称以匹配格式
        let normalizedChromosome = chromosome
        if (chromosomeFormat === 'ucsc' && !chromosome.toLowerCase().startsWith('chr')) {
            normalizedChromosome = `chr${chromosome}`
            console.log(`🔄 Normalized chromosome: ${chromosome} -> ${normalizedChromosome}`)
        } else if (chromosomeFormat === 'ensembl' && chromosome.toLowerCase().startsWith('chr')) {
            normalizedChromosome = chromosome.replace(/^chr/i, '')
            console.log(`🔄 Normalized chromosome: ${chromosome} -> ${normalizedChromosome}`)
        }

        // 尝试导航方法 1: navToLocString
        if (typeof view.navToLocString === 'function') {
            console.log('✅ Found navToLocString method')
            const locString = `${normalizedChromosome}:${start}..${end}`
            view.navToLocString(locString)

            // 等待一小段时间让导航完成
            await new Promise(resolve => setTimeout(resolve, 500))

            // 验证导航是否成功
            const currentRegion = view.displayedRegions?.[0]
            if (currentRegion) {
                return {
                    success: true,
                    message: `Successfully navigated to ${locString}`,
                    currentLocation: {
                        chromosome: currentRegion.refName,
                        start: currentRegion.start,
                        end: currentRegion.end
                    }
                }
            }
        }

        // 尝试导航方法 2: setDisplayedRegions
        if (typeof view.setDisplayedRegions === 'function') {
            console.log('✅ Found setDisplayedRegions method')
            view.setDisplayedRegions([
                {
                    refName: normalizedChromosome,
                    start: start,
                    end: end,
                    assemblyName: view.displayedRegions?.[0]?.assemblyName || 'hg38'
                }
            ])

            await new Promise(resolve => setTimeout(resolve, 500))

            const currentRegion = view.displayedRegions?.[0]
            if (currentRegion) {
                return {
                    success: true,
                    message: `Successfully navigated using setDisplayedRegions`,
                    currentLocation: {
                        chromosome: currentRegion.refName,
                        start: currentRegion.start,
                        end: currentRegion.end
                    }
                }
            }
        }

        // 如果都不可用，列出可用的方法
        const availableMethods = Object.keys(view).filter(key =>
            typeof view[key] === 'function'
        )
        console.log('📋 Available methods:', availableMethods)

        return {
            success: false,
            message: 'No suitable navigation method found',
            error: `Available methods: ${availableMethods.join(', ')}`
        }

    } catch (error: any) {
        console.error('❌ Navigation test failed:', error)
        return {
            success: false,
            message: 'Navigation test failed',
            error: error.message || String(error)
        }
    }
}

/**
 * 获取当前 JBrowse 视图位置
 */
export function getCurrentLocation(viewState: any): NavigationTestResult {
    try {
        const { session } = viewState
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
                currentLocation: {
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
 * 在浏览器控制台中暴露测试函数
 */
export function exposeNavigationTest(viewState: any) {
    (window as any).testJBrowseNavigation = async (
        chromosome: string,
        start: number,
        end: number
    ) => {
        const result = await testJBrowseNavigation(viewState, chromosome, start, end)
        console.log('Test result:', result)
        return result
    }

    (window as any).getCurrentLocation = () => {
        const result = getCurrentLocation(viewState)
        console.log('Current location:', result)
        return result
    }

    console.log('🎯 Navigation test functions exposed to window:')
    console.log('  - testJBrowseNavigation(chromosome, start, end)')
    console.log('  - getCurrentLocation()')
    console.log('')
    console.log('Example: testJBrowseNavigation("chr1", 1000000, 2000000)')
}

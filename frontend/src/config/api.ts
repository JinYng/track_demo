/**
 * API 配置文件
 * 集中管理所有 API 端点
 */

// 从环境变量获取 API 基础 URL，如果没有则使用默认值
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const WS_BASE_URL =
    import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000'

/**
 * API 端点
 */
export const API_ENDPOINTS = {
    // AI 相关
    AI_DEFAULT_CONFIG: `${API_BASE_URL}/api/ai/default-config`,
    AI_TEST_CONFIG: `${API_BASE_URL}/api/ai/test-config`,

    // 基因组学相关
    GENOMICS_INFO: `${API_BASE_URL}/api/genomics/info`,

    // JBrowse 相关
    JBROWSE_TRACKS: `${API_BASE_URL}/api/jbrowse/tracks`,
    JBROWSE_NAVIGATE: `${API_BASE_URL}/api/jbrowse/navigate`,

    // WebSocket
    WEBSOCKET: `${WS_BASE_URL}/ws`,
} as const

/**
 * HTTP 请求辅助函数
 */
export const apiClient = {
    async get<T>(url: string): Promise<T> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    },

    async post<T>(url: string, data: any): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
    },
}

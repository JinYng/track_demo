import { createContext, useContext, useState, ReactNode } from 'react'

/**
 * 会话配置接口
 * 用于管理整个工作会话的状态
 */
export interface SessionConfig {
  sessionId: string
  name: string
  organism: string
  referenceGenome: string
  tracks: any[]
  currentLocation?: string
}

/**
 * SessionContext类型定义
 */
interface SessionContextType {
  config: SessionConfig
  updateConfig: (partial: Partial<SessionConfig>) => void
}

/**
 * 创建SessionContext
 */
const SessionContext = createContext<SessionContextType | null>(null)

/**
 * SessionProvider组件
 * 提供会话配置和更新方法
 */
export function SessionProvider({
  children,
  initialConfig,
}: {
  children: ReactNode
  initialConfig: SessionConfig
}) {
  const [config, setConfig] = useState<SessionConfig>(initialConfig)

  /**
   * 更新会话配置的一部分
   */
  const updateConfig = (partial: Partial<SessionConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }))
  }

  return (
    <SessionContext.Provider value={{ config, updateConfig }}>
      {children}
    </SessionContext.Provider>
  )
}

/**
 * useSession Hook
 * 在组件中使用会话配置
 *
 * @throws Error 如果在SessionProvider外部使用
 */
export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}

/**
 * 默认会话配置
 */
export const defaultSessionConfig: SessionConfig = {
  sessionId: 'default',
  name: 'Untitled Session',
  organism: 'Human',
  referenceGenome: 'hg38', // 默认使用 hg38
  tracks: [],
  currentLocation: 'chr10:29,838,565..29,838,850',
}

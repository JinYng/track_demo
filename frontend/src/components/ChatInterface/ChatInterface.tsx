import { useState, useEffect, useCallback } from 'react'
import { ModelConfiguration } from '../ModelConfiguration'
import { ChatHistory } from '../ChatHistory'
import { UserInput } from '../UserInput'
import { Message } from '../MessageBubble'
import { websocketService } from '../../services/websocket'
import './ChatInterface.css'

// 应用配置接口 - 用于UI显示和连接配置
interface AppConfig {
  apiBaseUrl: string
  apiKey: string
  modelName: string
}

// 聊天状态接口 - 仅包含对话历史
interface ChatState {
  messages: Message[]
}

interface ChatInterfaceProps {
  viewState: any // JBrowse viewState
}

export function ChatInterface({ viewState: _viewState }: ChatInterfaceProps) {
  // 应用配置状态 - 用于UI显示和API连接
  const [appConfig, setAppConfig] = useState<AppConfig>({
    apiBaseUrl: 'https://api-inference.modelscope.cn/v1',
    apiKey: 'ms-02d3cecc-80df-47ed-b6e8-811865cb55e6', // 默认使用测试模式
    modelName: 'Qwen/Qwen3-VL-8B-Instruct',
  })

  // 聊天状态 - 仅包含纯粹的对话历史
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [_isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle')

  // WebSocket消息处理器
  const handleWebSocketMessage = useCallback((response: any) => {
    // Handle connection test response
    if (response.type === 'test_connection_result') {
      setConnectionStatus(response.success ? 'success' : 'error')
      return
    }

    // Handle AI response
    let content = 'Response received'

    // Handle different response formats
    if (response.response?.content) {
      content = response.response.content
    } else if (response.message) {
      content = response.message
    } else if (response.content) {
      content = response.content
    }

    const aiMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'ai',
      timestamp: new Date(),
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage],
    }))
    setIsLoading(false)
  }, [])

  // WebSocket connection state handler
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected)
    if (!connected) {
      setIsLoading(false)
    }
  }, [])

  // 初始化WebSocket连接
  useEffect(() => {
    const initWebSocket = async () => {
      try {
        await websocketService.connect()
        websocketService.onMessage(handleWebSocketMessage)
        websocketService.onConnectionChange(handleConnectionChange)
      } catch (error) {
        console.error('WebSocket连接失败:', error)
        // 添加连接失败的消息
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: '无法连接到后端服务，请检查后端是否正在运行。',
          sender: 'ai',
          timestamp: new Date(),
        }
        setChatState({ messages: [errorMessage] })
      }
    }

    initWebSocket()

    // 清理函数
    return () => {
      websocketService.removeMessageHandler(handleWebSocketMessage)
      websocketService.removeConnectionHandler(handleConnectionChange)
      websocketService.disconnect()
    }
  }, [handleWebSocketMessage, handleConnectionChange])

  const handleTestConnection = useCallback(
    async (config: AppConfig): Promise<boolean> => {
      if (!websocketService.isConnected()) {
        setConnectionStatus('error')
        return false
      }

      setConnectionStatus('testing')

      try {
        const testMessage = {
          type: 'test_connection',
          config: {
            apiBaseUrl: config.apiBaseUrl,
            apiKey: config.apiKey,
            modelName: config.modelName,
          },
        }

        await websocketService.sendMessage(JSON.stringify(testMessage), config)

        // 等待响应（通过handleWebSocketMessage处理）
        return true
      } catch (error) {
        console.error('连接测试失败:', error)
        setConnectionStatus('error')
        return false
      }
    },
    [],
  )

  const handleSendMessage = async (content: string) => {
    // 检查模型配置
    if (!appConfig.apiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: '请先配置AI模型的API Key。',
        sender: 'ai',
        timestamp: new Date(),
      }
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }))
      return
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }))
    setIsLoading(true)

    try {
      if (!websocketService.isConnected) {
        throw new Error('WebSocket not connected')
      }

      // 构建干净的API请求 - 只发送对话历史，不包含配置信息
      await websocketService.sendMessage(content, appConfig, chatState.messages)
    } catch (error) {
      console.error('Failed to send message:', error)

      // 添加错误消息
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: 'ai',
        timestamp: new Date(),
      }
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }))
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-interface">
      {/* 模型配置组件 - 使用 appConfig */}
      <ModelConfiguration
        config={appConfig}
        onConfigChange={setAppConfig}
        onTestConnection={handleTestConnection}
        connectionStatus={connectionStatus}
      />

      {/* 聊天历史组件 - 只使用 chatState */}
      <ChatHistory messages={chatState.messages} isLoading={isLoading} />

      {/* 用户输入组件 */}
      <UserInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  )
}

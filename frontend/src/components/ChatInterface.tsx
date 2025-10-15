import { useState } from 'react'
import { ModelConfiguration } from './ModelConfiguration'
import { ChatHistory } from './ChatHistory'
import { UserInput } from './UserInput'
import { Message } from './MessageBubble'

interface ModelConfig {
  apiBaseUrl: string
  apiKey: string
  modelName: string
}

interface ChatInterfaceProps {
  viewState: any // JBrowse viewState
}

export function ChatInterface({ viewState }: ChatInterfaceProps) {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    apiBaseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    modelName: 'gpt-4'
  })

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // TODO: 这里将来会通过WebSocket发送到后端
      // 现在先模拟AI回复
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `我收到了您的问题："${content}"。目前我正在开发中，很快就能为您提供基因组学分析服务！`,
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('发送消息失败:', error)
      setIsLoading(false)
    }
  }

  return (
    <div 
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff'
      }}
    >
      {/* 模型配置组件 */}
      <ModelConfiguration 
        config={modelConfig}
        onConfigChange={setModelConfig}
      />

      {/* 聊天历史组件 */}
      <ChatHistory messages={messages} />

      {/* 用户输入组件 */}
      <UserInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  )
}
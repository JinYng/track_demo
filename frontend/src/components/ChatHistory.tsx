import { useEffect, useRef } from 'react'
import { MessageBubble, Message } from './MessageBubble'

interface ChatHistoryProps {
  messages: Message[]
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div 
      ref={scrollRef}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 0',
        backgroundColor: '#ffffff'
      }}
    >
      {messages.length === 0 ? (
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6c757d',
            textAlign: 'center',
            padding: '32px'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧬</div>
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
            AI 基因组分析助手
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
            开始与AI对话，探索基因组数据<br />
            例如：显示BRCA1基因的位置
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
    </div>
  )
}
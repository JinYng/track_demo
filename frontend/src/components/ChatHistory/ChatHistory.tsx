import { useEffect, useRef } from 'react'
import { MessageBubble, Message } from '../MessageBubble'
import './ChatHistory.css'

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
    <div ref={scrollRef} className="chat-history">
      {messages.length === 0 ? (
        <div className="chat-history__empty">
          <div className="chat-history__empty-title">AI 基因组分析助手</div>
          <div className="chat-history__empty-subtitle">
            开始与AI对话，探索基因组数据
            <br />
            例如：显示BRCA1基因的位置
          </div>
        </div>
      ) : (
        messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))
      )}
    </div>
  )
}

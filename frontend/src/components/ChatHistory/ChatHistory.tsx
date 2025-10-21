import { useEffect, useRef } from 'react'
import { MessageBubble, Message } from '../MessageBubble'
import { ThinkingIndicator } from '../ThinkingIndicator'
import './ChatHistory.css'

interface ChatHistoryProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatHistory({ messages, isLoading = false }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div ref={scrollRef} className="chat-history">
      {messages.length === 0 ? (
        <div className="chat-history__empty">
          <div className="chat-history__empty-title">AI Genomics Assistant</div>
          <div className="chat-history__empty-subtitle">
            Start chatting with AI to explore genomic data
            <br />
            Example: Show me the location of BRCA1 gene
          </div>
        </div>
      ) : (
        <>
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <ThinkingIndicator />}
        </>
      )}
    </div>
  )
}

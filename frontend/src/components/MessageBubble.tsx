interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user'
  
  return (
    <div 
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        padding: '0 16px'
      }}
    >
      <div 
        style={{
          maxWidth: '80%',
          padding: '12px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          backgroundColor: isUser ? '#0969da' : '#f6f8fa',
          color: isUser ? 'white' : '#24292f',
          fontSize: '14px',
          lineHeight: '1.5',
          wordBreak: 'break-word',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div>{message.content}</div>
        <div 
          style={{
            fontSize: '11px',
            opacity: 0.7,
            marginTop: '4px',
            textAlign: isUser ? 'right' : 'left'
          }}
        >
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}

export type { Message }
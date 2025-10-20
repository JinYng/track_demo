import ReactMarkdown from 'react-markdown'
import './MessageBubble.css'

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
      className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--ai'}`}
    >
      <div className="message-bubble__content">
        <div className="message-bubble__text">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <div className="message-bubble__timestamp">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}

export type { Message }

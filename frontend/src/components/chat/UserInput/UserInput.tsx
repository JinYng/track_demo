import { useState, useRef, KeyboardEvent } from 'react'
import './UserInput.css'

interface UserInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function UserInput({ onSendMessage, disabled = false }: UserInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
      // 重置textarea高度
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter 或 Cmd+Enter 发送消息
        e.preventDefault()
        handleSend()
      } else if (!e.shiftKey) {
        // 单独的Enter发送消息，Shift+Enter换行
        e.preventDefault()
        handleSend()
      }
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)

    // 自动调整高度
    const textarea = e.target
    textarea.style.height = 'auto'
    const newHeight = Math.min(textarea.scrollHeight, 120) // 最大高度120px
    textarea.style.height = `${newHeight}px`
  }

  return (
    <div className="user-input">
      <div className="user-input__container">
        <textarea
          ref={textareaRef}
          className="user-input__textarea"
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about genomics data... (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
        />

        <button
          className={`user-input__button ${message.trim() && !disabled
              ? 'user-input__button--active'
              : 'user-input__button--disabled'
            }`}
          onClick={handleSend}
          disabled={!message.trim() || disabled}
        >
          {disabled ? '...' : 'Send'}
        </button>
      </div>

      <div className="user-input__hint">
        Enter to send • Shift+Enter for new line • Ctrl+Enter to force send
      </div>
    </div>
  )
}

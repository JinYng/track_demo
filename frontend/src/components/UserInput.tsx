import { useState, useRef, KeyboardEvent } from 'react'

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
    <div
      style={{
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end',
          backgroundColor: 'white',
          border: '1px solid #d0d7de',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="输入您的基因组学问题... (Enter发送，Shift+Enter换行)"
          disabled={disabled}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '14px',
            lineHeight: '1.5',
            minHeight: '20px',
            maxHeight: '120px',
            fontFamily: 'inherit',
            backgroundColor: 'transparent',
          }}
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          style={{
            padding: '8px 12px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor:
              message.trim() && !disabled ? '#0969da' : '#d0d7de',
            color: message.trim() && !disabled ? 'white' : '#6c757d',
            cursor: message.trim() && !disabled ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            minWidth: '60px',
          }}
        >
          {disabled ? '...' : '发送'}
        </button>
      </div>

      <div
        style={{
          fontSize: '12px',
          color: '#6c757d',
          marginTop: '8px',
          textAlign: 'center',
        }}
      >
        Enter 发送 • Shift+Enter 换行 • Ctrl+Enter 强制发送
      </div>
    </div>
  )
}

import React from 'react'
import './ThinkingIndicator.css'

export function ThinkingIndicator() {
  return (
    <div className="chat-bubble thinking">
      <div className="dots-container">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
    </div>
  )
}

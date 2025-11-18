import ReactMarkdown from 'react-markdown'
import { Box, Typography, IconButton } from '@mui/material'
import { ContentCopy as CopyIcon } from '@mui/icons-material'
import 'github-markdown-css/github-markdown.css'

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

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
  }

  return (
    <Box
      sx={{
        py: 3,
        px: 4,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover .message-actions': {
          opacity: 1,
        },
      }}
    >
      {/* Role Label */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 1.5,
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontSize: '0.75rem',
        }}
      >
        {isUser ? 'User' : 'Model'}
      </Typography>

      {/* Message Content */}
      <Box
        className={isUser ? '' : 'markdown-body'}
        sx={{
          fontSize: '0.8rem !important',
          lineHeight: 1.6,
          color: 'text.primary',
          '& .markdown-body': {
            backgroundColor: 'transparent',
            fontSize: 'inherit !important',
          },
          '&.markdown-body': {
            fontSize: '0.8rem !important',
          },
          '& p, & h1, & h2, & h3, & h4, & h5, & h6, & li, & td, & th': {
            fontSize: 'inherit !important',
          },
        }}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </Box>

      {/* Action Buttons - Only for AI messages */}
      {!isUser && (
        <Box
          className="message-actions"
          sx={{
            display: 'flex',
            gap: 0.5,
            mt: 2,
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
        >
          <IconButton size="small" onClick={handleCopy} title="Copy">
            <CopyIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  )
}

export type { Message }

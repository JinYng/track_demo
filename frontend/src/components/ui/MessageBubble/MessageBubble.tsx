import ReactMarkdown from 'react-markdown'
import { Box, Paper, Typography, Avatar } from '@mui/material'
import { Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material'

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
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          gap: 1,
          maxWidth: '80%',
          alignItems: 'flex-start',
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: isUser ? 'primary.main' : 'secondary.main',
            fontSize: '1rem',
          }}
        >
          {isUser ? (
            <PersonIcon fontSize="small" />
          ) : (
            <BotIcon fontSize="small" />
          )}
        </Avatar>

        {/* Message Content */}
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={1}
            sx={{
              padding: 1.5,
              borderRadius: isUser
                ? '18px 18px 4px 18px'
                : '18px 18px 18px 4px',
              backgroundColor: isUser ? 'primary.main' : 'grey.100',
              color: isUser ? 'primary.contrastText' : 'text.primary',
              wordBreak: 'break-word',
              '& p': {
                margin: '4px 0',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              },
              '& p:first-of-type': {
                marginTop: 0,
              },
              '& p:last-of-type': {
                marginBottom: 0,
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                margin: '8px 0 4px 0',
                fontWeight: 600,
              },
              '& h1': { fontSize: '1.2em' },
              '& h2': { fontSize: '1.1em' },
              '& h3': { fontSize: '1.05em' },
              '& ul, & ol': {
                margin: '4px 0',
                paddingLeft: '16px',
              },
              '& li': {
                margin: '2px 0',
              },
              '& code': {
                backgroundColor: isUser
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(0,0,0,0.1)',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.9em',
              },
              '& pre': {
                backgroundColor: isUser
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(0,0,0,0.1)',
                padding: '8px',
                borderRadius: '6px',
                overflowX: 'auto',
                margin: '8px 0',
                '& code': {
                  backgroundColor: 'transparent',
                  padding: 0,
                },
              },
              '& blockquote': {
                borderLeft: `3px solid ${isUser ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)'}`,
                margin: '8px 0',
                paddingLeft: '12px',
                fontStyle: 'italic',
              },
              '& strong': {
                fontWeight: 600,
              },
              '& a': {
                color: 'inherit',
                textDecoration: 'underline',
              },
              '& table': {
                borderCollapse: 'collapse',
                margin: '8px 0',
                width: '100%',
              },
              '& th, & td': {
                border: `1px solid ${isUser ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                padding: '4px 8px',
                textAlign: 'left',
              },
              '& th': {
                backgroundColor: isUser
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(0,0,0,0.1)',
                fontWeight: 600,
              },
            }}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </Paper>

          {/* Timestamp */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 0.5,
              textAlign: isUser ? 'right' : 'left',
              opacity: 0.7,
            }}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export type { Message }

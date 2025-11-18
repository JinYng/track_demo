import { useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { MessageBubble, Message } from '../../ui/MessageBubble'
import { ThinkingIndicator } from '../../ui/ThinkingIndicator'

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
    <Box
      ref={scrollRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        py: 2,
        backgroundColor: 'background.paper',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.3)',
          },
        },
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            px: 4,
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            AI Genomics Assistant
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Start chatting with AI to explore genomic data
            <br />
            Example: Show me the location of BRCA1 gene
          </Typography>
        </Box>
      ) : (
        <>
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <ThinkingIndicator />}
        </>
      )}
    </Box>
  )
}

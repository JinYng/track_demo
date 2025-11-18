import { useState, KeyboardEvent } from 'react'
import { Box, TextField, IconButton, Typography, Paper } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'

interface UserInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export function UserInput({ onSendMessage, disabled = false }: UserInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage)
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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

  return (
    <Box
      sx={{
        padding: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'grey.50',
      }}
    >
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1.5,
          padding: 1.5,
          borderRadius: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={5}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about genomics data..."
          disabled={disabled}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '14px',
              '& textarea': {
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '3px',
                },
              },
            },
          }}
          sx={{
            '& .MuiInputBase-root': {
              padding: 0,
            },
          }}
        />

        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="small"
          sx={{
            backgroundColor:
              message.trim() && !disabled ? 'primary.main' : 'grey.300',
            color: message.trim() && !disabled ? 'white' : 'grey.500',
            '&:hover': {
              backgroundColor:
                message.trim() && !disabled ? 'primary.dark' : 'grey.300',
            },
            '&.Mui-disabled': {
              backgroundColor: 'grey.300',
              color: 'grey.500',
            },
            width: 36,
            height: 36,
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Paper>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: 1,
        }}
      >
        Enter to send • Shift+Enter for new line • Ctrl+Enter to force send
      </Typography>
    </Box>
  )
}

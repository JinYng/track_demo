import { Box, Paper, Avatar, keyframes } from '@mui/material'
import { SmartToy as BotIcon } from '@mui/icons-material'

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`

export function ThinkingIndicator() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 2,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'flex-start',
        }}
      >
        {/* AI Avatar */}
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: 'secondary.main',
            fontSize: '1rem',
          }}
        >
          <BotIcon fontSize="small" />
        </Avatar>

        {/* Thinking Dots */}
        <Paper
          elevation={1}
          sx={{
            borderRadius: '18px 18px 18px 4px',
            padding: '12px 18px',
            backgroundColor: 'grey.100',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
          }}
        >
          {[0, 0.2, 0.4].map((delay, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                backgroundColor: 'grey.500',
                borderRadius: '50%',
                animation: `${bounce} 1.3s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </Paper>
      </Box>
    </Box>
  )
}

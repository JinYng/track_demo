import { Box, Typography, Skeleton } from '@mui/material'

export function ThinkingIndicator() {
  return (
    <Box
      sx={{
        py: 3,
        px: 4,
        borderBottom: '1px solid',
        borderColor: 'divider',
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
        Model
      </Typography>

      {/* Thinking Animation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Skeleton
          variant="text"
          width="60%"
          height={20}
          animation="wave"
          sx={{ fontSize: '0.8rem' }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          animation="wave"
          sx={{ fontSize: '0.8rem' }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          animation="wave"
          sx={{ fontSize: '0.8rem' }}
        />
      </Box>
    </Box>
  )
}

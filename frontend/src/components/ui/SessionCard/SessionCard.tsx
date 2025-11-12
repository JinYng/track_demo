import { Card, CardContent, Typography, CardActionArea } from '@mui/material'

interface SessionCardProps {
  name: string
  organism: string
  genome: string
  lastOpen: string
  onClick: () => void
}

export function SessionCard(props: SessionCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea
        onClick={props.onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h3" gutterBottom>
            {props.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {props.organism} - {props.genome}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Last open: {props.lastOpen}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

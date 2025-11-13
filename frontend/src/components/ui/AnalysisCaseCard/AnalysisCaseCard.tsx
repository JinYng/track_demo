import { Card, CardContent, Typography, CardActionArea } from '@mui/material'

interface AnalysisCaseCardProps {
  title: string
  speciesName: string
  assemblyId: string
  onClick: () => void
}

export function AnalysisCaseCard(props: AnalysisCaseCardProps) {
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
            {props.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {props.speciesName} - {props.assemblyId}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

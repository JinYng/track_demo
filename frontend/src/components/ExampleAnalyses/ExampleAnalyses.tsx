import { Box, Typography, Button, Grid } from '@mui/material'
import { AnalysisCase } from '../../types/analysisCase'
import { AnalysisCaseCard } from '../ui/AnalysisCaseCard/AnalysisCaseCard'

interface ExampleAnalysesProps {
  cases: AnalysisCase[]
  onCaseClick: (analysisCase: AnalysisCase) => void
  onImportClick?: () => void
}

export function ExampleAnalyses({
  cases,
  onCaseClick,
  onImportClick,
}: ExampleAnalysesProps) {
  return (
    <Box component="section">
      <Typography variant="h2" gutterBottom>
        Example Analyses
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cases.map(analysisCase => (
          <Grid item xs={12} sm={6} md={4} key={analysisCase.id}>
            <AnalysisCaseCard
              title={analysisCase.title}
              speciesName={analysisCase.speciesName}
              assemblyId={analysisCase.assemblyId}
              onClick={() => onCaseClick(analysisCase)}
            />
          </Grid>
        ))}
      </Grid>

      {onImportClick && (
        <Button variant="text" color="primary" onClick={onImportClick}>
          IMPORT SESSION FROM FILE...
        </Button>
      )}
    </Box>
  )
}

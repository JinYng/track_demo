import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Divider } from '@mui/material'
import { PageLayout } from '../components/layout/PageLayout/PageLayout'
import { CreateAnalysisModal } from '../components/SessionSetup'
import { GenomeSelector } from '../components/GenomeSelector'
import { EXAMPLE_CASES } from '../data/exampleCases'
import { ExampleAnalyses } from '../components/ExampleAnalyses'
import { AnalysisCase } from '../types/analysisCase'

export default function GenomesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showWizard, setShowWizard] = useState(false)

  const handleCreateSession = (_sessionData: any) => {
    // 创建新会话并导航到浏览器页面
    const newSessionId = Date.now().toString()
    navigate(`/browser/${newSessionId}`)
  }

  const handleNavigate = (assembly: string, position?: string) => {
    // 构建浏览器页面 URL
    const params = new URLSearchParams({
      assembly,
      ...(position && { position }),
    })
    navigate(`/browser?${params.toString()}`)
  }

  const handleCaseClick = (analysisCase: AnalysisCase) => {
    // 构建浏览器页面 URL，传递案例配置
    const params = new URLSearchParams({
      assembly: analysisCase.assemblyId,
      position: analysisCase.targetPosition,
    })
    navigate(`/browser?${params.toString()}`)
  }

  const handleImportClick = () => {
    // TODO: Implement import session functionality
    // Future implementation should:
    // 1. Open a file picker dialog to select JSON session files
    // 2. Parse and validate the session configuration file
    // 3. Extract assembly, position, and other session parameters
    // 4. Navigate to browser page with the imported session configuration
    // 5. Handle errors gracefully (invalid file format, missing fields, etc.)
    console.log('Import session clicked - placeholder functionality')
  }

  return (
    <PageLayout maxWidth="lg">
      {/* 欢迎区域 */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h1" gutterBottom>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('dashboard.subtitle')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setShowWizard(true)}
        >
          {t('dashboard.startAnalysis')}
        </Button>
      </Box>

      {/* 使用新的 GenomeSelector */}
      <GenomeSelector onNavigate={handleNavigate} />

      {/* 分割线 */}
      <Divider sx={{ my: 8 }} />

      {/* Example Analyses */}
      <ExampleAnalyses
        cases={EXAMPLE_CASES}
        onCaseClick={handleCaseClick}
        onImportClick={handleImportClick}
      />

      {/* 页脚 */}
      <Box
        component="footer"
        sx={{
          textAlign: 'center',
          mt: 8,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © 2025 CNCB Genome Browser
        </Typography>
      </Box>

      {/* 创建分析模态框 */}
      <CreateAnalysisModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onSubmit={handleCreateSession}
      />
    </PageLayout>
  )
}

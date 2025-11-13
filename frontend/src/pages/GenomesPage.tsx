import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Grid, Divider } from '@mui/material'
import { PageLayout } from '../components/layout/PageLayout/PageLayout'
import { SessionCard } from '../components/ui/SessionCard/SessionCard'
import { CreateAnalysisModal } from '../components/SessionSetup'
import { GenomeSelector } from '../components/GenomeSelector'

interface Session {
  id: string
  name: string
  organism: string
  genome: string
  lastOpen: string
}

// 模拟数据
const mockSessions: Session[] = [
  {
    id: '1',
    name: 'Patient A WES Variant Screening',
    organism: 'Human',
    genome: 'hg38',
    lastOpen: '2 hours ago',
  },
  {
    id: '2',
    name: 'TP53 Region Analysis',
    organism: 'Human',
    genome: 'hg38',
    lastOpen: '1 day ago',
  },
  {
    id: '3',
    name: 'Mouse Knockout Study',
    organism: 'Mouse',
    genome: 'mm10',
    lastOpen: '3 days ago',
  },
]

export default function GenomesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showWizard, setShowWizard] = useState(false)

  const handleOpenSession = (sessionId: string) => {
    navigate(`/browser/${sessionId}`)
  }

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

      {/* 最近会话 */}
      <Box component="section">
        <Typography variant="h2" gutterBottom>
          {t('dashboard.recentSessions')}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {mockSessions.map(session => (
            <Grid item xs={12} sm={6} md={4} key={session.id}>
              <SessionCard
                name={session.name}
                organism={session.organism}
                genome={session.genome}
                lastOpen={session.lastOpen}
                onClick={() => handleOpenSession(session.id)}
              />
            </Grid>
          ))}
        </Grid>

        <Button variant="text" color="primary">
          {t('dashboard.importSession')}
        </Button>
      </Box>

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

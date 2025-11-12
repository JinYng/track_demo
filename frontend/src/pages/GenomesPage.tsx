import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Divider,
} from '@mui/material'
import { PageLayout } from '../components/layout/PageLayout/PageLayout'
import { SessionCard } from '../components/ui/SessionCard/SessionCard'
import { CreateAnalysisModal } from '../components/SessionSetup'

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

const popularSpecies = ['Human', 'Mouse', 'Zebrafish', 'Fruitfly', 'Yeast']

export default function GenomesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showWizard, setShowWizard] = useState(false)
  const [selectedAssembly, setSelectedAssembly] = useState('hg38')
  const [positionSearch, setPositionSearch] = useState('')
  const [genomeSearch, setGenomeSearch] = useState('')

  const handleOpenSession = (sessionId: string) => {
    navigate(`/browser/${sessionId}`)
  }

  const handleCreateSession = (_sessionData: any) => {
    // 创建新会话并导航到浏览器页面
    const newSessionId = Date.now().toString()
    navigate(`/browser/${newSessionId}`)
  }

  const handleGoPosition = () => {
    // 占位符：后续实现位置跳转功能
    console.log('Navigate to:', selectedAssembly, positionSearch)
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

      {/* 物种与位置查询区 */}
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          bgcolor: 'background.paper',
          mb: 8,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Select Species & Position
        </Typography>

        {/* 热门物种 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="medium" sx={{ mb: 1.5 }}>
            Popular Species
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {popularSpecies.map(species => (
              <Chip
                key={species}
                label={species}
                variant="outlined"
                clickable
                sx={{
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* 基因组搜索 */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search through thousands of genomes"
            value={genomeSearch}
            onChange={e => setGenomeSearch(e.target.value)}
            placeholder="Search for genome assemblies..."
            variant="outlined"
          />
        </Box>

        {/* 位置搜索 */}
        <Box>
          <Typography variant="body1" fontWeight="medium" sx={{ mb: 1.5 }}>
            Find Position
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            <FormControl sx={{ minWidth: { xs: '100%', md: 300 } }}>
              <InputLabel id="assembly-select-label">Assembly</InputLabel>
              <Select
                labelId="assembly-select-label"
                value={selectedAssembly}
                label="Assembly"
                onChange={e => setSelectedAssembly(e.target.value)}
              >
                <MenuItem value="hg38">
                  Human Assembly Dec. 2013 (GRCh38/hg38)
                </MenuItem>
                <MenuItem value="hg19">
                  Human Assembly Feb. 2009 (GRCh37/hg19)
                </MenuItem>
                <MenuItem value="mm10">
                  Mouse Assembly Dec. 2011 (GRCm38/mm10)
                </MenuItem>
                <MenuItem value="mm9">
                  Mouse Assembly July 2007 (NCBI37/mm9)
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              sx={{ flex: 1, minWidth: { xs: '100%', md: 200 } }}
              value={positionSearch}
              onChange={e => setPositionSearch(e.target.value)}
              placeholder="Position/Search Term"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoPosition}
              sx={{ minWidth: 80, height: 56 }}
            >
              GO
            </Button>
          </Box>
        </Box>
      </Box>

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

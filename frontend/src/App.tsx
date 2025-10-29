import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { GlobalNavbar } from './components'
import GenomesPage from './pages/GenomesPage'
import BrowserConfigPage from './pages/BrowserConfigPage'
import WorkspacePage from './pages/WorkspacePage'
import ToolsPage from './pages/ToolsPage'
import ThreeDGenomicsPage from './pages/ThreeDGenomicsPage'
import SpatialOmicsPage from './pages/SpatialOmicsPage'
import DownloadsPage from './pages/DownloadsPage'
import HelpPage from './pages/HelpPage'
import AboutPage from './pages/AboutPage'
import './config/i18n'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <GlobalNavbar />
          <Routes>
            <Route path="/" element={<GenomesPage />} />
            <Route path="/browser" element={<BrowserConfigPage />} />
            <Route path="/browser/:sessionId" element={<WorkspacePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/3d-genomics" element={<ThreeDGenomicsPage />} />
            <Route path="/spatial-omics" element={<SpatialOmicsPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

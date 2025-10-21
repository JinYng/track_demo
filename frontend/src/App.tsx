import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import DashboardPage from './pages/DashboardPage'
import WorkspacePage from './pages/WorkspacePage'
import './i18n'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/workspace/:sessionId" element={<WorkspacePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

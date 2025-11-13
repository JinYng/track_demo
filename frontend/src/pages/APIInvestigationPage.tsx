import { useEffect, useState } from 'react'
import { createViewState } from '@jbrowse/react-linear-genome-view2'
import { useTheme } from '../contexts/ThemeContext'
import {
  generateJBrowseAPIReport,
  testTrackControlMethods,
  getAvailableTracks,
  getDisplayedTracks,
} from '../utils/jbrowseApiInvestigation'
import { getDefaultGenomeConfig } from '../config/genomes'

export default function APIInvestigationPage() {
  const { theme } = useTheme()
  const [reportData, setReportData] = useState<any>(null)
  const [trackMethods, setTrackMethods] = useState<any>(null)
  const [availableTracks, setAvailableTracks] = useState<any[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    try {
      // 创建 viewState
      const viewConfig = getDefaultGenomeConfig()
      const state = createViewState({
        assembly: viewConfig.assembly,
        tracks: viewConfig.tracks,
        location: viewConfig.location,
        defaultSession: viewConfig.defaultSession,
      })

      // 收集所有数据
      const report = generateJBrowseAPIReport(state)
      setReportData(report)

      const trackTest = testTrackControlMethods(state)
      setTrackMethods(trackTest)

      const available = getAvailableTracks(state)
      setAvailableTracks(available)

      const displayed = getDisplayedTracks(state)

      // 打印到控制台
      console.log('=== JBrowse API Investigation ===')
      console.log('Report:', report)
      console.log('Track Methods:', trackTest)
      console.log('Available Tracks:', available)
      console.log('Displayed Tracks:', displayed)
    } catch (e) {
      setError(String(e))
      console.error('Investigation error:', e)
    }
  }, [])

  return (
    <div
      style={{
        padding: theme.spacing.md,
        fontFamily: theme.fonts.primary,
        color: theme.colors.text,
        backgroundColor: theme.colors.background,
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: theme.spacing.lg }}>
        JBrowse API Investigation Report
      </h1>

      {error && (
        <div style={{ color: '#ff6b6b', marginBottom: theme.spacing.lg }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* 轨道方法测试结果 */}
      {trackMethods && (
        <section
          style={{
            marginBottom: theme.spacing.xl,
            padding: theme.spacing.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2 style={{ marginBottom: theme.spacing.md }}>
            Track Control Methods
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                <td style={{ padding: theme.spacing.sm }}>
                  showTrack() available:
                </td>
                <td
                  style={{
                    padding: theme.spacing.sm,
                    color: trackMethods.canShowTrack ? '#51cf66' : '#ff6b6b',
                  }}
                >
                  {trackMethods.canShowTrack ? '✅ YES' : '❌ NO'}
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                <td style={{ padding: theme.spacing.sm }}>
                  hideTrack() available:
                </td>
                <td
                  style={{
                    padding: theme.spacing.sm,
                    color: trackMethods.canHideTrack ? '#51cf66' : '#ff6b6b',
                  }}
                >
                  {trackMethods.canHideTrack ? '✅ YES' : '❌ NO'}
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                <td style={{ padding: theme.spacing.sm }}>
                  getTrack() available:
                </td>
                <td
                  style={{
                    padding: theme.spacing.sm,
                    color: trackMethods.canGetTrack ? '#51cf66' : '#ff6b6b',
                  }}
                >
                  {trackMethods.canGetTrack ? '✅ YES' : '❌ NO'}
                </td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                <td style={{ padding: theme.spacing.sm }}>
                  addTrackConf() available:
                </td>
                <td
                  style={{
                    padding: theme.spacing.sm,
                    color: trackMethods.canAddTrack ? '#51cf66' : '#ff6b6b',
                  }}
                >
                  {trackMethods.canAddTrack ? '✅ YES' : '❌ NO'}
                </td>
              </tr>
            </tbody>
          </table>
          {trackMethods.errorMessages.length > 0 && (
            <div style={{ marginTop: theme.spacing.md, color: '#ff922b' }}>
              <strong>Warnings:</strong>
              <ul>
                {trackMethods.errorMessages.map((msg: string, i: number) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 可用轨道 */}
      {availableTracks.length > 0 && (
        <section
          style={{
            marginBottom: theme.spacing.xl,
            padding: theme.spacing.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2 style={{ marginBottom: theme.spacing.md }}>
            Available Tracks ({availableTracks.length})
          </h2>
          <div
            style={{
              maxHeight: '400px',
              overflow: 'auto',
              backgroundColor: theme.colors.surface,
              padding: theme.spacing.md,
              borderRadius: '4px',
            }}
          >
            <pre style={{ margin: 0, fontSize: theme.fontSizes.caption }}>
              {JSON.stringify(availableTracks, null, 2)}
            </pre>
          </div>
        </section>
      )}

      {/* ViewState 结构 */}
      {reportData && (
        <section
          style={{
            marginBottom: theme.spacing.xl,
            padding: theme.spacing.md,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2 style={{ marginBottom: theme.spacing.md }}>
            ViewState Structure
          </h2>
          <div
            style={{
              maxHeight: '600px',
              overflow: 'auto',
              backgroundColor: theme.colors.surface,
              padding: theme.spacing.md,
              borderRadius: '4px',
            }}
          >
            <pre style={{ margin: 0, fontSize: theme.fontSizes.caption }}>
              {JSON.stringify(reportData, null, 2)}
            </pre>
          </div>
        </section>
      )}

      <div
        style={{
          marginTop: theme.spacing.lg,
          fontSize: theme.fontSizes.caption,
          color: theme.colors.secondaryText,
        }}
      >
        <p>Check your browser console (F12) for additional debugging output.</p>
      </div>
    </div>
  )
}

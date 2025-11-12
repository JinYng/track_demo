// frontend/src/components/GenomeBrowser/JBrowseViewer.tsx
import { useState } from 'react'
import { createViewState } from '@jbrowse/react-linear-genome-view2'
import { readConfObject } from '@jbrowse/core/configuration'
import { createJBrowseTheme } from '@jbrowse/core/ui'
import { Box, ThemeProvider } from '@mui/material'
import { observer } from 'mobx-react'
import viewConfig from '../../config'
import CustomJBrowseLinearGenomeView from './CustomJBrowseLinearGenomeView'
import SidebarModalWidget from './SidebarModalWidget'

export const JBrowseViewer = observer(() => {
  // 使用 useState 来保持 viewState 的稳定性，避免每次渲染都重新创建
  const [state] = useState(() =>
    createViewState({
      assembly: viewConfig.assembly,
      tracks: viewConfig.tracks,
      location: viewConfig.location,
      defaultSession: viewConfig.defaultSession,
      configuration: {
        theme: viewConfig.theme,
      },
    }),
  )

  const { session } = state
  const { visibleWidget } = session

  // Create theme for sidebar
  let theme
  try {
    theme = createJBrowseTheme(
      readConfObject(state.config.configuration, 'theme'),
    )
  } catch (error) {
    console.error('Failed to create JBrowse theme:', error)
    theme = createJBrowseTheme()
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* 主视图区域 - 动态宽度 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <CustomJBrowseLinearGenomeView viewState={state} />
      </Box>

      {/* 侧边栏区域 - 条件渲染，固定宽度 */}
      {visibleWidget && (
        <Box sx={{ width: 500, flexShrink: 0 }}>
          <ThemeProvider theme={theme}>
            {/* @ts-expect-error see comments on interface for AbstractSessionModel */}
            <SidebarModalWidget session={session} />
          </ThemeProvider>
        </Box>
      )}
    </Box>
  )
})

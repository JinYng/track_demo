// frontend/src/components/GenomeBrowser/JBrowseViewer.tsx
import { useState, useRef, useCallback, useEffect } from 'react'
import { createViewState } from '@jbrowse/react-linear-genome-view2'
import { readConfObject } from '@jbrowse/core/configuration'
import { createJBrowseTheme } from '@jbrowse/core/ui'
import { Box, ThemeProvider } from '@mui/material'
import { observer } from 'mobx-react'
import { getGenomeConfig } from '../../config/genomes'
import CustomJBrowseLinearGenomeView from './CustomJBrowseLinearGenomeView'
import SidebarModalWidget from './SidebarModalWidget'

export const JBrowseViewer = observer(() => {
  // 使用 useState 来保持 viewState 的稳定性，避免每次渲染都重新创建
  const [state] = useState(() => {
    // 尝试从 sessionStorage 读取 referenceGenome，如果没有则使用默认的 hg38
    let genomeId = 'hg38'
    try {
      const sessionId = window.location.pathname.split('/').pop()
      if (sessionId) {
        const savedConfig = sessionStorage.getItem(`session_${sessionId}`)
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig)
          genomeId = parsed.referenceGenome || 'hg38'
        }
      }
    } catch (error) {
      console.error('Failed to load genome ID from session:', error)
    }

    // 根据 genomeId 加载对应的配置
    const viewConfig = getGenomeConfig(genomeId)
    return createViewState({
      assembly: viewConfig.assembly,
      tracks: viewConfig.tracks,
      location: viewConfig.location,
      defaultSession: viewConfig.defaultSession,
      configuration: {
        theme: viewConfig.theme,
        ...viewConfig.configuration,
      },
    })
  })

  // 侧边栏宽度状态（默认 500px，最小 300px，最大 800px）
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // 处理拖动开始
  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  // 处理拖动
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = containerRect.right - e.clientX

      // 限制宽度范围：300px - 800px
      const clampedWidth = Math.min(Math.max(newWidth, 300), 800)
      setSidebarWidth(clampedWidth)
    },
    [isResizing],
  )

  // 处理拖动结束
  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // 添加和移除事件监听器
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      // 防止文本选择
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <Box
      ref={containerRef}
      sx={{ display: 'flex', height: '100%', width: '100%' }}
    >
      {/* 主视图区域 - 动态宽度 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <CustomJBrowseLinearGenomeView viewState={state} />
      </Box>

      {/* 侧边栏区域 - 条件渲染，可调整宽度 */}
      {visibleWidget && (
        <>
          {/* 可拖动的分隔条 */}
          <Box
            onMouseDown={handleMouseDown}
            sx={{
              width: '4px',
              cursor: 'col-resize',
              backgroundColor: 'divider',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
              transition: 'background-color 0.2s',
              flexShrink: 0,
            }}
          />

          {/* 侧边栏内容 */}
          <Box sx={{ width: sidebarWidth, flexShrink: 0 }}>
            <ThemeProvider theme={theme}>
              {/* @ts-expect-error see comments on interface for AbstractSessionModel */}
              <SidebarModalWidget session={session} />
            </ThemeProvider>
          </Box>
        </>
      )}
    </Box>
  )
})

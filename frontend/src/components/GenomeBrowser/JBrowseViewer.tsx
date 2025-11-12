// frontend/src/components/GenomeBrowser/JBrowseViewer.tsx
import { useEffect, useRef, useState } from 'react'
import {
  createViewState,
  JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view2'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
// 导入我们配置好的 viewConfig
import viewConfig from '../../config'

export const JBrowseViewer = () => {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)

  // 使用 createViewState 函数来初始化状态
  const state = createViewState({
    assembly: viewConfig.assembly,
    tracks: viewConfig.tracks,
    location: viewConfig.location,
    defaultSession: viewConfig.defaultSession,
    configuration: {
      theme: viewConfig.theme, // 传入 JBrowse 主题配置
    },
  })

  useEffect(() => {
    // 监听 DOM 变化，将 JBrowse 的弹窗移动到右侧容器
    const observer = new MutationObserver(() => {
      // 查找 JBrowse 的 Drawer/Dialog 组件
      const drawer = document.querySelector('.MuiDrawer-root, .MuiDialog-root')

      if (drawer && sidebarRef.current) {
        // 检查 drawer 是否已经在 sidebar 中
        if (!sidebarRef.current.contains(drawer)) {
          // 将弹窗移动到右侧容器
          sidebarRef.current.appendChild(drawer)
          // 显示侧边栏
          setIsSidebarVisible(true)
        }
      } else if (!drawer && isSidebarVisible) {
        // 如果弹窗被关闭（不存在了），隐藏侧边栏
        setIsSidebarVisible(false)
      }
    })

    // 监听 body 的子元素变化
    observer.observe(document.body, {
      childList: true,
      subtree: false,
    })

    return () => {
      observer.disconnect()
    }
  }, [isSidebarVisible])

  const handleCloseSidebar = () => {
    // 隐藏侧边栏
    setIsSidebarVisible(false)
    // 移除 drawer 元素
    const drawer = sidebarRef.current?.querySelector(
      '.MuiDrawer-root, .MuiDialog-root',
    )
    if (drawer) {
      drawer.remove()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* 左侧：JBrowse 主视图 */}
      <div className="jbrowse-wrapper" style={{ flex: 1, minWidth: 0 }}>
        <JBrowseLinearGenomeView viewState={state} />
      </div>

      {/* 右侧：详情面板容器 - 仅在有内容时显示 */}
      <div
        className="jbrowse-sidebar-container"
        style={{
          width: isSidebarVisible ? '450px' : '0',
          height: '100%',
          position: 'relative',
          borderLeft: isSidebarVisible ? '1px solid #e0e0e0' : 'none',
          backgroundColor: '#fff',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {/* 关闭按钮 - 仅在侧边栏可见时显示 */}
        {isSidebarVisible && (
          <IconButton
            onClick={handleCloseSidebar}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 1300,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        )}

        {/* JBrowse 弹窗会被移动到这里 */}
        <div ref={sidebarRef} style={{ height: '100%', width: '450px' }} />
      </div>
    </div>
  )
}

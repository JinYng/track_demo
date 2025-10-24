import React, { useState, useRef, useCallback } from 'react'
import { useTheme } from '../../../contexts/ThemeContext'
import './SplitLayout.css'

interface SplitLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  defaultSplitPercentage?: number
}

export function SplitLayout({
  leftPanel,
  rightPanel,
  defaultSplitPercentage = 30,
}: SplitLayoutProps) {
  const { theme } = useTheme()
  const [splitPercentage, setSplitPercentage] = useState(defaultSplitPercentage)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newPercentage =
        ((e.clientX - containerRect.left) / containerRect.width) * 100

      // 限制在10%-90%之间
      const clampedPercentage = Math.max(10, Math.min(90, newPercentage))
      setSplitPercentage(clampedPercentage)
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={containerRef}
      className="split-layout"
      style={{
        '--divider-color': theme.colors.border,
        '--divider-hover-color': theme.colors.primary,
      } as React.CSSProperties & Record<string, string>}
    >
      {/* 左侧面板 - AI对话界面 */}
      <div
        className="split-layout__left-panel"
        style={{ width: `${splitPercentage}%` }}
      >
        {leftPanel}
      </div>

      {/* 分割线 */}
      <div
        className={`split-layout__divider ${isDragging ? 'split-layout__divider--dragging' : ''}`}
        onMouseDown={handleMouseDown}
      />

      {/* 右侧面板 - JBrowse */}
      <div
        className="split-layout__right-panel"
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {rightPanel}
      </div>
    </div>
  )
}

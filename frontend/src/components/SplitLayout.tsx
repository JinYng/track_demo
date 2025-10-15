import React, { useState, useRef, useCallback } from 'react'

interface SplitLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  defaultSplitPercentage?: number
}

export function SplitLayout({ 
  leftPanel, 
  rightPanel, 
  defaultSplitPercentage = 50 
}: SplitLayoutProps) {
  const [splitPercentage, setSplitPercentage] = useState(defaultSplitPercentage)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const newPercentage = ((e.clientX - containerRect.left) / containerRect.width) * 100
    
    // 限制在10%-90%之间
    const clampedPercentage = Math.max(10, Math.min(90, newPercentage))
    setSplitPercentage(clampedPercentage)
  }, [isDragging])

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
      style={{ 
        display: 'flex', 
        height: '100%', 
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* 左侧面板 - AI对话界面 */}
      <div 
        style={{ 
          width: `${splitPercentage}%`,
          height: '100%',
          overflow: 'hidden',
          borderRight: '1px solid #e0e0e0'
        }}
      >
        {leftPanel}
      </div>

      {/* 分割线 */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: '4px',
          height: '100%',
          backgroundColor: '#f0f0f0',
          cursor: 'col-resize',
          borderLeft: '1px solid #e0e0e0',
          borderRight: '1px solid #e0e0e0',
          transition: isDragging ? 'none' : 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.backgroundColor = '#d0d0d0'
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.backgroundColor = '#f0f0f0'
          }
        }}
      />

      {/* 右侧面板 - JBrowse */}
      <div 
        style={{ 
          width: `${100 - splitPercentage}%`,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {rightPanel}
      </div>
    </div>
  )
}
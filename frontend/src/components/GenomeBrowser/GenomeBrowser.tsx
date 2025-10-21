import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useSession } from '../../contexts/SessionContext'
import BrowserControls from './BrowserControls'
import './GenomeBrowser.css'

interface GenomeBrowserProps {
    sessionId: string
}

/**
 * GenomeBrowser 组件
 * 基因组浏览器的容器组件
 * 包含控制栏和浏览器显示区域
 */
export default function GenomeBrowser({ sessionId }: GenomeBrowserProps) {
    const { theme } = useTheme()
    const { config, updateConfig } = useSession()
    const [currentLocation, setCurrentLocation] = useState(
        config.currentLocation || 'chr10:29,838,565..29,838,850',
    )

    /**
     * 处理位置变化
     */
    const handleLocationChange = (newLocation: string) => {
        setCurrentLocation(newLocation)
        updateConfig({ currentLocation: newLocation })
    }

    // TODO: 第四阶段集成JBrowse
    // 目前只是占位符，显示基础UI结构

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 浏览器控制栏 */}
            <BrowserControls
                location={currentLocation}
                onLocationChange={handleLocationChange}
            />

            {/* JBrowse视图区域 */}
            <div
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.surface,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                }}
            >
                {/* 占位符 - 第四阶段将被替换为真正的JBrowse */}
                <div
                    style={{
                        fontSize: theme.fontSizes.h3,
                        color: theme.colors.secondaryText,
                        textAlign: 'center',
                    }}
                >
                    <div>JBrowse Genome Browser</div>
                    <div style={{ fontSize: theme.fontSizes.body, marginTop: theme.spacing.md }}>
                        (Integration in progress)
                    </div>
                    <div style={{ fontSize: theme.fontSizes.caption, marginTop: theme.spacing.md }}>
                        Session: {sessionId}
                    </div>
                    <div style={{ fontSize: theme.fontSizes.caption, color: theme.colors.border }}>
                        Reference: {config.referenceGenome}
                    </div>
                </div>
            </div>
        </div>
    )
}

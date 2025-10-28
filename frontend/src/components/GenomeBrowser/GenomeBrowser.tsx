import { useTheme } from '../../contexts/ThemeContext'
import { useSession } from '../../contexts/SessionContext'
import { JBrowseViewer } from './JBrowseViewer'
import './GenomeBrowser.css'

interface GenomeBrowserProps {
    sessionId: string
}

/**
 * GenomeBrowser 组件
 * 基因组浏览器的容器组件
 */
export default function GenomeBrowser({ sessionId: _sessionId }: GenomeBrowserProps) {
    const { theme } = useTheme()
    const { config: _config } = useSession()

    return (
        <div
            style={{
                display: 'flex',
                height: '100%',
                backgroundColor: theme.colors.background,
                padding: '16px'
            }}
        >
            {/* JBrowse 浏览器区域 */}
            <div style={{ flex: 1, minHeight: 0 }}>
                <JBrowseViewer />
            </div>
        </div>
    )
}

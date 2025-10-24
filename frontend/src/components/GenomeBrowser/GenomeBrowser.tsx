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
 * 包含控制栏和浏览器显示区域
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
            {/* 让 JBrowse 填满区域，使用其内置导航控件 */}
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    '--border-top-color': theme.colors.primary,
                    '--border-right-color': theme.colors.primary,
                    '--border-bottom-color': theme.colors.primary,
                    '--border-left-color': theme.colors.primary,
                    '--surface-color': theme.colors.surface
                } as React.CSSProperties & {
                    '--border-top-color': string;
                    '--border-right-color': string;
                    '--border-bottom-color': string;
                    '--border-left-color': string;
                    '--surface-color': string;
                }}
            >
                <JBrowseViewer />
            </div>
        </div>
    )
}

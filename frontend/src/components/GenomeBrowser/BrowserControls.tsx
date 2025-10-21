import { useTheme } from '../../contexts/ThemeContext'

interface BrowserControlsProps {
    location: string
    onLocationChange: (location: string) => void
}

/**
 * BrowserControls 组件
 * 基因组浏览器的控制栏
 * 包含导航按钮、位置显示和轨道按钮
 */
export default function BrowserControls({
    location,
    onLocationChange: _onLocationChange,
}: BrowserControlsProps) {
    const { theme } = useTheme()
    // TODO: 第四阶段将使用onLocationChange回调来更新位置

    /**
     * 处理导航按钮点击
     */
    const handleNavigation = (direction: 'left' | 'right') => {
        // TODO: 第四阶段实现真正的导航逻辑
        console.log(`Navigate ${direction}`)
    }

    /**
     * 处理缩放按钮点击
     */
    const handleZoom = (direction: 'in' | 'out') => {
        // TODO: 第四阶段实现真正的缩放逻辑
        console.log(`Zoom ${direction}`)
    }

    /**
     * 控制按钮的样式
     */
    const buttonStyle = {
        background: 'none',
        border: 'none',
        fontSize: theme.fontSizes.body,
        cursor: 'pointer',
        color: theme.colors.text,
        padding: theme.spacing.sm,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '32px',
        minHeight: '32px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    } as const

    return (
        <div
            style={{
                padding: theme.spacing.md,
                borderBottom: `1px solid ${theme.colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.colors.background,
            }}
        >
            {/* 左侧: 导航和缩放按钮 */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                }}
            >
                {/* 左移按钮 */}
                <button
                    style={buttonStyle}
                    onClick={() => handleNavigation('left')}
                    title="Navigate left"
                >
                    &lt;
                </button>

                {/* 右移按钮 */}
                <button
                    style={buttonStyle}
                    onClick={() => handleNavigation('right')}
                    title="Navigate right"
                >
                    &gt;
                </button>

                {/* 分隔符 */}
                <div
                    style={{
                        width: '1px',
                        height: '24px',
                        backgroundColor: theme.colors.border,
                        margin: `0 ${theme.spacing.sm}`,
                    }}
                />

                {/* 放大按钮 */}
                <button
                    style={buttonStyle}
                    onClick={() => handleZoom('in')}
                    title="Zoom in"
                >
                    +
                </button>

                {/* 缩小按钮 */}
                <button
                    style={buttonStyle}
                    onClick={() => handleZoom('out')}
                    title="Zoom out"
                >
                    −
                </button>

                {/* 位置显示 */}
                <span
                    style={{
                        fontSize: theme.fontSizes.body,
                        color: theme.colors.text,
                        marginLeft: theme.spacing.md,
                        fontFamily: 'monospace',
                        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                        backgroundColor: theme.colors.surface,
                        borderRadius: '4px',
                        border: `1px solid ${theme.colors.border}`,
                    }}
                >
                    {location}
                </span>
            </div>

            {/* 右侧: 轨道按钮 */}
            <button
                style={{
                    background: 'none',
                    border: 'none',
                    color: theme.colors.primary,
                    fontSize: theme.fontSizes.body,
                    cursor: 'pointer',
                    padding: theme.spacing.sm,
                }}
                title="Manage tracks"
            >
                Tracks
            </button>
        </div>
    )
}

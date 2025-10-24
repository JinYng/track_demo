// frontend/src/components/GenomeBrowser/JBrowseViewer.tsx
import {
    createViewState,
    JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '../../contexts/ThemeContext';
// 导入我们刚刚改造好的配置
import viewConfig from '../../config';

export const JBrowseViewer = () => {
    const { theme } = useTheme();

    // 创建一个自定义主题来覆盖 JBrowse 的默认样式
    const jbrowseTheme = createTheme({
        components: {
            // 目标组件是 MuiPaper
            MuiPaper: {
                styleOverrides: {
                    // 'root' 指的是该组件的根 DOM 元素
                    root: {
                        // 使用我们的主题表面颜色
                        backgroundColor: theme.colors.surface,
                        background: theme.colors.surface,
                        // 移除阴影，让它更彻底地融入你的 UI
                        boxShadow: 'none',
                    },
                },
            },
        },
    });

    // 使用 createViewState 函数来初始化状态
    // 它需要 assembly, tracks, location 和 defaultSession
    const state = createViewState({
        assembly: viewConfig.assembly,
        tracks: viewConfig.tracks,
        location: viewConfig.location,
        defaultSession: viewConfig.defaultSession,
    });

    return (
        <div className="jbrowse-wrapper" style={{ height: '100%', width: '100%' }}>
            <ThemeProvider theme={jbrowseTheme}>
                <JBrowseLinearGenomeView viewState={state} />
            </ThemeProvider>
        </div>
    );
};
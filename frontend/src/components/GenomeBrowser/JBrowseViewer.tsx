// frontend/src/components/GenomeBrowser/JBrowseViewer.tsx
import {
    createViewState,
    JBrowseLinearGenomeView,
} from '@jbrowse/react-linear-genome-view';
// 导入我们配置好的 viewConfig
import viewConfig from '../../config';

export const JBrowseViewer = () => {
    // 使用 createViewState 函数来初始化状态
    const state = createViewState({
        assembly: viewConfig.assembly,
        tracks: viewConfig.tracks,
        location: viewConfig.location,
        defaultSession: viewConfig.defaultSession,
        configuration: {
            theme: viewConfig.theme, // 传入 JBrowse 主题配置
        },
    });

    return (
        <div className="jbrowse-wrapper" style={{ height: '100%', width: '100%' }}>
            <JBrowseLinearGenomeView viewState={state} />
        </div>
    );
};
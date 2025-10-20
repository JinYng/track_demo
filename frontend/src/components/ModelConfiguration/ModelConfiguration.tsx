import { useState } from 'react'
import './ModelConfiguration.css'

interface ModelConfig {
  apiBaseUrl: string
  apiKey: string
  modelName: string
}

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error'

interface ModelConfigurationProps {
  config: ModelConfig
  onConfigChange: (config: ModelConfig) => void
  onTestConnection?: (config: ModelConfig) => Promise<boolean>
  connectionStatus?: ConnectionStatus
}

export function ModelConfiguration({
  config,
  onConfigChange,
  onTestConnection,
  connectionStatus = 'idle',
}: ModelConfigurationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempConfig, setTempConfig] = useState<ModelConfig>(config)

  const handleSave = async () => {
    onConfigChange(tempConfig)

    // 自动测试连接
    if (onTestConnection) {
      await onTestConnection(tempConfig)
    }

    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setTempConfig(config) // 重置为原始配置
    setIsModalOpen(false)
  }

  const getStatusText = (status: ConnectionStatus): string => {
    switch (status) {
      case 'idle':
        return '未测试'
      case 'testing':
        return '测试中...'
      case 'success':
        return '连接成功'
      case 'error':
        return '连接失败'
      default:
        return '未知状态'
    }
  }

  return (
    <>
      {/* 模型配置按钮 */}
      <div
        className="model-config__trigger"
        onClick={() => setIsModalOpen(true)}
      >
        <div>
          <div className="model-config__title">模型设置</div>
          <div className="model-config__subtitle">
            {config.modelName || '未配置'}
          </div>
        </div>
        <div className="model-config__status">
          <div
            className={`model-config__indicator model-config__indicator--${connectionStatus}`}
            title={getStatusText(connectionStatus)}
          />
          <div className="model-config__icon">设置</div>
        </div>
      </div>

      {/* 配置模态框 */}
      {isModalOpen && (
        <div
          className="model-config__overlay"
          onClick={e => {
            if (e.target === e.currentTarget) {
              handleCancel()
            }
          }}
        >
          <div className="model-config__modal">
            <h3 className="model-config__modal-title">模型配置</h3>

            <div className="model-config__field">
              <label className="model-config__label">API Base URL</label>
              <input
                type="text"
                className="model-config__input"
                value={tempConfig.apiBaseUrl}
                onChange={e =>
                  setTempConfig({ ...tempConfig, apiBaseUrl: e.target.value })
                }
                placeholder="https://api.openai.com/v1"
              />
            </div>

            <div className="model-config__field">
              <label className="model-config__label">API Key</label>
              <input
                type="password"
                className="model-config__input"
                value={tempConfig.apiKey}
                onChange={e =>
                  setTempConfig({ ...tempConfig, apiKey: e.target.value })
                }
                placeholder="sk-..."
              />
            </div>

            <div className="model-config__field">
              <label className="model-config__label">Model Name</label>
              <input
                type="text"
                className="model-config__input"
                value={tempConfig.modelName}
                onChange={e =>
                  setTempConfig({ ...tempConfig, modelName: e.target.value })
                }
                placeholder="gpt-4"
              />
            </div>

            <div className="model-config__actions">
              <button
                className="model-config__button model-config__button--secondary"
                onClick={handleCancel}
              >
                取消
              </button>
              <button
                className="model-config__button model-config__button--primary"
                onClick={handleSave}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

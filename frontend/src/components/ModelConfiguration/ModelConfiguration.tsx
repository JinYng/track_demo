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
        return 'Not tested'
      case 'testing':
        return 'Testing...'
      case 'success':
        return 'Connected'
      case 'error':
        return 'Connection failed'
      default:
        return 'Unknown status'
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
          <div className="model-config__title">Model Settings</div>
          <div className="model-config__subtitle">
            {config.modelName || 'Not configured'}
          </div>
        </div>
        <div className="model-config__status">
          <div
            className={`model-config__indicator model-config__indicator--${connectionStatus}`}
            title={getStatusText(connectionStatus)}
          />
          <div className="model-config__icon">Settings</div>
        </div>
      </div>

      {/* Configuration modal */}
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
            <h3 className="model-config__modal-title">Model Configuration</h3>

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
                Cancel
              </button>
              <button
                className="model-config__button model-config__button--primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

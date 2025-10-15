import { useState } from 'react'

interface ModelConfig {
  apiBaseUrl: string
  apiKey: string
  modelName: string
}

interface ModelConfigurationProps {
  config: ModelConfig
  onConfigChange: (config: ModelConfig) => void
}

export function ModelConfiguration({ config, onConfigChange }: ModelConfigurationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempConfig, setTempConfig] = useState<ModelConfig>(config)

  const handleSave = () => {
    onConfigChange(tempConfig)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setTempConfig(config) // 重置为原始配置
    setIsModalOpen(false)
  }

  return (
    <>
      {/* 模型配置按钮 */}
      <div 
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'pointer',
          backgroundColor: '#f8f9fa',
          transition: 'background-color 0.2s',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#e9ecef'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa'
        }}
      >
        <div>
          <div style={{ fontWeight: '500', fontSize: '14px' }}>模型设置</div>
          <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
            {config.modelName || '未配置'}
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#6c757d' }}>⚙️</div>
      </div>

      {/* 配置模态框 */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancel()
            }
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              width: '480px',
              maxWidth: '90vw',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>模型配置</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                API Base URL
              </label>
              <input
                type="text"
                value={tempConfig.apiBaseUrl}
                onChange={(e) => setTempConfig({ ...tempConfig, apiBaseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d0d7de',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                API Key
              </label>
              <input
                type="password"
                value={tempConfig.apiKey}
                onChange={(e) => setTempConfig({ ...tempConfig, apiKey: e.target.value })}
                placeholder="sk-..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d0d7de',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
                Model Name
              </label>
              <input
                type="text"
                value={tempConfig.modelName}
                onChange={(e) => setTempConfig({ ...tempConfig, modelName: e.target.value })}
                placeholder="gpt-4"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d0d7de',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d0d7de',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                取消
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#0969da',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
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
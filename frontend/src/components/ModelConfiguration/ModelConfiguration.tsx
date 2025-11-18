import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from '@mui/material'
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { API_ENDPOINTS, apiClient } from '../../config/api'

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

interface PresetConfig {
  id: string
  name: string
  description: string
  apiBaseUrl: string
  apiKey: string
  modelName: string
  provider: string
  isConfigured: boolean
}

export function ModelConfiguration({
  config,
  onConfigChange,
  onTestConnection,
  connectionStatus = 'idle',
}: ModelConfigurationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [tempConfig, setTempConfig] = useState<ModelConfig>(config)
  const [customConfig, setCustomConfig] = useState<ModelConfig>({
    apiBaseUrl: '',
    apiKey: '',
    modelName: '',
  })
  const [showApiKey, setShowApiKey] = useState(false)
  const [presetConfigs, setPresetConfigs] = useState<PresetConfig[]>([])
  const [loadingPresets, setLoadingPresets] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

  // 初始化时从 localStorage 加载自定义配置
  useEffect(() => {
    const savedCustomConfig = localStorage.getItem('ai-custom-config')
    if (savedCustomConfig) {
      try {
        setCustomConfig(JSON.parse(savedCustomConfig))
      } catch (error) {
        console.error('Failed to parse custom config:', error)
      }
    }
  }, [])

  // 加载预设配置
  useEffect(() => {
    if (isModalOpen && activeTab === 0) {
      loadPresetConfigs()
    }
  }, [isModalOpen, activeTab])

  const loadPresetConfigs = async () => {
    setLoadingPresets(true)
    try {
      const response = await apiClient.get<{
        presets: PresetConfig[]
        count: number
      }>(
        `${API_ENDPOINTS.AI_DEFAULT_CONFIG.replace('/default-config', '/preset-configs')}`,
      )
      setPresetConfigs(response.presets)
    } catch (error) {
      console.error('Failed to load preset configs:', error)
    } finally {
      setLoadingPresets(false)
    }
  }

  const handleSelectPreset = (preset: PresetConfig) => {
    setSelectedPresetId(preset.id)
    setTempConfig({
      apiBaseUrl: preset.apiBaseUrl,
      apiKey: preset.apiKey,
      modelName: preset.modelName,
    })
  }

  const handleApplyConfig = async () => {
    // 根据当前 Tab 决定使用哪个配置
    const configToApply = activeTab === 0 ? tempConfig : customConfig

    onConfigChange(configToApply)

    // 自动测试连接
    if (onTestConnection) {
      await onTestConnection(configToApply)
    }

    // 保存配置模式到 localStorage
    if (activeTab === 0 && selectedPresetId) {
      // 预设配置模式
      localStorage.setItem('ai-config-mode', 'preset')
      localStorage.setItem('ai-preset-id', selectedPresetId)
    } else {
      // 自定义配置模式
      localStorage.setItem('ai-config-mode', 'custom')
      localStorage.setItem('ai-custom-config', JSON.stringify(customConfig))
    }

    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setTempConfig(config)
    setSelectedPresetId(null)
    setIsModalOpen(false)
  }

  const handleClose = () => {
    setTempConfig(config)
    setSelectedPresetId(null)
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

  const getStatusColor = (
    status: ConnectionStatus,
  ): 'default' | 'warning' | 'success' | 'error' => {
    switch (status) {
      case 'idle':
        return 'default'
      case 'testing':
        return 'warning'
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <>
      {/* 模型配置按钮 */}
      <Box
        onClick={() => setIsModalOpen(true)}
        sx={{
          padding: '12px 16px',
          borderBottom: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          backgroundColor: 'grey.50',
          transition: 'background-color 0.2s',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: 'grey.100',
          },
        }}
      >
        <Box>
          <Typography variant="body2" fontWeight={500}>
            Model Settings
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {config.modelName || 'Not configured'}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={getStatusText(connectionStatus)}
            size="small"
            color={getStatusColor(connectionStatus)}
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
          <SettingsIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </Box>
      </Box>

      {/* Configuration Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return
          }
          handleClose()
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          Model Configuration
          <IconButton
            aria-label="close"
            onClick={handleClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="configuration tabs"
          >
            <Tab label="Preset Configurations" />
            <Tab label="Custom Configuration" />
          </Tabs>
        </Box>

        <DialogContent dividers sx={{ minHeight: 300 }}>
          {/* Preset Configurations Tab */}
          {activeTab === 0 && (
            <Box>
              {loadingPresets ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight={200}
                >
                  <CircularProgress />
                </Box>
              ) : presetConfigs.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No preset configurations available
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {presetConfigs.map(preset => (
                    <Card
                      key={preset.id}
                      variant="outlined"
                      sx={{
                        borderColor:
                          selectedPresetId === preset.id
                            ? 'primary.main'
                            : 'divider',
                        borderWidth: selectedPresetId === preset.id ? 2 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          mb={1}
                        >
                          <Box>
                            <Typography variant="h6" fontSize="1rem">
                              {preset.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {preset.description}
                            </Typography>
                          </Box>
                          {selectedPresetId === preset.id && (
                            <CheckCircleIcon color="primary" fontSize="small" />
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          Model: {preset.modelName}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                        <Button
                          size="small"
                          variant={
                            selectedPresetId === preset.id
                              ? 'contained'
                              : 'outlined'
                          }
                          onClick={() => handleSelectPreset(preset)}
                        >
                          {selectedPresetId === preset.id
                            ? 'Selected'
                            : 'Select'}
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* Custom Configuration Tab */}
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="API Base URL"
                fullWidth
                value={customConfig.apiBaseUrl}
                onChange={e =>
                  setCustomConfig({
                    ...customConfig,
                    apiBaseUrl: e.target.value,
                  })
                }
                placeholder="https://api.openai.com/v1"
                size="small"
                helperText="The base URL for your AI model API"
              />

              <TextField
                label="API Key"
                fullWidth
                type={showApiKey ? 'text' : 'password'}
                value={customConfig.apiKey}
                onChange={e =>
                  setCustomConfig({ ...customConfig, apiKey: e.target.value })
                }
                placeholder="sk-..."
                size="small"
                helperText="Your API key will be stored securely"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowApiKey(!showApiKey)}
                        onMouseDown={e => e.preventDefault()}
                        edge="end"
                        size="small"
                      >
                        {showApiKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Model Name"
                fullWidth
                value={customConfig.modelName}
                onChange={e =>
                  setCustomConfig({
                    ...customConfig,
                    modelName: e.target.value,
                  })
                }
                placeholder="gpt-4"
                size="small"
                helperText="The name of the AI model to use"
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCancel} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleApplyConfig}
            variant="contained"
            color="primary"
            disabled={
              activeTab === 0
                ? !selectedPresetId
                : !customConfig.apiBaseUrl ||
                  !customConfig.apiKey ||
                  !customConfig.modelName
            }
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

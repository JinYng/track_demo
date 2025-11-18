import { useState } from 'react'
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
} from '@mui/material'
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
  Settings as SettingsIcon,
} from '@mui/icons-material'
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
  const [showApiKey, setShowApiKey] = useState(false)

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

  const handleClose = () => {
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
        className="model-config__trigger"
        onClick={() => setIsModalOpen(true)}
        sx={{
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0',
          cursor: 'pointer',
          backgroundColor: '#f8f9fa',
          transition: 'background-color 0.2s',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&:hover': {
            backgroundColor: '#e9ecef',
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
        onClose={(event, reason) => {
          // 禁用点击外侧和按 ESC 关闭
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

        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="API Base URL"
              fullWidth
              value={tempConfig.apiBaseUrl}
              onChange={e =>
                setTempConfig({ ...tempConfig, apiBaseUrl: e.target.value })
              }
              placeholder="https://api.openai.com/v1"
              size="small"
              helperText="The base URL for your AI model API"
            />

            <TextField
              label="API Key"
              fullWidth
              type={showApiKey ? 'text' : 'password'}
              value={tempConfig.apiKey}
              onChange={e =>
                setTempConfig({ ...tempConfig, apiKey: e.target.value })
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
              value={tempConfig.modelName}
              onChange={e =>
                setTempConfig({ ...tempConfig, modelName: e.target.value })
              }
              placeholder="gpt-4"
              size="small"
              helperText="The name of the AI model to use"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCancel} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

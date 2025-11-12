import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, TextField, Tabs, Tab, Button, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'

type InputMode = 'file' | 'url'

interface FileInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  accept?: string
  description?: string
}

export default function FileInput({
  value,
  onChange,
  label,
  placeholder = 'Paste URL or select file...',
  accept,
  description,
}: FileInputProps) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<InputMode>('url')
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onChange(file.name)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: InputMode,
  ) => {
    setMode(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography
          component="label"
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 500,
            mb: 0.5,
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
      )}

      <Tabs
        value={mode}
        onChange={handleTabChange}
        sx={{
          minHeight: 40,
          mb: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tab
          label={t('fileInput.url')}
          value="url"
          sx={{ minHeight: 40, textTransform: 'none' }}
        />
        <Tab
          label={t('fileInput.file')}
          value="file"
          sx={{ minHeight: 40, textTransform: 'none' }}
        />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {mode === 'url' && (
          <TextField
            fullWidth
            type="text"
            value={value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            variant="outlined"
            size="small"
            helperText={description}
          />
        )}

        {mode === 'file' && (
          <Box>
            <Button
              variant="outlined"
              onClick={handleSelectFile}
              startIcon={<UploadFileIcon />}
              sx={{ textTransform: 'none' }}
            >
              {t('fileInput.selectFile')}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            {fileName && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  color: 'text.secondary',
                }}
              >
                {t('fileInput.selected')}: {fileName}
              </Typography>
            )}
            {description && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  color: 'text.secondary',
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

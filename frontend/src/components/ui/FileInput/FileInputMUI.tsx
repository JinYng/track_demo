import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box,
    Button,
    TextField,
    FormHelperText,
    FormControl,
    FormLabel,
    Stack,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useTheme } from '../../../contexts/ThemeContext'

interface FileInputMUIProps {
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    accept?: string
    description?: string
}

/**
 * MUI 版本的文件输入组件
 * 替代原来的自定义 FileInput 组件
 */
export default function FileInputMUI({
    value,
    onChange,
    label,
    placeholder = 'Paste URL or select file...',
    accept,
    description,
}: FileInputMUIProps) {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const [mode, setMode] = useState<'file' | 'url'>('url')
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

    return (
        <FormControl fullWidth>
            {label && <FormLabel>{label}</FormLabel>}

            <Stack spacing={1} sx={{ mt: label ? 1 : 0 }}>
                {/* Mode Selector */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant={mode === 'url' ? 'contained' : 'outlined'}
                        onClick={() => setMode('url')}
                        size="small"
                    >
                        {t('fileInput.url') || 'URL'}
                    </Button>
                    <Button
                        variant={mode === 'file' ? 'contained' : 'outlined'}
                        onClick={() => setMode('file')}
                        size="small"
                        startIcon={<CloudUploadIcon />}
                    >
                        {t('fileInput.file') || 'File'}
                    </Button>
                </Box>

                {/* URL Input */}
                {mode === 'url' && (
                    <TextField
                        type="text"
                        value={value}
                        onChange={handleUrlChange}
                        placeholder={placeholder}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                )}

                {/* File Input */}
                {mode === 'file' && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            component="span"
                            onClick={handleSelectFile}
                            startIcon={<CloudUploadIcon />}
                        >
                            {t('fileInput.selectFile') || 'Select File'}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={accept}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        {fileName && <span>{fileName}</span>}
                    </Box>
                )}

                {/* Helper Text */}
                {description && <FormHelperText>{description}</FormHelperText>}
            </Stack>
        </FormControl>
    )
}

import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../../contexts/ThemeContext'
import styles from './FileInput.module.css'

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
  const { theme } = useTheme()
  const [mode, setMode] = useState<InputMode>('url')
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      // 这里可以后续处理文件上传逻辑
      // 目前只记录文件名
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.container}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: theme.fontSizes.caption,
            fontWeight: 500,
            marginBottom: '0.25rem',
            color: theme.colors.secondaryText,
          }}
        >
          {label}
        </label>
      )}

      <div
        className={styles.tabs}
        style={{
          borderBottomColor: theme.colors.border,
        }}
      >
        <button
          className={`${styles.tab} ${mode === 'url' ? styles.active : ''}`}
          onClick={() => setMode('url')}
          style={{
            color: theme.colors.text,
          }}
        >
          {t('fileInput.url')}
        </button>
        <button
          className={`${styles.tab} ${mode === 'file' ? styles.active : ''}`}
          onClick={() => setMode('file')}
          style={{
            color: theme.colors.text,
          }}
        >
          {t('fileInput.file')}
        </button>
      </div>

      <div className={styles.content}>
        {mode === 'url' && (
          <input
            type="text"
            className={styles.urlInput}
            value={value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            style={{
              padding: `${theme.spacing.sm}`,
              border: 'none',
              borderBottom: `2px solid ${theme.colors.border}`,
              backgroundColor: 'transparent',
              fontSize: theme.fontSizes.body,
              color: theme.colors.text,
              outline: 'none',
            }}
          />
        )}

        {mode === 'file' && (
          <div className={styles.fileInputWrapper}>
            <button
              type="button"
              onClick={handleSelectFile}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '4px',
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                fontSize: theme.fontSizes.body,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '0.8'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = '1'
              }}
            >
              {t('fileInput.selectFile')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              style={{
                display: 'none',
              }}
            />
          </div>
        )}

        {fileName && (
          <div
            className={styles.fileNameDisplay}
            style={{
              color: theme.colors.secondaryText,
            }}
          >
            {t('fileInput.selected')}: {fileName}
          </div>
        )}

        {description && (
          <p
            style={{
              fontSize: theme.fontSizes.caption,
              color: theme.colors.secondaryText,
              margin: `${theme.spacing.xs} 0 0 0`,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

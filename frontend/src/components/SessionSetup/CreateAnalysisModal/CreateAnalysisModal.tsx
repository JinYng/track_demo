import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../../contexts/ThemeContext'
import { FileInput } from '../../ui/FileInput'
import styles from './CreateAnalysisModal.module.css'

type AdapterType = 'IndexedFastaAdapter' | 'BgzipFastaAdapter' | 'FastaAdapter' | 'TwoBitAdapter'

interface CustomGenomeConfig {
  assemblyName: string
  assemblyDisplayName: string
  adapterType: AdapterType
  // For IndexedFastaAdapter, BgzipFastaAdapter, FastaAdapter
  fastaLocation?: string
  // For IndexedFastaAdapter, BgzipFastaAdapter
  faiLocation?: string
  // For BgzipFastaAdapter
  gziLocation?: string
  // For TwoBitAdapter
  twoBitLocation?: string
  chromSizesLocation?: string
  advancedOptions?: {
    refNameAliases?: string
    cytobands?: string
  }
}

interface FormState {
  sessionName: string
  referenceGenome: string
  customGenome?: CustomGenomeConfig
}

interface CreateAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (config: any) => void
}

export default function CreateAnalysisModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateAnalysisModalProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [formState, setFormState] = useState<FormState>({
    sessionName: '',
    referenceGenome: 'hg38',
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  if (!isOpen) return null

  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomGenomeChange = (field: keyof CustomGenomeConfig, value: string) => {
    setFormState(prev => ({
      ...prev,
      customGenome: {
        ...prev.customGenome,
        [field]: value,
      } as CustomGenomeConfig,
    }))
  }

  const handleAdvancedChange = (field: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      customGenome: {
        ...prev.customGenome,
        advancedOptions: {
          ...prev.customGenome?.advancedOptions,
          [field]: value,
        },
      } as CustomGenomeConfig,
    }))
  }

  const isFormValid = formState.sessionName.trim() !== ''

  const getRequiredFields = (adapter: AdapterType) => {
    switch (adapter) {
      case 'IndexedFastaAdapter':
        return ['fastaLocation', 'faiLocation']
      case 'BgzipFastaAdapter':
        return ['fastaLocation', 'faiLocation', 'gziLocation']
      case 'FastaAdapter':
        return ['fastaLocation']
      case 'TwoBitAdapter':
        return ['twoBitLocation']
      default:
        return []
    }
  }

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit(formState)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const adapterType = formState.customGenome?.adapterType || 'IndexedFastaAdapter'
  const requiredFields = getRequiredFields(adapterType)

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className={styles.modal}
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.text,
          fontFamily: theme.fonts.primary,
          width: '600px',
          padding: theme.spacing.xl,
        }}
      >
        {/* Header */}
        <div
          className={styles.header}
          style={{
            marginBottom: theme.spacing.lg,
            paddingBottom: theme.spacing.md,
            borderBottomColor: theme.colors.border,
          }}
        >
          <h2 className={styles.title}>{t('createAnalysis.title')}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            style={{
              color: theme.colors.secondaryText,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className={styles.content} style={{ marginBottom: theme.spacing.lg }}>
          {/* Part A: Core Settings */}
          <div className={styles.section}>
            <div
              className={styles.formGroup}
              style={{ marginBottom: theme.spacing.lg }}
            >
              <label
                className={styles.label}
                style={{
                  color: theme.colors.secondaryText,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {t('createAnalysis.sessionNameLabel')}
              </label>
              <input
                type="text"
                className={styles.input}
                value={formState.sessionName}
                onChange={e => handleInputChange('sessionName', e.target.value)}
                placeholder={t('createAnalysis.sessionNamePlaceholder')}
                style={{
                  borderBottomColor: theme.colors.border,
                  color: theme.colors.text,
                  fontSize: theme.fontSizes.body,
                }}
              />
            </div>

            <div
              className={styles.formGroup}
              style={{ marginBottom: theme.spacing.lg }}
            >
              <label
                className={styles.label}
                style={{
                  color: theme.colors.secondaryText,
                  marginBottom: theme.spacing.xs,
                }}
              >
                {t('createAnalysis.referenceGenomeLabel')}
              </label>
              <select
                className={styles.select}
                value={formState.referenceGenome}
                onChange={e => handleInputChange('referenceGenome', e.target.value)}
                style={{
                  borderBottomColor: theme.colors.border,
                  color: theme.colors.text,
                  fontSize: theme.fontSizes.body,
                }}
              >
                <option value="hg38">Human (hg38)</option>
                <option value="hg19">Human (hg19)</option>
                <option value="mm10">Mouse (mm10)</option>
                <option value="rn6">Rat (rn6)</option>
                <option value="custom">
                  {t('createAnalysis.addCustomGenome')}
                </option>
              </select>
            </div>
          </div>

          {/* Part B: Custom Genome Form (Conditional) */}
          {formState.referenceGenome === 'custom' && (
            <div
              className={styles.customGenomeForm}
              style={{
                borderColor: theme.colors.border,
                backgroundColor: `rgba(0, 0, 0, 0.02)`,
              }}
            >
              <h3
                style={{
                  margin: `0 0 ${theme.spacing.md} 0`,
                  fontSize: theme.fontSizes.h3,
                  color: theme.colors.text,
                }}
              >
                {t('createAnalysis.customGenomeConfiguration')}
              </h3>

              <div className={styles.formGroup}>
                <label
                  className={styles.label}
                  style={{
                    color: theme.colors.secondaryText,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {t('createAnalysis.assemblyNameLabel')}
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formState.customGenome?.assemblyName || ''}
                  onChange={e =>
                    handleCustomGenomeChange('assemblyName', e.target.value)
                  }
                  placeholder={t('createAnalysis.assemblyNamePlaceholder')}
                  style={{
                    borderBottomColor: theme.colors.border,
                    color: theme.colors.text,
                    fontSize: theme.fontSizes.body,
                  }}
                />
              </div>

              <div className={styles.formGroup}>
                <label
                  className={styles.label}
                  style={{
                    color: theme.colors.secondaryText,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {t('createAnalysis.assemblyDisplayNameLabel')}
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formState.customGenome?.assemblyDisplayName || ''}
                  onChange={e =>
                    handleCustomGenomeChange('assemblyDisplayName', e.target.value)
                  }
                  placeholder={t(
                    'createAnalysis.assemblyDisplayNamePlaceholder'
                  )}
                  style={{
                    borderBottomColor: theme.colors.border,
                    color: theme.colors.text,
                    fontSize: theme.fontSizes.body,
                  }}
                />
              </div>

              <div className={styles.formGroup}>
                <label
                  className={styles.label}
                  style={{
                    color: theme.colors.secondaryText,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {t('createAnalysis.adapterTypeLabel')}
                </label>
                <select
                  className={styles.select}
                  value={formState.customGenome?.adapterType || 'IndexedFastaAdapter'}
                  onChange={e =>
                    handleCustomGenomeChange('adapterType', e.target.value)
                  }
                  style={{
                    borderBottomColor: theme.colors.border,
                    color: theme.colors.text,
                    fontSize: theme.fontSizes.body,
                  }}
                >
                  <option value="IndexedFastaAdapter">IndexedFastaAdapter</option>
                  <option value="BgzipFastaAdapter">BgzipFastaAdapter</option>
                  <option value="FastaAdapter">FastaAdapter</option>
                  <option value="TwoBitAdapter">TwoBitAdapter</option>
                </select>
              </div>

              {/* FASTA File - for IndexedFastaAdapter, BgzipFastaAdapter, FastaAdapter */}
              {requiredFields.includes('fastaLocation') && (
                <div className={styles.formGroup}>
                  <FileInput
                    label={t('createAnalysis.fastaFileLabel')}
                    value={formState.customGenome?.fastaLocation || ''}
                    onChange={val => handleCustomGenomeChange('fastaLocation', val)}
                    placeholder={t('createAnalysis.sequenceFilePlaceholder')}
                    description={t('createAnalysis.fastaFileDescription')}
                  />
                </div>
              )}

              {/* TwoBit File - for TwoBitAdapter */}
              {requiredFields.includes('twoBitLocation') && (
                <div className={styles.formGroup}>
                  <FileInput
                    label={t('createAnalysis.twoBitFileLabel')}
                    value={formState.customGenome?.twoBitLocation || ''}
                    onChange={val => handleCustomGenomeChange('twoBitLocation', val)}
                    placeholder={t('createAnalysis.sequenceFilePlaceholder')}
                    description={t('createAnalysis.twoBitFileDescription')}
                  />
                </div>
              )}

              {/* FAI Index File - for IndexedFastaAdapter and BgzipFastaAdapter */}
              {requiredFields.includes('faiLocation') && (
                <div className={styles.formGroup}>
                  <FileInput
                    label={t('createAnalysis.faiFileLabel')}
                    value={formState.customGenome?.faiLocation || ''}
                    onChange={val => handleCustomGenomeChange('faiLocation', val)}
                    placeholder={t('createAnalysis.sequenceFilePlaceholder')}
                  />
                </div>
              )}

              {/* GZI File - for BgzipFastaAdapter */}
              {requiredFields.includes('gziLocation') && (
                <div className={styles.formGroup}>
                  <FileInput
                    label={t('createAnalysis.gziFileLabel')}
                    value={formState.customGenome?.gziLocation || ''}
                    onChange={val => handleCustomGenomeChange('gziLocation', val)}
                    placeholder={t('createAnalysis.sequenceFilePlaceholder')}
                  />
                </div>
              )}

              {/* Chrom Sizes - for TwoBitAdapter (optional) */}
              {adapterType === 'TwoBitAdapter' && (
                <div className={styles.formGroup}>
                  <FileInput
                    label={t('createAnalysis.chromSizesLabel')}
                    value={formState.customGenome?.chromSizesLocation || ''}
                    onChange={val => handleCustomGenomeChange('chromSizesLocation', val)}
                    placeholder={t('createAnalysis.chromSizesPlaceholder')}
                  />
                </div>
              )}

              {/* Advanced Options */}
              <div
                className={styles.advancedOptions}
                style={{
                  borderColor: theme.colors.border,
                }}
              >
                <button
                  className={styles.advancedToggle}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{
                    color: theme.colors.text,
                  }}
                >
                  {t('createAnalysis.advancedOptions')}
                  <span style={{ marginLeft: 'auto' }}>
                    {showAdvanced ? '▼' : '▶'}
                  </span>
                </button>
                {showAdvanced && (
                  <div
                    className={styles.advancedContent}
                    style={{
                      borderTopColor: theme.colors.border,
                    }}
                  >
                    <div className={styles.formGroup}>
                      <FileInput
                        label={t('createAnalysis.refNameAliasesLabel')}
                        value={
                          formState.customGenome?.advancedOptions?.refNameAliases || ''
                        }
                        onChange={val =>
                          handleAdvancedChange('refNameAliases', val)
                        }
                        placeholder={t('createAnalysis.sequenceFilePlaceholder')}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <FileInput
                        label={t('createAnalysis.cytobandsLabel')}
                        value={
                          formState.customGenome?.advancedOptions?.cytobands || ''
                        }
                        onChange={val => handleAdvancedChange('cytobands', val)}
                        placeholder={t('createAnalysis.sequenceFilePlaceholder')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={styles.footer}
          style={{
            paddingTop: theme.spacing.lg,
            borderTopColor: theme.colors.border,
            gap: theme.spacing.md,
          }}
        >
          <button
            className={styles.cancelButton}
            onClick={onClose}
            style={{
              borderColor: theme.colors.border,
              color: theme.colors.text,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.fontSizes.body,
            }}
          >
            {t('createAnalysis.cancel')}
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid
                ? theme.colors.primary
                : theme.colors.border,
              color: 'white',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              fontSize: theme.fontSizes.body,
            }}
          >
            {t('createAnalysis.createSession')}
          </button>
        </div>
      </div>
    </div>
  )
}

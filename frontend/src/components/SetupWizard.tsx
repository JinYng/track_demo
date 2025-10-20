import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'

interface SetupWizardProps {
  onClose: () => void
  onComplete: (sessionData: SessionData) => void
}

interface SessionData {
  name: string
  organism: string
  referenceGenome: string
}

export default function SetupWizard({ onClose, onComplete }: SetupWizardProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(1)
  const [sessionData, setSessionData] = useState<SessionData>({
    name: '',
    organism: 'Human',
    referenceGenome: 'hg38',
  })

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(sessionData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: keyof SessionData, value: string) => {
    setSessionData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.background,
          borderRadius: '8px',
          padding: theme.spacing.xl,
          width: '500px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        {/* 标题栏 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
            paddingBottom: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2
            style={{
              fontSize: theme.fontSizes.h2,
              fontWeight: theme.fontWeights.bold,
              margin: 0,
              color: theme.colors.text,
            }}
          >
            {t('wizard.title')}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.colors.secondaryText,
            }}
          >
            ×
          </button>
        </div>

        {/* 步骤指示器 */}
        <div
          style={{
            marginBottom: theme.spacing.lg,
          }}
        >
          <div
            style={{
              fontSize: theme.fontSizes.body,
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.primary,
              marginBottom: theme.spacing.sm,
            }}
          >
            {t(`wizard.step${currentStep}`)}
          </div>
          <div
            style={{
              height: '1px',
              backgroundColor: theme.colors.border,
            }}
          />
        </div>

        {/* 表单内容 */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.fontSizes.caption,
                    color: theme.colors.secondaryText,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {t('wizard.sessionName')}
                </label>
                <input
                  type="text"
                  value={sessionData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    border: 'none',
                    borderBottom: `2px solid ${theme.colors.border}`,
                    backgroundColor: 'transparent',
                    fontSize: theme.fontSizes.body,
                    color: theme.colors.text,
                    outline: 'none',
                  }}
                  placeholder="Enter session name..."
                />
              </div>

              <div style={{ marginBottom: theme.spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.fontSizes.caption,
                    color: theme.colors.secondaryText,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {t('wizard.organism')}
                </label>
                <select
                  value={sessionData.organism}
                  onChange={e => handleInputChange('organism', e.target.value)}
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    border: 'none',
                    borderBottom: `2px solid ${theme.colors.border}`,
                    backgroundColor: 'transparent',
                    fontSize: theme.fontSizes.body,
                    color: theme.colors.text,
                    outline: 'none',
                  }}
                >
                  <option value="Human">Human</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Rat">Rat</option>
                </select>
              </div>

              <div style={{ marginBottom: theme.spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: theme.fontSizes.caption,
                    color: theme.colors.secondaryText,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {t('wizard.referenceGenome')}
                </label>
                <select
                  value={sessionData.referenceGenome}
                  onChange={e =>
                    handleInputChange('referenceGenome', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    border: 'none',
                    borderBottom: `2px solid ${theme.colors.border}`,
                    backgroundColor: 'transparent',
                    fontSize: theme.fontSizes.body,
                    color: theme.colors.text,
                    outline: 'none',
                  }}
                >
                  <option value="hg38">hg38 (GRCh38)</option>
                  <option value="hg19">hg19 (GRCh37)</option>
                  <option value="mm10">mm10 (GRCm38)</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <p style={{ color: theme.colors.text }}>
                Data sources configuration (Step 2)
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <p style={{ color: theme.colors.text }}>
                Analysis options (Step 3)
              </p>
            </div>
          )}
        </div>

        {/* 按钮区域 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: theme.spacing.md,
          }}
        >
          <button
            onClick={currentStep === 1 ? onClose : handlePrevious}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: 'transparent',
              color: theme.colors.text,
              fontSize: theme.fontSizes.body,
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {currentStep === 1 ? t('wizard.cancel') : t('wizard.previous')}
          </button>
          <button
            onClick={handleNext}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              border: 'none',
              backgroundColor: theme.colors.primary,
              color: 'white',
              fontSize: theme.fontSizes.body,
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {currentStep === 3 ? t('wizard.create') : t('wizard.next')}
          </button>
        </div>
      </div>
    </div>
  )
}

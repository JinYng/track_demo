import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Error boundary for theme provider errors
 * Catches errors during theme loading and displays fallback UI
 */
export class ThemeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Theme Provider Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Theme Loading Error</h1>
          <p>Failed to load theme. Please refresh the page.</p>
        </div>
      )
    }

    return this.props.children
  }
}

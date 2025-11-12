import { Suspense } from 'react'

import { readConfObject } from '@jbrowse/core/configuration'
import { LoadingEllipses, createJBrowseTheme } from '@jbrowse/core/ui'
import { EmbeddedViewContainer } from '@jbrowse/embedded-core'
import { ThemeProvider } from '@mui/material'
import { observer } from 'mobx-react'
import { getEnv } from 'mobx-state-tree'

import type { ViewModel } from '@jbrowse/react-linear-genome-view2'

interface CustomJBrowseLinearGenomeViewProps {
  viewState: ViewModel
}

const CustomJBrowseLinearGenomeView = observer(function ({
  viewState,
}: CustomJBrowseLinearGenomeViewProps) {
  const { session } = viewState
  const { view } = session
  const { pluginManager } = getEnv(session)
  const { ReactComponent } = pluginManager.getViewType(view.type)!

  // Create theme with error handling
  let theme
  try {
    theme = createJBrowseTheme(
      readConfObject(viewState.config.configuration, 'theme'),
    )
  } catch (error) {
    console.error('Failed to create JBrowse theme:', error)
    // Fallback to default theme
    theme = createJBrowseTheme()
  }

  return (
    <ThemeProvider theme={theme}>
      <EmbeddedViewContainer key={`view-${view.id}`} view={view}>
        <Suspense fallback={<LoadingEllipses />}>
          <ReactComponent model={view} session={session} />
        </Suspense>
      </EmbeddedViewContainer>
    </ThemeProvider>
  )
})

export default CustomJBrowseLinearGenomeView

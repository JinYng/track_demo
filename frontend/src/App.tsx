import { useState, useEffect } from 'react'
import { createViewState, JBrowseApp } from '@jbrowse/react-app2'
// @ts-expect-error no font types
import '@fontsource/roboto'

import config from './config'
import { SplitLayout, ChatInterface } from './components'

type ViewModel = ReturnType<typeof createViewState>

function View() {
  const [viewState, setViewState] = useState<ViewModel>()

  useEffect(() => {
    const state = createViewState({
      config: {
        ...config,
      },
    })
    setViewState(state)
  }, [])

  if (!viewState) {
    return <div>Loading JBrowse...</div>
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>AI Genomics Assistant</h1>
      </header>

      <SplitLayout
        leftPanel={<ChatInterface viewState={viewState} />}
        rightPanel={
          <div style={{ height: '100%' }}>
            <JBrowseApp viewState={viewState} />
          </div>
        }
        defaultSplitPercentage={40}
      />
    </div>
  )
}

export default View

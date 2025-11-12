import { Suspense } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { observer } from 'mobx-react'
import { getEnv, isAlive } from 'mobx-state-tree'

import type { SessionWithWidgets } from '@jbrowse/core/util'

interface SidebarModalWidgetProps {
  session: SessionWithWidgets
}

const SidebarModalWidget = observer(function ({
  session,
}: SidebarModalWidgetProps) {
  // Check if session is valid
  if (!session || !isAlive(session)) {
    console.warn('Session is not available or not alive')
    return null
  }

  const { visibleWidget } = session
  const { pluginManager } = getEnv(session)

  // Return null when no widget is visible
  if (!visibleWidget) {
    return null
  }

  // Get widget type information
  const widgetType = pluginManager.getWidgetType(visibleWidget.type)

  if (!widgetType) {
    console.error(`Unknown widget type: ${visibleWidget.type}`)
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            pb: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Error
          </Typography>
          <IconButton
            onClick={() => session.hideAllWidgets()}
            size="small"
            aria-label="Close sidebar"
            sx={{
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
              transition: 'background-color 200ms',
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, pt: 2.5 }}>
          <Typography color="error">
            Error: Unknown widget type "{visibleWidget.type}"
          </Typography>
        </Box>
      </Box>
    )
  }

  const { ReactComponent, HeadingComponent, heading } = widgetType

  // Support Core-replaceWidget extension point
  const Component = pluginManager.evaluateExtensionPoint(
    'Core-replaceWidget',
    ReactComponent,
    {
      session,
      model: visibleWidget,
    },
  ) as React.FC<any>

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header with close button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
          {HeadingComponent ? (
            <HeadingComponent model={visibleWidget} />
          ) : heading ? (
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {heading}
            </Typography>
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Details
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={() => session.hideAllWidgets()}
          size="small"
          aria-label="Close sidebar"
          sx={{
            backgroundColor: 'action.hover',
            '&:hover': {
              backgroundColor: 'action.selected',
            },
            transition: 'background-color 200ms',
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Widget content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          pt: 2.5,
          backgroundColor: 'background.default',
        }}
      >
        <Suspense fallback={<Typography>Loading...</Typography>}>
          <Component
            model={visibleWidget}
            session={session}
            overrideDimensions={{
              height: window.innerHeight - 100,
              width: 460,
            }}
          />
        </Suspense>
      </Box>
    </Box>
  )
})

export default SidebarModalWidget

import 'css/reset.css'
import 'css/defaults.css'

import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from 'glamorous'

import { AppStateProvider, AppState, Middleware } from 'store/AppState'
import SyncWithStorage from 'store/SyncWithStorage'
import reducer, { initialState } from 'store/reducer'
import Options from 'components/Options'
import ErrorBoundary from 'components/ErrorBoundary'

render(
  <AppStateProvider defaultValue={initialState} reducer={reducer}>
    <Middleware component={SyncWithStorage}>
      <AppState>
        {({ value: { settings }, dispatch }) => (
          <ErrorBoundary settings={settings}>
            <ThemeProvider theme={settings}>
              <Options settings={settings} dispatch={dispatch} />
            </ThemeProvider>
          </ErrorBoundary>
        )}
      </AppState>
    </Middleware>
  </AppStateProvider>,
  window.document.getElementById('app-container')
)

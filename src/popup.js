import 'css/reset.css'
import 'css/defaults.css'

import 'img/icon-16.png'
import 'img/icon-24.png'
import 'img/icon-32.png'
import 'img/icon-48.png'
import 'img/icon-128.png'

import React from 'react'
import { render } from 'react-dom'
import glamorous, { ThemeProvider } from 'glamorous'
import delay from 'delay'

import { getTabs, getCurrentTab } from 'chrome'
import { AppStateProvider, AppState, Middleware } from 'store/AppState'
import SyncWithCurrentWindowTabs from 'store/SyncWithCurrentWindowTabs'
import SyncWithStorage from 'store/SyncWithStorage'
import reducer, { initialState } from 'store/reducer'
import Popup from 'components/Popup'
import ErrorBoundary from 'components/ErrorBoundary'

getCurrentTab()
  // the chrome extension window collapses to a tiny size
  // if we render immediately, so we'll delay by 10ms :/
  .then(delay(10))
  .then(({ index }) =>
    render(
      <AppStateProvider defaultValue={initialState} reducer={reducer}>
        <Middleware component={SyncWithStorage}>
          <Middleware component={SyncWithCurrentWindowTabs}>
            <AppState>
              {({ value: { tabs, settings } }) => (
                <ErrorBoundary settings={settings}>
                  <ThemeProvider theme={settings}>
                    <Popup
                      initialIndex={index}
                      tabs={tabs}
                      settings={settings}
                    />
                  </ThemeProvider>
                </ErrorBoundary>
              )}
            </AppState>
          </Middleware>
        </Middleware>
      </AppStateProvider>,
      window.document.getElementById('app-container')
    )
  )

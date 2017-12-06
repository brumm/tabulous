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

import { getTabs, getCurrentTab, selectTab, closeTab } from 'chrome'
import { AppStateProvider, AppState, Middleware } from 'store/AppState'
import SyncWithCurrentWindowTabs from 'store/SyncWithCurrentWindowTabs'
import SyncWithStorage from 'store/SyncWithStorage'
import reducer, { initialState } from 'store/reducer'
import Popup from 'components/Popup'
import ErrorBoundary from 'components/ErrorBoundary'

const selectTabAndClosePopup = tab => selectTab(tab).then(() => window.close())

// the chrome extension window collapses to a tiny size
// if we render immediately, so we'll delay by 10ms :/
delay(10)
  .then(getCurrentTab)
  .then(({ index, windowId }) =>
    render(
      <AppStateProvider defaultValue={initialState} reducer={reducer}>
        <Middleware component={SyncWithStorage}>
          <Middleware component={SyncWithCurrentWindowTabs}>
            <AppState>
              {({ value: { tabs, settings } }) => (
                <ErrorBoundary settings={settings}>
                  <ThemeProvider theme={settings}>
                    <Popup
                      forceFocus
                      initialTabIndex={index}
                      currentWindowId={windowId}
                      tabs={tabs}
                      settings={settings}
                      actions={{ selectTabAndClosePopup, closeTab }}
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

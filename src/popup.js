import 'css/reset.css'
import 'css/defaults.css'

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
                <ThemeProvider theme={settings}>
                  <Popup initialIndex={index} tabs={tabs} settings={settings} />
                </ThemeProvider>
              )}
            </AppState>
          </Middleware>
        </Middleware>
      </AppStateProvider>,
      window.document.getElementById('app-container')
    )
  )

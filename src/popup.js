import 'css/reset.css'
import 'css/defaults.css'

import 'img/icon-16.png'
import 'img/icon-24.png'
import 'img/icon-32.png'
import 'img/icon-48.png'
import 'img/icon-128.png'

import 'analytics'
import React from 'react'
import { render } from 'react-dom'
import glamorous, { ThemeProvider } from 'glamorous'
import delay from 'delay'
import { Provider } from 'mobx-react'

import { getCurrentTab, storageGet } from 'browser-api'
import ErrorBoundary from 'components/ErrorBoundary'
import Tabulous from 'components/Tabulous'
import Sources from 'store/Sources'

import Tabs from 'plugins/Tabs'
import Bookmarks from 'plugins/Bookmarks'
import RecentlyClosed from 'plugins/RecentlyClosed'

Promise.all([
  getCurrentTab(),
  storageGet(),
  // the chrome extension window collapses to a tiny size
  // if we render immediately, so we'll delay by 10ms :/
  delay(70),
]).then(([{ index }, settings]) => {
  const sources = new Sources(
    settings.advancedMode ? [Tabs, Bookmarks, RecentlyClosed] : [Tabs]
  )
  sources.directObjects.setIndex(index)
  render(
    <Provider settings={settings}>
      <ErrorBoundary settings={settings}>
        <ThemeProvider theme={settings}>
          <Tabulous settings={settings} sources={sources} />
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>,
    window.document.getElementById('app-container')
  )
})

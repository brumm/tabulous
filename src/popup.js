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
import { Provider } from 'mobx-react'

import { getCurrentTab, storageGet } from 'browser-api'
import ErrorBoundary from 'components/ErrorBoundary'
import Tabulous from 'components/Tabulous'
import Sources from 'store/Sources'
import { initialState } from 'store/Settings'

import Tabs from 'plugins/Tabs'
import Bookmarks from 'plugins/Bookmarks'
import RecentlyClosed from 'plugins/RecentlyClosed'
import Extensions from 'plugins/Extensions'

Promise.all([getCurrentTab(), storageGet()]).then(([{ index }, settings]) => {
  settings = Object.assign(initialState, settings)
  const sources = (window.sources = new Sources(
    settings.advancedMode
      ? [Tabs, Bookmarks, RecentlyClosed, Extensions]
      : [Tabs]
  ))
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

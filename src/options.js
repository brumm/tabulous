import 'css/reset.css'
import 'css/defaults.css'

import 'analytics'
import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from 'glamorous'
import { HashRouter as Router } from 'react-router-dom'
import { Provider } from 'mobx-react'

import Options from 'components/Options'
import ErrorBoundary from 'components/ErrorBoundary'
import settings from 'store/Settings'
import sources from 'store/Sources'

render(
  <Router>
    <Provider settings={settings}>
      <ErrorBoundary settings={settings}>
        <ThemeProvider theme={settings}>
          <Options settings={settings} sources={sources} />
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  </Router>,
  window.document.getElementById('app-container')
)

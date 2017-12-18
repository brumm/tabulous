import 'css/reset.css'
import 'css/defaults.css'

import 'analytics'
import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from 'glamorous'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'mobx-react'

import Options from 'components/Options'
import ErrorBoundary from 'components/ErrorBoundary'
import settings from 'store/Settings'
import Sources from 'store/Sources'

import Tutorial from './components/Options/TutorialPlugin'

const sources = (window.sources = new Sources([Tutorial]))

render(
  <Router>
    <Provider settings={settings}>
      <ErrorBoundary settings={settings}>
        <ThemeProvider theme={settings}>
          <Route
            render={({ location }) => (
              <Options
                settings={settings}
                sources={sources}
                location={location}
              />
            )}
          />
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  </Router>,
  window.document.getElementById('app-container')
)

import 'css/reset.css'
import 'css/defaults.css'

import React from 'react'
import { render } from 'react-dom'
import { ThemeProvider } from 'glamorous'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { observe } from 'mobx'

import Options, { AVAILABLE_TABS } from 'components/Options'
import ErrorBoundary from 'components/ErrorBoundary'
import settings from 'store/Settings'
import Sources from 'store/Sources'

import Tabs from 'plugins/Tabs'
import Bookmarks from 'plugins/Bookmarks'
import RecentlyClosed from 'plugins/RecentlyClosed'
import Extensions from 'plugins/Extensions'

const renderRoot = () => {
  const sources = (window.sources = new Sources(
    settings.advancedMode
      ? [Tabs, Bookmarks, RecentlyClosed, Extensions]
      : [Tabs]
  ))

  render(
    <Router>
      <Provider settings={settings}>
        <ErrorBoundary settings={settings}>
          <ThemeProvider theme={settings}>
            <Switch>
              <Route
                path={`/:activeTab(${AVAILABLE_TABS.join('|')})`}
                children={({ location, match }) => (
                  <Options
                    activeTab={match.params.activeTab}
                    settings={settings}
                    sources={sources}
                    location={location}
                  />
                )}
              />
              <Redirect from="/" to="/shortcuts" />
            </Switch>
          </ThemeProvider>
        </ErrorBoundary>
      </Provider>
    </Router>,
    window.document.getElementById('app-container')
  )
}

observe(settings, 'advancedMode', renderRoot)
renderRoot()

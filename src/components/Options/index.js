import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { position } from 'polished'
import { observer } from 'mobx-react'

import Tabulous from 'components/Tabulous'
import Settings from './Settings'
import HeyThere from './HeyThere'
import placeholderTabs from './placeholderTabs'
import {
  Container,
  Panel,
  FakeToolbar,
  FakeToolbarIcon,
  FakePopupFrame,
} from './Layout'

@observer
export default class Options extends React.Component {
  state = {
    closedTabIds: [],
  }

  render() {
    const {
      dispatch,
      settings: {
        listWidth,
        listItemHeight,
        maxVisibleResults,
        highlightColor,
        markedColor,
        advancedMode,
      },
    } = this.props
    const { closedTabIds } = this.state
    const listHeight = Math.ceil(listItemHeight * maxVisibleResults)
    const filteredTabs = placeholderTabs.filter(
      ({ id }) => !closedTabIds.includes(id)
    )

    return (
      <Container>
        <Route
          path="/first-run"
          render={() => (
            <Panel style={{ backgroundColor: '#fafafa' }}>
              <HeyThere settings={this.props.settings} />
            </Panel>
          )}
        />

        <Panel>
          <div style={{ height: '55vh', overflow: 'visible' }}>
            <FakeToolbar>
              <FakeToolbarIcon />
            </FakeToolbar>

            <FakePopupFrame>
              <Tabulous
                settings={this.props.settings}
                sources={this.props.sources}
              />
            </FakePopupFrame>
          </div>
        </Panel>

        <Panel style={{ flex: 'unset' }}>
          <Settings settings={this.props.settings} />
        </Panel>
      </Container>
    )
  }
}

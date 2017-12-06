import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { position } from 'polished'

import Popup from 'components/Popup'
import { Input, FancyShadow } from 'components/Input'
import Tablist from 'components/Tablist'
import Settings from './Settings'
import HeyThere from './HeyThere'
import placeholderTabs from './placeholderTabs'
import {
  Container,
  Left,
  Right,
  FakeToolbar,
  FakeToolbarIcon,
  FakePopupFrame,
} from './Layout'

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
      },
    } = this.props
    const { closedTabIds } = this.state
    const listHeight = Math.ceil(listItemHeight * maxVisibleResults)

    return (
      <Container>
        <Left>
          <FakeToolbar>
            <FakeToolbarIcon />
          </FakeToolbar>
          <FakePopupFrame>
            <Popup
              initialIndex={0}
              tabs={placeholderTabs.filter(
                ({ id }) => !closedTabIds.includes(id)
              )}
              settings={this.props.settings}
              actions={{
                selectTabAndClosePopup() {},
                closeTab: (...tabIds) =>
                  this.setState({
                    closedTabIds: [...closedTabIds, ...tabIds],
                  }),
              }}
            />
          </FakePopupFrame>
        </Left>

        <Route
          path="/first-run"
          render={() => (
            <Right>
              <HeyThere />
            </Right>
          )}
        />

        <Right>
          <Settings dispatch={dispatch} settings={this.props.settings} />
        </Right>
      </Container>
    )
  }
}

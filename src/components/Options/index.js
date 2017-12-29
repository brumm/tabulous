import React from 'react'
import { Route } from 'react-router-dom'
import { position } from 'polished'
import { observer } from 'mobx-react'
import SwipeableViews from 'react-swipeable-views'
import { transparentize } from 'polished'

import { initialState } from 'store/Settings'
import { storageSet } from 'browser-api'
import Tabulous from 'components/Tabulous'
import HeyThere from './HeyThere'
import Shortcuts from './Shortcuts'
import Appearance from './Appearance'
import Advanced from './Advanced'
import {
  Container,
  Panel,
  FakeToolbar,
  FakeToolbarIcon,
  FakePopupFrame,
  SettingsProvider,
  Setting,
  Value,
  SettingsInput,
  Button,
  Tabbar,
} from './Layout'

export const AVAILABLE_TABS = ['intro', 'shortcuts', 'appearance', 'advanced']

@observer
export default class Options extends React.Component {
  render() {
    const {
      activeTab,
      settings: {
        listWidth,
        listItemHeight,
        maxVisibleResults,
        highlightColor,
        markedColor,
        advancedMode,
      },
    } = this.props
    const listHeight = Math.ceil(listItemHeight * maxVisibleResults)
    const activeTabIndex = AVAILABLE_TABS.indexOf(activeTab)
    const showSaveButton = activeTab !== 'intro'

    return (
      <Container>
        <Panel>
          <div
            style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ height: '55vh', overflow: 'visible' }}>
              <FakeToolbar>
                <FakeToolbarIcon />
              </FakeToolbar>

              <FakePopupFrame>
                <Tabulous
                  settings={this.props.settings}
                  sources={this.props.sources}
                  closeTab={(...args) => console.log('closeTab', ...args)}
                />
              </FakePopupFrame>
            </div>
          </div>
        </Panel>

        <Panel
          style={{
            maxWidth: '33.333vw',
            backgroundColor: '#fafafa',
            fontFamily: 'Roboto, sans-serif',
            fontSize: 14,
          }}
        >
          <Tabbar active={activeTabIndex} items={AVAILABLE_TABS} />
          <SwipeableViews
            style={{ backgroundColor: '#fafafa' }}
            slideStyle={{
              overflowY: 'auto',
              height: 'calc(100vh - 45px - 60px)',
            }}
            containerStyle={{
              overflow: 'visible',
            }}
            index={activeTabIndex}
          >
            <HeyThere settings={this.props.settings} />
            <Shortcuts />
            <Appearance />
            <Advanced />
          </SwipeableViews>
          {showSaveButton && (
            <div style={{ display: 'flex', flexShrink: 0, padding: 10 }}>
              <Button
                onClick={() => {
                  storageSet(initialState)
                  set(initialState)
                }}
              >
                Reset to defaults
              </Button>
              <Button primary onClick={() => storageSet(this.props.settings)}>
                Save
              </Button>
            </div>
          )}
        </Panel>
      </Container>
    )
  }
}

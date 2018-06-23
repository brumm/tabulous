import React from 'react'
import { Route } from 'react-router-dom'
import { position } from 'polished'
import { observer } from 'mobx-react'
import SwipeableViews from 'react-swipeable-views'
import { transparentize, margin, padding } from 'polished'
import glamorous from 'glamorous'

import { initialState } from 'store/Settings'
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

const Toasts = glamorous.div({
  position: 'absolute',
  pointerEvents: 'none',
  padding: 10,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column-reverse',
})

const Toast = glamorous.div({
  display: 'inline-flex',
  padding: 10,
  backgroundColor: '#fff',
  borderRadius: 200,
  boxShadow: `
    0 0 0 0.5px rgba(0, 0, 0, 0.1),
    0 1px 10px rgba(0, 0, 0, 0.1)
  `,
  '& + &': {
    marginTop: 10,
  },
})

const TBObject = glamorous.span(({ index = 0 }) => ({
  fontSize: 15,
  verticalAlign: 'middle',
  borderRadius: 50,
  maxWidth: '25vw',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  backgroundColor: ['#fff7bd', '#E1F5FE', '#DCEDC8'][index],
  ...padding(5, 13, 6),
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1) inset',
  '&:not(:last-child)': {
    marginRight: 10,
  },
}))

@observer
export default class Options extends React.Component {
  state = {
    commands: [],
  }

  constructor(props) {
    super(props)
    props.sources.constructor.prototype.execute = () =>
      this.addCommand({
        id: Math.random()
          .toString(36)
          .substring(2, 15),
        directObject: sources.directObjects.selected.name,
        actionObject: sources.actionObjects.selected.name,
        indirectObject: sources.indirectObjects.selected.name,
      })
  }

  addCommand(command) {
    this.setState(({ commands }) => ({
      commands: [command, ...commands],
    }))
    setTimeout(() => this.removeCommand(command.id), 4000)
  }

  removeCommand(id) {
    this.setState(({ commands }) => ({
      commands: commands.filter(command => id !== command.id),
    }))
  }

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
        set,
        persist,
        needsSave,
      },
    } = this.props
    const listHeight = Math.ceil(listItemHeight * maxVisibleResults)
    const activeTabIndex = AVAILABLE_TABS.indexOf(activeTab)
    const showSaveButton = activeTab !== 'intro'

    return (
      <Container>
        <Panel
          style={{
            backgroundImage: `
            linear-gradient(45deg, #8360c3, #2ebf91)
          `,
          }}
        >
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

            <Toasts>
              {this.state.commands.map(
                ({ id, directObject, actionObject, indirectObject }, index) => (
                  <div
                    style={{
                      transform: `scale(${1 / (index + 1)})`,
                      display: 'flex',
                      justifyContent: 'center',
                      padding: 5,
                    }}
                    key={id}
                  >
                    <Toast>
                      <TBObject index={0}>{directObject}</TBObject>
                      <TBObject index={1}>{actionObject}</TBObject>
                      {indirectObject && (
                        <TBObject index={2}>{indirectObject}</TBObject>
                      )}
                    </Toast>
                  </div>
                )
              )}
            </Toasts>
          </div>
        </Panel>

        <Panel
          style={{
            maxWidth: '33.333vw',
            minWidth: 400,
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
                  persist(initialState)
                }}
              >
                Reset to defaults
              </Button>
              <Button primary inactive={!needsSave} onClick={() => persist()}>
                Save
              </Button>
            </div>
          )}
        </Panel>
      </Container>
    )
  }
}

import React, { Fragment } from 'react'
import glamorous from 'glamorous'
import { observer } from 'mobx-react'
import ComboKeys from 'react-combokeys'
import { transparentize } from 'polished'

import { closeTab } from 'browser-api'
import { wrapAround, transformShortcut } from 'utils'
import Input, { FancyShadow } from 'components/Input'
import Ellipsis from 'components/Ellipsis'
import ItemList, { ListItem } from 'components/ItemList'

const PaneContainer = glamorous.div({
  display: 'flex',
})

const Pane = glamorous.div(({ active, theme }) => ({
  display: 'flex',
  flexGrow: active ? 1 : 0,
  flexShrink: active ? null : 0,
  position: 'relative',
  zIndex: active ? 2 : 1,
  height: theme.listItemHeight,
  alignItems: 'center',
  boxShadow: `
    0 0 10px rgba(0, 0, 0, 0.2)
  `,
  backgroundColor: active ? '#fff' : '#fafafa',
}))

const Container = glamorous.div(({ theme }) => ({
  width: theme.listWidth,
}))

@observer
export default class Tabulous extends React.Component {
  state = {
    activePaneIndex: 0,
    markedTabIds: [],
  }

  get showThirdPane() {
    return this.props.sources.indirectObjects.items.length > 0
  }

  focusInput = () =>
    this.props.forceFocus && this.InputNode && this.InputNode.focus()
  componentWillUpdate = () => this.focusInput()
  componentDidMount = () => this.focusInput()

  markTab = (...tabIds) =>
    this.setState(({ markedTabIds }) => ({
      markedTabIds: [...markedTabIds, ...tabIds],
    }))

  unmarkTab = (...tabIds) =>
    this.setState(({ markedTabIds }) => ({
      markedTabIds: markedTabIds.filter(markedId => !tabIds.includes(markedId)),
    }))

  changeActivePaneIndex(direction) {
    this.setState(({ activePaneIndex }) => ({
      activePaneIndex: wrapAround(
        activePaneIndex + direction,
        this.showThirdPane ? 3 : 2
      ),
    }))
  }

  render() {
    const {
      sources,
      settings: {
        highlightColor,
        markedColor,
        listItemHeight,
        maxVisibleResults,
        listWidth,
        markTabShortcut,
        markAllTabsShortcut,
        closeTabShortcut,
        advancedMode,
      },
    } = this.props
    const { activePaneIndex, markedTabIds } = this.state
    const activeSource = sources.getActiveSource(activePaneIndex)
    const listHeight = Math.ceil(listItemHeight * maxVisibleResults)
    const noRowsMessage =
      activeSource.searchTerm.length > 0
        ? `No match for ${activeSource.searchTerm.join('')}`
        : "Nothin'"

    return (
      <Container>
        <ComboKeys
          // generate ['a', ..., 'z']
          bind={Array.from({ length: 26 }, (_, i) =>
            String.fromCharCode(97 + i)
          )}
          onCombo={({ event, combo }) => {
            event.preventDefault()
            activeSource.pushSearchCharacter(combo)
          }}
        />
        {advancedMode && (
          <Fragment>
            <ComboKeys
              bind={['tab', 'shift+tab']}
              onCombo={({ event }) => {
                event.preventDefault()
                this.changeActivePaneIndex(event.shiftKey ? -1 : 1)
              }}
            />
            <ComboKeys
              bind="backspace"
              onCombo={({ event }) => {
                event.preventDefault()
                activeSource.clearSearchTerm()
              }}
            />
          </Fragment>
        )}
        <ComboKeys
          bind={'enter'}
          onCombo={({ event }) => {
            event.preventDefault()
            sources.execute(markedTabIds)
          }}
        />
        <ComboKeys
          bind={['up', 'down']}
          onCombo={({ combo, event }) => {
            event.preventDefault()
            activeSource.changeIndex(combo === 'up' ? -1 : 1)
          }}
        />
        {activePaneIndex === 0 && (
          <Fragment>
            <ComboKeys
              bind={transformShortcut(closeTabShortcut)}
              onCombo={({ event }) => {
                event.preventDefault()
                const tabIds = [
                  activeSource.selected.id,
                  ...markedTabIds,
                ].filter((el, i, a) => i === a.indexOf(el))
                closeTab(...tabIds)
              }}
            />
            <ComboKeys
              bind={transformShortcut(markTabShortcut)}
              onCombo={({ event }) => {
                event.preventDefault()
                markedTabIds.includes(activeSource.selected.id)
                  ? this.unmarkTab(activeSource.selected.id)
                  : this.markTab(activeSource.selected.id)
              }}
            />
            <ComboKeys
              bind={transformShortcut(markAllTabsShortcut)}
              onCombo={({ event }) => {
                event.preventDefault()
                const allTabIds = activeSource.items.map(({ id }) => id)
                if (allTabIds.length === markedTabIds.length) {
                  this.setState({
                    markedTabIds: [],
                  })
                } else {
                  this.setState({
                    markedTabIds: allTabIds,
                  })
                }
              }}
            />
          </Fragment>
        )}
        <FancyShadow>
          {advancedMode ? (
            <PaneContainer>
              <Pane active={activePaneIndex === 0}>
                <ListItem
                  icon={sources.directObjects.selected.icon}
                  name={
                    activePaneIndex === 0 && sources.directObjects.selected.name
                  }
                  settings={{
                    highlightColor,
                    markedColor,
                    listItemHeight,
                  }}
                />
              </Pane>
              <Pane active={activePaneIndex === 1}>
                <ListItem
                  icon={sources.actionObjects.selected.icon}
                  name={
                    activePaneIndex === 1 && sources.actionObjects.selected.name
                  }
                  settings={{
                    highlightColor,
                    markedColor,
                    listItemHeight,
                  }}
                />
              </Pane>
              {this.showThirdPane && (
                <Pane active={activePaneIndex === 2}>
                  <ListItem
                    icon={sources.indirectObjects.selected.icon}
                    name={
                      activePaneIndex === 2 &&
                      sources.indirectObjects.selected.name
                    }
                    settings={{
                      highlightColor,
                      markedColor,
                      listItemHeight,
                    }}
                  />
                </Pane>
              )}
            </PaneContainer>
          ) : (
            <Input
              type="text"
              autoFocus
              value={activeSource.searchTerm.join('')}
              placeholder="Search"
              innerRef={node => (this.InputNode = node)}
              onChange={({ target: { value } }) =>
                activeSource.setSearchTerm(value.split())}
            />
          )}
        </FancyShadow>
        <ItemList
          extraData={{
            filter: activeSource.searchTerm.length,
            markedTabIds: markedTabIds.length,
          }}
          noRowsMessage={noRowsMessage}
          markedTabIds={markedTabIds}
          loading={activeSource.loading}
          width={listWidth}
          height={Math.min(
            listHeight,
            listItemHeight * (activeSource.items.length || 1)
          )}
          itemHeight={listItemHeight}
          items={activeSource.items}
          selectedIndex={activeSource.index}
          style={{ backgroundColor: '#fafafa' }}
        />
      </Container>
    )
  }
}

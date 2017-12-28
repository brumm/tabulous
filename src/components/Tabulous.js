import React, { Fragment } from 'react'
import glamorous from 'glamorous'
import { observer } from 'mobx-react'
import ComboKeys from 'react-combokeys'

import { closeTab } from 'browser-api'
import { wrapAround, transformShortcut, uniqIds } from 'utils'
import Input, { FancyShadow } from 'components/Input'
import { Pane, PaneContainer } from 'components/Pane'
import ItemList from 'components/ItemList'

const Container = glamorous.div(({ theme }) => ({
  width: theme.listWidth,
}))

// generate ['a', ..., 'z']
// to use in keybinding later
const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(97 + i)
)

@observer
export default class Tabulous extends React.Component {
  static defaultProps = {
    closeTab,
  }

  state = {
    activePaneIndex: 0,
    markedItemIds: [],
  }

  get showThirdPane() {
    return !!this.props.sources.actionObjects.selected.suggestedObjects
  }

  focusInput = () =>
    this.props.forceFocus && this.InputNode && this.InputNode.focus()
  componentWillUpdate = () => this.focusInput()
  componentDidMount = () => this.focusInput()

  markItem = (...itemIds) =>
    this.setState(({ markedItemIds }) => ({
      markedItemIds: [...markedItemIds, ...itemIds.filter(Boolean)],
    }))

  unmarkItem = (...itemIds) =>
    this.setState(({ markedItemIds }) => ({
      markedItemIds: markedItemIds.filter(
        markedId => !itemIds.includes(markedId)
      ),
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
      closeTab,
      settings: {
        highlightColor,
        markedColor,
        listItemHeight,
        maxVisibleResults,
        listWidth,
        markItemShortcut,
        markAllTabsShortcut,
        closeTabShortcut,
        advancedMode,
      },
    } = this.props
    const { activePaneIndex, markedItemIds } = this.state
    const activeSource = sources.getActiveSource(activePaneIndex)
    const isTextMode = !!activeSource.selected.textMode
    const listHeight = isTextMode
      ? 0
      : Math.min(
          Math.ceil(listItemHeight * maxVisibleResults),
          listItemHeight * (activeSource.items.length || 1)
        )
    const noRowsMessage =
      activeSource.searchTerm.length > 0
        ? `No match for ${activeSource.searchTerm.join('')}`
        : "Nothin'"

    return (
      <Container>
        {advancedMode && (
          <Fragment>
            {!isTextMode && (
              <Fragment>
                <ComboKeys
                  bind={alphabet}
                  onCombo={({ event, combo }) => {
                    event.preventDefault()
                    activeSource.pushSearchCharacter(combo)
                  }}
                />
                <ComboKeys
                  bind="backspace"
                  onCombo={({ event }) => {
                    event.preventDefault()
                    if (activeSource.searchTerm.length) {
                      activeSource.clearSearchTerm()
                    }
                  }}
                />
              </Fragment>
            )}
            <ComboKeys
              bind={['tab', 'shift+tab']}
              onCombo={({ event }) => {
                event.preventDefault()
                this.changeActivePaneIndex(event.shiftKey ? -1 : 1)
              }}
            />
            {activePaneIndex !== 1 && (
              <Fragment>
                <ComboKeys
                  bind={'left'}
                  onCombo={({ event }) => {
                    event.preventDefault()
                    activeSource.browseToParent()
                  }}
                />
                {activeSource.selected.childResolver && (
                  <ComboKeys
                    bind={['right', 'space']}
                    onCombo={({ event }) => {
                      event.preventDefault()
                      activeSource.browseToChildren()
                    }}
                  />
                )}
              </Fragment>
            )}
          </Fragment>
        )}
        <ComboKeys
          bind={'enter'}
          onCombo={({ event }) => {
            event.preventDefault()
            sources.execute(markedItemIds)
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
                const itemIds = uniqIds([
                  activeSource.selected.id,
                  ...markedItemIds,
                ])
                closeTab(...itemIds)
              }}
            />
            <ComboKeys
              bind={transformShortcut(markItemShortcut)}
              onCombo={({ event }) => {
                event.preventDefault()
                markedItemIds.includes(activeSource.selected.id)
                  ? this.unmarkItem(activeSource.selected.id)
                  : this.markItem(activeSource.selected.id)
              }}
            />
            <ComboKeys
              bind={transformShortcut(markAllTabsShortcut)}
              onCombo={({ event }) => {
                event.preventDefault()
                const allTabIds = activeSource.items
                  .filter(({ type }) => !type.includes('tabulous.source'))
                  .map(({ id }) => id)
                if (allTabIds.length === markedItemIds.length) {
                  this.setState({
                    markedItemIds: [],
                  })
                } else {
                  this.setState({
                    markedItemIds: allTabIds,
                  })
                }
              }}
            />
          </Fragment>
        )}

        <FancyShadow>
          {advancedMode ? (
            <PaneContainer>
              <Pane
                active={activePaneIndex === 0}
                item={sources.directObjects.selected}
              />
              <Pane
                active={activePaneIndex === 1}
                item={sources.actionObjects.selected}
              />
              {this.showThirdPane && (
                <Pane
                  active={activePaneIndex === 2}
                  item={sources.indirectObjects.selected}
                />
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
                activeSource.setSearchTerm(value.split())
              }
            />
          )}
        </FancyShadow>
        <ItemList
          items={activeSource.items.filter(({ textMode }) => !textMode)}
          extraData={{
            filter: activeSource.searchTerm.length,
            markedItemIds: markedItemIds.length,
          }}
          noRowsMessage={noRowsMessage}
          markedItemIds={activePaneIndex === 0 ? markedItemIds : []}
          loading={activeSource.loading}
          width={listWidth}
          height={listHeight}
          itemHeight={listItemHeight}
          selectedIndex={activeSource.index}
          style={{ backgroundColor: '#fafafa', borderRadius: '0 0 2px 2px' }}
        />
      </Container>
    )
  }
}

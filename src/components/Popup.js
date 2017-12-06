import React, { Fragment } from 'react'
import glamorous, { Div } from 'glamorous'
import ComboKeys from 'react-combokeys'
import sortBy from 'lodash.sortby'

import Tablist from 'components/Tablist'
import { Input, FancyShadow } from 'components/Input'
import { transformShortcut } from 'utils'

const wrapAround = (value, bounds) => (value % bounds + bounds) % bounds

const Container = glamorous.div(({ theme }) => ({
  width: theme.listWidth,
}))

export default class Popup extends React.Component {
  state = {
    focused: false,
    markedTabs: [],
    selectedIndex: this.props.initialTabIndex,
    filterText: '',
  }

  focusInput = () =>
    this.props.forceFocus && this.InputNode && this.InputNode.focus()
  componentWillUpdate = () => this.focusInput()
  componentDidMount = () => this.focusInput()

  markTab = (...tabIds) =>
    this.setState(({ markedTabs }) => ({
      markedTabs: [...markedTabs, ...tabIds],
    }))

  unmarkTab = (...tabIds) =>
    this.setState(({ markedTabs }) => ({
      markedTabs: markedTabs.filter(markedId => !tabIds.includes(markedId)),
    }))

  changeIndex = (direction, bounds) =>
    this.setState(({ selectedIndex }) => ({
      selectedIndex: wrapAround(selectedIndex + direction, bounds),
    }))

  render() {
    const {
      tabs,
      actions: { selectTabAndClosePopup, closeTab },
      settings: {
        listWidth,
        listItemHeight,
        maxVisibleResults,
        markAllTabsShortcut,
        markTabShortcut,
        closeTabSortcut,
      },
    } = this.props
    const { selectedIndex, filterText, markedTabs, focused } = this.state
    const listHeight = Math.ceil(listItemHeight * maxVisibleResults)

    const filteredTabs = sortBy(
      tabs.filter(
        ({ title, url }) =>
          title.toLowerCase().match(filterText.toLowerCase()) ||
          url.toLowerCase().match(filterText.toLowerCase())
      ),
      ['index', 'windowId']
    )

    return (
      <Container>
        {focused && (
          <Fragment>
            <ComboKeys
              bind={'enter'}
              onCombo={({ event }) => {
                event.preventDefault()
                selectTabAndClosePopup(filteredTabs[selectedIndex])
              }}
            />

            <ComboKeys
              bind={['up', 'down']}
              onCombo={({ combo, event }) => {
                event.preventDefault()
                this.changeIndex(combo === 'up' ? -1 : 1, filteredTabs.length)
              }}
            />

            <ComboKeys
              bind={transformShortcut(markTabShortcut)}
              onCombo={({ event }) => {
                event.preventDefault()
                markedTabs.includes(filteredTabs[selectedIndex].id)
                  ? this.unmarkTab(filteredTabs[selectedIndex].id)
                  : this.markTab(filteredTabs[selectedIndex].id)
              }}
            />

            <ComboKeys
              bind={transformShortcut(closeTabSortcut)}
              onCombo={({ event }) => {
                event.preventDefault()
                const tabIds = [
                  filteredTabs[selectedIndex].id,
                  ...markedTabs,
                ].filter((el, i, a) => i === a.indexOf(el))
                closeTab(...tabIds)
              }}
            />

            <ComboKeys
              bind={transformShortcut(markAllTabsShortcut)}
              onCombo={({ event }) => {
                event.preventDefault()
                this.markTab(...filteredTabs.map(({ id }) => id))
              }}
            />
          </Fragment>
        )}

        <FancyShadow>
          <Input
            type="text"
            autoFocus
            value={filterText}
            placeholder="Search"
            onFocus={() =>
              this.setState({
                focused: true,
              })}
            onBlur={() =>
              this.setState({
                focused: false,
              })}
            innerRef={node => (this.InputNode = node)}
            onChange={({ target: { value } }) =>
              this.setState({
                filterText: value,
                selectedIndex: 0,
              })}
          />
        </FancyShadow>

        <Tablist
          noRowsMessage={
            filterText ? `No match for "${filterText}"` : "Nothin'"
          }
          items={filteredTabs}
          selectedIndex={selectedIndex}
          markedTabs={markedTabs}
          extraData={markedTabs}
          onSelect={selectTabAndClosePopup}
          width={listWidth}
          height={Math.min(
            listHeight,
            listItemHeight * (filteredTabs.length || 1)
          )}
          itemHeight={listItemHeight}
        />
      </Container>
    )
  }
}

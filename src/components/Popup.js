import React from 'react'
import glamorous, { Div } from 'glamorous'

import Tablist from 'components/Tablist'
import KeyHandler from 'components/KeyHandler'
import { Input, FancyShadow } from 'components/Input'
import { selectTab, closeTab } from 'chrome'

const wrapAround = (value, bounds) => (value % bounds + bounds) % bounds
const selectTabAndClosePopup = tab => selectTab(tab).then(() => window.close())

const Container = glamorous.div(({ theme }) => ({
  width: theme.listWidth,
}))

export default class Popup extends React.Component {
  state = {
    markedTabs: [],
    selectedIndex: this.props.initialIndex,
    filterText: '',
  }

  focusInput = () => this.InputNode && this.InputNode.focus()
  componentWillUpdate = () => this.focusInput()
  componentDidMount = () => this.focusInput()

  markTab = (...tabIds) =>
    this.setState(({ markedTabs }) => ({
      markedTabs: [...markedTabs, ...tabIds],
    }))

  unmarkTab = id =>
    this.setState(({ markedTabs }) => ({
      markedTabs: markedTabs.filter(markedId => markedId !== id),
    }))

  changeIndex = (direction, bounds) =>
    this.setState(({ selectedIndex }) => ({
      selectedIndex: wrapAround(selectedIndex + direction, bounds),
    }))

  render() {
    const {
      tabs,
      initialIndex,
      loading,
      settings: { listWidth, listItemHeight, maxVisibleResults },
    } = this.props
    const { selectedIndex, filterText, markedTabs } = this.state
    const listHeight = listItemHeight * maxVisibleResults
    const filteredTabs = tabs
      .filter(
        ({ title, url }) =>
          title.toLowerCase().match(filterText.toLowerCase()) ||
          url.toLowerCase().match(filterText.toLowerCase())
      )
      .sort((a, b) => a.index - b.index)
      .sort((a, b) => a.windowId - b.windowId)

    return (
      <Container>
        <KeyHandler
          keyValue={['ArrowUp', 'ArrowDown']}
          onKeyHandle={({ key }) =>
            this.changeIndex(key === 'ArrowUp' ? -1 : 1, filteredTabs.length)}
        />

        <KeyHandler
          keyValue="s"
          onKeyHandle={e => {
            if (e.ctrlKey) {
              e.preventDefault()
              markedTabs.includes(filteredTabs[selectedIndex].id)
                ? this.unmarkTab(filteredTabs[selectedIndex].id)
                : this.markTab(filteredTabs[selectedIndex].id)
            }
          }}
        />

        <KeyHandler
          keyValue="Enter"
          onKeyHandle={() =>
            selectTabAndClosePopup(filteredTabs[selectedIndex])}
        />

        <KeyHandler
          keyValue="d"
          onKeyHandle={e => {
            if (e.ctrlKey) {
              e.preventDefault()
              const tabIds = [
                filteredTabs[selectedIndex].id,
                ...markedTabs,
              ].filter((el, i, a) => i === a.indexOf(el))
              closeTab(...tabIds)
            }
          }}
        />

        <KeyHandler
          keyValue="a"
          onKeyHandle={e => {
            if (e.ctrlKey) {
              e.preventDefault()
              this.markTab(...filteredTabs.map(({ id }) => id))
            }
          }}
        />

        <FancyShadow>
          <Input
            type="text"
            autofocus
            value={filterText}
            placeholder="Search"
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
          loading={loading}
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

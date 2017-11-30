import React from 'react'
import { List } from 'react-virtualized'
import glamorous, { Div } from 'glamorous'
import * as glamor from 'glamor'

import 'img/icon-34.png'
import defaultIcon from 'img/icon-128.png'
import Pulse from 'components/Pulse'
import { AppState } from 'store/AppState'

const Ellipsis = glamorous(glamorous.Div)({
  maxWidth: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})

const Icon = ({ size = 24, url }) => (
  <Div width={size} height={size}>
    <img src={url} width={size} height={size} />
  </Div>
)

const ListItem = ({
  id,
  selected,
  icon,
  title,
  url,
  style,
  children,
  onSelect,
  marked,
  audible,
  index,
}) => (
  <AppState>
    {({ value: { settings } }) => (
      <Div
        display="flex"
        alignItems="stretch"
        padding="0px 10px"
        backgroundColor={selected && settings.highlightColor}
        boxShadow={marked && `5px 0 0 ${settings.selectedColor} inset`}
        onClick={() => onSelect(id)}
        style={style}
      >
        {children || [
          <Div
            key="icon"
            padding={Math.floor(settings.listItemHeight * 0.05)}
            flexShrink={0}
            backgroundColor={selected && '#fff'}
            borderRadius={3}
            overflow="visible"
            position="relative"
            alignSelf="center"
          >
            {audible && [
              <Pulse key="pulse-1" />,
              <Pulse key="pulse-2" delay="300ms" />,
              <Pulse key="pulse-3" delay="500ms" />,
            ]}
            <Icon
              size={Math.max(settings.listItemHeight - 20, 16)}
              url={icon}
            />
          </Div>,
          <Div
            marginLeft={10}
            overflow="hidden"
            key="info"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            paddingTop={Math.floor(settings.listItemHeight * 0.18)}
            paddingBottom={Math.floor(settings.listItemHeight * 0.18)}
          >
            <Ellipsis color={selected && '#fff'}>{title}</Ellipsis>
            {settings.listItemHeight >= 32 && (
              <Ellipsis
                marginTop={Math.floor(settings.listItemHeight * 0.08)}
                fontSize="smaller"
                color={selected ? '#fff' : '#BDBDBD'}
              >
                {url}
              </Ellipsis>
            )}
          </Div>,
        ]}
      </Div>
    )}
  </AppState>
)

export default class Tablist extends React.Component {
  static defaultProps = {
    extraData: [],
    onSelect: () => {},
  }

  loadingRenderer = () => (
    <ListItem
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: this.props.itemHeight,
      }}
    >
      loading
    </ListItem>
  )

  noRowsRenderer = () => (
    <ListItem
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: this.props.itemHeight,
      }}
    >
      {this.props.noRowsMessage}
    </ListItem>
  )

  componentWillReceiveProps({ extraData }) {
    if (this.props.extraData.length !== extraData.length) {
      this.ListComponent.forceUpdateGrid()
    }
  }

  rowRenderer = ({ key, index, style }) => {
    const tab = this.props.items[index]
    const isSelected = index === this.props.selectedIndex
    const isMarked = this.props.markedTabs.includes(tab.id)

    return (
      <ListItem
        key={key}
        id={tab.id}
        index={tab.index}
        onSelect={this.props.onSelect}
        selected={isSelected}
        marked={isMarked}
        audible={tab.audible && !tab.mutedInfo.muted}
        icon={tab.favIconUrl || defaultIcon}
        title={tab.title}
        url={tab.url}
        style={style}
      />
    )
  }

  render() {
    const {
      selectedIndex,
      items,
      width,
      height,
      itemHeight,
      loading,
    } = this.props

    return (
      <List
        ref={component => (this.ListComponent = component)}
        width={width}
        height={height}
        rowCount={items.length}
        rowHeight={itemHeight}
        noRowsRenderer={loading ? this.loadingRenderer : this.noRowsRenderer}
        rowRenderer={this.rowRenderer}
        scrollToIndex={selectedIndex}
        overscanRowCount={0}
        tabIndex={0}
        containerStyle={{
          backgroundColor: '#fbfbfb',
        }}
      />
    )
  }
}

import React from 'react'
import { List } from 'react-virtualized'
import glamorous, { Div } from 'glamorous'
import * as glamor from 'glamor'
import { inject, observer } from 'mobx-react'

import Pulse from 'components/Pulse'
import Ellipsis from 'components/Ellipsis'

const Icon = ({ size = 24, url }) => (
  <Div width={size} height={size}>
    <img src={url} width={size} height={size} />
  </Div>
)

export const ListItem = inject('settings')(
  observer(
    ({
      selected,
      icon,
      name,
      details,
      style,
      children,
      marked,
      audible,
      settings,
    }) => (
      <Div
        display="flex"
        alignItems="stretch"
        padding="0px 10px"
        backgroundColor={selected && settings.highlightColor}
        boxShadow={marked && `5px 0 0 ${settings.markedColor} inset`}
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
            marginLeft={(name || details) && 10}
            overflow="hidden"
            key="info"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            paddingTop={Math.floor(settings.listItemHeight * 0.18)}
            paddingBottom={Math.floor(settings.listItemHeight * 0.18)}
          >
            <Ellipsis color={selected && '#fff'}>{name}</Ellipsis>
            {settings.listItemHeight >= 32 &&
              details && (
                <Ellipsis
                  marginTop={Math.floor(settings.listItemHeight * 0.08)}
                  fontSize="smaller"
                  color={selected ? '#fff' : '#BDBDBD'}
                >
                  {details}
                </Ellipsis>
              )}
          </Div>,
        ]}
      </Div>
    )
  )
)

export default class ItemList extends React.Component {
  static defaultProps = {
    loading: false,
    extraData: [],
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
    if (
      Object.keys(extraData).some(
        key => extraData[key] === this.props.extraData[key]
      )
    ) {
      this.ListComponent.forceUpdateGrid()
    }
  }

  rowRenderer = ({ key, index, style }) => {
    const item = this.props.items[index]
    const isSelected = index === this.props.selectedIndex
    const isMarked = this.props.markedTabIds.includes(item.id)

    return (
      <ListItem
        key={key}
        selected={isSelected}
        marked={isMarked}
        audible={item.meta.audible}
        icon={item.icon}
        name={item.name}
        details={item.details}
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
      style,
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
        containerStyle={style}
      />
    )
  }
}

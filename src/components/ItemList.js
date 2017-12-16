import React, { Fragment } from 'react'
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

export const Item = inject('settings')(
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
      providesChildren,
      hideChevron,
      hideDetails,
    }) => (
      <Div
        display="flex"
        alignItems="stretch"
        padding="0px 5px 0 10px"
        backgroundColor={selected && settings.highlightColor}
        boxShadow={marked && `5px 0 0 ${settings.markedColor} inset`}
        style={style}
      >
        {children || (
          <Fragment>
            <Div
              padding={Math.floor(settings.listItemHeight * 0.05)}
              flexShrink={0}
              backgroundColor={selected && '#fff'}
              borderRadius={3}
              overflow="visible"
              position="relative"
              alignSelf="center"
            >
              {audible && (
                <Fragment>
                  <Pulse />
                  <Pulse delay="300ms" />
                  <Pulse delay="500ms" />
                </Fragment>
              )}
              <Icon
                size={Math.max(settings.listItemHeight - 20, 16)}
                url={icon}
              />
            </Div>
            <Div
              marginLeft={!hideDetails && 10}
              width={hideDetails && 0}
              marginRight={5}
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
                    marginTop={Math.floor(settings.listItemHeight * 0.09)}
                    fontSize="smaller"
                    color={selected ? '#fff' : '#BDBDBD'}
                    letterSpacing={0.2}
                  >
                    {details}
                  </Ellipsis>
                )}
            </Div>
            {!hideChevron && (
              <Div
                display="flex"
                alignItems="center"
                flexShrink={0}
                marginLeft="auto"
                visibility={providesChildren ? 'visible' : 'hidden'}
              >
                <svg
                  width="12px"
                  height="12px"
                  viewBox="0 0 512 512"
                  fill={selected ? '#fff' : '#626262'}
                >
                  <path d="M298.3,256L298.3,256L298.3,256L131.1,81.9c-4.2-4.3-4.1-11.4,0.2-15.8l29.9-30.6c4.3-4.4,11.3-4.5,15.5-0.2l204.2,212.7
                        c2.2,2.2,3.2,5.2,3,8.1c0.1,3-0.9,5.9-3,8.1L176.7,476.8c-4.2,4.3-11.2,4.2-15.5-0.2L131.3,446c-4.3-4.4-4.4-11.5-0.2-15.8
                        L298.3,256z" />
                </svg>
              </Div>
            )}
          </Fragment>
        )}
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
    <Item
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: this.props.itemHeight,
      }}
    >
      loading
    </Item>
  )

  noRowsRenderer = () => (
    <Item
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: this.props.itemHeight,
      }}
    >
      {this.props.noRowsMessage}
    </Item>
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
      <Item
        key={key}
        selected={isSelected}
        marked={isMarked}
        audible={item.meta.audible}
        icon={item.icon}
        name={item.name}
        details={item.details}
        style={style}
        providesChildren={item.providesChildren}
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

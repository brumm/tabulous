import React from 'react'
import glamorous from 'glamorous'

import { Item } from 'components/ItemList'

export const PaneContainer = glamorous.div({
  display: 'flex',
})

export const PaneWrapper = glamorous.div(({ active, theme }) => ({
  display: 'flex',
  flexGrow: active ? 1 : 0,
  flexShrink: active ? null : 0,
  height: theme.listItemHeight,
  maxWidth: theme.listWidth - (theme.listItemHeight + 4),
  position: 'relative',
  transition: 'all 250ms ease-out',
  zIndex: active ? 2 : 1,
  boxShadow: `
    0 0 0 1px #e0e0e0
  `,
  backgroundColor: active ? '#fff' : '#fafafa',
}))

export const Pane = ({ active, item }) => (
  <PaneWrapper active={active}>
    <Item
      hideDetails={!active}
      hideChevron
      icon={item.icon}
      name={item.name}
      audible={item.meta.audible}
    />
  </PaneWrapper>
)

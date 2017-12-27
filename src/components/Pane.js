import React from 'react'
import glamorous from 'glamorous'

import Input from 'components/Input'
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
  transition: 'all 250ms cubic-bezier(0.250, 0.460, 0.450, 0.940)',
  zIndex: active ? 2 : 1,
  boxShadow: `
    0 0 0 1px #e0e0e0,
    0 0 10px #c8c8c8
  `,
  backgroundColor: active ? '#fff' : '#fafafa',
}))

const AutoSelectInput = props => (
  <Input innerRef={node => node && node.select()} {...props} />
)

export const Pane = ({ active, item }) => (
  <PaneWrapper active={active}>
    {item.textMode ? (
      <Item
        hideDetails
        hideChevron
        icon={item.icon}
        name={
          <AutoSelectInput
            autoFocus
            onChange={({ target: { value } }) => (item.name = value)}
            defaultValue={item.name}
            type="text"
          />
        }
      />
    ) : (
      <Item
        hideDetails={!active}
        hideChevron={!active}
        icon={item.icon}
        name={item.name}
        audible={item.meta.audible && !item.meta.muted}
      />
    )}
  </PaneWrapper>
)

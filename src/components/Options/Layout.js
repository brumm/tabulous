import React from 'react'
import { inject, observer } from 'mobx-react'
import glamorous, { Div, Label } from 'glamorous'
import { triangle, transparentize, selection } from 'polished'
import { Link } from 'react-router-dom'

import smallIcon from 'img/icon-24.png'

export const Container = glamorous.div({
  display: 'flex',
  height: '100vh',
})

export const Panel = glamorous.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

export const FakeToolbar = glamorous.div({
  width: '100%',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const FakeToolbarIcon = glamorous.div({
  width: 25,
  height: 24,
  borderRadius: 3,
  backgroundColor: '#D4D4D4',
  backgroundImage: `url(${smallIcon})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center 40%',
  backgroundSize: '75%',
})

export const FakePopupFrame = glamorous.div({
  position: 'relative',
  overflow: 'visible',
  top: -4,
  borderRadius: 2,
  border: '1px solid #fff',
  minHeight: 20,
  backgroundColor: '#fff',
  minWidth: 100,
  filter: `
    drop-shadow(0 0px 5px rgba(0, 0, 0, 0.1))
    drop-shadow(0 10px 10px rgba(0, 0, 0, 0.1))
  `,
  boxShadow: `
    0 0 0 1px rgba(0, 0, 0, 0.15)
  `,
  ':after': {
    content: "''",
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: 1,
    ...triangle({
      pointingDirection: 'top',
      width: 16,
      height: 9,
      foregroundColor: 'white',
    }),
  },
  ':before': {
    content: "''",
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: 2,
    ...triangle({
      pointingDirection: 'top',
      width: 18,
      height: 10,
      foregroundColor: 'rgba(0, 0, 0, 0.15)',
    }),
  },
})

export const SettingsFrame = glamorous.div({
  padding: 20,
  maxWidth: 500,
})

export const SettingsInput = glamorous.input({
  flexGrow: 1,
})

export const ShortcutInput = glamorous.input(({ theme }) => ({
  flexGrow: 1,
  textAlign: 'center',
  caretColor: 'transparent',
  ...selection({ backgroundColor: 'transparent' }, '&'),
  borderRadius: 25,
  height: 30,
  background: '#fff',
  border: '1px solid #dddddd',
  '&:focus': {
    color: theme.highlightColor,
    border: `1px solid ${theme.highlightColor}`,
    boxShadow: `0 0 0 4px ${transparentize(0.7, theme.highlightColor)}`,
  },
}))

export const Value = glamorous.div({
  minWidth: 70,
  textAlign: 'right',
})

export const Button = glamorous.button(({ theme, primary }) => ({
  font: 'inherit',
  backgroundColor: primary
    ? theme.highlightColor
    : transparentize(0.9, theme.highlightColor),
  margin: 10,
  border: 'none',
  borderRadius: 3,
  color: primary && '#fff',
  flex: 1,
  height: 40,
}))

export const Setting = ({
  noBorder,
  label,
  children,
  style,
  LabelComponent = Label,
}) => (
  <Div
    margin="5px 0px"
    padding={'15px 50px'}
    overflow="visible"
    borderBottom={noBorder || '1px solid #dddddd'}
    {...style}
  >
    <LabelComponent
      display="block"
      textTransform="capitalize"
      overflow="visible"
    >
      {label}
      <Div
        marginTop={20}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        overflow="visible"
      >
        {children}
      </Div>
    </LabelComponent>
  </Div>
)

export const SettingsProvider = inject('settings')(
  observer(({ settings, children }) => children(settings))
)

const Tab = glamorous(Link, { filterProps: ['active'] })(
  ({ active, theme }) => ({
    display: 'flex',
    flex: 1,
    height: 45,
    alignItems: 'center',
    textTransform: 'capitalize',
    backgroundColor: active
      ? transparentize(0.9, theme.highlightColor)
      : '#f4f4f4',
    borderBottom: `3px solid ${active ? theme.highlightColor : 'transparent'}`,
    justifyContent: 'center',
  })
)

export const Tabbar = ({ active, items }) => (
  <div style={{ flexShrink: 0, display: 'flex' }}>
    {items.map((item, index) => (
      <Tab active={active === index} key={item} to={`/${item}`}>
        {item}
      </Tab>
    ))}
  </div>
)

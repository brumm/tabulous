import React from 'react'
import glamorous from 'glamorous'
import { padding, margin, transparentize } from 'polished'
import ComboKeys from 'react-combokeys'

import { transformShortcut } from 'utils'
import { AppStateProvider, AppState, Middleware } from 'store/AppState'

const Container = glamorous.div({
  maxWidth: 400,
  fontFamily: 'Roboto',
})
const H1 = glamorous.h1({
  fontSize: 30,
  marginBottom: 20,
})
const Bla = glamorous.h1({
  lineHeight: '25px',
  fontSize: 17,
  marginBottom: 25,
})
const Kbd = glamorous.kbd(({ pressed, theme }) => ({
  backgroundColor: '#fff',
  ...padding(3, 7),
  ...margin(0, 5),
  fontSize: 14,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  border: `1px solid ${pressed ? theme.highlightColor : '#d6d6d6'}`,
  borderRadius: 3,
  boxShadow: `
    0 1px 1px ${pressed ? transparentize(0.7, theme.highlightColor) : '#dddddd'}
  `,
}))

const Funkey = ({ def }) => (
  <ComboKeys
    bind={transformShortcut(def)}
    render={({ combo }) => <Kbd pressed={!!combo}>{def}</Kbd>}
  />
)

export default () => (
  <AppState>
    {({
      value: {
        settings: { markAllTabsShortcut, markTabShortcut, closeTabSortcut },
      },
    }) => (
      <Container>
        <H1>Hey! 🎉</H1>
        <Bla>
          Thanks for giving Tabulous a whirl.
          <br />
          <br />
          Start out by searching for 'music' in the Tabulous popup on the left.
          Don't worry, it's displaying some made-up stuff and won't mess with
          your existing tabs.
          <br />
          <br />
          Then move the selection up and down with your
          <Funkey def="Up" /> or <Funkey def="Down" />
          keys.
          <br />
          <br />
          Now activate a tab with <Funkey def="Enter" />
          <br />
          <br />
          Mark some other selected tab with <Funkey def={markTabShortcut} />
          <br />
          <br />
          Now try closing the selected (and all other marked tabs) with{' '}
          <Funkey def={closeTabSortcut} />
          <br />
          <br />
          You can also mark all filtered tabs with{' '}
          <Funkey def={markAllTabsShortcut} />
          <br />
          <br />
          If you'd like to tinker, check out the settings on the right.<br />
        </Bla>
      </Container>
    )}
  </AppState>
)

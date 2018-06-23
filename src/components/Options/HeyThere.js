import React from 'react'
import glamorous from 'glamorous'
import { transparentize } from 'polished'

import { createTab } from 'browser-api'
import { Kbd, Funkey } from './Kbd'

const Container = glamorous.div({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Frame = glamorous.div({
  padding: 20,
  maxWidth: 500,
})

const H1 = glamorous.h1({
  fontSize: 30,
  marginBottom: 20,
})

const Paragraph = glamorous.div({
  lineHeight: '25px',
  fontSize: 17,
  marginBottom: 25,
})

const InternalLinkContainer = glamorous.span(({ theme }) => ({
  color: theme.highlightColor,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: transparentize(0.9, theme.highlightColor),
  },
}))

const InternalLink = ({ href, children }) => (
  <InternalLinkContainer
    onClick={() => createTab({ url: href, active: true })}
    color=""
  >
    {children}
  </InternalLinkContainer>
)

export default ({
  settings: { markAllTabsShortcut, markItemShortcut, closeTabShortcut },
}) => (
  <Container>
    <Frame>
      <H1>Hey! 🎉</H1>
      <Paragraph>
        Thanks for giving Tabulous a whirl.
        <br />
        <br />
        Start out by searching for 'music' in the Tabulous popup on the left.
        Don't worry, it's displaying some made-up stuff and won't mess with your
        existing tabs.
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
        Mark some other selected tab with <Funkey def={markItemShortcut} />
        <br />
        <br />
        Try closing the selected (and all other marked tabs) with{' '}
        <Funkey def={closeTabShortcut} />
        <br />
        <br />
        You can also mark all filtered tabs with{' '}
        <Funkey def={markAllTabsShortcut} />
        <br />
        <br />
        The default way of opening Tabulous is <Kbd>Ctrl + Space</Kbd>. You can
        change this special shortcut at the bottom of the{' '}
        <InternalLink href="chrome://extensions/">extensions page</InternalLink>.
        <br />
        <br />
        If you like to tinker, check out the settings tab.
      </Paragraph>
    </Frame>
  </Container>
)

import React from 'react'
import glamorous from 'glamorous'
import { padding, margin, transparentize } from 'polished'
import ComboKeys from 'react-combokeys'

import { transformShortcut } from 'utils'

export const Kbd = glamorous.kbd(({ pressed, theme }) => ({
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

export const Funkey = ({ def }) => (
  <ComboKeys
    bind={transformShortcut(def)}
    render={({ combo }) => <Kbd pressed={!!combo}>{def}</Kbd>}
  />
)

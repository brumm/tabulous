import React from 'react'
import glamorous, { Div, Label } from 'glamorous'
import { transparentize, selection } from 'polished'

import { initialState } from 'store/Settings'
import ShortcutChooser from 'components/ShortcutChooser'

import { storageSet } from 'browser-api'

const MAX_POPUP_WIDTH = 800
const MAX_POPUP_HEIGHT = 600

const SettingsFrame = glamorous.div({
  backgroundColor: '#fafafa',
  fontFamily: 'Roboto',
  fontSize: 14,
})

const SettingsInput = glamorous.input({
  flexGrow: 1,
})

const ShortcutInput = glamorous.input(({ theme }) => ({
  flexGrow: 0.5,
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

const Value = glamorous.div({
  minWidth: 70,
  textAlign: 'right',
})

const Button = glamorous.button(({ theme, primary }) => ({
  font: 'inherit',
  backgroundColor: primary ? theme.highlightColor : '#dddddd',
  margin: 5,
  border: 'none',
  borderRadius: 3,
  color: primary && '#fff',
  flexGrow: 1,
  height: 40,
}))

const Setting = ({ noBorder, label, children, style }) => (
  <Div
    margin="5px 0px"
    padding={15}
    overflow="visible"
    borderBottom={noBorder || '1px solid #dddddd'}
    {...style}
  >
    <Label display="block" textTransform="capitalize" overflow="visible">
      {label}
      <Div
        marginTop={10}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        overflow="visible"
      >
        {children}
      </Div>
    </Label>
  </Div>
)

export default class Settings extends React.Component {
  render() {
    const {
      dispatch,
      settings: {
        advancedMode,
        listWidth,
        listItemHeight,
        maxVisibleResults,
        highlightColor,
        markedColor,
        markAllTabsShortcut,
        markTabShortcut,
        closeTabShortcut,
        set,
      },
    } = this.props

    const validate = ({ cmd, shift, ctrl, alt }) => {
      if (cmd) return false
      return ctrl || alt
    }

    return (
      <SettingsFrame>
        <Setting noBorder>
          <Div padding="3px 0" fontSize={30}>
            Settings
          </Div>
        </Setting>

        <Setting label="mark and unmark a single tab">
          <ShortcutChooser
            validate={validate}
            component={ShortcutInput}
            defaultValue={markTabShortcut}
            onUpdate={markTabShortcut => set({ markTabShortcut })}
          />
          <Value />
        </Setting>

        <Setting label="close one or more tabs">
          <ShortcutChooser
            validate={validate}
            component={ShortcutInput}
            defaultValue={closeTabShortcut}
            onUpdate={closeTabShortcut => set({ closeTabShortcut })}
          />
          <Value />
        </Setting>

        <Setting label="mark and unmark all tabs">
          <ShortcutChooser
            validate={validate}
            component={ShortcutInput}
            defaultValue={markAllTabsShortcut}
            onUpdate={markAllTabsShortcut => set({ markAllTabsShortcut })}
          />
          <Value />
        </Setting>

        <Setting label="highlight color">
          <SettingsInput
            type="color"
            value={highlightColor}
            onChange={({ target: { value } }) => set({ highlightColor: value })}
          />
          <Value>{`${highlightColor}`}</Value>
        </Setting>

        <Setting label="marked color">
          <SettingsInput
            type="color"
            value={markedColor}
            onChange={({ target: { value } }) => set({ markedColor: value })}
          />
          <Value>{`${markedColor}`}</Value>
        </Setting>

        <Setting label="list width">
          <SettingsInput
            type="range"
            min={200}
            max={MAX_POPUP_WIDTH}
            value={listWidth}
            onChange={({ target: { valueAsNumber } }) =>
              set({ listWidth: valueAsNumber })}
          />
          <Value>{`${listWidth}px`}</Value>
        </Setting>

        <Setting label="list item height">
          <SettingsInput
            type="range"
            min={24}
            max={45}
            value={listItemHeight}
            onChange={({ target: { valueAsNumber } }) =>
              set({ listItemHeight: valueAsNumber })}
          />
          <Value>{`${listItemHeight}px`}</Value>
        </Setting>

        <Setting label="max visible results">
          <SettingsInput
            type="range"
            min={2.5}
            max={
              Math.floor((MAX_POPUP_HEIGHT - listItemHeight) / listItemHeight) -
              1.5
            }
            step={1}
            value={maxVisibleResults}
            onChange={({ target: { valueAsNumber } }) =>
              set({ maxVisibleResults: valueAsNumber })}
          />
          <Value>{maxVisibleResults}</Value>
        </Setting>

        {process.env.NODE_ENV === 'development' && (
          <Setting label="advanced mode">
            <SettingsInput
              type="checkbox"
              checked={advancedMode}
              onChange={() => set({ advancedMode: !advancedMode })}
            />
          </Setting>
        )}

        <Setting noBorder style={{ marginTop: 50 }}>
          <Button
            onClick={() => {
              storageSet(initialState)
              set(initialState)
            }}
          >
            Reset to defaults
          </Button>
          <Button primary onClick={() => storageSet(this.props.settings)}>
            Save
          </Button>
        </Setting>
      </SettingsFrame>
    )
  }
}

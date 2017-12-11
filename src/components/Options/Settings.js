import React from 'react'
import glamorous, { Div, Label } from 'glamorous'
import { transparentize, selection } from 'polished'

import { initialState } from 'store/reducer'
import ShortcutChooser from 'components/ShortcutChooser'

import { storageSet } from 'chrome'

const MAX_POPUP_WIDTH = 800
const MAX_POPUP_HEIGHT = 600

const SettingsFrame = glamorous.div({
  width: '35vw',
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
  color: primary && '#fff',
  flexGrow: 1,
  height: 40,
}))

const Setting = ({ noBorder, label, children, style }) => (
  <Div
    margin={20}
    padding={10}
    overflow="visible"
    borderBottom={noBorder || '1px solid #dddddd'}
    {...style}
  >
    <Label display="block" textTransform="capitalize">
      {label}
    </Label>
    <Div
      marginTop={10}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      overflow="visible"
    >
      {children}
    </Div>
  </Div>
)

export default class Settings extends React.Component {
  render() {
    const {
      dispatch,
      settings: {
        listWidth,
        listItemHeight,
        maxVisibleResults,
        highlightColor,
        markedColor,
        markAllTabsShortcut,
        markTabShortcut,
        closeTabSortcut,
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
            onUpdate={markTabShortcut =>
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: { markTabShortcut },
              })}
          />
          <Value />
        </Setting>

        <Setting label="close one or more tabs">
          <ShortcutChooser
            validate={validate}
            component={ShortcutInput}
            defaultValue={closeTabSortcut}
            onUpdate={closeTabSortcut =>
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: { closeTabSortcut },
              })}
          />
          <Value />
        </Setting>

        <Setting label="mark and unmark all tabs">
          <ShortcutChooser
            validate={validate}
            component={ShortcutInput}
            defaultValue={markAllTabsShortcut}
            onUpdate={markAllTabsShortcut =>
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: { markAllTabsShortcut },
              })}
          />
          <Value />
        </Setting>

        <Setting label="highlight color">
          <SettingsInput
            type="color"
            value={highlightColor}
            onChange={({ target: { value } }) =>
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: { highlightColor: value },
              })}
          />
          <Value>{`${highlightColor}`}</Value>
        </Setting>

        <Setting label="marked color">
          <SettingsInput
            type="color"
            value={markedColor}
            onChange={({ target: { value } }) =>
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: { markedColor: value },
              })}
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
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: { listWidth: valueAsNumber },
              })}
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
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: { listItemHeight: valueAsNumber },
              })}
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
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: { maxVisibleResults: valueAsNumber },
              })}
          />
          <Value>{maxVisibleResults}</Value>
        </Setting>

        <Setting noBorder style={{ marginTop: 50 }}>
          <Button
            onClick={() => {
              storageSet(initialState.settings)
              dispatch({
                type: 'SETTINGS_CHANGE',
                value: initialState.settings,
              })
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

import React from 'react'
import glamorous, { Div, Label } from 'glamorous'

import { storageSet } from 'chrome'
import Popup from 'components/Popup'
import { Input, FancyShadow } from 'components/Input'
import Tablist from 'components/Tablist'

const Container = glamorous.div({
  display: 'flex',
})
const Preview = glamorous.div({
  width: '50vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fafafa',
})

const Settings = glamorous.div({
  width: '50vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const SettingsFrame = glamorous.div({
  width: '35vw',
  backgroundColor: '#fafafa',
})

const FakePopupFrame = glamorous.div({
  borderRadius: 3,
  border: '1px solid #fff',
  boxShadow: `
    0 5px 20px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(0, 0, 0, 0.15)
  `,
})
const SettingsInput = glamorous.input({
  flexGrow: 1,
})

const Value = glamorous.div({
  minWidth: 50,
  textAlign: 'right',
})

const Button = glamorous.button(({ theme }) => ({
  font: 'inherit',
  backgroundColor: theme.highlightColor,
  border: 'none',
  color: '#fff',
  flexGrow: 1,
  height: 40,
}))

const Setting = ({ noBorder, label, children }) => (
  <Div margin={20} padding={5} borderBottom={noBorder || '1px solid #dddddd'}>
    <Label display="block" textTransform="capitalize">
      {label}
    </Label>
    <Div
      marginTop={5}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      {children}
    </Div>
  </Div>
)

export default class Options extends React.Component {
  render() {
    const {
      dispatch,
      settings: {
        listWidth,
        listItemHeight,
        maxVisibleResults,
        highlightColor,
        selectedColor,
      },
    } = this.props
    const fakeTabs = Array.from(
      { length: Math.ceil(maxVisibleResults) },
      (_, id) => ({
        title: 'Example Domain',
        url: 'http://example.com',
        id,
      })
    )
    const listHeight = listItemHeight * maxVisibleResults

    return (
      <Container>
        <Preview>
          <FakePopupFrame>
            <FancyShadow>
              <Input type="text" autofocus placeholder="Search" />
            </FancyShadow>

            <Tablist
              items={fakeTabs}
              selectedIndex={1}
              markedTabs={[4, 5, 6]}
              width={listWidth}
              height={Math.min(
                listHeight,
                listItemHeight * (fakeTabs.length || 1)
              )}
              itemHeight={listItemHeight}
            />
          </FakePopupFrame>
        </Preview>

        <Settings>
          <SettingsFrame>
            <Setting noBorder>
              <Div padding="3px 0" fontSize={30}>
                Settings
              </Div>
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
              <Value />
            </Setting>

            <Setting label="selected color">
              <SettingsInput
                type="color"
                value={selectedColor}
                onChange={({ target: { value } }) =>
                  dispatch({
                    type: 'SETTINGS_CHANGE',
                    value: { selectedColor: value },
                  })}
              />
              <Value />
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
                max={9.5}
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

            <Setting noBorder>
              <Button onClick={() => storageSet(this.props.settings)}>
                Save
              </Button>
            </Setting>
          </SettingsFrame>
        </Settings>
      </Container>
    )
  }
}

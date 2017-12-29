import React from 'react'
import { SettingsProvider, Setting, Value, SettingsInput } from './Layout'

const MAX_POPUP_WIDTH = 800
const MAX_POPUP_HEIGHT = 600

export default () => (
  <SettingsProvider>
    {({
      highlightColor,
      markedColor,
      listWidth,
      listItemHeight,
      maxVisibleResults,
      set,
    }) => (
      <div>
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
              set({ listWidth: valueAsNumber })
            }
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
              set({ listItemHeight: valueAsNumber })
            }
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
              set({ maxVisibleResults: valueAsNumber })
            }
          />
          <Value>{maxVisibleResults}</Value>
        </Setting>
      </div>
    )}
  </SettingsProvider>
)

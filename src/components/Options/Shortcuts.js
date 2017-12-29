import React from 'react'
import ShortcutChooser from 'components/ShortcutChooser'
import {
  SettingsProvider,
  Setting,
  ShortcutInput,
  Value,
  SettingsInput,
} from './Layout'

export default () => {
  const validate = ({ cmd, shift, ctrl, alt }) => {
    if (cmd) return false
    return ctrl || alt
  }

  return (
    <SettingsProvider>
      {({ markItemShortcut, closeTabShortcut, markAllTabsShortcut, set }) => (
        <div>
          <Setting label="mark and unmark a single tab">
            <ShortcutChooser
              validate={validate}
              component={ShortcutInput}
              defaultValue={markItemShortcut}
              onUpdate={markItemShortcut => set({ markItemShortcut })}
            />
          </Setting>

          <Setting label="close one or more tabs">
            <ShortcutChooser
              validate={validate}
              component={ShortcutInput}
              defaultValue={closeTabShortcut}
              onUpdate={closeTabShortcut => set({ closeTabShortcut })}
            />
          </Setting>

          <Setting label="mark and unmark all tabs">
            <ShortcutChooser
              validate={validate}
              component={ShortcutInput}
              defaultValue={markAllTabsShortcut}
              onUpdate={markAllTabsShortcut => set({ markAllTabsShortcut })}
            />
          </Setting>
        </div>
      )}
    </SettingsProvider>
  )
}

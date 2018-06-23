import React, { Fragment } from 'react'
import glamorous, { Div } from 'glamorous'
import Async from 'react-promise'
import { margin, padding } from 'polished'
import { Collapse } from 'react-collapse'

import { Item } from 'components/ItemList'
import { SettingsProvider, Setting, SettingsInput } from './Layout'
import { Kbd, Funkey } from './Kbd'

// prettier-ignore
const promisedPlugins = Promise.all(
  process.env.AVAILABLE_PLUGINS.map(plugin =>
    import(
    /* webpackChunkName: "plugins" */
    /* webpackMode: "eager" */
    `plugins/${plugin}`)
  )
).then(plugins =>
  plugins.map(({ default: plugin }, index) => ({
    ...plugin,
    name: process.env.AVAILABLE_PLUGINS[index],
  }))
)

const Container = glamorous.h1({
  padding: 20,
})

const Box = glamorous.div({
  display: 'inline-flex',
  padding: 10,
  ...margin(5, 2, 20),
  backgroundColor: '#fff',
  borderRadius: 200,
  boxShadow: `
    0 0 0 0.5px rgba(0, 0, 0, 0.1),
    0 1px 10px rgba(0, 0, 0, 0.1)
  `,
})

const Label = glamorous.label({
  display: 'block',
})

const Hr = glamorous.div({
  height: '1px',
  marginTop: 10,
  marginBottom: 10,
  backgroundColor: '#DDDDDD',
})

const PluginSettings = glamorous.div({
  marginBottom: 25,
  paddingLeft: 47,
})

const Paragraph = glamorous.div({
  lineHeight: '25px',
  fontSize: 17,
  padding: 10,
  marginBottom: 25,
})

const Highlight = glamorous.span(({ index = 0 }) => ({
  fontSize: 15,
  verticalAlign: 'middle',
  borderRadius: 50,
  backgroundColor: ['#fff7bd', '#E1F5FE', '#DCEDC8'][index],
  ...padding(3, 13),
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1) inset',
  '&:not(:last-child)': {
    marginRight: 10,
  },
}))

export const ItemWrapper = glamorous.div(({ theme }) => ({
  display: 'flex',
  height: theme.listItemHeight,
}))

export default () => (
  <Async
    promise={promisedPlugins}
    then={plugins => (
      <SettingsProvider>
        {({ advancedMode, set }) => (
          <Container>
            Advanced mode expands the abilities of Tabulous 💪
            <br />
            <br />
            <Label>
              <SettingsInput
                type="checkbox"
                checked={advancedMode}
                onChange={({ target: { checked } }) => {
                  const permissions = plugins
                    .filter(({ name }) => name !== 'Tabs')
                    .reduce(
                      (permissions, plugin) =>
                        plugin.permissions.forEach(permission =>
                          permissions.add(permission)
                        ) || permissions,
                      new Set()
                    )

                  if (checked) {
                    chrome.permissions.request(
                      { permissions: [...permissions] },
                      didGrantPermission =>
                        set({ advancedMode: didGrantPermission })
                    )
                  } else {
                    chrome.permissions.remove(
                      { permissions: [...permissions] },
                      removed => set({ advancedMode: !removed })
                    )
                  }
                }}
              />
              Enable advanced mode
            </Label>
            {advancedMode && <Hr />}
            <Paragraph>
              <Collapse isOpened={advancedMode}>
                While the simple mode offers just two actions (activate and
                close) and a single item (Tabs), advanced mode introduces the
                concept of Plugins.
                <br />
                <br />
                A Plugin typically supplies a source of items, and a set of
                actions that can be applied to these items.
                <br />
                <br />
                For example, the Recently Closed plugin provides a list of the
                most-recently closed tabs, and one Restore action.
                <br />
                <br />
                Notice that enabling advanced mode will replace the search text
                input at the top with a different element, which I'll call
                Panes. Don't worry, you can still type to search.{' '}
                <Funkey def="Backspace" /> will clear the entire search.
                <br />
                <br />
                Panes represent an <Highlight index={0}>Item</Highlight>,{' '}
                <Highlight index={1}>Action</Highlight> and an optional{' '}
                <Highlight index={2}>Parameter</Highlight>.
                <br />
                <br />
                You can think of it as building up a sentence:
                <br />
                <Box>
                  <Highlight index={0}>Tab</Highlight>{' '}
                  <Highlight index={1}>Close</Highlight>
                </Box>
                <br />
                or with an action that takes a parameter
                <br />
                <Box>
                  <Highlight index={0}>Tab</Highlight>{' '}
                  <Highlight index={1}>Move To...</Highlight>{' '}
                  <Highlight index={2}>New Window</Highlight>
                </Box>
                <br />
                <br />
                You can cycle through the active Pane with <Funkey def="Tab" />.
              </Collapse>
            </Paragraph>
            {/* <Hr />
            <Fragment>
              <div
                style={{
                  opacity: advancedMode ? 1 : 0.3,
                }}
              >
                {plugins.map(({ source, actions, name, permissions }) => (
                  <Fragment key={name}>
                    <ItemWrapper key={name}>
                      <Item
                        hideChevron
                        name={source.name}
                        icon={source.icon}
                        setIndex={console.log}
                      />
                    </ItemWrapper>

                    <PluginSettings>
                      <Label>Permissions: {permissions.join(', ')}</Label>
                      <Label>
                        Actions: {actions.map(({ name }) => name).join(', ')}
                      </Label>
                      <Label>
                        <SettingsInput
                          readOnly
                          type="checkbox"
                          checked={source.showSourceItem}
                        />
                        Show source item
                      </Label>
                    </PluginSettings>
                  </Fragment>
                ))}
              </div>
            </Fragment> */}
          </Container>
        )}
      </SettingsProvider>
    )}
  />
)

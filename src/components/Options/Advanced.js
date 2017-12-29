import React, { Fragment } from 'react'
import glamorous, { Div } from 'glamorous'
import Async from 'react-promise'

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
  plugins.map(({ default: { source } }, index) => ({
    source,
    name: process.env.AVAILABLE_PLUGINS[index],
  }))
)

const Container = glamorous.h1({
  padding: 20,
})

const Label = glamorous.label({
  display: 'block',
})

const PluginSettings = glamorous.div({
  marginBottom: 25,
  paddingLeft: 47,
})

const Paragraph = glamorous.p({
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
  padding: '3px 10px',
  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1) inset',
}))

export const ItemWrapper = glamorous.div(({ theme }) => ({
  display: 'flex',
  height: theme.listItemHeight,
}))

export default () => (
  <Container>
    <Paragraph>
      Advanced mode expands the abilities of Tabulous 💪
      <br />
      <br />
      While the simple mode offers just two actions (activate and close) and a
      single item (Tabs), advanced mode introduces the concept of Plugins.
      <br />
      <br />
      A Plugin typically supplies a source of items, and a set of actions that
      can be applied to these items.
      <br />
      <br />
      For example, the Recently Closed plugin provides a list of the
      most-recently closed tabs, and one Restore action.
      <br />
      <br />
      You'll notice that enabling advanced mode will replace the search text
      input at the top with a different element, which I'll call Panes. Don't
      worry, you can still type to search. <Funkey def="Backspace" /> will clear
      the entire search.
      <br />
      <br />
      Panes represent an <Highlight index={0}>Item</Highlight>,{' '}
      <Highlight index={1}>Action</Highlight> and an optional{' '}
      <Highlight index={2}>Parameter</Highlight>.
      <br />
      <br />
      You can think of it as building up a sentence:
      <br />
      <Highlight index={0}>Tab</Highlight>{' '}
      <Highlight index={1}>Close</Highlight>
      <br />
      or with an action that takes a parameter
      <br />
      <Highlight index={0}>Tab</Highlight>{' '}
      <Highlight index={1}>Move To...</Highlight>{' '}
      <Highlight index={2}>New Window</Highlight>
      <br />
      <br />
      You can cycle through the active Pane with <Funkey def="Tab" />.
    </Paragraph>

    <SettingsProvider>
      {({ advancedMode, set }) => (
        <Fragment>
          <Label>
            <SettingsInput
              type="checkbox"
              checked={advancedMode}
              onChange={() => set({ advancedMode: !advancedMode })}
            />
            Enable advanced mode
          </Label>

          <div
            style={{
              borderTop: '0.5px solid #DDDDDD',
              paddingTop: 10,
              marginTop: 10,
              opacity: advancedMode ? 1 : 0.3,
            }}
          >
            <Async
              promise={promisedPlugins}
              then={sources =>
                sources.map(({ source, name }) => (
                  <Fragment key={name}>
                    <ItemWrapper key={name}>
                      <Item hideChevron name={source.name} icon={source.icon} />
                    </ItemWrapper>
                    {/* <PluginSettings>
                      <Label>
                        <SettingsInput
                          readOnly
                          type="checkbox"
                          checked={source.showSourceItem}
                        />
                        Show source item
                      </Label>
                    </PluginSettings> */}
                  </Fragment>
                ))
              }
            />
          </div>
        </Fragment>
      )}
    </SettingsProvider>
  </Container>
)

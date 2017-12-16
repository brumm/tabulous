import TBObject from 'store/TBObject'
import {
  getTabs,
  selectTab,
  getWindows,
  closeTab,
  moveTabs,
  createWindow,
  createTab,
  updateTab,
} from 'browser-api'
import defaultActionIcon from 'img/icon-action'

const TYPES = {
  TAB: 'browser.tab',
}

const tabResolver = directObject =>
  getTabs().then(tabs =>
    tabs.map(
      tab =>
        new Tab({
          id: tab.id,
          name: tab.title,
          details: tab.url,
          icon: tab.favIconUrl,
          type: [TYPES.TAB],
          meta: {
            pinned: tab.pinned,
            audible: tab.audible && !tab.mutedInfo.muted,
            windowId: tab.windowId,
          },
        })
    )
  )

export default new TBObject({
  showSourceItem: true,
  name: 'Tabs',
  type: ['tabulous.source'],
  childResolver: tabResolver,
})

class Tab extends TBObject {
  activate() {
    selectTab({ id: this.id, windowId: this.meta.windowId })
  }
}

export const tabActions = [
  {
    name: 'Activate',
    details: 'Activate tab and its window',
    icon: defaultActionIcon,
    directTypes: ['browser.tab'],
    type: ['tabulous.action'],
    execute: ([tab]) => tab.activate(),
  },
  {
    name: 'Close',
    details: 'Close one or more tabs',
    icon: defaultActionIcon,
    directTypes: ['browser.tab'],
    type: ['tabulous.action'],
    execute: tabs =>
      closeTab(
        ...tabs.map(({ id }) => id).filter((el, i, a) => i === a.indexOf(el))
      ),
  },
  {
    name: 'Move To...',
    details: 'Move to another window',
    icon: defaultActionIcon,
    type: ['tabulous.action'],
    directTypes: ['browser.tab'],
    indirectTypes: ['browser.window'],
    suggestedObjects: () =>
      getWindows().then(windows => [
        ...windows.map(({ id, ..._window }, index) => ({
          id,
          name: `Window ${index + 1}`,
          ...{ name: _window.name },
          details: `${_window.tabs.length} tabs`,
          type: ['browser.window'],
          meta: _window,
        })),
        {
          name: `New Window`,
          type: ['browser.window'],
        },
      ]),
    execute: (tabs, { id: windowId }) => {
      if (windowId) {
        moveTabs(tabs.map(({ id }) => id), { windowId, index: -1 })
      } else {
        const [{ id: tabId }, ...secondBatchOfTabIds] = tabs
        createWindow({ tabId }).then(({ id }) =>
          moveTabs(secondBatchOfTabIds.map(({ id }) => id), {
            windowId: id,
            index: -1,
          })
        )
      }
    },
  },
  {
    name: 'Pin',
    details: 'Pin one or more tabs',
    icon: defaultActionIcon,
    directTypes: ['browser.tab'],
    type: ['tabulous.action'],
    execute: tabs => tabs.forEach(({ id }) => updateTab(id, { pinned: true })),
  },
  {
    name: 'Unpin',
    details: 'Unpin one or more tabs',
    icon: defaultActionIcon,
    directTypes: ['browser.tab'],
    type: ['tabulous.action'],
    execute: tabs => tabs.forEach(({ id }) => updateTab(id, { pinned: false })),
  },
  {
    name: 'Mute',
    details: 'Mute one or more tabs',
    icon: defaultActionIcon,
    directTypes: ['browser.tab'],
    type: ['tabulous.action'],
    execute: tabs => tabs.forEach(({ id }) => updateTab(id, { muted: true })),
  },
  {
    name: 'Unmute',
    details: 'Unmute one or more tabs',
    icon: defaultActionIcon,
    directTypes: ['browser.tab'],
    type: ['tabulous.action'],
    execute: tabs => tabs.forEach(({ id }) => updateTab(id, { muted: false })),
  },
]

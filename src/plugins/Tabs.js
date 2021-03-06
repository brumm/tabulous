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
import tabIcon from './icon-tab'
import windowIcon from './icon-window'
import { uniqIds } from 'utils'

const TYPES = {
  TAB: 'browser.tab',
  WINDOW: 'browser.window',
  NEW_WINDOW: 'browser. new-window',
  URL: 'public.url',
}

const tabResolver = directObject =>
  getTabs().then(tabs =>
    tabs.map(
      tab =>
        new Tab({
          id: tab.id,
          name: tab.title,
          details: tab.url,
          icon: tab.favIconUrl || tabIcon,
          type: [TYPES.TAB, TYPES.URL],
          meta: {
            pinned: tab.pinned,
            audible: tab.audible,
            muted: tab.mutedInfo.muted,
            windowId: tab.windowId,
            url: tab.url,
          },
        })
    )
  )

const source = new TBObject({
  name: 'Tabs',
  type: ['tabulous.source'],
  icon: tabIcon,
  childResolver: tabResolver,
})

class Tab extends TBObject {
  activate() {
    selectTab({ id: this.id, windowId: this.meta.windowId })
  }
  close() {
    closeTab(this.id)
  }
}

const actions = [
  {
    name: 'Activate',
    details: 'Activate tab and its window',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    execute: ([tab]) => tab.activate(),
  },
  {
    name: 'Close',
    details: 'Close one or more tabs',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    execute: tabs => tabs.forEach(tab => tab.close()),
  },
  {
    name: 'Move To Window...',
    details: 'Move to another window',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    indirectTypes: [TYPES.WINDOW, TYPES.NEW_WINDOW],
    suggestedObjects: () =>
      getWindows().then(windows => [
        ...windows.map(({ id, ..._window }, index) => ({
          id,
          name: _window.name ? _window.name : `Window ${index + 1}`,
          details: `${_window.tabs.length} tabs`,
          icon: windowIcon,
          type: [TYPES.WINDOW],
          meta: _window,
        })),
        {
          name: `New Window`,
          icon: windowIcon,
          type: [TYPES.NEW_WINDOW],
        },
      ]),
    execute: (tabs, { type, id: windowId }) => {
      if (type.includes(TYPES.NEW_WINDOW)) {
        const [{ id: tabId }, ...secondBatchOfTabIds] = tabs
        createWindow({ tabId }).then(({ id }) => {
          if (secondBatchOfTabIds.length) {
            moveTabs(secondBatchOfTabIds.map(({ id }) => id), {
              windowId: id,
              index: -1,
            })
          }
        })
      } else {
        moveTabs(tabs.map(({ id }) => id), { windowId, index: -1 })
      }
    },
  },
  {
    name: 'Pin',
    details: 'Pin one or more tabs',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    displayPredicate: directObject => directObject.meta.pinned === false,
    execute: tabs => tabs.forEach(({ id }) => updateTab(id, { pinned: true })),
  },
  {
    name: 'Unpin',
    details: 'Unpin one or more tabs',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    displayPredicate: directObject => directObject.meta.pinned === true,
    execute: tabs => tabs.forEach(({ id }) => updateTab(id, { pinned: false })),
  },
  {
    name: 'Mute',
    details: 'Mute one or more tabs',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    displayPredicate: directObject =>
      directObject.meta.audible && !directObject.meta.muted,
    execute: tabs => tabs.forEach(({ id }) => updateTab(id, { muted: true })),
  },
  {
    name: 'Unmute',
    details: 'Unmute one or more tabs',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    displayPredicate: directObject =>
      directObject.meta.audible && directObject.meta.muted,
    execute: tabs => tabs.forEach(({ id }) => updateTab(id, { muted: false })),
  },
  {
    name: 'Split tabs horizontally',
    details: 'Moves each tab into its own window, tiled horizontally',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    execute: tabs =>
      tabs.forEach(({ id }, index) =>
        createWindow({
          tabId: id,
          height: screen.availHeight,
          width: Math.floor(screen.width / tabs.length),
          top: 0,
          left: index * Math.floor(screen.width / tabs.length),
        })
      ),
  },
]

export default {
  source,
  actions,
  permissions: ['tabs', 'activeTab'],
}

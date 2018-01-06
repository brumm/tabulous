import TBObject from 'store/TBObject'
import defaultActionIcon from 'img/icon-action'
import placeholderTabs from './placeholderTabs'
import { uniqIds } from 'utils'
import tabIcon from 'plugins/icon-tab'
import windowIcon from 'plugins/icon-window'

const TYPES = {
  TAB: 'browser.tab',
  WINDOW: 'browser.window',
}

const selectTab = (...args) => console.log('selectTab', ...args)
const closeTab = (...args) => console.log('closeTab', ...args)
const moveTabs = (...args) => console.log('moveTabs', ...args)
const createWindow = (...args) => console.log('createWindow', ...args)
const createTab = (...args) => console.log('createTab', ...args)
const updateTab = (...args) => console.log('updateTab', ...args)

const tabResolver = directObject =>
  Promise.resolve(
    placeholderTabs.map(
      tab =>
        new Tab({
          id: tab.id,
          name: tab.title,
          details: tab.url,
          icon: tab.favIconUrl || tabIcon,
          type: [TYPES.TAB],
          meta: {
            pinned: tab.pinned,
            audible: tab.audible,
            muted: tab.mutedInfo.muted,
            windowId: tab.windowId,
          },
        })
    )
  )

const source = new TBObject({
  name: 'Tabs',
  type: ['tabulous.source'],
  childResolver: tabResolver,
})

class Tab extends TBObject {
  activate() {
    selectTab({ id: this.id, windowId: this.meta.windowId })
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
    execute: tabs => closeTab(...tabs.map(({ id }) => id)),
  },
  {
    name: 'Move To Window...',
    details: 'Move to another window',
    icon: defaultActionIcon,
    directTypes: [TYPES.TAB],
    indirectTypes: [TYPES.WINDOW],
    suggestedObjects: () =>
      Promise.resolve([
        {
          name: `This Window`,
          details: '30 tabs',
          icon: windowIcon,
          type: [TYPES.WINDOW],
        },
        {
          name: `New Window`,
          icon: windowIcon,
          type: [TYPES.WINDOW],
        },
      ]),
    execute: (tabs, { id: windowId }) => {
      if (windowId) {
        moveTabs(tabs.map(({ id }) => id), { windowId, index: -1 })
      } else {
        const [{ id: tabId }, ...secondBatchOfTabIds] = tabs
        createWindow({ tabId })
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
]

export default {
  source,
  actions,
}

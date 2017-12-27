import TBObject from 'store/TBObject'
import {
  getRecentlyClosed,
  restoreRecentlyClosed,
  createTab,
} from 'browser-api'
import defaultActionIcon from 'img/icon-action'

const TYPES = {
  SOURCE: 'tabulous.source',
  HISTORY: 'browser.history',
  RECENTLY_CLOSED: 'browser.recently-closed',
}

const recentlyClosedResolver = directObject =>
  getRecentlyClosed().then(items =>
    items.filter(({ tab }) => tab).map(
      ({ tab }) =>
        new RecentlyClosedTab({
          id: tab.sessionId,
          name: tab.title,
          details: tab.url,
          icon: tab.favIconUrl,
          type: [TYPES.RECENTLY_CLOSED],
          meta: {
            pinned: tab.pinned,
            windowId: tab.windowId,
          },
        })
    )
  )

const source = new TBObject({
  showSourceItem: true,
  name: 'Recently Closed',
  type: [TYPES.SOURCE, TYPES.HISTORY],
  childResolver: recentlyClosedResolver,
})

class RecentlyClosedTab extends TBObject {
  restore() {
    restoreRecentlyClosed(this.id)
  }
}

const actions = [
  {
    name: 'Open History',
    details: 'Open history in new tab',
    icon: defaultActionIcon,
    directTypes: [TYPES.HISTORY],
    execute: () => createTab({ url: 'chrome://history/' }),
  },
  {
    name: 'Restore',
    details: 'Restore recently closed tab',
    icon: defaultActionIcon,
    directTypes: [TYPES.RECENTLY_CLOSED],
    execute: items => items.forEach(item => item.restore()),
  },
]

export default {
  source,
  actions,
}

import TBObject from 'store/TBObject'
import { getRecentlyClosed, restoreRecentlyClosed } from 'browser-api'
import defaultActionIcon from 'img/icon-action'

const TYPES = {
  RECENTLY_CLOSED: 'browser.recently-closed',
}

const recentlyClosedResolver = directObject =>
  getRecentlyClosed().then(items =>
    items.map(
      ({ tab }) =>
        new RecentlyClosedTab({
          id: tab.id,
          name: tab.title,
          details: tab.url,
          icon: tab.favIconUrl,
          type: [TYPES.RECENTLY_CLOSED],
          meta: {
            pinned: tab.pinned,
            windowId: tab.windowId,
            sessionId: tab.sessionId,
          },
        })
    )
  )

const source = new TBObject({
  showSourceItem: true,
  name: 'Recently Closed',
  type: ['tabulous.source'],
  childResolver: recentlyClosedResolver,
})

class RecentlyClosedTab extends TBObject {
  restore() {
    restoreRecentlyClosed(this.meta.sessionId)
  }
}

const actions = [
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

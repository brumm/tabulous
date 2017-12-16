import { TBObject } from 'store/TBObjects'
import { getTabs, selectTab } from 'browser-api'
import defaultActionIcon from 'img/icon-action'

const TYPES = {
  TAB: 'browser.tab',
}

export const resolve = directObject =>
  getTabs().then(tabs =>
    tabs.map(tab => ({
      id: tab.id,
      name: tab.title,
      details: tab.url,
      icon: tab.favIconUrl,
      type: TYPES.TAB,
      meta: {
        pinned: tab.pinned,
        audible: tab.audible && !tab.mutedInfo.muted,
        windowId: tab.windowId,
      },
    }))
  )

export class Objekt extends TBObject {
  activate() {
    selectTab({ id: this.id, windowId: this.meta.windowId })
  }
}

export const actions = [
  {
    name: 'Activate',
    details: 'Activate tab and its window',
    icon: defaultActionIcon,
    directTypes: ['browser.tab'],
    type: ['tabulous.action'],
    execute: ([tab]) => tab.activate(),
  },
]

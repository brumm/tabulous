import intersection from 'lodash/intersection'
import {
  getTabs,
  getWindows,
  selectTab,
  closeTab,
  moveTabs,
  createWindow,
  updateTab,
} from 'browser-api'

import defaultActionIcon from 'img/icon-action'

export const directObjectResolver = () =>
  getTabs().then(tabs =>
    tabs.map(tab => ({
      id: tab.id,
      name: tab.title,
      details: tab.url,
      icon: tab.favIconUrl,
      type: ['browser.tab', 'public.url'],
      meta: {
        pinned: tab.pinned,
        audible: tab.audible && !tab.mutedInfo.muted,
        windowId: tab.windowId,
      },
    }))
  )

export const actionObjectResolver = (directObject = {}) =>
  Promise.resolve(
    [
      {
        name: 'Activate',
        details: 'Activate tab and its window',
        icon: defaultActionIcon,
        directTypes: ['browser.tab'],
        type: ['tabulous.action'],
        execute: ([{ id, meta: { windowId } }]) => selectTab({ id, windowId }),
      },
      {
        name: 'Close',
        details: 'Close one or more tabs',
        icon: defaultActionIcon,
        directTypes: ['browser.tab'],
        type: ['tabulous.action'],
        execute: tabs =>
          closeTab(
            ...tabs
              .map(({ id }) => id)
              .filter((el, i, a) => i === a.indexOf(el))
          ),
      },
      {
        name: 'Pin',
        details: 'Pin one or more tabs',
        icon: defaultActionIcon,
        directTypes: ['browser.tab'],
        type: ['tabulous.action'],
        execute: tabs =>
          tabs.forEach(({ id }) => updateTab(id, { pinned: true })),
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
    ].filter(
      ({ directTypes }) => intersection(directTypes, directObject.type).length
    )
  )

export const indirectObjectResolver = (actionObject = {}) =>
  actionObject.suggestedObjects
    ? actionObject
        .suggestedObjects()
        .then(items =>
          items.filter(
            ({ type }) =>
              actionObject.indirectTypes &&
              intersection(actionObject.indirectTypes, type).length
          )
        )
    : Promise.resolve([])

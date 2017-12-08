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

const defaultActionIcon = ''

export const directObjectResolver = () =>
  getTabs().then(tabs =>
    tabs.map(({ id, windowId, title, url, favIconUrl }) => ({
      id,
      windowId,
      name: title,
      details: url,
      icon: favIconUrl,
      type: ['browser.tab', 'public.url'],
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
        type: ['com.tabulous.action-object'],
        execute: ([{ id, windowId }]) => selectTab({ id, windowId }),
      },
      {
        name: 'Close',
        details: 'Close one or more tabs',
        icon: defaultActionIcon,
        directTypes: ['browser.tab'],
        type: ['com.tabulous.action-object'],
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
        type: ['com.tabulous.action-object'],
        execute: tabs =>
          tabs.forEach(({ id }) => updateTab(id, { pinned: true })),
      },
      {
        name: 'Move To...',
        details: 'Move to another window',
        icon: defaultActionIcon,
        type: ['com.tabulous.action-object'],
        directTypes: ['browser.tab'],
        indirectTypes: ['browser.window'],
        suggestedObjects: () =>
          getWindows().then(windows => [
            ...windows.map((_window, index) => ({
              name: `Window ${index + 1}`,
              ..._window,
              windowType: window.type,
              type: ['browser.window'],
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

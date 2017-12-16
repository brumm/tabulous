import intersection from 'lodash/intersection'
import {
  getTabs,
  getWindows,
  selectTab,
  closeTab,
  moveTabs,
  createWindow,
  createTab,
  updateTab,
  getBookmarks,
} from 'browser-api'

import defaultActionIcon from 'img/icon-action'

const bookmarkResolver = id =>
  getBookmarks(id).then(([{ children }]) =>
    children.map(({ id, title, children = [], ...meta }) => ({
      id,
      name: title,
      details: meta.url || (children.length && `${children.length} bookmarks`),
      providesChildren: children.length > 0,
      childResolver: () => bookmarkResolver(id),
      type: meta.url
        ? ['public.url', 'tabulous.bookmark']
        : ['tabulous.bookmark-folder'],
      meta,
    }))
  )

export const directObjectResolver = () =>
  getTabs().then(tabs => [
    ...tabs.map(tab => ({
      id: tab.id,
      name: tab.title,
      details: tab.url,
      icon: tab.favIconUrl,
      type: ['browser.tab'],
      meta: {
        pinned: tab.pinned,
        audible: tab.audible && !tab.mutedInfo.muted,
        windowId: tab.windowId,
      },
    })),
    {
      id: null,
      name: 'Bookmarks',
      type: ['tabulous.bookmark-manager'],
      providesChildren: true,
      childResolver: bookmarkResolver,
    },
  ])

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
        execute: tabs =>
          tabs.forEach(({ id }) => updateTab(id, { pinned: true })),
      },
      {
        name: 'Unpin',
        details: 'Unpin one or more tabs',
        icon: defaultActionIcon,
        directTypes: ['browser.tab'],
        type: ['tabulous.action'],
        execute: tabs =>
          tabs.forEach(({ id }) => updateTab(id, { pinned: false })),
      },
      {
        name: 'Mute',
        details: 'Mute one or more tabs',
        icon: defaultActionIcon,
        directTypes: ['browser.tab'],
        type: ['tabulous.action'],
        execute: tabs =>
          tabs.forEach(({ id }) => updateTab(id, { muted: true })),
      },
      {
        name: 'Unmute',
        details: 'Unmute one or more tabs',
        icon: defaultActionIcon,
        directTypes: ['browser.tab'],
        type: ['tabulous.action'],
        execute: tabs =>
          tabs.forEach(({ id }) => updateTab(id, { muted: false })),
      },
      {
        name: 'Open',
        details: 'Open url in new tab',
        icon: defaultActionIcon,
        directTypes: ['public.url'],
        type: ['tabulous.action'],
        execute: items =>
          items.forEach(({ meta: { url } }) => createTab({ url })),
      },
      {
        name: 'Open Bookmark Manager',
        details: 'Open bookmark manager in new tab',
        icon: defaultActionIcon,
        directTypes: ['tabulous.bookmark-manager'],
        type: ['tabulous.action'],
        execute: items => createTab({ url: 'chrome://bookmarks/' }),
      },
      {
        name: 'Open All Bookmarks',
        icon: defaultActionIcon,
        directTypes: ['tabulous.bookmark-folder'],
        type: ['tabulous.action'],
        execute: items => createTab({ url: 'chrome://bookmarks/' }),
      },
      {
        name: 'Open All Bookmarks In New Window',
        icon: defaultActionIcon,
        directTypes: ['tabulous.bookmark-folder'],
        type: ['tabulous.action'],
        execute: items => createTab({ url: 'chrome://bookmarks/' }),
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

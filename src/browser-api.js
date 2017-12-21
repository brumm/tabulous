import { tabs, storage, windows, bookmarks, sessions } from 'then-chrome'

export const onRemoved = fn => chrome.tabs.onRemoved.addListener(fn)

export const onCreated = fn => chrome.tabs.onCreated.addListener(fn)

export const onUpdated = fn => chrome.tabs.onUpdated.addListener(fn)

export const onMoved = fn => chrome.tabs.onMoved.addListener(fn)

export const storageGet = (key = null) => storage.sync.get(key)

export const storageSet = items =>
  storage.sync.set(items).then(console.log, console.error)

export const onStorageChanged = fn => chrome.storage.onChanged.addListener(fn)

export const selectTab = ({ id, windowId }) =>
  Promise.all([
    windows.update(windowId, { focused: true }),
    tabs.update(id, { active: true }),
  ])

export const closeTab = (...tabIds) => tabs.remove(tabIds)

export const createTab = properties => tabs.create(properties)

export const getCurrentTab = () =>
  tabs.query({ active: true, currentWindow: true }).then(([tab]) => tab)

export const getTabs = (options = {}) => tabs.query(options)

export const moveTabs = (...args) => tabs.move(...args)

export const updateTab = (...args) => tabs.update(...args)

const windowFilter = { populate: true, windowTypes: ['normal'] }

export const getWindows = () =>
  Promise.all([
    windows.getLastFocused(windowFilter),
    windows.getAll(windowFilter),
  ]).then(([currentWindow, windows]) => [
    ...windows.filter(({ id }) => id !== currentWindow.id),
    { ...currentWindow, name: 'This Window' },
  ])

export const createWindow = (...args) => windows.create(...args)

export const getBookmarks = (id = '0') => bookmarks.getSubTree(id)
export const removeBookmark = id => bookmarks.removeTree(id)
export const createBookmark = (...args) => bookmarks.create(...args)

export const getRecentlyClosed = () => sessions.getRecentlyClosed()
export const restoreRecentlyClosed = sessionId => sessions.restore(sessionId)

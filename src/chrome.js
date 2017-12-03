import { tabs, storage, windows } from 'then-chrome'

export const onRemoved = fn => chrome.tabs.onRemoved.addListener(fn)
export const onCreated = fn => chrome.tabs.onCreated.addListener(fn)
export const onUpdated = fn => chrome.tabs.onUpdated.addListener(fn)
export const onMoved = fn => chrome.tabs.onMoved.addListener(fn)

export const storageGet = key => storage.sync.get(key)
export const storageSet = items => storage.sync.set(items)
export const onStorageChanged = fn => chrome.storage.onChanged.addListener(fn)

export const selectTab = ({ id, windowId }) =>
  Promise.all([
    windows.update(windowId, { focused: true }),
    tabs.update(id, { selected: true }),
  ])

export const closeTab = (...tabIds) => tabs.remove(tabIds)

export const getCurrentTab = () =>
  tabs.query({ active: true }).then(([tab]) => tab)

export const getTabs = (options = {}) => tabs.query(options)

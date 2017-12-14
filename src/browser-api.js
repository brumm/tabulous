import { tabs, storage, windows } from 'then-chrome'

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
export const selectTabAndClosePopup = tab =>
  selectTab(tab).then(() => window.close())
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
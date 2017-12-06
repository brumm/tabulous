// chrome.webNavigation.onCreatedNavigationTarget.addListener(
//   ({ sourceTabId, tabId }) => console.log({ [tabId]: sourceTabId })
// )

chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: `${chrome.runtime.getURL('options.html')}#/first-run`,
      active: true,
    })
  }
})

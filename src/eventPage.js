chrome.webNavigation.onCreatedNavigationTarget.addListener(
  ({ sourceTabId, tabId }) => console.log({ [tabId]: sourceTabId })
)

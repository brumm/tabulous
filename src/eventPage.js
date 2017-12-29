chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: `${chrome.runtime.getURL('options.html')}#/intro`,
      active: true,
    })
  }
})

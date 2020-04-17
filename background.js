/**
 * Web Navigation (Complete)
 */

// chrome.browserAction.onClicked.addListener((event) => {
chrome.webNavigation.onBeforeNavigate.addListener((event) => {
  chrome.storage.sync.get('domainList', (results) => {
    const { domainList } = results;
    console.log(event);
    let closeTab = false;
    console.log(domainList);
    domainList.forEach((domain) => {
      if (event.url.includes(domain)) {
        chrome.windows.create({
          url: event.url,
          incognito: true,
        });

        if (closeTab) {
          chrome.tabs.remove(event.tabId);
        }
      }
    });
  });
});

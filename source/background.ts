/**
 * Web Navigation (Complete)
 *
 * @format
 */

interface Domain {
  url: string;
  hide: boolean;
}

chrome.webNavigation.onBeforeNavigate.addListener((event): void => {
  chrome.storage.sync.get(
    'domainList',
    (results: Record<string, Array<Domain>>) => {
      const domainList: Array<Domain> = results.domainList;
      domainList.forEach((domain: Domain): void => {
        if (event.url.includes(domain.url)) {
          chrome.windows.create({
            url: event.url,
            incognito: true,
          });
          if (domain.hide) {
            chrome.tabs.remove(event.tabId);
          }
        }
      });
    }
  );
});

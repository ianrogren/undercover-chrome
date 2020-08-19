/**
 * Web Navigation (Complete)
 *
 * @format
 */

interface Domain {
  url: string;
  hide: boolean;
}

window.chrome.webNavigation.onBeforeNavigate.addListener((event): void => {
  window.chrome.storage.sync.get(
    "domainList",
    (results: Record<string, Array<Domain>>) => {
      const domainList: Array<Domain> = results.domainList;
      domainList.forEach((domain: Domain): void => {
        if (domain.url !== "" && event.url.includes(domain.url)) {
          window.chrome.windows.create({
            url: event.url,
            incognito: true,
          });
          if (domain.hide) {
            window.chrome.tabs.remove(event.tabId);
          }
        }
      });
    }
  );
});

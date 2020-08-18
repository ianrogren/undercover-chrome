/**
 * Undercover Chrome Extension.
 *
 * @format
 */

import "core-js/modules/es.array.for-each";
import "core-js/modules/es.array.concat";
import "./options.scss";

interface DomainSelection {
  url: string;
  hide: boolean;
}

document.addEventListener("DOMContentLoaded", (): void => {
  /**
   * Create Field Group.
   */
  const createFieldGroup = (
    domainValue: string,
    hideValue: string
  ): HTMLElement => {
    const optionFieldGroup: HTMLElement = document.createElement("div");
    optionFieldGroup.classList.add("field-group");
    optionFieldGroup.innerHTML = `
      <label>Add Domain</label>
      <input type="text" class="input is-info" value="${domainValue}" />
      <span class="close-button">
        <i class="fas fa-times"></i>
      </span>
      <p>
        <input type="checkbox" class="hide-tab" ${hideValue} /> Close original non-incognito tab.
      </p>
      `;
    return optionFieldGroup;
  };

  /**
   * Build Input.
   */
  const buildInput = (domain): void => {
    console.log(domain);
    const domainContainer: HTMLElement = document.querySelector(
      ".domain-container"
    );
    const domainValue: string = domain === "empty" ? "" : domain.url;
    const hideValue: string =
      typeof domain.hide !== "undefined" && domain.hide ? "checked" : "";
    console.log(hideValue);

    if (domainContainer) {
      const fieldGroup = createFieldGroup(domainValue, hideValue);
      domainContainer.appendChild(fieldGroup);
      resetInputs();
    }
  };

  /**
   * Reset Inputs.
   */
  const resetInputs = (): void => {
    const closeButtons: NodeListOf<HTMLElement> = document.querySelectorAll(
      ".close-button"
    );
    [].forEach.call(closeButtons, (closeSpan: HTMLElement): void => {
      closeSpan.addEventListener("click", (): void => {
        closeSpan.parentElement.remove();
      });
    });
  };

  /**
   * Load Domains.
   */
  const loadDomains = (): void => {
    chrome.storage.sync.get("domainList", (results) => {
      const { domainList } = results;
      [].forEach.call(domainList, (domain) => {
        buildInput(domain);
      });
      buildInput("empty");
    });
  };

  /**
   * Clear Domains List.
   */
  const clearDomainList = (): void => {
    const fieldGroups: NodeListOf<HTMLElement> = document.querySelectorAll(
      ".field-group"
    );
    [].forEach.call(fieldGroups, (group) => {
      group.remove();
    });
  };

  /**
   * Save Domains.
   */
  const saveDomains = (): void => {
    const fieldGroups: NodeListOf<HTMLElement> = document.querySelectorAll(
      ".domain-container .field-group"
    );
    const domainArray: Array<DomainSelection> = [];
    [].forEach.call(fieldGroups, (group: HTMLElement): void => {
      const domainName: HTMLInputElement = group.querySelector(
        "input[type=text]"
      );
      const hideTab: HTMLInputElement = group.querySelector(
        "input[type=checkbox]"
      );

      if (domainName !== null) {
        const domainData = {
          url: domainName.value,
          hide: hideTab.checked,
        };
        domainArray.push(domainData);
      }
    });
    chrome.storage.sync.set({ domainList: domainArray }, function () {
      if (chrome.runtime.error) {
        console.warn("Domains were not saved.");
      } else {
        clearDomainList();
        loadDomains();
      }
    });
    console.log(domainArray);
  };

  /**
   * Dark Code Check.
   */
  const darkModeCheck = (): void => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      console.log("darkmode enabled");
      const htmlRoot: HTMLElement = document.getElementsByTagName("html")[0];
      htmlRoot.classList.add("dark-mode");
    }
  };

  /**
   * Initialize Options.
   */
  const initializeOptions = (): void => {
    const saveButton: HTMLElement = document.getElementById("save");
    saveButton.addEventListener("click", (event: MouseEvent): void => {
      event.preventDefault();
      saveDomains();
    });

    const addButton: HTMLElement = document.getElementById("add");
    addButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      buildInput("empty");
    });

    darkModeCheck();
    loadDomains();
  };

  initializeOptions();
});

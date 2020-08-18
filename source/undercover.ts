/**
 * Undercover Chrome Extension.
 *
 * @format
 */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import 'core-js/modules/es.array.for-each';
import 'core-js/modules/es.array.concat';
import './options.scss';

declare global {
  interface Window {
    chrome: any;
  }
}

interface DomainSelection {
  url: string;
  hide: boolean;
}

document.addEventListener('DOMContentLoaded', (): void => {
  /**
   * Create Field Group.
   */
  const createFieldGroup = (
    domainValue: string,
    hideValue: string
  ): HTMLElement => {
    const optionFieldGroup: HTMLElement = document.createElement('div');
    optionFieldGroup.classList.add('field-group');
    optionFieldGroup.innerHTML =
      '<label>Add Domain</label>' +
      '<input type="text" class="input is-info" value="' +
      domainValue +
      '" />' +
      '<span class="close-button">' +
      '<i class="fas fa-times"></i>' +
      '</span>' +
      '<p>' +
      '<input type="checkbox" class="hide-tab" ' +
      hideValue +
      ' /> Close original non-incognito tab.' +
      '</p>';
    return optionFieldGroup;
  };

  /**
   * Reset Inputs.
   */
  const resetInputs = (): void => {
    const closeButtons: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.close-button'
    );
    [].forEach.call(closeButtons, (closeSpan: HTMLElement): void => {
      closeSpan.addEventListener('click', (): void => {
        closeSpan.parentElement.remove();
      });
    });
  };

  /**
   * Build Input.
   */
  const buildInput = (domain): void => {
    const domainContainer: HTMLElement = document.querySelector(
      '.domain-container'
    );
    const domainValue: string = domain === 'empty' ? '' : domain.url;
    const hideValue: string =
      typeof domain.hide !== 'undefined' && domain.hide ? 'checked' : '';

    if (domainContainer) {
      const fieldGroup = createFieldGroup(domainValue, hideValue);
      domainContainer.appendChild(fieldGroup);
      resetInputs();
    }
  };

  /**
   * Load Domains.
   */
  const loadDomains = (): void => {
    window.chrome.storage.sync.get('domainList', (results) => {
      const { domainList } = results;
      [].forEach.call(domainList, (domain) => {
        buildInput(domain);
      });
      buildInput('empty');
    });
  };

  /**
   * Clear Domains List.
   */
  const clearDomainList = (): void => {
    const fieldGroups: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.field-group'
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
      '.domain-container .field-group'
    );
    const domainArray: Array<DomainSelection> = [];
    [].forEach.call(fieldGroups, (group: HTMLElement): void => {
      const domainName: HTMLInputElement = group.querySelector(
        'input[type=text]'
      );
      const hideTab: HTMLInputElement = group.querySelector(
        'input[type=checkbox]'
      );

      if (domainName !== null && domainName.value !== '') {
        const domainData = {
          url: domainName.value,
          hide: hideTab.checked,
        };
        domainArray.push(domainData);
      }
    });
    window.chrome.storage.sync.set({ domainList: domainArray }, function () {
      if (window.chrome.runtime.error) {
        console.warn('Domains were not saved.');
      } else {
        clearDomainList();
        loadDomains();
      }
    });
  };

  /**
   * Dark Code Check.
   */
  const darkModeCheck = (): void => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      const htmlRoot: HTMLElement = document.getElementsByTagName('html')[0];
      htmlRoot.classList.add('dark-mode');
    }
  };

  /**
   * Initialize Options.
   */
  const initializeOptions = (): void => {
    const saveButton: HTMLElement = document.getElementById('save');
    saveButton.addEventListener('click', (event: MouseEvent): void => {
      event.preventDefault();
      saveDomains();
    });

    const addButton: HTMLElement = document.getElementById('add');
    addButton.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      buildInput('empty');
    });

    darkModeCheck();
    loadDomains();
  };

  initializeOptions();
});

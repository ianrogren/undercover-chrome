/**
 * Undercover Chrome Extension.
 *
 * @format
 */

import 'core-js/modules/es.array.for-each';
import 'core-js/modules/es.array.concat';
import './options.scss';

interface DomainSelection {
  url: string;
  hide: boolean;
}

document.addEventListener('DOMContentLoaded', (): void => {
  /**
   * Create Field Group.
   */
  const createFieldGroup = (domain: DomainSelection): HTMLElement => {
    const optionFieldGroup: HTMLElement = document.createElement('div');
    const hideValue: string =
      typeof domain.hide !== 'undefined' && domain.hide ? 'checked' : '';
    optionFieldGroup.classList.add('field-group');
    optionFieldGroup.innerHTML =
      '<label>Add Domain</label>' +
      '<input type="text" class="input is-info" value="' +
      domain.url +
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
        closeSpan.parentElement?.remove();
      });
    });
  };

  /**
   * Build Input.
   */
  const buildInput = (domain: DomainSelection): void => {
    const domainContainer: HTMLElement | null = document.querySelector(
      '.domain-container'
    );
    if (domainContainer) {
      const fieldGroup = createFieldGroup(domain);
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
      buildInput({ url: '', hide: false });
    });
  };

  /**
   * Clear Domains List.
   */
  const clearDomainList = (): void => {
    const fieldGroups: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.field-group'
    );
    [].forEach.call(fieldGroups, (group: HTMLElement) => {
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
      const domainName: HTMLInputElement | null = group.querySelector(
        'input[type=text]'
      );
      const hideTab: HTMLInputElement | null = group.querySelector(
        'input[type=checkbox]'
      );

      if (domainName && domainName.value !== '' && hideTab) {
        const domainData = {
          url: domainName.value,
          hide: hideTab.checked,
        };
        domainArray.push(domainData);
      }
    });
    window.chrome.storage.sync.set({ domainList: domainArray }, function () {
      clearDomainList();
      loadDomains();
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
      const htmlRoot: HTMLElement | null = document.getElementsByTagName(
        'html'
      )[0];
      htmlRoot.classList.add('dark-mode');
    }
  };

  /**
   * Initialize Options.
   */
  const initializeOptions = (): void => {
    const saveButton: HTMLElement | null = document.getElementById('save');
    if (saveButton) {
      saveButton.addEventListener('click', (event: MouseEvent): void => {
        event.preventDefault();
        saveDomains();
      });
    }

    const addButton: HTMLElement | null = document.getElementById('add');
    if (addButton) {
      addButton.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        buildInput({ url: '', hide: false });
      });
    }

    darkModeCheck();
    loadDomains();
  };

  initializeOptions();
});

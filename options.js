document.addEventListener('DOMContentLoaded', () => {
  /**
   * Build Input.
   */
  const buildInput = (domain) => {
    console.log(domain);
    const domainContainer = document.querySelector('.domain-container');
    const domainValue = domain === 'empty' ? '' : domain.url;
    const hideValue =
      typeof domain.hide !== 'undefined' && domain.hide ? 'checked' : '';
    console.log(hideValue);
    if (domainContainer) {
      const optionFieldGroup = document.createElement('div');
      optionFieldGroup.classList.add('field-group');
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
      domainContainer.appendChild(optionFieldGroup);
      resetInputs();
    }
  };

  /**
   * Reset Inputs.
   */
  const resetInputs = () => {
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach((closeSpan) => {
      closeSpan.addEventListener('click', () => {
        closeSpan.parentNode.remove();
      });
    });
  };

  /**
   * Load Domains.
   */
  const loadDomains = () => {
    chrome.storage.sync.get('domainList', (results) => {
      const { domainList } = results;
      domainList.forEach((domain) => {
        buildInput(domain);
      });
      buildInput('empty');
    });
  };

  /**
   * Clear Domains List.
   */
  const clearDomainList = () => {
    const fieldGroups = document.querySelectorAll('.field-group');
    fieldGroups.forEach((group) => {
      group.remove();
    });
  };

  /**
   * Save Domains.
   */
  const saveDomains = () => {
    const fieldGroups = document.querySelectorAll(
      '.domain-container .field-group'
    );
    const domainArray = [];
    fieldGroups.forEach((group) => {
      const domainName = group.querySelector('input[type=text]').value;
      const hideTab = group.querySelector('input[type=checkbox]').checked;
      if (domainName !== '' && domainName !== null) {
        const domainData = {
          url: domainName,
          hide: hideTab,
        };
        domainArray.push(domainData);
      }
    });
    chrome.storage.sync.set({ domainList: domainArray }, function () {
      if (chrome.runtime.error) {
        console.warn('Domains were not saved.');
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
  const darkModeCheck = () => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      // dark mode
      console.log('darkmode enabled');
      const htmlRoot = document.getElementsByTagName('html')[0];
      htmlRoot.classList.add('dark-mode');
    }
  };

  /**
   * Initialize Options.
   */
  const initializeOptions = () => {
    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', (event) => {
      event.preventDefault();
      saveDomains();
    });

    const addButton = document.getElementById('add');
    addButton.addEventListener('click', () => {
      event.preventDefault();
      buildInput('empty');
    });

    darkModeCheck();
    loadDomains();
  };
  initializeOptions();
});

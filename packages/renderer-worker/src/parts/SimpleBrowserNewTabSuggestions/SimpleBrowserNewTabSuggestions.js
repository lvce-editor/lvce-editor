// Runs inside the isolated new-tab document, which has no Electron or workbench APIs.
export const script = String.raw`(() => {
  const input = document.querySelector('input[name="q"]');
  const form = input.form;
  const list = document.querySelector('#suggestions');
  const callbacks = {};
  window.lvceGoogleSuggestions = callbacks;
  let sequence = 0;
  let timer;
  let cleanup;
  let suggestions = [];
  let selectedIndex = -1;
  let composing = false;

  const dismiss = () => {
    sequence++;
    clearTimeout(timer);
    if (cleanup) cleanup();
    suggestions = [];
    selectedIndex = -1;
    list.replaceChildren();
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  };

  const select = (index) => {
    selectedIndex = index;
    for (let i = 0; i < list.children.length; i++) {
      list.children[i].setAttribute('aria-selected', String(i === index));
    }
    if (index < 0) {
      input.removeAttribute('aria-activedescendant');
    } else {
      const option = list.children[index];
      input.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    }
  };

  const render = (data) => {
    if (!Array.isArray(data) || !Array.isArray(data[1])) return;
    suggestions = [...new Set(data[1].filter((value) => typeof value === 'string' && value.trim()))].slice(0, 7);
    for (const [index, value] of suggestions.entries()) {
      const option = document.createElement('div');
      option.className = 'Suggestion';
      option.id = 'suggestion-' + index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      option.textContent = value;
      option.addEventListener('pointerdown', (event) => {
        if (event.button === 0) event.preventDefault();
      });
      option.addEventListener('click', () => {
        input.value = value;
        dismiss();
        form.requestSubmit();
      });
      list.append(option);
    }
    list.hidden = suggestions.length === 0;
    input.setAttribute('aria-expanded', String(!list.hidden));
  };

  const request = (query, id) => {
    // Google supports JSONP for pages without a privileged network bridge or CORS access.
    const callback = 'r' + id;
    const script = document.createElement('script');
    let timeout;
    const finish = () => {
      clearTimeout(timeout);
      script.remove();
      delete callbacks[callback];
      if (cleanup === finish) cleanup = undefined;
    };
    cleanup = finish;
    callbacks[callback] = (data) => {
      finish();
      if (id !== sequence || input.value.trim() !== query || document.activeElement !== input) return;
      render(data);
    };
    script.src = 'https://suggestqueries.google.com/complete/search?client=chrome&hl=en&q=' + encodeURIComponent(query) + '&callback=lvceGoogleSuggestions.' + callback;
    script.referrerPolicy = 'no-referrer';
    script.onerror = finish;
    script.onload = finish;
    timeout = setTimeout(finish, 5000);
    document.head.append(script);
  };

  const update = () => {
    dismiss();
    const query = input.value.trim();
    if (composing || query.length < 2 || document.activeElement !== input) return;
    const id = sequence;
    timer = setTimeout(() => request(query, id), 150);
  };

  input.addEventListener('input', update);
  input.addEventListener('focus', update);
  input.addEventListener('blur', dismiss);
  input.addEventListener('compositionstart', () => {
    composing = true;
    dismiss();
  });
  input.addEventListener('compositionend', () => {
    composing = false;
    update();
  });
  input.addEventListener('keydown', (event) => {
    if (composing || event.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      dismiss();
    } else if (suggestions.length && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      select(event.key === 'ArrowDown' ? Math.min(selectedIndex + 1, suggestions.length - 1) : Math.max(selectedIndex - 1, -1));
    }
  });
  form.addEventListener('submit', (event) => {
    if (composing) {
      event.preventDefault();
      return;
    }
    if (selectedIndex >= 0) input.value = suggestions[selectedIndex];
    dismiss();
  });
  window.addEventListener('pagehide', dismiss);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) dismiss();
  });
})();`

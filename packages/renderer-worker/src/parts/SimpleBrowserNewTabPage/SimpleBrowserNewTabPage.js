import * as ColorTheme from '../ColorTheme/ColorTheme.js'

const dataUrlPrefix = 'data:text/html;charset=utf-8,'
const marker = '<!--lvce-simple-browser-new-tab-->'
const urlPrefix = `${dataUrlPrefix}${encodeURIComponent(marker)}`

const getCssVariable = (css, name) => {
  const prefix = `--${name}:`
  const start = css.indexOf(prefix)
  if (start === -1) {
    return ''
  }
  const valueStart = start + prefix.length
  const end = css.indexOf(';', valueStart)
  return css.slice(valueStart, end === -1 ? undefined : end).trim()
}

const getColor = (css, names, fallback) => {
  for (const name of names) {
    const value = getCssVariable(css, name)
    if (value) {
      return value
    }
  }
  return fallback
}

const escapeHtml = (value) => {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

const getThemeVariables = (css) => {
  const editorBackground = getColor(css, ['EditorBackground', 'EditorBackGround', 'MainBackground'], '#1c2121')
  const workbenchForeground = getColor(css, ['WorkbenchForeground'], '#f3f5f4')
  const inputBoxBackground = getColor(css, ['InputBoxBackground', 'WidgetBackground'], '#272d2d')
  const inputBoxForeground = getColor(css, ['InputBoxForeground', 'WorkbenchForeground'], workbenchForeground)
  const inputBoxPlaceholderForeground = getColor(css, ['InputBoxPlaceholderForeground', 'DescriptionForeground'], '#9ca5a2')
  const inputBoxBorder = getColor(css, ['InputBoxBorder', 'ContrastBorder'], 'color-mix(in srgb, currentColor 9%, transparent)')
  const focusOutline = getColor(css, ['FocusOutline', 'FocusBorder', 'SplitButtonBackground', 'LinkForeground'], '#8b6df0')
  const widgetBackground = getColor(css, ['WidgetBackground', 'InputBoxBackground'], inputBoxBackground)
  return `
        --EditorBackground: ${escapeHtml(editorBackground)};
        --WorkbenchForeground: ${escapeHtml(workbenchForeground)};
        --InputBoxBackground: ${escapeHtml(inputBoxBackground)};
        --InputBoxForeground: ${escapeHtml(inputBoxForeground)};
        --InputBoxPlaceholderForeground: ${escapeHtml(inputBoxPlaceholderForeground)};
        --InputBoxBorder: ${escapeHtml(inputBoxBorder)};
        --FocusOutline: ${escapeHtml(focusOutline)};
        --WidgetBackground: ${escapeHtml(widgetBackground)};`
}

const getHtml = (colorThemeCss) => `${marker}<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; form-action https://www.google.com">
    <title>New Tab</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--EditorBackground);
        color: var(--WorkbenchForeground);${getThemeVariables(colorThemeCss)}
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        min-width: 260px;
        height: 100%;
        margin: 0;
      }

      body {
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 24%, color-mix(in srgb, var(--FocusOutline) 9%, transparent), transparent 34%),
          var(--EditorBackground);
      }

      main {
        display: flex;
        width: min(680px, calc(100% - 48px));
        margin: 0 auto;
        padding-top: clamp(88px, 21vh, 220px);
        flex-direction: column;
        align-items: center;
        gap: 48px;
      }

      .Brand {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 28px;
        font-weight: 650;
        letter-spacing: -0.6px;
      }

      .BrandMark {
        display: grid;
        width: 52px;
        height: 52px;
        border: 1px solid color-mix(in srgb, var(--WorkbenchForeground) 8%, transparent);
        border-radius: 15px;
        background: linear-gradient(145deg, color-mix(in srgb, var(--FocusOutline) 30%, var(--WidgetBackground)), var(--WidgetBackground));
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.24);
        place-items: center;
      }

      .BrandMark svg {
        width: 34px;
        height: 34px;
      }

      form {
        width: 100%;
      }

      .SearchBox {
        display: flex;
        width: 100%;
        height: 52px;
        padding: 0 18px;
        align-items: center;
        gap: 12px;
        border: 1px solid var(--InputBoxBorder);
        border-radius: 15px;
        background: var(--InputBoxBackground);
        color: var(--InputBoxForeground);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        transition: border-color 120ms ease, box-shadow 120ms ease, background 120ms ease;
      }

      .SearchBox:hover {
        background: color-mix(in srgb, var(--InputBoxBackground) 92%, var(--WorkbenchForeground));
      }

      .SearchBox:focus-within {
        border-color: var(--FocusOutline);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--FocusOutline) 18%, transparent), 0 10px 28px rgba(0, 0, 0, 0.24);
      }

      .SearchIcon {
        width: 19px;
        height: 19px;
        flex: none;
        color: var(--InputBoxPlaceholderForeground);
      }

      input {
        width: 100%;
        min-width: 0;
        border: 0;
        outline: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: 15px;
        user-select: none;
      }

      input::placeholder {
        color: var(--InputBoxPlaceholderForeground);
        opacity: 1;
      }

      input::-webkit-search-cancel-button {
        opacity: 0.65;
      }

      @media (max-height: 500px) {
        main {
          padding-top: 56px;
          gap: 30px;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="Brand" aria-label="LVCE">
        <span class="BrandMark" aria-hidden="true">
          <svg viewBox="0 0 48 48" role="img">
            <defs>
              <linearGradient id="mark" x1="8" y1="5" x2="38" y2="43" gradientUnits="userSpaceOnUse">
                <stop stop-color="var(--FocusOutline)"></stop>
                <stop offset="1" stop-color="var(--FocusOutline)"></stop>
              </linearGradient>
            </defs>
            <path fill="url(#mark)" d="M20 3 30 39 18 46 11 42Z"></path>
          </svg>
        </span>
        <span>LVCE</span>
      </div>
      <form role="search" action="https://www.google.com/search" method="get">
        <label class="SearchBox">
          <svg class="SearchIcon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"></path>
          </svg>
          <input type="search" name="q" aria-label="Search with Google" placeholder="Search with Google" autocomplete="off" spellcheck="false">
        </label>
      </form>
    </main>
  </body>
</html>`

export const getUrl = (colorThemeCss = ColorTheme.getColorThemeCss()) => {
  return `${dataUrlPrefix}${encodeURIComponent(getHtml(colorThemeCss))}`
}

export const url = getUrl()

export const toDisplayUrl = (value) => {
  return value.startsWith(urlPrefix) ? '' : value
}
